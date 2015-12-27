# jQuery Image Gallery

- [Demo](#demo)
- [Description](#description)
- [Setup](#setup)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [License](#license)

## Demo
[jQuery Image Gallery Demo](https://blueimp.github.io/jQuery-Image-Gallery/)

## Description
jQuery Image Gallery displays images with the touch-enabled, responsive and
customizable [blueimp Gallery](https://blueimp.github.io/Gallery/) carousel in
the dialog component of [jQuery UI](https://jqueryui.com/).  
It features swipe, mouse and keyboard navigation, transition effects and
on-demand content loading and can be extended to display additional content
types.

## Setup
Copy **js/jquery.image-gallery.min.js** to your website.

Add the following HTML snippet to the head section of your webpage:

```html
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/south-street/jquery-ui.css" id="theme">
<link rel="stylesheet" href="//blueimp.github.io/Gallery/css/blueimp-gallery.min.css">
```

Add the following HTML snippet with the dialog and embedded Gallery widget to
the body of your webpage:

```html
<!-- The dialog widget -->
<div id="blueimp-gallery-dialog" data-show="fade" data-hide="fade">
    <!-- The gallery widget  -->
    <div class="blueimp-gallery blueimp-gallery-carousel blueimp-gallery-controls">
        <div class="slides"></div>
        <a class="prev">‹</a>
        <a class="next">›</a>
        <a class="play-pause"></a>
    </div>
</div>
```

Include the following scripts at the bottom of the body of your webpage:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<script src="//blueimp.github.io/Gallery/js/jquery.blueimp-gallery.min.js"></script>
<script src="js/jquery.image-gallery.min.js"></script>
```

Create a list of links to image files with the attribute **data-dialog**
(optionally with enclosed thumbnails) and add them to the body of your webpage:

```html
<div id="links">
    <a href="images/banana.jpg" title="Banana" data-dialog>
        <img src="images/thumbnails/banana.jpg" alt="Banana">
    </a>
    <a href="images/apple.jpg" title="Apple" data-dialog>
        <img src="images/thumbnails/apple.jpg" alt="Apple">
    </a>
    <a href="images/orange.jpg" title="Orange" data-dialog>
        <img src="images/thumbnails/orange.jpg" alt="Orange">
    </a>
</div>
```

## Documentation
For information regarding Keyboard shortcuts, Gallery Options, API methods,
Video Gallery setup, Gallery extensions and Browser support, please refer to the
[blueimp Gallery documentation](https://github.com/blueimp/Gallery/blob/master/README.md).

## Requirements
* [jQuery](https://jquery.com/) v. 1.7.0+
* [jQuery UI](https://jqueryui.com/) v. 1.10.0+
* [blueimp Gallery](https://github.com/blueimp/Gallery) v. 2.17.0+

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).
