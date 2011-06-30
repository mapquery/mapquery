(function($) {
$.template('mqOverviewMap',
    '<div class="mq-overviewmap-toggle ui-icon-extlink">bla</div><div id="${id}" class="mq-overviewmap ui-widget ">'+
    '</div>');
        
$.widget("mapQuery.mqOverviewMap", {
    options: {
        // The MapQuery instance
        map: undefined,

        // Title that will be displayed at the top of the overview window
        title: "Overview map"
    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        var id = 'mqOverviewMap-dialog'; //TODO smo20110620 make this configurable
        
        //get the mapquery object
        if (this.options.jquery === $().jquery) {
            map = this.options.data('mapQuery');
            this.options = {};
        }
        else {
            map = this.options.map.data('mapQuery');
        }
        
        $.tmpl('mqOverviewMap',{
            id: id}).appendTo(element);
                    
        var dialogElement = $('#'+id).dialog({
            dialogClass: 'mq-overviewmap-dialog',
            autoOpen: true,
            title: 'Overview', //TODO smo20110620 make this configurable and/or i18n
            position: ['right','bottom'], //TODO smo20110620 make this configurable
            
            resizeStop: function (event, ui) { 
                $('.olMap', this).width($(this).width()); $('.olMap', this).height($(this).height());     
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
        
        $('.mq-overviewmap-toggle').click(function() {
        	$('#'+id).dialog('open') //TODO: turn this into a proper toggle function
        	
    	});
    }
    
    //TODO: you cannot reopen this thing 
});
})(jQuery);