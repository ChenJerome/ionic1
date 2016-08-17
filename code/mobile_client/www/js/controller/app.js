angular.module('mobileApp', ['ionic', 'mobileApp.controllers', 'mobileApp.services', 'ngCordova'])
  .run(function ($ionicPlatform, $rootScope, $timeout, $cordovaToast,
                 $cordovaKeyboard, $templateCache, updateService,$cordovaAppVersion,$cordovaInAppBrowser,myLoading,sessionService,dbService) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        document.addEventListener("deviceready", function () {
          var registrationId = window.localStorage.registrationId;
          //if (registrationId != undefined && registrationId != "" && registrationId != null) {

          //} else {
          window.plugins.jPushPlugin.init();//初始化推送服务
          if (ionic.Platform.isIOS()) {
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
            window.plugins.jPushPlugin.setBadge(0);
          } else {
            window.plugins.jPushPlugin.setDebugMode(true);
          }

          window.plugins.jPushPlugin.getRegistrationID(function (id) {
            try {
              //alert("当前机器的唯一值：" + id);
              window.localStorage.registrationId = id;
            }
            catch (e) {
              //alert("推送服务初始化失败！");
              window.localStorage.registrationId = "";
            }
          });
          //}
          $cordovaAppVersion.getVersionNumber().then(function (version) {
            window.localStorage.version = version;
          });

          document.addEventListener("jpush.openNotification", function(event) {
            try {
              var alertContent;
              if (ionic.Platform.isAndroid()) {
                alertContent = window.plugins.jPushPlugin.openNotification.alert;
              } else {
                alertContent = event.aps.alert;
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                window.plugins.jPushPlugin.setBadge(0);
              }
            } catch (exception) {
              alert("JPushPlugin:onOpenNotification" + exception);
            }
          });
          document.addEventListener("jpush.receiveNotification", function(event) {
            try {
              var alertContent;
              if (ionic.Platform.isAndroid()) {
                alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
              } else {
                alertContent = event.aps.alert;
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                window.plugins.jPushPlugin.setBadge(0);
              }
            } catch (exception) {
              alert(exception)
            }
          });
          document.addEventListener("jpush.receiveMessage", function(event) {
            try {
              var message;
              if (ionic.Platform.isAndroid()) {
                message = window.plugins.jPushPlugin.receiveMessage.message;
              } else {
                message = event.content;
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                window.plugins.jPushPlugin.setBadge(0);
              }
            } catch (exception) {
              alert("JPushPlugin:onReceiveMessage-->" + exception);
            }
          });
        });
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      document.addEventListener("resume", function () {
        if (!ionic.Platform.isAndroid()) {
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
          window.plugins.jPushPlugin.setBadge(0);
        }
        if (ionic.Platform.isIOS()) {
          var iosLv = updateService.checkIosLastestVersion();
          if (!iosLv) {
            alert("当前不是最新版本，需完全退出重启应用选择安装更新！");
            //myLoading.showNospiLoading("当前不是最新版本，需完全退出重启应用选择安装更新！");
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes',
              closebuttoncaption: '返回'
            };
            var aKey = $rootScope.lastestVersion.appKey;
            var url = updateUrl_ios.replace("{aKey}", aKey);
            //alert(url);
            $cordovaInAppBrowser.open(url, '_blank', options)
              .then(function (event) {

              })
              .catch(function (event) {

              });

            return false;
          } else {

          }
        }
        sessionService.isSessionOut();
      });
      document.addEventListener("deviceready", function () {
        dbService.initDb();
      });
    });
    $ionicPlatform.registerBackButtonAction(function (e) {
      var isVisible = $cordovaKeyboard.isVisible();
      if (isVisible) {
        $cordovaKeyboard.close();
        return;
      }
      if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      }
      //else if ($ionicHistory.backView()) {
      //  $ionicHistory.goBack();
      //}
      else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortBottom('再按一次退出');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);

    //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //  //if (toState.url == "/login") {
    //    $templateCache.remove("/todolist");
    //  //}
    //});
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');


    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.applist', {
        url: '/applist',
        cache: 'false',
        views: {
          'tab-applist': {
            templateUrl: 'templates/tab-applist.html',
            controller: 'appCtrl'
          }
        }
      })
      .state("tab.flowSuperQuery", {
        url: "/flowSuperQuery/",
        views: {
          'tab-applist': {
            templateUrl: 'templates/flow-super-query.html',
            controller: 'flowSuperQueryCtrl'
          }
        }
      })
      .state("tab.todolist", {
        url: '/todolist',
        cache: 'false',
        views: {
          'tab-todolist': {
            templateUrl: 'templates/tab-todolist.html',
            controller: 'toDoTaskCtrl'
          }
        }
      })
      .state("tab.agentTask", {
        url: '/agentTask/:userId:userName',
        cache: 'true',
        views: {
          'tab-todolist': {
            templateUrl: 'templates/tab-task-agent.html',
            controller: 'agentTaskCtr'
          }
        }
      })
      .state("tab.setting", {
        url: '/setting',
        cache: 'false',
        views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'settingCtr'
          }
        }
      }).state("tab.settingPwd", {
        url: '/settingPwd',
        cache: 'false',
        views: {
          'tab-setting': {
            templateUrl: 'templates/setting-password.html',
            controller: 'settingPwdCtr'
          }
        }
      }).state('login', {
        url: '/login',
        cache : false,
        templateUrl: 'login.html',
        controller: 'loginCtrl'
      });
    //$urlRouterProvider.otherwise('/tab/dash');
    $urlRouterProvider.otherwise('login');
  }).filter('cutStr', function () {//截取日期字符串只留取日期
    return function (str, count) {
      if (str) {
        return str.substr(0, count);
      }
    }
  });
;
