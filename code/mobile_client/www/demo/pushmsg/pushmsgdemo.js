/**
 * Created by Administrator on 2016/1/11.
 */
pushmsg={
  init:function(){
    window.plugins.jPushPlugin.init();//初始化推送服务
    window.plugins.jPushPlugin.setDebugMode(true);//设置模式为Debug
    var getRegistrationId = function(data){
      try{
        //alert("当前机器的唯一值："+data);
        window.localStorage.registrationId = data;
      }
      catch(e){
        alert("推送服务初始化失败！");
      }
    };
    window.plugins.jPushPlugin.getRegistrationID(getRegistrationId);//获取当前设备的唯一值，用于个推
  }
}


