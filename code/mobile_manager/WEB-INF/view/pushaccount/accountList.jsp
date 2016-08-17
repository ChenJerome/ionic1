<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		推送设备管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/pushAccountAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(12);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
/* 	        function queryData() {
	        	var params = {pageIndex : 1, pageSize : 10};
				loadData("${pageContext.request.contextPath}/userAction/list", params, $("#data"));
	        } */
	        
	        function getAccountInfo(){
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/rest/getUserMenus",
	        		type : 'POST',
	        		data : {
	        			userCode:"851"
	        		},
	        		async: false,
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			//commonSearch();
	        			console.log(data);
	        		}
	        	});
	        }
	   
	        
			function bindDeviceTest(){
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/pushAccountAction/bindDevice",
	        		type : 'POST',
	        		data : {
						userCode : "0002",
						userName : "Tammy",
						regId    : "qwertyuyi"
	        		},
	        		dataType:'jsonp',
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			commonSearch();
	        		}
	        	});
	        }        
	        
		        
	        function deleteData(code) {
	        	      	
	        	confirmDialog("删除设备信息","确认删除该设备信息吗？",function(){
	        		$.ajax({
		        		url : "${pageContext.request.contextPath}/pushAccountAction/delete",
		        		type : 'POST',
		        		data : {
							code : code	        		
		        		},
		        		error : function() {
		        			alertError();
		        		},
		        		success : function(data) {
		        			commonSearch();
		        		}
		        	});
	        	},function(){
	        		
	        	});
	        }
	    </script>
	</frame:content>
	<frame:content replaceId="main">
		<div id="data">
		</div>
	</frame:content>
</frame:globalPage>