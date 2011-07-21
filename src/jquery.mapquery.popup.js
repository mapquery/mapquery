/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

/**
#jquery.mapquery.popup.js
A plugin on mapquery.core to add a popup to the map, attached to a layer.
 */

(function($, MQ) {
$.extend(MQ.Map.prototype, {
    // Returns the current screen pixel position of a specific position.
    // It returns either an array with x and y or null if it is outside
    // of the current viewport
/**
###**map**.`pixelsFromPosition(x, y)`
_version added 0.1_
####**Description**: get the position in viewport pixels from a coordinate

**x**: the x-coordinate in map-projection
**y**: the y-ccordinate in map-projection

>Returns: [x,y] in viewport pixels


The `.pixelsFromPosition()` function allows us to get the position of a point
on the map in pixels on the screen. Useful for putting a DOM element at a point
in the map. If the coordinate is outside the current view, it will return null;


     var pos = map.pixelsFromPosition(5,52) //get the pixel-position of Amsterdam

 */
    pixelsFromPosition: function(x, y) {
        var pos;
        var lonLat = new OpenLayers.LonLat(x, y);
        var visible = this.olMap.getExtent().containsLonLat(lonLat);
        if (visible) {
            pos = this.olMap.getViewPortPxFromLonLat(lonLat);
            return [Math.round(pos.x), Math.round(pos.y)];
        }
        return null;
    },
/**
###**map**.`pan(dx, dy)`
_version added 0.1_
####**Description**: pan the map smoothly by a certain amount of pixels

**dx**: the x-coordinate in pixels
**dy**: the y-ccordinate in pixels

>Returns: nothing


The `.pan()` function allows us to move the map by a certain amount of pixels.


      map.pan(100,200) //pan the map 100 pixels right and 200 up

 */
    // Pans the map smoothly by a certain amount of pixels
    pan: function(dx, dy) {
        this.olMap.pan(dx, dy);
    }
});
$.extend(MQ.Layer.prototype, {
/**
###**layer**.`zindex()`
_version added 0.1_
####**Description**: get the z-index of the current layer


>Returns: z-index (integer)


The `.zIndex()` function allows us to get the z-index of the current layer.


      var z= layer.zIndex()

 */
    zIndex: function() {
        return this.olLayer.getZIndex();
    },
    //TODO: write docs
    unselectFeature: function(feature) {
        this.map.selectFeatureControl.unselect(feature);
    }
});
$.extend(MQ, {
    // Returns the position (lon/lat) of an OpenLayers feature as an array
    //TODO: write docs
    getFeaturePosition: function(feature) {
        var lonLat = feature.geometry.getCentroid().getBounds()
            .getCenterLonLat();
        return [lonLat.lon, lonLat.lat];
    }
});
})(jQuery, $.MapQuery);
