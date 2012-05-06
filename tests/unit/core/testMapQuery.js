/*
 * geoMap unit tests
 */
(function($) {

module('mapQuery');

// Compares two arrays with floats (must have the same size)
var equalsFloatArray = function (a, b, msg, precision) {
    if (a.length!=b.length) {
        throw('Arrays must have the same size');
    }
    var aFixed = [];
    var bFixed = [];
    for (var i=0; i<a.length; i++) {
        aFixed.push(a[i].toFixed(precision));
        bFixed.push(b[i].toFixed(precision));
    }
    same(aFixed, bFixed, msg);
};

// Convert the first array from floats to ints, to compare it with the
// second array which is ints only
var equalsIntArray = function (a, b, msg) {
    var aInts = [];
    for (var i=0; i<a.length; i++) {
        aInts.push(parseInt(a[i].toFixed(0)));
    }
    same(aInts, b, msg);
};


test("constructor", function() {
    expect(1);

    var mapElement = $('#map').mapQuery();
    ok(mapElement.data('mapQuery').layers, "Layers function exists");
});

// NOTE: This test needs an internet connecion
test("create only one instance", function() {
    expect(2);

    var map = $('#map').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMS',
        label: 'World',
        url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
        layers: 'basic'
    });
    equals(map.layersList.mapquery_0.id, 'mapquery_0', 'Layer was added');
    map = $('#map').mapQuery().data('mapQuery');
    equals(map.layersList.mapquery_0.id, 'mapquery_0', 'Layers are still there');
});

test("WMTS layer parses URL correctly", function() {
    expect(6);

    var map = $('#map_wmts').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery_0.olLayer.layer, 'NE1_HR_LC_SR_W_DR',
           'layer is correct');
    equals(map.layersList.mapquery_0.olLayer.matrixSet, '10m',
           'matrixSet is correct');
    equals(map.layersList.mapquery_0.olLayer.style, 'default',
           'style is correct');
    equals(map.layersList.mapquery_0.olLayer.url,
           '../../../demo/data/wmts', 'url is correct');

    map.layers({
        type: 'WMTS',
        label: 'naturalearth2',
        url: 'http://example.com/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery_1.olLayer.url,
           'http://example.com/wmts', 'Remote URL is parsed correctly');

    map.layers({
        type: 'WMTS',
        label: 'naturalearth3',
        url: 'http://usr:passwd@example.com/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery_2.olLayer.url,
           'http://usr:passwd@example.com/wmts',
           'Remote URL with username and password is parsed correctly');
});

test("WMTS layer sets paramters for spherical mercator correctly", function() {
    expect(5);

    var map = $('#map_wmts2').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
        sphericalMercator: true
    });
    equals(map.layersList.mapquery_0.olLayer.maxExtent.toString(),
           '-20037508.3392,-20037508.3392,20037508.3392,20037508.3392',
           'maxExtent was set');
    equals(map.layersList.mapquery_0.olLayer.maxResolution, 156543.0339,
           'maxResolution was set');
    equals(map.layersList.mapquery_0.olLayer.projection, 'EPSG:900913',
           'projection was set');
    equals(map.layersList.mapquery_0.olLayer.units, 'm',
           'units was set');

    map = $('#map_wmts3').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
        numZoomLevels: 3,
        sphericalMercator: true
    });
    equals(map.layersList.mapquery_0.olLayer.numZoomLevels, 3,
           'Number of zoom level is set correctly even if ' +
           '"sphericalMercator" is to true');

});

