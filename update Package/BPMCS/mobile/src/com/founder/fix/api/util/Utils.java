package com.founder.fix.api.util;

import java.util.HashMap;
import java.util.Map;

import com.founder.fix.apputil.to.PageTo;
import com.founder.fix.apputil.util.JSONUtil;

public class Utils {
	
	public static Map<String, Object> parseJsonStrToMap(String jsonStr){
		Map<String, Object> map = new HashMap<String, Object>();
		
		map = JSONUtil.parseJSON2Map(jsonStr);
		
		return map;
	}
	
	public static PageTo parsePageToFromMap(Object pageObj){
		PageTo pageTo = new PageTo();
		
		if(pageObj != null && pageObj instanceof Map<?, ?>){
			Map<String, Integer> pageMap = (HashMap<String, Integer>)pageObj;
			int currentPageIndex = pageMap.get("currentPageIndex");
			int pageSize = pageMap.get("pageSize");
			pageTo.setCurrentPageIndex(currentPageIndex);
			pageTo.setPageSize(pageSize);
		}
		else{
			pageTo.setCurrentPageIndex(1);
			pageTo.setPageSize(5);
			
		}
		
		return pageTo;
	}
	
}
