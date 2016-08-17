<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal"
		aria-hidden="true">×</button>
	<h4 class="modal-title">查看角色${roleInfo.roleName}的用户</h4>
</div>
<div class="main-box-body clearfix" style="overflow: visible;">
	<input type="hidden" id="roleCode" value="${roleInfo.roleId}">
	<input type="hidden" id="roleName" value="${roleInfo.roleName}">
	<table class="table table-striped table-hover text-center">
		<thead>
			<tr>
				<th class="text-center" style="width: 44px;"></th>
				<th class="text-center">用户编号</th>
				<th class="text-center">用户名称</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody id="privilegeTbd">
			<c:choose>
				<c:when
					test="${modalpage.recordList != null && modalpage.recordList.size() > 0}">
					<form id="submitForm"
						action="${pageContext.request.contextPath}/authMenuAction/delete"
						method="post">
						<c:forEach var="roleRecord" items="${modalpage.recordList}"
							varStatus="status">
							<tr id="listDataTr_${roleRecord.code}">
								<td><input type="checkbox" value="${roleRecord.code}"></td>
								<td>${roleRecord.userCode}</td>
								<td>${roleRecord.userName}</td>
								<td class="text-center"><a href="#" type="button"
									onclick="deleteRoleData(${roleRecord.code})"
									class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
								</td>
							</tr>
						</c:forEach>
					</form>
				</c:when>
				<c:otherwise>
					<tr id="noData">
						<td colspan="4">暂无数据</td>
					</tr>
				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
	<jsp:include page="/templates/modal-page.jsp" flush="true"></jsp:include>
</div>

<div>
	<div class="modal-header">
		<h4 class="modal-title" style="float: left">用户信息</h4>
		<input type="text" id="txt_userQuery" value="" />
		<button class="btn btn-primary" type="button">
			<strong>添 加</strong>
		</button>
	</div>
	<div class="main-box-body clearfix" style="overflow: visible;">
		<div class="selectZone">
			<!-- <span><i>赵钺(119532)</i><a herf="#">X</a></span>  -->
			<!-- <span><i>赵钺(119532)</i><a	herf="#">X</a></span> 
			<span><i>赵钺(119532)</i><a herf="#">X</a></span> -->
		</div>
		<div class="modal-footer">
			<button class="btn btn-primary" type="button"
				onclick="addRoleMember();">
				<strong>确 定</strong>
			</button>
		</div>
	</div>
</div>


<script
	src="${pageContext.request.contextPath}/js/jquery/jquery-ui.min.js"
	type="text/javascript"></script>
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/jquery-ui.min.css">
<style type="text/css">

	.selectZone {
		font-size: 16px;
		height: 120px;

	}

	.selectZone span {
		line-height: 20px;
		padding: 3px;
		float:left;
	}

	.selectZone span i{
	  font-style: normal;
	  font-weight: normal;
	}
</style>
<script>
var selectUserList = [$("#roleCode").val()];
$(function () {
	var userList = ${userList};
	//console.log(userList);	
	$('#txt_userQuery').autocomplete({
		source:userList,
		select:function(event,ui){			 
			 addSelectUser(ui.item);
			 $(this).val("");
			 //console.log(ui);
			 event.preventDefault();     
		}
	});
});


function addSelectUser(item){	
	var selectUserCount = selectUserList.length;
	for(var i= 0 ; i < selectUserCount ; i++){
		if(selectUserList[i] == item.value){
			alertInfo("重复","该用户已经添加");
			return;
		}
	}
	selectUserList.push(item.value.toString());
	var $span = $('<span class="tag"><i>' + item.label + '</i><button type="button" class="close" style="float:none">×</button></span>');
	$span.attr("userCode", item.value);
	$span.find("button").click(function() {
        var span = $(this).closest("span");
        span.remove();
        var userCode = span.attr("userCode"); 
        delSelectUserList(userCode); 
    });

    $(".selectZone").append($span);
}

function delSelectUserList (userCode) {
	var selectUserCount = selectUserList.length;
	for(var i= 0 ; i < selectUserCount ; i++){
		if(selectUserList[i] == userCode){
			selectUserList.splice(i, 1);
			return;
		}
	}
}

function addRoleMember(){
	//console.log(selectUserList);
	if(selectUserList.length<=1){
		alertError("未选择","请选择要添加的用户");
	}
	confirmDialog("批量添加","确认将所选用户添加角色["+$("#roleName").val()+"]吗？",function(){
		$.ajax({
		url : "${pageContext.request.contextPath}/AuthRoleAction/batchAddRoleOfMember",
		type : 'POST',
		dataType:"json",
		data : JSON.stringify(selectUserList),
		contentType:"application/json",
		error : function() {
			alertError();
		},
		success : function(data) {
			$(".selectZone").empty();
			modelToIndex(1, 5);
		}
	});
	},function(){
		
	});
}


