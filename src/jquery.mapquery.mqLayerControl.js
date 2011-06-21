(function($) {
$.template('mqLayerControl',
    '<li class="mq-layercontrol ui-widget-content ui-helper-clearfix ui-corner-all">'+
    '<span><div class="ui-icon ui-icon-arrowthick-2-n-s"></div><div class="mq-layercontrol-label">${label}</div>' +
    '<button class="mq-layercontrol-delete">Delete</button>' +
    '<input type="checkbox" class="mq-layercontrol-visibility" id="${id}-visibility" checked="${visible}" />'+
    '<label for="${id}-visibility">Visible</label></span>'+
    '</li>');
        
$.widget("mapQuery.mqLayerControl", {
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        
        if (this.options.jquery === $().jquery) {
            map = this.options.data('mapQuery');
            this.options = {};
        }
        else {
            map = this.options.map.data('mapQuery');
        }
        element.append('<ul class=" ui-widget"></ul>');
        var ulElement = element.children('ul');
        $.each(map.layers().reverse(), function() {
            self._add(ulElement, this);
        });
        
        element.find('button').button();
        ulElement.sortable({
            axis:'y',
            containment: 'parent',
            update: function(event, ui) {
                var layerNodes = ui.item.siblings().andSelf();
                var num = layerNodes.length-1;
                layerNodes.each(function(i) {
                    var layer = $(this).data('layer');
                    var pos = num-i;
                    var label = $('span.label', this);
                    var icon = label.children();
                    layer.position(pos);
                    label.text(layer.label)
                        .prepend(icon);
                });
            }
        });

        // bind events for the layer controls
        element.delegate('.mq-layercontrol-visibility', 'change', function() {
            var checkbox = $(this);
            var layer = checkbox.parents('li').data('layer');
            checkbox.attr('checked') ? layer.visible(true) : layer.visible(false);
        });

        element.delegate('button', 'click', function() {
            var control = $(this).parents('li');
            control.data('layer').remove();
            control.fadeOut(function() {
                $(this).remove();
            });
        });
    },
    _add: function(element, layer) {
        //$.tmpl('mqLayerControl', layer)
        // We don't need to pass in the whole layer object
        $.tmpl('mqLayerControl', {
            id: layer.id,
            label: layer.label,
            position: layer.position(),
            visible: layer.visible()
        })
            // save layer layer in the DOM, so we can easily
            // hide/show/delete the layer with live events
            .data('layer', layer)
            .prependTo(element);
    }
});
})(jQuery);