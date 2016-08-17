<%@ taglib prefix="frame" uri="com.purvar.frame" %>
<%@ taglib prefix="code" uri="com.purvar.code" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		推送消息
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			var url = "${pageContext.request.contextPath}/pushInfoAction/list";
	        $(function(){
	        	//默认选择菜单
	        	selectMenu(13);
	        	
	        	//queryData();
	        	commonSearch();
	        }); 
	        
	        function reSend (msgCode){
	        	
	        	confirmDialog("发送消息","确认重新发送该消息吗？",function(){
	        		$.ajax({
	        			url  : "${pageContext.request.contextPath}/pushInfoAction/reSend",
		        		type : 'POST',
		        		data : {							
		        			msgCode : msgCode
		        		},
		        		error : function() {
		        			alertError();
		        		},
		        		success : function(data) {
		        			alertSuccess("推送完成","消息推送完成");
		        			commonSearch();
		        		}
	        		});
	        	},function(){
	        		
	        	});
	        }
	        
	        
	        function deleteMsg(msgCode){	        	
	        	confirmDialog("删除消息","确认删除该消息吗？",function(){
	        		$.ajax({
	        			url  : "${pageContext.request.contextPath}/pushInfoAction/deleteMsg",
		        		type : 'POST',
		        		data : {							
		        			msgCode : msgCode
		        		},
		        		error : function() {
		        			alertError();
		        		},
		        		success : function(data) {
		        			alertSuccess("删除消息","消息删除完成");
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