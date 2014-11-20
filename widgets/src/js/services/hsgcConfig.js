angular.module('hsgc').provider('hsgcConfig', function () {
    this.config = {
      env: "prod",
      keyStrategy: "unity",
      //apiRoot: "http://api.hsgamecenter.com/v1.2/",
      //unityRoot: "http://cfunity.nfhsnetwork.com/v1/",
      datacastLoaded: function() {},
      beforeLoadDatacast: function(gameKey, publisherKey, cb) { cb(); },
      fullBoxScoreFirstLoaded: function() { },
      datacastLoadError: function() { },
      datacastPaymentRequired: function(data) { }
    };


    this.$get = function () {
        this.config.apiRoot = this.config.apiRoot || this.getHsgcApiRoot();
        this.config.unityRoot = this.config.unityRoot || this.getUnityApiRoot();
        return this.config;        
    };

    this.set = function (settings) {
      angular.extend(this.config, settings);
    };

    this.getHsgcApiRoot = function () {
      return this.config.env == "prod" ? "http://api.hsgamecenter.com/v1.2/"
        : this.config.env == "stage" ? "http://api.gray.hsgamecenter.com/v1.2/"
        : "http://api.gamecenter.dev/";
    }

    this.getUnityApiRoot = function () {
      return this.config.env == "prod" ? "http://cfunity.nfhsnetwork.com/v1/"
        : this.config.env == "stage" ? "http://unity.stage.nfhsnetwork.com/v1/"
        : "http://localhost:3000/v1/";
    }
});  