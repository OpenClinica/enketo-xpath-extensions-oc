module.exports = ( grunt ) => {

    grunt.initConfig( {
        karma: {
            options: {
                singleRun: true,
                reporters: [ 'dots' ],
                configFile: 'test/karma.conf.js',
                customLaunchers: {
                    ChromeHeadlessNoSandbox: {
                        base: 'ChromeHeadless',
                        flags: [ '--no-sandbox' ]
                    }
                }
            },
            headless: {
                browsers: [ 'ChromeHeadlessNoSandbox' ]
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-karma' );
};
