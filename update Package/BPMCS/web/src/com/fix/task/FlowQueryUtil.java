package com.fix.task;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.util.BizObjectUtil;
import com.founder.fix.apputil.util.DateUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.bpmn2extensions.coreconfig.AllUserInfo;
import com.founder.fix.fixflow.api.ModelInterface;
import com.founder.fix.fixflow.api.TaskInterface;
import com.founder.fix.fixflow.core.IdentityService;
import com.founder.fix.fixflow.core.ProcessEngine;
import com.founder.fix.fixflow.core.ProcessEngineManagement;
import com.founder.fix.fixflow.core.impl.bpmn.behavior.ProcessDefinitionBehavior;
import com.founder.fix.fixflow.core.impl.identity.GroupDefinition;
import com.founder.fix.fixflow.core.impl.identity.GroupTo;
import com.founder.fix.fixflow.core.impl.identity.UserTo;
import com.founder.fix.fixflow.core.impl.runtime.ProcessInstanceEntity;
import com.founder.fix.fixflow.core.impl.task.QueryExpandTo;
import com.founder.fix.fixflow.core.runtime.ProcessInstance;
import com.founder.fix.fixflow.core.runtime.ProcessInstanceQuery;
import com.founder.fix.fixflow.core.task.IdentityLink;
import com.founder.fix.fixflow.core.task.TaskInstance;
import com.founder.fix.webcore.Current;

/**
 * 类名称：FlowQueryUtil<br>
 * 类描述：TODO 请描述一下这个类<br>
 * 创建时间：2013-5-27 上午2:11:48<br>
 * 修改人：<br>
 * 修改时间：<br>
 * 修改描述：<br>
 * @version 1.0
 */
public class FlowQueryUtil {
	/**
	 * TODO 请描述一下这个方法
	 * @param instList
	 * @param processInstanceQueryTos
	 * @throws Exception
	 */
	public static  List<Map<String, Object>>  parseInstListMap(List<ProcessInstance> processInstanceQueryTos, List<String> extFiledList) throws Exception {
		List<Map<String, Object>> instList = new ArrayList<Map<String, Object>>();
		
		for (ProcessInstance processInstanceQueryTo : processInstanceQueryTos) {
			
			ProcessInstanceEntity entity = (ProcessInstanceEntity)processInstanceQueryTo;
			
			Map<String, Object> instMap = new HashMap<String, Object>();
			instMap = processInstanceQueryTo.getPersistentState();
			instMap.put("initiator", getUsername(StringUtil.getString(instMap.get("initiator"))));
			instMap.put("startAuthor", getUsername(StringUtil.getString(instMap.get("startAuthor"))));
			String nowNodeInfo = getShareTaskNowNodeInfo(processInstanceQueryTo.getId());
			
			String fix_processstate = StringUtil.getString(entity.getExtensionField("FIX_PROCESSSTATE"));
			if(fix_processstate.equals("8")){
				nowNodeInfo = "终止";
			}else if(fix_processstate.equals("8")){
				nowNodeInfo = "草稿";
			}
			instMap.put("nowNodeInfo", nowNodeInfo);
			
			String dataStr= "";
			Date startTime = (Date) processInstanceQueryTo.getStartTime();
			if (startTime != null) {
				dataStr = DateUtil.putDateToTimeStr19(startTime);
				instMap.put("startTime", dataStr);
			}
			
			
			ProcessDefinitionBehavior processDefinitionBehavior = TaskInterface.getProcessDefinition(processInstanceQueryTo
					.getProcessDefinitionId());
			String defaultFormUri = processDefinitionBehavior.getDefaultFormUri();
			instMap.put("defaultFormUri", defaultFormUri);
			instMap.put("wfName", processDefinitionBehavior.getName());

			String processDefinitionKey = processDefinitionBehavior.getProcessDefinitionKey();
			String fKey = ModelInterface.getBizKeyByFlowDef(processDefinitionKey);
			String bizObjId = BizObjectUtil.flowBizObj.get(processDefinitionKey);
			instMap.put("bizObjId", bizObjId);
			instMap.put("fKey", fKey);
			instMap.put("fKey", fKey);
			instMap.put("fValue", processInstanceQueryTo.getBizKey());
			for(String filed : extFiledList){
				instMap.put(filed, entity.getExtensionField(filed));
			}
			instList.add(instMap);
		}
		return instList;
	}
	
