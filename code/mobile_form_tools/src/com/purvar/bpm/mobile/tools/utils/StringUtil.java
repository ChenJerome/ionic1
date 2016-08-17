package com.purvar.bpm.mobile.tools.utils;

public class StringUtil {
	
	public static String getString(Object obj) {
		if (obj != null) {
			return obj.toString();
		} else {
			return "";
		}
	}

	public static boolean isEmpty(String str) {
		return str == null || str.length() == 0;
	}
	
	public static boolean isNotEmpty(String str) {
		return !isEmpty(str);
	}
}
