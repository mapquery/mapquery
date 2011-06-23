(function($) {
$.template('mqLayerManager',
    '<div class="mq-layermanager ui-widget ui-helper-clearfix ">'+
    '</div>');

$.template('mqLayerManagerElement',
    '<div class="mq-layermanager-element" id="mq-layermanager-element-${id}">'+
    '<div class="mq-layermanager-element-header"><div class="mq-layermanager-label">${label}</div><span class="ui-icon ui-icon-closethick">&nbsp;</span></div>'+
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
        element.find('.ui-icon-closethick').button();
        
        lmElement.sortable({
            axis:'y',
            containment: 'parent',
            update: function(event, ui) {
                var layerNodes = ui.item.siblings().andSelf();
                var num = layerNodes.length-1;
                layerNodes.each(function(i) {
                    var layer = $(this).data('layer');
                    var pos = num-i;                   
                    layer.position(pos);                   
                });
            }
        });

        
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
        
        element.delegate('.ui-icon-closethick', 'click', function() {
            var control = $(this).parents('.mq-layermanager-element');            
            self._remove(control.data('layer').id);
        });
        
        //binding events
        map.bind("mqAddLayer",
            {widget:self,map:map,control:lmElement},
            self._onLayerAdd);

        map.bind("mqRemoveLayer",
            {widget:self},
            self._onLayerRemove);
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
            .prependTo(element);
            
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
    
    _onLayerAdd: function(evt, layer) {
        evt.data.widget._add(evt.data.control,layer);
    },
    
    // if _remove is called from the mqRemoveLayer event it means that the layer is already removed, so set removed to true
    _remove: function(id, removed) {
         var controlId = "#mq-layermanager-element-"+id;
         var control = $(controlId);
         removed ? true : control.data('layer').remove();
         control.fadeOut(function() {
            $(this).remove();
         });
    },
    
    _onLayerRemove: function(evt, id) {
        evt.data.widget._remove(id,true);
    }
    
});
})(jQuery);