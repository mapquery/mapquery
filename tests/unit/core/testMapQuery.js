/*
 * geoMap unit tests
 */
(function($) {

module('mapQuery');

test("constructor", function() {
    expect(1);

    var mapElement = $('#map').mapQuery();
    ok(mapElement.data('mapQuery').layers, "Layers function exists");
});

// NOTE: This test needs an internet connecion
test("create only one instance", function() {
    expect(2);

    var map = $('#map').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMS',
        label: 'World',
        url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
        layers: 'basic'
    });
    equals(map.layersList.mapquery0.id, 'mapquery0', 'Layer was added');
    map = $('#map').mapQuery().data('mapQuery');
    equals(map.layersList.mapquery0.id, 'mapquery0', 'Layers are still there');
});

test("WMTS layer parses URL correctly", function() {
    expect(6);

    var map = $('#map_wmts').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery0.olLayer.layer, 'NE1_HR_LC_SR_W_DR',
           'layer is correct');
    equals(map.layersList.mapquery0.olLayer.matrixSet, '10m',
           'matrixSet is correct');
    equals(map.layersList.mapquery0.olLayer.style, 'default',
           'style is correct');
    equals(map.layersList.mapquery0.olLayer.url,
           '../../../demo/data/wmts', 'url is correct');

    map.layers({
        type: 'WMTS',
        label: 'naturalearth2',
        url: 'http://example.com/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery1.olLayer.url,
           'http://example.com/wmts', 'Remote URL is parsed correctly');

    map.layers({
        type: 'WMTS',
        label: 'naturalearth3',
        url: 'http://usr:passwd@example.com/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
    });
    equals(map.layersList.mapquery2.olLayer.url,
           'http://usr:passwd@example.com/wmts',
           'Remote URL with username and password is parsed correctly');
});

test("WMTS layer sets paramters for spherical mercator correctly", function() {
    expect(5);

    var map = $('#map_wmts2').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
        sphericalMercator: true
    });
    equals(map.layersList.mapquery0.olLayer.maxExtent.toString(),
           '-20037508.3392,-20037508.3392,20037508.3392,20037508.3392',
           'maxExtent was set');
    equals(map.layersList.mapquery0.olLayer.maxResolution, 156543.0339,
           'maxResolution was set');
    equals(map.layersList.mapquery0.olLayer.projection, 'EPSG:900913',
           'projection was set');
    equals(map.layersList.mapquery0.olLayer.units, 'm',
           'units was set');

    map = $('#map_wmts3').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
        numZoomLevels: 3,
        sphericalMercator: true
    });
    equals(map.layersList.mapquery0.olLayer.numZoomLevels, 3,
           'Number of zoom level is set correctly even if ' +
           '"sphericalMercator" is to true');

});

// NOTE: This test needs an internet connecion
test("OSM layer can be created", function() {
    expect(1);

    var map = $('#map_osm').mapQuery().data('mapQuery');
    map.layers({
        type: 'OSM',
        label: 'OpenStreetMap'
    });
    ok(map.layersList.mapquery0.olLayer.attribution.indexOf('OpenStreetMap')!==-1,
       'OpenStreetMap layer was loaded (attribution is there)');
});
test("Google layer can be created (works only with dev-build of openlayers)", function() {
    expect(1);

    var map = $('#map_google').mapQuery().data('mapQuery');
    map.layers({
        type: 'google',
        view: 'road'
    });
    ok(map.layersList.mapquery0.olLayer.type=='roadmap',
       'Google layer was loaded (type is roadmap)');
});
test("Bing layer can be created", function() {
    expect(1);

    var map = $('#map_bing').mapQuery().data('mapQuery');
    map.layers({
        type:'bing',view:'satellite',key:'ArAGGPJ16xm0RXRbw27PvYc9Tfuj1k1dUr_gfA5j8QBD6yAYMlsAtF6YkVyiiLGn'
    });
    ok(map.layersList.mapquery0.olLayer.name=="Bing Aerial",
       'Bing layer was loaded (name is Bing Aerial)');
});
test("Add layers on initialisation", function() {
    expect(3);
    var mapDom = $('#map_init').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        }]
    });
    var map = mapDom.data("mapQuery");
    equals(map.layersList.mapquery0.label, 'naturalearth', 'Layer was added');

    var mapDom2 = $('#map_init2').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        },{
            type: 'WMS',
            label: 'World',
            url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
            layers: 'basic'
        }]
    });
    var map2 = mapDom2.data("mapQuery");
    equals(map2.layersList.mapquery0.label, 'naturalearth',
           'Layer1 was added');
    equals(map2.layersList.mapquery1.label, 'World', 'Layer2 was added');
});

test("Go to a certain position on initialisation", 2, function() {
    var mq = $('#map_init_center').mapQuery({
        layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
            sphericalMercator: true
        }],
        center: {
            position: [-20, 30],
            zoom: 2
        }
    }).data('mapQuery');
    var center = mq.center();
    equals(center.zoom, 2, 'Got to the right zoom level');
    deepEqual(center.position, [-20, 30], 'Got to the right position');
});

