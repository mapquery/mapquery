(function($) {
$.template('mqZoomButtons',
	'<div class="mq-zoombuttons ui-widget">'+
	'<div class="mq-zoombuttons-plus ui-icon"></div>'+
	'<div class="mq-zoombuttons-minus ui-icon"></div>'+
	'</div>');
		
$.widget("mapQuery.mqZoomButtons", {
	_create: function() {
		var self = this;
		var element = this.element;
		$.tmpl('mqZoomButtons').appendTo(element);
	}
});
})(jQuery);