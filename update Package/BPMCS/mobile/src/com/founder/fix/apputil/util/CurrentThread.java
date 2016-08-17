package com.founder.fix.apputil.util;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.founder.fix.apputil.AppInfo;
import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.log.OnlineLog;

public class CurrentThread {
	private static final OnlineLog log = LogFactory
	.getOnlineLog(CurrentThread.class);
	
	/**
	 * 线程副本 当前用户
	 */
	private static final ThreadLocal<OnlineUser> currentUser = new ThreadLocal<OnlineUser>();
	/**
	 * 线程副本 当前Request
	 */
	private static final ThreadLocal<HttpServletRequest> currentRequest = new ThreadLocal<HttpServletRequest>();
	/**
	 * 线程副本 当前Response
	 */
	private static final ThreadLocal<HttpServletResponse> currentResponse = new ThreadLocal<HttpServletResponse>();
	/**
	 * 线程副本 当前Session
	 */
	private static final ThreadLocal<HttpSession> currentSession = new ThreadLocal<HttpSession>();
	/**
	 * 线程副本 当前Items
	 */
	private static final ThreadLocal<Map> currentItems = new ThreadLocal<Map>();
	
	private static final ThreadLocal<Date> timer = new ThreadLocal<Date>();
	
	private static final ThreadLocal<Object> ThreadDBPool = new ThreadLocal<Object>();
	
	
	
	public static ThreadLocal<Object> getThreadDBPool() {
		return ThreadDBPool;
	}

	public static void setTimer(Date dv){
		timer.set(dv);
	}
	
	public static Date getTimer(){
		return timer.get();
	}

	public static void initCurrentInfo(HttpServletRequest request,HttpServletResponse response){
		currentRequest.set(request);
		currentResponse.set(response);
		if(request!=null){
			currentSession.set(request.getSession());
			currentUser.set(AppInfo.CurrentUser(request.getSession()));
		}
	}
	
	/**通过线程副本取当前线程中对应的用户
	 * @return 用户
	 */
	public static OnlineUser getUser() 
	{
		return (OnlineUser) currentUser.get();
	}
	
	public static void clear(){
		currentRequest.set(null);
		currentResponse.set(null);
		currentSession.set(null);
		currentUser.set(null);
		currentItems.set(null);

		timer.set(null);
	}

	/**设置当前线程的用户
	 * @param user
	 */
	public static void setUser(OnlineUser user) 
	{
		currentUser.set(user);
	}
	
	/**通过线程副本取当前线程中对应的Request对象
	 * @return Request对象
	 */
	public static HttpServletRequest getRequest() 
	{
		return (HttpServletRequest) currentRequest.get();
	}

	/**设置当前线程的Request对象
	 * @param request
	 */
	public static void setRequest(HttpServletRequest request) 
	{
		currentRequest.set(request);
	}
	
	/**通过线程副本取当前线程中对应的Response
	 * @return Response
	 */
	public static HttpServletResponse getResponse() 
	{
		return (HttpServletResponse) currentResponse.get();
	}

	/**设置当前线程的Response
	 * @param response
	 */
	public static void setResponse(HttpServletResponse response) 
	{
		currentResponse.set(response);
	}
	
	/**通过线程副本取当前线程中对应的Session
	 * @return Session
	 */
	public static HttpSession getSession() 
	{
		return (HttpSession) currentSession.get();
	}

	/**设置当前线程的Session
	 * @param session
	 */
	public static void setSession(HttpSession session) 
	{
		currentSession.set(session);
	}
	
	/**通过线程副本取当前线程中对应的Items
	 * @return Items
	 */
	public static Map getItems() 
	{
		return (Map) currentItems.get();
	}

	/**设置当前线程的Items
	 * @param hashtable
	 */
	public static void setItems(Map hashtable) 
	{
		currentItems.set(hashtable);
	}
}
