<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		角色管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/AuthRoleAction/list";			
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(10);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
	        function deleteData(roleId) {
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/AuthRoleAction/delete",
	        		type : 'POST',
	        		data : {
	        			roleId : roleId	        		
	        		},
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			commonSearch();
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