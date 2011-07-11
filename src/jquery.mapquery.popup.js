/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license. 
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */
 
(function($, MQ) {
$.extend(MQ.Map.prototype, {
    // Returns the current screen pixel position of a specific position.
    // It returns either an array with x and y or null if it is outside
    // of the current viewport
    pixelsFromPosition: function(lon, lat) {
        var pos;
        var lonLat = new OpenLayers.LonLat(lon, lat);
        var visible = this.olMap.getExtent().containsLonLat(lonLat);
        if (visible) {
            pos = this.olMap.getViewPortPxFromLonLat(lonLat);
            return [Math.round(pos.x), Math.round(pos.y)];
        }
        return null;
    },
    // Pans the map smoothly by a certain amount of pixels
    pan: function(x, y) {
        this.olMap.pan(x, y);
    }
});
$.extend(MQ.Layer.prototype, {
    zIndex: function() {
        return this.olLayer.getZIndex();
    },
    unselectFeature: function(feature) {
        this.map.selectFeatureControl.unselect(feature);
    }
});
$.extend(MQ, {
    // Returns the position (lon/lat) of an OpenLayers feature as an array
    getFeaturePosition: function(feature) {
        var lonLat = feature.geometry.getCentroid().getBounds()
            .getCenterLonLat();
        return [lonLat.lon, lonLat.lat];
    }
});
})(jQuery, $.MapQuery);
