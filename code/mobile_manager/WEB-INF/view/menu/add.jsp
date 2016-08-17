<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/menuAction/add" id="editForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">新增菜单</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<input type="hidden" th:value="${parendId}" name="parentId" />
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="parent">*</label> 父菜单名称： </label>
					<div class="col-xs-3">
						<select class="form-control" name="parent.menuId" id="parent">
							<option value="0">无</option>
							<c:forEach var="menu" items="${menuList}">
								<option value="${menu.menuId}">${menu.menuText}</option>
							</c:forEach>
						</select>
					</div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="menuType">*</label> 菜单类型： </label>
					<div class="col-xs-3">
						<code:select category="menuType" selectClass="form-control" name="menuType" id="menuType"/>
					</div>
				</div>
				<div class="form-group ">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label" for="menuText"><label class="text-danger">*</label> 菜单名称： </label>
					<div class="col-xs-3">
						<input name="menuText" id="menuText" placeholder="请输入菜单名称" type="text" class="form-control " />
					</div>
					<label class="col-xs-2 control-label" for="isPrivilege"><label class="text-danger">*</label> 权限控制： </label>
					<div class="col-xs-3">
						<code:select category="yesOrNo" selectClass="form-control" name="isPrivilege" id="isPrivilege"/>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-md-2 control-label" for="odBy"><label class="text-danger">*</label> 排序： </label>
					<div class="col-md-3">
						<input name="odBy" id="odBy" placeholder="请输入菜单排序" type="number" min="0" class="form-control " />
					</div>
					<label class="col-md-2 control-label"><label class="text-danger"></label></label>
					<div class="col-md-3">
						
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label" for="menuBody">菜单主体：</label>
					<div class="col-xs-8">
						<input name="menuBody" id="menuBody" placeholder="请输入菜单主体" type="text" class="form-control " />
					</div>
				</div>
				<div id="formBuilderDiv"></div>
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