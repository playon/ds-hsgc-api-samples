angular.module('hsgc', [])
  .config(['$httpProvider', '$sceProvider', function($httpProvider, $sceProvider) {
    //$httpProvider.defaults.cache = true;
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    //$sceProvider.enabled(false);
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