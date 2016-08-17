package com.founder.fix.api.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.founder.fix.api.util.FlowInstanceConvert;
import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.to.PageTo;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.fixflow.api.TaskInterface;
import com.founder.fix.fixflow.api.task.FlowHander;
import com.founder.fix.fixflow.core.task.TaskInstance;

@Controller
@RequestMapping("/tasks")
public class TaskService {
		
	@RequestMapping("/todoTask")  
	@ResponseBody
	public String getToDoTask(HttpServletRequest request, HttpServletResponse response, @RequestBody String json) throws Exception{
		String returnJson = "";
		
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(json);
		String userId = StringUtil.getString(jsonParam.get("userId"));
		String mSearch = StringUtil.getString(jsonParam.get("mSearch"));
		
		Object pageInfo = jsonParam.get("pageInfo");
		PageTo pageTo = Utils.parsePageToFromMap(pageInfo);
		
		Map<String, Object> map = new  HashMap<String,Object>();
		map.put("mSearch", mSearch);

		FlowHander hander = FlowHander.createFlowHander();
		List<Map<String, Object>> taskList = new ArrayList<Map<String,Object>>();
		try {
			List<TaskInstance> instances = TaskInterface.searchAllTasks(userId, pageTo.getCurrentPageIndex(), pageTo.getPageSize(), map);

			taskList = FlowInstanceConvert.parseTaskInstListMap(instances);

		} finally {
			hander.close();
		}
		
		returnJson = JSONUtil.parseObject2JSON(taskList);
		
		return returnJson;
		
	}
	
	@RequestMapping("/todoTaskCount")  
	@ResponseBody
	public String getToDoTaskCount(HttpServletRequest request, HttpServletResponse response, @RequestBody String json) throws Exception{
		int count = 0;
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(json);
		String userId = StringUtil.getString(jsonParam.get("userId"));
		String mSearch = StringUtil.getString(jsonParam.get("mSearch"));
		
		Map<String, Object> map = new  HashMap<String,Object>();
		map.put("mSearch", mSearch);
		
		FlowHander hander = FlowHander.createFlowHander();
		try {
			count= TaskInterface.searchAllTasksCount(userId, map);
		} finally {
			hander.close();
		}
		
		return StringUtil.getString(count);
		
	}
}
