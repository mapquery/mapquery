(function($) {
$.template('mqLayerManager',
    '<div class="mq-layermanager ui-widget ui-helper-clearfix ">'+
    '</div>');

$.template('mqLayerManagerElement',
    '<div class="mq-layermanager-element">'+
    '</div>');
            
$.widget("mapQuery.mqLayerManager", {
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
        
        $.tmpl('mqLayerManager').appendTo(element);
        
    },
    
    _addLayer: function() {
        
    },
    
    _removeLayer: function() {
        
    }
});
})(jQuery);