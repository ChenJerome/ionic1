<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		移动菜单管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/authMenuAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(11);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
/* 	        function queryData() {
	        	var params = {pageIndex : 1, pageSize : 10};
				loadData("${pageContext.request.contextPath}/userAction/list", params, $("#data"));
	        } */
		        
	        function deleteData(menuCode) {
	        	      	
	        	confirmDialog("删除菜单","确认删除该菜单吗？",function(){
	        		$.ajax({
		        		url : "${pageContext.request.contextPath}/authMenuAction/delete",
		        		type : 'POST',
		        		data : {
		        			menuCode : menuCode	        		
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
	        
	        function getMenus(){
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/authPrivilegeAction/getUserMenus",
	        		type : 'POST',
	        		data : {
	        			userCode : '1'	        		
	        		},
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			console.log(data);
	        		}
	        	});
	        }
	    </script>
	</frame:content>
	<frame:content replaceId="main">
		<div id="data">
		</div>
	</frame:content>
</frame:globalPage>