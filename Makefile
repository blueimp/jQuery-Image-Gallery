.PHONY: default css js

default: css js

css:
	lessc --compress css/jquery.image-gallery.css > css/jquery.image-gallery.min.css

js:
	uglifyjs -nc js/jquery.image-gallery.js > js/jquery.image-gallery.min.js
