/*
 * Popup unit tests
 */
(function($) {
module('popup');

asyncTest("Popup is shown", 1, function() {
    var map = $('#map1').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });
    var popup = $('#popup1').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('loadend', function(evt, data) {
        var layer = data.object;
        var feature = data.object.features[0];
        layer.events.triggerEvent('featureselected', {feature: feature});
        start();
        equals($('#popup1').find('p').length, 1, 'Popup contains data');

        mq.destroy();
        popup.empty();
    });
});

asyncTest("Popup outside of the map moves in", 1, function() {
    var map = $('#map2').mapQuery({projection:'EPSG:4326',maxExtent: [0, -90, 160, 90]});
    var mq = map.data('mapQuery');
    mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    }).bind('loadend', function(evt, data) {
        var layer = data.object;
        var feature = data.object.features[1];
        var pos1 = mq.olMap.getViewPortPxFromLonLat(
                feature.geometry.getCentroid().getBounds().getCenterLonLat());
        layer.events.triggerEvent('featureselected', {feature: feature});

        mq.one('moveend', function() {
            var pos2 = mq.olMap.getViewPortPxFromLonLat(
                    feature.geometry.getCentroid().getBounds()
                    .getCenterLonLat());
            start();
            ok(pos1.x != pos2.x || pos1.y != pos2.y, 'Map moved');

            mq.destroy();
            $('#popup2').empty();
      });
    });

    $('#popup2').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
    });

});

asyncTest("Hide popup when moved outside of map (and show it again)", 2, function() {
    var map = $('#map3').mapQuery({projection:'EPSG:4326',maxExtent: [0, -120, 160, 90]});
    var mq = map.data('mapQuery');
    mq.layers({
        type: 'JSON',
        label: 'Polygons',
        url: '../../../demo/data/poly.json'
    }).bind('loadend', function(evt, data) {
        var layer = data.object;
        var feature = data.object.features[0];
        var pos1 = mq.olMap.getViewPortPxFromLonLat(
                feature.geometry.getCentroid().getBounds().getCenterLonLat());
        layer.events.triggerEvent('featureselected', {feature: feature});

        mq.one('moveend', function() {
            var isVisible = $('#popup3').is(':visible');

            mq.one('moveend', function() {
                start();
                ok(isVisible===false, 'Popup gets hidden');
                ok($('#popup3').is(':visible')===true, 'Popup is shown again');
            });

            // pan map back down => popup should appear again
            mq.olMap.pan(0, -160, {animate: false});
        });

        // pan map up a lot => popup is hidden
        mq.olMap.pan(0, 160, {animate: false});

        mq.destroy();
        $('#popup3').empty();
    });

    $('#popup3').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
    });
});

asyncTest("Unselect feature when popup is closed", 2, function() {
    var map = $('#map4').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });
    var popup = $('#popup4').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('loadend', function(evt, data) {
        var layer = data.object;
        var feature = data.object.features[0];
        layer.events.triggerEvent('featureselected', {feature: feature});
        start();
        ok($('#popup4').is(':visible')===true, 'Popup is visible');

        $('#popup4 a.ui-dialog-titlebar-close').trigger('click');
        ok($('#popup4').is(':visible')===false, 'Popup is hidden');

        mq.destroy();
        popup.empty();
    });
});

asyncTest("Close popup when feature gets unselected", 2, function() {
    var map = $('#map4').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        },
        projection:'EPSG:4326',
        maxExtent: [0, -90, 160, 90]
    });
    var popup = $('#popup5').mqPopup({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.data.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('loadend', function(evt, data) {
        var layer = data.object;
        var feature = data.object.features[0];
        layer.events.triggerEvent('featureselected', {feature: feature});
        start();
        ok($('#popup5').is(':visible')===true, 'Popup is visible');

        layer.events.triggerEvent('featureunselected', {feature: feature});
        ok($('#popup5').is(':visible')===false, 'Popup is hidden');

        mq.destroy();
        popup.empty();
    });
});

})(jQuery);
