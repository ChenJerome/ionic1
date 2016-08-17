<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/jquery.validate.min.js"></script>
<script src="${pageContext.request.contextPath}/js/webuploader-0.1.5/webuploader.js"></script>
<script src="${pageContext.request.contextPath}/js/common/fileUpload.js"></script>
<script type="text/javascript">
    /*<![CDATA[*/
    var accept = {};
    $(function() {
	    var fileUploadUrl = 'upload';
    	var singUploader = createFileUpload($('#myFile'), fileUploadUrl, false, 'fileInputIdName', accept);
    	
    	/* singUploader.on('uploadBeforeSend', function(block, data) {
            data.title = title;
            data.description = description;
        }); */
    	
        singUploader.on('uploadSuccess', function(file) {
            alertSuccess();
            $('#commonWin').modal('hide');
        });
    	
    	$('#addForm').validate({
            rules : {
            },
            messages : {

            },
            submitHandler : function(f) {
            	singUploader.upload();
            }
        });
	});
    /*]]>*/
</script>
<form id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">批量导入数据</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<div class="form-group" id="myFile">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="loginName">*</label> 文件名： </label>
					<div class="col-xs-3">
						<div class="row">
							<div class="thelist uploader-list"></div>
						</div>
						<div class="btn picker">选择文件</div>
					</div>
					<label class="col-xs-2 control-label"></label>
					<div class="col-xs-3">
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