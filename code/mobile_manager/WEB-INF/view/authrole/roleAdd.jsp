<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/AuthRoleAction/add" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">新增角色</h4>
	</div>
	<div class="modal-body">
		<input type="hidden" value="0" id="roleType" name="roleType" />
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<!-- <div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="roleId">*</label> 角色编号： </label>
					<div class="col-xs-3">
						<input name="roleId" id="roleId" placeholder="请输入角色编号" type="text" class="form-control " />
					</div>
					
				</div> -->
				<div class="form-group ">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="roleName">*</label> 角色名称： </label>
					<div class="col-xs-3">
						<input name="roleName" id="roleName" placeholder="请输入角色名称" type="text" class="form-control " />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" type="submit">
			<strong>提 交</strong>
		</button>
		<button type="button" class="btn btn-default" data-dismiss="modal">
			<strong>关 闭</strong>
		</button>
	</div>
</form>