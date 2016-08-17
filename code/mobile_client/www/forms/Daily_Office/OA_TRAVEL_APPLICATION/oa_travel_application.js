/**
 * Created by winsanity on 2016/5/18.
 */

var OA_TRAVEL_APPLICATION_TA_Sure = {
    afterDataLoad: function ($scope, commonService) {
        OA_TRAVEL_APPLICATION_TA_Sure.initAPPROVALAuto($scope, commonService);
        //OA_TRAVEL_APPLICATION_TA_Sure.getAttachment($scope, commonService);

    }, initAPPROVALAuto: function ($scope, commonService) {
        //if ($scope.formData.OA_TRAVEL_APPLICATION[0].quxiao == undefined) {
        //    $scope.formData.OA_TRAVEL_APPLICATION[0].quxiao = {};
        //    $scope.formData.OA_TRAVEL_APPLICATION[0].quxiao.val = "";
        //}

        //订单状态
        var param = {
            "filter": "category='travel_application_status'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.CL = data.datas;
                setTimeout(function () {
                    //var type = $scope.formData.HR_EMPLOYEE_ENTRY[0].CONTRACT_TYPE.val;
                    var select = angular.element("#ddztselect").mobiscroll().select({
                        theme: 'android-holo-light',
                        lang: 'zh',
                        display: 'modal',
                        minWidth: 200,
                        onSelect: function (valueText, inst) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    if($scope.formData.OA_TRAVEL_APPLICATION[0].APPLICATION_STATUS.val == '2'){
                                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_DAYS.val = '0';
                                    }
                                });
                            }, 200);
                        }
                    });

                },200)
            }
        });

        //时间控件
        angular.element("#REAL_START_DATE").mobiscroll().datetime({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            dateFormat : "yy-mm-dd ",
            mode: 'mixed'
        });

        angular.element("#REAL_END_DATE").mobiscroll().datetime({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            dateFormat : "yy-mm-dd ",
            mode: 'mixed'
        });

        //出差天数计算
        $scope.countdays = function(){
            var sta_val = $scope.formData.OA_TRAVEL_APPLICATION[0].REAL_START_DATE.val;
            var end_val = $scope.formData.OA_TRAVEL_APPLICATION[0].REAL_END_DATE.val;
            if(sta_val!=''&&end_val!=''){
                var travle_type = $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVLE_TYPE_FOR_SUBSIDY.val;
                var len1 =sta_val.length;
                if(len1<17&&sta_val!=''){
                    sta_val = sta_val+":00";
                }
                var sta_str = sta_val.replace(/-/g,"/");
                var sta_date = new Date(sta_str);//将字符串转化为时间
                var len2 =end_val.length;
                if(len2<17&&end_val!=''){
                    end_val = end_val+":00";
                }
                var end_str = end_val.replace(/-/g,"/");
                var end_date = new Date(end_str);//将字符串转化为时间
                var num = (end_date-sta_date)/(1000*3600*24);//求出两个时间的时间差，这个是天数

                var days = parseInt(Math.ceil(num));//转化为整天（小于零的话剧不用转了）
                $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_DAYS.val = days;
                if(travle_type=='1'){
                    $scope.formData.OA_TRAVEL_APPLICATION[0].IN_COUNT.val = days;
                    //$scope.formData.OA_TRAVEL_APPLICATION[0].OUT_COUNT.val = '0';
                    $scope.formData.OA_TRAVEL_APPLICATION[0].IN_SUBSIDY.val = days*100;
                    // $scope.formData.OA_TRAVEL_APPLICATION[0].OUT_SUBSIDY.val = '0';
                }else if(travle_type=='2'){
                    // $scope.formData.OA_TRAVEL_APPLICATION[0].IN_COUNT.val = '0';
                    $scope.formData.OA_TRAVEL_APPLICATION[0].OUT_COUNT.val = days;
                    //$scope.formData.OA_TRAVEL_APPLICATION[0].IN_SUBSIDY.val = '0';
                    $scope.formData.OA_TRAVEL_APPLICATION[0].OUT_SUBSIDY.val = days*400;
                }
                if(num<0&&end_val!=''){
                    alert("日期填写有误，请重新填写！");
                    $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_DAYS.val = '0';
                }
            }
        }



    },getAttachment : function ($scope, commonService) {//获取附件信息

    }, beforeDataSave: function ($scope, commonService) {

            return true;
    }
};

