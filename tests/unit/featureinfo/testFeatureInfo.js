/*
 * Popup unit tests
 */
(function($) {
module('featureInfo');

asyncTest("Feature Info is shown", 3, function() {
    var map = $('#map1').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    var info = $('#info1').mqFeatureInfo({
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
        equals($('#info1').find('p').length, 1, 'Feature Info contains data');
        equals($('#info1').find('p').text(), 'poly1-1',
               'Feature 1 was selected');

        feature = data.object.features[1];
        layer.events.triggerEvent('featureselected', {feature: feature});
        equals($('#info1').find('p').text(), 'poly1-2',
               'Feature 2 was selected');

        mq.destroy();
        info.empty();
    });
});

asyncTest("Feature Info bound to two nodes", 5, function() {
    var map = $('#map2').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    //var info = $('.info').mqFeatureInfo({
    var info = $('.info2');
    info.mqFeatureInfo({
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
        equals($('#info2').find('p').length, 1, 'Feature Info contains data');
        equals($('#info2').find('p').text(), 'poly1-1',
               'Feature 1 was selected (#info2)');
        equals($('#info3').find('p').text(), 'poly1-1',
               'Feature 1 was selected (#info3)');

        feature = data.object.features[1];
        layer.events.triggerEvent('featureselected', {feature: feature});
        equals($('#info2').find('p').text(), 'poly1-2',
               'Feature 2 was selected (#info2)');
        equals($('#info3').find('p').text(), 'poly1-2',
               'Feature 2 was selected (#info3)');

        mq.destroy();
        info.empty();
    });
});

asyncTest("Feature Info is hidden feature gets unselected", 3, function() {
    var map = $('#map3').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    var info = $('#info4').mqFeatureInfo({
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
        equals($('#info4').find('p').length, 1, 'Feature Info contains data');
        equals($('#info4').find('p').text(), 'poly1-1', 'Feature 1 was selected');

        layer.events.triggerEvent('featureunselected', {feature: feature});
        equals($('#info4').children().length, 0, 'Feature Info is empty');

        mq.destroy();
        info.empty();
    });
});
})(jQuery);
