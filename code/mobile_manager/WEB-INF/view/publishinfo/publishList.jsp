<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		App管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/pubilshInfoAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(14);
	        	
	        	//queryData();
	        	commonSearch();
	        });
	        
/* 	        function queryData() {
	        	var params = {pageIndex : 1, pageSize : 10};
				loadData("${pageContext.request.contextPath}/userAction/list", params, $("#data"));
	        } */
	        
	        function deleteData(code){
	        	confirmDialog("删除App版本","确认删除该版本吗？",function(){
	        		$.ajax({
		        		url : "${pageContext.request.contextPath}/pubilshInfoAction/delete",
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