var OA_TRAVEL_APPLICATION_TA_ADD = {
    afterDataLoad: function ($scope, commonService) {
        OA_TRAVEL_APPLICATION_TA_ADD.initAPPROVALAuto($scope, commonService);
        //OA_TRAVEL_APPLICATION_TA_ADD.getAttachment($scope, commonService);

    }, initAPPROVALAuto: function ($scope, commonService) {
        //是否修改行程
        if ($scope.formData.OA_TRAVEL_APPLICATION[0].IS_CHANGE_TRAVEL == undefined) {
            $scope.formData.OA_TRAVEL_APPLICATION[0].IS_CHANGE_TRAVEL = {};
            $scope.formData.OA_TRAVEL_APPLICATION[0].IS_CHANGE_TRAVEL.val = '0';
        }
        //出差人
        var select = angular.element("#APPLYEMP_auto").mobiscroll().select({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200,
            onSelect : function (valueText, inst) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        //wrapped this within $apply
                        var values = angular.element("#APPLYEMP_auto").val();
                        var vvs = values.split(",");
                        var users = vvs[0].split(" ");
                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_USER.val = vvs[0];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_USER_CODE.val = users[1];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_USER_DEP.val = vvs[1];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_USER_DEP_ID.val = vvs[2];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].COMPANY.val= vvs[3];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].COMPANY_CODE.val= vvs[4];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVEL_USER_PASSNAME.val= vvs[5];
                    });
                }, 200);
            }
        });
        var param = {
            "filter": "1=1",
            "fields": "DISPLAYNAME,EMPLOYEE_FULL,EMPLOYEE_CODE,EMPLOYEE_NAME,CERT_NAME,DEP_CODE,FULLNAME,COMPANY_FULLNAME,COMPANY_CODE",
            "bizObj": "BASEINFO",
            "service": "getUserAllInfo",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.APPLYEMPS = data.datas;
            }
        });
        $scope.showSelectAPPLYEMP = function(){
            angular.element("#APPLYEMP_auto").mobiscroll("show", true, true);
        }


        //差旅类型
        var param = {
            "filter": "category = 'TRAVEL_TYPE'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.CL = data.datas;
                setTimeout(function () {
                    //var type = $scope.formData.HR_EMPLOYEE_ENTRY[0].CONTRACT_TYPE.val;
                    var select = angular.element("#clselect").mobiscroll().select({
                        theme: 'android-holo-light',
                        lang: 'zh',
                        display: 'modal',
                        minWidth: 200,
                        onSelect: function (valueText, inst) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    //$scope.formData.HR_EMPLOYEE_ENTRY[0].CONTRACT_TYPE.val = valueText;
                                    $scope.changeTravalType();
                                });
                            }, 200);
                        }
                    });

                },200)
            }
        });

        if($scope.formData.OA_TRAVEL_APPLICATION[0].FEE_TYPE.val =='1'){
            angular.element("#costdepname").hide();
            angular.element("#projname1").show();
            angular.element("#projname2").ahow();
        }else{
            angular.element("#costdepname").show();
            angular.element("#projname1").hide();
            angular.element("#projname2").hide();
        }

        $scope.showandHide = function(){
            if($scope.formData.OA_TRAVEL_APPLICATION[0].FEE_TYPE.val =='1'){
                angular.element("#costdepname").hide();
                angular.element("#projname1").show();
                angular.element("#projname2").show();
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP_CODE.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER_CODE.val = "";
            }else{
                angular.element("#costdepname").show();
                angular.element("#projname1").hide();
                angular.element("#projname2").hide();
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP_CODE.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ_CODE.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].COSTDEPNAME.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER.val = "";
                $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER_CODE.val = "";
            }
        }

        //费用所属部门
        var select = angular.element("#Autocompleteorg_auto").mobiscroll().select({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200,
            onSelect : function (valueText, inst) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        //wrapped this within $apply
                        var values = angular.element("#Autocompleteorg_auto").val();
                        // var vvs = values.split(",");
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP.val = valueText;
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP_CODE.val = values;
                        $scope.selectCOSTCENTER();
                    });
                }, 200);
            }
        });
        var param = {
            "filter": "1=1",
            "fields": "DEP_CODE,FULLNAME",
            "bizObj": "BASEINFO",
            "service": "getOrgInfo",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.DEPFULLNAME = data.datas;
            }
        });
        $scope.showSelectAutocompleteorg = function(){
            angular.element("#Autocompleteorg_auto").mobiscroll("show", true, true);
        }

        //费用所属项目
        var select = angular.element("#Autocomplete5_auto").mobiscroll().select({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200,
            onSelect : function (valueText, inst) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        //wrapped this within $apply
                        var values = angular.element("#Autocomplete5_auto").val();
                        // var vvs = values.split(",");
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ.val = valueText;
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ_CODE.val = values;
                        $scope.showSelectCostDEP();
                        $scope.selectCOSTCENTER();
                    });
                }, 200);
            }
        });
        var param = {
            "filter": "1=1",
            "fields": "PROJECT_MAIN_CODE,PROJECT_MAIN_NAME",
            "bizObj": "BASEINFO",
            "service": "getProj",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.PROJECTNAME = data.datas;
            }
        });
        $scope.showSelectAutocomplete5 = function(){
            angular.element("#Autocomplete5_auto").mobiscroll("show", true, true);
        }

        //费用所属项目部门
        $scope.showSelectCostDEP = function(){
            if ($scope.formData.OA_TRAVEL_APPLICATION[0].COSTDEPNAME == undefined) {
                $scope.formData.OA_TRAVEL_APPLICATION[0].COSTDEPNAME = {};
                $scope.formData.OA_TRAVEL_APPLICATION[0].COSTDEPNAME.val = "";
            }
            var select = angular.element("#Autocomplete4_auto").mobiscroll().select({
                theme: 'android-holo-light',
                lang: 'zh',
                display: 'modal',
                minWidth: 200,
                onSelect : function (valueText, inst) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            //wrapped this within $apply
                            var values = angular.element("#Autocomplete4_auto").val();
                            // var vvs = values.split(",");
                            $scope.formData.OA_TRAVEL_APPLICATION[0].COSTDEPNAME.val = valueText;
                            $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP.val = valueText;
                            $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP_CODE.val = values;
                            $scope.selectCOSTCENTER();
                        });
                    }, 200);
                }
            });
            var project = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ_CODE.val;
            var param = {
                "filter": "project_main_code='"+project+"'",
                "fields": "DEP_ID,FULLNAME",
                "bizObj": "BASEINFO",
                "service": "getNProjDeps",
                "pageSize": 9999,
                currentPageIndex: 1
            }
            commonService.callMethod("component.getListData", param, function (data) {
                if (data.datas) {
                    $scope.COSTDEPNAME = data.datas;
                }
            });
            $scope.showSelectAutocomplete4 = function(){
                angular.element("#Autocomplete4_auto").mobiscroll("show", true, true);
            }
        }
        $scope.showSelectCostDEP();

        //费用所属公司
        var select = angular.element("#FEECOMPANY_auto").mobiscroll().select({
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'modal',
            minWidth: 200,
            onSelect : function (valueText, inst) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        //wrapped this within $apply
                        var values = angular.element("#FEECOMPANY_auto").val();
                        var vvs = values.split(",");
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_COMPANY.val = vvs[1];
                        $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_COMPANY_CODE.val = vvs[0];
                        $scope.selectCOSTCENTER();
                    });
                }, 200);
            }
        });
        var param = {
            "filter": "1=1",
            "fields": "DISNAME,COMPANY_CODE",
            "orderList": [
                {
                    "order": "asc",
                    "field": "COMPANY_CODE"
                }],
            "bizObj": "BASEINFO",
            "service": "getCompanyInfo",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.COMPANYS = data.datas;
            }
        });
        $scope.showSelectINVENTEDLEAD = function(){
            angular.element("#FEECOMPANY_auto").mobiscroll("show", true, true);
        }

        //成本中心
        $scope.selectCOSTCENTER = function(){
            var type = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_TYPE.val;
            if(type == '0'){
                var company_code = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_COMPANY_CODE.val;
                var dep_code = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_DEP_CODE.val;
                var param = {
                    "filter": "company_code= '"+company_code+"' and (dep_code = '"+dep_code+"' or nvl('"+dep_code+"','@@')='@@')",
                    "fields": "COST_CENTER_CODE,COST_CENTER_FULLNAME,COST_CENTER_FULLNAME",
                    //"orderList": [
                    //    {
                    //        "order": "asc",
                    //        "field": "CATEGORY_VALUE"
                    //    }],
                    "bizObj": "BASEINFO",
                    "service": "getCompanyForCost",
                    "pageSize": 9999,
                    currentPageIndex: 1

                }
                commonService.callMethod("component.getListData", param, function (data) {
                    if (data.datas) {
                        $scope.CBZX = data.datas;
                        setTimeout(function () {
                            //var type = $scope.formData.HR_EMPLOYEE_ENTRY[0].CONTRACT_TYPE.val;
                            var select = angular.element("#cbzxselect").mobiscroll().select({
                                theme: 'android-holo-light',
                                lang: 'zh',
                                display: 'modal',
                                minWidth: 200,
                                onSelect: function (valueText, inst) {
                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER.val = valueText;
                                        });
                                    }, 200);
                                }
                            });

                        },200)
                    }
                });
            }else{
                var company_code = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_COMPANY_CODE.val;
                var proj_code = $scope.formData.OA_TRAVEL_APPLICATION[0].FEE_PROJ_CODE.val;
                var param = {
                    "filter": "COMPANY_CODE = '"+company_code+"' and (PROJECT_MAIN_CODE= '"+proj_code+"' or nvl('"+proj_code+"','@@')='@@')",
                    "fields": "COST_CENTER_CODE,COST_CENTER_FULLNAME,COST_CENTER_FULLNAME",
                    //"orderList": [
                    //    {
                    //        "order": "asc",
                    //        "field": "CATEGORY_VALUE"
                    //    }],
                    "bizObj": "BASEINFO",
                    "service": "getNProjCost",
                    "pageSize": 9999,
                    currentPageIndex: 1

                }
                commonService.callMethod("component.getListData", param, function (data) {
                    if (data.datas) {
                        $scope.CBZX = data.datas;
                        setTimeout(function () {
                            //var type = $scope.formData.HR_EMPLOYEE_ENTRY[0].CONTRACT_TYPE.val;
                            var select = angular.element("#cbzxselect").mobiscroll().select({
                                theme: 'android-holo-light',
                                lang: 'zh',
                                display: 'modal',
                                minWidth: 200,
                                onSelect: function (valueText, inst) {
                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.formData.OA_TRAVEL_APPLICATION[0].COST_CENTER.val = valueText;
                                        });
                                    }, 200);
                                }
                            });

                        },200)
                    }
                });
            }
        }
        $scope.selectCOSTCENTER();

        //明细表控件-----------------------------------------------------------------------------------------------
        //行程控件
        var param = {
            "filter": "category = 'go_back_type'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.XC = data.datas;
                setTimeout(function () {
                    var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                    for(var i=0;i<length;i++){
                        var select = angular.element("#xcSelect"+i).mobiscroll().select({
                            theme: 'android-holo-light',
                            lang: 'zh',
                            display: 'modal',
                            minWidth: 200,
                            onSelect: function (valueText, inst) {
                                setTimeout(function () {
                                    $scope.$apply(function () {

                                    });
                                }, 200);
                            }
                        });
                    }
                },200)
            }
        });

        //订票类型控件
        $scope.changeTravalType= function(){
            var travle_type = $scope.formData.OA_TRAVEL_APPLICATION[0].TRAVLE_TYPE_FOR_SUBSIDY.val;
            var param = {
                "filter": "category = 'TRAVEL_TYPE'",
                "fields": "CATEGORY_VALUE,DISPLAY",
                "orderList": [],
                "bizObj": "SYS_CATEGORY",
                "service": "selectMore",
                "pageSize": 9999,
                currentPageIndex: 1

            }

            var param1 = {
                "filter": "category = 'TRAVEL_TYPE' and CATEGORY_VALUE = '1' ",
                "fields": "CATEGORY_VALUE,DISPLAY",
                "orderList": [],
                "bizObj": "SYS_CATEGORY",
                "service": "selectMore",
                "pageSize": 9999,
                currentPageIndex: 1

            }
            if(travle_type == '1'){
                commonService.callMethod("component.getListData", param1, function (data) {
                    if (data.datas) {
                        $scope.CLLX = data.datas;
                        setTimeout(function () {
                            var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                            for(var i=0;i<length;i++){
                                var select = angular.element("#cllxSelect"+i).mobiscroll().select({
                                    theme: 'android-holo-light',
                                    lang: 'zh',
                                    display: 'modal',
                                    minWidth: 200,
                                    onSelect: function (valueText, inst) {
                                        setTimeout(function () {
                                            $scope.$apply(function () {

                                            });
                                        }, 200);
                                    }
                                });
                            }
                        },200)
                    }
                });
            }else{
                commonService.callMethod("component.getListData", param, function (data) {
                    if (data.datas) {
                        $scope.CLLX = data.datas;
                        setTimeout(function () {
                            var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                            for(var i=0;i<length;i++){
                                var select = angular.element("#cllxSelect"+i).mobiscroll().select({
                                    theme: 'android-holo-light',
                                    lang: 'zh',
                                    display: 'modal',
                                    minWidth: 200,
                                    onSelect: function (valueText, inst) {
                                        setTimeout(function () {
                                            $scope.$apply(function () {

                                            });
                                        }, 200);
                                    }
                                });
                            }
                        },200)
                    }
                });
            }
        }
        $scope.changeTravalType();



        //日期
        var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
        setTimeout(function () {
            for(var i=0;i<length;i++){
                angular.element("#START_DATE"+i).mobiscroll().datetime({
                    theme: 'android-holo-light',
                    lang: 'zh',
                    display: 'modal',
                    dateFormat : "yy-mm-dd ",
                    mode: 'mixed',
                    minDate : new Date()
                });
            }

            //for(var i=0;i<length;i++){
            //    angular.element("#END_DATE"+i).mobiscroll().datetime({
            //        theme: 'android-holo-light',
            //        lang: 'zh',
            //        display: 'modal',
            //        dateFormat : "yy-mm-dd ",
            //        mode: 'mixed',
            //        minDate : new Date()
            //    });
            //}
        }, 200);

        //交通工具控件
        var param = {
            "filter": "category='vehicle'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.JTGJ = data.datas;
                setTimeout(function () {
                    var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                    for(var i=0;i<length;i++){
                        var select = angular.element("#jtgjSelect"+i).mobiscroll().select({
                            theme: 'android-holo-light',
                            lang: 'zh',
                            display: 'modal',
                            minWidth: 200,
                            onSelect: function (valueText, inst) {
                                setTimeout(function () {
                                    $scope.$apply(function () {

                                    });
                                }, 200);
                            }
                        });
                    }
                },200)
            }
        });

        //是否住宿控件
        var param = {
            "filter": "category='accommodation'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.SFZS = data.datas;
                setTimeout(function () {
                    var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                    for(var i=0;i<length;i++){
                        var select = angular.element("#sfzsSelect"+i).mobiscroll().select({
                            theme: 'android-holo-light',
                            lang: 'zh',
                            display: 'modal',
                            minWidth: 200,
                            onSelect: function (valueText, inst) {
                                setTimeout(function () {
                                    $scope.$apply(function () {

                                    });
                                }, 200);
                            }
                        });
                    }
                },200)
            }
        });


        //是否协议酒店控件
        var param = {
            "filter": "CATEGORY='YesOrNo'",
            "fields": "CATEGORY_VALUE,DISPLAY",
            "orderList": [],
            "bizObj": "SYS_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.SFXYJD = data.datas;
                setTimeout(function () {
                    var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                    for(var i=0;i<length;i++){
                        var select = angular.element("#sfxyjdSelect"+i).mobiscroll().select({
                            theme: 'android-holo-light',
                            lang: 'zh',
                            display: 'modal',
                            minWidth: 200,
                            onSelect: function (valueText, inst) {
                                setTimeout(function () {
                                    $scope.$apply(function () {

                                    });
                                }, 200);
                            }
                        });
                    }
                },200)
            }
        });


        //协议酒店控件
        var param = {
            "filter": "TRAVEL_TYPE='agreement_hotel' AND TRAVEL_TOOL ='agreement_hotel'",
            "fields": "CITY_NAME,CITY_NAME",
            "orderList": [],
            "bizObj": "OA_TRAVEL_CITY_CATEGORY",
            "service": "selectMore",
            "pageSize": 9999,
            currentPageIndex: 1

        }
        commonService.callMethod("component.getListData", param, function (data) {
            if (data.datas) {
                $scope.XYJD = data.datas;
                setTimeout(function () {
                    var length = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL.length;
                    for(var i=0;i<length;i++){
                        var select = angular.element("#xyjdSelect"+i).mobiscroll().select({
                            theme: 'android-holo-light',
                            lang: 'zh',
                            display: 'modal',
                            minWidth: 200,
                            onSelect: function (valueText, inst) {
                                setTimeout(function () {
                                    $scope.$apply(function () {

                                    });
                                }, 200);
                            }
                        });
                    }
                },200)
            }
        });

        $scope.changezhusu = function(x){
            var val = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL[x].ISSTAY.val;
            if(val=='0'){
                angular.element("#sfxyjddiv"+x).hide();
                $scope.formData.OA_TRAVEL_APPLICATION_DETAIL[x].IS_AGREEMENT_HOTEL.val = "";
                angular.element("#xyjddiv"+x).hide();
                $scope.formData.OA_TRAVEL_APPLICATION_DETAIL[x].AGREEMENT_HOTEL.val = "";
            }else{
                angular.element("#sfxyjddiv"+x).show();
            }

        }

        $scope.changexieyi = function(x){
            var val = $scope.formData.OA_TRAVEL_APPLICATION_DETAIL[x].IS_AGREEMENT_HOTEL.val;
            if(val=='0'){
                angular.element("#xyjddiv"+x).hide();
                $scope.formData.OA_TRAVEL_APPLICATION_DETAIL[x].AGREEMENT_HOTEL.val = "";
            }else{
                angular.element("#xyjddiv"+x).show();
            }

        }

    },getAttachment : function ($scope, commonService) {//获取附件信息

    }, beforeDataSave: function ($scope, commonService) {

        return true;
    }
};