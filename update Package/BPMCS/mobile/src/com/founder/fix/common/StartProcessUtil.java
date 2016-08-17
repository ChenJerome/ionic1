package com.founder.fix.common;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import com.founder.fix.apputil.log.DebugLog;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.dbcore.DBGetResult;
import com.founder.fix.fixflow.core.ProcessEngine;
import com.founder.fix.fixflow.core.ProcessEngineManagement;
import com.founder.fix.fixflow.core.RuntimeService;
import com.founder.fix.fixflow.core.TaskService;
import com.founder.fix.fixflow.core.impl.ExternalContent;
import com.founder.fix.fixflow.core.impl.bpmn.behavior.TaskCommandInst;
import com.founder.fix.fixflow.core.impl.command.ExpandTaskCommand;
import com.founder.fix.fixflow.core.impl.command.StartProcessInstanceCommand;
import com.founder.fix.fixflow.core.task.TaskInstance;
import com.founder.fix.fixflow.core.task.TaskQuery;

public class StartProcessUtil {
	private static final DebugLog logger = LogFactory
			.getDebugLog(StartProcessUtil.class);


	String userName;
	ProcessEngine processEngine;

	public StartProcessUtil(Connection conn, String authenticatedUserId) {
		this.processEngine = ProcessEngineManagement.getDefaultProcessEngine();
		this.userName = authenticatedUserId;

		ExternalContent externalContent = new ExternalContent();
		externalContent.setAuthenticatedUserId(userName);
		externalContent.setConnection(conn);

		processEngine.setExternalContent(externalContent);
	}

	public void processClose() {
		this.processEngine.contextClose(true, false);
	}

	public void startProcess(String processKey, String PKFValue)
			throws Exception {
		// 获取流程引擎对象

		RuntimeService runtimeService = this.processEngine.getRuntimeService();
		// 创建一个启动命令
		StartProcessInstanceCommand startProcessInstanceCommand = new StartProcessInstanceCommand();
		// 设置需要启动的流程的KEY
		startProcessInstanceCommand.setProcessDefinitionKey(processKey);
		// 设置业务关联键值
		startProcessInstanceCommand.setBusinessKey(PKFValue);
		// 设置流程的启动人
		startProcessInstanceCommand.setStartAuthor(this.userName);
		// 启动流程，返回流程实例
		runtimeService.noneStartProcessInstance(startProcessInstanceCommand);

	}

	// 流程启动并提交第一个节点
	public void testStartAndSubmit(String processKey, String PKFValue,
			String btCommandid) throws Exception {

		TaskService taskService = this.processEngine.getTaskService();

		// 创建一个通用命令
		ExpandTaskCommand expandTaskCommand = new ExpandTaskCommand();
		// 设置流程名
		expandTaskCommand.setProcessDefinitionKey(processKey);
		// 设置流程的业务关联键
		expandTaskCommand.setBusinessKey(PKFValue);
		// 命令类型，可以从流程引擎配置中查询 启动并提交为startandsubmit
		expandTaskCommand.setCommandType("startandsubmit");
		// 设置提交人
		expandTaskCommand.setInitiator(this.userName);
		// 设置命令的id,需和节点上配置的按钮编号对应，会执行按钮中的脚本。
		expandTaskCommand.setUserCommandId(btCommandid);
		// 执行这个启动并提交的命令，返回启动的流程实例
		taskService.expandTaskComplete(expandTaskCommand, null);

	}

	// 启动并提交流程操作
	public void startProcessAndSubmit(String processKey, String PKFValue)
			throws Exception {

		TaskService taskService = this.processEngine.getTaskService();

		List<TaskCommandInst> commandList = taskService
				.getSubTaskTaskCommandByKey(processKey);
		TaskCommandInst startAndSubmitCommand = null;
		for (int i = 0; i < commandList.size(); i++) {
			if ("startandsubmit"
					.equals(commandList.get(i).getTaskCommandType())) {
				startAndSubmitCommand = commandList.get(i);
			}
		}

		// 创建一个通用命令
		ExpandTaskCommand expandTaskCommand = new ExpandTaskCommand();
		// 设置流程名
		expandTaskCommand.setProcessDefinitionKey(processKey);
		// 设置流程的业务关联键
		expandTaskCommand.setBusinessKey(PKFValue);
		// 命令类型
		expandTaskCommand.setCommandType(startAndSubmitCommand
				.getTaskCommandType());
		// 设置提交人
		expandTaskCommand.setInitiator(this.userName);
		// 设置命令的id,需和节点上配置的按钮编号对应，会执行按钮中的脚本。
		expandTaskCommand.setUserCommandId(startAndSubmitCommand.getId());
		// 执行这个启动并提交的命令，返回启动的流程实例
		taskService.expandTaskComplete(expandTaskCommand, null);

	}

	// 流程节点处理
	// 流程编号Id,流程对应业务对象值，任务节点号,节点处理人,处理按钮类型，处理按钮id
	public void execProcess(String processDefinitionKey, String businessKey,
			String nodeId, String buttonType, String buttonId) throws Exception {

		TaskService taskService = processEngine.getTaskService();
		// 创建任务查询
		TaskQuery taskQuery = taskService.createTaskQuery();
		// 查找 1200119390 的这个流程实例的当前独占任务
		List<TaskInstance> taskInstances = taskQuery
				.taskAssignee(this.userName).taskCandidateUser(this.userName)
				.processDefinitionKey(processDefinitionKey)
				.businessKey(businessKey).taskNotEnd().list();
		// 获取一条任务
		if (taskInstances.size() > 0) {
			TaskInstance taskInstance = taskInstances.get(0);
			// 创建通用命令
			ExpandTaskCommand expandTaskCommandGeneral = new ExpandTaskCommand();
			// 设置命令为领取任务
			expandTaskCommandGeneral.setCommandType(buttonType);
			// 设置命令的ID，需和节点上配置的按钮编号对应，会执行其中脚本
			expandTaskCommandGeneral.setUserCommandId(buttonId);
			// 设置命令的处理任务号
			expandTaskCommandGeneral.setTaskId(taskInstance.getId());
			// 点击通用按钮
			taskService.expandTaskComplete(expandTaskCommandGeneral, null);
		} else {
			throw new Exception("处理的任务不存在");
		}

	}
	
	public static void main(String[] args) throws SQLException{
		DBGetResult dbgr = new DBGetResult();
		StartProcessUtil spUtil = null;
		try{
			dbgr.openConn();
			//启动人编号
			String authenticatedUserId = "admin";
			spUtil = new StartProcessUtil(dbgr.getConnection(), authenticatedUserId);
			String processKey = "flow_hire";
			//关联键的值
			String PKFValue = "123";
			spUtil.startProcessAndSubmit(processKey, PKFValue);
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		finally{
			spUtil.processClose();
			dbgr.closeConn();
		}
		
	}
}
