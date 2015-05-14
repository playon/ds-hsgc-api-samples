var hsgc = angular.module('hsgc', [])
  .config(['$httpProvider', '$sceProvider', '$logProvider', function($httpProvider, $sceProvider, $logProvider) {
    $httpProvider.defaults.headers.get = {
      'Accept': 'application/json',
      //'HSGC-Client': "hsgc-widget-angular-client",
      //'HSGC-Client-Version': ""
    };
    //$sceProvider.enabled(false);

    // disable debug logging in production; this can be manually enabled here during development, but
    // DON'T COMMIT YOUR CHANGES if you decide to enable it temporarily
    $logProvider.debugEnabled(false);
  }]);

hsgcWidgets = {
  init: function(options) {
    hsgc.config(['hsgcConfigProvider', function(hsgcConfig) {
      hsgcConfig.set(options);
    }]);
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
        nfhs.utils.getUnityObject('game', gameKey, function(game) {
          nfhs.templater.datacastUpsell(game, function(upsellTemplateVars) {
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