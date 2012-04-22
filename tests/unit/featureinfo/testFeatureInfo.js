/*
 * Popup unit tests
 */
(function($) {
module('featureInfo');

asyncTest("Feature Info is shown", 3, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    var info = $('#info1').mqFeatureInfo({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('layerloadend', function(evt) {
        var features = this.features();

        features[0].select();
        equals($('#info1').find('p').length, 1, 'Feature Info contains data');
        equals($('#info1').find('p').text(), 'poly1-1',
               'Feature 1 was selected');

        features[1].select();
        equals($('#info1').find('p').text(), 'poly1-2',
               'Feature 2 was selected');

        start();
    });
});

asyncTest("Feature Info bound to two nodes", 5, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    var info = $('.info');
    info.mqFeatureInfo({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('layerloadend', function(evt) {
        var features = this.features();
        features[0].select();
        equals($('#info1').find('p').length, 1, 'Feature Info contains data');
        equals($('#info1').find('p').text(), 'poly1-1',
               'Feature 1 was selected (#info1)');
        equals($('#info2').find('p').text(), 'poly1-1',
               'Feature 1 was selected (#info2)');

        features[1].select();
        equals($('#info1').find('p').text(), 'poly1-2',
               'Feature 2 was selected (#info1)');
        equals($('#info2').find('p').text(), 'poly1-2',
               'Feature 2 was selected (#info2)');

        start();
    });
});

asyncTest("Feature Info is hidden feature gets unselected", 3, function() {
    var map = $('#map').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    });
    var info = $('#info1').mqFeatureInfo({
        map: map,
        contents: function(feature) {
            return '<p>' + feature.properties.id + '</p>';
        }
    });

    var mq = map.data('mapQuery');
    mq.layers()[0].bind('layerloadend', function(evt) {
        var feature = this.features()[0];
        feature.select();
        equals($('#info1').find('p').length, 1, 'Feature Info contains data');
        equals($('#info1').find('p').text(), 'poly1-1',
               'Feature 1 was selected');

        feature.unselect();
        equals($('#info1').children().length, 0, 'Feature Info is empty');

        start();
    });
});
})(jQuery);
