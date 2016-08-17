package com.fix.task;


import java.sql.Types;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.founder.fix.apputil.to.PageTo;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.bpmn2extensions.coreconfig.AllUserInfo;
import com.founder.fix.dbcore.Parm_Struct;
import com.founder.fix.fixflow.api.task.FlowHander;
import com.founder.fix.fixflow.core.ProcessEngine;
import com.founder.fix.fixflow.core.ProcessEngineManagement;
import com.founder.fix.fixflow.core.TaskService;
import com.founder.fix.fixflow.core.impl.task.QueryExpandTo;
import com.founder.fix.fixflow.core.task.TaskInstance;
import com.founder.fix.fixflow.core.task.TaskInstanceType;
import com.founder.fix.fixflow.core.task.TaskQuery;
import com.founder.fix.framework.flow.FlowObjConverter;
import com.founder.fix.webcore.BaseInterface;

public class FlowTask extends BaseInterface {

	public List<Map<String, Object>> searchMyNotice() throws Exception {
		List<Map<String, Object>> taskList = new ArrayList<Map<String, Object>>();

		Map<String, Object> map = JSONUtil.parseJSON2Map(StringUtil
				.getString(dataView.get("filter")));

		String userId = dataView.getUser().getUserID();

		int start = 1;
		int limit = 8;

		PageTo pageTo = dataView.getPageInfo();
		if (pageTo != null) {
			start = pageTo.getCurrentPageIndex();
			limit = pageTo.getPageSize();
		}

		FlowHander hander = FlowHander.createFlowHander();
		try {
			List<TaskInstance> instances = searchMyNotice(userId, start, limit,
					map);

			taskList = FlowObjConverter.parseTaskInstListMap(instances);
			for(Map<String, Object> taskMap : taskList){
				String instId = StringUtil.getString(taskMap.get("instId"));
				String nowNodeInfo = "";
				if(StringUtil.isNotEmpty(instId)){
					nowNodeInfo = FlowQueryUtil.getShareTaskNowNodeInfo(instId);
				}
				taskMap.put("nowNodeInfo", nowNodeInfo);
			}
			String agent = StringUtil.getString(map.get("agent"));

			if (StringUtil.isNotEmpty(agent)) {
				for (Map<String, Object> taskMap : taskList) {
					taskMap.put("agent", agent);
				}
			}

		} finally {
			hander.close();
		}
		// dataView.putReturnData("myTask", taskList);
		// dataView.putReturnData("myTaskCount", taskList.size());
		return taskList;
	}

	public int searchMyNoticeCount() throws Exception {
		int taskCount = 0;
		String userId = dataView.getUser().getUserID();
		Map<String, Object> map = JSONUtil.parseJSON2Map(StringUtil
				.getString(dataView.get("filter")));
		FlowHander hander = FlowHander.createFlowHander();
		try {
			ProcessEngine processEngine = ProcessEngineManagement
					.getDefaultProcessEngine();
			TaskService taskService = processEngine.getTaskService();

			TaskQuery query = taskService.createTaskQuery();

			//query.taskCandidateUser(userId).taskAssignee(userId).taskNotEnd();
			//吴建华解决流程结束后抄送流程中没有结束后的记录。
			query.taskCandidateUser(userId).taskAssignee(userId);
			query.addTaskType(TaskInstanceType.FIXNOTICETASK);

			parseCommomnTaskQuery(query, map);

			taskCount = (int) query.count();

		} finally {
			hander.close();
		}
		return taskCount;
	}

