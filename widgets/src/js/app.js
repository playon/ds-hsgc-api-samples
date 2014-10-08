angular.module('hsgc', [])
  .config(['$httpProvider', '$sceProvider', function($httpProvider, $sceProvider) {
    //$sceProvider.enabled(false);
    $httpProvider.defaults.headers.get =  {
        'Accept': 'application/json',
        //'HSGC-Client': "hsgc-widget-angular-client",
        //'HSGC-Client-Version': ""
      };
  }]);

hsgcWidgets = {
  init: function(options) {
    var defaults = {
      env: "prod",
      keyStrategy: "unity",
      apiRoot: "http://api.hsgamecenter.com/v1.2/",
      unityRoot: "http://unity.nfhsnetwork.com/v1/",
      datacastLoaded: function() {},
      beforeLoadDatacast: function(gameKey, publisherKey, cb) { cb(); },
      fullBoxScoreFirstLoaded: function() { },
      datacastLoadError: function() { },
      datacastPaymentRequired: function(data) { console.log(data.GameDetailLink); }
    };
    var config = angular.extend(defaults, options);

    if (config.env == "stage") {
      config.apiRoot = "http://api.gray.hsgamecenter.com/v1.2/";
      config.unityRoot = "http://unity.stage.nfhsnetwork.com/v1/";
    } else if (config.env == "dev") {
      config.apiRoot = "http://api.gamecenter.dev/";
      //config.unityRoot = "http://localhost:3000/v1/";
      config.unityRoot = "http://unity.stage.nfhsnetwork.com/v1/";
    }//otherwise use default

    angular.extend(hsgcWidgets, config);
    angular.bootstrap(document, ['hsgc']);
  }
};