module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect : {
			server : {
				options : {
					port      : 8000,
					hostname  : 'localhost',
					base      : '.',
					keepalive : true,
					debug     : true,
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	
	// Default task(s).
	grunt.registerTask('default', ['connect']);

};
