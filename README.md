# jQuery Image Gallery Plugin

## Demo
[jQuery Image Gallery Demo](http://blueimp.github.com/jQuery-Image-Gallery/)

## Description & Usage
The Image Gallery plugin makes use of jQuery's 
[delegate](http://api.jquery.com/delegate/) method to attach
a click event handler for all child elements matching a selector,
now or in the future, of the given set of root elements:

```js
$('#gallery').imagegallery();
```
    
It is possible to override the default selector as well as a number of
additional gallery options:

```js
$('#gallery').imagegallery({
    // selector given to jQuery's delegate method:
    selector: 'a[rel="gallery"]',
    // event handler namespace:
    namespace: 'imagegallery',
    // Shows the next image after the given time in ms (0 = disabled):
    slideshow: 0,
    // Offset of image width to viewport width:
    offsetWidth: 100,
    // Offset of image height to viewport height:
    offsetHeight: 100,
    // Display images fullscreen (overrides offsets):
    fullscreen: false,
    // Display images as canvas elements:
    canvas: false,
    // body class added on dialog display:
    bodyClass: 'gallery-body',
    // element id of the loading animation:
    loaderId: 'gallery-loader',
    // list of available dialog effects,
    // used when show/hide is set to "random":
    effects: [
        'blind',
        'clip',
        'drop',
        'explode',
        'fade',
        'fold',
        'puff',
        'slide',
        'scale'
    ],
    // The following are jQuery UI dialog options, see
    // http://jqueryui.com/demos/dialog/#options
    // for additional options and documentation:
    modal: true,
    resizable: false,
    width: 'auto',
    height: 'auto',
    show: 'fade',
    hide: 'fade',
    dialogClass: 'gallery-dialog'
});
```

The click handler opens the linked images in a jQuery UI dialog.
The options object given to the imagegallery method is passed to the
[jQuery UI dialog](http://jqueryui.com/demos/dialog/) initialization
and allows to override any
[dialog options](http://jqueryui.com/demos/dialog/#options).

It is possible to change options after widget initialization:

```js
$('#gallery').imagegallery('option', 'fullscreen', true);
$('#gallery').imagegallery('option', {
    show: 'slide',
    hide: 'slide'
});
```

The Image Gallery widget can also be disabled/enabled/destroyed:

```js
$('#gallery').imagegallery('disable');
$('#gallery').imagegallery('enable');
$('#gallery').imagegallery('destroy');
```

## Requirements
* [jQuery](http://jquery.com/) v. 1.6+
* [jQuery UI](http://jqueryui.com/) v. 1.8+ (Required: Widget, Dialog)

## License
Released under the [MIT license](http://creativecommons.org/licenses/MIT/).

## Source Code & Download
* Browse and checkout the [source code](https://github.com/blueimp/jQuery-Image-Gallery).
* [Download](https://github.com/blueimp/jQuery-Image-Gallery/downloads) the project to add the plugin to your website.
