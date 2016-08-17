package com.founder.fix.fl.core;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 常量类
 * 
 * @author xbg 
 * 
 */
public class LicenseConst
{
	
	/**
	 * WebConfig
	 */
	public static final String WEBCONFIG = "FIX.xml";
	
	
	/**
	 * 产品名称
	 */
	public static String PRODUCTKEY = "Fix BPMCS";
	
	
	/**
	 * 页面编码
	 */
	public static final String PAGEENCODING = "UTF-8";
	
	/**
	 * 记录在SYSTEM中的系统变量名，用以存储第一次拿到的系统序列号
	 */
	public static final String FIXSYSTEMROCKEY4NDSERIAL = "_FIX_SYSTEM_ROCKEY4ND_SERIAL_";
	
	/**
	 * 记录在SYSTEM中的系统变量名，用以存储第一次拿到的系统硬件号，windows下是硬盘号 linux下是MAC地址
	 */
	public static final String FIXSYSTEMHDSERIALNUMBER = "_FIX_SYSTEM_HD_SERIAL_NUMBER_";
	
	/**操作系统类型
	 * @author xbg at 2007-6-5 14:24:58
	 *
	 */
	public enum OSType
	{
		Windows,
		Unix,
		Linux,
		Mac
	}
	
	/**
	 * DateFormat Const
	 * 
	 * @author Administrator
	 * 
	 */
	public class DateFormat
	{
		/**
		 * yyyy
		 */
		public static final String Year = "yyyy";
		/**
		 * yy
		 */
		public static final String ShortYear = "yy";
		/**
		 * MM
		 */
		public static final String Month = "MM";
		/**
		 * dd
		 */
		public static final String Day = "dd";
		/**
		 * "yyyy-MM-dd HH:mm:ss:mmm"
		 */
		public static final String LongDateTime = "yyyy-MM-dd HH:mm:ss:mmm";

		/**
		 * "yyyy-MM-dd HH:mm:ss"
		 */
		public static final String DateTime = "yyyy-MM-dd HH:mm:ss";
		/**
		 * MM-dd HH:mm
		 */
		public static final String ShortDateTime = "MM-dd HH:mm";

		/**
		 * "yyyy-MM-dd"
		 */
		public static final String Date = "yyyy-MM-dd";
		/**
		 * "MM-dd"
		 */
		public static final String ShortDate = "yyyy-MM-dd";

		/**
		 * "HH:mm:ss:mmm"
		 */
		public static final String LongTime = "HH:mm:ss:mmm";

		/**
		 * "HH:mm:ss"
		 */
		public static final String Time = "HH:mm:ss";

		/**
		 * "HH:mm"
		 */
		public static final String ShortTime = "HH:mm";
	}

}
