<!DOCTYPE html>
<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<header class="main-box-header clearfix">
	<div class="row m-b-sm m-t-sm">
		<div>
			<input type="text" id="inputStr" class="form-control " style="width:30%;display:inline" /> 
			<a onclick="createQrCode();"
				class="btn btn-primary btn-sm" type="button"> <i
				class="fa fa-plus-circle"></i>&nbsp;生成二维码
			</a> 
			<a id="downloadBtn" style="display:none" href="${pageContext.request.contextPath}/appCtrlAction/downloadPic" class="btn btn-primary btn-sm" type="button">
				<i class="fa fa-plus-circle"></i>&nbsp;下载图片
			</a>
		</div>
	</div>
</header>
<div class="main-box-body clearfix" style="overflow: auto;">
	<div id="output" width="256" height="256">
		<img id="qrCodeImg" src=""/>
	</div>
</div>


<script src="${pageContext.request.contextPath}/js/jquery/jquery-ui.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui.min.css">

<script>
$(function () {
	var availableTags = [
	                 	"ActionScript",
	                 	"AppleScript",
	                 	"Asp",
	                 	"BASIC",
	                 	"C",
	                 	"C++",
	                 	"Clojure",
	                 	"COBOL",
	                 	"ColdFusion",
	                 	"Erlang",
	                 	"Fortran",
	                 	"Groovy",
	                 	"Haskell",
	                 	"Java",
	                 	"JavaScript",
	                 	"Lisp",
	                 	"Perl",
	                 	"PHP",
	                 	"Python",
	                 	"Ruby",
	                 	"Scala",
	                 	"Scheme"
	                 ];
	$('#inputStr').autocomplete({source:availableTags});
});
</script>

<script>
	var canvasObj = jQuery('#output');
	function createQrCode() {
		$("#qrCodeImg").attr("src","");
		var str = $.trim($("#inputStr").val());
		if(str.length ==0 ){
			$("#downloadBtn").css("display","none");
			alertWarning("错误","请输入地址");
		}
		else{
			$.ajax({
	      		url  : "${pageContext.request.contextPath}/appCtrlAction/createQRCode",
	       		type : 'POST',
	       		data : {							
	       			inputStr : str
	       		},
	       		error : function() {
	       			alertError();
	       		},
	       		success : function(data) {
	       			$("#qrCodeImg").attr("src","${pageContext.request.contextPath}/appCtrlAction/getQrCode/"+data);
	       			$("#downloadBtn").css("display","");
	       		}
	     	});	
		}
	}

	
</script>