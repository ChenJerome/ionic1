<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="com.purvar.frame" prefix="frame" %>
<%@ taglib uri="com.purvar.menu" prefix="menu" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/bootstrap-3.3.5-dist/css/bootstrap.min.css">
<%-- <link rel="stylesheet" href="${pageContext.request.contextPath}/js/fontawesome/css/font-awesome.min.css"> --%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/Font-Awesome-4.5/css/font-awesome.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/toastr/toastr.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/webuploader-0.1.5/webuploader.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/globalPage.css">
<script src="${pageContext.request.contextPath}/js/jquery/jquery.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.form.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/toastr/toastr.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/toastr/bootstrapQ.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/common/common.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/common/globalPage.js" type="text/javascript"></script>
<title><frame:contentPlace id="title">移动管理平台</frame:contentPlace></title>
	<script type="text/javascript">
        function menuToggle() {
            if ($("#my-menu").hasClass("nav-small")) {
                $("#my-menu").removeClass("nav-small");
            } else {
                $("#my-menu").addClass("nav-small");
            }
        }
    </script>
    <frame:contentPlace id="header"/>
</head>
<body class="theme-turquoise">
	<div class="my-header">
		<header class="navbar navbar-fixed-top" id="header-navbar">
			<div class="container-fluid">
				<div class="navbar-header" style="line-height:50px;">
					<font style="font-size: large;color: #FFFFFF;">移动管理平台</font>
					<!-- <ul class="nav navbar-nav">
						<li class=""><a>移动管理平台</a></li>
					</ul>  -->
					<%--<a class="navbar-brand" href="#">  <img alt=""
						class="normal-logo logo-white" src="${pageContext.request.contextPath}/imgs/logo_w.png">
					</a> --%>
				</div>
				<div class="collapse navbar-collapse pull-left">
					<ul class="nav navbar-nav">
						<!-- <li><a class="btn" href="#" onclick="menuToggle()"><i class="fa fa-bars"></i></a></li>
						<li><a class="btn" title="首页" href="/tg-cms/admin/index.gsp"><i class="fa fa-home"></i></a></li> 
						<li class=""><a>移动管理平台</a></li>-->
					</ul>
				</div>
				
				<%-- <div class="collapse navbar-collapse pull-right" >
					 <menu:topMenu/>
				</div> --%>
			</div>
		</header>
	</div>
	<div class="my-body">
		<div id="my-menu" class="container-fluid">
			<div id="nav-col">
				<div class="collapse navbar-collapse" id="sidebar-nav">
					<menu:leftMenu/>
				</div>
			</div>
			<div class="my-content" id="my-content">
				<div class="main-box">
					<frame:contentPlace id="main">
						<header class="main-box-header clearfix">
							<div class="row m-b-sm m-t-sm">
								<div class="col-xs-2">
									<a data-target="#commonWin" class="btn btn-primary btn-sm"
										type="button" data-toggle="modal"
										href="/tg-cms/admin/m/base/special/add.gsp"><i
										class="fa fa-plus-circle"></i>&nbsp;新增</a>
								</div>
								<div class="col-xs-8"></div>
								<div class="col-xs-2">
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
										<th class="text-center" style="width: 44px;">序号</th>
										<th class="text-center">状态</th>
										<th class="text-center">标题</th>
										<th class="text-center">标题</th>
										<th class="text-center">标题</th>
										<th class="text-center">标题</th>
										<th class="text-center">标题</th>
										<th class="text-center">标题</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td colspan="8">暂无数据</td>
									</tr> 
								</tbody>
							</table>
						</div>
					</frame:contentPlace>
				</div>
			</div>
		</div>
	</div>
	<footer id="footer-bar" class="row" style="opacity: 1;">
		<p id="footer-copyright" class="col-xs-12">
			<strong>Copyright</strong> 方正璞华信息技术有限公司  @2015
		</p>
	</footer>
	<div id="commonWin" tabIndex="-2" class="modal fade bs-example-modal-lg" aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content"></div>
		</div>
		<script type="text/javascript">
	        /*<![CDATA[*/
	        $(function() {
	            var windowId = /*[[${windowId}]]*/'windowId';
	            $("#commonWin").on("hidden.bs.modal", function() {
	                $(this).removeData("bs.modal");
	            });
	        });
	        /*]]>*/
	    </script>
    </div>
</body>
</html>