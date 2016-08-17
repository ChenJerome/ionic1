package com.founder.fix.api.service;
 
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.Const;
import com.founder.fix.apputil.exception.FixFlowRollBackExpception;
import com.founder.fix.apputil.to.view.verify.VerifyTo;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.framework.form.services.FormService;
import com.founder.fix.framework.form.services.impl.FormServiceImpl;
import com.founder.fix.webcore.Current;
import com.founder.fix.webcore.DataView;
 
/**
 * Root resource (exposed at "myresource" path)
 */

@Controller
@RequestMapping("/form")
public class FormsService {
	
	@RequestMapping("/getFormData")  
	@ResponseBody
	public String getFormData(HttpServletRequest request, HttpServletResponse response, @RequestBody String json) throws Exception{
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(json);
		
		Map<String, Object> allMap = new  HashMap<String,Object>();
	
		FormService formService = new FormServiceImpl();
		
		Object paramObj = jsonParam.get("getData");
		String useType = StringUtil.getString(jsonParam.get("useType"));

		
		if (paramObj != null) {
			Map<String, Object> paramMap = (Map<String, Object>) paramObj;
			Map<String, List<Map<String, Object>>> getDataMap = formService
					.getData(paramMap);
			allMap.put("getData", getDataMap);
		}
		
//		if(FormInterface.needEmptyInvoke(useType)){
//			AdapterProxy.executeForNoPermission(formEmptyInvoke, dataView, null);
//		}

		// 系统变量
		paramObj = jsonParam.get("getSysVar");
		if (paramObj != null) {
			 Map<String, Object> paramMap = (Map<String, Object>)paramObj;
			 Map<String, Object> getSysVarMap = formService.getSysVar(paramMap);
			 allMap.put("getSysVar", getSysVarMap);
		}

		// 工具栏
		paramObj = jsonParam.get("getToolbar");
		if (paramObj != null) {
			Map<String, Object> paramMap = (Map<String, Object>) paramObj;
			List<List<Map<String, Object>>> getToolbarMap = formService
					.getToolbar(paramMap);
			allMap.put("getToolbar", getToolbarMap);
		}
		// 验证
		paramObj = jsonParam.get("getFormVerify");
		if (paramObj != null) {
			Map<String, Object> paramMap = (Map<String, Object>) paramObj;
			List<VerifyTo> getVerifyMap = formService
					.getFormVerify(paramMap);
			allMap.put("getFormVerify", getVerifyMap);
		}
		
		return JSONUtil.parseObject2JSON(allMap);
		
	}
			
	@RequestMapping("/saveFormData")  
	@ResponseBody
	public String saveFormData(HttpServletRequest request, HttpServletResponse response, @RequestBody String json) throws Exception{
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(json);
		
		Map<String, Object> result = new  HashMap<String,Object>();
	
		FormService formService = new FormServiceImpl();
		//Current.initCurrentInfo(request, response);
		DataView dataView = Current.getDataView();
		dataView.putAll(jsonParam);
		try {
			formService.saveFormData(dataView);
		} catch (Exception e) {
			Throwable throwable = e;

			// 所有通过反射调用发生的异常的都会被包装成InvocationTargetException
			// 并且这个包装过程是会嵌套的，可以通过getTargetException()方法获取真实的Exception
			while (throwable instanceof InvocationTargetException) {
				throwable = ((InvocationTargetException) throwable)
						.getTargetException();
			}
			
			if (throwable instanceof FixFlowRollBackExpception) {
				System.out.println("流程回滚：" + e);
			} else {
				throw e;
			}
		}
		
		//拿到返回值
		Map<String, Object> returnData = dataView.getReturnData();
		
		List<Map<String, Object>> taskInstListMap = (List<Map<String, Object>>) returnData.get(Const.Flow.FLOW_RESULT_OBJ);
		
		result.put("reult", 1);
		result.put("assigneeList", taskInstListMap);
		//Current.clear();
		return JSONUtil.parseObject2JSON(result);
		
	}
}