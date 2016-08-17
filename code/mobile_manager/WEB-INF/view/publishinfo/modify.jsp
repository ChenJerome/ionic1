<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="code" uri="com.purvar.code"%>
<form action="${pageContext.request.contextPath}/pubilshInfoAction/modify" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">修改App版本</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<input type="text" value="" id="filePath" name="filePath"  style="display:none;">
			<div class="col-xs-12">
				<input type="hidden" id="code" name="code" value="${record.code}"/>
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="editionCode"></label> 版本编号： </label>
					<div class="col-xs-8">
						<input type="text" id="editionCode" name="editionCode"  placeholder="请输入菜单名" type="text" class="form-control "  required="required" value="${record.editionCode}">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="changeLog"></label> 更新日志： </label>
					<div class="col-xs-8">
						<textarea rows="5" name="changeLog" id="changeLog" placeholder="请填写更新日志，以便用户了解App" class="form-control " >${record.changeLog}</textarea>
					</div>
				</div>
				<div class="form-group ">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label" for=isLatest><label class="text-danger"></label> 是否最新版本： </label>
					<div class="col-xs-8">
						<code:select category="YESORNO" selectClass="form-control" name="isLatest" id="isLatest" selectValue="${record.isLatest}"/>
					</div>
				</div>
				<div class="form-group">
					<!-- <div id="uploader" class="wu-example">
					    <div id="thelist" class="uploader-list"></div>
					    <div class="btns">
					        <div id="picker">选择文件</div>
					        <button id="ctlBtn" class="btn btn-default">开始上传</button>
					    </div>
					</div>  -->
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger"></label> </label>
					<div class="col-xs-8">
						<div id="uploader" class="wu-example">
						    <!--用来存放文件信息-->
						    <div id="thelist" class="uploader-list">
						    	<div id="' + file.id + '" class="item">
							        <div style="float:left;">${record.filePath.split("_")[1]}</div>
							        <a style='margin-left:200px;cursor: pointer;' onclick="deleteFile('${record.filePath}')">删除</a>
							    </div>
						    </div>
						    <p class="state"></p>
						    <div class="btns">
						        <div class="btn btn-default" id="filePicker">选择文件</div>
						    </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" type="submit">
			<strong>提 交</strong>
		</button>
		<button type="button" class="btn btn-default" data-dismiss="modal">
			<strong>关 闭</strong>
		</button>
	</div>
</form>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/webuploader-0.1.5/webuploader.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/js/webuploader-0.1.5/webuploader.js" ></script>
<script>
var uploader;
$(function(){
	
	uploader = WebUploader.create({
		swf:"${pageContext.request.contextPath}/js/webuploader-0.1.5/Uploader.swf",
		server:"${pageContext.request.contextPath}/pubilshInfoAction/uploadFile",
		pick:"#filePicker",
		auto:true,
		fileNumLimit:1,
		duplicate:true
	});
	
	//解决webuploader在bootstrap model中选择文件按钮点击无效
	//JeromeChen
 	$("#filePicker .webuploader-pick").click(function(){
        $("#filePicker :file").click();
    });
	
	uploader.on( 'fileQueued', function( file ) {
		$list = $("#thelist");
	    $list.append( '<div id="' + file.id + '" class="item">' +
	        '<div style="float:left;">' + file.name + '</div>' +
	    '</div>' );
	});
	
	uploader.on( 'uploadSuccess', function( file ) {
	    $( '#'+file.id ).find('p.state').text('已上传');
	    console.log("OK");
	});

	uploader.on( 'uploadError', function( file ) {
	    $( '#'+file.id ).find('p.state').text('上传出错，请重试');
	    console.log("Error");
	});
	
	uploader.on( 'uploadAccept', function( file, response ) {
		/* console.log(response); */
		$("#filePath").val(response._raw);
		$("div[id="+file.file.id+"]").append("<a style='margin-left:200px;cursor: pointer;' onclick=deleteFile('"+response._raw+"')>删除</a>");
	});
	
	
	
});

function deleteFile(fileName){
	console.log(fileName);
	$.ajax({
		url : "${pageContext.request.contextPath}/pubilshInfoAction/deleteFile",
		type : 'POST',
		data : {
			fileName : fileName        		
		},
		error : function() {
			alertError();
		},
		success : function(data) {
			//commonSearch();
			var returnVal = jQuery.parseJSON(data);
			console.log(returnVal);
			if(returnVal.success == true){
				$("#thelist").empty();
				uploader.reset();
			}
		}
	});
}

</script>