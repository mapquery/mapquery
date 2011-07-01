(function($) {
$.template('mqPopup',
    '<div class="mq-popup ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">' +
    '<span class="ui-dialog-title">${title}</span>' +
    '<a class="ui-dialog-titlebar-close ui-corner-all" href="#"><span class="ui-icon ui-icon-closethick">close</span></a>' +
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
        var element = this.element;
        
        //get the mapquery object
        map = $(this.options.map).data('mapQuery');
        
        var layers = $.map(map.layers(), function(layer) {
            return layer.isVector ? layer : null;
        });

        $.each(layers, function() {
            var layer = this;
            layer.bind("featureselected",
                {widget: self, map: map, layer: layer},
                self._onFeatureselected);
            layer.bind("featureunselected",
                {widget: self},
                self._onFeatureunselected);
        });
        this.element.addClass('ui-dialog ui-widget ui-widget-content ' +
                              'ui-corner-all');
        map.bind("move", {widget: self, map: map}, self._onMove);
    },
    _destroy: function() {
        this.element.removeClass('ui-dialog ui-widget ui-widget-content ' +
                                 'ui-corner-all')
            .empty();
    },
    _onFeatureselected: function(evt, data) {
        var self = evt.data.widget;
        var map = evt.data.map;
        var layer = evt.data.layer;
        var element = self.element;
        var contents = self.options.contents.call(this, data.feature);

        // save position so that the popup can be moved with the feature
        self.lonLat = $.MapQuery.getFeaturePosition(data.feature);

        var pixels = map.pixelsFromPosition(self.lonLat[0], self.lonLat[1]);
        element.show(0, function() {
            $(this).css('z-index', layer.zIndex()+1000);
            self._setPosition(map, pixels);
        });


        element.html($.tmpl('mqPopup', {
            title: self.options.title,
            contents: contents
        })).find('a.ui-dialog-titlebar-close').bind('click', function() {
            element.hide();
            self.lonLat = null;
            layer.unselectFeature(data.feature);
        });

        // if the popup is outside of the view, pan in
        var xoffset = map.element.outerWidth() -
            (pixels[0] + element.outerWidth()) - self.options.padding;
        var yoffset = element.outerHeight() - pixels[1] + self.options.padding;
        map.pan(xoffset < 0 ? -xoffset : 0, yoffset > 0 ? -yoffset : 0);
    },
    _onFeatureunselected: function(evt, data) {
        var self = evt.data.widget;
        self.element.hide();
        self.lonLat = null;
    },
    _onMove: function(evt, data) {
        var self = evt.data.widget;
        var map = evt.data.map;

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
