var fs = require('fs');
var tmp = require('temporary');

module.exports = function (grunt) {
    var aws = {}, tmpTemplateFile = new tmp.File();
    if (fs.existsSync('.grunt-aws')) {
        aws = grunt.file.readJSON('.grunt-aws');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        checkDependencies: {
             this: {
                options: {
                    //install: true,
                    verbose: true,
                    scopeList: ['devDependencies', 'dependencies']
                },
            },
        },
        less: {
          basicExample: {
            options: {
                compress: true,
                sourceMap: false
            },
            files: {
                'build/css/nfhs.css': 'src/less/nfhs.less',
                'build/usa_today.css': 'examples/usa_today.less',
                'build/css/base.css': 'src/less/base/base.less'
            }
          }
        },
        uglify: {
            widget: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true,
                    mangle: false,
                    ASCIIOnly: true,
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'build/hsgc-widgets.js': [
                      'bower_components/angular/angular.js',
                      'bower_components/paper/dist/paper-core.js',
                      'src/js/app.js',
                      tmpTemplateFile.path,
                      'src/js/*/*.js'
                    ]
                }
            },
            widget_no_angular: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true,
                    mangle: false,
                },
                files: {
                    'build/hsgc-widgets.bare.js': [
                      'src/js/app.js',
                      tmpTemplateFile.path,
                      'src/js/*/*.js'
                    ]
                }
            },
            widget_min: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    compress: true,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    ASCIIOnly: true
                },
                files: {
                    'build/hsgc-widgets.min.js': [
                      'bower_components/angular/angular.js',
                      'bower_components/paper/dist/paper-core.js',
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
                },
                {
                    cwd: "examples",
                    src: "*.png",
                    dest: 'build',
                    expand: true
                },
                {
                    cwd: "src/img",
                    src: "**.*",
                    dest: 'build/img',
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
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true,
                    svgoPlugins: [{removeUselessStrokeAndFill: false}]
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'src/'
                }]
            }
        },
        aws: aws,
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>',
                secretAccessKey: '<%= aws.secret %>',
                access: 'public-read',
                region: 'us-east-1',
                bucket: 'cdn.hsgamecenter.com',
                sslEnabled: true,
                progress: 'progressBar',
                uploadConcurrency: 5,
                headers: {
                    // 24 hour cache policy (1000 * 60 * 60 * 24)
                    "Cache-Control": "max-age=86400000, public",
                    "Expires": new Date(Date.now() + 86400000).toUTCString()
                }
            },
            dev: {
                options: {
                    debug: false    // set debug: true to see how paths are mapped without actually uploading to S3
                },
                files: [
                    {
                        expand: true,
                        src: '**',
                        cwd: 'build',
                        dest: 'js/<%= pkg.name %>/<%= pkg.version.substr(0, pkg.version.indexOf("-") > 0 ? pkg.version.indexOf("-") : pkg.version.length ) %>'
                    }
                ]
            }
        },
        watch: {
            files: {
                files: ['src/js/**/*.js', 'src/templates/*.html', 'examples/*.*', 'src/less/**/*.less'],
                tasks: ['build'],
                options: {
                    livereload: {
                        port: 35729,
                        key: grunt.file.read('development.key').toString(),
                        cert: grunt.file.read('development.crt').toString(),
                    }
                },
            },
        },
        connect: {
            server: {
                options: {
                    port: 3001,
                    protocol: 'https',
                    key: grunt.file.read('development.key').toString(),
                    cert: grunt.file.read('development.crt').toString(),
                    base: './build',
                    // livereload only works in linux; for windows, have to manually replace with <script src="//localhost:35729/livereload.js?snipver=1" async="" defer=""></script>
                    // livereload: 35729
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-check-dependencies');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('build', ['checkDependencies','ngtemplates', 'less', 'uglify', 'copy']);
    grunt.registerTask('optimize', ['imagemin']);
    grunt.registerTask('deploy', ['build', 'aws_s3']);
    grunt.registerTask('default', ['build', 'connect', 'watch']);
};
