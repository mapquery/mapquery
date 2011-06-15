(function($) {
$.template('mqZoomButtons',
	'<div class="mq-zoombuttons ui-widget ui-helper-clearfix ">'+
	'<div class="ui-state-default ui-corner-all"><div class="mq-zoombuttons-plus ui-icon ui-icon-plusthick "></div></div>'+
	'<div class="ui-state-default ui-corner-all"><div class="mq-zoombuttons-minus ui-icon ui-icon-minusthick"></div></div>'+
	'</div>');
		
$.widget("mapQuery.mqZoomButtons", {
	_create: function() {
		var map;
		var zoom;
		var numzoomlevels;
		var self = this;
		var element = this.element;
		
		if (this.options.jquery === $().jquery) {
            map = this.options.data('mapQuery');
            this.options = {};
        }
        else {
            map = this.options.map.data('mapQuery');
        }
		$.tmpl('mqZoomButtons').appendTo(element);
		$(".mq-zoombuttons-plus").click(function(){
			//get the latest numzoomlevels and zoom from the map, in case something has changed in the mean time
			numzoomlevels = map.options.numZoomLevels;
			zoom = map.goto().zoom;
			if(zoom<numzoomlevels){ map.goto({zoom:zoom+1});}
		});
		$(".mq-zoombuttons-minus").click(function(){
			//get the latest numzoomlevels and zoom from the map, in case something has changed in the mean time
			numzoomlevels = map.options.numZoomLevels;
			zoom = map.goto().zoom;
			if(zoom>0){map.goto({zoom:zoom-1})}
		});
	}
});
})(jQuery);