//console.log(userList);
function deleteRoleData(code){
	confirmDialog("删除","确认从角色中删除该用户吗？",function(){
		$.ajax({
        		url : "${pageContext.request.contextPath}/AuthUserInfoAction/deleteRoleMember",
        		type : 'POST',
        		data : {
        			code : code
        		},
        		error : function() {
        			alertError();
        		},
        		success : function(data) {
        			console.log(data);
        			var returnVal = jQuery.parseJSON(data);
        			if(returnVal.success == true){
        				/*$("#listDataTr_"+code).remove();
        				var tblObj = $("#privilegeTbd");
        				if(tblObj.find("tr").length == 0 ){
        					tblObj.append($("<tr id='noData'><td colspan='6'>暂无数据</td></tr>"));	
       					}*/
       					modelToIndex(1, 5);
        			}
        			else{
        				alertError("删除异常",returnVal.msg);	
        			}
        		}
		});
	},function(){
		
	});
}



function modelToIndex(pageIndex,pageSize){
	var params = {pageIndex : 1, pageSize : 10};
	if (pageIndex) {
		params.pageIndex = pageIndex;
	}
	if (pageSize) {
		params.pageSize = pageSize;
	}
	params.roleCode = $("#roleCode").val();
	var url = "${pageContext.request.contextPath}/AuthRoleAction/getRoleOfMembers";
	$.ajax({
		url : url,
		type : 'POST',
		data : params,
		error : function() {
			alertError();
		},
		success : function(response) {			
			var returnVal = jQuery.parseJSON(response);
			$("#privilegeTbd").empty();
			var datas  = returnVal.recordList;
			console.log(returnVal);
			for(var i=0;i <datas.length;i++){
				var data = datas[i];
				var $tr = $("<tr id='listDataTr_"+data.code+"' </tr>");
				var $checktd = $("<td><input type='checkbox' value='"+data.code+"'></td>");
				var $userCode = $("<td>"+data.userCode+"</td>");
				var $userName = $("<td>"+data.userName+"</td>");
				var $operator = $("<td class='text-center'><a href='#' type='button' onclick='deleteRoleData("+data.code+")' class='btn btn-danger btn-xs'><i class='fa fa-trash-o'></i></a></td>")
				$tr.append($checktd).append($userCode).append($userName).append($operator);
				$("#privilegeTbd").append($tr);
			}
			//处理分页条
			//首页
			var currentPageIndex = returnVal.curPage;
			var pageCount = returnVal.pageCount;
			var pager = $("#pager").children();
			pager.eq(2).find("a").html(currentPageIndex);
			//${modalpage.endRow >= modalpage.totalRecord ? modalpage.totalRecord : modalpage.endRow}
			$("#pagerText").html("第 "+returnVal.startRow+" 至 "+(returnVal.endRow>=returnVal.totalRecord?returnVal.totalRecord : returnVal.endRow)+" 条记录，共 "+returnVal.totalRecord+" 条");
			if(currentPageIndex == pageCount){
				pager.eq(3).addClass(" disabled");
				pager.eq(4).addClass(" disabled");
				pager.eq(3).find("a").removeAttr("onclick");
				pager.eq(4).find("a").removeAttr("onclick");
				pager.eq(0).removeClass(" disabled");
				pager.eq(1).removeClass(" disabled");
				pager.eq(0).find("a").attr("onclick","modelToIndex(1, 5)");				
				pager.eq(1).find("a").attr("onclick","modelToIndex("+(currentPageIndex-1>=1?currentPageIndex-1:1)+", 5)");
			}
			else if(currentPageIndex ==1){
				pager.eq(3).removeClass(" disabled");
				pager.eq(4).removeClass(" disabled");
				pager.eq(3).find("a").attr("onclick","modelToIndex("+(currentPageIndex+1>pageCount?currentPageIndex:currentPageIndex+1)+", 5)");				
				pager.eq(4).find("a").attr("onclick","modelToIndex("+pageCount+", 5)");
				pager.eq(0).addClass(" disabled");
				pager.eq(1).addClass(" disabled");
				pager.eq(0).find("a").removeAttr("onclick");
				pager.eq(1).find("a").removeAttr("onclick");
			}
			else{
				pager.eq(0).removeClass(" disabled");
				pager.eq(1).removeClass(" disabled");
				pager.eq(0).find("a").attr("onclick","modelToIndex(1, 5)");				
				pager.eq(1).find("a").attr("onclick","modelToIndex("+(currentPageIndex-1>=1?currentPageIndex-1:1)+", 5)");
				pager.eq(3).removeClass(" disabled");
				pager.eq(4).removeClass(" disabled");
				pager.eq(3).find("a").attr("onclick","modelToIndex("+(currentPageIndex+1>pageCount?currentPageIndex:currentPageIndex+1)+", 5)");				
				pager.eq(4).find("a").attr("onclick","modelToIndex("+pageCount+", 5)");
				
			}
		}
	});
}


</script>
