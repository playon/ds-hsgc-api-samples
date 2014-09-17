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
  apiRoot: "http://api.hsgamecenter.com/v1.2/",
  unityRoot: "http://unity.nfhsnetwork.com/v1/",
  init: function(env, keyStrategy, loadedCallBack) {
    hsgcWidgets.env = env;
    
    if(keyStrategy === null){
      hsgcWidgets.keyStrategy = "unity";
    }
    else{
      hsgcWidgets.keyStrategy = keyStrategy;
    }
    
    if (typeof(loadedCallBack) != "undefined"){
      hsgcWidgets.datacastLoaded = loadedCallBack;
    }
    else{
      hsgcWidgets.datacastLoaded = function (){};
    }

    if (env == "stage") {
      hsgcWidgets.apiRoot = "http://api.gray.hsgamecenter.com/v1.2/";
      hsgcWidgets.unityRoot = "http://unity.stage.nfhsnetwork.com/v1/";
    } else if (env == "dev") {
      hsgcWidgets.apiRoot = "http://api.gamecenter.dev/";
      hsgcWidgets.unityRoot = "http://localhost:3000/v1/";
    }//otherwise use default

    angular.bootstrap(document, ['hsgc']);
  }
};