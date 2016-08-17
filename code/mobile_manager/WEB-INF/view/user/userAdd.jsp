<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/userAction/add" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">新增用户</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="loginName">*</label> 登录名： </label>
					<div class="col-xs-3">
						<input name="loginName" id="loginName" placeholder="请输入登录名" type="text" class="form-control " />
					</div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="pwd">*</label> 密码： </label>
					<div class="col-xs-3">
						<input name="pwd" id="pwd" placeholder="请输入密码" type="text" class="form-control " />
					</div>
				</div>
				<div class="form-group ">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label" for="userName"><label class="text-danger">*</label> 显示名： </label>
					<div class="col-xs-3">
						<input name="userName" id="userName" placeholder="请输入显示名" type="text" class="form-control " />
					</div>
					<label class="col-xs-2 control-label" for="gender"> 性别： </label>
					<div class="col-xs-3">
						<code:select category="gender" selectClass="form-control" name="gender" id="gender"/>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-md-2 control-label" for="phone"> 电话： </label>
					<div class="col-md-3">
						<input name="phone" id="phone" placeholder="请输入电话" type="text" class="form-control " />
					</div>
					<label class="col-md-2 control-label"><label class="text-danger"></label></label>
					<div class="col-md-3">
						<input name="userType" id="userType" placeholder="请输入电话" type="hidden" value="1" />
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
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/validateDiy.js"></script>
<script type="text/javascript">
	$(function(){
		var rules = {
			loginName : {
				required : true,
				minlength : 3,
				maxlength : 25
            },
            pwd : {
            	required : true,
				minlength : 6,
				maxlength : 25
            },
            userName : {
            	required : true,
				minlength : 3,
				maxlength : 25
            },
            phone : {
            	isMobile : true
            }
		};
		var messages = {
			loginName : {
				required : "请输入您的用户名.",
				minlength : "用户名必须3个字符以上.",
				maxlength : "用户名不能大于25个字符."
			},
			pwd : {
				required : "请输入您的密码.",
				minlength : "密码必须6个字符以上.",
				maxlength : "密码不能大于25个字符."
			},
			userName : {
				required : "请输入您的显示名.",
				minlength : "用户名必须3个字符以上.",
				maxlength : "用户名不能大于25个字符."
			}
		};
		formWinAjaxSubmit("commonWin", "addForm", rules, messages, queryData);
	})
</script>