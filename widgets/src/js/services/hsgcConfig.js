angular.module('hsgc').provider('hsgcConfig', function() {
  this.config = {
    env: "prod",
    keyStrategy: "unity",
    gaTracker: "UA-27695189-2", // Google Analytics tracker code
    //if apiRoot set here, overrides the versions that are usually loaded based on "env"
    //apiRoot: "https://api.digitalscout.com/v1.2/",
    logoStdResWidth: 60,  // must be updated here and in `mixins.less: .widget-logo-large`
    logoStdResHeight: 60, // must be updated here and in `mixins.less: .widget-logo-large`
    logoHighResWidth: 120,  // must be logoStdResWidth * 2
    logoHighResHeight: 120, // must be logoStdResHeight * 2
    showTeamLinks: true,
    datacastLoaded: function() {},
    beforeLoadDatacast: function(gameKey, publisherKey, cb) {
      cb();
    },
    fullBoxScoreFirstLoaded: function() {},
    datacastLoadError: function() {},
    datacastPaymentRequired: function(data) {}
  };

  this.$get = function() {
    this.config.apiRoot = this.config.apiRoot || this.getHsgcApiRoot();
    this.config.statsRoot = this.config.statsRoot || this.getHsgcStatsRoot();
    this.config.unityRoot = this.config.unityRoot || this.getUnityApiRoot();
    return this.config;
  };

  this.set = function(settings) {
    angular.extend(this.config, settings);
  };

  this.getHsgcApiRoot = function() {
    return this.config.env === "prod" ? "https://api-cf.digitalscout.com/v1.2/" : this.config.env === "stage" ? "https://api-stage.digitalscout.com/v1.2/" : "https://api.gamecenter.dev/";
  };

  this.getHsgcStatsRoot = function() {
    return this.config.env === "prod" ? "https://stats.digitalscout.com/" : this.config.env === "stage" ? "https://stats-stage.digitalscout.com/" : "https://stats.gamecenter.dev/";
  };

  this.getUnityApiRoot = function() {
    return this.config.env === "prod" ? "https://cfunity.nfhsnetwork.com/v1/" : this.config.env === "stage" ? "https://unity.stage.nfhsnetwork.com/v1/" : "http://localhost:3000/v1/";
  };
});