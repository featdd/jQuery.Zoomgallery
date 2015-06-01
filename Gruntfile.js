'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'jQuery.Zoomgallery.js'
			]
		},
		uglify: {
			dist: {
				files: {
					'jQuery.Zoomgallery.min.js': [
						'bower_components/jQuery.SimpleSwipe.js/jQuery.SimpleSwipe.min.js',
						'jQuery.Zoomgallery.js'
					]
				}
			}
		},
		sass: {
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'.temp/Zoomgallery.css': 'Zoomgallery.scss'
				}
			}
		},
		cssmin: {
			dist: {
				src: ['.temp/Zoomgallery.css'],
				dest: 'Zoomgallery.min.css'
			}
		},
		clean: [
			'.temp',
			'.sass-cache'
		]
	});

	grunt.registerTask('build', ['jshint', 'uglify', 'sass', 'cssmin', 'clean']);
};
