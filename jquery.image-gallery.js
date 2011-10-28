/*
 * jQuery Image Gallery Plugin 1.3.5
 * https://github.com/blueimp/jQuery-Image-Gallery
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*
 * The Image Gallery plugin makes use of jQuery's live method to attach
 * a click handler to all elements that match the selector of the given
 * jQuery collection, now and in the future:
 * 
 * $('a[rel=gallery]').imagegallery();
 * 
 * The click handler opens the linked images in a jQuery UI dialog.
 * The options object given to the imagegallery method is passed to the
 * jQuery UI dialog initialization and allows to set any dialog options:
 * 
 * $('a[rel=gallery]').imagegallery({
 *     open: function (event, ui) {}, // called on dialogopen
 *     title: 'Image Gallery', // Sets the dialog title
 *     show: 'scale', // The effect to be used when the dialog is opened
 *     hide: 'explode', // The effect to be used when the dialog is closed
 *     offsetWidth: 50, // Offset of image width to viewport width
 *     offsetHeight: 50, // Offset of image height to viewport height
 *     slideshow: 5000, // Shows the next image after 5000 ms
 *     fullscreen: true, // Displays images fullscreen (overrides offsets)
 *     canvas: true, // Displays images as canvas elements
 *     namespace: 'myimagegallery' // event handler namespace
 * });
 * 
 * offsetWidth, offsetHeight, slideshow, fullscreen, canvas and namespace
 * are imagegallery specific options, while open, title, show and hide
 * are jQuery UI dialog options.
 * 
 * The click event listeners can be removed by calling the imagegallery
 * method with "destroy" as first argument, using the same selector for
 * the jQuery collection and the same namespace:
 * 
 * $('a[rel=gallery]').imagegallery('destroy', {namespace: 'ns'});
 * 
 * To directly open an image with gallery functionality, the imagegallery
 * method can be called with "open" as first argument:
 * 
 * $('a:last').imagegallery('open', {selector: 'a[rel=gallery]'});
 * 
 * The selector for related images can be overriden with the "selector"
 * option.
 */

/*jslint white: true, nomen: true */
/*global jQuery, window, document, setTimeout, clearTimeout */

