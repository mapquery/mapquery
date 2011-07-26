/*
 * Zoomslider unit tests
 */
(function($) {
module('zoomslider');

test("ZoomSlider is shown", 1, function() {
    var map = $('#map1').mapQuery({
        layers:[{
            type:'osm'
        }]
    });
    var mq = map.data('mapQuery');
    var zoombuttons = $('#zoomslider').mqZoomSlider({map:'#map1'});
    equals($('#zoomslider').find('.ui-slider ').length, 1, 'zoomslider contains slider');

});

test("ZoomSlider works", 2, function() {
    var map = $('#map1').mapQuery({
        layers:[{
            type:'osm'
        }]
    });
    var mq = map.data('mapQuery');
    var center = mq.center();
    $(".mq-zoomslider-slider").slider('value',19-4);
    center = mq.center();
    equals(center.zoom, 4, 'Zoomed in to 4 using slider');
    mq.center({zoom:3});
    equals($(".mq-zoomslider-slider").slider('value'), 19-3, 'Zoomed out to 3, slider is 3');
});

})(jQuery);
