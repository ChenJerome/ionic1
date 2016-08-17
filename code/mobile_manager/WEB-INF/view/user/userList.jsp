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
			var url = "${pageContext.request.contextPath}/userAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(9);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
/* 	        function queryData() {
	        	var params = {pageIndex : 1, pageSize : 10};
				loadData("${pageContext.request.contextPath}/userAction/list", params, $("#data"));
	        } */
	        
	        function deleteData(ids) {
	        	$.ajax({
	        		url : "${pageContext.request.contextPath}/userAction/delete",
	        		type : 'POST',
	        		data : {
						ids : ids	        		
	        		},
	        		error : function() {
	        			alertError();
	        		},
	        		success : function(data) {
	        			queryData();
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