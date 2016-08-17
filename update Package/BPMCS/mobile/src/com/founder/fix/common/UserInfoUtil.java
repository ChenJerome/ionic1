package com.founder.fix.common;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.founder.fix.apputil.log.DebugLog;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.util.CacheUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.dbcore.DBGetResult;
import com.founder.fix.dbcore.DataTable;
import com.founder.fix.dbcore.DataTable.DataRow;

public class UserInfoUtil {

	private static DebugLog logger = LogFactory.getDebugLog(UserInfoUtil.class);
	
	public static String getUserIdByName(String userName) {
		String userId = "";

		String cacheKey = "_CSFounder_USERNAME_MAP";
		Map<String, String> userNameMap = new HashMap<String, String>();
		Object cacheObj = CacheUtil.getCacheData(cacheKey);
		//判断缓存里面是否有该信息,没有则重新从数据库加载
		if (cacheObj == null) {
			
			DBGetResult dbgr = new DBGetResult();
			try {
				dbgr.openConn();
				String sqlStr = "select * from au_userinfo";
				DataTable dt = dbgr.GetDataTable(sqlStr);
				for(DataRow dr : dt.Rows){
					String _userId = StringUtil.getString(dr.ItemValue("USERID"));
					String _userName = StringUtil.getString(dr.ItemValue("USERNAME"));
					userNameMap.put(_userName, _userId);
				}
				
				CacheUtil.putCacheData(cacheKey, userNameMap);
			} catch (Exception e) {
				logger.error(e, "添加用户名缓存出错");
			} finally {
				try {
					dbgr.closeConn();
				} catch (SQLException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			}
			
		} 
		else{
			userNameMap = (Map<String, String>) cacheObj;
		}
		
		userId = userNameMap.get(userName);

		return userId;
	}
	
	
	public static String getUserIdCardNo(String userName) {
		String CardNo = "";

		String cacheKey = "_CSFounder_CardNo_MAP";
		Map<String, String> userCardNoMap = new HashMap<String, String>();
		Object cacheObj = CacheUtil.getCacheData(cacheKey);
		//判断缓存里面是否有该信息,没有则重新从数据库加载
		if (cacheObj == null) {
			
			DBGetResult dbgr = new DBGetResult();
			try {
				dbgr.openConn();
				String sqlStr = "select DOORCARDNO,EMPLOYEE_NAME from T_HR_EMPLOYEE";
				DataTable dt = dbgr.GetDataTable(sqlStr);
				for(DataRow dr : dt.Rows){
					String _CardNo = StringUtil.getString(dr.ItemValue("DOORCARDNO"));
					//System.out.println(_CardNo);
					String _EMPLOYEE_Name = StringUtil.getString(dr.ItemValue("EMPLOYEE_NAME"));
					//System.out.println(_EMPLOYEE_Name);
					userCardNoMap.put(_EMPLOYEE_Name, _CardNo);
				}
				
				CacheUtil.putCacheData(cacheKey, userCardNoMap);
			} catch (Exception e) {
				logger.error(e, "添加员工门禁卡卡号缓存出错");
			} finally {
				try {
					dbgr.closeConn();
				} catch (SQLException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			}
			
		} 
		else{
			userCardNoMap = (Map<String, String>) cacheObj;
		}
		
		CardNo = userCardNoMap.get(userName);

		return CardNo;
	}

}