	public static UserTo getUserTo(String userId) {
		
		try {

			return TaskInterface.getUserTo(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// userInfoMap.put(userId, assigneeName);

		return null;
	}
	

	public static String getUsername(String userId) {
		String assigneeName = "";
		if(StringUtil.isEmpty(userId)){
			return "未知用户";
		}
		try {

			assigneeName = TaskInterface.getUserName(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// userInfoMap.put(userId, assigneeName);

		return assigneeName;
	}
	
	/**
	 * 获得实例的当前处理信息
	 * 
	 * @param taskInstanceQueryTo
	 * @return 例如 "人工任务(共享角色:功能角色)(共享部门:平台产品部,财务部)"
	 */
	public static String getShareTaskNowNodeInfo(TaskInstance taskInstanceQueryTo) {
		
		if(taskInstanceQueryTo.getEndTime()==null){
			try {
				return processState(taskInstanceQueryTo);
			} catch (Exception e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		}
		else{
			String processInstanceId = taskInstanceQueryTo.getProcessInstanceId();
			return getShareTaskNowNodeInfo(processInstanceId);
		}
		
		
		return null;
		//String processInstanceId = taskInstanceQueryTo.getProcessInstanceId();
		//return getShareTaskNowNodeInfo(processInstanceId);

	}

	/**
	 * @param processInstanceId
	 * @return
	 */
	public static String getShareTaskNowNodeInfo(String processInstanceId) {
		try {
			String taskInfo = "";
			ProcessInstance processInstanceQueryTo = TaskInterface.getProcessInstanceById(processInstanceId);
			if (processInstanceQueryTo.getEndTime() != null) {
				
				OnlineUser onlineUser=Current.getDataView().getUser();
				String languageId=StringUtil.getString(onlineUser.getItem("local"));
				if(languageId.equals("en_US")){
					return "Finish";
				}else{
					return "完成";
				}
			}

			List<TaskInstance> taskInstanceQueryTos = new ArrayList<TaskInstance>();
			taskInstanceQueryTos = TaskInterface.getProcessInstanceDoneByUser(processInstanceId);
			for (TaskInstance taskInstanceQueryTo2 : taskInstanceQueryTos) {
				if(taskInfo.equals("")&&taskInstanceQueryTos.size()==1){
					taskInfo=taskInfo+processState(taskInstanceQueryTo2);
				}
				else{
					taskInfo=taskInfo+"<div>"+processState(taskInstanceQueryTo2)+"</div>";
				}
				
			}
			return taskInfo;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	public static String processState(TaskInstance taskInstanceQueryTo) throws Exception{
		String taskInfo="";
		String assignee = taskInstanceQueryTo.getAssignee();
		OnlineUser onlineUser=Current.getDataView().getUser();
		String languageId=StringUtil.getString(onlineUser.getItem("local"));
		ProcessDefinitionBehavior processDefinition = ModelInterface.getProcessDefinitionById(taskInstanceQueryTo.getProcessDefinitionId());
		String nodeName = processDefinition.getFlowElement(taskInstanceQueryTo.getNodeId()).getName();
		taskInfo = taskInfo + nodeName;
		IdentityService identityService = TaskInterface.getIdentityService();
		if (assignee == null) {
			//Map<String, List<Object>> groupMap = new HashMap<String, List<Object>>();
			
			
			List<UserTo> userTos=new ArrayList<UserTo>();
			
			Map<String, List<GroupTo>> groupTosMap=new HashMap<String, List<GroupTo>>();
			
			//List<GroupTo> groupTos=new ArrayList<GroupTo>();
			
			//groupMap.put(USER_GROUP_TYPE_ID, new ArrayList<Object>());
			//List<GroupTo>
			
			List<IdentityLink> identityLinkQueryToList = TaskInterface.getIdentityLinkQueryToList(taskInstanceQueryTo);
			for (IdentityLink identityLinkQueryTo : identityLinkQueryToList) {
				String userId = identityLinkQueryTo.getUserId();
				if (userId == null) {
					String groupTypeId = identityLinkQueryTo.getGroupType();

					String groupId = identityLinkQueryTo.getGroupId();

					GroupTo groupTo = identityService.getGroup(groupId, groupTypeId);
					if (groupTo == null) {
						continue;
					}
					//String groupName = groupTo.getGroupName();
					if(groupTosMap.get(groupTypeId)!=null){
						groupTosMap.get(groupTypeId).add(groupTo);
					}
					else{
						List<GroupTo> groupTos=new ArrayList<GroupTo>();
						groupTos.add(groupTo);
						groupTosMap.put(groupTypeId, groupTos);
					}
					
				} else {
					UserTo userTo=null;
					if (userId.equals("fixflow_allusers")) {
						if(languageId.equals("en_US")){
							userTo=new UserTo("fixflow_allusers", "AllUser", null);
						}else
						{
							userTo=new UserTo("fixflow_allusers", "所有人", null);
						}
						
						//username = "所有人";
					} else {
						userTo=getUserTo(userId);
						//username = getUsername(userId);
					}
					//List<String> groupNameList = groupMap.get(USER_GROUP_TYPE_ID);
					if(userTo!=null){
						userTos.add(userTo);
					}
					
				}
			}
			
			if(userTos.size()>0){
				String groupTypeName="";
				if(languageId.equals("en_US")){
					groupTypeName = "User";
					taskInfo += "(Sharing " + groupTypeName + " : ";
				}else
				{
					groupTypeName = "用户";
					taskInfo += "(共享 " + groupTypeName + " : ";
				}
				
				
				for (int i = 0; i < userTos.size(); i++) {
					UserTo userTo=userTos.get(i);
					if(i==userTos.size()-1){
						taskInfo += userTo.getUserName();
					}
					else{
						taskInfo += userTo.getUserName()+",";
					}
					
				}
				taskInfo=taskInfo+")";
				
			}
			
			
			
			for (String groupToKey : groupTosMap.keySet()) {
				
				List<GroupTo> groupTos=groupTosMap.get(groupToKey);
				GroupDefinition groupDefinition = identityService.getGroupDefinition(groupToKey);
					
					String groupTypeName = "";

						groupTypeName = groupDefinition.getName();
	
						if(languageId.equals("en_US")){
							taskInfo += "(Sharing " + groupTypeName + " : ";
						}else
						{
							taskInfo += "(共享 " + groupTypeName + " : ";
						}
					
					taskInfo += listToStr(groupTos, ",",groupDefinition) + ")";
				
			}
			
			

			
		} else {
			String username = getUsername(assignee);
			
			username="<span title='"+username+"("+assignee+")'>"+username+"</span>";
			
			if(languageId.equals("en_US")){
				taskInfo = taskInfo + " (Handler : " + username + ") ";
			}else
			{
				taskInfo = taskInfo + " (处理者 ： " + username + ") ";
			}
			
		}
		
		return taskInfo;
	}
	
	
	public static String listToStr(List<GroupTo> groupTos, String joinChar,GroupDefinition groupDefinition){
		if(groupTos==null||groupTos.size()==0|| joinChar == null){
			return "";
		}
		
		String listStr = "";
		
		for(GroupTo groupTo : groupTos){
			
			List<UserTo> userTos=groupDefinition.findUserChildMembersIncludeByGroupId(groupTo.getGroupId());
			String nameList="";
			int x=0;
			int y=5;
			if(userTos.size()>y){
				userTos=userTos.subList(0, y);
				x=1;
			}
			
			for (int i = 0; i < userTos.size(); i++) {
				UserTo userTo=userTos.get(i);
				if(i==userTos.size()-1){
					nameList=nameList+userTo.getUserName()+"("+userTo.getUserId()+")";
				}
				else{
					nameList=nameList+userTo.getUserName()+"("+userTo.getUserId()+"),  ";
				}
				
			}
			if(x==1){
				nameList=nameList+" .......";
			}
			
			
			
			listStr = listStr+"<span title='"+nameList+"'>"+groupTo.getGroupName()+"</span>"+joinChar;
		}
		
		listStr = listStr.substring(0, listStr.length()- joinChar.length());
		
		return listStr;
		
	}
	
	
	public static ProcessInstanceQuery parseCommonInstanceQuery(
			ProcessInstanceQuery processInstanceQuery, Map<String, Object> map)
			throws ParseException {
		if (map != null && map.size() > 0) {
			//流程定义号
			String defKey = StringUtil.getString(map.get("defKey"));
			if (StringUtil.isNotEmpty(defKey)) {
				String[] defKeys=defKey.split("_FIXFLOWDEFKEY_");
				if(defKeys.length>1){
					
					List<String> defKeyList=new ArrayList<String>();
					
					for (String string : defKeys) {
						defKeyList.add(string);
					}
					
					processInstanceQuery.processDefinitionKey(defKeyList);
				}
				else{
					processInstanceQuery.processDefinitionKey(defKey);
				}
				
			}
			
			if (map.get("subject") != null&&!map.get("subject").toString().equals("")) {
				processInstanceQuery.subjectLike(StringUtil.getString(map.get("subject")));
		
			}

			// businessKey
			String businessKey = StringUtil.getString(map.get("businessKey"));
			if (StringUtil.isNotEmpty(businessKey)) {
//				processInstanceQuery.processInstanceBusinessKey(businessKey);
				businessKey = businessKey.replace("'", "");
				QueryExpandTo queryExpandTo=new QueryExpandTo();
				queryExpandTo.setWhereSql("BIZ_KEY like '%"+businessKey+"%'");
				processInstanceQuery.queryExpandTo(queryExpandTo);
			}

			// 提交人名称
			String initiatorName = StringUtil.getString(map.get("initiatorName"));
			if (StringUtil.isNotEmpty(initiatorName)) {
				initiatorName = initiatorName.replace("'", "");
				ProcessEngine processEngine=ProcessEngineManagement.getDefaultProcessEngine();
				AllUserInfo userInfoConfig=processEngine.getProcessEngineConfiguration().getUserDefinition().getUserInfoConfig();
				
				//创建一个扩展参数查询对象
				QueryExpandTo queryExpandTo=new QueryExpandTo();
				//关联用户表
				queryExpandTo.setLeftJoinSql(" LEFT JOIN ("+userInfoConfig.getSqlText()+") UT on UT."+userInfoConfig.getUserIdField()+" = E.INITIATOR ");
				//like 用户名
				queryExpandTo.setWhereSql("(UT."+userInfoConfig.getUserNameField()+" LIKE '%" + initiatorName + "%'  or UT."+userInfoConfig.getUserIdField()+" = '" + initiatorName + "')");
				/* 这里的用户表和用户名字段都可以从流程里读取出来 */
				processInstanceQuery.queryExpandTo(queryExpandTo);
			}
			
			
			// Initiator
			if (map.get("initiator") != null) {
				processInstanceQuery.initiatorLike(StringUtil.getString(map.get("initiator")));
			}
			if (map.get("startTime") != null&&!map.get("startTime").toString().equals("")) {
				
				SimpleDateFormat sdf  =   new  SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" ); 
				Date date = sdf.parse(StringUtil.getString(map.get("startTime")));
				processInstanceQuery.startTimeBefore(date);
			}
			if (map.get("endTime") != null&&!map.get("endTime").toString().equals("")) {
				SimpleDateFormat sdf  =   new  SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" ); 
				Date date = sdf.parse(StringUtil.getString(map.get("endTime")));
				processInstanceQuery.startTimeAfter(date);
			}
			
			String isEnd = StringUtil.getString(map.get("isEnd"));
			
			if(isEnd.equals("1")){
				processInstanceQuery.isEnd();
			}else if(isEnd.equals("0")){
				processInstanceQuery.notEnd();
			}
			
		}
		
		return processInstanceQuery;
	}
}
