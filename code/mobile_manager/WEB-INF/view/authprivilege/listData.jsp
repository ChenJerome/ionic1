<%@ taglib uri="com.purvar.frame" prefix="frame"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal"
		aria-hidden="true">×</button>
	<h4 class="modal-title">查看权限</h4>
</div>
<div class="main-box-body clearfix" style="overflow: visible;">
	<input type="hidden" id="privilegeMenuCode" value="${menuCode}">
	<table class="table table-striped table-hover text-center">
		<thead>
			<tr>
				<th class="text-center" style="width: 44px;"></th>
				<th class="text-center">菜单名称</th>
				<th class="text-center">权限组类型</th>
				<th class="text-center">权限组编号</th>
				<th class="text-center">权限组名称</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody id="privilegeTbd">
			<c:choose>
				<c:when
					test="${page.recordList != null && page.recordList.size() > 0}">
					<form id="submitForm"
						action="${pageContext.request.contextPath}/authMenuAction/delete"
						method="post">
						<c:forEach var="record" items="${page.recordList}"
							varStatus="status">
							<tr id="listDataTr_${record.code}">
								<td><input type="checkbox" value="${record.code}"></td>
								<td>${record.menuName}</td>
								<td>${record.groupType}</td>
								<td>${record.groupCode}</td>
								<td>${record.groupName}</td>
								<td class="text-center">
									<%-- <a href="${pageContext.request.contextPath}/authMenuAction/modify/${record.menuCode}" data-target="#commonWin" data-toggle="modal" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></a> --%>
									<a href="#" type="button"
									onclick="deletePrivilegeData(${record.code})"
									class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
								</td>
							</tr>
						</c:forEach>
					</form>
				</c:when>
				<c:otherwise>
					<tr id="noData">
						<td colspan="6">暂无数据</td>
					</tr>
				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
	<%-- <jsp:include page="/templates/common-page.jsp" flush="true"></jsp:include> --%>
</div>
<!-- 显示角色列表 -->
<div>
	<div class="modal-header">
		<h4 class="modal-title">角色信息</h4>
	</div>
	<div class="main-box-body clearfix" style="overflow: visible;">
		<table class="table table-striped table-hover text-center">
			<thead>
				<tr>
					<th class="text-center" style="width: 44px;"></th>
					<th class="text-center">序号</th>
					<th class="text-center">角色编号</th>
					<th class="text-center">角色名称</th>
				</tr>
			</thead>
			<tbody>
				<c:choose>
					<c:when
						test="${rolePage.recordList != null && rolePage.recordList.size() > 0}">
						<form id="submitForm"
							action="${pageContext.request.contextPath}/authMenuAction/delete"
							method="post">
							<c:forEach var="roleRecord" items="${rolePage.recordList}"
								varStatus="status">
								<tr id="listDataTr_${roleRecord.roleId}">
									<td><input type="checkbox" name="roleCheckbox"
										value="${roleRecord.roleId}" roleName="${roleRecord.roleName}"></td>
									<td>${status.index + 1}</td>
									<td>${roleRecord.roleId}</td>
									<td>${roleRecord.roleName}</td>
								</tr>
							</c:forEach>
						</form>
					</c:when>
					<c:otherwise>
						<tr>
							<td colspan="2">暂无数据</td>
						</tr>
					</c:otherwise>
				</c:choose>
			</tbody>
		</table>
		<div class="modal-footer">
			<button class="btn btn-primary" type="button"
				onclick="addPrivilege();">
				<strong>添 加</strong>
			</button>
		</div>
	</div>
</div>

<script>
function deletePrivilegeData(code){
	confirmDialog("删除菜单权限","确认删除该菜单权限吗？",function(){
		$.ajax({
        		url : "${pageContext.request.contextPath}/authPrivilegeAction/deletePrivilegeData",
        		type : 'POST',
        		data : {
        			code : code,
        			menuCode : $("#privilegeMenuCode").val()
        		},
        		error : function() {
        			alertError();
        		},
        		success : function(data) {
        			var returnVal = jQuery.parseJSON(data);
        			if(returnVal.success == true){
        				$("#listDataTr_"+code).remove();
        				var tblObj = $("#privilegeTbd");
        				if(tblObj.find("tr").length == 0 ){
        					tblObj.append($("<tr id='noData'><td colspan='6'>暂无数据</td></tr>"));     					
       					}
        			}
        			else{
        				alertError("删除权限异常",returnVal.msg);	
        			}
        		}
		});
	},function(){
		
	});
}


function addPrivilege(){
	var selectRoleId  = new Array();
	selectRoleId.push($("#privilegeMenuCode").val());
	$("input[name='roleCheckbox']").each(function(index,obj){
		var thisObj  = $(obj);
		if(thisObj.prop("checked")){
			selectRoleId.push(thisObj.val());
		}
	});
	console.log(JSON.stringify(selectRoleId));
	if( selectRoleId.length == 1 ){
		alertError("添加授权错误","请选择要添加的角色");
		return;
	}
	
	 $.ajax({
		url : "${pageContext.request.contextPath}/authPrivilegeAction/addPrivilegeByAjax",
		type : 'POST',
		dataType:"json",
		data : JSON.stringify(selectRoleId),
		contentType:"application/json",
		error : function() {
			alertError();
		},
		success : function(data) {
			if(data.length>0){
				$("#noData").remove();
				var talObj = $("#privilegeTbd");
				for (var i = 0; i < data.length; i++) {
					var privilegeObj = data[i];
					var trObj = $("<tr id='listDataTr_"+privilegeObj.code+"'><td><input type='checkbox' value='"+privilegeObj.code+"'></td><td>"+privilegeObj.menuName+"</td><td>"+privilegeObj.groupType+"</td><td>"+privilegeObj.groupCode+"</td><td>"+privilegeObj.groupName+"</td><td class='text-center'><a href='#' type='button' onclick='deletePrivilegeData("+privilegeObj.code+")' class='btn btn-danger btn-xs'><i class='fa fa-trash-o'></i></a></td></tr>");
					talObj.append(trObj);
				}
			}
		}
	});
}
</script>