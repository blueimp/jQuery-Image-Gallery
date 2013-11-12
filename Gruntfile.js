/*
 * jQuery Image Gallery Gruntfile
 * https://github.com/blueimp/jQuery-Image-Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'js/jquery.image-gallery.js',
                'js/demo.js'
            ]
        },
        uglify: {
            production: {
                src: [
                    'js/jquery.image-gallery.js'
                ],
                dest: 'js/jquery.image-gallery.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bump-build-git');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test', 'uglify']);

};