// NOTE: This test needs an internet connecion
test("OSM layer can be created", function() {
    expect(1);

    var map = $('#map_osm').mapQuery().data('mapQuery');
    map.layers({
        type: 'OSM',
        label: 'OpenStreetMap'
    });
    ok(map.layersList.mapquery_0.olLayer.attribution.indexOf('OpenStreetMap')!==-1,
       'OpenStreetMap layer was loaded (attribution is there)');
});
test("Google layer can be created (works only with dev-build of openlayers)", function() {
    expect(1);

    var map = $('#map_google').mapQuery().data('mapQuery');
    map.layers({
        type: 'google',
        view: 'road'
    });
    ok(map.layersList.mapquery_0.olLayer.type=='roadmap',
       'Google layer was loaded (type is roadmap)');
});
test("Bing layer can be created", function() {
    expect(1);

    var map = $('#map_bing').mapQuery().data('mapQuery');
    map.layers({
        type:'bing',view:'satellite',key:'ArAGGPJ16xm0RXRbw27PvYc9Tfuj1k1dUr_gfA5j8QBD6yAYMlsAtF6YkVyiiLGn'
    });
    ok(map.layersList.mapquery_0.olLayer.name=="Bing Aerial",
       'Bing layer was loaded (name is Bing Aerial)');
});
test("Add layers on initialisation", function() {
    expect(3);
    var mapDom = $('#map_init').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        }]
    });
    var map = mapDom.data("mapQuery");
    equals(map.layersList.mapquery_0.label, 'naturalearth', 'Layer was added');

    var mapDom2 = $('#map_init2').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        },{
            type: 'WMS',
            label: 'World',
            url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
            layers: 'basic'
        }]
    });
    var map2 = mapDom2.data("mapQuery");
    equals(map2.layersList.mapquery_0.label, 'naturalearth',
           'Layer1 was added');
    equals(map2.layersList.mapquery_1.label, 'World', 'Layer2 was added');
});

test("Go to a certain position on initialisation", 2, function() {
    var mq = $('#map_init_center').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        }],
        center: {
            position: [-20, 30],
            zoom: 2
        }
    }).data('mapQuery');
    var center = mq.center();
    equals(center.zoom, 2, 'Got to the right zoom level');
    equalsIntArray(center.position, [-20, 30], 'Got to the right position');
});

test("center works properly (EPSG:900913)", function() {
    expect(30);

    var maps = [
        // this is EPSG:900913
        $('#map_center').mapQuery({layers: [{
            type: 'OSM',
            label: 'OpenStreetMap'
        }]}),
        // this is EPSG:4326
        $('#map_center2').mapQuery({layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
        }]})
    ];

    for (var i=0; i<maps.length; i++) {
        var map = maps[i].data('mapQuery');

        // position

        map.center({position: [10.898333, 48.371667]});
        var center = map.center();
        equalsFloatArray(center.position, [10.898333, 48.371667],
            'Setting the position only', 6);
        map.center({position: [4.892222, 52.373056]});
        center = map.center();
        equalsFloatArray(center.position, [4.892222, 52.373056],
            'Setting the position only (2)', 5);
        map.center({position: [4.892222, 52.373056], zoom: 5});
        map.center({position: [4.892222, 52.373056], zoom: 7});
        map.center({position: [10.898333, 48.371667]});
        center = map.center();
        equals(center.zoom, 7,
            'Setting the position only, keep the current zoom level');

        // zoom

        map.center({position: [10.898333, 48.371667], zoom: 5});
        map.center({zoom: 3});
        center = map.center();
        equalsFloatArray(center.position, [10.898333, 48.371667],
            'Setting the zoom only (position is right)', 6);
        equals(center.zoom, 3, 'Setting the zoom only (zoom is right)');

        // position + zoom

        map.center({position: [10.898333, 48.371667], zoom: 6});
        center = map.center();
        equalsFloatArray(center.position, [10.898333, 48.371667],
            'Setting the position and zoom (position is right)', 6);
        equals(center.zoom, 6,
            'Setting the position and zoom (zoom is right)');
        map.center({position: [4.892222, 52.373056], zoom: 4});
        center = map.center();
        equalsFloatArray(center.position, [4.892222, 52.373056],
            'Setting the position and zoom (position is right) (2)', 6);
        equals(center.zoom, 4, 'Setting the position and zoom ' +
            '(zoom is right) (2)');

        // box

        map.center({box: [4.892222, 48.371667, 10.898333, 52.373056]});
        center = map.center();
        // The extend will be fit in to the nearest zoom level, hence
        // the box given, doesn't match the final one
        // same(center.box, [-21.962936669741, 20.514147330259, 37.753491669741,
        //                80.230575669741],
        //     'Setting box only (position is right)');
        equalsFloatArray(center.position, [7.895277, 50.414584],
            'Setting box only (position is right)');

        equals(center.zoom, 4, 'Setting box only (zoom is right)');

        // ignore position or zoom settings
        map.center({position: [-22.566667, 17.15], zoom: 9});
        center = map.center();
        equalsFloatArray(center.position, [-22.566667, 17.15],
            'Reset position to somewhere outside of the box we\'ll set');
        equals(center.zoom, 9,
            'Reset position to somewhere outside of the box we\'ll set ' +
            '(zoom)');
        map.center({box: [4.892222, 48.371667, 10.898333, 52.373056],
                  position: [135, -25], zoom: 7});
        center = map.center();
        // The extend will be fit in to the nearest zoom level, hence
        // the box given, doesn't match the final one
        console.log(center.box);
        equalsFloatArray(center.position, [7.8952775000002, 50.414584408364],
            'Setting box only (position is right)');
        equals(center.zoom, 4,
            'Setting box only (zoom is right)');
    }
});

