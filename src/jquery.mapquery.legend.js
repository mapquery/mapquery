(function($, MQ) {
$.extend( $.fn.mapQuery.defaults.layer.all, {
    legend: {
        url: '',
        inBox: true,
        zoom: 'inside'
        }
});

$.extend(MQ.Layer.prototype, {
    
    legend: function(options) {
        
        //get/set legend object
        if (arguments.length===0) {
            return this.options.legend;
        };
    },
    _updateLegend: function() {
        //legend should check if layer is outside extent
        //or outside max/minZoom
    }
    
});

/*
legend: {
        url: '',
        inBox: true,
        zoom: 'inside'
        }
*/
    
        
})(jQuery, $.MapQuery);
