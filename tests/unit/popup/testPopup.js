/*
 * Popup unit tests
 */
(function($) {
module('popup');

asyncTest("Popup is shown", 1, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });

    // There is no easy way to determine the moment when the popup
    // is really opened. As monkey patching doesn't work with the
    // widget factory (does anyone know why?) we just create a new
    // widget, that triggers an event, once the _onFeatureselected
    // function is done.
    $.widget("mapQuery.mqPopupTest", $.mapQuery.mqPopup, {
        _onFeatureselected: function() {
            this._superApply("_onFeatureselected", arguments);
            $('#popup').trigger('justfortestingpurpose');
        }
    });

    var popup = $('#popup').mqPopupTest({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    var layer = mq.layers()[0];
    $('#popup').bind('justfortestingpurpose', function(evt, feature) {
        equals($('#popup').find('p').length, 1, 'Popup contains data');
        start();
    });
    layer.bind('layerloadend', function(evt) {
        var feature = this.features()[0];
        feature.select();
    });
});

asyncTest("Popup outside of the map moves in", 1, function() {
    var map = $('#map').mapQuery({
        projection: 'EPSG:4326',
        maxExtent: [0, -90, 160, 90]});


    $('#popup').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    var layer = mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    });

    layer.bind('layerloadend', function(evt) {
        var feature = this.features()[1];
        var pos1 = mq.olMap.getViewPortPxFromLonLat(
            feature.olFeature.geometry.getCentroid().getBounds()
                .getCenterLonLat());
        // open popup
        feature.select();

        mq.bind('moveend', function() {
            var pos2 = mq.olMap.getViewPortPxFromLonLat(
                feature.olFeature.geometry.getCentroid().getBounds()
                    .getCenterLonLat());
            ok(pos1.x != pos2.x || pos1.y != pos2.y, 'Map moved');
            start();
      });
    });
});

// NOTE vmx 2012-04-22: This test fails with OpenLayers 2.11 due to a bug
asyncTest("Hide popup when moved outside of map (and show it again)", 2, function() {
    var map = $('#map').mapQuery({
        projection: 'EPSG:4326',
        maxExtent: [0, -120, 160, 90]
    });

    var mq = map.data('mapQuery');
    mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    }).bind('layerloadend', function(evt) {
        var feature = this.features()[0];
        var pos1 = mq.olMap.getViewPortPxFromLonLat(
            feature.olFeature.geometry.getCentroid().getBounds()
                .getCenterLonLat());
        var isVisible = null;

        // open the popup
        feature.select();

        mq.bind('moveend', function() {
            // first pan
            if (isVisible===null) {
                isVisible = $('#popup').is(':visible');

                // pan map back down => popup should appear again
                mq.olMap.pan(0, -160, {animate: false});
            }
            // second pan
            else {
                ok(isVisible===false, 'Popup gets hidden');
                ok($('#popup').is(':visible')===true, 'Popup is shown again');
                start();
            }
        });

        // pan map up a lot => popup is hidden
        mq.olMap.pan(0, 160, {animate: false});
    });
    $('#popup').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });
});

asyncTest("Unselect feature when popup is closed", 2, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });
    var popup = $('#popup').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('layerloadend', function(evt) {
        var feature = this.features()[0];
        // open the popup
        feature.select();

        ok($('#popup').is(':visible')===true, 'Popup is visible');

        $('#popup a.ui-dialog-titlebar-close').trigger('click');
        ok($('#popup').is(':visible')===false, 'Popup is hidden');
        start();
    });
});

asyncTest("Close popup when feature gets unselected", 2, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });
    var popup = $('#popup').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('layerloadend', function(evt) {
        var feature = this.features()[0];
        // open popup
        feature.select();
        ok($('#popup').is(':visible')===true, 'Popup is visible');

        // close popup
        feature.unselect();
        ok($('#popup').is(':visible')===false, 'Popup is hidden');
        start();
    });
});

})(jQuery);
