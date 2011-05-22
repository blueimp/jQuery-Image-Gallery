# jQuery Image Gallery Plugin

## Demo
[jQuery Image Gallery](http://blueimp.github.com/jQuery-Image-Gallery/)

## Description & Usage
The Image Gallery plugin makes use of jQuery's live method to attach
a click handler to all elements that match the selector of the given
jQuery collection, now and in the future:

    $('a[rel=gallery]').imagegallery();

The click handler opens the linked images in a jQuery UI dialog.
The options object given to the imagegallery method is passed to the
jQuery UI dialog initialization and allows to set any dialog options:

    $('a[rel=gallery]').imagegallery({
        open: function (event, ui) {/* called on dialogopen */},
        title: 'Image Gallery', // Sets the dialog title
        show: 'scale', // The effect to be used when the dialog is opened
        hide: 'explode', // The effect to be used when the dialog is closed
        offsetWidth: 50, // Offset of image width to viewport width
        offsetHeight: 50, // Offset of image height to viewport height
        slideshow: 5000, // Shows the next image after 5000 ms
        fullscreen: true, // Displays images fullscreen (overrides offsets)
        canvas: true, // Displays images as canvas elements
        namespace: 'myimagegallery' // event handler namespace
    });

offsetWidth, offsetHeight, slideshow, fullscreen, canvas and namespace
are imagegallery specific options, while open, title, show and hide
are jQuery UI dialog options.

The click event listeners can be removed by calling the imagegallery
method with "destroy" as first argument, using the same selector for
the jQuery collection and the same namespace:

    $('a[rel=gallery]').imagegallery('destroy', {namespace: 'ns'});

To directly open an image with gallery functionality, the imagegallery
method can be called with "open" as first argument:

    $('a:last').imagegallery('open', {selector: 'a[rel=gallery]'});

The selector for related images can be overriden with the "selector"
option.

## Requirements
* [jQuery](http://jquery.com/) v. 1.4+
* [jQuery UI](http://jqueryui.com/) v. 1.8+ (Required: Dialog)

## License
Released under the [MIT license](http://creativecommons.org/licenses/MIT/).

## Source Code & Download
* Browse and checkout the [source code](https://github.com/blueimp/jQuery-Image-Gallery).
* [Download](https://github.com/blueimp/jQuery-Image-Gallery/archives/master) the project to add the plugin to your website.
