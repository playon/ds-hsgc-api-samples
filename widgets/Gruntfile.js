var tmp = require('temporary');

module.exports = function (grunt) {
    var tmpTemplateFile = new tmp.File();

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
          basicExample: {
            files: {
                'build/basic.css': 'examples/basic.less',
                'build/nfhs.css': 'examples/nfhs.less'
            }
          }
        },
        uglify: {
            widget_js: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    beautify: true,
                    mangle: false
                },
                files: {
                    'build/hsgc-widgets.min.js': [
                      'src/js/vendor/angular.js',
                      'src/js/app.js',
                      tmpTemplateFile.path,
                      'src/js/*/*.js'
                    ]
                }
            }
        },
        copy: {
            examples: {
                files: [{
                    cwd: "examples",
                    src: "*.html",
                    dest: 'build',
                    expand: true
                }]
            }
        },
        ngtemplates: {
            hsgc: {
                cwd: 'src',
                src: 'templates/**.html',
                dest: tmpTemplateFile.path,
                options: {
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
                    append: true
                }
            }
        },
        aws: grunt.file.readJSON('.grunt-aws'),
        s3: {
            options: {
                access: 'public-read',
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                bucket: 'cdn.hsgamecenter.com',
                headers: {
                    // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
                    "Cache-Control": "max-age=630720000, public",
                    "Expires": new Date(Date.now() + 63072000000).toUTCString()
                }
            },
            dev: {
                upload: [
                  {
                      src: 'build/*.*',
                      dest: 'js/<%= pkg.name %>/<%= pkg.version.substr(0, pkg.version.indexOf("-") > 0 ? pkg.version.indexOf("-") : pkg.version.length ) %>'
                  }
                ]
            }
        },
        'string-replace': {
            clientVersion: {
            src: 'build/hsgc-widgets.min.js',
            dest: 'build/hsgc-widgets.min.js',
            options: {
                replacements: [
                    {
                        pattern: /["|']HSGC-Client-Version["|']\s*:\s*["|'].*?["|']/i,
                        replacement: '"HSGC-Client-Version" : "<%= pkg.version %>"'
                    }
                ]
            }
            }
        },
        watch: {
            files: {
                files: ['src/js/**/*.js', 'src/templates/*.html', 'examples/*.*'],
                tasks: ['build'],
                options: {
                    livereload: true
                },
            },
        },
        connect: {
            server: {
                options: {
                    port: 3001,
                    base: './build'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('build', ['ngtemplates', 'less', 'uglify', 'copy', 'string-replace']);
    grunt.registerTask('deploy', ['build', 's3']);
    grunt.registerTask('default', ['build', 'connect', 'watch']);
};
