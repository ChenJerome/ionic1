<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">
<form action="${pageContext.request.contextPath}/userAction/add" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">浏览考勤数据</h4>
	</div>
	<div class="modal-body">
		<div class="row" style=" overflow: scroll-y;">
			<div class="col-xs-12">
				<div class="form-group">
					<table class="table text-center">
						<thead>
							<tr>
								<th class="text-center text-nowrap">工号</th>
								<th class="text-center text-nowrap">姓名</th>
								<th class="text-center">1</th>
								<th class="text-center">2</th>
								<th class="text-center">3</th>
								<th class="text-center">4</th>
								<th class="text-center">5</th>
								<th class="text-center">6</th>
								<th class="text-center">7</th>
								<th class="text-center">8</th>
								<th class="text-center">9</th>
								<th class="text-center">10</th>
								<th class="text-center">11</th>
							</tr>
						</thead>
						<tbody>
							<c:forEach var="recordDetail" items="${record.detail}" varStatus="status">
								<tr>
									<td>${recordDetail.workNo}</td>
									<td class="text-nowrap">${recordDetail.name}</td>
									<td>${recordDetail.d01}</td>
									<td>${recordDetail.d02}</td>
									<td>${recordDetail.d03}</td>
									<td>${recordDetail.d04}</td>
									<td>${recordDetail.d05}</td>
									<td>${recordDetail.d06}</td>
									<td>${recordDetail.d07}</td>
									<td>${recordDetail.d08}</td>
									<td>${recordDetail.d09}</td>
									<td>${recordDetail.d10}</td>
									<td>${recordDetail.d11}</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">
			<strong>关 闭</strong>
		</button>
	</div>
</form>