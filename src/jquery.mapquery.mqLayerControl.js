/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


/**
#jquery.mapquery.mqLayerControl.js
The file containing the mqLayerControl Widget

### *$('selector')*.`mqLayerControl([options])`
_version added 0.1_
####**Description**: create a widget to control the order of layers

 + **options**:
  - **map**: the mapquery instance

>Returns: widget


The mqLayerControl allows us to control the order and visibility of layers. We
can also remove layers. **Note**: the mqLayerManager widget does this and more.
It is likely that the two will be merged in the future


     $('#layercontrol').mqLayerControl({
        map: '#map'
     });

 */

(function($) {
$.template('mqLayerControl',
    '<li id="mq-layercontrol-${id}" class="mq-layercontrol ui-widget-content ui-helper-clearfix ui-corner-all">'+
    '<span><div class="ui-icon ui-icon-arrowthick-2-n-s"></div>'+
    '<div class="mq-layercontrol-label">${label}</div>' +
    '<button class="mq-layercontrol-delete">Delete</button>' +
    '<input type="checkbox" class="mq-layercontrol-visibility" id="${id}-visibility" checked="${visible}" />'+
    '<label for="${id}-visibility">Visible</label></span>'+
    '</li>');

$.widget("mapQuery.mqLayerControl", {
    options: {
        // The MapQuery instance
        map: undefined

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        element.append('<ul class=" ui-widget"></ul>');
        var ulElement = element.children('ul');
        $.each(map.layers().reverse(), function() {
            self._add(ulElement, this);
        });

        element.find('button').button();
        ulElement.sortable({
            axis:'y',

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
            var vis = checkbox.attr('checked') ? true : false;
            layer.visible(vis);
        });

        element.delegate('button', 'click', function() {
            var control = $(this).parents('li');
            self._remove(control.data('layer').id);
        });

         //binding events
        map.bind("mqAddLayer",
            {widget:self,map:map,control:ulElement},
            self._onLayerAdd);

        map.bind("mqRemoveLayer",
            {widget:self},
            self._onLayerRemove);
    },
    _destroy: function() {
        this.element.removeClass('ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
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
    },

    _onLayerAdd: function(evt, layer) {
        evt.data.widget._add(evt.data.control,layer);
    },

    // if _remove is called from the mqRemoveLayer event it means that the
    // layer is already removed, so set removed to true
    _remove: function(id, removed) {
         var controlId = "#mq-layercontrol-"+id;
         var control = $(controlId);
         if(!removed){ control.data('layer').remove();}
         control.fadeOut(function() {
            $(this).remove();
         });
    },

    _onLayerRemove: function(evt, id) {
        evt.data.widget._remove(id,true);
    }

});
})(jQuery);
