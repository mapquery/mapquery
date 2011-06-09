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

test("Setting the map center is correctly transformed", function() {
    expect(2);

    var map = $('#map_center').mapQuery().data('mapQuery');
    map.layers({
        type: 'WMTS',
        label: 'naturalearth',
        url: '../../../demo/data/wmts/1.0.0/NE1_HR_LC_SR_W_DR/default/10m',
        sphericalMercator: true
    });

    ok(map.olMap.getCenter().equals(new OpenLayers.LonLat(0.0,0.0)),
      'Initial center of the map is (0,0)');
    map.center(10, 50, 4);
    ok(map.olMap.getCenter().equals(new OpenLayers.LonLat(10, 50).transform(
            new OpenLayers.Projection('EPSG:4326'),
            new OpenLayers.Projection('EPSG:900913'))),
        'Map was correctly recentered');
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

})(jQuery);