test('Test that bind() works', 8, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    var testFn = function() {
        ok(true, 'custom event was triggered');
        // using `equals` won't work here because of to much recursion
        ok(this === mq, '`this` is map object');
    };

    mq.bind('customevent', testFn);

    mq.bind('customevent-multiple-binds', testFn);
    mq.bind('customevent-multiple-binds', testFn);
    mq.bind('customevent-multiple-binds', testFn);

    mq.bind('customevent-that was not triggered', testFn);

    mq.trigger('customevent');
    mq.trigger('customevent-multiple-binds');
});

test('Test that bind() works with data', 12, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    var testFn = function(evt) {
        // using `equals` won't work here because of to much recursion
        ok(this === mq, '`this` is map object');
        equals(evt.data.contains, 'data', 'bound with data (a)');
        equals(evt.data.really, true, 'bound with data (b)');
    };

    mq.bind('customevent-bind-data',
            {contains: 'data', really: true}, testFn);

    mq.bind('customevent-bind-data-multiple',
            {contains: 'data', really: true}, testFn);
    mq.bind('customevent-bind-data-multiple',
            {contains: 'data', really: true}, testFn);
    mq.bind('customevent-bind-data-multiple',
            {contains: 'data', really: true}, testFn);

    mq.trigger('customevent-bind-data');
    mq.trigger('customevent-bind-data-multiple');
});

test('Test that bind() works with object syntax', 4, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    var testFn = function() {
        ok(true, 'custom event was triggered');
        // using `equals` won't work here because of to much recursion
        ok(this === mq, '`this` is map object');
    };

    mq.bind({
        customevent: testFn,
        anothercustomevent: testFn
    });

    mq.trigger('customevent');
    mq.trigger('anothercustomevent');
});

test('Test that bind() works with binding to multiple events', 4, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('customevent anothercustomevent', function() {
        ok(true, 'custom event was triggered');
        // using `equals` won't work here because of to much recursion
        ok(this === mq, '`this` is map object');
    });

    mq.trigger('customevent');
    mq.trigger('anothercustomevent');
});

// NOTE vmx 20120304: Enable this test once we use jQuery 1.7
/*
test('Test that bind() works with object syntax and data', 4, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    var testFn = function(evt) {
        // using `equals` won't work here because of to much recursion
        ok(this === mq, '`this` is map object');
        equals(evt.data.contains, 'data', 'bound with data (a)');
        equals(evt.data.really, true, 'bound with data (b)');
    };

    mq.bind({
        customevent: testFn,
        anothercustomevent: testFn
    }, {contains: 'data', really: true});

    mq.trigger('customevent');
    mq.trigger('anothercustomevent');
});
*/