(function ($) {
    'use strict';

    // Adds the imagegallery method to the jQuery object.
    // Adds a live click handler with the selector of the
    // jQuery collection, removes the live handler when called
    // with "destroy" as first argument, and directly opens
    // the first image when called with "open" as argument:
    $.fn.imagegallery = function (options, opts) {
        opts = $.extend({
            namespace: 'imagegallery',
            selector: $(this).selector
        }, opts);
        if (typeof options === 'string') {
            if (options === 'destroy') {
                $(opts.selector).die('click.' + opts.namespace);
            } else if (options === 'open') {
                $.fn.imagegallery.open(this, opts);
            }
            return this;
        }
        options = $.extend(opts, options);
        $(options.selector).live(
            'click.' + options.namespace,
            function (e) {
                e.preventDefault();
                $.fn.imagegallery.open(this, options);
            }
        );
        return this;
    };
    
    $.extend($.fn.imagegallery, {
        
        // Scales the given image (img HTML element)
        // using the given options.
        // Returns a canvas object if the canvas option is true
        // and the browser supports canvas, else the scaled image:
        scale: function (img, options) {
            options = options || {};
            var canvas = document.createElement('canvas'),
                scale = Math.min(
                    (options.maxWidth || img.width) / img.width,
                    (options.maxHeight || img.height) / img.height
                );
            if (scale >= 1) {
                scale = Math.max(
                    (options.minWidth || img.width) / img.width,
                    (options.minHeight || img.height) / img.height
                );
            }
            img.width = parseInt(img.width * scale, 10);
            img.height = parseInt(img.height * scale, 10);
            if (!options.canvas || !canvas.getContext) {
                return img;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d')
                .drawImage(img, 0, 0, img.width, img.height);
            return canvas;
        },
        
        _resetSpecialOptions: function (options) {
            delete options._img;
            delete options._overlay;
            delete options._dialog;
            delete options._slideShow;
            delete options._link;
            delete options._prevLink;
            delete options._nextLink;
            delete options._loadingAnimation;
            delete options._wheelCounter;
        },
        
        _openSibling: function (link, options) {
            var dialog = options._dialog;
            clearTimeout(options._slideShow);
            if (link.href !== options._link.href) {
                dialog.dialog('widget').hide(options.hide, function () {
                    options._overlay = $('.ui-widget-overlay:last')
                        .clone().appendTo(document.body);
                    dialog
                        .dialog('option', 'hide', null)
                        .dialog('close');
                    options.callback = function () {
                        options._overlay.remove();
                    };
                    delete options.title;
                    $.fn.imagegallery.open(link, options);
                });
            } else {
                dialog.dialog('close');
            }
        },
        
        _prev: function (options) {
            $.fn.imagegallery._openSibling(
                options._prevLink,
                options
            );
        },
        
        _next: function (options) {
            $.fn.imagegallery._openSibling(
                options._nextLink,
                options
            );
        },

        _keyHandler: function (e) {
            switch (e.which) {
            case 37: // left
            case 38: // up
                $.fn.imagegallery._prev(e.data);
                return false;
            case 39: // right
            case 40: // down
                $.fn.imagegallery._next(e.data);
                return false;
            }
        },
        
        _wheelHandler: function (e) {
            var counter = e.data._wheelCounter =
                    (e.data._wheelCounter || 0)
                    + (e.wheelDelta || e.detail || 0);
            if ((e.wheelDelta && counter >= 120) ||
                    (!e.wheelDelta && counter < 0)) {
                $.fn.imagegallery._prev(e.data);
                e.data._wheelCounter = 0;
            } else if ((e.wheelDelta && counter <= -120) ||
                        (!e.wheelDelta && counter > 0)) {
                $.fn.imagegallery._next(e.data);
                e.data._wheelCounter = 0;
            }
            return false;
        },
        
        _clickHandler: function (e) {
            if (e.altKey) {
                $.fn.imagegallery._prev(e.data);
            } else {
                $.fn.imagegallery._next(e.data);
            }
        },
        
        _overlayClickHandler: function (e) {
            var options = e.data;
            $(this).unbind(
                'click.' + options.namespace,
                $.fn.imagegallery._overlayClickHandler
            );
            options._dialog.dialog('close');
        },
        
        _openHandler: function (e) {
            var options = e.data;
            $(document.body).addClass(options.bodyClass);
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    $.fn.imagegallery._escapeHandler
                )
                .unbind(
                    'click.' + options.namespace,
                    $.fn.imagegallery._documentClickHandler
                );
            $('.ui-widget-overlay:last')
                .bind(
                    'click.' + options.namespace,
                    options,
                    $.fn.imagegallery._overlayClickHandler
                );
            if (options.callback) {
                options.callback();
            }
            // Preload the next and previous images:
            $('<img>').prop('src', options._nextLink.href);
            $('<img>').prop('src', options._prevLink.href);
            if (options.slideshow) {
                options._slideShow = setTimeout(
                    function () {
                        $.fn.imagegallery._next(options);
                    },
                    options.slideshow
                );
            }
        },

        _closeHandler: function (e) {
            var options = e.data;
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    $.fn.imagegallery._keyHandler
                )
                .unbind(
                    'mousewheel.' + options.namespace +
                        ', DOMMouseScroll.' + options.namespace,
                    $.fn.imagegallery._wheelHandler
                );
            clearTimeout(options._slideShow);
            if (!options._overlay) {
                $(document.body).removeClass(options.bodyClass);
            }
            $(this).remove();
        },

        _initDialogHandlers: function (options) {
            $(document)
                .bind(
                    'keydown.' + options.namespace,
                    options,
                    $.fn.imagegallery._keyHandler
                )
                .bind(
                    'mousewheel.' + options.namespace +
                        ', DOMMouseScroll.' + options.namespace,
                    options,
                    $.fn.imagegallery._wheelHandler
                );
            options._dialog
                .bind(
                    'click.' + options.namespace,
                    options,
                    $.fn.imagegallery._clickHandler
                )
                .bind(
                    'dialogopen.' + options.namespace,
                    options,
                    $.fn.imagegallery._openHandler
                )
                .bind(
                    'dialogclose.' + options.namespace,
                    options,
                    $.fn.imagegallery._closeHandler
                );
        },

        _loadHandler: function (e) {
            var dialog = $('<div></div>'),
                options = e.data,
                scaledImage = this;
            options._loadingAnimation.remove();
            if (e.type === 'error') {
                dialog.addClass('ui-state-error');
            } else {
                if (options.fullscreen) {
                    scaledImage = $.fn.imagegallery.scale(
                        scaledImage,
                        {
                            minWidth: $(window).width(),
                            minHeight: $(window).height()
                        }
                    );
                }
                scaledImage = $.fn.imagegallery.scale(
                    scaledImage,
                    {
                        maxWidth: $(window).width() -
                            options.offsetWidth,
                        maxHeight: $(window).height() -
                            options.offsetHeight,
                        canvas: options.canvas
                    }
                );
            }
            options._dialog = dialog;
            $.fn.imagegallery._initDialogHandlers(options);
            dialog
                .append(scaledImage)
                .appendTo(document.body)
                .dialog(options);
        },
        
        _initSiblings: function (options) {
            var link = options._link,
                links = $(
                    (options && options.selector) ||
                        'a[rel="' + (link.rel || 'gallery') + '"]'
                );
            links.each(function (index) {
                // Check the next and next but one link, to account for
                // thumbnail and name linking twice to the same image:
                if ((links[index + 1] === link ||
                        links[index + 2] === link) &&
                        this.href !== link.href) {
                    options._prevLink = this; 
                }
                if ((links[index - 1] === link ||
                        links[index - 2] === link) &&
                        this.href !== link.href) {
                    options._nextLink = this;
                    return false;
                }
            });
            if (!options._prevLink) {
                options._prevLink = links[links.length - 1];
            }
            if (!options._nextLink) {
                options._nextLink = links[0];
            }
        },
        
        _initLoadingAnimation: function (options) {
            // The loader is displayed until the image has loaded
            // and the dialog has been opened:
            options._loadingAnimation = $(
                '<div class="' + options.dialogClass + '-loader"></div>'
            ).hide().appendTo(document.body);
            // This prevents the loading animation to show
            // when the image has already been loaded:
            setTimeout(function () {
                options._loadingAnimation.show();
            }, 100);
        },
        
        _getRandomEffect: function () {
            return [
                'blind',
                'clip',
                'drop',
                'explode',
                'fade',
                'fold',
                'puff',
                'slide',
                'scale'
            ][Math.floor(Math.random() * 9)];
        },
        
        _initEffects: function (options) {
            if (options.show === 'random' || options._show === 'random') {
                options._show = 'random';
                options.show = $.fn.imagegallery._getRandomEffect();
            }
            if (options.hide === 'random' || options._hide === 'random') {
                options._hide = 'random';
                options.hide = $.fn.imagegallery._getRandomEffect();
            }
        },
        
        _abortLoading: function (options) {
            options._img
                .unbind(
                    'load.' + options.namespace +
                        ' error.' + options.namespace,
                    $.fn.imagegallery._loadHandler
                );
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    $.fn.imagegallery._escapeHandler
                )
                .unbind(
                    'click.' + options.namespace,
                    $.fn.imagegallery._documentClickHandler
                );
            $('.ui-widget-overlay:last').remove();
            options._loadingAnimation.remove();
            $(document.body).removeClass(options.bodyClass);
        },
        
        _escapeHandler: function (e) {
            if (e.keyCode === 27) { // ESC key
                $.fn.imagegallery._abortLoading(e.data);
            }
        },
        
        _documentClickHandler: function (e) {
            $.fn.imagegallery._abortLoading(e.data);
        },
        
        _loadImage: function (options) {
            options._img = $('<img>');
            $(document)
                .bind(
                    'keydown.' + options.namespace,
                    options,
                    $.fn.imagegallery._escapeHandler
                )
                .bind(
                    'click.' + options.namespace,
                    options,
                    $.fn.imagegallery._documentClickHandler
                );
            options._img
                .bind(
                    'load.' + options.namespace +
                        ' error.' + options.namespace,
                    options,
                    $.fn.imagegallery._loadHandler
                ).prop('src', options._link.href);
        },
        
        // Opens the image of the given link in a jQuery UI dialog
        // and provides gallery functionality for related images:
        open: function (link, options) {
            link = link instanceof $ ? link[0] : link;
            var className = (link.rel || 'gallery').replace(/\W/g, '');
            options = $.extend({
                namespace: 'imagegallery',
                offsetWidth: 100,
                offsetHeight: 100,
                modal: true,
                resizable: false,
                width: 'auto',
                height: 'auto',
                show: 'fade',
                hide: 'fade',
                title: link.title ||
                    decodeURIComponent(link.href.split('/').pop()),
                dialogClass: className + '-dialog',
                bodyClass: className + '-body'
            }, options);
            if (options.fullscreen) {
                options.offsetWidth = 0;
                options.offsetHeight = 0;
                options.dialogClass = options.dialogClass
                    .replace(/dialog$/, 'dialog-fullscreen');
                options.bodyClass = options.bodyClass
                    .replace(/body$/, 'body-fullscreen');
            }
            $.fn.imagegallery._resetSpecialOptions(options);
            options._link = link;
            $.fn.imagegallery._initSiblings(options);
            $.fn.imagegallery._initLoadingAnimation(options);
            $.fn.imagegallery._initEffects(options);
            $.fn.imagegallery._loadImage(options);
        }
        
    });

}(jQuery));