.PHONY: default css js

default: css js

css:
	node_modules/.bin/lessc --yui-compress css/jquery.image-gallery.css > css/jquery.image-gallery.min.css

js:
	node_modules/.bin/uglifyjs js/load-image.js js/jquery.image-gallery.js -c -m -o js/jquery.image-gallery.min.js
