/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

/**
#jquery.mapquery.mqFeatureInfo.js
The file containing the mqFeatureInfo Widget

### *$('selector')*.`mqFeatureInfo([options])`
_version added 0.1_
####**Description**: create a widget to show feature information

 + **options**
  - **map**: the mapquery instance
  - **contents**: A function that returns HTML to be put into the popup.
  It has one argument, which is the OpenLayers feature that was selected.
  - **title**: Title that will be displayed at the top of the feature
  info (default: Feature information)

>Returns: widget


The mqFeatureInfo widget allows us to display the information
of a selected feature.


     $('#featureinfo').mqFeatureInfo({
        map: '#map',
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
     });

 */
(function($) {
$.template('mqFeatureInfo',
    '<div class="mq-featureinfo ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">' +
    '<span class="ui-dialog-title">${title}</span>' +
    '</div>' +
    '<div" class="ui-dialog-content ui-widget-content">{{html contents}}</div>');
$.widget("mapQuery.mqFeatureInfo", {
    options: {
        // The MapQuery instance
        map: undefined,

        // A function that returns HTML to be put into the popup.
        // It has one argument, which is the OpenLayers feature that
        // was selected.
        contents: undefined,

        // Title that will be displayed at the top of the feature info
        title: "Feature information"
    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        var layers = $.map(map.layers(), function(layer) {
            return layer.isVector ? layer : null;
        });

        $.each(layers, function() {
            var layer = this;
            layer.bind("featureselected", {widget: self},
                       self._onFeatureselected);
            layer.bind("featureunselected", {widget: self},
                       self._onFeatureunselected);
        });
        this.element.addClass('ui-dialog ui-widget ui-widget-content ' +
                              'ui-corner-all');

    },
    _destroy: function() {
        this.element.removeClass('ui-dialog ui-widget ui-widget-content ' +
                                 'ui-corner-all')
            .empty();
    },
    _onFeatureselected: function(evt, data) {
        var self = evt.data.widget;
        var element = self.element;
        var contents = self.options.contents.call(this, data.feature);

        element.html($.tmpl('mqFeatureInfo', {
            title: self.options.title,
            contents: contents
        }));
    },
    _onFeatureunselected: function(evt, data) {
        var self = evt.data.widget;
        self.element.empty();
    }
});
})(jQuery);
