/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqMousePosition',
    '<div class="mq-mouseposition ui-widget ui-helper-clearfix ">'+
    '<span class="ui-widget-content ui-helper-clearfix ui-corner-all ui-corner-all">'+
    '<div id="mq-mouseposition-x" class="mq-mouseposition-coordinate">'+
    '</div><div id="mq-mouseposition-y" class="mq-mouseposition-coordinate">'+
    '</div></div></span>');

$.widget("mapQuery.mqMousePosition", {
    options: {
        // The MapQuery instance
        map: undefined,

        // The number of decimals for the coordinates
        // default: 2
    // TODO: JCB20110630 use dynamic precision based on the pixel
    // resolution, no need to configure precision
        precision: 2,

        // The label of the x-value
        // default: 'x'
        x: 'x',
        // The label of the y-value
        // default: 'y'
        y: 'y'

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        var mousepos;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        map.bind("mousemove",
            {widget:self,map:map},
            self._onMouseMove);


        $.tmpl('mqMousePosition',{
            mouseposition:mousepos
        }).appendTo(element);

    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    _mouseMoved: function(data, element, map) {
        var x = data.layerX;
        var y = data.layerY;
        var mapProjection = map.options.projection;
        var displayProjection = map.options.projection;
        //if the coordinates should be displayed in something else,
    //set them via the map displayProjection option
        var pos = map.olMap.getLonLatFromLayerPx(new OpenLayers.Pixel(x,y));
        if(map.options.displayProjection) {
            displayProjection = map.options.displayProjection;
            pos=pos.transform(
        new OpenLayers.Projection(mapProjection),
        new OpenLayers.Projection(displayProjection));
        }
        $("#mq-mouseposition-x", element).html(
        this.options.x+': '+pos.lon.toFixed(this.options.precision));
        $("#mq-mouseposition-y", element).html(
        this.options.y+': '+pos.lat.toFixed(this.options.precision));
    },

    _onMouseMove: function(evt, data) {
        evt.data.widget._mouseMoved(data,evt.data.control,evt.data.map);
    }
});
})(jQuery);
