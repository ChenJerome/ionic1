<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<header class="main-box-header clearfix">
	<div class="row m-b-sm m-t-sm">
		<div class="col-xs-2">
			<a data-target="#commonWin" class="btn btn-primary btn-sm"
				type="button" data-toggle="modal"
				href="${pageContext.request.contextPath}/adBasicDataAction/import"><i
				class="fa fa-plus-circle"></i>&nbsp;导入</a> <a data-target="#commonWin"
				class="btn btn-primary btn-sm" type="button" data-toggle="modal"
				href="${pageContext.request.contextPath}/adBasicDataAction/export"><i
				class="fa fa-plus-circle"></i>&nbsp;导出</a>
		</div>
		<div class="col-xs-7"></div>
		<div class="col-xs-3">
			<input type="text" hidden="true">
			<div class="input-group">
				<input id="simpleQueryParam" name="simpleQueryParam" type="text"
					placeholder="请输入关键字搜索" class="form-control"> <span
					class="input-group-btn">
					<button onclick="myTable.filter()" type="button"
						class="btn btn-primary">查询</button>
				</span>
			</div>
		</div>
	</div>
</header>
<div class="main-box-body clearfix" style="overflow: auto;">
	<table class="table table-striped table-hover text-center">
		<thead>
			<tr>
				<th class="text-center" style="width: 44px;"></th>
				<th class="text-center" style="width: 44px;">序号</th>
				<th class="text-center">月份</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody>
			<c:choose>
				<c:when
					test="${page.recordList != null && page.recordList.size() > 0}">
					<form id="submitForm"
						action="${pageContext.request.contextPath}/userAction/delete"
						method="post">
						<c:forEach var="record" items="${page.recordList}"
							varStatus="status">
							<tr>
								<td><input type="checkbox" name="ids"
									value="${record.basicdataId}"></td>
								<td>${status.index + 1}</td>
								<td>${record.month}</td>
								<td class="text-center">
									<a href="${pageContext.request.contextPath}/userAction/edit/${record.basicdataId}" data-target="#commonWin" data-toggle="modal" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></a>
									<a href="#" type="button" onclick="deleteUsers(this)" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
									<a href="${pageContext.request.contextPath}/adBasicDataAction/view/${record.basicdataId}" id="view" data-target="#commonWin" data-toggle="modal" class="btn btn-primary btn-xs"><i class="fa fa-newspaper-o"></i></a></td>
							</tr>
						</c:forEach>
					</form>
				</c:when>
				<c:otherwise>
					<tr>
						<td colspan="4">暂无数据</td>
					</tr>
				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
	<jsp:include page="/templates/common-page.jsp" flush="true"></jsp:include>
</div>
