var _server = "http://127.0.0.1:8090/test/rest/interface";
var mServer = "http://127.0.0.1:8080/demo/rest";
var _mServer = "http://59.151.19.8:443";//给更新文件用的

var updateUrl_ios = "http://www.pgyer.com/apiv1/app/install?aKey={aKey}&_api_key=4c2382ab2585a1239d317fa9f7400474&password=21vianet";

var UrlConfig = {
  getActionButton : _server + "",
  login : _server + "/user/login",
  getTodoTask : _server + "/tasks/todoTask",//方法已经废弃
  getToDoTaskCount : _server + "/tasks/todoTaskCount",
  getFormData : _server + "/form/getFormData",//方法已经废弃
  saveFormData : _server + "/form/saveFormData",//方法废弃
  getVersion : mServer + "/getAppLatestEdtion",
  updateApp : _mServer,
  callMethod : _server + "/common/callMethod",
  getAttachmentList : _server + "/attachment/getAttachmentList",//方法废弃
  downloadAttachment : _server + "/attachment/downloadAttachment",
  convertFile : _server + "/attachment/convertFile",
  bindDevice : mServer + "/bindDevice",
  getPushAccountInfo : mServer + "/getPushAccountInfo",
  pushMsgSetting : mServer + "/pushMsgSetting",
  getUserMenus : mServer + "/getUserMenus",
  viewGroup : "http://www.pgyer.com/apiv1/app/viewGroup"
};
