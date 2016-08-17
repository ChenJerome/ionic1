<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/form.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/datetimepicker/css/bootstrap-datetimepicker.min.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/datetimepicker/js/bootstrap-datetimepicker.js" charset="UTF-8"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>
<script type="text/javascript">
	$(function(){
		$(".form_datetime").datetimepicker({
			language:  'zh-CN',
	        format: "yyyy-mm",
	        autoclose: true,
	        todayBtn: true,
	        startView: 3,
	        minView: 3,
	        todayHighlight: true,
	        pickerPosition: "bottom-left"
	    });
		
		var validator = $("#addForm").validate({
			rules : {
				month : {
					required : true
	            }
			},
			messages : {
				month : {
					required : "请选择考勤月份."
				}
			},
			submitHandler : function(form) {
				form.submit();
				$('#commonWin').modal('hide');
			},
			errorClass : "col-md-2 control-label error",
			errorPlacement: function(error, element) {
		     error.appendTo( element.parent().parent().parent());
		   }
		});
	});
</script>
<form action="${pageContext.request.contextPath}/adBasicDataAction/downloadExcel" id="addForm" role="form" class="form-horizontal" method="post">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="modal-title">导出考勤数据</h4>
	</div>
	<div class="modal-body">
		<div class="row" style="max-height: 600px; overflow: scroll-y;">
			<div class="col-xs-12">
				<div class="form-group">
					<div class="col-xs-1 formCtrl"></div>
					<label class="col-xs-2 control-label"><label class="text-danger" for="loginName">*</label> 月份： </label>
					<div class="col-md-3">
						<div class="input-group date form_datetime ">
		                    <input class="form-control" size="16" type="text" name="month" readonly>
		                    <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
							<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
						</div>
	                </div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" type="submit" onclick="formSubmit">
			<strong>导 出</strong>
		</button>
		<button type="button" class="btn btn-default" data-dismiss="modal">
			<strong>关 闭</strong>
		</button>
	</div>
</form>