// A duplication of the basic bind() tests on the map object are not needed,
// as layers use the same function
test('Test that bind() works on the layer', 2, function() {
    var mq = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];

    layer.bind('customevent', function() {
        ok(true, 'custom event was triggered');
        // using `equals` won't work here because of to much recursion
        ok(this === layer, '`this` is layer object');
    });

    layer.trigger('customevent');
});

test('Test that trigger() works', 1, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('customevent', function() {
        ok(true, 'custom event was triggered');
    });

    mq.trigger('customevent');
});

test('Test that trigger() works with data', 3, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('customevent', function(evt, data, bool, number) {
        equals(data, 'data', 'trigger contained data (string)');
        ok(bool, 'trigger contained data (boolean)');
        equals(number, 5.7, 'trigger contained data (number)');
    });

    mq.trigger('customevent', ['data', true, 5.7]);
});

asyncTest("GeoJSON layer gets loaded correctly 2", 1, function() {
    var mq = $('#map_geojson').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    }).data('mapQuery');

    mq.layers()[0].bind('layerloadend', function(evt) {
        var olLayer = this.olLayer;
        equals(olLayer.features.length, 2, "Number of features is correct");
        start();
    });
});

asyncTest("GeoJSON layer gets loaded correctly (JSONP)", 1, function() {
    var mq = $('#map_geojson_jsonp').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Public Schools',
            url: 'http://max.ic.ht/sf_public_schools/_design/geo/_rewrite/data?bbox=-123,37.72,-121,37.75'
        }
    }).data('mapQuery');
    var layers = mq.layers();

    mq.layers()[0].bind('layerloadend', function(evt) {
        var olLayer = this.olLayer;
        equals(olLayer.features.length, 47, "Number of features is correct");
        start();
    });
});

test("Layer events are bound to the map object as well", 2, function() {
    var mq = $('#map_events').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];
    layer.bind('layerloadend', function(evt) {
        var feature = this.olLayer.features[0];
        this.olLayer.events.triggerEvent('featureselected', {feature: feature});
    });

    stop();
    layer.bind('featureselected', function() {
        ok(true, 'Feature selected event was fired on the Layer object');
        start();
    });
    stop();
    mq.bind('featureselected', function() {
        ok(true, 'Feature selected event was fired on the Map object');
        start();
    });
});

test('The addlayer event is triggered after MapQuery did the heavy lifting', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('addlayer', function(evt, layer) {
        // Check if the layer was added to the SelectFeature Control, to make
        // sure MapQuery did what it is supposed to do
        var wasAdded = false;
        for (var i=0; i<mq.selectFeatureControl.layers.length; i++) {
            if(mq.selectFeatureControl.layers[i].id===layer.olLayer.id) {
                wasAdded = true;
                break;
            }
        }
        ok(wasAdded, 'layer was added correctly prior to the event');
    });

    mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    });
    mq.layers({
        type: 'JSON',
        label: 'Polygons2',
        url: '../../../demo/data/poly.json'
    });
});

test('The removelayer event is triggered after MapQuery did the heavy lifting', 1, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('removelayer', function(evt, layer) {
        // Check if the layer was removed from the SelectFeature Control, to
        // make sure MapQuery did what it is supposed to do
        var wasRemoved = true;
        for (var i=0; i<mq.selectFeatureControl.layers.length; i++) {
            if(mq.selectFeatureControl.layers[i].id===layer.olLayer.id) {
                wasRemoved = false;
                break;
            }
        }
        ok(wasRemoved, 'layer was removed correctly prior to the event');
    });

    var layer1 = mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    });
    var layer2 = mq.layers({
        type: 'JSON',
        label: 'Polygons2',
        url: '../../../demo/data/poly.json'
    });

    layer2.remove();
});

test('Test that the preaddlayer event works', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind({
        preaddlayer: function(evt) {
            ok(true, 'preaddlayer event was fired');
        },
        addlayer: function(evt, layer) {
            equals(mq.layers().length, 1, 'layer was added');
        }
    });

    mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
});

