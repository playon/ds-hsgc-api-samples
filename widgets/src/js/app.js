angular.module('hsgc', [])
  .config(['$httpProvider', '$sceProvider', function($httpProvider, $sceProvider) {
    //$sceProvider.enabled(false);
    $httpProvider.defaults.headers.get =  {
        'Accept': 'application/json',
        'HSGC-Client': "hsgc-widget-angular-client",
        'HSGC-Client-Version': ""
      };
  }]);

hsgcWidgets = {
  apiRoot: "http://api.hsgamecenter.com/v1.2/",
  init: function(env) {
    if (env == "stage") {
      hsgcWidgets.apiRoot = "http://api.gray.hsgamecenter.com/v1.2/";
    } else if (env == "dev") {
      hsgcWidgets.apiRoot = "http://api.gamecenter.dev/";
    }//otherwise use default

    angular.bootstrap(document, ['hsgc']);
  }
};