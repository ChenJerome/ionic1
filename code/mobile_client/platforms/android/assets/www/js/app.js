// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      window.plugins.jPushPlugin.init();//初始化推送服务
      window.plugins.jPushPlugin.setDebugMode(true);//设置模式为Debug
      /*var getRegistrationId = function(data){
        try{
          alert("当前机器的唯一值："+data);
          window.localStorage.registrationId = data;
        }
        catch(e){
          alert("推送服务初始化失败！");
        }
      };
      window.plugins.jPushPlugin.getRegistrationID(getRegistrationId);*///获取当前设备的唯一值，用于个推



      window.plugins.jPushPlugin.getRegistrationID(function(){
          try{
            alert("当前机器的唯一值："+data);
            window.localStorage.registrationId = data;
          }
          catch(e){
            alert("推送服务初始化失败！");
          }
      });

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).controller("barcodescanner",function($scope,$cordovaBarcodeScanner,$timeout){
    $scope.scanBarcode = function(){
    //alert("With this alert, the scan will work");
      $timeout(function(){
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
          },
          function (error) {
            alert("Scanning failed: " + error);
          }
        );
      },500);
  };
});
