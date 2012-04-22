/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

/**
#jquery.mapquery.mqPopup.js
The file containing the mqPopup Widget

### *$('selector')*.`mqPopup([options])`
_version added 0.1_
####**Description**: create a popup at a click on a feature

 + **options:**
  - **map**: the mapquery instance
  - **contents**: A function that returns HTML to be put into the popup.
  It has one argument, which is the OpenLayers feature that was selected.
  - **title**: Title that will be displayed at the top of the feature
  info (default: Feature popup)
  - **padding**: Padding (in px) around the popup when it needs to be
  panned in (default 10)

>Returns: widget


The mqPopup widget allows us to show a popup next to a feature. It will pan with
the feature.


      $('#popup').mqPopup({
        map: '#map',
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
      });

 */
(function($) {
$.template('mqPopup',
    '<div class="mq-popup ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'+
    '<span class="ui-dialog-title">${title}</span>'+
    '<a class="ui-dialog-titlebar-close ui-corner-all" href="#">'+
    '<span class="ui-icon ui-icon-closethick">close</span></a>'+
    '</div>' +
    '<div" class="ui-dialog-content ui-widget-content">{{html contents}}</div>');
// Parts of the code were inspired by the code from GeoExt
// (http://geoext.org/) which is licensed under BSD license
$.widget("mapQuery.mqPopup", {
    options: {
        // The MapQuery instance
        map: undefined,

        // A function that returns HTML to be put into the popup.
        // It has one argument, which is the OpenLayers feature that
        // was selected.
        contents: undefined,

        // Title that will be displayed at the top of the popup
        title: "Feature Popup",

        // Padding (in px) around the popup when it needs to be panned in
        padding: 10
    },
    _create: function() {
        var map;
        var self = this;

        this.element.addClass('ui-dialog ui-widget ui-widget-content ' +
                              'ui-corner-all');

        map = $(this.options.map).data('mapQuery');
        map.bind('featureselected', {widget: self}, self._onFeatureselected);
        map.bind('featureunselected', {widget: self}, self._onFeatureunselected);
        map.bind("move", {widget: self}, self._onMove);
    },
    _destroy: function() {
        this.element.removeClass('ui-dialog ui-widget ui-widget-content ' +
                                 'ui-corner-all')
            .empty();
    },
    _onFeatureselected: function(evt, layer, feature) {
        var map = this;
        var self = evt.data.widget;
        var element = self.element;
        var contents = self.options.contents.call(self.options, feature);

        // save position so that the popup can be moved with the feature
        self.lonLat = $.MapQuery.getFeaturePosition(feature);

        element.html($.tmpl('mqPopup', {
            title: self.options.title,
            contents: contents
        })).find('a.ui-dialog-titlebar-close').bind('click', function() {
            element.hide();
            self.lonLat = null;
            feature.unselect();
        });

        var pixels = map.pixelsFromPosition(self.lonLat[0], self.lonLat[1]);
        element.show(0, function() {
            $(this).css('z-index', layer.zIndex()+1000);
            self._setPosition(map, pixels);
        });

        // if the popup is outside of the view, pan in
        var xoffset = map.element.outerWidth() -
            (pixels[0] + element.outerWidth()) - self.options.padding;
        var yoffset = element.outerHeight() - pixels[1] + self.options.padding;
        map.pan(xoffset < 0 ? -xoffset : 0, yoffset > 0 ? -yoffset : 0);
    },
    _onFeatureunselected: function(evt) {
        var self = evt.data.widget;
        self.element.hide();
        self.lonLat = null;
    },
    _onMove: function(evt) {
        var map = this;
        var self = evt.data.widget;

        if (!self.lonLat) {
            return;
        }

        var pixels = map.pixelsFromPosition(self.lonLat[0], self.lonLat[1]);
        if (pixels!==null) {
            self.element.show();
            self._setPosition(map, pixels);
        }
        else {
            self.element.hide();
        }
    },
    _setPosition: function(map, pos) {
        this.element.position({
            my: "left bottom",
            at: "left top",
            of: map.element,
            offset: pos[0] + ' ' + pos[1],
            collision: 'none'
        });
    }
});
})(jQuery);
