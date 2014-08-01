angular.module('hsgc', [])
  .config(['$sceProvider', function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
  }]);

hsgcWidgets = {
  apiRoot: "http://api.hsgamecenter.com/v1.2/",
  init: function(env) {
    if (env == "stage") {
      hsgcWidgets.apiRoot = "http://api.gray.hsgamecenter.com/v1.2/";
    } //otherwise use default

    angular.bootstrap(document, ['hsgc']);
  }
};