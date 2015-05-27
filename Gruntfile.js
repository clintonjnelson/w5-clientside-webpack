'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean'  );
  grunt.loadNpmTasks('grunt-contrib-copy'   );
  grunt.loadNpmTasks('grunt-contrib-jshint' );
  grunt.loadNpmTasks('grunt-jscs'           );
  grunt.loadNpmTasks('grunt-mocha-test'     );
  grunt.loadNpmTasks('grunt-webpack'        );

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dev: {
        src: 'build/'
      }
    },
    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      }
    },
    jscs: {
      src: ['Gruntfile.js',
              '*.js',
              'models/**/*.js',
              'routes/**/*.js',
              'test/**/*.js'
               ],
      options: {
        requireCurlyBraces: [false],
        verbose: true
      }
    },
    jshint: {
      dev: {
        src: ['Gruntfile.js',
              'package.json',
              // '*.js',
              'models/**/*.js',
              'routes/**/*.js',
              'test/**/*test.js'
               ]
      },
      options: {
        jshintrc: true
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: false,
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/**/*_test.js']
      }
    },
    webpack: {
      client: {
        entry: __dirname + '/app/js/client.js',
        output: {
          path: 'build/',
          file: 'bundle.js'
        },
        stats: {
          colors: true
        },
        failOnError: false,
        watch: true,
        keepalive: true
      },
      test: {
        entry: __dirname + '/test/client/test.js',
        output: {
          path: 'test/client/',
          file: 'testbundle.js'
        },
        stats: {
          colors: true
        },
        failOnError: false,
        watch: true,
        keepalive: true
      }
    }
  });

  // Custom Task Chains
  grunt.registerTask('test',       ['jshint:dev', 'jscs', 'mochaTest']);
  grunt.registerTask('build:dev',  ['copy:html', 'webpack:client'    ]);
  grunt.registerTask('build:test', ['copy:html', 'webpack:test'      ]);
  grunt.registerTask('build',      ['build:dev'                      ]);
  grunt.registerTask('default',    ['test', 'build'                  ]);
};
