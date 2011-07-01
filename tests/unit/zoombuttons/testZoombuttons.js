/*
 * Zoombutton unit tests
 */
(function($) {
module('zoombuttons');

test("ZoomButtons are shown", 2, function() {
    var map = $('#map1').mapQuery({
        layers:[{
            type:'osm' 
        }]
    });
    var mq = map.data('mapQuery');
    var zoombuttons = $('#zoombutton').mqZoomButtons({map:'#map1'});
    equals($('#zoombutton').find('.mq-zoombuttons-plus').length, 1, 'zoombuttons contains plus icon');
    equals($('#zoombutton').find('.mq-zoombuttons-minus').length, 1, 'zoombuttons contains minus icon');

});

test("ZoomButtons work", 2, function() {
    var map = $('#map1').mapQuery({
        layers:[{
            type:'osm' 
        }]
    });
    var mq = map.data('mapQuery');
    var goto = mq.goto();
    $(".mq-zoombuttons-plus").trigger('click');
    goto = mq.goto();
    equals(goto.zoom, 2, 'Zoomed in');
    $(".mq-zoombuttons-minus").trigger('click');
	goto = mq.goto();
    equals(goto.zoom, 1, 'Zoomed out');
    
   
});

})(jQuery);
