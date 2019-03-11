

module.exports = function(grunt) {

        // Set a common var for the package.json to parse it later...
    var npmPackage = grunt.file.readJSON('package.json');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngtemplates : {
            "templates" : {
                src : "js/partials/**.html",
                dest : "js/templates.js",
                options : {


                }
            }
        }, 
        copy : {

            update : (function () {

                var files = [];

                //console.log(npmPackage.dependencies)

                for(var i in npmPackage.dependencies) {

                    files.push({expand: true, cwd : './node_modules/', src : [i+'/**'], dest: 'vendor/'});
                }

                return { files: files };

            })()
        },
        watch: {
            css: {
                debugInfo : true,
                files: './**/*.scss',
                tasks: ['sass']
            },
            concat: {
                files:'js/**/*',
                tasks: ['ngtemplates', 'copy', 'concat']
            },
        },
        concat: {
            options: {
                separator: '',
                sourceMap: true

            },
            dist: {
                src: ['js/**/*.js', 'tmp/templates.js'],
                dest: 'build/nivel.js',
            },
        },
        
    });


        // Register tasks
    grunt.registerTask('dev', [
        'ngtemplates',
        "copy",
        "concat",
        "watch:concat"
    ]);


    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-angular-templates');


}