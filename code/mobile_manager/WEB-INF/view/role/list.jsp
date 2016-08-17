<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<frame:globalPage pageName="globalPage">
	<frame:content replaceId="title">
		角色管理
	</frame:content>
	<frame:content replaceId="header">
		<script type="text/javascript">
	        $(function(){
	        	selectMenu(10)
	        })
	    </script>
	</frame:content>
	<frame:content replaceId="body-top">
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
	</frame:content>
	<frame:content replaceId="body-main">
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
	</frame:content>
	<frame:content replaceId="body-bottom">
	
	</frame:content>
</frame:globalPage>