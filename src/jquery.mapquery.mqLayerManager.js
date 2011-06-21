(function($) {
$.template('mqLayerManager',
    '<div class="mq-layermanager ui-widget ui-helper-clearfix ">'+
    '</div>');

$.template('mqLayerManagerElement',
    '<div class="mq-layermanager-element">'+
    '<div class="mq-layermanager-element-header"><div class="mq-layermanager-label">${label}</div></div>'+
    '<div class="mq-layermanager-element-content">'+
        '<div class="mq-layermanager-element-visibility">'+
            '<input type="checkbox" class="mq-layermanager-visibility" id="${id}-visibility" checked="${visible}" />'+
            '<div class="mq-layermanager-slider"></div>'+
        '</div>'+
    '</div>'+
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
        
        var lmElement = $.tmpl('mqLayerManager').appendTo(element);
        
        
        $.each(map.layers().reverse(), function(){
           self._add(lmElement, this); 
        });
        
        element.delegate('.mq-layermanager-visibility', 'change', function() {
            var checkbox = $(this);
            var layer = checkbox.parents('.mq-layermanager-element').data('layer');
            checkbox.attr('checked') ? layer.visible(true) : layer.visible(false);
            checkbox.attr('checked') ? checkbox.siblings('.mq-layermanager-slider').slider('value',(layer.opacity()*100)) : checkbox.siblings('.mq-layermanager-slider').slider('value',0) ;
            //checkbox.siblings('.mq-layermanager-slider').slider('value',50) ;
        });
        

    },
    
    _add: function(element, layer) {
        var layerElement = $.tmpl('mqLayerManagerElement',{
            id: layer.id,
            label: layer.label,
            position: layer.position(),
            visible: layer.visible()
        })
            // save layer layer in the DOM, so we can easily
            // hide/show/delete the layer with live events
            .data('layer', layer)
            .appendTo(element);
            
       $(".mq-layermanager-slider", layerElement).slider({
           max: 100,
           step: 1,
           value: 100,
           slide: function(event, ui) {
               var layer = layerElement.data('layer');
               layer.opacity(ui.value/100);
           },
           change: function(event, ui) {
           }
       });
    },
    
    _removeLayer: function() {
        
    }
});
})(jQuery);