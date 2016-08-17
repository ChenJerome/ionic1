var _angular = angular.module('mobileApp.services', ["ngResource"]);
_angular.factory("loginService", function ($state, $http, myPopover, myLoading,$rootScope,$rootScope,$cordovaSQLite,
  $cordovaFile, $cordovaDevice, commonService,  $templateCache, $ionicPopover,updateService,$cordovaInAppBrowser,sessionService) {
  return {
    login: function (loginInfo) {
      //return ;
      this.deleteAttachmentDir();
      myLoading.showLoading();
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
          //myLoading.showLoading("请重启应用");
          return false;
        } else {

        }
      }
      $http.post(UrlConfig.login, loginInfo).success(function (data) {
        if (data) {
          if (data.loginResut == "0") {
            myPopover.showPopoverMsg("", "用户名或密码不正确");
          } else if (data.loginResut == "1") {
            sessionService.init();
            window.localStorage.loginId = loginInfo.loginId;
            util.setPassword(loginInfo.password);
            window.localStorage.userId = data.userInfo.userId;
            window.localStorage.userName = data.userInfo.userName;
            window.localStorage.authKey = data.authKey;
            document.addEventListener("deviceready", function () {
              var registrationUserId = window.localStorage.registrationUserId;
              //if (registrationUserId != data.userInfo.userId) {//如果jpush之前注册用户的id和当前登录的id不符需要更注册信息或者重新注册
              var url = UrlConfig.bindDevice;
              var param = {};
              param.userCode = window.localStorage.userId;
              param.userName = window.localStorage.userName;
              param.regCode = window.localStorage.registrationId;
              //param.regCode = "18071adc030ed66f560";
              param.imei = $cordovaDevice.getUUID();
              //param.imei = "TT";
              commonService.post(url, param, function (dd) {
                //注册成功之后设置当前注册的用户的id
                window.localStorage.registrationUserId = window.localStorage.userId;
              },function () {
              });

            });
            $rootScope.isDealTimeOut = false;
            $templateCache.removeAll();
            $state.go('tab.todolist');
            //$ionicNavBarDelegate.showBackButton(false);
          }
        }
        myLoading.hideLoading();
      }).error(function (data, status) {
        myLoading.hideLoading();
      });
    }, loginOut: function () {
      this.deleteAttachmentDir();
      ionic.Platform.exitApp();
    }, deleteAttachmentDir: function () {
      //var targetPath = cordova.file.externalApplicationStorageDirectory + "/a_ruixin/"
      document.addEventListener("deviceready", function () {
        //$cordovaFile.removeDir(cordova.file.externalApplicationStorageDirectory, "a_ruixin");

        //$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, "a_ruixin");
        //alert(2);
      });
    },showLockPwd : function ($scope) {
      $ionicPopover.fromTemplateUrl('templates/t-unlock.html', {
        scope: $scope,
        //backdropClickToClose : false,
        //focusFirstInput : true
      }).then(function (popover) {
        $scope.unLockPopover = popover;
        popover.show();
      });
    }
  };
})
  .factory("applistService", function (commonService) {
    return {
      getAppList: function () {
        return [{appName: '系统管理', appId: 1}, {appName: '人事管理', appId: 1}, {appName: '流程管理', appId: 1},
          {appName: 'ERP', appId: 1}, {appName: 'CRM', appId: 1}, {appName: 'OA', appId: 1}, {appName: 'PM', appId: 1}]
      }, getUserMenus : function ($scope) {
        var url = UrlConfig.getUserMenus;
        var userId = util.getUserId();
        commonService.post(url,{userCode : userId},function (data) {
          if (data) {

            for (var i = 0; i < data.length; i++) {
              if ((i % 3) == 0) {
                var temp = [];
                temp.push(data[i]);
                $scope.menuList.push(temp);
              } else {
                var l = $scope.menuList.length - 1;
                if (l >= 0) {
                  $scope.menuList[l].push(data[i]);
                }
              }
            }
          }
        });
      }
    };
  })
  .factory("taskService", function ($http, myLoading, errorService, commonService) {
    return {
      getToDoTask: function ($scope) {
        //alert("show loading");
        myLoading.showLoading();
        var userId = util.getUserId();
        var searchText = $scope.search.searchText;
        var defKey = $scope.search.defKey_task;
        this.getToDoTaskCount($scope);
        var _method = "component.getListData";
        var _param = {
          bizObj: "TASK",
          service: "searchAllTasks",
          fields: "*",
          filter: {
            userId : userId,
            defKey : defKey,
            mSearch: searchText //手机端模糊查询参数
          },
          currentPageIndex: $scope.pageInfo.currentPageIndex,
          pageSize: 10
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            var datas = data.datas;
            if (datas.length > 0) {
              for (var i = 0; i < datas.length; i++) {
                var item = datas[i];
                $scope.todoList.push(item);
              }
            }
            if (window.localStorage.isSetLockPwd == "set") {
              if (window.localStorage.introJs != "set") {
                setTimeout(function () {
                  //alert(1);
                  angular.element("#showIntrojs").click();
                },300);
              }
            }
          }
          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast('scroll.infiniteScrollComplete');
          myLoading.hideLoading();
        }, function () {
          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast('scroll.infiniteScrollComplete');
          myLoading.hideLoading();
          errorService.error();
        });
      }, getToDoTaskCount: function ($scope) {
        var searchText = "";
        var userId = util.getUserId();
        if ($scope.search && $scope.search.searchText) {
          searchText = $scope.search.searchText;
        }
        var defKey = $scope.search.defKey_task;
        var _method = "component.getCountData";
        var _param = {
          bizObj: "TASK",
          service: "searchAllTasksCount",
          filter: {
            userId : userId,
            defKey : defKey,
            mSearch: searchText //手机端模糊查询参数
          }
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            $scope.pageInfo.allCount = data.datas
          }
        }, function () {

        });
      },
      /**
       *
       * @param $scope
       * @param isEnd
       * @param isShowLoading
       */
      searchMyInvolvedProcess: function ($scope, isEnd, isShowLoading) {//已办未完成/完成
        if (isShowLoading) {
          myLoading.showLoading();
        }
        var searchText = $scope.search.searchText;
        if (!isEnd) {
          isEnd = "0";
        }
        var currentPageIndex = 1;
        var defKey = "";
        if (isEnd == "0") {
          currentPageIndex = $scope.pageInfo_ip.currentPageIndex;
          defKey = $scope.search.defKey_ip;
        } else if (isEnd == "1") {
          currentPageIndex = $scope.pageInfo_ipc.currentPageIndex;
          defKey = $scope.search.defKey_ipc;
        }
        var _method = "component.getListData";
        var userId = util.getUserId();
        var _param = {
          bizObj: "TASK",
          service: "searchMyInvolvedProcess",
          fields: "*",
          filter: {
            userId : userId,
            defKey : defKey,
            mSearch: searchText, //手机端模糊查询参数
            isEnd: isEnd	//0:未完成，1:已完成 不传查所有
          },
          currentPageIndex: currentPageIndex,
          pageSize: 10
        }
        this.searchMyInvolvedProcessCount($scope, isEnd);
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            var datas = data.datas;
            if (datas.length > 0) {
              if (isEnd == 0) {
                for (var i = 0; i < datas.length; i++) {
                  var item = datas[i];
                  $scope.involvedProcess.push(item);
                }
              } else if (isEnd == "1") {
                for (var i = 0; i < datas.length; i++) {
                  var item = datas[i];
                  $scope.involvedProcessCompleted.push(item);
                }
              }
            }
          }
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
        }, function () {
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
          errorService.error();
        });
      }, searchMyInvolvedProcessCount: function ($scope, isEnd) {
        if (!isEnd) {
          isEnd = "0";
        }
        var searchText = $scope.search.searchText;
        var _method = "component.getCountData";
        var userId = util.getUserId();
        var defKey = "";
        if (isEnd == "0") {
          defKey = $scope.search.defKey_ip;
        } else if (isEnd == "1") {
          defKey = $scope.search.defKey_ipc;
        }
        var _param = {
          bizObj: "TASK",
          service: "searchMyInvolvedProcessCount",
          filter: {
            userId : userId,
            defKey : defKey,
            mSearch: searchText, //手机端模糊查询参数
            isEnd: isEnd	//0:未完成，1:已完成 不传查所有
          },
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            if (isEnd == "0") {
              $scope.pageInfo_ip.allCount = data.datas
            } else if (isEnd == "1") {
              $scope.pageInfo_ipc.allCount = data.datas
            }
          }
        }, function () {

        });
      },
      /**
       * 查询抄送信息
       * @param $scope
       * @param isShowLoading
       */
      searchMyNotice: function ($scope, isShowLoading) {
        this.searchMyNoticeCount($scope);
        if (isShowLoading) {
          myLoading.showLoading();
        }
        var searchText = $scope.search.searchText;
        var _method = "component.getListData";
        var userId = util.getUserId();
        //var defKey = $scope.search.defKey_notice;
        var _param = {
          bizObj: "Task",
          service: "searchMyNotice",
          fields: "*",
          filter: {
            userId : userId,
            //defKey : defKey,
            mSearch: '' //手机端模糊查询参数
          },
          currentPageIndex: $scope.pageInfo_notice.currentPageIndex,
          pageSize: 10
        };
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            var datas = data.datas;
            if (datas.length > 0) {
              for (var i = 0; i < datas.length; i++) {
                var item = datas[i];
                $scope.notice.push(item);
              }
            }
          }
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
        }, function () {
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
        });
      }, searchMyNoticeCount: function ($scope) {
        var searchText = $scope.search.searchText;
        var _method = "component.getCountData";
        var userId = util.getUserId();
        //var defKey = $scope.search.defKey_notice;
        var _param = {
          bizObj: "Task",
          service: "searchMyNoticeCount",
          filter: {
            userId : userId,
            //defKey : defKey,
            mSearch: searchText //手机端模糊查询参数
          }
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            $scope.pageInfo_notice.allCount = data.datas
          }
        }, function () {

        });
      }, getAgentUsersAndCount: function ($scope, isShowLoading) {
        if (isShowLoading) {
          myLoading.showLoading();
        }
        var _method = "flow.getAgentUsersAndCount";
        commonService.callMethod(_method, {}, function (data) {
          if (data && data.agentInfo) {
            var datas = data.agentInfo;
            for (var i = 0; i < datas.length; i++) {
              var item = datas[i];
              $scope.agentInfo.push(item);
            }
          }
          if (data.agentTaskSum) {
            $scope.agentTaskSum = data.agentTaskSum;
          }
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
        }, function () {
          if (isShowLoading) {
            $scope.$broadcast("scroll.refreshComplete");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            myLoading.hideLoading();
          }
        });
      }
    };
  })
  .factory("myPopover", function ($ionicPopup, $cordovaToast) {
    return {
      showShortTop: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showShortTop(message);
        });
      }, showShortCenter: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showShortCenter(message);
        });
      }, showShortBottom: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showShortBottom(message);
        });
      }, showLongTop: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showLongTop(message);
        });
      }, showLongCenter: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showLongCenter(message);
        });
      }, showLongBottom: function (message) {
        document.addEventListener("deviceready", function () {
          $cordovaToast.showLongBottom(message);
        });
      }, showPopoverMsg: function (title, msg) {
        $ionicPopup.alert({title: title, content: msg});
      }, showConfirm: function (title, msg, _ok, _cancel) {
        var confirmPopup = $ionicPopup.confirm({
          title: title,
          template: msg,
          cancelText: "取消",
          okText: "确定"
        });
        angular.element(".popup-container").addClass("assgin-list-popup");
        confirmPopup.then(function (res) {
          if (res) {
            if (angular.isFunction(_ok)) {
              _ok();
            }
          } else {
            if (angular.isFunction(_cancel)) {
              _cancel();
            }
          }
        });
      }, prompt: function (option, _callback) {
        $ionicPopup.prompt(option).then(function (res) {
          if (angular.isFunction(_callback)) {
            _callback(res);
          }
        });
      },
      /**
       * 显示输入处理意见
       */
      showDealMessage: function ($scope, _ok, _cancel) {
        $scope.m = {};
        $scope.m.message = "";
        $scope.m.first = true;
        console.log($scope);
        $scope.quickDealInfo = function (info) {
          $scope.m.message = info;
        }
        var confirmPopup = $ionicPopup.show({
          title: "处理意见",
          templateUrl: 'templates/deal-message.html',
          scope: $scope,
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '取消',
            type: '',
            onTap: function (e) {
              // 当点击时，e.preventDefault() 会阻止弹窗关闭。
              //e.preventDefault();
              if (angular.isFunction(_cancel)) {
                _cancel();
              }
            }
          }, {
            text: '确定',
            type: 'button-positive',
            onTap: function (e) {
              $scope.m.first = false;
              if ($scope.m.message == "") {
                document.addEventListener("deviceready", function () {
                  $cordovaToast.showShortCenter("请输入处理意见");
                });
                e.preventDefault();
              } else {
                if (angular.isFunction(_ok)) {
                  _ok($scope.m.message);
                }
              }
            }
          }]
        });
        angular.element(".popup-container").addClass("assgin-list-popup");
      }, showErrorMsg : function (title, msg, _ok) {
        if (!title) {
          title = "错误提示";
        }
        var template = "<div class='error-msg'>" + msg + "</div>";
        var confirmPopup = $ionicPopup.show({
          title: title,
          //templateUrl: 'templates/fix-error.html',
          template : template,
          buttons: [{
            text: '确定',
            type: 'button-positive',
            onTap: function (e) {
              if (angular.isFunction(_ok)) {
                _ok();
              }
            }
          }]
        });
        angular.element(".popup-container").addClass("assgin-list-popup");
      }
    }
  })
  .factory("myLoading", function ($ionicLoading, $timeout) {
    return {
      showLoading: function (str) {
        var message = "加载中, 请稍后...";
        if (str != undefined && str != null && str != "") {
          message = str;
        }
        var template = "<div class='cm-loading'>" +
          "<div style='float: left'><ion-spinner icon='android'></ion-spinner></div>" +
          "<div style='float: left'>" + message + "</div>" +
          "</div>";
        $ionicLoading.show({
          template: template,
          //templateUrl: "templates/loading.html",
          noBackdrop: false,
          hideOnStateChange: true
        });
        //var _this = this;
        //_this.isShow = true;
        //$timeout(function () {
        //  if (_this.isShow) {
        //    _this.hideLoading();
        //  }
        //}, 5000);
      },showNospiLoading: function (str) {
        var message = "请重新加载";
        if (str != undefined && str != null && str != "") {
          message = str;
        }
        var template = "<div class='nospi-loading'>" +
          "<div style='float: left'>" + message + "</div>" +
          "</div>";
        $ionicLoading.show({
          template: template,
          //templateUrl: "templates/loading.html",
          noBackdrop: false,
          hideOnStateChange: true
        });
        //var _this = this;
        //_this.isShow = true;
        //$timeout(function () {
        //  if (_this.isShow) {
        //    _this.hideLoading();
        //  }
        //}, 5000);
      },
      hideLoading: function () {
        this.isShow = false
        $ionicLoading.hide();
      }, isShow: false
    }
  })
  .factory("formService", function ($ionicActionSheet, $http, myPopover, $ionicModal,
                                    myLoading, $cordovaFileTransfer, $cordovaFileOpener2, $cordovaFile,
                                    $cordovaInAppBrowser, $ionicPopup, $ionicPopover, commonService,
                                    $cordovaToast, userService, $cordovaKeyboard) {
    return {
      showActionSheet: function (myScope, buttons) {
        if (buttons) {
          var actionButtons = [];
          for (var i = 0; i < buttons[0].length; i++) {
            var actionButton = buttons[0][i];
            if (actionButton.commandType != "processStatus" && actionButton.commandType != "saveTaskDraft") {
              actionButtons.push(buttons[0][i]);
            }
          }
          var actionSheet = $ionicActionSheet.show({
            cancelOnStateChange: true,
            cssClass: 'action_s',
            titleText: "",
            buttons: actionButtons,
            buttonClicked: function (index, button) {
              //button.useType = "modify";
              if (button.commandType === "processStatus") {
                //var formUrl = "templates/proc-list.html";
                //$ionicModal.fromTemplateUrl(formUrl, {
                //  scope: myScope,
                //  animation: "slide-in-up",
                //
                //}).then(function (modal) {
                //  modal.show();
                //  var param = {};
                //  param.modal = modal;
                //  param.instId = myScope.param.INSTID;
                //  myScope.$broadcast('proc-list', param);
                //});
              } else if (button.commandType === "general" || button.commandType === "startandsubmit"
                || button.commandType === "submit" || button.commandType === "resolved") {
                myScope.$emit('save-form', button);
              } else if (button.commandType === "rollBackTaskByTaskId") {//根据任务id驳回
                myScope.$emit('rollBackTaskByTaskId', button);
              } else if (button.commandType === "pending") {//加签按钮
                myScope.$emit('pending', button);
              } else if (button.commandType == "claim") {//领取任务
                myScope.$emit('claim', button);
                //return false;
              } else if (button.commandType == "releaseTask") {//释放任务
                myScope.$emit('releaseTask', button);
              } else {
                myPopover.showPopoverMsg("", "移动端暂不支持此按钮功能");
              }
              return true;
            },
            cancelText: "取消",
            cancel: function () {
              return true;
            }
          });
        } else {
        }
      }, rollBackTaskByTaskId: function (flowButtonParam, $scope) {
        var taskId = $scope.param.TASKID;
        var _method = "flow.getRollBackScreeningTask";
        var _param = [];
        _param.push(taskId);
        var _this = this;
        myLoading.showLoading();
        commonService.callMethod(_method, _param, function (data) {
          myLoading.hideLoading();
          _this.showRollBackTaskList(flowButtonParam, data, $scope);
        }, function () {

        });
      }, showRollBackTaskList: function (flowButtonParam, data, $scope) {
        //if (!this.beforeDataSave($scope, commonService, flowButtonParam.commandType)) {
        //  return ;
        //}
        if (data && data.taskListEnd) {
          $scope.taskListEnd = data.taskListEnd;
          $scope.rollBack = {};
          $scope.rollBack.rollBackTaskId = "";
          $scope.commandType = flowButtonParam.commandType;
          $scope.selectRollBackTask = function (taskId, $event) {
            //alert(taskId)
            angular.element(".roll-back-tr").removeClass("active");
            angular.element($event.target).parent().addClass("active");
            $scope.rollBack.rollBackTaskId = taskId;
          }
          var _this = this;
          var confirmPopup = $ionicPopup.show({
            title: "选择任务",
            templateUrl: 'templates/task-roll-back.html',
            scope: $scope,
            buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
              text: '取消',
              type: '',
              onTap: function (e) {
                // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                //e.preventDefault();
              }
            }, {
              text: '确定',
              type: 'button-positive',
              onTap: function (e) {
                if ($scope.rollBack.rollBackTaskId == '') {
                  document.addEventListener("deviceready", function () {
                    $cordovaToast.showShortCenter("请选择要驳回的任务");
                  });
                  e.preventDefault();
                } else {
                  myPopover.showDealMessage($scope, function (message) {
                    var saveFormParam = _this.dealSaveFormParam(flowButtonParam, $scope);
                    saveFormParam.flowParam.taskComment = message;
                    //_this.submitFormData();
                    //var url = UrlConfig.saveFormData + "?authKey=" + util.getAuthKey();
                    //$http.post(url, saveFormParam).success(function (data) {
                    //  $scope.$emit("close-modal", "close-modal");
                    //  $scope.$emit("refresh-task", "close-modal");
                    //  //$scope.showPopoverMsg("", "提交成功");
                    //}).error(function (data) {
                    //  //errorService.error();
                    //});
                    saveFormParam.flowParam.extParam.rollBackTaskId = $scope.rollBack.rollBackTaskId;
                    myLoading.showLoading();
                    commonService.callMethod("formService.saveFormData", saveFormParam, function () {
                      //_this.afterDataSave(myScope, commonService);
                      myLoading.hideLoading();
                      $scope.$emit("close-modal", "close-modal");
                      $scope.$emit("refresh-task", "close-modal");
                    })
                    //console.log(saveFormParam);
                  })
                }
              }
            }]
          });
          angular.element(".popup-container").addClass("assgin-list-popup");
        } else {

        }
      }, sign: function (flowButtonParam, $scope) {//加签
        if (!this.beforeDataSave($scope, commonService)) {
          return ;
        }
        $scope.commandType = flowButtonParam.commandType;
        $ionicPopover.fromTemplateUrl('templates/flow-sign.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
          popover.show();
        });
        $scope.userList = [];
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.pageInfo = {};
        $scope.pageInfo.pageSize = 10;
        $scope.pageInfo.currentPageIndex = 1;
        $scope.pageInfo.allPage = 0;
        $scope.pageInfo.allCount = 0;
        $scope.refresh = function () {
          $scope.userList = [];
          $scope.pageInfo.currentPageIndex = 1;
          userService.queryUser($scope);
        }
        $scope.loadMore = function () {

          if ($scope.pageInfo.currentPageIndex + 1 <= $scope.pageInfo.allPage) {
            $scope.pageInfo.currentPageIndex += 1;
            userService.queryUser($scope);//加载更多
          } else {
            //$scope.$broadcast('scroll.infiniteScrollComplete');
          }

        }
        userService.queryUser($scope);
        $scope.closeUPopover = function () {
          $scope.popover.remove();
        }
        $scope.keyUp = function (event) {
          if (event.keyCode == 13) {
            document.addEventListener("deviceready", function () {
              $cordovaKeyboard.close();
            });
            $scope.userList = [];
            $scope.pageInfo.currentPageIndex = 1;
            userService.queryUser($scope);
          }
        }
        $scope.clearSearch = function () {
          $scope.search.searchText = "";
        }
        $scope.selectUser = function ($event, userId, userName) {
          angular.element(".popover-user").removeClass("active");
          angular.element($event.currentTarget).addClass("active");
          $scope.pendingUserId = userId;
          $scope.pendingUserName = userName;
        }
        var _this = this;
        $scope.selectSign = function () {
          if ($scope.pendingUserId != undefined) {
            var message = "确定给 " + $scope.pendingUserName + " 加签吗?";
            myPopover.showConfirm("加签确认", message, function () {
              myPopover.showDealMessage($scope, function (message) {
                var saveFormParam = _this.dealSaveFormParam(flowButtonParam, $scope);
                saveFormParam.flowParam.taskComment = message;
                saveFormParam.flowParam.extParam.pendingUserId = $scope.pendingUserId;
                myLoading.showLoading("处理中...");
                commonService.callMethod("formService.saveFormData", saveFormParam, function () {
                  myLoading.hideLoading();
                  $scope.popover.remove();
                  //_this.afterDataSave(myScope, commonService);
                  $scope.$emit("close-modal", "close-modal");
                  $scope.$emit("refresh-task", "close-modal");
                })
              })
            })
          } else {
            document.addEventListener("deviceready", function () {
              $cordovaToast.showShortCenter("请选择用户");
            });
          }
        }
      }, claimTask: function (flowButtonParam, $scope) {//领取任务
        var _this = this;
        myPopover.showConfirm("领取任务", "确认领取任务?", function () {
          var taskId = $scope.param.TASKID;
          var _param = [];
          _param.push(taskId);
          _param.push("");
          commonService.callMethod("flow.claimTask", _param, function (data) {
            _this.getFormData($scope.param, $scope);
            myPopover.showShortCenter("领取成功");
          });
        })
      }, releaseTask: function (flowButtonParam, $scope) {//释放任务
        var _this = this;
        myPopover.showConfirm("释放任务", "确认释放任务?", function () {
          var taskId = $scope.param.TASKID;
          var _param = [];
          _param.push(taskId);
          commonService.callMethod("flow.releaseTask", _param, function (data) {
            _this.getFormData($scope.param, $scope);
            myPopover.showShortCenter("释放成功");
          });
        })
      },
      /**
       * 获取表单数据
       * @param item
       * @returns {HttpPromise}
       */
      getFormData: function (item, $scope) {
        var formParam = this.dealGetFormParam(item);
        //var url = UrlConfig.getFormData + "?authKey=" + util.getAuthKey();
        //
        //return $http.post(url, formParam);
        var _method = "formService.getFormData";
        if (item._method && item._method != null && item._method != "" && item._method != undefined) {
          _method = item._method;
        }
        var _this = this;
        myLoading.showLoading();
        commonService.callMethod(_method, formParam, function (data) {
          $scope.formData = data.getData;
          $scope.getSysVar = data.getSysVar;
          //formService.getAttachment($scope);
          _this.addOriginalValue($scope.formData);
          _this.dealGetFormData(data, $scope);
          _this.afterDataLoad($scope, commonService);
          //console.log($scope.formData);
          //$scope.oldFormData = JSON.parse(JSON.stringify(data.getData));
          $scope.getToolbar = data.getToolbar;
          console.log($scope.formData);
          myLoading.hideLoading();
        },null,item.urlParam);
      },
      /**
       * 收集获取表单数据所需要的参数
       * @param item
       * @returns {{}}
       */
      dealGetFormParam: function (item) {
        var useType = "modify";//默认打开流程的表单
        if (item.USETYPE) {
          useType = item.USETYPE;
        }
        var formParam = {};
        //formParam.authKey = util.getAuthKey();
        formParam.useType = useType;
        var getData = {};
        getData.useType = useType;
        var bizObjId = item.BIZOBJID;
        getData.objName = bizObjId;
        var pk = [];
        var pkObj = {};
        pkObj.key = item.FKEY;
        pkObj.value = item.FVALUE;
        pk.push(pkObj);
        getData.pk = pk;
        formParam.getData = getData;
        var getFormVerify = {};
        var viewForm = item.FORM;
        var viewId = util.getFormId(viewForm);
        if (item.VIEWID) {
          getFormVerify.viewId = item.VIEWID;
        } else {
          getFormVerify.viewId = viewId;
        }
        getFormVerify.objName = bizObjId;
        formParam.getFormVerify = getFormVerify;
        var relatedObj = [];
        var formConfig = FormConfig[bizObjId][viewId];
        var relatedObjs = formConfig.relatedObj;
        for (var key in relatedObjs) {
          relatedObj.push(key);
        }
        /*relatedObj.push(item.bizObjId);
         relatedObj.push("T_FINANCE_REIMBURSEDETAIL")*/
        getData.relatedObj = relatedObj;
        var getSysVar = this._dealGetSysVarParam(viewId, bizObjId);
        formParam.getSysVar = getSysVar;
        var getToolbar = {};
        getToolbar.useType = useType;
        getToolbar.objName = bizObjId;
        if (item.VIEWID) {
          getToolbar.viewId = item.VIEWID;
        } else {
          getToolbar.viewId = viewId;
        }
        getToolbar.defId = item.DEFID;
        getToolbar.defKey = item.DEFKEY;
        getToolbar.instId = item.INSTID;
        getToolbar.taskId = item.TASKID;
        getToolbar.nodeId = item.NODEID;
        formParam.getToolbar = getToolbar;
        //console.log(formParam);
        return formParam;
      },
      _dealGetSysVarParam: function (formId, bizObjId) {
        var getSysVar = {};
        if (formId && bizObjId && FormConfig[bizObjId]) {
          var formConfig = FormConfig[bizObjId][formId];
          for (var key in formConfig.relatedObj) {
            var obj = formConfig.relatedObj[key]
            for (var key1 in obj) {
              if (obj[key1] && obj[key1].defaultValue) {
                getSysVar[key1] = obj[key1].defaultValue;
              }
            }
          }
        }
        return getSysVar;
      },
      /**
       * 处理获取的表单数据
       * @param data
       * @param myScope
       */
      dealGetFormData: function (data, myScope) {
        //console.log(myScope.param);
        var bizObjId = myScope.param.BIZOBJID;
        var form = myScope.param.FORM;
        var formId = util.getFormId(form);
        var relatedObj = FormConfig[bizObjId][formId].relatedObj;
        for (var bizObjId in relatedObj) {
          if (!data.getData[bizObjId]) {
            data.getData[bizObjId] = [];
          }
          var row = null;
          if (data.getData[bizObjId].length <= 0) {
            row = {};
            //data.getData[bizObjId].push(row);
          } else {
            row = data.getData[bizObjId][0];
            for (var column in relatedObj[bizObjId]) {
              var obj = null;
              if (row[column]) {
                obj = row[column];
              } else {
                obj = {};
              }
              if (data.getSysVar[column]) {
                obj.val = data.getSysVar[column];
                row[column] = obj;
              }
            }
          }

        }
        //console.log(myScope.formData);
      },
      /**
       * 把获取的表单数据的植事先保存一份历史数据
       * @param formData
       */
      addOriginalValue: function (formData) {
        if (formData) {
          for (var key in formData) {
            var objs = formData[key];
            for (var i = 0; i < objs.length; i++) {
              var obj = objs[i];
              for (var key1 in obj) {
                if (obj[key1].val != undefined) {
                  obj[key1].OriginalValue = obj[key1].val;
                } else {
                  obj[key1].OriginalValue = "";
                }
              }
            }
          }
        }
      },
      /**
       * 保存表单数据
       * @param flowButtonParam
       * @param myScope
       */
      saveFormData: function (flowButtonParam, myScope, commonService) {
        if (this.beforeDataSave(myScope, commonService)) {
          var _this = this;
          var msg = "确认" + flowButtonParam.text + "?";
          if (flowButtonParam.commandType == "startandsubmit") {//说明是开始节点进行提交
            //myPopover.showConfirm("提交确认", msg, function () {
            var saveFormParam = _this.dealSaveFormParam(flowButtonParam, myScope);
            _this.submitFormData(saveFormParam, myScope);
            //});
          } else {
            myScope.commandType = flowButtonParam.commandType;
            myPopover.showDealMessage(myScope, function (message) {
              //myPopover.showConfirm("提交确认", msg, function () {
              var saveFormParam = _this.dealSaveFormParam(flowButtonParam, myScope);
              saveFormParam.flowParam.taskComment = message;
              _this.submitFormData(saveFormParam, myScope);
              //});
            })
          }

        }
      },
      /**
       * 提交表单数据
       */
      submitFormData: function (saveFormParam, myScope) {
        //console.log(saveFormParam);
        var _method = "formService.saveFormData";
        myLoading.showLoading();
        var _this = this;
        commonService.callMethod(_method, saveFormParam, function (data) {
          myLoading.hideLoading();
          var flowEndTime = data.flowEndTime;
          if (data && data._flow_result_obj && data._flow_result_obj.length > 0) {//需要做虚拟提交
            for (var i = 0; i < data._flow_result_obj.length; i++) {
              var assignName = data._flow_result_obj[i].assignessName;
              var assign = data._flow_result_obj[i].assignee;
              var assignNames = assignName.split(",");
              var assigns = assign.split(",");
              var assignList = [];
              for (var j = 0; j < assignNames.length; j++) {
                if (j == 0) {//默认的设置第一个是被选中
                  data._flow_result_obj[i].assigneeSelect = assigns[j];
                }
                var obj = {};
                obj.assign = assigns[j];
                obj.assignName = assignNames[j];
                assignList.push(obj);
              }
              data._flow_result_obj[i].assignList = [];
              data._flow_result_obj[i].assignList = assignList;
            }
            myScope.assigneeList = data._flow_result_obj;
            //console.log(myScope.assigneeList);
            var confirmPopup = $ionicPopup.show({
              title: "确定流程处理人",
              templateUrl: 'templates/assign-list.html',
              scope: myScope,
              buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                text: '取消',
                type: '',
                onTap: function (e) {
                  // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                  //e.preventDefault();
                  return false;
                }
              }, {
                text: '确定',
                type: 'button-positive',
                onTap: function (e) {
                  myLoading.showLoading();
                  //var simAssignId = angular.element("#simulationRunAssignId").val();
                  var selectInfo = [];
                  var assigneeList = myScope.assigneeList;
                  if (assigneeList) {
                    for (var i = 0; i < assigneeList.length; i++) {
                      selectInfo.push({
                        processer: assigneeList[i].assigneeSelect,
                        nodeId: assigneeList[i].nodeId
                      })
                    }
                  }
                  saveFormParam.selectInfo = selectInfo;
                  saveFormParam.flowParam.isSimulationRun = false;
                  commonService.callMethod(_method, saveFormParam, function (data) {
                    myLoading.hideLoading();
                    _this.afterDataSave(myScope, commonService);
                    myScope.$emit("close-modal", "close-modal");
                    myScope.$emit("refresh-task", "close-modal");
                    myPopover.showShortCenter("提交成功")
                  })
                }
              }]
            });
            angular.element(".popup-container").addClass("assgin-list-popup");

          } else if (data && data._flow_result_obj && data._flow_result_obj.length == 0) {
            var confirmPopup = $ionicPopup.show({
              title: "提示信息",
              templateUrl: 'templates/flow-end.html',
              scope: myScope,
              buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                text: '取消',
                type: '',
                onTap: function (e) {
                  // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                  //e.preventDefault();
                }
              }, {
                text: '确定',
                type: 'button-positive',
                onTap: function (e) {
                  saveFormParam.flowParam.isSimulationRun = false;
                  myLoading.showLoading();
                  commonService.callMethod(_method, saveFormParam, function (data) {
                    myLoading.hideLoading();
                    _this.afterDataSave(myScope, commonService);
                    myScope.$emit("close-modal", "close-modal");
                    myScope.$emit("refresh-task", "close-modal");
                    //myPopover.showPopoverMsg("", "提交成功");
                    myPopover.showShortCenter("提交成功");
                  });
                }
              }]
            });
            angular.element(".popup-container").addClass("assgin-list-popup");
          } else {
            _this.afterDataSave(myScope, commonService);
            myScope.$emit("close-modal", "close-modal");
            myScope.$emit("refresh-task", "close-modal");
            myPopover.showShortCenter("提交成功");
          }
        });


      },
      /**
       * 处理表单提交，用于收集表单提交时所需要的参数
       * @param flowButtonParam
       * @param myScope
       */
      dealSaveFormParam: function (flowButtonParam, myScope) {
        var saveParam = {};

        var formId = util.getFormId(myScope.param.FORM);
        var bizObjId = myScope.param.BIZOBJID;
        saveParam._OBJ_NAME_ = bizObjId;
        saveParam._FORM_ID_ = formId;
        saveParam.useType = myScope.param.USETYPE;
        saveParam.pageToken = util.newGuid();
        //saveParam.authKey = util.getAuthKey();
        var flowParam = this._dealFlowParam(flowButtonParam, myScope);
        var returnObj = this._dealFormDataParam(myScope);
        var formData = returnObj.formData;
        var formInfo = returnObj.formInfo;
        saveParam.flowParam = flowParam;
        saveParam.formData = formData;
        saveParam._ATTACHMENT_DELETE_IDS_ = "";
        saveParam.formInfo = formInfo;
        var requestEventData = {};
        requestEventData.eventType = "formSubmitEvent";
        requestEventData.formType = "1";
        requestEventData.bizObjId = bizObjId;
        requestEventData.formId = formId;
        requestEventData.buttonId = "";
        saveParam.requestEventData = requestEventData;
        //console.log(saveParam);
        return saveParam;
      },
      /**
       * 处理表单提交时候的流程相关参赛
       * @param flowButtonParam
       * @param myScope
       * @returns {{}}
       * @private
       */
      _dealFlowParam: function (flowButtonParam, myScope) {
        var flowParam = {};
        flowParam.defId = myScope.param.DEFID;
        flowParam.defKey = myScope.param.DEFKEY;
        flowParam.instId = myScope.param.INSTID;
        flowParam.agent = "";
        flowParam.userCommandType = flowButtonParam.commandType;
        flowParam.userCommandId = flowButtonParam.commandId;
        flowParam.isAdmin = flowButtonParam.isAdmin;
        flowParam.isSimulationRun = flowButtonParam.isSimulationRun;
        flowParam.isSaveData = flowButtonParam.isSaveData;
        flowParam.isVerification = flowButtonParam.isVerification;
        flowParam.extParam = {};
        flowParam.taskId = myScope.param.TASKID;
        return flowParam;
      },
      _dealFormDataParam: function (myScope) {
        var formData = {};
        var formInfo = {};
        var bizObjId = myScope.param.BIZOBJID;//主表信息
        formData.objName = bizObjId;
        var pks = [];
        if (myScope && myScope.param && myScope.param.FKEY) {
          pks.push(myScope.param.FKEY);
        }
        formData.pks = pks;
        var formId = util.getFormId(myScope.param.FORM);
        var formConfig = FormConfig[bizObjId][formId];
        var data = [];
        var bizObjParam = {};
        var children = [];
        bizObjParam.children = children;
        data.push(bizObjParam);
        formData.data = data;
        var $scopeFormData = myScope.formData;
        //console.log($scopeFormData);
        if ($scopeFormData) {
          for (var key in $scopeFormData) {
            if (key == bizObjId) { //说明是主表
              var rowData = [];

              if ($scopeFormData[key]) {
                var bizObjRowObj = $scopeFormData[key][0];
                for (var column in bizObjRowObj) {
                  var rowObj = {};

                  if (formConfig.relatedObj[key][column]) {
                    rowObj.PK = formConfig.relatedObj[key][column].isPk;
                    rowObj.DataType = formConfig.relatedObj[key][column].dataType;
                    var isSubmit = formConfig.relatedObj[key][column].isSubmit;
                    if (formConfig.relatedObj[key][column].isPk) {
                      pks.push(column);
                    }
                    rowObj.DataTarget = column;
                    rowObj.Value = bizObjRowObj[column].val;
                    //把主表中配置的所有的字段值都放入formInfo
                    formInfo[column] = bizObjRowObj[column].val;
                    if (bizObjRowObj[column].OriginalValue) {
                      rowObj.OriginalValue = bizObjRowObj[column].OriginalValue;
                    } else {
                      rowObj.OriginalValue = "";
                    }
                    //默认所有字段都是提交的，即使没配置isSubmit。只有配置了isSubmit=false才不会提交
                    if (isSubmit === false || isSubmit === "false") {

                    } else {
                      rowData.push(rowObj);
                    }
                  } else {
                    //rowObj.PK = false;
                    //rowObj.DataType = "String";
                    formInfo[column] = bizObjRowObj[column].val;
                  }
                }
              }
              bizObjParam.rowData = rowData;
            } else {//明细表
              var childrenDatas = $scopeFormData[key];
              if (childrenDatas.length > 0) {//如果明细表有数据才提交
                var childrenObj = {};
                children.push(childrenObj);
                childrenObj.objName = key;
                var ch_pks = [];
                childrenObj.pks = ch_pks;
                var ch_data = [];
                childrenObj.data = ch_data;
                for (var i = 0; i < childrenDatas.length; i++) {
                  var childrenData = childrenDatas[i];
                  var ch_data_obj = {};
                  ch_data.push(ch_data_obj);
                  var ch_data_obj_rowData = [];
                  ch_data_obj.rowData = ch_data_obj_rowData;
                  ch_data_obj.children = [];
                  for (var column in childrenData) {

                    if (formConfig.relatedObj[key][column]) {
                      var rowObj = {};
                      ch_data_obj_rowData.push(rowObj);
                      rowObj.DataTarget = column;
                      rowObj.Value = childrenData[column].val;
                      rowObj.OriginalValue = childrenData[column].OriginalValue;
                      rowObj.PK = formConfig.relatedObj[key][column].isPk;
                      rowObj.DataType = formConfig.relatedObj[key][column].dataType;
                      if (formConfig.relatedObj[key][column].isPk) {
                        ch_pks.push(column);
                      }
                    } else {
                      /*rowObj.PK = false;
                       rowObj.DataType = "String";*/
                    }
                    var v = formInfo[column];
                    if (v == null || v == undefined || v == "") {
                      v = childrenData[column].val;
                    } else {
                      v = v + "," + childrenData[column].val;
                    }
                    formInfo[column] = v;
                  }
                }
              }
            }
          }

        }
        var returnObj = {};
        returnObj.formData = formData;
        returnObj.formInfo = formInfo;
        return returnObj;
      },
      /**
       * 根据用户ID、流程ID、节点ID、获取处理按钮
       * @param userId
       * @param nodeId
       * @param procId
       */
      getActionButton: function (userId, procId, nodeId) {
        var p = {u: "1"}
        return $http.post("https://www.baidu.com");
      },
      /**
       * 表单数据加载完成之后调用对应表单的onAfterDataLoad
       */
      afterDataLoad: function (myScope, commonService) {
        var form = myScope.param.FORM;
        var bizObjId = myScope.param.BIZOBJID;
        var formId = util.getFormId(form);
        var oadl = FormConfig[bizObjId][formId].formModal.onAfterDataLoad;
        if (angular.isFunction(oadl)) {
          oadl(myScope, commonService);
        }
        //var f = eval(oadl);
        //f();
      }, beforeDataSave: function (myScope, commonService, commandType) {
        var form = myScope.param.FORM;
        var bizObjId = myScope.param.BIZOBJID;
        var formId = util.getFormId(form);
        var obdl = FormConfig[bizObjId][formId].formModal.onBeforeDataSave;
        if (angular.isFunction(obdl)) {
          return obdl(myScope, commonService, commandType);
        }
        return true;
      }, afterDataSave: function (myScope, commonService) {
        var form = myScope.param.FORM;
        var bizObjId = myScope.param.BIZOBJID;
        var formId = util.getFormId(form);
        var obdl = FormConfig[bizObjId][formId].formModal.onAfterDataSave;
        if (angular.isFunction(obdl)) {
          obdl(myScope, commonService);
        }
      }, getAttachment: function (myScope) {
        var bizObjId = myScope.param.BIZOBJID;
        if (myScope.formData[bizObjId] && myScope.formData[bizObjId][0]
          && myScope.formData[bizObjId][0].ATTACHMENT &&
          myScope.formData[bizObjId][0].ATTACHMENT.val) {
          var attachmentGuid = myScope.formData[bizObjId][0].ATTACHMENT.val;
          var url = UrlConfig.getAttachmentList + "?authKey=" + util.getAuthKey();
          var _this = this;
          $http.post(url, {guid: attachmentGuid}).success(function (data) {
            myScope.attachments = data;
            _this.convertFile(myScope, attachmentGuid);
          }).error(function (data) {

          });
        }
      }, convertFile: function (myScope, guid, fileId, fileName) {
        var url = UrlConfig.convertFile + "?authKey=" + util.getAuthKey();
        $http.post(url, {guid: guid}).success(function (data) {
          myScope.convertFile = data;
          if (myScope.attachmentFileId != undefined) {
            myScope.convertImgs = myScope.convertFile[myScope.attachmentFileId];
            myScope.dealImg = false;
            /*if (convertImgs.length > 2 ) {
             myScope.convertImgs.push(convertImgs[0]);
             myScope.convertImgs.push(convertImgs[1]);
             } else {
             myScope.convertImgs = convertImgs;
             }*/
          }
        });

      }, fileDownLoad: function (myScope, guid, fileId, fileName) {
        var fix = fileName.split(".")[1];
        var fileN = fileId + "." + fix;
        var url = UrlConfig.downloadAttachment + "?authKey=" + util.getAuthKey();

        $http.post(url, {
          guid: guid,
          fileId: fileId
        }).success(function (data) {
          document.addEventListener("deviceready", function () {
            //myLoading.showLoading();
            var filePath = _r_server + data;

            //alert(1);
            if (util.isImage(data)) {
              //alert(2);
              var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes',
                closebuttoncaption: '返回'
              };
              $cordovaInAppBrowser.open(filePath, '_blank', options)
                .then(function (event) {

                })
                .catch(function (event) {

                });
            } else {
              var dir = "";
              var tempDir = "vnetDownload";
              if (ionic.Platform.isAndroid()) {
                dir = cordova.file.externalApplicationStorageDirectory;
              } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                dir = cordova.file.documentsDirectory;
              }
              var targetPath = dir + "vnetDownload/" + fileN;
              $cordovaFile.checkDir(dir, "vnetDownload")
                .then(function (success) {

                }, function (error) {
                  $cordovaFile.createDir(dir, "vnetDownload", false)
                    .then(function (success) {
                      // success
                    }, function (error) {
                      // error
                    });
                });
              /*alert(filePath);
               alert(targetPath);*/
              $cordovaFileTransfer.download(filePath, targetPath, {}, true).then(function (result) {
                // 打开下载下来的APP
                //alert("下载成功");
                myLoading.hideLoading();
                $cordovaFileOpener2.open(targetPath, 'application/*').then(function () {
                  myLoading.hideLoading();
                }, function (err) {
                  alert("打开失败");
                });
              }, function (err) {
                alert('下载失败');
                myLoading.hideLoading();
              }, function (progress) {
                var percent = parseInt((progress.loaded / progress.total) * 100);
                if (percent >= 99) {
                  myLoading.hideLoading();
                } else {
                  myLoading.showLoading("已下载:" + percent + "%");
                }

              });
            }

          }, false);
        }).error(function (data) {
          //myLoading.hideLoading();
        });

      }
    }
  })
  .factory("updateService", function ($http, $cordovaAppVersion, $ionicPopup,
                                      $ionicLoading, $cordovaFileTransfer,
                                      $cordovaFileOpener2, myLoading, $rootScope) {
    return {
      checkVersion: function () {
        if (ionic.Platform.isAndroid()) {
          var url = UrlConfig.getVersion + "?authKey=" + util.getAuthKey();
          var _this = this;
          $http.post(url).success(function (data) {

            document.addEventListener("deviceready", function () {
              $cordovaAppVersion.getVersionNumber().then(function (version) {
                //alert(version);
                if (version != data.edtionCode) {
                  //alert(data.edtionCode);
                  _this.downloadNew(data);
                }
              });
            }, false);
          }).error(function () {

          });
        } else if (ionic.Platform.isIOS()) {
          //this.updateIOS();
        }
        //this.checkIosIsLastestVersion();
      },checkIosLastestVersion : function () {
        var url = UrlConfig.viewGroup;
        var param = {};
        param.aId = "4fcacabc72db31d4d64d1e6fb019f878";
        param._api_key = "748ceae43aa812dc2e6e3f732a0da259";
        var lastestVersion = null;
        $.ajax({
          url: url,
          type: "post",
          data: param,
          async: false,
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
            if (data && data.data) {
              for (var i = 0; i < data.data.length; i++) {
                var obj = data.data[i];
                if (obj.appIsLastest == "1") {
                  lastestVersion = obj;
                }
              }
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {

          }
        });

        if (lastestVersion != null) {
          $rootScope.lastestVersion = lastestVersion;
          if (lastestVersion.appVersion != window.localStorage.version) {
            return false;
          } else {
            return true;
          }
        }
        return false;
      },downloadNew : function (data) {//下载新版本
        var url = UrlConfig.updateApp + data.filePath; //可以从服务端获取更新APP的路径
        var targetPath = "file:///storage/sdcard0/Download/" + data.appName; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        var trustHosts = true
        var options = {};
        //alert(url);
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function () {
          myLoading.hideLoading();
          $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function () {

            }, function (err) {
            //alert(4);
            });
        }, function (err) {
          //alert(err);
          myLoading.hideLoading();
        }, function (progress) {
          var percent = parseInt((progress.loaded / progress.total) * 100);
          if (percent >= 99) {
            myLoading.hideLoading();
          } else {
            myLoading.showLoading("新版本更新,已下载:" + percent + "%");
          }
        });
      }, showUpdateConfirm: function (data) {
        var template = "";
        for (var i = 0; i < data.updateMessage.length; i++) {
          template += (i + 1) + "." + data.updateMessage[i] + "</br>"
        }
        if (template == "") {
          template = "新版本更新。";
        }
        var confirmPopup = $ionicPopup.confirm({
          title: '版本升级',
          template: template, //从服务端获取更新的内容
          cancelText: '取消',
          okText: '升级'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $ionicLoading.show({
              template: "已经下载：0%"
            });
            var url = UrlConfig.updateApp + data.appName; //可以从服务端获取更新APP的路径
            url ="http://59.151.19.8:443/rest/1462358603920_android-debug.apk";
            var targetPath = "file:///storage/sdcard0/Download/" + data.appName; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            var trustHosts = true
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
              // 打开下载下来的APP

              $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
              ).then(function () {
                  // 成功
                }, function (err) {
                  // 错误
                });
              $ionicLoading.hide();
            }, function (err) {
              alert('下载失败');
            }, function (progress) {
              //进度，这里使用文字显示下载百分比
              $timeout(function () {
                var downloadProgress = (progress.loaded / progress.total) * 100;
                $ionicLoading.show({
                  template: "已经下载：" + Math.floor(downloadProgress) + "%"
                });
                if (downloadProgress > 99) {
                  $ionicLoading.hide();
                }
              })
            });
          } else {
            // 取消更新
          }
        });
      }
    };
  }).factory("commonService", ['$http', 'myPopover', 'errorService','myLoading','sessionService','$rootScope', function ($http, myPopover, errorService, myLoading, sessionService,$rootScope) {
    return {
      callMethod: function (_method, _param, _success, _error, urlParam) {
        if ($rootScope.sessionOut && $rootScope.sessionOut.isSessionOut) {
          return;
        }
        var flag = sessionService.isSessionOut();
        if (flag) {
          return ;
        }
        var url = UrlConfig.callMethod + "?authKey=" + util.getAuthKey();
        if (urlParam && urlParam != undefined && urlParam != null) {
          url += "&" + urlParam;
        }
        var param = {};
        if (_method == "formService.saveFormData") {
          param = _param;
          param._method = _method;
        } else {
          param._method = _method;
          param._param = _param;
        }
        //if(_param.requestEventData){
        //  param["requestEventData"] = _param.requestEventData;
        //}

        $http.post(url, param).success(function (data) {
          if (!errorService.fixError(data)) {
            if (angular.isFunction(_success)) {
              _success(data);
            }
          }
        }).error(function (data, status) {
          if (angular.isFunction(_error)) {
            _error(data, status);
          }
          errorService.error(data, status);
        });
      }, callMethodSync: function (_method, _param, _success, _error) {
        if ($rootScope.sessionOut && $rootScope.sessionOut.isSessionOut != undefined && $rootScope.sessionOut.isSessionOut) {
          return;
        }
        sessionService.isSessionOut();
        var url = UrlConfig.callMethod + "?authKey=" + util.getAuthKey();
        var param = {};
        param._method = _method;
        param._param = _param;
        //if(_param.requestEventData){
        //  param["requestEventData"] = _param.requestEventData;
        //}
        $.ajax({
          url: url,
          type: "post",
          data: JSON.stringify(param),
          async: false,
          dataType: "json",
          contentType: "application/json",
          success: function (data, textStatus, jqXHR) {
            if (angular.isFunction(_success)) {
              _success(data, textStatus, jqXHR);
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (angular.isFunction(_error)) {
              _error(XMLHttpRequest, textStatus, errorThrown);
            }
            errorService.error(data, status);
          }
        });
      }, getMyPopover: function () {
        return myPopover;
      }, post: function (url, _param, _success, _error) {
        $http.post(url, _param).success(function (data) {
          if (angular.isFunction(_success)) {
            _success(data);
          }
        }).error(function (data, status) {
          myLoading.hideLoading();
          if (angular.isFunction(_error)) {
            _error(data, status);
          }
          //errorService.error(data, status);
        });
      }, postSync: function (url, _param, _success, _error) {
        $.ajax({
          url: url,
          type: "post",
          data: JSON.stringify(_param),
          async: false,
          dataType: "json",
          contentType: "application/json",
          success: function (data, textStatus, jqXHR) {
            if (angular.isFunction(_success)) {
              _success(data, textStatus, jqXHR);
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            myLoading.hideLoading();
            if (angular.isFunction(_error)) {
              _error(XMLHttpRequest, textStatus, errorThrown);
            }
            //errorService.error(XMLHttpRequest, textStatus);
          }

        });
      },
      getDateDiff:function(startTime, endTime, diffType) {
        startTime = startTime.replace(/-/g, "/");
        endTime = endTime.replace(/-/g, "/");
        diffType = diffType.toLowerCase();
        if(startTime.length<10){
          startTime = "2016/01/26 "+startTime;
          endTime = "2016/01/26 "+endTime;
        }
        var sTime = new Date(startTime); //开始时间
        var eTime = new Date(endTime); //结束时间
        var divNum = 1;
        switch (diffType) {
            case "second":
                divNum = 1000;
                break;
            case "minute":
                divNum = 1000 * 60;
                break;
            case "hour":
                divNum = 1000 * 3600;
                break;
            case "day":
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
      }
    }
  }]).factory("errorService", function (myPopover, $state, myLoading,$rootScope) {
    return {
      error: function () {//处理请求的错误信息
        return;
        var isDealTimeOut = $rootScope.isDealTimeOut;//防止重复判断超时,本次登录下是否已经处理过超时
        //alert(isDealTimeOut);
        if (!isDealTimeOut) {
          myLoading.hideLoading();
          //var template = "<div class='error-msg'>" + "登录超时,请重新登录" + "</div>";
          //myPopover.showErrorMsg("错误信息", "登录超时,请重新登录");
          alert("登录超时,请重新登录");
          //angular.element("#fixErrorInfo").text("登录超时,请重新登录");
          $rootScope.isDealTimeOut = true;
          var formModal = $rootScope.formModal;
          //alert(1);
          if (formModal != null && formModal != undefined && formModal instanceof  Object) {//关闭打开的表单
            //alert(2);
            formModal.remove();
          }
          //alert(3);
          //angular.element("#fixError").fadeIn();
          //alert(4);
          //window.location.href = "login.html"
          //alert("登录超时需要重新登录");
          //$rootScope.isReload = true;
          $state.go("login");
        }

      }, fixError: function (data) {//统一处理FixError字段
        //data.FixError = "";
        if (data && data.FixError != undefined) {
          var fixError = data.FixError;
          if (fixError == "") {
            fixError = "系统发生未知异常!";
          }
          //angular.element("#fixErrorInfo").text(fixError);
          //angular.element("#fixError").fadeIn();
          //myPopover.showErrorMsg("错误信息", fixError);
          myLoading.hideLoading();
          alert(fixError);
          return true;
        } else {
          return false;
        }
      }
    }
  }).factory("userService", function ($state, $http, myLoading, commonService) {
    return {
      queryUserList: function ($scope, type) {//查询用户的信息和第三方用户合并之后的列表，过滤了一些关键用户的信息
        var pageSize = $scope.pageInfo.pageSize;
        var currentPageIndex = $scope.pageInfo.currentPageIndex;
        var searchText = $scope.search.userSearchText;
        var _param = {
          bizObj: "HR_EMPLOYEE_INFO_F",
          service: "queryEmployeeInfo",
          fields: "*",
          filter: "1=1",
          mSearch: searchText,					//后台用这个字段模糊匹配 员工编号，姓名和拼音
          currentPageIndex: currentPageIndex,
          pageSize: pageSize,
          orderList: []
        }
        myLoading.showLoading();
        commonService.callMethod("component.getAllData", _param, function (data) {
          if (data && data.datas) {
            var datas = data.datas;
            $scope.pageInfo.allPage = datas.allPage;
            $scope.pageInfo.allCount = datas.dataCount;
            $scope.pageInfo.pageSize = datas.pageSize;
            $scope.pageInfo.currentPageIndex = datas.currentPageIndex;
            if (datas.dataList) {
              for (var i = 0; i < datas.dataList.length; i++) {
                var  teleDisplay = datas.dataList[i].teleDisplay;
                var deptName = datas.dataList[i].departName;
                if (deptName != null && deptName.substr(0,5) == "世纪互联-") {
                  deptName = deptName.substring(5);
                  datas.dataList[i].departName = deptName;
                }
                if (teleDisplay.indexOf(",") > -1) {
                  var teleDisplays = teleDisplay.split(",");
                  var tt = {};
                  for (var k = 0; k <teleDisplays.length; k++ ) {
                    tt[teleDisplays[k]] = teleDisplays[k];
                  }
                  var ttt = [];
                  for (key in tt) {
                    ttt.push(key);
                  }
                  datas.dataList[i].teleDisplays = ttt;
                } else {
                  var teleDisplays = [teleDisplay];
                  datas.dataList[i].teleDisplays = teleDisplays;
                  teleDisplays.push();
                }
                  $scope.userList.push(datas.dataList[i]);
              }
              //console.log($scope.userList);
            }
          }
          if (type == "2") {

          } else if (type == "3") {

          } else if (type == "1") {

          }
          //广播下拉刷新的操作已经完成
          myLoading.hideLoading();
          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function () {
          myLoading.hideLoading();
        });
      }, queryUser: function ($scope) {//查询用户表里面的信息
        myLoading.showLoading();
        this.queryUserCount($scope);
        var filter = "1=1";
        var searchText = $scope.search.searchText;
        if (searchText != "") {
          filter = "USERNAME like '%" + searchText + "%' or USERID like '%" + searchText + "%'"
        }
        var currentPageIndex = $scope.pageInfo.currentPageIndex;
        var _method = "component.getListData";
        var _param = {
          "bizObj": "AU_ORGMEMBER",
          "service": "selectMore",
          "fields": "*",
          "filter": filter,
          "currentPageIndex": currentPageIndex,
          "pageSize": 10,
          "orderList": []
        };
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            for (var i = 0; i < data.datas.length; i++) {
              $scope.userList.push(data.datas[i]);
            }
          }
          myLoading.hideLoading();
          setTimeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
          $scope.$broadcast("scroll.refreshComplete");
        }, function (data) {
          myLoading.hideLoading();
        });
      }, queryUserCount: function ($scope) {//查询用户表里面的数目
        var _method = "application.getGridPaginate";
        var filter = "1=1";
        var searchText = $scope.search.searchText;
        if (searchText != "") {
          filter = "USERNAME like '%" + searchText + "%' or USERID like '%" + searchText + "%'"
        }
        var currentPageIndex = $scope.pageInfo.currentPageIndex;
        var _param = {
          "bizObj": "AU_ORGMEMBER",
          "service": "selectCnt",
          "fields": "*",
          "filter": filter,
          "currentPageIndex": currentPageIndex,
          "pageSize": 10,
          "orderList": []
        };
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.paginate) {
            $scope.pageInfo.allPage = data.paginate.allPage;
            $scope.pageInfo.allCount = data.paginate.allList;
          }
        });
      },
      //查询用户的职位信息
      queryUserPosition: function ($scope) {
        var _method = "component.getListData";
        var filter = "EMPLOYEE_CODE=" + util.getUserId();
        var _param = {
          "bizObj": "HR_EMPLOYEE_INFO",
          "service": "selectMore",
          "fields": "*",
          "filter": filter,
          "currentPageIndex": 1,
          "pageSize": 10,
          "orderList": []
        };
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            if (data.datas.length > 0) {
              $scope.jobName = data.datas[0].JOB_NAME;
              $scope.userName = data.datas[0].CERT_NAME;
            }
          }
        }, function (data) {
        });
      }
    };
  }).factory("flowSuperQueryService", function (myLoading, commonService) {
    return {
      query: function ($scope) {
        myLoading.showLoading();
        var searchText = $scope.search.searchText;
        var currentPageIndex = $scope.pageInfo.currentPageIndex;
        var _method = "component.getListData";
        var defKey = angular.element("#searchDefKey").val();
        if (defKey == null || defKey == "undefined") {
          defKey = $scope.search.defKey;
          defKey = "";
        }
        var _param = {
          bizObj: "TASK",
          service: "searchMyInvolvedProcess",
          fields: "*",
          filter: {
            defKey : defKey,
            userId: "",
            //isEnd: 0,	//0:未完成，1:已完成 不传查所有
            mSearch: searchText
          },
          currentPageIndex: currentPageIndex,
          pageSize: 10,
          orderList: []
        };
        this.queryCount($scope);
        commonService.callMethod(_method, _param, function (data) {

          if (data && data.datas) {
            var datas = data.datas;
            for (var i = 0; i < datas.length; i++) {
              $scope.flowList.push(datas[i]);
            }
          }
          myLoading.hideLoading();
          //广播下拉刷新的操作已经完成
          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function () {
          myLoading.hideLoading();
        })
      }, queryCount: function ($scope) {
        var _method = "component.getCountData";
        var searchText = $scope.search.searchText;
        var defKey = angular.element("#searchDefKey").val();
        if (defKey == null || defKey == "undefined") {
          defKey = $scope.search.defKey;
          defKey = "";

        }
        var _param = {
          bizObj: "TASK",
          service: "searchMyInvolvedProcessCount",
          filter: {
            defKey:defKey,
            userId: "",
            //isEnd: "0",//0:未完成，1:已完成 不传查所有
            mSearch: searchText
          }
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            $scope.pageInfo.allCount = data.datas;
          }
        }, function () {

        })
      }
    };
  }).factory("agentTaskService", function (myLoading, commonService) {
    return {
      query: function ($scope) {
        myLoading.showLoading();
        var searchText = $scope.search.searchText;
        var _method = "component.getListData";
        var userId = util.getUserId();
        var _param = {
          bizObj: "TASK",
          service: "searchAllTasks",
          fields: "*",
          filter: {
            agent: $scope.agentId,
            userId : userId,
            mSearch: searchText
          },
          currentPageIndex: 1,
          pageSize: 10,
          orderList: []
        };
        this.queryCount($scope);
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            var datas = data.datas;
            for (var i = 0; i < datas.length; i++) {
              $scope.agentTaskList.push(datas[i]);
            }
          }
          myLoading.hideLoading();
          //广播下拉刷新的操作已经完成
          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function () {
          myLoading.hideLoading();
        })
      }, queryCount: function ($scope) {
        var _method = "application.getGridPaginate";
        var searchText = $scope.search.searchText;
        var userId = util.getUserId();
        var _param = {
          bizObj: "TASK",
          service: "searchAllTasksCount",
          fields: "*",
          filter: {
            agent: $scope.agentId,
            userId : userId,
            mSearch: searchText
          }
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            $scope.pageInfo.allCount = data.datas;
          }
        }, function () {

        })
      }
    }
  }).factory("settingService", function (commonService) {
    return {
      getPushSet: function ($scope) {
        var url = UrlConfig.getPushAccountInfo;
        var param = {};
        param.regCode = window.localStorage.registrationId;
        //param.regCode = "18071adc030ed66f560";
        commonService.post(url, param, function (data) {
          if (data && data.length > 0) {
            var d = data[0];
            $scope.pushSet.startTime = d.noDisturbSTime;
            $scope.pushSet.endTime = d.noDisturbETime;
            if (d.isNoDisturb == "1") {
              $scope.pushSet.enablePush = true;
            } else {
              $scope.pushSet.enablePush = false;
            }
            if (!$scope.pushSet.enablePush) {
              angular.element("#time-setting").hide();
            } else {
              angular.element("#time-setting").show();
            }
            angular.element("#startTimeText").text(util.convertPushTime($scope.pushSet.startTime));
            angular.element("#endTimeText").text(util.convertPushTime($scope.pushSet.endTime));
          }
        });
      }, setPushSet: function ($scope) {
        var url = UrlConfig.pushMsgSetting;
        var param = {};
        param.userCode = window.localStorage.userId;
        param.regCode = window.localStorage.registrationId;
        param.regCode = "13065ffa4e087c8ab32";
        param.noDisturbSTime = $scope.pushSet.startTime;
        param.noDisturbETime = $scope.pushSet.endTime;
        param.isNoDisturb = $scope.pushSet.enablePush ? "1" : "0";

        commonService.post(url, param, function (data) {
          //只有设置成功的时候才缓存下拉
          window.localStorage.startTime = $scope.pushSet.startTime;
          window.localStorage.endTime = $scope.pushSet.endTime;
          window.localStorage.enablePush = $scope.pushSet.enablePush;
          if (data) {
            //alert(1);
          }
        },function (r, stat, t) {

        });
      }
    }
  }).factory("sessionService", function ($rootScope, $state){
    return {
      setLastTime : function () {
        var date = new Date();
        $rootScope.sessionOut.lastTime = date.getTime();
      },init : function () {
        if (!$rootScope.sessionOut) {
          $rootScope.sessionOut = {};
        }
        $rootScope.sessionOut.isSessionOut = false;
        this.setLastTime();
      },isSessionOut : function () {//判断session是否超时
        if (window.location.href.indexOf("login") > -1) {//说明超时的时候就在登录页那么就不做任何操作
          return ;
        }
        if (!$rootScope.sessionOut) {
          this.init();
        }
        var now = (new Date()).getTime();
        if ((now - $rootScope.sessionOut.lastTime) >= 30 * 60 * 1000) {
          //超时
          if ($rootScope.sessionOut.isSessionOut) {//防止APP从后台切换过来的时候多次alert，如果已经超时，跳到了登录页面再判断到超时的时候就不在弹出提示信息

          } else {
            alert("登录超时,请重新登录");
          }
          if ($rootScope.formModal) {
            $rootScope.formModal.remove();
          }
          $rootScope.sessionOut.isSessionOut = true;

          $state.go("login");
          return true;
        } else {
          this.setLastTime();
          return false;
        }
      }
    }
  }).factory("assetService", function ($rootScope, $state, commonService, myPopover, dbService){
    return {
      queryAssetL_wpd : function ($scope) {//查询本地的缓存未盘点
        var db = dbService.getDb();
        var limit = $scope.pageInfo_wpd.pageSize;
        var offset = ($scope.pageInfo_wpd.currentPageIndex - 1) * $scope.pageInfo_wpd.pageSize;
        var searchText = $scope.search.searchText_wpd;
        var sqlQ = "select * from ASSET_INVENTORY_DETL where ASSET_STATE_L = '待盘点'";
        if (searchText != "") {
          sqlQ += " and ASSETENTIYCODE = '" + searchText + "'";
        }
        var sql = "select * from (" + sqlQ + ") LIMIT " + limit + " OFFSET " + offset ;
        //alert(sql);
        db.executeSql(sql, null, function (resultSet) {
          var len = resultSet.rows.length;
          for (var i = 0; i < len; i++) {
            $scope.assetList_wpd.push(resultSet.rows.item(i));
          }
          //alert($scope.assetList_wpd.length);
        },function (error) {
          alert('error: ' + error.message);
        });
        var countSql = "select count(*) as count from (" + sqlQ + ")";
        db.executeSql(countSql, null, function (resultSet) {
          if (resultSet.rows) {
            //alert(resultSet.rows.item(0).count);
            $scope.pageInfo_wpd.allCount = resultSet.rows.item(0).count
          }
        },function (error) {
          alert('error: ' + error.message);
        });
        setTimeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 1000);

      },queryAssetL_ypd : function ($scope) {//查询本地的缓存已盘点、盘平的
        var db = dbService.getDb();
        var limit = $scope.pageInfo_ypd.pageSize;
        var offset = ($scope.pageInfo_ypd.currentPageIndex - 1) * $scope.pageInfo_ypd.pageSize;
        var searchText = $scope.search.searchText_wpd;
        var sqlQ = "select * from ASSET_INVENTORY_DETL where ASSET_STATE_L = '盘平'";
        if (searchText != "") {
          sqlQ += " and ASSETENTIYCODE = '" + searchText + "'";
        }
        var sql = "select * from (" + sqlQ + ") LIMIT " + limit + " OFFSET " + offset ;
        //alert(sql);
        db.executeSql(sql, null, function (resultSet) {
          var len = resultSet.rows.length;
          for (var i = 0; i < len; i++) {
            $scope.assetList_ypd.push(resultSet.rows.item(i));
          }
          //alert($scope.assetList_ypd.length);
        },function (error) {
          alert('error: ' + error.message);
        });
        var countSql = "select count(*) as count from (" + sqlQ + ")";
        db.executeSql(countSql, null, function (resultSet) {
          if (resultSet.rows) {
            //alert(resultSet.rows.item(0).count);
            $scope.pageInfo_ypd.allCount = resultSet.rows.item(0).count
          }
        },function (error) {
          alert('error: ' + error.message);
        });
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },queryAssetL_wfx : function ($scope) {//查询本地的缓存已盘点、盘平的
        var db = dbService.getDb();
        var limit = $scope.pageInfo_wfx.pageSize;
        var offset = ($scope.pageInfo_wfx.currentPageIndex - 1) * $scope.pageInfo_wfx.pageSize;
        //var searchText = $scope.search.searchText_ypd;
        var sqlQ = "select * from ASSET_INVENTORY_DETL where ASSET_STATE_L = '盘盈'";
        //if (searchText != "") {
        //  sqlQ += " and ASSETENTIYCODE = '" + searchText + "'";
        //}
        var sql = "select * from (" + sqlQ + ") LIMIT " + limit + " OFFSET " + offset ;
        //alert(sql);
        db.executeSql(sql, null, function (resultSet) {
          var len = resultSet.rows.length;
          for (var i = 0; i < len; i++) {
            $scope.assetList_wfx.push(resultSet.rows.item(i));
          }
          //alert($scope.assetList_ypd.length);
        },function (error) {
          alert('error: ' + error.message);
        });
        var countSql = "select count(*) as count from (" + sqlQ + ")";
        db.executeSql(countSql, null, function (resultSet) {
          if (resultSet.rows) {
            //alert(resultSet.rows.item(0).count);
            $scope.pageInfo_wfx.allCount = resultSet.rows.item(0).count
          }
        },function (error) {
          alert('error: ' + error.message);
        });
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },queryAssetInventoryDetl : function ($scope) {
        var db = dbService.getDb();
        var sqlQ = "select * from ASSET_INVENTORY_DETL where ASSETENTIYCODE = '" + $scope.assetEntiyCode + "'";
        //alert(sqlQ);
        var _this = this;
        db.executeSql(sqlQ, null, function (resultSet) {
          //alert(resultSet.rows.length);
          //alert(JSON.stringify(resultSet.rows.item(0)));
          if (resultSet.rows.length > 0) {
            $scope.assetInfo = resultSet.rows.item(0);
            _this.updateAssetInventoryDelStateL($scope);
            $scope.showAssetForm($scope.assetInfo);
          } else {
            $scope.showAddAssetForm();
          }
        },function (error) {
          alert('error: ' + error.message);
        });
      },updateAssetInventoryDelStateL : function ($scope) {//更新本地的资产信息
        var assetInfo = $scope.assetInfo;
        var db = dbService.getDb();
        var sql = "update ASSET_INVENTORY_DETL set ASSET_STATE_L = ? where AID_ID = ? and ASSETENTIYCODE = ?";
        var sqlV = [];
        sqlV.push("盘平");
        sqlV.push(assetInfo.AID_ID);
        sqlV.push(assetInfo.ASSETENTIYCODE);
        db.executeSql(sql, sqlV, function (resultSet) {
          //alert("update ASSET_INVENTORY_DETL succ");
          //$scope.$emit("refresh-list", "close-modal");
          $scope.refreshAsset();
        }, function(error) {
          alert('update data ASSET_INVENTORY_DETL error: ' + error.message);
        });
      }
    }
  }).factory("dbService", function ($rootScope, $cordovaSQLite){
    return {
      initDb : function () {
        //alert("init");
        var isCreate = window.localStorage.isCreate;
        if (!isCreate) {
          //alert("create db");
          //alert($cordovaSQLite);
          var db = window.sqlitePlugin.openDatabase({ name: dbConfig.dbName, location: 'default' }, function () {
            //alert("open succ");
            db.executeSql(ASSET_INVENTORY_DETL, null, function (resultSet) {
              //alert("create table ASSET_INVENTORY_DETL succ");
            }, function(error) {
              alert('create table ASSET_INVENTORY_DETL error: ' + error.message);
            });
            db.executeSql(ASSET_INVENTORY, null, function (resultSet) {
              //alert("create table ASSET_INVENTORY succ");
            }, function(error) {
              alert('create table error: ' + error.message);
            });
          }, function (error) {
            alert('Open database ERROR: ' + JSON.stringify(error));
          });
          window.localStorage.isCreate = true;
          //alert("over");
        } else {
          //alert("cc");
          //var db = window.sqlitePlugin.openDatabase({ name: dbConfig.dbName,createFromLocation:1,location: 'default'},function () {
          //  //alert(1);
          //},function(error){
          //  alert(error);
          //});

        }
      },executeSql : function () {

      }, getDb : function () {
        var db = window.sqlitePlugin.openDatabase({ name: dbConfig.dbName,createFromLocation:1,location: 'default'},function () {

        },function(error){
          alert("error:" + error.message);
        });
        return db;
      }
    }
  }).factory("specialTreatment", function ($rootScope){

  }).factory("assetInventoryService", function ($rootScope, commonService){
    return {
      queryAssetInventoryTaskList : function ($scope, nName) {
        var userId = util.getUserId();
        var defKey = "Contract_SaleFlow";
        var nodeName = "";
        if (nName) {
          nodeName = nName;
        }
        var searchText = "";
        var _method = "component.getListData";
        var _param = {
          bizObj: "TASK",
          service: "searchAllTasks",
          fields: "*",
          filter: {
            userId : userId,
            defKey : defKey,
            name : nodeName,
            mSearch: searchText //手机端模糊查询参数
          },
          currentPageIndex: 1,
          pageSize: 99999
        }
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas) {
            for (var i = 0; i < data.datas.length; i++) {
              $scope.inventoryTaskList.push(data.datas[i]);
            }
          }
        });
      }
    }
  }).factory("assetPreCacheService", function ($rootScope, commonService, dbService){
    return {
      /**
       * 根据ID查询资产盘点的信息
       * @param $scope
       */
      getAssetInventoryById : function ($scope) {//将资产盘点计划缓存到本地
        var _method = "component.getListData";
        var filter = "";
        var _param = {
          "bizObj": "ASSET_INVENTORY",
          "service": "selectMore",
          "fields": "*",
          "filter": "1=1 and id ='AI-1197'",//查询条件写死了，正式时需要修改
          "currentPageIndex": 1,
          "pageSize": 99999,
          "orderList": []
        };
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas && data.datas.length > 0) {
            $scope.inventory = data.datas[0];
          } else {
            alert("未查询到资产盘点计划。");
          }
        });
      },insertAssetInventory : function ($scope) {
        var inventory = $scope.inventory;
        var flowParam = $scope.flowParam;
        var sql = "insert into ASSET_INVENTORY(ID,APPLY_NAME,COMPANY_NAME,DEPT_NAME,TITLE,INVENTORY_ROOM_NAME,REMARKS,ASSIGNEE,DEFID,DEFKEY,INSTID,TASKID,NODEID,NODENAME) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var sqlV = [];
        sqlV.push(inventory.ID);
        sqlV.push(inventory.APPLY_NAME);
        sqlV.push(inventory.COMPANY_NAME);
        sqlV.push(inventory.DEPT_NAME);
        sqlV.push(inventory.TITLE);
        sqlV.push(inventory.INVENTORY_ROOM_NAME);
        sqlV.push(inventory.REMARKS);
        sqlV.push(flowParam.ASSIGNEE);
        sqlV.push(flowParam.DEFID);
        sqlV.push(flowParam.DEFKEY);
        sqlV.push(flowParam.INSTID);
        sqlV.push(flowParam.TASKID);
        sqlV.push(flowParam.NODEID);
        sqlV.push(flowParam.NODENAME);
        var db = dbService.getDb();
        db.executeSql(sql, sqlV, function (resultSet) {
          alert("insert ASSET_INVENTORY succ");
        }, function(error) {
          alert('delete data ASSET_INVENTORY error: ' + error.message);
        });
        //var sql = "select * from ASSET_INVENTORY";
        //db.executeSql(sql, null, function (resultSet) {
        //  alert(11);
        //  var len = resultSet.rows.length;
        //  alert(len);
        //  alert(JSON.stringify(resultSet.rows.item(0)));
        //},function (error) {
        //  alert('error: ' + error.message);
        //});
      },deleteAssetInventory : function () {
        var sql = "delete from ASSET_INVENTORY";
        var db = dbService.getDb();
        db.executeSql(sql, null, function (resultSet) {
          alert("delete ASSET_INVENTORY succ");
        }, function(error) {
          alert('delete data ASSET_INVENTORY error: ' + error.message);
        });
      },queryAssetInventoryDelById : function ($scope) {
        var _method = "component.getListData";
        var _param = {
          "bizObj": "ASSET_INVENTORY_DETL",
          "service": "selectMore",
          "fields": "*",
          "filter": "1=1 and ai_id ='AI-1197'",//查询条件写死了，正式时需要修改
          "currentPageIndex": 1,
          "pageSize": 9999,
          "orderList": []
        };
        var _this = this;
        commonService.callMethod(_method, _param, function (data) {
          if (data && data.datas && data.datas.length > 0) {
            _this.insertAssetInventoryDel(data.datas);
          } else {
            alert("未查询到资产盘点计划。");
          }
        });
      },deleteAssetInventoryDel : function () {
        var sql = "delete from ASSET_INVENTORY_DETL";
        var db = dbService.getDb();
        db.executeSql(sql, null, function (resultSet) {
          alert("delete ASSET_INVENTORY_DETL succ");
        }, function(error) {
          alert('delete data ASSET_INVENTORY_DETL error: ' + error.message);
        });
      },insertAssetInventoryDel : function (datas) {
        document.addEventListener("deviceready", function () {
          var db = dbService.getDb();
          var sql = "INSERT INTO ASSET_INVENTORY_DETL(AID_ID,AI_ID,SAP_ASSETCODE,ASSETENTIYCODE,ASSETNAME,ASSETDESC,STOREAREA_DESC,MACHINEROOM_NAME,COMPANY_NAME,COSTCENTER_NAME,ASSET_STATE,SERIALNUMBER,TAKOR_DEPTNAME,TAKOR_NAME,BRAND,ASSET_MODEL,ASSET_INFO,ASSET_STATE_L) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'待盘点')";
          for (var i = 0; i < datas.length; i++) {
            var del = datas[i];
            var sqlV = [];
            sqlV.push(del.AID_ID);
            sqlV.push(del.AI_ID);
            sqlV.push(del.SAP_ASSETCODE);
            sqlV.push(del.ASSETENTIYCODE);
            sqlV.push(del.ASSETNAME);
            sqlV.push(del.ASSETDESC);
            sqlV.push(del.STOREAREA_DESC);
            sqlV.push(del.MACHINEROOM_NAME);
            sqlV.push(del.COMPANY_NAME);
            sqlV.push(del.COSTCENTER_NAME);
            sqlV.push(del.ASSET_STATE);
            sqlV.push(del.SERIALNUMBER);
            sqlV.push(del.TAKOR_DEPTNAME);
            sqlV.push(del.TAKOR_NAME);
            sqlV.push(del.BRAND);
            sqlV.push(del.ASSET_MODEL);
            sqlV.push(del.ASSET_INFO);
            db.executeSql(sql, sqlV, function (resultSet) {
              //alert("insert ASSET_INVENTORY_DETL succ");
            }, function(error) {
              alert('insert data ASSET_INVENTORY_DETL error: ' + error.message);
            });
          }
          //db.executeSql("update ASSET_INVENTORY_DETL set asset_state_l = '盘平' where aid_id='1068'", null, function (resultSet) {
          //  alert("update ASSET_INVENTORY_DETL succ");
          //}, function(error) {
          //  alert('update data ASSET_INVENTORY_DETL error: ' + error.message);
          //});
          alert("缓存完成");
          $scope.closeModal();
        });
      },updateAssetInventoryDel : function ($scope) {//更新本地的资产信息
        var assetInfo = $scope.assetInfo;
        var db = dbService.getDb();
        var sql = "update ASSET_INVENTORY_DETL set ISINFOCHANGE = ?,INFOCHANGECONTENTS= ? where AID_ID = ? and ASSETENTIYCODE = ?";
        var sqlV = [];
        sqlV.push(assetInfo.ISINFOCHANGE);
        sqlV.push(assetInfo.INFOCHANGECONTENTS);
        sqlV.push(assetInfo.AID_ID);
        sqlV.push(assetInfo.ASSETENTIYCODE);
        db.executeSql(sql, sqlV, function (resultSet) {
          alert("更新成功");
          $scope.closeModal();
        }, function(error) {
          alert('update data ASSET_INVENTORY_DETL error: ' + error.message);
        });
      },addAssetInventoryDel : function ($scope) {
        var assetInfo = $scope.assetInfo;
        var db = dbService.getDb();
        var sql = "insert into ASSET_INVENTORY_DETL(ASSETENTIYCODE, ASSET_STATE_L) values(?,?)";
        var sqlV = [];
        sqlV.push(assetInfo.ASSETENTIYCODE);
        sqlV.push("盘盈");
        alert(sql);
        db.executeSql(sql, sqlV, function (resultSet) {
          $scope.$emit("refresh-list", "close-modal");
        }, function(error) {
          alert('insert data ASSET_INVENTORY_DETL error: ' + error.message);
        });
      },addAssetInventoryDelW : function ($scope, assetEntiyCode) {
        var db = dbService.getDb();
        var sql = "insert into ASSET_INVENTORY_DETL(ASSETENTIYCODE, ASSET_STATE_L) values(?,?)";
        var sqlV = [];
        sqlV.push(assetEntiyCode);
        sqlV.push("外部人员盘点");
        alert(sql);
        db.executeSql(sql, sqlV, function (resultSet) {
          $scope.refreshAsset();
        }, function(error) {
          alert('insert data ASSET_INVENTORY_DETL error: ' + error.message);
        });
      },queryAssetDetl : function ($scope) {//查询本地的缓存未盘点
        var db = dbService.getDb();
        var limit = $scope.pageInfo.pageSize;
        var offset = ($scope.pageInfo.currentPageIndex - 1) * $scope.pageInfo.pageSize;
        var searchText = $scope.search.searchText;
        var sqlQ = "select * from ASSET_INVENTORY_DETL ";
        if (searchText != "") {
          sqlQ += " and ASSETENTIYCODE = '" + searchText + "'";
        }
        var sql = "select * from (" + sqlQ + ") LIMIT " + limit + " OFFSET " + offset ;
        //alert(sql);
        db.executeSql(sql, null, function (resultSet) {
          var len = resultSet.rows.length;
          for (var i = 0; i < len; i++) {
            $scope.assetList.push(resultSet.rows.item(i));
          }
          //alert($scope.assetList_wpd.length);
        },function (error) {
          alert('error: ' + error.message);
        });
        var countSql = "select count(*) as count from (" + sqlQ + ")";
        db.executeSql(countSql, null, function (resultSet) {
          if (resultSet.rows) {
            //alert(resultSet.rows.item(0).count);
            $scope.pageInfo.allCount = resultSet.rows.item(0).count
          }
        },function (error) {
          alert('error: ' + error.message);
        });
        setTimeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 1000);

      }
    }
  });
