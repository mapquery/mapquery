/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license. 
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqZoomButtons',
    '<div class="mq-zoombuttons ui-widget ui-helper-clearfix ">'+
    '<div class="ui-state-default ui-corner-all"><div class="mq-zoombuttons-plus ui-icon ui-icon-plusthick "></div></div>'+
    '{{if home}}<div class="ui-state-default ui-corner-all"><div class="mq-zoombuttons-home ui-icon ui-icon-home"></div></div>{{/if}}'+
    '<div class="ui-state-default ui-corner-all"><div class="mq-zoombuttons-minus ui-icon ui-icon-minusthick"></div></div>'+
    '</div>');
        
$.widget("mapQuery.mqZoomButtons", {
    options: {
        // The MapQuery instance
        map: undefined,
        
        //Option to display a home button between the + and - button, default: false
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
        
        var startExtent = map.goto();
        $.tmpl('mqZoomButtons',{
            home: this.options.home    
        }).appendTo(element);

        $(".mq-zoombuttons-plus").click(function(){
            //get the latest numzoomlevels and zoom from the map, in case something has changed in the mean time
            numzoomlevels = map.options.numZoomLevels;
            zoom = map.goto().zoom;
            if(zoom<numzoomlevels){ map.goto({zoom:zoom+1});}
        });
        $(".mq-zoombuttons-home").click(function(){
            //return to initial (home) extent
            map.goto(startExtent);
        });
        $(".mq-zoombuttons-minus").click(function(){
            //get the latest zoom from the map, in case something has changed in the mean time
            zoom = map.goto().zoom;
            if(zoom>0){map.goto({zoom:zoom-1})}
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    }
});
})(jQuery);