test("center works properly (EPSG:900913)", function() {
    expect(30);

    var maps = [
        // this is EPSG:900913
        $('#map_center').mapQuery({layers: [{
            type: 'OSM',
            label: 'OpenStreetMap'
        }]}),
        // this is EPSG:4326
        $('#map_center2').mapQuery({layers: [{
            type: 'WMTS',
            label: 'naturalearth',
            url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m'
        }]})
    ];

    for (var i=0; i<maps.length; i++) {
        var map = maps[i].data('mapQuery');

        // position

        map.center({position: [10.898333, 48.371667]});
        var center = map.center();
        same(center.position, [10.898333, 48.371667],
             'Setting the position only');
        map.center({position: [4.892222, 52.373056]});
        center = map.center();
        same(center.position, [4.892222, 52.373056],
             'Setting the position only (2)');
        map.center({position: [4.892222, 52.373056], zoom: 5});
        map.center({position: [4.892222, 52.373056], zoom: 7});
        map.center({position: [10.898333, 48.371667]});
        center = map.center();
        equals(center.zoom, 7,
             'Setting the position only, keep the current zoom level');

        // zoom

        map.center({position: [10.898333, 48.371667], zoom: 5});
        map.center({zoom: 3});
        center = map.center();
        same(center.position, [10.898333, 48.371667],
             'Setting the zoom only zoom (position is right)');
        equals(center.zoom, 3, 'Setting the zoom only (zoom is right)');

        // position + zoom

        map.center({position: [10.898333, 48.371667], zoom: 6});
        center = map.center();
        same(center.position, [10.898333, 48.371667],
             'Setting the position and zoom (position is right)');
        equals(center.zoom, 6, 'Setting the position and zoom (zoom is right)');
        map.center({position: [4.892222, 52.373056], zoom: 4});
        center = map.center();
        same(center.position, [4.892222, 52.373056],
             'Setting the position and zoom (position is right) (2)');
        equals(center.zoom, 4, 'Setting the position and zoom ' +
               '(zoom is right) (2)');

        // box

        map.center({box: [4.892222, 48.371667, 10.898333, 52.373056]});
        center = map.center();
        // The extend will be fit in to the nearest zoom level, hence
        // the box given, doesn't match the final one
            console.log(center.box);

        /* same(center.box, [-21.962936669741, 20.514147330259, 37.753491669741,
                        80.230575669741],
             'Setting box only (position is right)'); */
        equals((center.position[0] == 7.8952775000002) && (center.position[1] == 50.414584408364), true,
            'Setting box only (position is right)');

        same(center.zoom, 4,
             'Setting box only (zoom is right)');

        // ignore position or zoom settings
        map.center({position: [-22.566667, 17.15], zoom: 9});
        center = map.center();
        same(center.position, [-22.566667, 17.15],
             'Reset position to somewhere outside of the box we\'ll set');
        equals(center.zoom, 9,
               'Reset position to somewhere outside of the box we\'ll set ' +
               '(zoom)');
        map.center({box: [4.892222, 48.371667, 10.898333, 52.373056],
                  position: [135, -25], zoom: 7});
        center = map.center();
        // The extend will be fit in to the nearest zoom level, hence
        // the box given, doesn't match the final one
        console.log(center.box);
        equals((center.position[0] == 7.8952775000002) && (center.position[1] == 50.414584408364), true,
            'Setting box only (position is right)');
        equals(center.zoom, 4,
             'Setting box only (zoom is right)');
    }
});

asyncTest("GeoJSON layer gets loaded correctly 2", 1, function() {
    var mq = $('#map_geojson').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    }).data('mapQuery');

    mq.layers()[0].bind('loadend', function(evt, data) {
        var olLayer = data.object;
        equals(olLayer.features.length, 2, "Number of features is correct");
        start();
    });
});

asyncTest("GeoJSON layer gets loaded correctly (JSONP)", 1, function() {
    var mq = $('#map_geojson_jsonp').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Public Schools',
            url: 'http://max.ic.ht/sf_public_schools/_design/geo/_rewrite/data?bbox=-123,37.72,-121,37.75'
        }
    }).data('mapQuery');
    var layers = mq.layers();

    mq.layers()[0].bind('loadend', function(evt, data) {
        var olLayer = data.object;
        equals(olLayer.features.length, 47, "Number of features is correct");
        start();
    });
});

test("Layer events are bound to the map object as well", 2, function() {
    var mq = $('#map_events').mapQuery({
        layers: {
            type: 'JSON',
            label: 'Polygons',
            url: '../../../demo/data/poly.json'
        }
    }).data('mapQuery');

    var layer = mq.layers()[0];
    layer.bind('loadend', function(evt, data) {
        var olLayer = data.object;
        var feature = data.object.features[0];
        olLayer.events.triggerEvent('featureselected', {feature: feature});
    });

    stop();
    layer.bind('featureselected', function() {
        ok(true, 'Feature selected event was fired on the Layer object');
        start();
    });
    stop();
    mq.bind('featureselected', function() {
        ok(true, 'Feature selected event was fired on the Map object');
        start();
    });
});
})(jQuery);
