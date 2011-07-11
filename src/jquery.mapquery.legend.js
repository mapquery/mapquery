/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license. 
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

/**
#jquery.mapquery.legend.js
A plugin on mapquery.core to add a legend to a layer. It will check if the layer 
is within a valid extent and zoom range. And if not will return an error message. 
 */ 

(function($, MQ) {
$.extend( $.fn.mapQuery.defaults.layer.all, {
    legend: {
        url: '',
        msg: ''
        }
});
//possible error messages to display in the legend
LEGEND_ERRORS= ['E_ZOOMOUT', 'E_ZOOMIN', 'E_OUTSIDEBOX'];
$.extend(MQ.Layer.prototype, {    
/**
###**layer**.`legend([options])`
_version added 0.1_
####**Description**: get/set the legend of a layer

**options** url:url the url to the legend image
 
>Returns: {url:url, msg:'E\_ZOOMOUT' | 'E\_ZOOMIN' | 'E\_OUTSIDEBOX' | ''}


The `.legend()` function allows us to attach a legend image to a layer. It will 
also check if the layer is not visible due to wrong extent or zoom level. It will 
return an error message which can be used to notify the user. 


     var legend = layer.legend();  //get the current legend
     layer.legend({url:'legendimage.png'}) //set the legend url to legendimage.png
     
 */    
    //get/set the legend object
    legend: function(options) {
        //get the legend object
        var goto = this.map.goto();
        if (arguments.length===0) {
            this._checkZoom(goto);
            //if zoom = ok, check box
            if(this.options.legend.msg==''){
                this._checkBox(goto);
            };
            return this.options.legend;
        }
        //set the legend url
        if (options.url!==undefined) {
            this.options.legend.url = options.url;
            return this.options.legend;
        }
    },
    //Check if the layer has a maximum box set and if the current box
    //is outside these settings, set the legend.msg accordingly
    _checkBox: function(goto){        
        var maxExtent = this.options.maxExtent;
        if(maxExtent!==undefined) {
            var mapBounds = new OpenLayers.Bounds(goto.box[0],goto.box[1],goto.box[2],goto.box[3]);
            var layerBounds = new OpenLayers.Bounds(maxExtent[0],maxExtent[1],maxExtent[2],maxExtent[3]);
            var inside = layerBounds.containsBounds(mapBounds, true);
            inside?this.options.legend.msg='':this.options.legend.msg=LEGEND_ERRORS[2];
        };
    },
    //Check if the layer has a minimum or maximum zoom set and if the current zoom
    //is outside these settings, set the legend.msg accordingly
    _checkZoom: function(goto){
        var zoom = goto.zoom;
        var maxZoom = this.options.maxZoom;
        var minZoom = this.options.minZoom;
        (maxZoom!==undefined&&maxZoom<zoom)? this.options.legend.msg=LEGEND_ERRORS[0]:this.options.legend.msg='';
        (minZoom!==undefined&&minZoom>zoom)? this.options.legend.msg=LEGEND_ERRORS[1]:this.options.legend.msg='';
    }
    
});
      
})(jQuery, $.MapQuery);
