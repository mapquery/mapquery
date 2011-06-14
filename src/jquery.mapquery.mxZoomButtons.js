(function($) {
$.template('mqZoomButtons',
	'<div class="mq-zoombuttons">'
	'<div class="mq-zoom-plus"></div>'+
	'<div class="mq-zoom-minus"></div>'+
	'</div>');
		
$.widget("mapQuery.mqZoomButtons", {
	_create: function() {
	}
});
})(jQuery);