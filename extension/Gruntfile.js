module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            sass: {
                files: [
                    'coffee/*.coffee'
                ],
                tasks: ['coffee'],
                options: {
                    spawn: false
                }
            }
        },
        sass: {
            dev: {
                files: {
                }
            }
        },
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'coffee/',
                src: ['*.coffee'],
                dest: '',
                ext: '.js'
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
};