package com.founder.fix.api.util;


import com.founder.fix.apputil.util.DateUtil;
import com.founder.fix.apputil.util.MD5;
import com.founder.fix.apputil.util.StringUtil;

public class AuthUtil {
	private final static String securtKey = "pUrVarApp"; 
	
	public static String genAuthKey(String userId){
		String authKey = "";
		
		String dateStr = DateUtil.curDateTimeStr23();
		
		String tempStr = MD5.getMD5((securtKey+dateStr+userId).getBytes());
		
		authKey = userId+"|"+dateStr+"|"+tempStr;
		
		return authKey;
	}
	
	public static String getUserIdByAuthKey(String authKey){
		String userId = "";
		try{
			String[] arr = StringUtil.str2Array(authKey, "|");
			userId = arr[0];
			String dateStr = arr[1];
			String tmp3 = arr[2];
			
			String tempStr = MD5.getMD5((securtKey+dateStr+userId).getBytes());
			
			if(tmp3.equals(tempStr)){
				return userId;
			}
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return userId;
	}
	
	public static void main(String[] args){
		
		String userId = "qianjun";
		String authKey = genAuthKey(userId);
		System.out.println(authKey);
		
		userId = getUserIdByAuthKey(authKey);
		System.out.println(userId);
		
	}
}
