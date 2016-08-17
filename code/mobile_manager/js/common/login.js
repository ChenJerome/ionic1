$(function(){
	var validator = $("#loginForm").validate({
		debug: true,
//		errorLabelContainer : "#showErrorMsg",
		rules : {
			loginName : {
				required : true,
				minlength : 3,
				maxlength : 25
			},
			pwd : {
				required : true,
				minlength : 6,
				maxlength : 25
			}
		},
		messages : {
			loginName : {
				required : "请输入您的用户名.",
				minlength : "用户名必须3个字符以上.",
				maxlength : "用户名不能大于25个字符."
			},
			pwd : {
				required : "请输入您的密码.",
				minlength : "密码必须6个字符以上.",
				maxlength : "密码不能大于25个字符."
			}
		},
		submitHandler : function(form) {
			form.submit();
//			$.ajax({
//				type : "POST",
//				url : "login.gsp",
//				data : $(form).serialize(),
//				success : function(responseText) {
//					var result = jQuery.parseJSON(responseText);
//					if (result.success) {
//						window.location.href = 'index.gsp';
//					} else {
//						$("#showErrorMsg")
//								.html('<label class="error" style="display: inline-block;">'
//										+ result.msg + '</label>');
//						$("#showErrorMsg").show();
//						// 是否显示验证码
//						if (result.showCaptchaCode || showCaptchaCode) {
//							$("#captchaCodeDiv").show();
//						} else {
//							$("#captchaCodeDiv").hide();
//						}
//					}
//				}
//			});
		}
	});
	
	$("#resetBtn").click(function() {
		validator.resetForm(); 
	});
});