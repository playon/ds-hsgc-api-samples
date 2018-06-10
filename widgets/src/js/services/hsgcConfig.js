/* jshint -W014 */
angular.module('hsgc').provider('hsgcConfig', function() {
    this.config = {
        env: 'prod',
        keyStrategy: 'hsgc',    // can be "hsgc", "unity" (deprecated), or "ds-key"
        apiKey: '', // only used, and is required in this case, when using the "ds-key" keyStrategy
        gaTracker: 'UA-27695189-2', // Google Analytics tracker code
        //if apiRoot set here, overrides the versions that are usually loaded based on "env"
        //apiRoot: "https://api.digitalscout.com/v1.2/",
        logoStdResWidth: 60, // must be updated here and in `mixins.less: .widget-logo-large`
        logoStdResHeight: 60, // must be updated here and in `mixins.less: .widget-logo-large`
        logoHighResWidth: 120, // must be logoStdResWidth * 2
        logoHighResHeight: 120, // must be logoStdResHeight * 2
        apiNetworkTimeoutMs: 30000,
        showTeamLinks: true,
        datacastLoaded: function() {},
        beforeLoadDatacast: function(gameKey, publisherKey, cb) {
            // the default handler does nothing but call the callback
            // but some keyStrategy types may override this, or the
            // calling code can implement their own
            cb();
        },
        fullBoxScoreFirstLoaded: function() {},
        datacastLoadError: function() {},
        datacastPaymentRequired: function() {}
    };

    this.$get = function() {
        this.config.apiRoot = this.config.apiRoot || this.getHsgcApiRoot();
        this.config.statsRoot =
            this.config.statsRoot || this.getHsgcStatsRoot();
        this.config.unityRoot = this.config.unityRoot || this.getUnityApiRoot();
        return this.config;
    };

    this.set = function(settings) {
        angular.extend(this.config, settings);
    };

    this.getHsgcApiRoot = function() {
        return this.config.env === 'prod'
            ? 'https://api-cf.digitalscout.com/v1.2/'
            : this.config.env === 'stage'
                ? 'https://api-stage.digitalscout.com/v1.2/'
                : 'https://api.gamecenter.dev/';
    };

    this.getHsgcStatsRoot = function() {
        return this.config.env === 'prod'
            ? 'https://stats.digitalscout.com/'
            : this.config.env === 'stage'
                ? 'https://stats-stage.digitalscout.com/'
                : 'https://stats.gamecenter.dev/';
    };

    this.getUnityApiRoot = function() {
        return this.config.env === 'prod'
            ? 'https://cfunity.nfhsnetwork.com/v1/'
            : this.config.env === 'stage'
                ? 'https://unity.stage.nfhsnetwork.com/v1/'
                : 'http://localhost:3000/v1/';
    };
});
