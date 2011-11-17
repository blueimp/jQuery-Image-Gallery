/*
 * jQuery Image Gallery Plugin 2.1
 * https://github.com/blueimp/jQuery-Image-Gallery
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint white: true, nomen: true */
/*global jQuery, window, document, setTimeout, clearTimeout */

(function ($) {
    'use strict';

    // The Image Gallery plugin makes use of jQuery's delegate method to attach
    // a click event handler for all child elements matching a selector,
    // now or in the future, of the given set of root elements.
    // The click handler opens the linked images in a jQuery UI dialog.
    // The options object given to the imagegallery method is passed to the
    // jQuery UI dialog initialization and allows to override any dialog options.
    $.widget('blueimp.imagegallery', {
        
        options: {
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
        },
        
        // Scales the given image (img HTML element)
        // using the given options.
        // Returns a canvas object if the canvas option is true
        // and the browser supports canvas, else the scaled image:
        _scale: function (img, options) {
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
        
        _getOverlay: function () {
            return $(document.body)
                .children('.ui-widget-overlay').last();
        },
        
        _openSibling: function (link) {
            var that = this,
                dialog = this._dialog;
            clearTimeout(this._slideShow);
            this._slideShow = null;
            if (link.href !== this._link.href) {
                dialog.dialog('widget').hide(this.options.hide, function () {
                    that._overlay = that._getOverlay().clone()
                        .appendTo(document.body);
                    dialog
                        .dialog('option', 'hide', null)
                        .dialog('close');
                    that._callback = function () {
                        that._overlay.remove();
                        that._overlay = null;
                    };
                    that._open(link);
                });
            } else {
                dialog.dialog('close');
            }
        },
        
        _prev: function () {
            this._openSibling(this._prevLink);
        },
        
        _next: function () {
            this._openSibling(this._nextLink);
        },

        _keyHandler: function (e) {
            var that = e.data.imagegallery;
            switch (e.which) {
            case 37: // left
            case 38: // up
                that._prev();
                return false;
            case 39: // right
            case 40: // down
                that._next();
                return false;
            }
        },
        
        _wheelHandler: function (e) {
            var that = e.data.imagegallery;
            e = e.originalEvent;
            that._wheelCounter += (e.wheelDelta || e.detail || 0);
            if ((e.wheelDelta && that._wheelCounter >= 120) ||
                    (!e.wheelDelta && that._wheelCounter < 0)) {
                that._prev();
                that._wheelCounter = 0;
            } else if ((e.wheelDelta && that._wheelCounter <= -120) ||
                        (!e.wheelDelta && that._wheelCounter > 0)) {
                that._next();
                that._wheelCounter = 0;
            }
            return false;
        },
        
        _clickHandler: function (e) {
            var that = e.data.imagegallery;
            if (e.altKey) {
                that._prev();
            } else {
                that._next();
            }
        },
        
        _overlayClickHandler: function (e) {
            var that = e.data.imagegallery;
            $(this).unbind(
                'click.' + that.options.namespace,
                that._overlayClickHandler
            );
            that._dialog.dialog('close');
        },
        
        _openHandler: function (e) {
            var that = e.data.imagegallery,
                options = that.options;
            $(document.body).addClass(options.bodyClass);
            that._getOverlay()
                .bind(
                    'click.' + options.namespace,
                    e.data,
                    that._overlayClickHandler
                );
            if (that._callback) {
                that._callback();
                that._callback = null;
            }
            if (options.slideshow) {
                that._slideShow = setTimeout(
                    function () {
                        that._next();
                    },
                    options.slideshow
                );
            }
        },

        _closeHandler: function (e) {
            var that = e.data.imagegallery,
                options = that.options;
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    that._keyHandler
                )
                .unbind(
                    'mousewheel.' + options.namespace +
                        ', DOMMouseScroll.' + options.namespace,
                    that._wheelHandler
                );
            clearTimeout(that._slideShow);
            that._slideShow = null;
            if (!that._overlay) {
                $(document.body).removeClass(options.bodyClass);
                that._position = null;
            }
            that._dialog.remove();
            that._dialog = null;
        },
        
        _dragStopHandler: function (e, ui) {
            var that = e.data.imagegallery;
            that._position = ui.position;
        },

        _initDialogHandlers: function () {
            var that = this,
                options = this.options,
                eventData = {imagegallery: this};
            $(document)
                .bind(
                    'keydown.' + options.namespace,
                    eventData,
                    this._keyHandler
                )
                .bind(
                    'mousewheel.' + options.namespace +
                        ', DOMMouseScroll.' + options.namespace,
                    eventData,
                    this._wheelHandler
                );
            that._dialog
                .bind(
                    'click.' + options.namespace,
                    eventData,
                    this._clickHandler
                )
                .bind(
                    'dialogopen.' + options.namespace,
                    eventData,
                    this._openHandler
                )
                .bind(
                    'dialogclose.' + options.namespace,
                    eventData,
                    this._closeHandler
                )
                .bind(
                    'dialogdragstop.' + options.namespace,
                    eventData,
                    this._dragStopHandler
                );
        },

        _loadHandler: function (e) {
            var that = e.data.imagegallery,
                options = that.options,
                img = that._img && that._img[0],
                offsetWidth = options.offsetWidth,
                offsetHeight = options.offsetHeight;
            if (!img) {
                return;
            }
            that._dialog = $('<div></div>');    
            that._loaded = true;
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    that._escapeHandler
                )
                .unbind(
                    'click.' + options.namespace,
                    that._documentClickHandler
                );
            that._img = null;
            that._loadingAnimation.hide();
            if (e.type === 'error') {
                that._dialog.addClass('ui-state-error');
            } else {
                if (options.fullscreen) {
                    img = that._scale(
                        img,
                        {
                            minWidth: $(window).width(),
                            minHeight: $(window).height()
                        }
                    );
                    offsetWidth = offsetHeight = 0;
                }
                img = that._scale(
                    img,
                    {
                        maxWidth: $(window).width() - offsetWidth,
                        maxHeight: $(window).height() - offsetHeight,
                        canvas: options.canvas
                    }
                );
            }
            that._initDialogHandlers();
            if (that._position) {
                options = $.extend({}, options, {position: [
                    that._position.left,
                    that._position.top
                ]});
            }
            that._dialog
                .append(img)
                .appendTo(document.body)
                .dialog(options);
        },
        
        _abortLoading: function () {
            var options = this.options;
            this._img.unbind();
            $(document)
                .unbind(
                    'keydown.' + options.namespace,
                    this._escapeHandler
                )
                .unbind(
                    'click.' + options.namespace,
                    this._documentClickHandler
                );
            this._getOverlay().remove();
            this._loadingAnimation.hide();
            $(document.body).removeClass(options.bodyClass);
        },
        
        _escapeHandler: function (e) {
            if (e.keyCode === 27) { // ESC key
                e.data.imagegallery._abortLoading();
            }
        },
        
        _documentClickHandler: function (e) {
            var that = e.data.imagegallery;
            // The closest() test prevents the click event
            // bubbling up from aborting the image load:
            if (!$(e.target).closest(that._link).length) {
                that._abortLoading();
            }
        },
        
        _loadImage: function () {
            var that = this,
                options = this.options,
                eventData = {imagegallery: this};
            this._img = $('<img>');
            $(document)
                .bind(
                    'keydown.' + options.namespace,
                    eventData,
                    this._escapeHandler
                )
                .bind(
                    'click.' + options.namespace,
                    eventData,
                    this._documentClickHandler
                );
            that._loaded = null;
            this._img.bind(
                'load error',
                eventData,
                this._loadHandler
            ).prop('src', this._link.href);
            // The timeout prevents the loading animation to show
            // when the image has already been loaded:
            setTimeout(function () {
                if (!that._loaded) {
                    that._loadingAnimation.show();
                }
            }, 100);
        },

        _preloadSiblings: function () {
            // Preload the next and previous images:
            $('<img>').prop('src', this._nextLink.href);
            $('<img>').prop('src', this._prevLink.href);
        },

        _initSiblings: function () {
            var that = this,
                link = this._link,
                links = this.element.find(this.options.selector);
            this._prevLink = null;
            this._nextLink = null;
            links.each(function (index) {
                // Check the next and next but one link, to account for
                // thumbnail and name linking twice to the same image:
                if ((links[index + 1] === link ||
                        links[index + 2] === link) &&
                        this.href !== link.href) {
                    that._prevLink = this; 
                }
                if ((links[index - 1] === link ||
                        links[index - 2] === link) &&
                        this.href !== link.href) {
                    that._nextLink = this;
                    return false;
                }
            });
            if (!this._prevLink) {
                this._prevLink = links[links.length - 1];
            }
            if (!this._nextLink) {
                this._nextLink = links[0];
            }
        },

        _getRandomEffect: function () {
            var effects = this.options.effects;
            return effects[Math.floor(Math.random() * effects.length)];
        },
        
        _initEffects: function () {
            var options = this.options;
            if (options.show === 'random' || this._show === 'random') {
                this._show = 'random';
                options.show = this._getRandomEffect();
            }
            if (options.hide === 'random' || this._hide === 'random') {
                this._hide = 'random';
                options.hide = this._getRandomEffect();
            }
        },

        _open: function (link) {
            if (this._dialog) {
                var copy = $.extend({}, this);
                copy._dialog = null;
                copy._position = null;
                copy._open(link);
                return;
            }
            this.options.title = link.title ||
                decodeURIComponent(link.href.split('/').pop());
            this._link = link;
            this._initEffects();
            this._loadImage();
            this._initSiblings();
            this._preloadSiblings();
        },

        _initFullscreenOptions: function () {
            var options = this.options;
            if (options.fullscreen) {
                if (!/-fullscreen$/.test(options.dialogClass)) {
                    options.dialogClass += '-fullscreen';
                }
                if (!/-fullscreen$/.test(options.bodyClass)) {
                    options.bodyClass += '-fullscreen';
                }
            } else {
                options.dialogClass = options.dialogClass
                    .replace(/-fullscreen$/, '');
                options.bodyClass = options.bodyClass
                    .replace(/-fullscreen$/, '');
            }
        },

        _initLoadingAnimation: function () {
            this._loadingAnimation = $(
                '<div id="' +
                    this.options.loaderId +
                    '"></div>'
            ).hide().appendTo(document.body);
        },
        
        _destroyLoadingAnimation: function () {
            this._loadingAnimation.remove();
            this._loadingAnimation = null;
        },
        
        _delegate: function () {
            var that = this,
                options = this.options;
            this.element.delegate(
                options.selector,
                'click.' + options.namespace,
                function (e) {
                    e.preventDefault();
                    that._open(this);
                }
            );
        },
        
        _undelegate: function () {
            this.element.undelegate(
                this.options.selector,
                'click.' + this.options.namespace
            );
        },
        
        _setOption: function (key, value) {
            this._show = this._hide = null;
            var refresh = (key === 'namespace' || key === 'selector');
            if (refresh) {
                this._undelegate();
            }
            $.Widget.prototype._setOption.call(this, key, value);
            if (refresh) {
                this._delegate();
            }
            if ($.inArray(
                    key,
                    ['fullscreen', 'dialogClass', 'bodyClass']
                ) !== -1) {
                this._initFullscreenOptions();
            }
        },
        
        _create: function () {
            this._wheelCounter = 0;
            this._initLoadingAnimation();
            this._initFullscreenOptions();
            this._delegate();
        },
        
        destroy: function () {
            clearTimeout(this._slideShow);
            this._slideShow = null;
            if (this._dialog) {
                this._dialog.dialog('close');
            }
            this._undelegate();
            this._destroyLoadingAnimation();
            $.Widget.prototype.destroy.call(this);
        },

        enable: function () {
            $.Widget.prototype.enable.call(this);
            this._delegate();
        },
        
        disable: function () {
            clearTimeout(this._slideShow);
            this._slideShow = null;
            this._undelegate();
            $.Widget.prototype.disable.call(this);
        }
        
    });

}(jQuery));