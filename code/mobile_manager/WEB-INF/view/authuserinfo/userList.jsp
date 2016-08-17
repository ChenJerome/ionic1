<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		用户管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/AuthUserInfoAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(9);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
	        function deleteData(userCode) {
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/AuthUserInfoAction/delete",
	        		type : 'POST',
	        		data : {
						userCode : userCode	        		
	        		},
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			commonSearch();
	        		}
	        	});
	        }
	        
	        function syncUserInfo(){
	        	confirmDialog("数据同步","确认同步用户信息吗？",function(){
	        		$.ajax({
		        		url : "${pageContext.request.contextPath}/AuthUserInfoAction/syncUserInfo",
		        		type : 'POST',
		        		error : function() {
		        			alertError();
		        		},
		        		success : function(data) {
		        			console.log(data);
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