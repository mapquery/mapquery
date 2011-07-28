/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

/**
#jquery.mapquery.mqZoomButtons.js
The file containing the mqZoomButtons Widget

### *$('selector')*.`mqZoomButtons([options])`
_version added 0.1_
####**Description**: create a widget to show zoom buttons

 + **options**:
  - **map**: the mapquery instance
  - **home**: boolean stating if there should be a home button (default false)

>Returns: widget


The mqZoomButtons widget allows us to display a plus and minus zoom button. We
can also add an optional home button in between which will return the map to the
initial extent.


     $('#zoombuttons').mqZoomButtons({
        map: '#map',
        home: true
     });

 */
(function($) {
$.template('mqZoomButtons',
    '<div class="mq-zoombuttons ui-widget ui-helper-clearfix ">'+
    '<div class="ui-state-default ui-corner-all">'+
    '<div class="mq-zoombuttons-plus ui-icon ui-icon-plusthick "></div></div>'+
    '{{if home}}<div class="ui-state-default ui-corner-all">'+
    '<div class="mq-zoombuttons-home ui-icon ui-icon-home"></div></div>{{/if}}'+
    '<div class="ui-state-default ui-corner-all">'+
    '<div class="mq-zoombuttons-minus ui-icon ui-icon-minusthick"></div></div>'+
    '</div>');

$.widget("mapQuery.mqZoomButtons", {
    options: {
        // The MapQuery instance
        map: undefined,

        //Option to display home button between the + and - button, default: false
        home: false

    },
    _create: function() {
        var map;
        var zoom;
        var numzoomlevels;
        var self = this;
        var element = this.element;

       //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        var startExtent = map.center();
        $.tmpl('mqZoomButtons',{
            home: this.options.home
        }).appendTo(element);

        $(".mq-zoombuttons-plus").click(function(){
            //get the latest numzoomlevels and zoom from the map,
        //in case something has changed in the mean time
            numzoomlevels = map.options.numZoomLevels;
            zoom = map.center().zoom;
            if(zoom<numzoomlevels){ map.center({zoom:zoom+1});}
        });
        $(".mq-zoombuttons-home").click(function(){
            //return to initial (home) extent
            map.center(startExtent);
        });
        $(".mq-zoombuttons-minus").click(function(){
            //get the latest zoom from the map, in case
        //something has changed in the mean time
            zoom = map.center().zoom;
            if(zoom>0){map.center({zoom:zoom-1});}
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    }
});
})(jQuery);