test('Test that cancelling the preaddlayer event works', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind({
        preaddlayer: function(evt) {
            ok(true, 'preaddlayer event was fired');
            return false;
        },
        addlayer: function(evt, layer) {
            // Shouldn't be triggered
            ok(true, 'layer should not be added, as preaddlayer ' +
               'returned false');
        }
    });

    mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });

    equals(mq.layers().length, 0, "layer wasn't added");
});

test('Test that the preremovelayer event works', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind({
        preremovelayer: function(evt, layer) {
            // using `equals` won't work here because of to much recursion
            ok(mq.layers()[0] === layer, 'correct layer was included');
        },
        removelayer: function(evt, layer) {
            equals(mq.layers().length, 0, 'layer was removed');
        }
    });

    var layer = mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });

    layer.remove();
});

test('Test that cancelling the preremovelayer event works', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind({
        preremovelayer: function(evt, layer) {
            // using `equals` won't work here because of to much recursion
            ok(mq.layers()[0] === layer, 'correct layer was included');
            return false;
        },
        removelayer: function(evt, layer) {
            // Shouldn't be triggered
            ok(true, 'layer should not be removed, as preremovelayer ' +
               'returned false');
        }
    });

    var layer = mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });

    layer.remove();
    equals(mq.layers().length, 1, "layer wasn't removed");
});

test('Test that all move events on the map work', 4, function() {
    var mq = $('#map').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
        }],
        center: {position: [130,-70]}
    }).data('mapQuery');

    mq.bind('movestart', function() {
        var position = this.center().position;
        equalsIntArray(position, [130, -70],
            'Position is still the original one');
    });

    mq.bind('move', function() {
        var position = this.center().position;
        equalsIntArray(position, [20, 50], 'Position was updated');
    });

    mq.bind('moveend', function() {
        var position = this.center().position;
        equalsIntArray(position, [20, 50], 'Position is still the new one');
    });

    mq.bind('zoomend', function() {
        var position = this.center().position;
        equalsIntArray(position, [20, 50], 'Position is still the new one');
    });

    var position = mq.center().position;
    equalsIntArray(position, [130, -70], 'Initial position was set correctly');
    mq.center({position: [20, 50]});
});

test('Test that zoomend event on the map works', 2, function() {
    var mq = $('#map').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
        }],
        center: {zoom: 6}
    }).data('mapQuery');


    mq.bind('zoomend', function() {
        equals(this.center().zoom, 3, 'zoom was updated correctly');
    });

    equals(mq.center().zoom, 6, 'Initial zoom was set correctly');
    mq.center({zoom: 3});
});

test('Test that changelayer event works on the Map object', 3, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind({
        changelayer: function(evt, layer, property) {
            switch(property) {
            case 'position':
                // using `equals` won't work here because of to much recursion
                // The layer (former at position [1]) is now at the top, due
                // to the position change
                ok(mq.layers()[0] === layer,
                   'correct layer for position change');
                break;
            case 'opacity':
                // using `equals` won't work here because of to much recursion
                ok(mq.layers()[0] === layer,
                   'correct layer for opacity change');
                break;
            case 'visibility':
                // using `equals` won't work here because of to much recursion
                ok(mq.layers()[0] === layer,
                   'correct layer for visibility change');
                break;
            }
        }
    });

    var layers = mq.layers([{
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    },{
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    }]);

    layers[0].opacity(0.4);
    layers[0].visible(false);
    layers[1].position(5);
});

asyncTest('Test that the load* events on the Map Object', 2, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    mq.bind('layerloadstart', function(evt, layer) {
            ok(true, 'loadstart event was fired');
            start();
    });
    stop();
    mq.bind('layerloadend', function(evt, layer) {
        ok(true, 'layerloadend event was fired');
        start();
    });

    mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
});


// There is no test for the `addlayer` event on the layer object
// as you currently can't bind an event before the layer was added


