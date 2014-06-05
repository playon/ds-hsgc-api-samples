angular.module('hsgc', [])
  .config(['$sceProvider', function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
  }]);