/* 
	This is the Grunt Workflow for small projects
	Author: Spotful Team
*/

'use strict';

//  Grunt Module
module.exports = function (grunt) {


    // Set a common var for the package.json to parse it later...
    var npmPackage = grunt.file.readJSON('package.json');

    // Time that shiz
    require('time-grunt')(grunt);

    // Configuration
    grunt.initConfig({

        projectConfig: require('./Grunt.config'),

        // Get Meta Data
        pkg: grunt.file.readJSON('package.json'),

        // Watch for changes in .scss files, & autoprefix them css
        watch: {
            src: {
                files: '<%= projectConfig.dev %>/**',
                tasks: ['mustache_html:dev', 'concat:js', 'copy:bootstrap', 'postcss:custom']
            }
        },
        // Concatenation
        concat: {
            options: {
                separator: '\n',
            },
            js: {
                src: ['<%= projectConfig.js %>/**/*.js'],
                dest: '<%= projectConfig.dist %>/app.js',
            },
        },
        // Copy
        copy: {
            vendor:
                (function () {
                    
                    var files = [];

                    for(var i in npmPackage.dependencies) {

                        files.push({expand: true, cwd : './node_modules/', src : [i+'/**'], dest: 'vendor/'});
                    }

                    return { files: files };

            })(),
            bootstrap : {
                expand: true,
                cwd: '<%= projectConfig.vendor %>/bootstrap/dist/',
                src: ['css/bootstrap.min.css', 'js/bootstrap.min.js'],
                dest: '<%= projectConfig.dist %>'
            },
            popper : {
                expand: true,
                cwd: '<%= projectConfig.vendor %>/popper.js/dist/umd',
                src: ['popper.js'],
                dest: '<%= projectConfig.dist %>/js'

            },
            html: {
                expand: true,
                cwd: '<%= projectConfig.html %>/',
                src: ['**', '*.html'],
                dest: '<%= projectConfig.dist %>/'
            }
        },
        // Uglify
        uglify: {
            options: {
                expand: false,
                mangle: false,
                compress : {
                    drop_console : true
                }
            },
            dist: {
                files: {
                    '<%= projectConfig.dist %>/app.min.js' : '<%= projectConfig.dist %>/app.js'
                }
            }
        },
        // Clean
        // for cleaning up dist directory
        clean: {
            temp: {
                src: '<%= projectConfig.temp %>'
            },
            dist: {
                src: '<%= projectConfig.dist %>'
            }
        },

        mustache_html: {
            dev: {
                options: {
                    src: 'src/html',
                    dist: 'dist',
                    type: 'html' // mustache Or hbs
                },
                globals: {
                //analytics_id: 'UA-123456-1'
                }
            }
        },

        
        // Browser Sync Config
        browserSync: {
            dev: {
                bsFiles: {
                    // Refresh on these changes...
                    src: [
                        '<%= projectConfig.dist %>/*'
                    ]
                },
                options: {
                    startPath:'demo',
                    server: {
                        baseDir: '<%= projectConfig.dist %>/',
                        middleware: function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            next();
                        }
                    },
                    watchTask: true,
                    browser: "<%= projectConfig.browser %>",
                    // The index file to serve
                    //proxy: "http://localhost:7000/<%= projectConfig.index %>",
                }
            }
        },

        // AWS S3
        aws_s3: {
            options: {
                accessKeyId: '<%= projectConfig.aws.accessKeyId %>', // Use the variables
                secretAccessKey: '<%= projectConfig.aws.secretAccessKey %>', // You can also use env variables
                region: 'us-east-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            deploy: {
                options: {
                    bucket: 'spotful-apps',
                    differential: true, // Only uploads the files that have changed
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: npmPackage.name+'/'+npmPackage.version+'/'}
                ]
            }
        },

        // Postcss / Autoprefixer config
        postcss: {
            options: {
                map: false,
                processors: [
		        require('autoprefixer')({
                    browsers: ['> 0.5%', 'Explorer 10']
                })
		      ]
            },
            custom: {
                files: {
                    '<%= projectConfig.dist %>/css/main.css': '<%= projectConfig.scss %>/main.scss'
                }
            }
        }

    });
    
    // Automatically load Grunt plugins
    require('load-grunt-tasks')(grunt);

    // Register tasks
    grunt.registerTask('dev', [
            'clean:temp',
            'copy:bootstrap',
            'copy:popper',
            'mustache_html:dev',
            'postcss:custom',
            'browserSync:dev',
            'watch'
    ]);

    grunt.registerTask('update',[
        "copy:vendor"
    ]);


    grunt.registerTask('build', [
        'clean:dist',
        'copy:bootstrap',
        'copy:html'
    ]);

    grunt.registerTask('deploy', ['aws_s3']);

    
    // default: alias for the build task
    grunt.registerTask('default', ['build']);

};