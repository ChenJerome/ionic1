<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<header class="main-box-header clearfix">
	<div class="row m-b-sm m-t-sm">
		<div class="col-xs-2">
			 <a class="btn btn-primary btn-sm" onclick="getAccountInfo();">&nbsp;获取信息</a>
 			<%-- <a data-target="#commonWin" class="btn btn-primary btn-sm" type="button" data-toggle="modal" href="${pageContext.request.contextPath}/userAction/add"><i class="fa fa-plus-circle"></i>&nbsp;新增</a> --%>
		</div>
		<div class="col-xs-7"></div>
		<div class="col-xs-3">
			<form id="searchForm" action="${pageContext.request.contextPath}/pushAccountAction/list">
				<input type="hidden" id="pageIndex" name="curPage" value="${page.curPage}">
 						<input type="hidden" id="pageSize" name="pageSize" value="${page.pageSize}">
				<div class="input-group">
					<input id="simpleQueryParam" name="simpleQueryParam" type="text" placeholder="请输入用户名称搜索" class="form-control" value="${page.condition.simpleQueryParam}"> <span class="input-group-btn">
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
				<th class="text-center">用户编号</th>
				<th class="text-center">用户名</th>
				<th class="text-center">设备号</th>
				<th class="text-center">是否开启免打扰</th>
				<th class="text-center">免打扰开始时间</th>
				<th class="text-center">免打扰结束时间</th>
				<th class="text-center">创建日期</th>
				<th class="text-center">修改日期</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody>
			<c:choose>
				<c:when test="${page.recordList != null && page.recordList.size() > 0}">
					<form id="submitForm" action="${pageContext.request.contextPath}/userAction/delete" method="post">
						<c:forEach var="record" items="${page.recordList}" varStatus="status">
		               		<tr>
								<td><input type="checkbox" name="ids" value="${record.code}"></td>
								<td>${status.index + 1}</td>
								<td>${record.userCode}</td>
								<td>${record.userName}</td>
								<td>${record.regCode}</td>
								<td><code:getDisText category="YESORNO" codeValue="${record.isNoDisturb}"></code:getDisText></td>
								<td>${record.noDisturbSTime}</td>
								<td>${record.noDisturbETime}</td>
								<td>${record.createTime}</td>
								<td>${record.updateTime}</td>
								<td class="text-center">
									<a href="#" type="button" onclick="deleteData(${record.code})" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>	
								</td>
		                  	</tr>
						</c:forEach>
					</form>
				</c:when>
				<c:otherwise>
					<tr>
						<td colspan="11">暂无数据</td>
					</tr>
				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
	<jsp:include page="/templates/common-page.jsp" flush="true"></jsp:include>
</div>