package com.founder.fix.api.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Properties;

import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;
import org.json.JSONObject;

import com.founder.fix.api.util.AuthUtil;
import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.AppInfo;
import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.log.DebugLog;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.filter.RestApiFilter;
import com.founder.fix.webcore.permission.PermissionHander;

@Path(value = "/user1")
public class UserService {

	private static DebugLog logger = LogFactory.getDebugLog(UserService.class);

	@Context
	HttpServletRequest request;
	@Context
	HttpServletResponse response;

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String login(String jsonStr) throws Exception {
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(jsonStr);
		String loginId = StringUtil.getString(jsonParam.get("loginId"));
		String password = StringUtil.getString(jsonParam.get("password"));
		boolean result = PermissionHander.login(loginId, password, true ,request,response);
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		if(result){
			OnlineUser user = AppInfo.CurrentUser(request.getSession());
			
			returnMap.put("loginResut", "1");
			returnMap.put("userInfo", user.getItems());
			
			String authKey = AuthUtil.genAuthKey(user.getUserID());
			
			returnMap.put("authKey", authKey);
			
			RestApiFilter.apiUsers.put(authKey, user);
			
		}else{
			returnMap.put("loginResut", "0");
		}
		
		return JSONUtil.parseObject2JSON(returnMap);
	}

	@GET
	@Path("/get/{username}")
	@Consumes({ "application/json", "application/xml" })
	public String getPathParam(@PathParam("username") String username) {
		return "hello! " + username;
	}

	@POST
	@Path("/postJson/")
	@Produces("application/json")
	public String postJson(JSONObject query) throws JSONException {
		System.out.println(query.get("a"));
		return "";
	}

	public static void main(String[] args) {
		Properties pps = new Properties();
		// pps.load(new FileInputStream("ldap.Properties"));
		InputStream in = UserService.class.getClassLoader().getResourceAsStream("ldap.Properties");
		try {
			pps.load(in);
			System.out.println(pps.getProperty("ldap.url"));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
