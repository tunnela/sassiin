module.exports = function(grunt) {
	grunt.initConfig({
		release: {
		}
	});

	grunt.loadNpmTasks('grunt-release');
	grunt.registerTask('release', ['release']);
};