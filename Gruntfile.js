var glob = require('glob'),
	path = require('path'),
	teamcity = require('release-helpers').teamcity,
	release = require('release-helpers').release;



module.exports = function(grunt) {
	'use strict';

	var isDevelopmentRun = !grunt.option('prod'),
		testsReporters = ['coverage'],
		coverageReporters = [
			{type: 'html', dir:'coverage/'}
		],
		pkg = grunt.file.readJSON('package.json');


	function tcSetBuildVersion() {
		teamcity.setBuildVersion();
	}

	function versionBump() {
		var done = this.async(),
			type = grunt.option('type');

		if (teamcity.isCiRun()) {
			type = teamcity.getProperty('release.type');
		}

		release.versionBump(type, done);
		teamcity.setBuildVersion();
	}

	if (!isDevelopmentRun) {
		testsReporters.push('teamcity');
		coverageReporters.push({type: 'teamcity'});


	} else {
		testsReporters.push('dots');
		coverageReporters.push({type: 'text'});
	}

	grunt.initConfig({
		pkg: pkg,
		phantomFolder: function() {
			return path.join(__dirname, glob.sync('coverage/*')[0]);
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['src/js/**/*.js']
		},
		clean: {
			coverage: ['coverage/'],
			docs: ['docs/'],
			test: ['test/js/styles/**/*.css']
		},

		karma: {
			options: {
				autoWatch: isDevelopmentRun,
				singleRun: !isDevelopmentRun
			},
			unit: {
				configFile: 'karma.unit.conf.js',
				browsers: ['PhantomJS'],
				reporters: testsReporters,
				coverageReporter: {
					reporters: coverageReporters
				}
			},
			ui: {
				configFile: 'karma.ui.conf.js',
				browsers: ['Chrome'],
				reporters: testsReporters
			}
		},

		jscs: {
			options: {
				config: '.jscsrc'
			},
			src: 'src/js/**/*.js'
		},

		copy: {
			coverage:{
				files: [
					{src: ['**'], cwd: '<%= phantomFolder() %>', expand: true, dest: 'coverage'}
				]
			}
		},

		jsdoc: {
			docs: {
				src: ['src/js/**/*.js'],
				dest: 'docs'
			}
		},

		stylus: {
			test: {
				files: {
					'test/js/styles/test.css': ['test/js/styles/test.styl']
				}
			}
		},

		connect: {
			test: {
				options: {
					port: 3000,
					hostname: '0.0.0.0',
					base: '.'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('version_bump', versionBump);
	grunt.registerTask('tc_set_build_version', tcSetBuildVersion);
	grunt.registerTask('docs', ['clean:docs', 'jsdoc:docs']);
	grunt.registerTask('check_style', ['jscs', 'jshint']);
	grunt.registerTask('test_unit', ['clean:coverage', 'karma:unit', 'copy:coverage']);
	grunt.registerTask('test_ui', ['clean:test', 'stylus:test', 'connect:test', 'karma:ui']);
	grunt.registerTask('test', ['check_style', 'test_unit', 'test_ui']);
	grunt.registerTask('build', ['tc_set_build_version']);
	grunt.registerTask('default', ['build', 'test']);
	grunt.registerTask('release', ['version_bump', 'docs'])
};