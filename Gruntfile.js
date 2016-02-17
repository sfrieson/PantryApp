module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['angular/**/*.js'],
                dest: 'public/js/app.js'
            }
        },
        uglify: {
            dist:{
            files: {
                'public/js/app.min.js':['public/js/app.js']
            }}
        },
        watch: {
            files: ['angular/**/*'],
            tasks: ['concat', 'uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
