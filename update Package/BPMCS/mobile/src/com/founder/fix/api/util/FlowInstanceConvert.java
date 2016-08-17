package com.founder.fix.api.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.founder.fix.apputil.util.BizObjectUtil;
import com.founder.fix.apputil.util.DateUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.bpmn2extensions.coreconfig.Priority;
import com.founder.fix.fixflow.api.ModelInterface;
import com.founder.fix.fixflow.api.TaskInterface;
import com.founder.fix.fixflow.core.ProcessEngineManagement;
import com.founder.fix.fixflow.core.impl.ProcessEngineConfigurationImpl;
import com.founder.fix.fixflow.core.impl.task.TaskInstanceEntity;
import com.founder.fix.fixflow.core.task.TaskInstance;
import com.founder.fix.fixflow.core.task.TaskInstanceType;
import com.founder.fix.webcore.permission.UserHander;

public class FlowInstanceConvert {
	/**
	 * 转换任务实例转换成Map
	 * 
	 * @param taskInstList
	 * @param processEngine
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String, Object>> parseTaskInstListMap(List<TaskInstance> taskInstList) throws Exception {
		List<Map<String, Object>> taskInstListMap = new ArrayList<Map<String, Object>>();
		if (taskInstList != null) {
			// FormService formService = processEngine.getFormService();
			for (TaskInstance taskInst : taskInstList) {

				Map<String, Object> task = parseTaskInstMap(taskInst);
				taskInstListMap.add(task);
			}
		}
		return taskInstListMap;

	}

	public static Map<String, Object> parseTaskInstMap(TaskInstance taskInst) throws Exception {
//		OnlineUser onlineUser=Current.getDataView().getUser();
//		String languageId=StringUtil.getString(onlineUser.getItem("local"));
		String languageId = "";
		
		String processDefinitionId = taskInst.getProcessDefinitionId();
		String processDefKey = taskInst.getProcessDefinitionKey();
		String nodeId = taskInst.getNodeId();
		String formPath = taskInst.getFormUri();
		String viewFormPath = taskInst.getFormUriView();

		Map<String, Object> task = new HashMap<String, Object>();
		task.put("form", formPath);
		task.put("viewForm", viewFormPath);

		task.put("defId", processDefinitionId);
		task.put("defKey", processDefKey);
		task.put("instId", taskInst.getProcessInstanceId());

//		ProcessDefinitionBehavior processDefinition = ModelInterface.getProcessDefinitionById(processDefinitionId);;
//		if(processDefinition == null){
//			throw ExceptionFactory.createSystemFixException("50010", processDefinitionId);
//		}
		task.put("wfName", taskInst.getProcessDefinitionName());
		task.put("nodeId", nodeId);
		task.put("taskId", taskInst.getId());
		if(taskInst.getTaskInstanceType()==TaskInstanceType.FIXENDEVENT){
			
			if(languageId.equals("en_US")){
				task.put("nodeName","end");
			}
			else{
				task.put("nodeName","流程结束");
			}
			
		
		}
		else{
			task.put("nodeName",taskInst.getName());
		}
		
		String assignee = taskInst.getAssignee();
		
		
		
		task.put("assignee", assignee);

		String assignessName = "";
		// 某些情况下任务的处理人可能为空，则不进行id到人名的转换
		if (StringUtil.isNotEmpty(assignee)) {
			assignessName = getUsername(assignee);
			
			if(taskInst.getAgent()!=null&&!taskInst.getAgent().equals("")){
				
				if(languageId.equals("en_US")){
					assignessName=assignessName+"/"+getUsername(taskInst.getAgent())+"[Agent]";
				}else{
					assignessName=assignessName+"/"+getUsername(taskInst.getAgent())+"[代]";
				}
				
				
			}
			
			
		}
		task.put("assignessName", assignessName);
		String processDefinitionKey = taskInst.getProcessDefinitionKey();
		String fKey = ModelInterface.getBizKeyByFlowDef(processDefinitionKey);
		String bizObjId = BizObjectUtil.flowBizObj.get(processDefinitionKey);
		task.put("bizObjId", bizObjId);
		task.put("fKey", fKey);
		task.put("fValue", taskInst.getBizKey());

		String description = taskInst.getDescription();
		
			
			
			if(taskInst.isSuspended()){
				if (taskInst.isDraft()) {
					if(languageId.equals("en_US")){
						description = description + "[Draft][Suspend]";
					}else{
						description = description + "[草稿][暂停]";
					}
				}else{
					if(languageId.equals("en_US")){
						description = description + "[Suspend]";
					}else{
						description = description + "[暂停]";
					}
				}
				
			}else{
				if (taskInst.isDraft()) {
					if(languageId.equals("en_US")){
						description = description + "[Draft]";
					}else{
						description = description + "[草稿]";
					}
				}
				
			}
			
			
			
			
		
		task.put("description", description);
		Date createTime = (Date) taskInst.getCreateTime();
		String dataStr = DateUtil.putDateToTimeStr19(createTime);
		task.put("createTime", dataStr);

		Date startTime = (Date) taskInst.getStartTime();
		if (startTime != null) {
			dataStr = DateUtil.putDateToTimeStr19(startTime);
			task.put("startTime", dataStr);
		}

		Date endTime = (Date) taskInst.getEndTime();
		if (endTime != null) {
			dataStr = DateUtil.putDateToTimeStr19(endTime);
			task.put("endTime", dataStr);
		}
		task.put("name", taskInst.getName());
		task.put("taskType", taskInst.getTaskInstanceType());

		Date claimTime = (Date) taskInst.getClaimTime();
		if (claimTime != null) {
			dataStr = DateUtil.putDateToTimeStr19(claimTime);
			task.put("claimTime", dataStr);
		}

		String userNameString = null;
		if (taskInst.getExtensionField("PI_INITIATOR") != null) {
			String userId = taskInst.getExtensionField("PI_INITIATOR").toString();
			if (userId.equals("fixflow_allusers")) {
				
				
				if(languageId.equals("en_US")){
					userNameString = "AllUser";
				}else{
					userNameString = "所有人";
				}
				
				
				
			} else {
				userNameString = getUsername(userId);
			}
		}
		task.put("pi_initiator", userNameString);

		Object startAuthor=taskInst.getExtensionField("PI_START_AUTHOR");
		String startAuthorString="";
		if( startAuthor!=null&&!startAuthor.equals("")){
			startAuthorString=getUsername(StringUtil.getString(startAuthor));
		}
		
		task.put("pi_start_author",startAuthorString);

		Object piStartTime = taskInst.getExtensionField("PI_START_TIME");
		if (piStartTime != null) {

			dataStr = DateUtil.putDateToTimeStr19((Date) piStartTime);
			task.put("pi_start_time", dataStr);
		}

		task.put("pi_subject", taskInst.getExtensionField("PI_SUBJECT"));

		// 处理结果
		task.put("commandMessage", taskInst.getCommandMessage());
		task.put("expectedExecutionTime", com.founder.fix.fixflow.core.impl.util.DateUtil.formatDuring(taskInst.getExpectedExecutionTime()));

		task.put("taskComment", StringUtil.getString(taskInst.getTaskComment()));
		
		Object intObj =  taskInst.getPriority();
		int priority = 50;
		if(intObj != null){
			priority = Integer.parseInt(intObj.toString());
		}
		
		task.put("priority", StringUtil.getString(taskInst.getPriority()));
		ProcessEngineConfigurationImpl processEngineConfiguration = ProcessEngineManagement.getDefaultProcessEngine().getProcessEngineConfiguration();
		Priority priorityTo = processEngineConfiguration.getPriority(priority);
		String priorityColor = priorityTo.getColor();
		String priorityName  = priorityTo.getName();
		task.put("priorityColor", priorityColor);
		task.put("priorityName", priorityName);
		
		task.put("isSuspended", taskInst.isSuspended());
		
		
		
		for (String taskKey : ((TaskInstanceEntity)taskInst).getExtensionFields().keySet()) {
			
			task.put("efield_"+taskKey, ((TaskInstanceEntity)taskInst).getExtensionFields().get(taskKey));
		}
		
	
		return task;
	}

	/**
	 * 将任务实例转换处理过程的Map
	 * 
	 * @param instances
	 * @return
	 */
	public static List<Map<String, Object>> parseTaskProcMap(List<TaskInstance> instances) {
		List<Map<String, Object>> taskList;
		taskList = new ArrayList<Map<String, Object>>();

		List<String> userIdList = new ArrayList<String>();

		for (TaskInstance taskInstanceQueryTo : instances) {
			Map<String, Object> taskMap = new HashMap<String, Object>();
			taskMap.put("id", taskInstanceQueryTo.getId());
			taskMap.put("nodeName", taskInstanceQueryTo.getNodeName());
			taskMap.put("nodeId", taskInstanceQueryTo.getNodeId());
			taskMap.put("createTime", taskInstanceQueryTo.getCreateTime());
			
			Date endTime = taskInstanceQueryTo.getEndTime();
			if (endTime != null) {
				String dataStr = DateUtil.putDateToTimeStr19(endTime);
				taskMap.put("endTime", dataStr);
			}
			
			taskMap.put("endTime", taskInstanceQueryTo.getEndTime());
			taskMap.put("assigness", taskInstanceQueryTo.getAssignee());

			userIdList.add(taskInstanceQueryTo.getAssignee());
			// 时限
			taskMap.put("dueDate", taskInstanceQueryTo.getDueDate());
			// 处理结果
			taskMap.put("commandMessage", taskInstanceQueryTo.getCommandMessage());
			// 处理意见
			taskMap.put("taskComment", taskInstanceQueryTo.getTaskComment());
			// taskMap.put("expectedExecutionTime",
			// taskInstanceQueryTo.getExpectedExecutionTime());
			taskList.add(taskMap);
		}
		try {
			Map<String, Object> userMap = UserHander.getUserNameByUserId(userIdList);

			for (Map<String, Object> taskMap : taskList) {
				taskMap.put("assignessName", userMap.get(taskMap.get("assigness")));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return taskList;
	}
	
	
	protected static String getUsername(String userId) {
		String assigneeName = "";

		try {

			assigneeName = TaskInterface.getUserName(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// userInfoMap.put(userId, assigneeName);

		return assigneeName;
	}

}
