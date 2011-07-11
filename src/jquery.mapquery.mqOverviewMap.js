/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license. 
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

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
        var id = 'mqOverviewMap-dialog'; //TODO smo20110620 make this configurable
        
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
                $('.olMap', this).width($(this).width()); $('.olMap', this).height($(this).height());     
            },
            close:function(event,ui){
                 $('.mq-overviewmap-close').removeClass('mq-overviewmap-close ui-icon-arrowthick-1-se').addClass('mq-overviewmap-open ui-icon-arrowthick-1-nw');
            }
            
        });
        
        var overviewmapsize = { w: $(dialogElement).width(), h: $(dialogElement).height() };        
        var mapOptions = map.olMapOptions;
        //remove the controls, otherwise you end up with recursing events
        delete mapOptions.controls;                           
        // use the lowest layer of the map as overviewmap
        // TODO: make the layer configurable
        var overview = new OpenLayers.Control.OverviewMap( {div: document.getElementById(id),size:overviewmapsize,mapOptions:mapOptions,layers:[map.layers().reverse()[0].olLayer.clone()]});
        map.olMap.addControl(overview);
        
        // remove OpenLayers blue border around overviewmap
        $('.olControlOverviewMapElement', dialogElement).removeClass ('olControlOverviewMapElement');

        element.delegate('.mq-overviewmap-close', 'click', function() {
            $(this).removeClass('mq-overviewmap-close ui-icon-arrowthick-1-se').addClass('mq-overviewmap-open ui-icon-arrowthick-1-nw');
            $('#'+id).dialog('close');            
        });
        element.delegate('.mq-overviewmap-open', 'click', function() {
            $(this).removeClass('mq-overviewmap-open ui-icon-arrowthick-1-nw').addClass('mq-overviewmap-close ui-icon-arrowthick-1-se');
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