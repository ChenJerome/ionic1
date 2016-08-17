angular.module('mobileApp.controllers', ['mobiscroll-select', 'angular-intro'])
    .controller('loginCtrl', function($scope, $state, loginService, myPopover, $cordovaAppVersion,
        updateService, $ionicNavBarDelegate, $rootScope, $cordovaVibration, $http, $cordovaKeyboard) {
        $scope.unlock = {};
        $scope.unlock.pwd = "";
        $scope.unlock.errorCount = 0;
        $scope.unlock.forgotPwd = true;
        $scope.isRemember = util.getIsRemember();
        $scope.isAutoLogin = util.getIsAutoLogin();
        $scope.user = {};
        $scope.user.loginId = "";
        $scope.user.password = "";
        $scope.user.loginId = util.getLoginId();
        //if ($scope.isRemember) {

        $scope.user.password = util.getPassword();
        $scope.version = "V 1.0.63";
        //}
        document.addEventListener("deviceready", function() {
            $cordovaAppVersion.getVersionNumber().then(function(version) {
                $scope.version = version;
            });
        }, false);
        $scope.login = function() {
            if (!util.isNotEmpty($scope.user.loginId) || !util.isNotEmpty($scope.user.password)) {
                myPopover.showPopoverMsg("登录异常", "账号和密码不能为空！");
                return;
            }
            loginService.login($scope.user);
        }
        $scope.rememberPassword = function() {
            $scope.isRemember = !$scope.isRemember;
            util.setIsRemember($scope.isRemember);
        }
        $scope.autoLogin = function() {
            //alert($scope.isAutoLogin);
            $scope.isAutoLogin = !$scope.isAutoLogin;
            util.setIsAutoLogin($scope.isAutoLogin);
        }
        $scope.goAutoLogin = function() {
            if ($scope.isAutoLogin) {
                //alert($scope.isAutoLogin);
                $scope.login();
            }
        }
        $scope.keyUp = function(event) {
            if (event.keyCode == 13) {
                document.addEventListener("deviceready", function() {
                    $cordovaKeyboard.close();
                });
                $scope.login();
            }
        }
        $scope.removeUnLockPwd = function() {
            $scope.unlock.pwd = "";
            $scope.unlock.pwd1 = false;
            $scope.unlock.pwd2 = false;
            $scope.unlock.pwd3 = false;
            $scope.unlock.pwd4 = false;
        }
        $scope.touchNum = function(num) {
            //alert(num);
            var unlockPwd = $scope.unlock.pwd;
            if (unlockPwd.length < 4) {
                unlockPwd = unlockPwd + num;
                $scope.unlock.pwd = unlockPwd;
                if (unlockPwd.length == 1) {
                    $scope.unlock.pwd1 = true;
                } else if (unlockPwd.length == 2) {
                    $scope.unlock.pwd2 = true;
                } else if (unlockPwd.length == 3) {
                    $scope.unlock.pwd3 = true;
                } else if (unlockPwd.length == 4) {
                    $scope.unlock.pwd4 = true;

                    if (util.getLockPassword() == unlockPwd) { //锁屏密码输入正确
                        $scope.unlock.errorCount = 0;
                        if ($scope.unLockPopover) {
                            $scope.unLockPopover.remove();
                            //$scope.login();
                        }
                        $scope.unlock.pwd = "";
                        $scope.unlock.pwd1 = false;
                        $scope.unlock.pwd2 = false;
                        $scope.unlock.pwd3 = false;
                        $scope.unlock.pwd4 = false;
                    } else {
                        $scope.unlock.errorCount += 1;
                        document.addEventListener("deviceready", function() {
                            $cordovaVibration.vibrate(200);
                        });
                        $scope.unlock.pwd = "";
                        $scope.unlock.pwd1 = false;
                        $scope.unlock.pwd2 = false;
                        $scope.unlock.pwd3 = false;
                        $scope.unlock.pwd4 = false;
                        $scope.unlock.error = "密码错误,您还有" + (5 - $scope.unlock.errorCount) + "次机会。";
                        setTimeout(function() {
                            $scope.unlock.error = "";
                        }, 2000)
                        if ($scope.unlock.errorCount >= 5) {
                            angular.element("#gesturePwd").hide();
                            angular.element("#forgotPwd").show();
                        }
                    }
                }
            } else if (unlockPwd.length == 4) {

            }

        }
        $scope.forgotPwd = function() {
            angular.element("#gesturePwd").hide();
            angular.element("#forgotPwd").show();
        }
        $scope.goToGesPwd = function() {
            if ($scope.unlock.errorCount >= 5) {
                return;
            }
            angular.element("#forgotPwd").hide();
            angular.element("#gesturePwd").show();
        }
        $scope.misPwd = function() {
            var misPassword = angular.element("#misPassword").val();
            var userId = window.localStorage.userId;
            var loginInfo = {};
            loginInfo.password = misPassword;
            loginInfo.loginId = userId;
            $http.post(UrlConfig.login, loginInfo).success(function(data) {
                if (data) {
                    if (data.loginResut == "0") {
                        alert("MIS密码不正确");
                    } else {
                        window.localStorage.isSetLockPwd = "notSet";
                        util.setLockPassword("");
                        if ($scope.unLockPopover) {
                            $scope.unLockPopover.remove();
                        }
                    }
                }
            });
        }
        updateService.checkVersion();
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            //alert(toState.url);
            //console.log(fromState);
            if (toState.url == "/login") { //如果是重登录，需要重新加载所有的数据
                var isSetLockPwd = window.localStorage.isSetLockPwd;
                if (isSetLockPwd == "set") {
                    $scope.unlock.pwd = "";
                    loginService.showLockPwd($scope);
                    return;
                }
                if (fromState.views == null) { //说明是刚打开app

                } else { //如果不是刚打开app就说明是从其他地方跳到登录页面那么取消自动登录
                    $scope.isAutoLogin = false;
                    util.setIsAutoLogin($scope.isAutoLogin);
                }
                $scope.goAutoLogin();
                //window.location.reload();
                //var isReload = $rootScope.isReload;
                //if (isReload) {
                //  $rootScope.isReload = false;
                //  window.location.reload();
                //}
            }
        });
    }).controller('procCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.instId = "";
        $scope.$on("proc-list", function(d, param) {
            $scope.modal = param.modal;
            $scope.instId = param.instId;
            $scope.getTaskProcess();
        });
        $scope.closeProc = function() {
            $scope.modal.remove();
        };

        //获取流程处理过程
        $scope.getTaskProcess = function() {
            var url = UrlConfig.callMethod + "?authKey=" + util.getAuthKey();
            var param = {};
            param._method = "flow.getTaskProcess";
            var _param = [];
            _param.push($scope.instId);
            console.log($scope.instId);
            param._param = _param;
            $http.post(url, param).success(function(data, status) {
                $scope.process = data;
                if (data.taskListIng) {
                    $scope.wfName = data.taskListIng[0].wfName
                }
            }).error(function(data, status) {

            });

        };
    }])
    .controller('formCtrl', function($scope, $rootScope, formService, myPopover, $cordovaDatePicker,
        commonService, myLoading, errorService, $ionicModal, $ionicScrollDelegate, $ionicGesture, $cordovaInAppBrowser) {
        $scope.getToolbar = null;
        $scope.formData = {};
        $scope.getSysVar = {};
        $scope.oldFormData = null;
        $scope.convertImgs = [];
        $scope.dealImg = true;
        $scope.operatorCss = "";
        if (window.localStorage.operatorCss != "set") {
            $scope.operatorCss = "operatorCss";
        }
        $scope.selectSetting = {
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200
        };
        $scope.dateSetting = {
                theme: 'android-holo-light',
                lang: 'zh',
                display: 'modal',
                dateFormat: "yy-mm-dd",
                mode: 'mixed',
                minDate: new Date()
            }
            /**
             * 显示或者隐藏明细的信息
             */
        $scope.showOrHideDetail = function(domId, event) {
            //alert(angular.element(event.target).find(".detail-title-ion").attr("class"));
            var icon = angular.element(event.target).find(".detail-title-ion");
            if (icon) {
                if (icon.hasClass("ion-plus")) {
                    icon.removeClass("ion-plus");
                    icon.addClass("ion-minus");
                } else {
                    icon.removeClass("ion-minus");
                    icon.addClass("ion-plus");
                }
            }
            angular.element(event.target).find("i").attr("class");
            angular.element("#" + domId).slideToggle(function() {
                $ionicScrollDelegate.$getByHandle('formMainScroll').resize();
            });
        }
        $scope.closeViewAttachment = function() {
            $scope.viewAttachmentModal.remove();
        };
        $scope.viewAttachment = function(fileId) {
            $scope._r_server = _r_server + "/file/";
            $scope.attachmentFileId = fileId;
            //$scope.convertImgs = [];
            if ($scope.convertFile != undefined) {
                $scope.dealImg = false;
                $scope.convertImgs = $scope.convertFile[$scope.attachmentFileId];
                /*var convertImgs = $scope.convertFile[$scope.attachmentFileId];
                 if (convertImgs.length > 2 ) {
                 $scope.convertImgs.push(convertImgs[0]);
                 $scope.convertImgs.push(convertImgs[1]);
                 } else {
                 $scope.convertImgs = convertImgs;
                 }*/
            }
            var formUrl = "templates/view-attachment.html";
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                modal.show();
                $scope.viewAttachmentModal = modal;
            });
        }
        $scope.hasMoreImg = function() {
            /*if ($scope.convertFile) {
             var convertImgs = $scope.convertFile[$scope.attachmentFileId];
             if (convertImgs.length > $scope.convertImgs.length) {
             return true;
             } else {
             return false;
             }
             } else {
             return false;
             }*/
            return true;
        }
        $scope.loadMoreImg = function() {
            if ($scope.convertFile) {
                var convertImgs = $scope.convertFile[$scope.attachmentFileId];
                var count = $scope.convertImgs.length;
                $scope.convertImgs.push(convertImgs[count])
            } else {}
        }
        $scope.showActionSheet = function() {
            window.localStorage.operatorCss = "set";
            $scope.operatorCss = "";
            if ($scope.getToolbar != null) {
                formService.showActionSheet($scope, $scope.getToolbar);
            }
        };
        $scope.fileDownLoad = function(guid, fileId, fileName) {
            //window.open(_r_server + "/file/" + "822f300ada38c0335c081ad5634deb9d.PDF");
            //if (util.isWord(fileName) || util.isExcel(fileName) || util.isPdf(fileName) || util.isPpt(fileName)) {
            //  $scope.viewAttachment(fileId);
            //} else {
            //  myPopover.showPopoverMsg("暂不支持打开此格式的附件。")
            //}
            formService.fileDownLoad($scope, guid, fileId, fileName);
        };

        /**
         * 监听表单打开
         */
        $scope.formTabs = [];
        $scope.$on("form-open", function(d, param) {
            $scope.openForm(d, param);
        });
        $scope.openForm = function(d, param) {
            $scope.param = param;
            $scope.getTaskProcess();
            var bizObjId = param.BIZOBJID;
            var formId = util.getFormId(param.FORM);
            var formTabWidth = 0;
            if (FormConfig[bizObjId][formId].formModal.formTabs) {
                var formTabs = FormConfig[bizObjId][formId].formModal.formTabs;
                for (var i = 0; i < formTabs.length; i++) {
                    formTabWidth += formTabs[i].tabName.length * 14 + 24;
                    $scope.formTabs.push(formTabs[i]);
                    if (i == formTabs.length - 1) {
                        var tabProcessState = {};
                        tabProcessState.pageId = "processState";
                        tabProcessState.tabName = "流程状态";
                        $scope.formTabs.push(tabProcessState);
                        formTabWidth += 14 * 4 + 24;
                    }
                }
            }
            $scope.formTabWidth = formTabWidth;
            myLoading.showLoading();
            formService.getFormData($scope.param, $scope);
            //给弹出的表单页面注册左右滑动事件
            var mContent = angular.element("ion-modal-view ion-content");
            $ionicGesture.on("swipeleft", function() {
                $scope.formSwipeLeft();
            }, mContent);
            $ionicGesture.on("swiperight", function() {
                $scope.formSwipeRight();
            }, mContent);
        }

        $scope.closeOpenWindow = function() {
            if ($scope.modal_ow) {
                $scope.modal_ow.remove();
            }
        }
        $scope.openWindow = function(itemParam) {
            //$scope.closeModal();
            //setTimeout(function () {
            //  $scope.openForm("", $scope.param);
            //},100);
            //return;
            //$scope.formTabs = [];
            //var itemParam = {};
            //itemParam.BIZOBJID = "CONTRACT_PURCHASE";
            //itemParam.DEFID = "Contract_PurchaseApply:6:3ff3dade-31a0-4c3d-b37f-0117a94b5a91";
            //itemParam.DEFKEY = "Contract_PurchaseApply";
            //itemParam.FKEY = "PURCHASE_ID";
            //itemParam.FORM = "forms/ContractInfo/CONTRACT_PURCHASE/CGContract_ViewEndForm.html";
            //itemParam.FORM = "forms/ContractInfo/CONTRACT_PURCHASE/CGContract_ViewEndForm_ow.html";
            //itemParam.FORMID = "CGContract_ViewEndForm";
            //itemParam.VIEWID = "CGContract_ViewEndForm";
            //itemParam.USETYPE = "view";
            //itemParam.FVALUE = "STC-36214";
            //itemParam.INSTID = "f1378821-a934-4271-b7c5-0438e33ac522";
            //itemParam = item;
            //itemParam.USETYPE = "modify";
            var formUrl = itemParam.FORM;
            var viewId = util.getFormId(formUrl);
            var bizObjId = itemParam.BIZOBJID;
            if (!FormConfig[bizObjId] || !FormConfig[bizObjId][viewId]) {
                myPopover.showPopoverMsg("", "当前节点暂时不支持在手机端提交，请至web端操作。");
                return;
            }
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                $scope.modal_ow = modal;
                //$rootScope.formModal_ow = modal;
                modal.show();
                $scope.$broadcast('window-open', itemParam);
            });
        }
        $scope.formSwipeLeft = function() {
            var length = $scope.formTabs.length;
            var activeFormTabIndex = $scope.activeFormTabIndex;
            if (activeFormTabIndex + 1 < length) {
                $scope.changeFormTab(activeFormTabIndex + 1);
            }
        }
        $scope.formSwipeRight = function() {
            var length = $scope.formTabs.length;
            var activeFormTabIndex = $scope.activeFormTabIndex;
            if (activeFormTabIndex - 1 >= 0) {
                $scope.changeFormTab(activeFormTabIndex - 1);
            }
        }
        $scope.getTaskProcess = function() {
            var _method = "flow.getTaskProcess";
            var _param = [];
            _param.push($scope.param.INSTID);
            commonService.callMethod(_method, _param, function(data) {
                $scope.process = data;
            });
        };
        $scope.$on("save-form", function(d, flowButtonParam) {
            formService.saveFormData(flowButtonParam, $scope, commonService);
        });
        $scope.$on("rollBackTaskByTaskId", function(d, flowButtonParam) { //监听驳回
            formService.rollBackTaskByTaskId(flowButtonParam, $scope);
        });
        $scope.$on("pending", function(d, flowButtonParam) { //监听加签
            formService.sign(flowButtonParam, $scope);
        });
        $scope.$on("claim", function(d, flowButtonParam) { //监听加签
            formService.claimTask(flowButtonParam, $scope);
        });
        $scope.$on("releaseTask", function(d, flowButtonParam) { //监听加签
            formService.releaseTask(flowButtonParam, $scope);
        });
        $scope.activeFormTabIndex = 0;
        $scope.oldFormTabIndex = 0;
        $scope.changeFormTab = function(index) {
            var activeFormTabIndex = $scope.activeFormTabIndex;
            var formTabLength = $scope.formTabs.length;
            if (index != activeFormTabIndex && index < formTabLength) {
                var formTab = $scope.formTabs[index]; //当前点击将要选中的tab
                var activeFormTab = $scope.formTabs[activeFormTabIndex]; //当前选中tab
                angular.element("#tab_" + activeFormTab.pageId).removeClass("active");
                angular.element("#tab_" + formTab.pageId).addClass("active");
                $scope.oldFormTabIndex = activeFormTabIndex;
                $scope.activeFormTabIndex = index;

                angular.element("#" + activeFormTab.pageId).slideUp();
                angular.element("#" + formTab.pageId).slideDown();
                var formTabScroll = $ionicScrollDelegate.$getByHandle('formTabScroll');
                formTabScroll.scrollBy((index - activeFormTabIndex) * 80, 0, true);
            }
            $ionicScrollDelegate.$getByHandle('formMainScroll').resize();
            $ionicScrollDelegate.$getByHandle('formMainScroll').scrollTop(true);
        }
        $scope.loginCtrip = function (initPage, oaId) {
          //window.open("http://172.29.201.130:8080/demo/rest/ctrip","_blank");
          var userId = util.getUserId();
          var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes',
            closebuttoncaption: '返回'
          };
          var url = mServer + "/ctrip?initPage=" + initPage + "&oaId=" + oaId + "&userId=" + userId;
          $cordovaInAppBrowser.open(url, '_blank', options)
            .then(function (event) {

            })
            .catch(function (event) {

            });
        }
    }).controller('openWindowCtrl', function($scope, $rootScope, formService, myPopover, $cordovaDatePicker,
        commonService, myLoading, errorService, $ionicModal, $ionicScrollDelegate, $ionicGesture) {
        console.log($scope);
        $scope.getToolbar = null;
        $scope.formData = {};
        $scope.getSysVar = {};
        $scope.oldFormData = null;
        $scope.convertImgs = [];
        $scope.dealImg = true;
        $scope.selectSetting = {
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200
        };
        $scope.dateSetting = {
                theme: 'android-holo-light',
                lang: 'zh',
                display: 'modal',
                dateFormat: "yy-mm-dd",
                mode: 'mixed',
                minDate: new Date()
            }
            /**
             * 显示或者隐藏明细的信息
             */
        $scope.showOrHideDetail = function(domId, event) {
            //alert(angular.element(event.target).find(".detail-title-ion").attr("class"));
            var icon = angular.element(event.target).find(".detail-title-ion");
            if (icon) {
                if (icon.hasClass("ion-plus")) {
                    icon.removeClass("ion-plus");
                    icon.addClass("ion-minus");
                } else {
                    icon.removeClass("ion-minus");
                    icon.addClass("ion-plus");
                }
            }
            angular.element(event.target).find("i").attr("class");
            angular.element("#" + domId).slideToggle(function() {
                $ionicScrollDelegate.$getByHandle('formMainScroll').resize();
            });
        }
        $scope.closeViewAttachment = function() {
            $scope.viewAttachmentModal.remove();
        };
        $scope.viewAttachment = function(fileId) {
            $scope._r_server = _r_server + "/file/";
            $scope.attachmentFileId = fileId;
            //$scope.convertImgs = [];
            if ($scope.convertFile != undefined) {
                $scope.dealImg = false;
                $scope.convertImgs = $scope.convertFile[$scope.attachmentFileId];
                /*var convertImgs = $scope.convertFile[$scope.attachmentFileId];
                 if (convertImgs.length > 2 ) {
                 $scope.convertImgs.push(convertImgs[0]);
                 $scope.convertImgs.push(convertImgs[1]);
                 } else {
                 $scope.convertImgs = convertImgs;
                 }*/
            }
            var formUrl = "templates/view-attachment.html";
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                modal.show();
                $scope.viewAttachmentModal = modal;
            });
        }
        $scope.hasMoreImg = function() {
            /*if ($scope.convertFile) {
             var convertImgs = $scope.convertFile[$scope.attachmentFileId];
             if (convertImgs.length > $scope.convertImgs.length) {
             return true;
             } else {
             return false;
             }
             } else {
             return false;
             }*/
            return true;
        }
        $scope.loadMoreImg = function() {
            if ($scope.convertFile) {
                var convertImgs = $scope.convertFile[$scope.attachmentFileId];
                var count = $scope.convertImgs.length;
                $scope.convertImgs.push(convertImgs[count])
            } else {}
        }
        $scope.showActionSheet = function() {
            if ($scope.getToolbar != null) {
                formService.showActionSheet($scope, $scope.getToolbar);
            }
        };
        $scope.fileDownLoad = function(guid, fileId, fileName) {
            //window.open(_r_server + "/file/" + "822f300ada38c0335c081ad5634deb9d.PDF");
            //if (util.isWord(fileName) || util.isExcel(fileName) || util.isPdf(fileName) || util.isPpt(fileName)) {
            //  $scope.viewAttachment(fileId);
            //} else {
            //  myPopover.showPopoverMsg("暂不支持打开此格式的附件。")
            //}
            formService.fileDownLoad($scope, guid, fileId, fileName);
        };

        /**
         * 监听表单打开
         */
        $scope.formTabs = [];
        $scope.$on("window-open", function(d, param) {
            $scope.openForm(d, param);
        });
        $scope.openForm = function(d, param) {
            $scope.param = param;
            //$scope.getTaskProcess();//默认不请求流程状态
            var bizObjId = param.BIZOBJID;
            var formId = util.getFormId(param.FORM);
            var formTabWidth = 0;
            if (FormConfig[bizObjId][formId].formModal.formTabs) {
                var formTabs = FormConfig[bizObjId][formId].formModal.formTabs;
                for (var i = 0; i < formTabs.length; i++) {
                    formTabWidth += formTabs[i].tabName.length * 14 + 24;
                    $scope.formTabs.push(formTabs[i]);
                    /**不加载流程状态
                     if (i == formTabs.length - 1) {
                      var tabProcessState = {};
                      tabProcessState.pageId = "processState";
                      tabProcessState.tabName = "流程状态";
                      $scope.formTabs.push(tabProcessState);
                      formTabWidth += 14 * 4 + 24;
                    }**/
                }
            }
            $scope.formTabWidth = formTabWidth;
            myLoading.showLoading();
            formService.getFormData($scope.param, $scope);
            //给弹出的表单页面注册左右滑动事件
            var mContent = angular.element("ion-modal-view ion-content");
            $ionicGesture.on("swipeleft", function() {
                $scope.formSwipeLeft();
            }, mContent);
            $ionicGesture.on("swiperight", function() {
                $scope.formSwipeRight();
            }, mContent);
        }

        $scope.formSwipeLeft = function() {
            var length = $scope.formTabs.length;
            var activeFormTabIndex = $scope.activeFormTabIndex;
            if (activeFormTabIndex + 1 < length) {
                $scope.changeFormTab(activeFormTabIndex + 1);
            }
        }
        $scope.formSwipeRight = function() {
            var length = $scope.formTabs.length;
            var activeFormTabIndex = $scope.activeFormTabIndex;
            if (activeFormTabIndex - 1 >= 0) {
                $scope.changeFormTab(activeFormTabIndex - 1);
            }
        }
        $scope.getTaskProcess = function() {
            var _method = "flow.getTaskProcess";
            var _param = [];
            _param.push($scope.param.INSTID);
            commonService.callMethod(_method, _param, function(data) {
                $scope.process = data;
            });
        };
        $scope.$on("save-form", function(d, flowButtonParam) {
            formService.saveFormData(flowButtonParam, $scope, commonService);
        });
        $scope.$on("rollBackTaskByTaskId", function(d, flowButtonParam) { //监听驳回
            formService.rollBackTaskByTaskId(flowButtonParam, $scope);
        });
        $scope.$on("pending", function(d, flowButtonParam) { //监听加签
            formService.sign(flowButtonParam, $scope);
        });
        $scope.$on("claim", function(d, flowButtonParam) { //监听加签
            formService.claimTask(flowButtonParam, $scope);
        });
        $scope.$on("releaseTask", function(d, flowButtonParam) { //监听加签
            formService.releaseTask(flowButtonParam, $scope);
        });
        $scope.activeFormTabIndex = 0;
        $scope.oldFormTabIndex = 0;
        $scope.changeFormTab = function(index) {
            var activeFormTabIndex = $scope.activeFormTabIndex;
            var formTabLength = $scope.formTabs.length;
            if (index != activeFormTabIndex && index < formTabLength) {
                var formTab = $scope.formTabs[index]; //当前点击将要选中的tab
                var activeFormTab = $scope.formTabs[activeFormTabIndex]; //当前选中tab
                angular.element("#tab_" + activeFormTab.pageId).removeClass("active");
                angular.element("#tab_" + formTab.pageId).addClass("active");
                $scope.oldFormTabIndex = activeFormTabIndex;
                $scope.activeFormTabIndex = index;

                angular.element("#" + activeFormTab.pageId).slideUp();
                angular.element("#" + formTab.pageId).slideDown();
                var formTabScroll = $ionicScrollDelegate.$getByHandle('formTabScroll');
                formTabScroll.scrollBy((index - activeFormTabIndex) * 80, 0, true);
            }
            $ionicScrollDelegate.$getByHandle('formMainScroll').resize();
            $ionicScrollDelegate.$getByHandle('formMainScroll').scrollTop(true);
        }

    })
    .controller('appCtrl', function($scope, applistService, taskService, userService, $state, $ionicPopup) {
      //菜单点击方法，如果是url则通过路由做跳转
      //如果是方法，则通过方法监听去执行
      $scope.menuClick = function(menu) {
        //var url = obj.url;
        var url = menu.url;
        if (confirmPopup != null)
          confirmPopup.close();
        if (url.indexOf(".") > -1) { //url 要做跳转
          $state.go(url);
        } else { //方法，要去执行
          $scope.$broadcast(url, menu);
        }
      }

      var confirmPopup = null;
      //通过pop窗口显示
      $scope.$on("openChildMenu", function(d, params) {
        $scope.childMenus = params.childs;
        // console.log(params.childs);
        confirmPopup = $ionicPopup.show({
          title: "会议室管理",
          templateUrl: 'templates/child-menu.html',
          scope: $scope
        });

        angular.element(".popup-container").addClass("assgin-list-popup");
        setTimeout(function() { //点击其他部分关闭弹出框
          angular.element(document.querySelector('html')).click(function(event) {
            if (event.target.nodeName === "HTML") {
              confirmPopup.close();
            }
          });
        }, 300);
        //console.log(params);
      });
      //$scope.openForm = function (key) {
      //  var param = MenuConfig[key];
      //  var formUrl = param.form;
      //  $ionicModal.fromTemplateUrl(formUrl, {
      //    scope: $scope,
      //    animation: "slide-in-up",
      //
      //  }).then(function (modal) {
      //    $scope.modal = modal;
      //    modal.show();
      //    $scope.$broadcast('form-open', param);
      //  });
      //}
      //$scope.closeModal = function () {
      //  $scope.modal.remove();
      //};
      //
      //$scope.removeModal = function () {
      //  $scope.modal.remove();
      //};
      //$scope.$on("close-modal", function () {
      //  $scope.modal.remove();
      //});
      $scope.menuList = [];
      $scope.pageInfo = {};
      $scope.pageInfo.allCount = 0;
      $scope.jobName = "";
      $scope.userName = window.localStorage.userName;
      $scope.search = {};
      $scope.search.defKey_task = "";
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        //$scope.pageInfo.allCount = 0;
        //taskService.getToDoTaskCount($scope);
      });
      taskService.getToDoTaskCount($scope);
      applistService.getUserMenus($scope);
    })
    .controller("toDoTaskCtrl", function($scope, taskService, $timeout,
        $ionicModal, myPopover, myLoading, loginService, $log, $rootScope,
        errorService, $cordovaKeyboard, $cordovaToast, $state, $ionicScrollDelegate, $ionicPopover) {
        $scope.activeSlide = 0;
        $scope.flowDef = selectGroup.flowDef;
        var isSetLockPwd = window.localStorage.isSetLockPwd;
        $scope.lock = {};
        $scope.lock.lockPwd = "";
        $scope.nextGName = "继续";
        //alert(isSetLockPwd);

        //alert(2);
        $scope.setLockPwd = function() {
            //alert(1);
            $scope.lockInfo = "请输入4位数字密码";
            $scope.nextGName = "继续";
            $scope.lock.lockPwd = "";
            $scope.lockStep = 1;
            $scope.lockType = "set";
            $ionicPopover.fromTemplateUrl('templates/t-set-lock.html', {
                scope: $scope,
                //backdropClickToClose : false,
                focusFirstInput: true
            }).then(function(popover) {
                $scope.popover = popover;
                popover.show();
            });
        }
        if (isSetLockPwd == "set") {
            $scope.isSetLockPwd = true;
        } else {
            $scope.isSetLockPwd = false;
            $scope.setLockPwd();
        }
        $scope.removeLock = function() {
            window.localStorage.isSetLockPwd = "notSet";
            $scope.isSetLockPwd = false;
        }
        $scope.closePo = function() {
            var popover = $scope.popover;
            //alert(44);
            setTimeout(function() {
                //alert(1);
                angular.element("#showIntrojs").click();
            }, 300);
            if (popover != null && popover != undefined) {
                popover.remove();
            }
        }
        $scope.nextG = function() {
            //alert($scope.lock.lockPwd);
            if ($scope.lock.lockPwd.length < 4) {
                return
            }
            var lockStep = $scope.lockStep;
            var lockType = $scope.lockType;
            if (lockType == "set") {
                if (lockStep == 1) {
                    $scope.lockPwd1 = $scope.lock.lockPwd;
                    $scope.lock.lockPwd = "";
                    $scope.lockStep = lockStep + 1;
                    $scope.lockInfo = "确认您的数字密码";
                    $scope.nextGName = "确认";
                    setTimeout(function() {
                        angular.element("#lockPassword").focus();
                    }, 100);
                    //alert(1);
                } else {
                    if ($scope.lock.lockPwd != $scope.lockPwd1) {
                        $scope.lockInfo = "数字密码不匹配!";
                        setTimeout(function() {
                            angular.element("#lockPassword").select();
                        }, 100);
                    } else {
                        util.setLockPassword($scope.lockPwd1);
                        window.localStorage.isSetLockPwd = "set";
                        $scope.isSetLockPwd = true;
                        $scope.closePo();
                        if (window.localStorage.introJs != "set") {
                            //angular.element("#showIntrojs").click();
                        }
                        //$ionicNavBarDelegate.back();

                    }
                }
            } else if (lockType == "edit") {
                if (lockStep == 1) {
                    var lockPwd = util.getLockPassword();
                    if (lockPwd == $scope.lock.lockPwd) {
                        $scope.lock.lockPwd = "";
                        $scope.lockStep = lockStep + 1;
                        $scope.lockInfo = "请输入4位数字密码";
                        $scope.nextGName = "继续";
                        setTimeout(function() {
                            angular.element("#lockPassword").focus();
                        }, 100);
                    } else {
                        $scope.lockInfo = "数字密码不匹配!";
                    }
                    //alert(1);
                } else if (lockStep == 2) {
                    $scope.lockPwd1 = $scope.lock.lockPwd;
                    $scope.lock.lockPwd = "";
                    $scope.lockStep = lockStep + 1;
                    $scope.lockInfo = "确认您的数字密码";
                    $scope.nextGName = "继续";
                    setTimeout(function() {
                        angular.element("#lockPassword").focus();
                    }, 100);
                } else {
                    if ($scope.lock.lockPwd != $scope.lockPwd1) {
                        $scope.lockInfo = "数字密码不匹配!";
                        setTimeout(function() {
                            angular.element("#lockPassword").select();
                        }, 100);
                    } else {
                        util.setLockPassword($scope.lockPwd1);
                        window.localStorage.isSetLockPwd = "set";
                        $scope.isSetLockPwd = true;
                        $scope.closePo();
                    }
                }
            }
        }
        if (window.localStorage.isSetLockPwd != "set") {
            //$state.go("tab.setting");
            //$state.go("tab.settingPwd");
        }
        $scope.initData = function() {

            $scope.todoList = []; //待办列表
            //代办分页信息
            $scope.pageInfo = {};
            $scope.pageInfo.pageSize = 10;
            $scope.pageInfo.currentPageIndex = 1;
            $scope.pageInfo.allPage = 0;
            $scope.pageInfo.allCount = 0;
            $scope.involvedProcess = []; //已办未完成列表
            //已办未完成分页
            $scope.pageInfo_ip = {};
            $scope.pageInfo_ip.pageSize = 10;
            $scope.pageInfo_ip.currentPageIndex = 1;
            $scope.pageInfo_ip.allPage = 0;
            $scope.pageInfo_ip.allCount = 0;
            $scope.involvedProcessCompleted = []; //已办完成列表==历史
            //已办完成分页==历史
            $scope.pageInfo_ipc = {};
            $scope.pageInfo_ipc.pageSize = 10;
            $scope.pageInfo_ipc.currentPageIndex = 1;
            $scope.pageInfo_ipc.allPage = 0;
            $scope.pageInfo_ipc.allCount = 0;
            $scope.agentInfo = []; //代理人列表
            $scope.agentTaskSum = 0;
            $scope.notice = []; //抄送
            //抄送的分页信息
            $scope.pageInfo_notice = {};
            $scope.pageInfo_notice.pageSize = 10;
            $scope.pageInfo_notice.currentPageIndex = 1;
            $scope.pageInfo_notice.allPage = 0;
            $scope.pageInfo_notice.allCount = 0;

            $scope.search = {};
            $scope.search.searchText = "";
            $scope.search.defKey = "";
            $scope.search.defKey_task = "";
            $scope.search.defKey_ip = "";
            $scope.search.defKey_ipc = "";
            $scope.search.defKey_notice = "";
            $scope.search.searchText_task = "";
            $scope.search.searchText_ip = "";
            $scope.search.searchText_ipc = "";
            $scope.search.searchText_notice = "";
            $scope.oldTabId = "toDoTask";
            $scope.activeTab = "toDoTask";
            taskService.getToDoTask($scope);
            taskService.searchMyInvolvedProcess($scope, "0", false);
            taskService.searchMyInvolvedProcess($scope, "1", false);
            taskService.searchMyNotice($scope, false);
            taskService.getAgentUsersAndCount($scope, false);
            setTimeout(function() {
                $('#searchDefKey_task').mobiscroll().select({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    label: 'City',
                    onSelect: function() {
                        $scope.pageInfo.allCount = 0;
                        $scope.todoList = [];
                        $scope.pageInfo.currentPageIndex = 1;
                        taskService.getToDoTask($scope);
                    }
                });
                $('#searchDefKey_ip').mobiscroll().select({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    label: 'City',
                    onSelect: function() {
                        $scope.pageInfo_ip.allCount = 0;
                        $scope.involvedProcess = [];
                        $scope.pageInfo_ip.currentPageIndex = 1;
                        taskService.searchMyInvolvedProcess($scope, "0", true);
                    }
                });
                $('#searchDefKey_ipc').mobiscroll().select({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    label: 'City',
                    onSelect: function() {
                        $scope.pageInfo_ipc.allCount = 0;
                        $scope.involvedProcessCompleted = [];
                        $scope.pageInfo_ipc.currentPageIndex = 1;
                        taskService.searchMyInvolvedProcess($scope, "1", true);
                    }
                });
                //$('#searchDefKey_notice').mobiscroll().select({
                //  theme: 'mobiscroll',
                //  lang: 'zh',
                //  display: 'bottom',
                //  label: 'City',
                //  onSelect : function () {
                //    $scope.pageInfo_notice.allCount = 0;
                //    $scope.notice = [];
                //    $scope.pageInfo_notice.currentPageIndex = 1;
                //    taskService.searchMyNotice($scope, true);
                //  }
                //});
                angular.element("#searchDefKey_s_task").show();
            }, 100);
        };
        //if (window.localStorage.isSetLockPwd == "set") {
        $scope.initData();
        //}
        $scope.changeTaskTab1 = function(type, tabId, $event, slideIndex) {
            $scope.activeSlide = slideIndex;
        }
        $scope.changeTaskTab = function(type, tabId, $event) {

            angular.element(".custom-nav").removeClass("active");
            angular.element("#tab_" + tabId).addClass("active");
            //如果是代理列表就先把查询条件
            if (tabId == "agentUsers") {
                angular.element("#search").slideUp();
            } else {
                angular.element("#search").slideDown();
            }
            var oldTabId = $scope.oldTabId;
            //var activeTab = $scope.activeTab;
            //下面的判断条件是用来保存每个tab的查询条件的
            if (oldTabId == "toDoTask") {
                $scope.search.searchText_task = $scope.search.searchText;
                angular.element("#searchDefKey_s_task").hide();
            } else if (oldTabId == "involvedProcess") {
                $scope.search.searchText_ip = $scope.search.searchText;
                angular.element("#searchDefKey_s_ip").hide();
            } else if (oldTabId == "involvedProcessCompleted") {
                $scope.search.searchText_ipc = $scope.search.searchText;
                angular.element("#searchDefKey_s_ipc").hide();
            } else if (oldTabId == "agentUsers") {

            } else if (oldTabId == "notice") {
                $scope.search.searchText_notice = $scope.search.searchText;
                angular.element("#searchDefKey_s_notice").hide();
            }
            //显示每个tab的查询条件
            if (tabId == "toDoTask") {
                $scope.search.searchText = $scope.search.searchText_task;
                angular.element("#searchDefKey_s_task").show();
            } else if (tabId == "involvedProcess") {
                $scope.search.searchText = $scope.search.searchText_ip;
                angular.element("#searchDefKey_s_ip").show();
            } else if (tabId == "involvedProcessCompleted") {
                $scope.search.searchText = $scope.search.searchText_ipc;
                angular.element("#searchDefKey_s_ipc").show();
            } else if (tabId == "agentUsers") {

            } else if (tabId == "notice") {
                $scope.search.searchText = $scope.search.searchText_notice;
                angular.element("#searchDefKey_s_notice").show();
            }
            //显示当前点击的tab隐藏上一个显示的tab
            if (tabId != oldTabId) {
                $scope.activeTab = tabId;
                angular.element("#" + tabId).slideDown("1000");
                angular.element("#" + oldTabId).slideUp("1000");
                $scope.oldTabId = tabId;
            }
            if (type == "待办") {} else if (type == "已办") {} else if (type == "历史") {} else if (type == "代理") {

            } else if (type == "抄送") {

            }

            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        }
        $scope.slideChanged = function($index) {
            var tabId = "toDoTask";
            //alert($index);
            if ($index == 0) {
                tabId = "toDoTask";
            } else if ($index == 1) {
                tabId = "involvedProcess";
            } else if ($index == 2) {
                tabId = "involvedProcessCompleted";
            } else if ($index == 3) {
                tabId = "agentUsers";
            } else if ($index == 4) {
                tabId = "notice";
            }
            $scope.setTabInfo("", tabId, "", $index);
        }
        $scope.swipeRight = function() {
            var activeTab = $scope.activeTab;
            if (activeTab == "toDoTask") {

            } else if (activeTab == "involvedProcess") {
                $scope.changeTaskTab("", "toDoTask");
            } else if (activeTab == "involvedProcessCompleted") {
                $scope.changeTaskTab("", "involvedProcess");
            } else if (activeTab == "agentUsers") {
                $scope.changeTaskTab("", "involvedProcessCompleted");
            } else if (activeTab == "notice") {
                $scope.changeTaskTab("", "agentUsers");
            }
        }
        $scope.swipeLeft = function() {
            var activeTab = $scope.activeTab;
            if (activeTab == "toDoTask") {
                $scope.changeTaskTab("", "involvedProcess");
            } else if (activeTab == "involvedProcess") {
                $scope.changeTaskTab("", "involvedProcessCompleted");
            } else if (activeTab == "involvedProcessCompleted") {
                $scope.changeTaskTab("", "agentUsers");
            } else if (activeTab == "agentUsers") {
                $scope.changeTaskTab("", "notice");
            } else if (activeTab == "notice") {

            }
        }
        $scope.refreshToDoList = function(eventObj) {

            var activeTab = $scope.activeTab;
            //下拉刷新的时候只刷新当前被选中的tab
            if (activeTab == "toDoTask") {
                $scope.pageInfo.allCount = 0;
                $scope.todoList = [];
                $scope.pageInfo.currentPageIndex = 1;
                taskService.getToDoTask($scope);
            } else if (activeTab == "involvedProcess") {
                $scope.pageInfo_ip.allCount = 0;
                $scope.involvedProcess = [];
                $scope.pageInfo_ip.currentPageIndex = 1;
                taskService.searchMyInvolvedProcess($scope, "0", true);
            } else if (activeTab == "involvedProcessCompleted") {
                $scope.pageInfo_ipc.allCount = 0;
                $scope.involvedProcessCompleted = [];
                $scope.pageInfo_ipc.currentPageIndex = 1;
                taskService.searchMyInvolvedProcess($scope, "1", true);
            } else if (activeTab == "agentUsers") {
                $scope.agentInfo = []; //代理人列表
                $scope.agentTaskSum = 0;
                taskService.getAgentUsersAndCount($scope, true);
            } else if (activeTab == "notice") {
                $scope.pageInfo_notice.allCount = 0;
                $scope.notice = [];
                $scope.pageInfo_notice.currentPageIndex = 1;
                taskService.searchMyNotice($scope, true);
            }
        };
        $scope.loadMore = function() {
            var activeTab = $scope.activeTab;
            //下拉加载数据的时候只加载当前选中的tab
            if (activeTab == "toDoTask") {
                if ($scope.pageInfo.currentPageIndex * $scope.pageInfo.pageSize < $scope.pageInfo.allCount) {
                    $scope.pageInfo.currentPageIndex = $scope.pageInfo.currentPageIndex + 1;
                    taskService.getToDoTask($scope);
                }
            } else if (activeTab == "involvedProcess") {
                if ($scope.pageInfo_ip.currentPageIndex * $scope.pageInfo_ip.pageSize < $scope.pageInfo_ip.allCount) {
                    $scope.pageInfo_ip.currentPageIndex = $scope.pageInfo_ip.currentPageIndex + 1;
                    taskService.searchMyInvolvedProcess($scope, "0", true);
                }
            } else if (activeTab == "involvedProcessCompleted") {
                if ($scope.pageInfo_ipc.currentPageIndex * $scope.pageInfo_ipc.pageSize < $scope.pageInfo_ipc.allCount) {
                    $scope.pageInfo_ipc.currentPageIndex = $scope.pageInfo_ipc.currentPageIndex + 1;
                    taskService.searchMyInvolvedProcess($scope, "1", true);
                }
            } else if (activeTab == "agentUsers") {

            } else if (activeTab == "notice") {
                if ($scope.pageInfo_notice.currentPageIndex * $scope.pageInfo_notice.pageSize < $scope.pageInfo_notice.allCount) {
                    $scope.pageInfo_notice.currentPageIndex = $scope.pageInfo_notice.currentPageIndex + 1;
                    taskService.searchMyNotice($scope, true);
                }
            }
            setTimeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 5000);
        };
        /* $scope.moreDataCanBeLoaded = function () {
         if ($scope.pageInfo.currentPageIndex * $scope.pageInfo.pageSize < $scope.pageInfo.allCount) {
         return true;
         }
         return false;
         };*/
        $scope.itemClick = function(item, type) {
            //var formUrl = "templates/form/" + (item.form.split("/"))[3];
            var itemParam = {};
            //根据不同的列表生成统一的流程参数对象
            if (type == "待办") {
                itemParam.BIZOBJID = item.BIZOBJID;
                itemParam.DEFID = item.DEFID;
                itemParam.DEFKEY = item.DEFKEY;
                itemParam.FKEY = item.FKEY;
                itemParam.FORM = item.FORM;
                itemParam.FVALUE = item.FVALUE;
                itemParam.INSTID = item.INSTID;
                itemParam.NODEID = item.NODEID;
                itemParam.TASKID = item.TASKID;
                itemParam.TASKTYPE = item.TASKTYPE;
                itemParam.USETYPE = "modify";
            } else if (type == "已办") {
                itemParam.BIZOBJID = item.bizObjId;
                itemParam.DEFID = item.processDefinitionId;
                itemParam.DEFKEY = item.processDefinitionKey;
                itemParam.FKEY = item.fKey;
                itemParam.FORM = item.defaultFormUri;
                itemParam.FVALUE = item.fValue;
                itemParam.INSTID = item.processInstanceId;
                itemParam.definitionId = item.definitionId;
                itemParam.rootTokenId = item.rootTokenId;
                //itemParam.TASKTYPE = item.TASKTYPE;
                //itemParam.USETYPE = "modify";
            } else if (type == "抄送") {
                itemParam.BIZOBJID = item.bizObjId;
                itemParam.DEFID = item.defId;
                itemParam.DEFKEY = item.defKey;
                itemParam.FKEY = item.fKey;
                itemParam.FORM = item.form;
                itemParam.FVALUE = item.fValue;
                itemParam.INSTID = item.instId;
                itemParam.NODEID = item.nodeId;
                itemParam.TASKID = item.taskId;
                itemParam.TASKTYPE = item.taskType;
            }
            //itemParam = item;
            //itemParam.USETYPE = "modify";
            var formUrl = itemParam.FORM;
            var viewId = util.getFormId(formUrl);
            var bizObjId = itemParam.BIZOBJID;
            if (!FormConfig[bizObjId] || !FormConfig[bizObjId][viewId]) {
                myPopover.showPopoverMsg("", "当前节点暂时不支持在手机端提交，请至web端操作。");
                return;
            }
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                $scope.modal = modal;
                $rootScope.formModal = modal;
                modal.show();
                $scope.$broadcast('form-open', itemParam);
            });
            //$scope.modal.show();
        };
        $scope.closeModal = function() {
            $rootScope.formModal = null;
            window.localStorage.operatorCss = "set";
            $scope.modal.remove();
        };

        $scope.removeModal = function() {
            window.localStorage.operatorCss = "set";
            $rootScope.formModal = null;
            $scope.modal.remove();
        };
        //监听刷新代办事项列表
        $scope.$on("refresh-task", function() {
            //$scope.pageInfo.currentPageIndex = 1;
            //$scope.todoList = [];
            $scope.initData($scope);
            $scope.modal.remove();
        });

        $scope.clearSearch = function() {
            $scope.search.searchText = "";
            var activeTab = $scope.activeTab;
            //清除对应的查询条件
            if (activeTab == "toDoTask") {
                $scope.search.searchText_task = $scope.search.searchText;
            } else if (activeTab == "involvedProcess") {
                $scope.search.searchText_ip = $scope.search.searchText;
            } else if (activeTab == "involvedProcessCompleted") {
                $scope.search.searchText_ipc = $scope.search.searchText;
            } else if (activeTab == "agentUsers") {

            } else if (activeTab == "notice") {
                $scope.search.searchText_notice = $scope.search.searchText;
            }
        }
        $scope.keyUp = function(event) {
            if (event.keyCode == 13) {
                document.addEventListener("deviceready", function() {
                    $cordovaKeyboard.close();
                });
                $scope.refreshToDoList();
            }
        }
        $scope.goAgentList = function(item) {
            if (item) {
                var count = item.count;
                if (count > 0) {
                    $state.go("tab.agentTask", { userId: item.userid, userName: item.username });
                }
            }
        }
        $scope.CompletedEvent = function(scope) {
            console.log("Completed Event called");
        };

        $scope.ExitEvent = function(scope) {
            console.log("Exit Event called");
        };

        $scope.ChangeEvent = function(targetElement, scope) {
            //console.log("Change Event called");
            //console.log(targetElement);  //The target element
            window.localStorage.introJs = "set";
            if (this._currentStep == 2) {
                var _this = this;
                setTimeout(function() {
                    angular.element(".introjs-tooltip").hide();
                    _this.exit();
                }, 2000);
            }
        };

        $scope.BeforeChangeEvent = function(targetElement, scope) {
            console.log("Before Change Event called");
            console.log(targetElement);
        };

        $scope.AfterChangeEvent = function(targetElement, scope) {
            console.log("After Change Event called");
            console.log(targetElement);
        };

        /**系统帮助**/
        $scope.IntroOptions = {
            steps: [{
                element: '#task_search',
                intro: '输入查询条件进行查询',
                position: 'bottom'
            }, {
                element: '#step0',
                intro: '代办事项列表，点击可进入详细表单',
                position: 'bottom'
            }, {
                element: '#e',
                intro: '表单打开后，点击右上角操作可进行审批。',
                position: 'bottom'
            }],
            showStepNumbers: false,
            exitOnOverlayClick: true,
            exitOnEsc: true,
            nextLabel: '<strong>下一步</strong>',
            prevLabel: '<span style="color:green">上一步</span>',
            skipLabel: '结束',
            doneLabel: '完成'
        };
        //$scope.CallMe();
        //$scope.ShouldAutoStart = true;

    })
    .controller("agentTaskCtr", function($scope, $stateParams, agentTaskService, $cordovaKeyboard,
        myPopover, $ionicModal, $rootScope) { //设置界面
        $scope.agentName = $stateParams.userName;
        $scope.agentId = $stateParams.userId;
        $scope.agentTaskList = [];
        $scope.pageInfo = {};
        $scope.pageInfo.pageSize = 10;
        $scope.pageInfo.currentPageIndex = 1;
        $scope.pageInfo.allPage = 0;
        $scope.pageInfo.allCount = 0;
        $scope.search = {};
        $scope.search.searchText = "";
        agentTaskService.query($scope);

        $scope.refresh = function() {
            $scope.agentTaskList = [];
            $scope.pageInfo.currentPageIndex = 1;
            agentTaskService.query($scope);
        }
        $scope.loadMore = function() {
            if ($scope.pageInfo.currentPageIndex * $scope.pageInfo.pageSize < $scope.pageInfo.allCount) {
                $scope.pageInfo.currentPageIndex += 1;
                agentTaskService.query($scope, "3"); //加载更多
            } else {
                //$scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }
        $scope.itemClick = function(item, type) {
            //var formUrl = "templates/form/" + (item.form.split("/"))[3];
            var itemParam = {};
            //根据不同的列表生成统一的流程参数对象
            itemParam.BIZOBJID = item.BIZOBJID;
            itemParam.DEFID = item.DEFID;
            itemParam.DEFKEY = item.DEFKEY;
            itemParam.FKEY = item.FKEY;
            itemParam.FORM = item.FORM;
            itemParam.FVALUE = item.FVALUE;
            itemParam.INSTID = item.INSTID;
            itemParam.NODEID = item.NODEID;
            itemParam.TASKID = item.TASKID;
            itemParam.TASKTYPE = item.TASKTYPE;
            itemParam.USETYPE = "modify";
            //itemParam = item;
            //itemParam.USETYPE = "modify";
            var formUrl = itemParam.FORM;
            var viewId = util.getFormId(formUrl);
            var bizObjId = itemParam.BIZOBJID;
            if (!FormConfig[bizObjId] || !FormConfig[bizObjId][viewId]) {
                myPopover.showPopoverMsg("", "当前节点暂时不支持在手机端提交，请至web端操作。");
                return;
            }
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                $scope.modal = modal;
                $rootScope.formModal = modal;
                modal.show();
                $scope.$broadcast('form-open', itemParam);
            });
            //$scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.remove();
        };

        $scope.removeModal = function() {
            $scope.modal.remove();
        };
        //监听刷新代办事项列表
        $scope.$on("refresh-task", function() {
            $scope.pageInfo.currentPageIndex = 1;
            $scope.agentTaskList = [];
            agentTaskService.query($scope);
            $scope.modal.remove();
        });

        $scope.keyUp = function($event) {
            if (event.keyCode == 13) {
                document.addEventListener("deviceready", function() {
                    $cordovaKeyboard.close();
                });
                $scope.agentTaskList = [];
                $scope.pageInfo.currentPageIndex = 1;
                agentTaskService.query($scope, "1");
            }
        }
        $scope.clearSearch = function() {
            $scope.search.searchText = "";
        }
    })
    .controller("settingCtr", function($scope, $state, settingService, $rootScope, $ionicPopover) { //设置界面
        $scope.pushSet = {};
        $scope.pushSet.startTime = "23:00";
        $scope.pushSet.endTime = "09:00";
        $scope.pushSet.enablePush = false;
        if (window.localStorage.isSetLockPwd != "set") {
            //$state.go("tab.setting");
            $state.go("tab.settingPwd");
        }
        if (window.localStorage.startTime) {
            $scope.pushSet.startTime = window.localStorage.startTime;
        } else {
            $scope.pushSet.startTime = "23:00"
        }
        if (window.localStorage.endTime) {
            $scope.pushSet.endTime = window.localStorage.endTime;
        } else {
            $scope.pushSet.endTime = "09:00"
        }
        if (window.localStorage.enablePush) {
            $scope.pushSet.enablePush = window.localStorage.enablePush == "true" ? true : false;
        } else {
            $scope.pushSet.enablePush = false
        }
        if (!$scope.pushSet.enablePush) {
            angular.element("#time-setting").hide();
        } else {
            angular.element("#time-setting").show();
        }
        angular.element("#startTimeText").text(util.convertPushTime($scope.pushSet.startTime));
        angular.element("#endTimeText").text(util.convertPushTime($scope.pushSet.endTime));
        $scope.enablePush = function() {
            if ($scope.pushSet.enablePush) {
                angular.element("#time-setting").show();
            } else {
                angular.element("#time-setting").hide();
            }
            settingService.setPushSet($scope);
        }
        $scope.initTime = function() {
            settingService.getPushSet($scope);
            var date = new Date();
            date.setHours($scope.pushSet.startTime.split(":")[0]);
            date.setMinutes($scope.pushSet.startTime.split(":")[1]);
            angular.element("#startTime").mobiscroll().time({
                theme: 'android-holo-light',
                lang: 'zh',
                display: 'modal',
                mode: 'mixed',
                timeFormat: "HH:ii",
                timeWheels: "HHii",
                defaultValue: date,
                onSelect: function(valueText, inst) {
                    $scope.pushSet.startTime = valueText;
                    angular.element("#startTimeText").text(util.convertPushTime(valueText));
                    settingService.setPushSet($scope);
                }
            });
            var date1 = new Date();
            date1.setHours($scope.pushSet.endTime.split(":")[0]);
            date1.setMinutes($scope.pushSet.endTime.split(":")[1]);
            angular.element("#endTime").mobiscroll().time({
                theme: 'android-holo-light',
                lang: 'zh',
                display: 'modal',
                mode: 'mixed',
                timeFormat: "HH:ii",
                timeWheels: "HHii",
                defaultValue: date1,
                onSelect: function(valueText, inst) {
                    $scope.pushSet.endTime = valueText;
                    angular.element("#endTimeText").text(util.convertPushTime(valueText));
                    settingService.setPushSet($scope);
                }
            });
        }
        $scope.showTime = function(id) {
            angular.element("#" + id).mobiscroll("show");
        }
        $scope.initTime();
        $scope.logOut = function() {
            //$rootScope.isReload = true;
            $state.go("login", {}, { reload: true });
        }
        $scope.lock = {};
        $scope.goSettingPwd = function() {
            if (window.localStorage.isSetLockPwd == "set") { //如果设置了锁屏密码那么进入锁屏密码设置界面的时候需要确认锁屏密码
                $scope.lockInfo = "请确认您的4位数字密码";
                $scope.nextGName = "继续";
                $scope.isSetLockPwd = true;
                $scope.lock.lockPwd = "";
                $scope.lockStep = 1;
                $scope.lockType = "goPwd"; //进入设置密码的界面
                $ionicPopover.fromTemplateUrl('templates/t-set-lock.html', {
                    scope: $scope,
                    //backdropClickToClose : false,
                    focusFirstInput: true
                }).then(function(popover) {
                    $scope.popover = popover;
                    popover.show();
                });
            } else {
                $state.go("tab.settingPwd", {}, { reload: true });
            }
        }
        $scope.nextG = function() {
            var lockPwd = util.getLockPassword();
            if ($scope.lock.lockPwd == lockPwd) {
                if ($scope.popover) {
                    $scope.popover.remove();
                }
                $state.go("tab.settingPwd", {}, { reload: true });
            } else {
                $scope.lockInfo = "密码不正确";
            }
        }
        $scope.closePo = function() {
            var popover = $scope.popover;
            if (popover != null && popover != undefined) {
                popover.remove();
            }
        }
    }).controller("flowSuperQueryCtrl", function($scope, flowSuperQueryService,
        $cordovaKeyboard, myPopover, $ionicModal, commonService) { //流程超级查询界面
        $scope.flowList = [];
        $scope.pageInfo = {};
        $scope.pageInfo.pageSize = 10;
        $scope.pageInfo.currentPageIndex = 1;
        $scope.pageInfo.allPage = 0;
        $scope.pageInfo.allCount = 0;
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.flowDef = selectGroup.flowDef;
        $scope.refresh = function() {
            $scope.flowList = [];
            $scope.pageInfo.currentPageIndex = 1;
            flowSuperQueryService.query($scope, "2"); //2:刷新
        };
        $scope.loadMore = function() {
            if ($scope.pageInfo.currentPageIndex * $scope.pageInfo.pageSize < $scope.pageInfo.allCount) {
                $scope.pageInfo.currentPageIndex += 1;
                flowSuperQueryService.query($scope, "3"); //加载更多
            } else {
                //$scope.$broadcast('scroll.infiniteScrollComplete');
            }

        }
        $scope.init = function() {
            flowSuperQueryService.query($scope, "1"); //1:第一次加载
            setTimeout(function() {
                    $('#searchDefKey').mobiscroll().select({
                        theme: 'mobiscroll',
                        lang: 'zh',
                        display: 'bottom',
                        label: 'City',
                        onSelect: function() {
                            $scope.query();
                        }
                    });
                })
                //commonService.callMethod("flow.getProcessDefinitionInfo",{},function (data) {
                //
                //});
        }
        $scope.query = function() {
            //alert($scope.search.userSearchText);
            $scope.pageInfo.allPage = 0;
            $scope.pageInfo.allCount = 0;
            $scope.flowList = [];
            $scope.pageInfo.currentPageIndex = 1;
            flowSuperQueryService.query($scope, "1");
        }
        $scope.clearSearch = function() {
            $scope.search.searchText = "";
        }
        $scope.keyUp = function(event) {
            if (event.keyCode == 13) {
                document.addEventListener("deviceready", function() {
                    $cordovaKeyboard.close();
                });
                $scope.pageInfo.allPage = 0;
                $scope.pageInfo.allCount = 0;
                $scope.flowList = [];
                $scope.pageInfo.currentPageIndex = 1;
                flowSuperQueryService.query($scope, "1");
            }
        }
        $scope.itemClick = function(item, type) {
            //var formUrl = "templates/form/" + (item.form.split("/"))[3];
            var itemParam = {};
            itemParam.BIZOBJID = item.bizObjId;
            itemParam.DEFID = item.processDefinitionId;
            itemParam.DEFKEY = item.processDefinitionKey;
            itemParam.FKEY = item.fKey;
            itemParam.FORM = item.defaultFormUri;
            itemParam.FVALUE = item.fValue;
            itemParam.INSTID = item.processInstanceId;
            itemParam.definitionId = item.definitionId;
            itemParam.rootTokenId = item.rootTokenId;
            var formUrl = itemParam.FORM;
            var viewId = util.getFormId(formUrl);
            var bizObjId = itemParam.BIZOBJID;
            if (!FormConfig[bizObjId] || !FormConfig[bizObjId][viewId]) {
                myPopover.showPopoverMsg("", "当前节点暂时不支持在手机端提交，请至web端操作。");
                return;
            }
            $ionicModal.fromTemplateUrl(formUrl, {
                scope: $scope,
                animation: "slide-in-up",

            }).then(function(modal) {
                $scope.modal = modal;
                modal.show();
                $scope.$broadcast('form-open', itemParam);
            });
            //$scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.remove();
        };

        $scope.removeModal = function() {
            $scope.modal.remove();
        };
    }).controller("settingPwdCtr", function($scope, $ionicPopover, $ionicNavBarDelegate, $state) {
        var isSetLockPwd = window.localStorage.isSetLockPwd;
        $scope.lock = {};
        $scope.lock.lockPwd = "";
        $scope.nextGName = "继续";
        //alert(isSetLockPwd);

        //alert(2);
        $scope.setLockPwd = function() {
            //alert(1);
            $scope.lockInfo = "请输入4位数字密码";
            $scope.nextGName = "继续";
            $scope.lock.lockPwd = "";
            $scope.lockStep = 1;
            $scope.lockType = "set";
            $ionicPopover.fromTemplateUrl('templates/t-set-lock.html', {
                scope: $scope,
                //backdropClickToClose : false,
                focusFirstInput: true
            }).then(function(popover) {
                $scope.popover = popover;
                popover.show();
            });
        }
        if (isSetLockPwd == "set") {
            $scope.isSetLockPwd = true;
        } else {
            $scope.isSetLockPwd = false;
            $scope.setLockPwd();
        }
        $scope.editLockPwd = function() {
            //alert(1);
            $scope.lockInfo = "确认您的4位数字密码";
            $scope.nextGName = "继续";
            $scope.lock.lockPwd = "";
            $scope.lockStep = 1;
            $scope.lockType = "edit";
            $ionicPopover.fromTemplateUrl('templates/t-set-lock.html', {
                scope: $scope,
                //backdropClickToClose : false,
                focusFirstInput: true
            }).then(function(popover) {
                $scope.popover = popover;
                popover.show();
            });
        }
        $scope.removeLock = function() {
            window.localStorage.isSetLockPwd = "notSet";
            $scope.isSetLockPwd = false;
        }
        $scope.closePo = function() {
            var popover = $scope.popover;
            if (popover != null && popover != undefined) {
                popover.remove();
            }
        }
        $scope.nextG = function() {
            //alert($scope.lock.lockPwd);
            if ($scope.lock.lockPwd.length < 4) {
                return
            }
            var lockStep = $scope.lockStep;
            var lockType = $scope.lockType;
            if (lockType == "set") {
                if (lockStep == 1) {
                    $scope.lockPwd1 = $scope.lock.lockPwd;
                    $scope.lock.lockPwd = "";
                    $scope.lockStep = lockStep + 1;
                    $scope.lockInfo = "确认您的数字密码";
                    $scope.nextGName = "确认";
                    setTimeout(function() {
                        angular.element("#lockPassword").focus();
                    }, 100);
                    //alert(1);
                } else {
                    if ($scope.lock.lockPwd != $scope.lockPwd1) {
                        $scope.lockInfo = "数字密码不匹配!";
                        setTimeout(function() {
                            angular.element("#lockPassword").select();
                        }, 100);
                    } else {
                        util.setLockPassword($scope.lockPwd1);
                        window.localStorage.isSetLockPwd = "set";
                        $scope.isSetLockPwd = true;
                        $scope.closePo();
                        $ionicNavBarDelegate.back();
                        setTimeout(function() {
                            $state.go("tab.todolist", {}, { reload: true });
                        }, 100);
                    }
                }
            } else if (lockType == "edit") {
                if (lockStep == 1) {
                    var lockPwd = util.getLockPassword();
                    if (lockPwd == $scope.lock.lockPwd) {
                        $scope.lock.lockPwd = "";
                        $scope.lockStep = lockStep + 1;
                        $scope.lockInfo = "请输入4位数字密码";
                        $scope.nextGName = "继续";
                        setTimeout(function() {
                            angular.element("#lockPassword").focus();
                        }, 100);
                    } else {
                        $scope.lockInfo = "数字密码不匹配!";
                    }
                    //alert(1);
                } else if (lockStep == 2) {
                    $scope.lockPwd1 = $scope.lock.lockPwd;
                    $scope.lock.lockPwd = "";
                    $scope.lockStep = lockStep + 1;
                    $scope.lockInfo = "确认您的数字密码";
                    $scope.nextGName = "继续";
                    setTimeout(function() {
                        angular.element("#lockPassword").focus();
                    }, 100);
                } else {
                    if ($scope.lock.lockPwd != $scope.lockPwd1) {
                        $scope.lockInfo = "数字密码不匹配!";
                        setTimeout(function() {
                            angular.element("#lockPassword").select();
                        }, 100);
                    } else {
                        util.setLockPassword($scope.lockPwd1);
                        window.localStorage.isSetLockPwd = "set";
                        $scope.isSetLockPwd = true;
                        $scope.closePo();
                    }
                }
            }
        }
        $scope.lockKeyUp = function() {

        }
    });