/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


/**
#jquery.mapquery.mqOverviewMap.js
The file containing the mqOverviewMap Widget

### *$('selector')*.`mqOverviewMap([options])`
_version added 0.1_
####**Description**: create a widget to show an overview map

 + **options**:
  - **map**: the mapquery instance
  - **title**: Title that will be displayed at the top of the overview window
  - **position**: The position of the overview map dialog (default right bottom)
  - **width**: width of the overview window (default 300px)
  - **height**: height of the overview window (default 200px)

>Returns: widget


The mqOverviewMap widget allows us to display an overview map dialog
(http://jqueryui.com/demos/dialog/) and a toggle button. The dialog will be put
on the given position see (http://jqueryui.com/demos/dialog/#option-position).
The toggle button will be put in the element where the widget is attached to.


     $('#overviewmap').mqOverviewMap({
        map: '#map',
        position: ['right','top']
     });

 */
(function($) {
$.template('mqOverviewMap',
    '<div class="mq-overviewmap-button ui-state-default ui-corner-all">'+
    '<div class="mq-overviewmap-close ui-icon ui-icon-arrowthick-1-se "></div>'+
    '</div>'+
    '<div id="${id}" class="mq-overviewmap ui-widget ">'+
    '</div>');

$.widget("mapQuery.mqOverviewMap", {
    options: {
        // The MapQuery instance
        map: undefined,

        // Title that will be displayed at the top of the overview window
        title: "Overview map",

        //the position of the overview map, default right bottom of the window
        position: ['right','bottom'],

        //initial size of the overviewmap
        width: 300,
        height: 200
    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
    //TODO smo20110620 make this configurable
        var id = 'mqOverviewMap-dialog';

    //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        this.element.addClass('ui-widget  ui-helper-clearfix ' +
                              'ui-corner-all');

        $.tmpl('mqOverviewMap',{
            id: id}).appendTo(element);

        var dialogElement = $('#'+id).dialog({
            dialogClass: 'mq-overviewmap-dialog',
            autoOpen: true,
            width: this.options.width,
            height: this.options.height,
            title: this.options.title,
            position: this.options.position,
            resizeStop: function (event, ui) {
                $('.olMap', this).width($(this).width());
               $('.olMap', this).height($(this).height());
            },
            close:function(event,ui){
                 $('.mq-overviewmap-close').removeClass(
            'mq-overviewmap-close ui-icon-arrowthick-1-se').addClass(
            'mq-overviewmap-open ui-icon-arrowthick-1-nw');
            }

        });

        var overviewmapsize = {
        w: $(dialogElement).width(),
        h: $(dialogElement).height() };
        var mapOptions = map.olMapOptions;
        //remove the controls, otherwise you end up with recursing events
        delete mapOptions.controls;
        // use the lowest layer of the map as overviewmap
        // TODO: make the layer configurable
        var overview = new OpenLayers.Control.OverviewMap(
        {div: document.getElementById(id),size:overviewmapsize,
            mapOptions:mapOptions,layers:[
                map.layers().reverse()[0].olLayer.clone()]});
        map.olMap.addControl(overview);

        // remove OpenLayers blue border around overviewmap
        $('.olControlOverviewMapElement', dialogElement).removeClass(
        'olControlOverviewMapElement');

        element.delegate('.mq-overviewmap-close', 'click', function() {
            $(this).removeClass(
        'mq-overviewmap-close ui-icon-arrowthick-1-se').addClass(
        'mq-overviewmap-open ui-icon-arrowthick-1-nw');
            $('#'+id).dialog('close');
        });
        element.delegate('.mq-overviewmap-open', 'click', function() {
            $(this).removeClass(
        'mq-overviewmap-open ui-icon-arrowthick-1-nw').addClass(
        'mq-overviewmap-close ui-icon-arrowthick-1-se');
            $('#'+id).dialog('open');
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    }

});
})(jQuery);
