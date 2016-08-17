<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/authMenuAction/add" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">新增菜单</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="menuText">*</label> 菜单名： </label>
					<div class="col-xs-3">
						<input name="menuText" id="menuText" placeholder="请输入菜单名" type="text" class="form-control "  required="required" />
					</div>
					 <label class="col-xs-2 control-label"><label class="text-danger" for="supMenuCode"></label> 上级菜单： </label>
					<div class="col-xs-3">
						<%-- <code:getMenus selectClass="form-control" name="supMenuCode" id="supMenuCode"></code:getMenus> --%>
						<select class="form-control" name="supMenuCode" id="supMenuCode">
							<option value="0">无</option>
							<c:forEach var="menu" items="${menus}">
								<option value="${menu.menuCode}">${menu.menuText}</option>
							</c:forEach>
						</select>
					</div>
				</div>
				<div class="form-group ">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label" for="menuType"><label class="text-danger"></label> 菜单类型： </label>
					<div class="col-xs-3">
						<code:select category="AUTH_MENU_TYPE" selectClass="form-control" name="menuType" id="menuType"/>
					</div>
					<label class="col-xs-2 control-label" for="isPrivilege"> 权限控制： </label>
					<div class="col-xs-3">
						<!-- <input type="checkbox" name="isPrivilege" id="isPrivilege" value="1"> -->
						<code:select category="YESORNO" selectClass="form-control" name="isPrivilege" id="isPrivilege"/>
					</div>
				</div>
				 <div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-md-2 control-label" for="url"> 菜单URL： </label>
					<div class="col-md-3">
						<input name="url" id="url" placeholder="请输入菜单URL" type="text" class="form-control " />
					</div>
					<label class="col-md-2 control-label"><label class="pcMenuCode">PC菜单编号</label></label>
					<div class="col-md-3">
						<input name="pcMenuCode" id="pcMenuCode" placeholder="PC菜单编号" class="form-control" type="text"  />
					</div>
				</div>	
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-md-2 control-label" for="menuIcon"> 菜单图标： </label>
					<div class="col-md-3">
						<input name="menuIcon" id="menuIcon" placeholder="请输入菜单图标" type="text" class="form-control " />
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
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">