angular.module('hsgc', ['angular-inview'])
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
      unityRoot: "http://cfunity.nfhsnetwork.com/v1/",
      datacastLoaded: function() {},
      beforeLoadDatacast: function(gameKey, publisherKey, cb) { cb(); },
      fullBoxScoreFirstLoaded: function() { },
      datacastLoadError: function() { },
      datacastPaymentRequired: function(data) { }
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

hsgcWidgets.networkAuthorize = function(gameKey, publisherKey, cb) {
  nfhs.auth.datacast(gameKey, publisherKey, function(auth) {
    if (auth.authorized) {
      cb();
    } else {
      if (!hsgcWidgets.upsold) {
        hsgcWidgets.upsold = true;
        nfhs.utils.getUnityObject('game', gameKey, function (game) {
          nfhs.templater.datacastUpsell(game, function (upsellTemplateVars) {
            if (typeof(upsellTemplateVars != "undefined") && upsellTemplateVars) {
              var html = nfhsplayer.templates.upsell(upsellTemplateVars);
              html = html + "<p></p>";
              $('.eventdetails').before($(html));
            }
          });
        });
      }
    }
  });
};