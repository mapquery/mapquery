MapQuery
=========

More information is available at http://github.com/mapquery

The current documentation are the examples in the demo directory. Feel free to write something up for this README :)

In order to get the demos work, you need to get all dependencies. Run the getdeps.sh in the lib directory. Take care, that the getdeps.sh have enough permissions that it can run.

Known issues
------------

### Demos don't work

1. Have you got the dependencies (see above)
2. If you use Chrome/Chromium, you either need to run it behind a web server (so that the URLs are http:// and not file://) or start it with the `-allow-file-access-from-files` flag. See http://code.google.com/p/chromium/issues/detail?id=40787 for more information.


Development Guidlines
---------------------

If you want to create a new widget for MapQuery, here are some notes:

 - Don't indent after the (function($) { })(jQuery) closure:

```javascript
(function($) {
$.widget("mapQuery.mqLayerControl", {
    _create: ...
});
})(jQuery);
```

 - Name your widget in the constructor mapQuery.mq<anameyoulike>:

    $.widget("mapQuery.mqLayerControl", {...

 - Use jQuery-tmpl for templating

 - Use jQuery UI classes for styling

 - If you need `this` in an inner function, name the corresponding variable `self`

 - Indentation is 4 spaces

 - For CSS clases use a dash (-) and not an underscore (_) to separate parts


Data
----

The bundled tiles were generated from the Natural Earth dataset.
http://www.naturalearthdata.com/downloads/10m-raster-data/10m-natural-earth-1/


License
-------

MapQuery is licensed under the MIT License.