	public static List<TaskInstance> searchMyNotice(String userId, int start,
			int limit, Map<String, Object> map) throws Exception {
		List<TaskInstance> instances = new ArrayList<TaskInstance>();
		// DBGetResult dbgr = new DBGetResult();
		// try {
		// dbgr.openConn();
		ProcessEngine processEngine = ProcessEngineManagement
				.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();

		TaskQuery query = taskService.createTaskQuery();
		query.taskCandidateUser(userId).taskAssignee(userId);
		query.addTaskType(TaskInstanceType.FIXNOTICETASK);

		parseCommomnTaskQuery(query, map);

		//query.taskNotEnd().orderByTaskCreateTime().desc();
		//吴建华解决流程结束后抄送流程中没有结束后的记录。
		query.orderByTaskCreateTime().desc();
		instances = query.listPagination(start, limit);
		// } finally {
		// dbgr.closeConn();
		// }

		return instances;
	}

	private static TaskQuery parseCommomnTaskQuery(TaskQuery query,
			Map<String, Object> map) throws ParseException {

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
					
					query.processDefinitionKey(defKeyList);
				}
				else{
					query.processDefinitionKey(defKey);
				}
				
			}
			
			//任务主题
			String description = StringUtil.getString(map.get("description"));
			if (StringUtil.isNotEmpty(description)) {
				query.taskDescriptionLike(description);
			}

			//步骤名
			String name = StringUtil.getString(map.get("name"));
			if (StringUtil.isNotEmpty(name)) {
				query.taskNameLike(name);
			}
			// 提交人
			String initiator = StringUtil.getString(map.get("initiator"));
			if (StringUtil.isNotEmpty(initiator)) {
				query.initiatorLike(initiator);
			}
			
			String assignee = StringUtil.getString(map.get("assignee"));
			if(StringUtil.isNotEmpty(assignee)){
				ProcessEngine processEngine=ProcessEngineManagement.getDefaultProcessEngine();
				AllUserInfo userInfoConfig=processEngine.getProcessEngineConfiguration().getUserDefinition().getUserInfoConfig();
				
				//创建一个扩展参数查询对象
				QueryExpandTo queryExpandTo=new QueryExpandTo();
				//关联用户表
				queryExpandTo.setLeftJoinSql(" LEFT JOIN ("+userInfoConfig.getSqlText()+") UT on UT."+userInfoConfig.getUserIdField()+" = T.ASSIGNEE ");
				//like 用户名
				queryExpandTo.setWhereSql("(UT."+userInfoConfig.getUserNameField()+" LIKE '%" + assignee + "%'  or UT."+userInfoConfig.getUserIdField()+" = '" + assignee + "')");
				/* 这里的用户表和用户名字段都可以从流程里读取出来 */
				query.queryExpandTo(queryExpandTo);
			}
			
			
			// businessKey
			String businessKey = StringUtil.getString(map.get("businessKey"));
			if (StringUtil.isNotEmpty(businessKey)) {
//				query.businessKey(businessKey);
				businessKey = businessKey.replace("'", "");
				QueryExpandTo queryExpandTo=new QueryExpandTo();
				queryExpandTo.setWhereSql("T.BIZKEY like '%"+businessKey+"%'");
				query.queryExpandTo(queryExpandTo);
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
				queryExpandTo.setLeftJoinSql(" LEFT JOIN ("+userInfoConfig.getSqlText()+") UT on UT."+userInfoConfig.getUserIdField()+" = P.INITIATOR ");
				//like 用户名
				//吴建华使用to_char解决查询是数字型，条件为字符串BUG.
				queryExpandTo.setWhereSql("(UT."+userInfoConfig.getUserNameField()+" LIKE '%" + initiatorName + "%'  or to_char(UT."+userInfoConfig.getUserIdField()+") = '" + initiatorName + "')");
				/* 这里的用户表和用户名字段都可以从流程里读取出来 */
				query.queryExpandTo(queryExpandTo);
			}
			
			//开始时间
			String start_time = StringUtil.getString(map.get("start_time"));
			if (StringUtil.isNotEmpty(start_time)) {
				SimpleDateFormat sdf  =   new  SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" ); 
				Date date = sdf.parse(start_time);
				query.taskCreatedBefore(date);
			}
			
			//结束时间
			String end_time = StringUtil.getString(map.get("end_time"));
			if (StringUtil.isNotEmpty(end_time)) {
				SimpleDateFormat sdf  =   new  SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" ); 
				Date date = sdf.parse(end_time);
				query.taskCreatedAfter(date);
			}
			String isSuspended = StringUtil.getString(map.get("isSuspended"));
			if (StringUtil.isNotEmpty(isSuspended)) {
				
				query.isSuspended(Boolean.parseBoolean(isSuspended));
			}
			
			//所属模块
			String category = StringUtil.getString(map.get("category"));
			if(StringUtil.isNotEmpty(category)){
				query.category(category);
			}
			//代理人
			String agent = StringUtil.getString(map.get("agent"));
			if(StringUtil.isNotEmpty(agent)){
				query.isAgent(true);
				query.agentId(agent);
			}
			//流程状态
			String instance_status = StringUtil.getString(map.get("instance_status"));
			if (StringUtil.isNotEmpty(instance_status)) {
				QueryExpandTo queryExpandTo=new QueryExpandTo();
				//queryExpandTo.setLeftJoinSql(" LEFT JOIN fixflow_run_processinstanece p on t.bizkey = p.biz_key ");
				queryExpandTo.setWhereSql("p.instance_status = '"+instance_status+"'");
				query.queryExpandTo(queryExpandTo);
			}
			
		}
		return query;
	}

	public List<Parm_Struct> processNoticeTaskParam(StringBuffer sql) {
		Object processId = dataView.getFormInfo().get("PROCESSINSTANCE_ID");
		Object assignee = dataView.getFormInfo().get("ASSIGNEE");
		Object createTime = dataView.getFormInfo().get("CREATE_TIME");
		Object endTime = dataView.getFormInfo().get("END_TIME");
		Object processDefKey = dataView.getFormInfo().get(
				"PROCESSDEFINITION_KEY");
		Object processDefId = dataView.getFormInfo()
				.get("RROCESSDEFINITION_ID");
		List<Parm_Struct> params = new ArrayList<Parm_Struct>();

		if (StringUtil.isNotEmpty(StringUtil.getString(processId))) {
			sql.append(" and ");
			sql.append("PROCESSINSTANCE_ID=?");
			Parm_Struct param = new Parm_Struct(processId);
			param.setSqlTypes(Types.VARCHAR);
			params.add(param);
		}
		if (StringUtil.isNotEmpty(StringUtil.getString(assignee))) {
			sql.append(" and ");
			sql.append("ASSIGNEE=?");
			Parm_Struct param = new Parm_Struct(assignee);
			param.setSqlTypes(Types.VARCHAR);
			params.add(param);
		}
		if (StringUtil.isNotEmpty(StringUtil.getString(createTime))) {
			sql.append(" and ");
			sql.append("CREATE_TIME>?");
			Parm_Struct param = new Parm_Struct(createTime);
			param.setSqlTypes(Types.TIMESTAMP);
			params.add(param);
		}
		if (StringUtil.isNotEmpty(StringUtil.getString(endTime))) {
			sql.append(" and ");
			sql.append("END_TIME<?");
			Parm_Struct param = new Parm_Struct(endTime);
			param.setSqlTypes(Types.TIMESTAMP);
			params.add(param);
		}
		if (StringUtil.isNotEmpty(StringUtil.getString(processDefKey))) {
			sql.append(" and ");
			sql.append("PROCESSDEFINITION_KEY=?");
			Parm_Struct param = new Parm_Struct(processDefKey);
			param.setSqlTypes(Types.VARCHAR);
			params.add(param);
		}
		if (StringUtil.isNotEmpty(StringUtil.getString(processDefId))) {
			sql.append(" and ");
			sql.append("RROCESSDEFINITION_ID=?");
			Parm_Struct param = new Parm_Struct(processDefId);
			param.setSqlTypes(Types.VARCHAR);
			params.add(param);
		}

		return params;
	}

}