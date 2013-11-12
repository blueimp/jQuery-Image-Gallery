/*
 * jQuery Image Gallery plugin 3.0.0
 * https://github.com/blueimp/jQuery-Image-Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true */
/*global define, window, document */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            './blueimp-gallery'
        ], factory);
    } else {
        factory(
            window.jQuery,
            window.blueimp.Gallery
        );
    }
}(function ($, Gallery) {
    'use strict';

    // Global click handler to open links with data-dialog attribute
    // in the Gallery lightbox:
    $(document).on('click', '[data-dialog]', function (event) {
        // Get the widget id from the data-dialog attribute:
        var id = $(this).data('dialog'),
            widget = $(id),
            dialogWidget = (widget.length && widget) ||
                $('#blueimp-gallery-dialog'),
            galleryWidget = dialogWidget.find('.blueimp-gallery'),
            dialogInitialized = false,
            // Initialize the dialog with custom options
            // from data-attributes on the dialog widget:
            dialogOptions = $.extend({
                modal: true,
                width: 'auto'
            }, dialogWidget.data()),
            galleryOptions = $.extend(
                {
                    toggleControlsOnReturn: true,
                    toggleSlideshowOnSpace: true,
                    enableKeyboardNavigation: true,
                    startSlideshow: false
                },
                // Initialize the Gallery with custom options
                // from data-attributes on the Gallery widget:
                galleryWidget.data(),
                {
                    container: galleryWidget[0],
                    index: this,
                    event: event,
                    carousel: true,
                    onslide: function (index, slide) {
                        var gallery = this,
                            title = slide.firstChild.title;
                        if (dialogInitialized) {
                            dialogWidget.dialog('option', 'title', title);
                        } else {
                            dialogOptions.title = title;
                            dialogWidget
                                .data('gallery', this)
                                .one('dialogclose', function () {
                                    $(this).dialog('destroy');
                                    gallery.handleClose();
                                })
                                .one('dialogresize', function () {
                                    galleryWidget.css('width', 'auto');
                                })
                                .dialog(dialogOptions)
                                .css({
                                    visibility: 'visible',
                                    height: 'auto',
                                    overflow: 'visible'
                                });
                            dialogInitialized = true;
                        }
                        dialogWidget.trigger('slide', arguments);
                    },
                    onslideend: function () {
                        dialogWidget.trigger('slideend', arguments);
                    },
                    onslidecomplete: function () {
                        dialogWidget.trigger('slidecomplete', arguments);
                    }
                }
            ),
            // Select all links with the same data-dialog attribute:
            links = $('[data-dialog="' + id + '"]'),
            setGalleryWidgetDimensions = function () {
                var width = $(window).width() -
                        (dialogOptions.offsetWidth || 100),
                    height = $(window).height() -
                        (dialogOptions.offsetHeight || 150),
                    // blueimp gallery carousel ratio (16/9)
                    // to viewport ratio:
                    ratio = ((16 / 9) / (width / height));
                if (ratio < 1) {
                    width = width * ratio;
                }
                galleryWidget.css('width', width);
            };
        if (galleryOptions.filter) {
            links = links.filter(galleryOptions.filter);
        }
        // The Gallery only renders if the parent element is displayed,
        // so we cannot use "display:none", but the following workaround:
        dialogWidget.css({
            visibility: 'hidden',
            height: 0,
            overflow: 'hidden'
        });
        setGalleryWidgetDimensions();
        return new Gallery(links, galleryOptions);
    });

}));