test('Test that removelayer event works on the Layer object', 2, function() {
    var mq = $('#map').mapQuery({layers: {
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    }}).data('mapQuery');

    var layer = mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    }).bind('removelayer', function(evt) {
        // using `equals` won't work here because of to much recursion
        var layers = mq.layers();
        equals(layers.length, 1, 'layer was removed');
        ok(this.map.layers()[0] !== this, 'correct layer was removed');
    }).remove();
});

// There is no test for the `loadstart` event on the layer object
// as you currently can't bind before it gets triggered

asyncTest('Test that the layerloadend event on the layer works', 1, function() {
    var mq = $('#map').mapQuery().data('mapQuery');

    var layer = mq.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    }).bind('layerloadend', function() {
        // using `equals` won't work here because of to much recursion
        ok(mq.layers()[1] === this, 'correct layer for layerloadend event');
        start();
    });

    mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    });
});


// Tests for features

test('Add a feature manually to the layer', 2, function() {
    var mq = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            strategies: null
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];

    equals(layer.olLayer.features.length, 0, 'No features on the map');
    layer.features({
        geometry: {type: 'Point', coordinates: [34.2, 20.4]},
        properties: {foo: 'bar'}
    });
    equals(layer.olLayer.features.length, 1, 'Feature was added to map');
});

test('Add multiple features manually to the layer', 2, function() {
    var mq = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            strategies: null
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];

    equals(layer.olLayer.features.length, 0, 'No features on the map');
    layer.features([{
        geometry: {type: 'Point', coordinates: [34.2, 20.4]},
        properties: {foo: 'bar'}
    },{
        geometry: {type: 'LineString', coordinates: [[34.2, 20.4], [63.1, 5]]},
        properties: {anotherProp: true}
    },{
        geometry: {type: 'Point', coordinates: [5, 7.4]},
        properties: {
            some: 'more',
            properties: 34,
            thisTime: false
        }
    }]);
    equals(layer.olLayer.features.length, 3, 'Features were added to map');
});

test('Return manually added features', 5, function() {
    var mq = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            strategies: null
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];

    equals(layer.olLayer.features.length, 0, 'No features on the map');
    layer.features([{
        geometry: {type: 'Point', coordinates: [34.2, 20.4]},
        properties: {foo: 'bar'}
    },{
        geometry: {type: 'LineString', coordinates: [[34.2, 20.4], [63.1, 5]]},
        properties: {anotherProp: true}
    },{
        geometry: {type: 'Point', coordinates: [5, 7.4]},
        properties: {
            some: 'more',
            properties: 34,
            thisTime: false
        }
    }]);
    equals(layer.olLayer.features.length, 3, 'Features were added to map');

    var features = layer.features();
    equals(features[1].properties.anotherProp, true,
           'Feature properties were correctly retreived');
    equals(features[2].geometry.type, 'Point',
           'Feature geometry type was correctly retreived');
    same(features[2].geometry.coordinates, [5, 7.4],
         'Feature geometry coordinates was correctly retreived');
});

test('Remove manually added features', 6, function() {
    var mq = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            strategies: null
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];

    equals(layer.olLayer.features.length, 0, 'No features on the map');
    layer.features([{
        geometry: {type: 'Point', coordinates: [34.2, 20.4]},
        properties: {foo: 'bar'}
    },{
        geometry: {type: 'LineString', coordinates: [[34.2, 20.4], [63.1, 5]]},
        properties: {anotherProp: true}
    },{
        geometry: {type: 'Point', coordinates: [5, 7.4]},
        properties: {
            some: 'more',
            properties: 34,
            thisTime: false
        }
    }]);
    equals(layer.features().length, 3, 'All features were added to map');

    var features = layer.features();
    features[1].remove();

    equals(layer.features().length, 2, 'One features was removed');

    // Check if other features are still there
    features = layer.features();
    equals(features[0].properties.foo, 'bar',
           'Feature properties were correctly retreived');
    equals(features[1].geometry.type, 'Point',
           'Feature geometry type was correctly retreived');
    same(features[1].geometry.coordinates, [5, 7.4],
         'Feature geometry coordinates was correctly retreived');

    console.log(features);
});

