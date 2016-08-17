<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/authPrivilegeAction/addPrivilege" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">新增权限</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<input type="hidden" value="${menu.menuCode}" id="menuCode" name="menuCode">
			<div class="col-xs-12">
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="menuText"></label> 菜单名： </label>
					<div class="col-xs-3">
						<input name="menuName" id="menuName" readOnly placeholder="请输入菜单名" type="text" class="form-control " value="${menu.menuText}" />
					</div>
					<%-- <label class="col-xs-2 control-label"><label class="text-danger" for="supMenuCode"></label> ： </label>
					<div class="col-xs-3">
						<code:getMenus selectClass="form-control" name="supMenuCode" id="supMenuCode"></code:getMenus>
						<select class="form-control" name="supMenuCode" id="supMenuCode">
							<option value="0">无</option>
							<c:forEach var="menu" items="${menus}">
								<option value="${menu.menuCode}">${menu.menuText}</option>
							</c:forEach>
						</select>
					</div> --%>
				</div>	
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="groupType"></label> 权限类型： </label>
					<div class="col-xs-3">
						<code:select category="PRIVILEGE_TYPE" selectClass="form-control" name="groupType" id="groupType"/>
					</div>
				</div>	
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="groupType">*</label> 权限对象： </label>
					<div class="col-xs-3">
						<input class="form-control" type="text" id="groupCode" name="groupCode" value="" required="required" />
						<input class="form-control" type="text" id="groupName" name="groupName" value="" required="required" />
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