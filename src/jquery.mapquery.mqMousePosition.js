(function($) {
$.template('mqMousePosition',
    '<div class="mq-mouseposition ui-widget ui-helper-clearfix ">'+
    '<div class="ui-widget-content ui-helper-clearfix ui-corner-all ui-corner-all"><div id="mq-mouseposition-projection"></div><div id="mq-mouseposition-x"></div><div id="mq-mouseposition-y"></div></div>'+
    '</div>');
        
$.widget("mapQuery.mqMousePosition", {
    _create: function() {
        var map;       

        var self = this;
        var element = this.element;
        var mousepos;
        //get the mapquery object
        if (this.options.jquery === $().jquery) {
            map = this.options.data('mapQuery');
            this.options = {};
        }
        else {
            map = this.options.map.data('mapQuery');
        }
        
        map.bind("mousemove",
            {widget:self,map:map},
            self._onMouseMove);

        
        $.tmpl('mqMousePosition',{
            mouseposition:mousepos
        }).appendTo(element);
       
    },
    _onMouseMove: function(evt, data) {
        var self = evt.data.widget;
        var element = self.element;
        
        var x = data.layerX;
        var y = data.layerY;
        var map = evt.data.map;
        var mapProjection = map.options.projection;
        var displayProjection = map.options.projection;
        //if the coordinates should be displayed in something else, set them via the map displayProjection option
        if(map.options.displayProjection) {
            displayProjection = map.options.displayProjection; 
        }
        var pos = map.olMap.getLonLatFromLayerPx(new OpenLayers.Pixel(x,y));
        pos=pos.transform(new OpenLayers.Projection(mapProjection),new OpenLayers.Projection(displayProjection));        
        $("#mq-mouseposition-x", element).html('x: '+pos.lon);
        $("#mq-mouseposition-y", element).html('y: '+pos.lat);
    }
});
})(jQuery);