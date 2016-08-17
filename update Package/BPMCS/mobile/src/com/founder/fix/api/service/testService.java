package com.founder.fix.api.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.founder.fix.api.util.AuthUtil;
import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.AppInfo;
import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.filter.RestApiFilter;
import com.founder.fix.webcore.permission.PermissionHander;

@Controller
@RequestMapping("/user")
public class testService {

	@RequestMapping("/login")
	@ResponseBody
	public String login(@RequestBody String jsonStr, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(jsonStr);
		String loginId = StringUtil.getString(jsonParam.get("loginId"));
		String password = StringUtil.getString(jsonParam.get("password"));
		boolean result = PermissionHander.login(loginId, password, true, request, response);
		Map<String, Object> returnMap = new HashMap<String, Object>();
		if (result) {
			OnlineUser user = AppInfo.CurrentUser(request.getSession());
			returnMap.put("loginResut", "1");
			returnMap.put("userInfo", user.getItems());
			String authKey = AuthUtil.genAuthKey(user.getUserID());
			returnMap.put("authKey", authKey);
			RestApiFilter.apiUsers.put(authKey, user);
		} else {
			returnMap.put("loginResut", "0");
		}
		return JSONUtil.parseObject2JSON(returnMap);
	}

}
