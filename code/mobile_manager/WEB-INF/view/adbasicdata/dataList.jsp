<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		基础数据
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
			$(function() {
				selectMenu(8)

				$("table>tbody>tr").dblclick(function() {
					$("#view", this).click();
				});

				var params = {pageIndex : 1, pageSize : 10};
				loadData("${pageContext.request.contextPath}/adBasicDataAction/list", params, $("#data"));
			});
		</script>
	</frame:content>
	<frame:content replaceId="main">
		<div id="data">
		</div>
	</frame:content>
</frame:globalPage>

