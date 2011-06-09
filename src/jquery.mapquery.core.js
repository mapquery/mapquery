(function ($) {
var Map = function(element, options) {
    var self = this;
    this.options = $.extend({}, new $.fn.mapQuery.defaults.map(), options);

    this.element = element;
    this.olMap = new OpenLayers.Map(this.element[0], this.options);
    this.defaultProjection = new OpenLayers.Projection(
        this.options.defaultProjection);
    // Keep IDs of vector layer for select feature control
    this.vectorLayers = [];
    this.selectFeatureControl = null;

    element.data('mapQuery', this);
    this.layersList = {};

    // To bind and trigger jQuery events
    this.events = $({});
    // create triggers for all OpenLayers map events
    var events = {};
    $.each(this.olMap.EVENT_TYPES, function(i, evt) {
        events[evt] = function() {
            self.events.trigger(evt, arguments);
        };
    });
    this.olMap.events.on(events);
};

Map.prototype = {
    // NOTE vmx: I haven't created an "addLayer" method, as I saw this
    //     comparable with jQuery's $.data().
    // NOTE dw: $.data allows you to modify existing structures,
    //      this one doesn't
    layer: function(options) {
        if ( typeof options === "string" ) {
            return this.layersList[options];
        }
        else {
            return this._addLayer(options);
        }
    },
    layers: function(id, options) {
        //var o = $.extend({}, options);
        switch(arguments.length) {
        case 0:
            return this._allLayers();
        case 1:
            return this.layersList[id];
        case 2:
            return this._addLayer(id, options);
        default:
            throw('wrong argument number');
        };
    },
    // Returns all layers as an array, sorted by there order in the map. First
    // element in the array is the topmost layer
    _allLayers: function() {
        var layers = [];
        $.each(this.layersList, function(id, layer) {
            var item = [layer.position(), layer];
            layers.push(item);
        });
        var sorted = layers.sort( function compare(a, b) {
            return a[0] - b[0];
        });
        var result = $.map(sorted, function(item) {
            return item[1];
        });
        return result.reverse();
    },
    _addLayer: function(id, options) {
        var layer = new Layer(this, id, options);
        this.layersList[id] = layer;
        if (layer.isVector) {
            this.vectorLayers.push(id);
        }
        this._updateSelectFeatureControl(this.vectorLayers);
        return layer;
    },
    _removeLayer: function(id) {
        // remove id from vectorlayer if it is there list
        this.vectorLayers = $.grep(this.vectorLayers, function(elem) {
            return elem != id;
        });
        this._updateSelectFeatureControl(this.vectorLayers);
        delete this.layersList[id];
        // XXX vmx: shouldn't the layer be destroyed() properly?
        return this;
    },
    //This WILL NOT work without a baseLayer or allOverlays == true
    center: function(x, y, z){
        var mapProjection;
        var point = new OpenLayers.LonLat(x, y);

        if( !isNaN(x + y + z)) {
            mapProjection = this.olMap.getProjectionObject();
            if (!mapProjection.equals(this.defaultProjection)) {
                point.transform(this.defaultProjection, mapProjection);
            }
            else {
                point = new OpenLayers.LonLat(x, y);
            }
            this.olMap.setCenter(point, z);
        }
        return this;
    },
    _updateSelectFeatureControl: function(layerIds) {
        var vectorLayers = [];
        var layersList = this.layersList;
        if (this.selectFeatureControl!==null) {
            this.selectFeatureControl.deactivate();
            this.selectFeatureControl.destroy();
        }
        $.each(layerIds, function() {
            vectorLayers.push(layersList[this].olLayer);
        });
        this.selectFeatureControl = new OpenLayers.Control.SelectFeature(
            vectorLayers);
        this.olMap.addControl(this.selectFeatureControl);
        this.selectFeatureControl.activate();
    },
    bind: function() {
        this.events.bind.apply(this.events, arguments);
    },
    one: function() {
        this.events.one.apply(this.events, arguments);
    },
    destroy: function() {
        this.olMap.destroy();
        this.element.removeData('mapQuery');
    }
};

var Layer = function(map, id, options) {
    var self = this;
    // apply default options that are not specific to a layer

    this.id = id;
    this.label = options.label || this.id;
    // a reference to the map object is needed as it stores e.g. the list
    // of all layers (and we need to keep track of it, if we delete a
    // layer)
    this.map = map;

    // true if this layer is a vector layer
    this.isVector = false;

    // to bind and trigger jQuery events
    this.events = $({});

    // create the actual layer based on the options
    // Returns layer and final options for the layer (for later re-use,
    // e.g. zoomToMaxExtent).
    var res = Layer.types[options.type.toLowerCase()].call(this, options);
    this.olLayer = res.layer;
    options = res.options;

    // create triggers for all OpenLayers layer events
    var events = {};
    $.each(this.olLayer.EVENT_TYPES, function(i, evt) {
        events[evt] = function() {
            self.events.trigger(evt, arguments);
        };
    });
    this.olLayer.events.on(events);

    this.map.olMap.addLayer(this.olLayer);
    if (options.zoomToMaxExtent) {
        this.map.olMap.zoomToMaxExtent();
    }
};

$.extend(Layer, {
    types: {
        wms: function(options) {
            var o = $.fn.mapQuery.defaults.layer.all;
            $.extend(true, o, $.fn.mapQuery.defaults.layer.raster);
            $.extend(true, o, options);
            var params = {
                layers: o.layers,
                transparent: o.transparent
            };
            return {
                layer: new OpenLayers.Layer.WMS(o.label, o.url, params),
                options: o
            };
        },
        json: function(options) {
            var o = $.fn.mapQuery.defaults.layer.all;
            $.extend(true, o, $.fn.mapQuery.defaults.layer.vector);
            $.extend(true, o, options);
            this.isVector = true;
            var strategies = [];
            for (var i in o.strategies) {
                switch(o.strategies[i].toLowerCase()) {
                case 'bbox':
                    strategies.push(new OpenLayers.Strategy.BBOX()); break;
                case 'cluster':
                    strategies.push(new OpenLayers.Strategy.Cluster()); break;
                case 'filter':
                    strategies.push(new OpenLayers.Strategy.Filter()); break;
                case 'fixed':
                    strategies.push(new OpenLayers.Strategy.Fixed()); break;
                case 'paging':
                    strategies.push(new OpenLayers.Strategy.Paging()); break;
                case 'refresh':
                    strategies.push(new OpenLayers.Strategy.Refresh()); break;
                case 'save':
                    strategies.push(new OpenLayers.Strategy.Save()); break;
                }
            }
            var params = {
                maxExtent: new OpenLayers.Bounds.fromArray(o.maxExtent),
                protocol: new OpenLayers.Protocol.HTTP({
                    url: o.url,
                    format: new OpenLayers.Format.GeoJSON()
                }),
                strategies: strategies
            };
            return {
                layer: new OpenLayers.Layer.Vector(o.label, params),
                options: o
            };
        },
        osm: function(options) {
            var o = $.fn.mapQuery.defaults.layer.all;
            $.extend(true, o, $.fn.mapQuery.defaults.layer.osm);
            $.extend(true, o, options);
            return {
                layer: new OpenLayers.Layer.OSM(options),
                options: o
            };
        },
        wmts: function(options) {
            var o = $.fn.mapQuery.defaults.layer.all;
            $.extend(true, o, $.fn.mapQuery.defaults.layer.wmts);
            if (options.sphericalMercator===true) {
                $.extend(true, o, {
                    maxExtent: new OpenLayers.Bounds(
                        -128 * 156543.0339, -128 * 156543.0339,
                        128 * 156543.0339, 128 * 156543.0339),
                    maxResolution: 156543.0339,
                    numZoomLevels: 19,
                    projection: 'EPSG:900913',
                    units: 'm'
                });
            }
            $.extend(true, o, options);
            // use by default all options that were passed in for the final
            // openlayers layer consrtuctor
            var params = $.extend(true, {}, o);

            // remove trailing slash
            if (params.url.charAt(params.url.length-1)==='/') {
                params.url = params.url.slice(0, params.url.length-1);
            }
            // if no options that influence the URL where set, extract them
            // from the given URL
            if (o.layer===undefined && o.matrixSet===undefined &&
                    o.style===undefined) {
                var url = $.MapQuery.util.parseUri(params.url);
                var urlParts = url.path.split('/');
                var wmtsPath = urlParts.slice(urlParts.length-3);
                params.url = url.protocol ? url.protocol + '://' : '';
                params.url += url.authority +
                    // remove WMTS version (1.0.0) as well
                    urlParts.slice(0, urlParts.length-4).join('/');
                params.layer = wmtsPath[0];
                params.style = wmtsPath[1];
                params.matrixSet = wmtsPath[2];
            }
            return {
                layer: new OpenLayers.Layer.WMTS(params),
                options: o
            };
        },
        //Not sure this one is worth pursuing works with ecwp:// & jpip:// urls
        //See ../lib/NCSOpenLayersECWP.js
        ecwp: function(options) {
            var o = $.fn.mapQuery.defaults.layer.all;
            $.extend(true, o, $.fn.mapQuery.defaults.layer.raster);
            $.extend(true, o, options);
            return {
                layer: new OpenLayers.Layer.ECWP(o.label, o.url, o),
                options: o
            };
        }
    }
});

Layer.prototype = {
    down: function(delta) {
        delta = delta || 1;
        this.map.olMap.raiseLayer(this.olLayer, -delta);
        return this;
    },
    // NOTE vmx: this would be pretty cool, but it's not easily possible
    // you could use $.each($.geojq.layer())) instead, this is for pure
    // convenience.
    each: function () {},
    hide: function() {
        this.olLayer.setVisibility(false);
        return this;
    },
    // will return the map object
    remove: function() {
        this.map.olMap.removeLayer(this.olLayer);
        // remove references to this layer that are stored in the
        // map object
        return this.map._removeLayer();
    },
    position: function(pos) {
        if (pos===undefined) {
            return this.map.olMap.getLayerIndex(this.olLayer);
        }
        else {
            return this.map.olMap.setLayerIndex(this.olLayer, pos);
        }
    },
    show: function() {
        this.olLayer.setVisibility(true);
        return this;
    },
    up: function(delta) {
        delta = delta || 1;
        this.map.olMap.raiseLayer(this.olLayer, delta);
        return this;
    },
    visible: function() {
        return this.olLayer.getVisibility();
    },
    // every event gets the layer passed in
    bind: function() {
        this.events.bind.apply(this.events, arguments);
    },
    one: function() {
        this.events.one.apply(this.events, arguments);
    }
};

$.fn.mapQuery = function(options) {
    return this.each(function() {
        var instance = $.data(this, 'mapQuery');
        if (!instance) {
            $.data(this, 'mapQuery', new Map($(this), options));
        }
    });
};

// default options for the map and layers
$.fn.mapQuery.defaults = {
    // The controls for the map are per instance, therefore it need to
    // be an function that can be initiated per instance
    map: function() {
        return {
            // Remove quirky moveTo behavior, probably not a good idea in the
            // long run
            allOverlays: true,
            controls: [
                new OpenLayers.Control.Navigation({documentDrag: true}),
                new OpenLayers.Control.PanZoom(),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution()
            ],
            format: 'image/png',
            // input (e.g. for .center()) will be automatically transformed
            // if map has a different projection (from this proejction to the
            // one of the map)
            defaultProjection: 'EPSG:900913'
        };
    },
    layer: {
        all: {
            zoomToMaxExtent: true
        },
        raster: {
            // options for raster layers
            transparent: true
        },
        vector: {
            // options for vector layers
            strategies: ['fixed']
        },
        osm: {
            isBaseLayer: false
        },
        wmts: {
            format: 'image/jpeg',
            requestEncoding: 'REST',
            sphericalMercator: false
        }
    }
};

// Some utility functions

$.MapQuery = {};
$.MapQuery.util = {};
// http://blog.stevenlevithan.com/archives/parseuri (2010-12-18)
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
$.MapQuery.util.parseUri = function (str) {
    var o = $.MapQuery.util.parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};
$.MapQuery.util.parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user",
            "password", "host", "port", "relative", "path", "directory",
            "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
};
})(jQuery);
