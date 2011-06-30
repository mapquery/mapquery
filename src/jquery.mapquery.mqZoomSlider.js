(function($) {
$.template('mqZoomSlider',
    '<div class="mq-zoomslider ui-widget ui-helper-clearfix ">'+
    '<div class="mq-zoomslider-slider"></div>'+    
    '</div>');
        
$.widget("mapQuery.mqZoomSlider", {
    options: {
        // The MapQuery instance
        map: undefined,

    },
    _create: function() {
        var map;
        var zoom;
        var numzoomlevels;
        var self = this;
        var element = this.element;
        
        //get the mapquery object
        if (this.options.jquery === $().jquery) {
            map = this.options.data('mapQuery');
            this.options = {};
        }
        else {
            map = this.options.map.data('mapQuery');
        }
        
        $.tmpl('mqZoomSlider').appendTo(element);
        
        numzoomlevels = map.options.numZoomLevels;
        $(".mq-zoomslider-slider", element).slider({
           max: numzoomlevels,
           step: 1,
           value: map.goto().zoom,
           slide: function(event, ui) {
               
               map.goto({zoom:ui.value});
           }
       });
       map.bind("zoomend",
            {widget:self,map:map,control:element},
            self._onZoomEnd);
       
    },
    _zoomEnd: function (element,map) {
        var slider = element.find('.mq-zoomslider-slider');             
        slider.slider('value',map.goto().zoom);
    },
    _onZoomEnd: function(evt) {
        evt.data.widget._zoomEnd(evt.data.control,evt.data.map);
    }
});
})(jQuery);