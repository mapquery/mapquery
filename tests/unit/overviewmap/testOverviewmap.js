/*
 * Overviewmap unit tests
 */
(function($) {
module('overviewmap');

test("Overviewmap is shown", 1, function() {
    var map = $('#map1').mapQuery({
        layers:[{
            type:'osm' 
        }]
    });
    var mq = map.data('mapQuery');
    var overviewmap = $('#overviewmap').mqOverviewMap({map:'#map1'});
    equals($('.mq-overviewmap-dialog').find('.olMap').length, 1, 'overviewmap contains a map');
    
    mq.destroy();
    overviewmap.empty();
});

//TODO: add tests for open/close dialog and panning/zooming on the map 

})(jQuery);
