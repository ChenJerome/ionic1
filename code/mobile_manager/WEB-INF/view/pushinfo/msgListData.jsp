<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<header class="main-box-header clearfix">
	<div class="row m-b-sm m-t-sm">
		<div class="col-xs-2">
			<!--<a class="btn btn-primary btn-sm" onclick="bindDeviceTest();">&nbsp;新增</a>-->
		</div>
		<div class="col-xs-7"></div>
		<div class="col-xs-3">
			<form id="searchForm" action="${pageContext.request.contextPath}/pushInfoAction/list">
				<input type="hidden" id="pageIndex" name="curPage" value="${page.curPage}">
 						<input type="hidden" id="pageSize" name="pageSize" value="${page.pageSize}">
				<div class="input-group">
					<input id="simpleQueryParam" name="simpleQueryParam" type="text" placeholder="请输入内容搜索" class="form-control" value="${page.condition.simpleQueryParam}"> <span class="input-group-btn">
						<button onclick="commonSearch()" type="button" class="btn btn-primary search-first">查询</button>&nbsp;
						<button onclick="clearSearch()" type="button" class="btn btn-primary search-last" style="margin-left:5px;">清除</button>
					</span>
				</div>
			</form>
		</div>
	</div>
</header>
<div class="main-box-body clearfix" style="overflow: auto;">
	<table class="table table-striped table-hover text-center">
		<thead>
			<tr>
				<th class="text-center" style="width: 44px;"></th>
				<th class="text-center" style="width: 44px;">序号</th>
				<th class="text-center">消息编号</th>
				<th class="text-center">接收对象</th>
				<th class="text-center">推送标题</th>
				<th class="text-center">推送内容</th>
				<!-- <th class="text-center">离线保存日期</th> -->
				<th class="text-center">消息状态</th>
				<th class="text-center">状态说明</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody>
			<c:choose>
				<c:when test="${page.recordList != null && page.recordList.size() > 0}">
					<%--<form id="submitForm" action="${pageContext.request.contextPath}/userAction/delete" method="post">--%>						
						<c:forEach var="record" items="${page.recordList}" varStatus="status">		               		<tr>
								<td><input type="checkbox" name="ids" value="${record.msgCode}"></td>
								<td>${status.index + 1}</td>
								<td>${record.msgCode}</td>
								<td>${record.regName}</td>
								<td>${record.title}</td>
								<td>${record.content}</td>
								<%-- <td>${record.offlineSaveDate}</td> --%>
								<td>${record.state}</td>
								<td>${record.remark}</td>
								<td class="text-center">
									<a href="#" type="button" title="重新发送" onclick="reSend(${record.msgCode})" class="btn btn-primary btn-xs"><i class="fa fa-send"></i></a>
									<a href="#" type="button" title="删除" onclick="deleteMsg(${record.msgCode})" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>		
								</td>
		                  	</tr>
						</c:forEach>
					<!-- </form> -->
				</c:when>
				<c:otherwise>
					<tr>
						<td colspan="9">暂无数据</td>
					</tr>
				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
	<jsp:include page="/templates/common-page.jsp" flush="true"></jsp:include>
</div>