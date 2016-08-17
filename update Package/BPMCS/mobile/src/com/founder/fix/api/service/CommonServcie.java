package com.founder.fix.api.service;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.AppInfo;
import com.founder.fix.apputil.Const;
import com.founder.fix.apputil.exception.FixException;
import com.founder.fix.apputil.exception.FixFlowRollBackExpception;
import com.founder.fix.apputil.exception.SystemValidityException;
import com.founder.fix.apputil.log.DebugLog;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.util.FixResourceUtil;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.fixflow.core.exception.FixFlowException;
import com.founder.fix.webcore.Current;
import com.founder.fix.webcore.DataView;
import com.founder.fix.webcore.interfaceLayer.AdapterProxy;

@Controller
@RequestMapping("/common")
public class CommonServcie {

	private final DebugLog logger = LogFactory.getDebugLog(CommonServcie.class);

	@RequestMapping("/callMethod")
	@ResponseBody
	public String callMethod(HttpServletRequest request,
			HttpServletResponse response, @RequestBody String json)
			throws ServletException {
		String returnJson = "";
		
		boolean debug = false;
		
		debug = "1".equals(request.getParameter("debug"));
		
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(json);

		// 从指定的数据格式里构建dataView
		DataView dataView = DataView.buildDataView(request, response);

		dataView.parseData(jsonParam);
		Current.setDataView(dataView);

		// 拿到需要执行的服务
		String express = StringUtil.getString(jsonParam
				.get(Const.DataViewInfo.REQUEST_METHOD));

		if ("".equals(express)) {
			express = request.getParameter("_method");
			express = express.substring(express.lastIndexOf("/") + 1,
					express.lastIndexOf("."));
			jsonParam.put(Const.DataViewInfo.REQUEST_METHOD, express);
		}

		// 拿到执行服务的入参
		Object obj = jsonParam.get(Const.DataViewInfo.REQUEST_METHOD_PARAMETER);
		Date d1 = new Date();
		// 执行服务
		try {
			if (obj instanceof List) {
				List paramList = (List) obj;
				Object[] params = new Object[] {};
				if (paramList != null) {
					params = paramList.toArray();
				}

				AdapterProxy.executeForList(express, dataView, params);

			} else {
				Map map = null;
				if (obj instanceof Map) {
					map = (Map) obj;
				} else {
					map = new HashMap();
				}

				AdapterProxy.executeForMap(express, dataView, map);
			}

		} catch (Exception e) {
			Throwable throwable = e;

			// 所有通过反射调用发生的异常的都会被包装成InvocationTargetException
			// 并且这个包装过程是会嵌套的，可以通过getTargetException()方法获取真实的Exception
			while (throwable instanceof InvocationTargetException) {
				throwable = ((InvocationTargetException) throwable)
						.getTargetException();
			}

			if (throwable instanceof FixFlowException) {
				while (throwable.getCause() != null) {
					if (throwable.hashCode() == throwable.getCause().hashCode()) {
						break;
					} else {
						throwable = throwable.getCause();
					}
				}
			}

			if (throwable instanceof FixFlowRollBackExpception) {

			} else {
				logger.error(e, null);
				if (!debug) {
					dataView.getReturnData().clear();
					dataView.getReleaseData().clear();

					String message = throwable.getMessage();
					if (StringUtil.isEmpty(message)) {
						message = FixResourceUtil.getErrorResource("40500");
					}
					dataView.putReturnData("FixError", message);
				} else {
					throw new ServletException(e);
				}

			}
		} finally {
			Current.clear();
		}
		Date d2 = new Date();
		long costTime = (d2.getTime() - d1.getTime());
		logger.info("restApi:" + express + " " + costTime);

		returnJson = dataView.releaseData();

		return returnJson;
	}
}
