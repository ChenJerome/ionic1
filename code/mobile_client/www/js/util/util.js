/**
 * Created by Administrator on 2015/12/7.
 */
var util = {
  isNotEmpty: function (str) {
    str = util.trim(str);
    if (str != null && str.length > 0) {
      return true;
    }
    return false;
  },
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },
  getString: function (str) {
    return str.toString().replace(/^\s*function.*?\/\*|\*\/\s*\}\s*$/g, "");
  },
  getLoginId: function () {
    var loginId = window.localStorage.loginId;
    if (loginId) {
      return loginId;
    }
    return "";
  },getUserId : function () {
    return window.localStorage.userId;
  },getAuthKey : function () {
    return window.localStorage.authKey;
  },newGuid : function() {
    var guid = "";
    for ( var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    return guid;
  },getFormId : function (formUrl) {
    if (formUrl) {
      var arry = formUrl.split("/");
      var formName = arry[arry.length - 1];
      return (formName.split("."))[0];
    }
    return null;
  },isImage : function (filePath) {
    var extStart = filePath.lastIndexOf(".");
    var ext = filePath.substring(extStart, filePath.length).toUpperCase();
    if(ext!= ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG"){
      return false
    }
    return true;
  },getIsRemember : function () {
    var is = window.localStorage.isRemember;
    if (is == "true" || is == true) {
      return true;
    }
    return false;
  },setIsRemember : function (isRemember) {
    window.localStorage.isRemember = isRemember;
  },getIsAutoLogin : function () {
    var is = window.localStorage.isAutoLogin;
    if (is == "true" || is == true) {
      return true;
    }
    return false;
  },setIsAutoLogin : function (isAutoLogin) {
    window.localStorage.isAutoLogin = isAutoLogin;
  },getPassword : function () {
    var password = window.localStorage.password;
    if (password) {
      return password;
    }
    return "";
  },setPassword : function (password) {
    window.localStorage.password = password;
  },setLockPassword : function (lockPassword) {
    window.localStorage.lockPassword = lockPassword;
  },getLockPassword : function (lockPassword) {
    var lockPassword = window.localStorage.lockPassword;
    if (lockPassword) {
      return lockPassword;
    }
    return "";
  }, isWord : function (fileName) {
    var extStart = fileName.lastIndexOf(".");
    var ext = fileName.substring(extStart, fileName.length).toLowerCase();
    if(ext == ".doc" || ext == ".docx"){
      return true;
    }
    return false;
  }, isPdf : function (fileName) {
    var extStart = fileName.lastIndexOf(".");
    var ext = fileName.substring(extStart, fileName.length).toLowerCase();
    if(ext == ".pdf"){
      return true;
    }
    return false;
  }, isExcel : function (fileName) {
    var extStart = fileName.lastIndexOf(".");
    var ext = fileName.substring(extStart, fileName.length).toLowerCase();
    if(ext == ".xls" || ext == ".xlsx"){
      return true;
    }
    return false;
  }, isPpt : function (fileName) {
    var extStart = fileName.lastIndexOf(".");
    var ext = fileName.substring(extStart, fileName.length).toLowerCase();
    if(ext == ".ppt" || ext == ".pptx"){
      return true;
    }
    return false;
  },convertPushTime : function (time) {//转换推送设置的时间
    if (time) {
      var hour = time.split(":")[0];
      h = parseInt(hour);
      var text = "";
      if ( h >= 0 && h <= 5) {
        text = "凌晨";
      } else if (h >= 6 && h <= 11) {
        text = "早上";
      } else if (h == 12) {
        text = "中午";
      } else if (h >= 13 && h <= 17) {
        text = "下午";
      } else if (h >= 18 && h <= 23) {
        text = "晚上";
      }
      return text + time;
    }
    return time;
  }
}
/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}
var DealModal = {};
var GlobalConfig = {
  $stateProvider: null
}

function hideFixError () {
  angular.element("#fixError").fadeOut();
}
