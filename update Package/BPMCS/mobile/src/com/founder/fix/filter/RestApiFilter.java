package com.founder.fix.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.connector.Response;

import com.founder.fix.api.util.AuthUtil;
import com.founder.fix.apputil.Const;
import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.log.OnlineLog;
import com.founder.fix.apputil.util.CurrentThread;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.webcore.Current;
import com.founder.fix.webcore.DataView;

public class RestApiFilter implements Filter{
	
	private static OnlineLog debugLog = LogFactory.getOnlineLog(RestApiFilter.class);

	public static Map<String, OnlineUser> apiUsers = new HashMap<String, OnlineUser>();
	
	
	public void destroy() {
		// TODO 自动生成的方法存根
		
	}

	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;

		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setCharacterEncoding("UTF-8");
		if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
			response.setHeader("Access-Control-Allow-Headers",
					request.getHeader("Access-Control-Request-Headers"));
		}
		String requestURI = request.getRequestURI();
		String authKey = request.getParameter("authKey");
		
//		Curren
		//登录接口不需要验证   附件也不需要
		if(requestURI.contains("/user/login") || requestURI.contains("/file") || requestURI.contains("/testService/test")){
			chain.doFilter(req, resp);
			System.out.println("==================附件下载同登录放过");
		} else{
			
			
			String userId = AuthUtil.getUserIdByAuthKey(authKey);
			debugLog.debug("authKey:" + authKey);
			
			OnlineUser user = apiUsers.get(authKey);
			
			System.out.println("进入restfileter");
			if(StringUtil.isEmpty(userId)){
				response.setStatus(Response.SC_UNAUTHORIZED);
//				response.setHeader("Cache-Control", "no-store");
//				response.setDateHeader("Expires", 0);
				debugLog.debug("不合法的访问");
				return;
			}
			else if(user == null){
				response.setStatus(Response.SC_UNAUTHORIZED);
//				response.setHeader("Cache-Control", "no-store");
//				response.setDateHeader("Expires", 0);
				debugLog.debug("用户未登陆");
				System.out.println("========用户未登陆");
				throw new ServletException("用户未登陆");
				
//				return;
			}
			else{
				
				request.getSession().setAttribute(Const.NOW_ONLINE_USER, user);
				DataView dataView = DataView.buildDataView(request, response);
				Current.initCurrentInfo(request, response);
				Current.setDataView(dataView);
				
				chain.doFilter(req, resp);
			}
		}
		if(CurrentThread.getThreadDBPool()!=null)
			Current.clear();
		
	}

	public void init(FilterConfig arg0) throws ServletException {
		// TODO 自动生成的方法存根
		
	}
	
	
	public void initCurrent(String authkey, HttpServletRequest request, HttpServletResponse response){
		DataView dataView = DataView.buildDataView(request, response);
//		dataView.setCurrentData(key, value)().setUser(null);
		Current.setDataView(dataView);
		Current.setRequest(request);
		Current.setResponse(response);
		OnlineUser user = null;
		
		Current.setUser(user);
	}
}