test('Select feature: event triggering', 4, function() {
    var mq = $('#map').mapQuery({
        layers: [{
            type: 'JSON',
            strategies: null,
            label: 'Layer 1'
        }]
    }).data('mapQuery');

    var layer = mq.layers()[0];

    layer.features({
        geometry: {type: 'Point', coordinates: [34.2, 20.4]},
        properties: {foo: 'bar'}
    });


    var features = layer.features();

    layer.bind('featureselected', function(evt, feature) {
        ok(true, 'featureselected event was fired on the layer');
        equals(feature.properties.foo, 'bar', 'it is the correct feature (a)');
        start();
    });

    mq.bind('featureselected', function(evt, layer, feature) {
        ok(true, 'featureselected event was fired on the map');
        equals(feature.properties.foo, 'bar', 'it is the correct feature (b)');
        start();
    });

    features[0].select();
    stop();
});

test('Select feature: was really selected', 2, function() {
    var mq = $('#map').mapQuery({
        layers: [{
            type: 'JSON',
            strategies: null,
            label: 'Layer 1'
        }]
    }).data('mapQuery');

    var layer = mq.layers()[0];

    layer.features([{
        geometry: {type: 'LineString', coordinates: [[34.2, 20.4], [63.1, 5]]},
        properties: {anotherProp: true}
    },{
        geometry: {type: 'Point', coordinates: [5, 7.4]},
        properties: {
            some: 'more',
            properties: 34,
            thisTime: false
        }
    }]);


    var features = layer.features();

    layer.bind('featureselected', function(evt, feature) {
        equals(feature.olFeature.renderIntent, 'select',
               'Feature was selected (layer event)');
        start();
    });

    mq.bind('featureselected', function(evt, layer, feature) {
        equals(feature.olFeature.renderIntent, 'select',
               'Feature was selected (map event)');
        start();
    });

    features[0].select();
    stop();
});


test('Test event dispatching', 4, function() {
    // The assertions for the layers should should run once each
    // The assertions for the map should run twice

    var mq = $('#map').mapQuery({
        layers: [{
            type: 'JSON',
            strategies: null,
            label: 'Layer 1'
        },{
            type: 'JSON',
            strategies: null,
            label: 'Layer 2'
        }]
    }).data('mapQuery');

    var layer1 = mq.layers()[0];
    var layer2 = mq.layers()[1];

    layer1.bind('customevent', function() {
        ok(true, 'customevent event was fired on the Layer 1');
        start();
    });
    layer2.bind('customevent', function() {
        ok(true, 'customevent event was fired on the Layer 2');
        start();
    });

    mq.bind('customevent', function() {
        ok(true, 'customevent event was fired on the map');
        start();
    });

    layer1.trigger('customevent');
    layer2.trigger('customevent');
    stop();
});

test('Test event dispatching with extra data', 9, function() {
    var mq = $('#map').mapQuery({
        layers: [{
            type: 'JSON',
            strategies: null,
            label: 'Layer 1'
        }]
    }).data('mapQuery');

    var layer = mq.layers()[0];

    layer.bind('customevent', function(evt, somedata, num, bool, notused) {
        equals(somedata, 'somedata', 'Correct data was included (a, layer)');
        equals(num, 100, 'Correct data was inclued (b, layer)');
        ok(bool, 'Correct data was inclued (c, layer)');
        equals(notused, undefined, 'Correct data was inclued (d, layer)');
        start();
    });


    mq.bind('customevent', function(evt, evtLayer, somedata, num, bool,
                                    notused) {
        // using `equals` won't work here because of to much recursion
        ok(evtLayer === layer, 'Correct data was included (a, map)');
        equals(somedata, 'somedata', 'Correct data was included (b, map)');
        equals(num, 100, 'Correct data was inclued (c, map)');
        ok(bool, 'Correct data was inclued (d, map)');
        equals(notused, undefined, 'Correct data was inclued (e, map)');
        start();
    });

    layer.trigger('customevent', ['somedata', 100, true]);
    stop();
});

})(jQuery);
