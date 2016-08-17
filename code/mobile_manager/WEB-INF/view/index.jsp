<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
<head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/bootstrap-3.3.5-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/Font-Awesome-4.5/css/font-awesome.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/globalPage.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/jquery.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/common/login.js"></script>
<script type="text/javascript">
	$(function(){
		var msg = '${msg}';
		if (msg != '')
			$("#showErrorMsg").html(msg);
	})
</script>
</head>
<body>
	<div id="floater"></div>
	<div class="login">
		<div class="login-main">
			<div class="login-body">
				<form id="loginForm" action="${pageContext.request.contextPath}/userAction/login" method="post" class="form-horizontal" style="width: 400px; height: 220px; padding: 40px 30px 30px 30px;">
					<div class="form-group">
						<label class="col-lg-3 control-label" for="loginName">用户名：</label>
    					<div class="col-lg-8">
							<input type="text" id="loginName" name="loginName" placeholder="用户名" class="form-control ">
						</div>
					</div>
					<div class="form-group">
						<label class="col-lg-3 control-label" for="pwd">密码：</label>
    					<div class="col-lg-8">
							<input type="password" id="pwd" name="pwd" placeholder="密码" class="form-control ">
						</div>
					</div>
					<div class="form-group">
						<label class="col-lg-3 control-label"></label>
						<div class="col-lg-8">
							<button type="submit" class="btn btn-primary col-lg-5">登 录</button>
							<button type="reset" id="resetBtn" class="btn col-lg-5 col-md-offset-2">重 置</button>
						</div>
					</div>
					<div class="form-group">
						<label class="col-lg-3 control-label"></label>
						<div class="col-lg-8">
							<div id="showErrorMsg" style="color: red; padding-left: 10px;"></div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>