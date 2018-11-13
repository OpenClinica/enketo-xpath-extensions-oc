module.exports = ( grunt ) => {

    grunt.initConfig( {
        karma: {
            options: {
                singleRun: true,
                reporters: [ 'dots' ],
                configFile: 'test/karma.conf.js',
            },
            headless: {
                browsers: [ 'ChromeHeadless' ]
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-karma' );
};
