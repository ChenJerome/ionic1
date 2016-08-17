$(function(){

});

function selectMenu(id) {
	$("#sidebar-nav>ul a").each(function(){
		var aId = $(this).attr("data-id");
		if (aId && aId == id) {
			$(this).parent().addClass("active");
			if ($(this).parent().parent().attr("class") == 'submenu') {
				$(this).parent().parent().parent().addClass("open");
			}
		}
	});
}

function loadData(url, parms, htmlId) {
	$.ajax({
		url : url,
		type : 'POST',
		data : parms,
		error : function() {
			alertError();
		},
		success : function(data) {
			htmlId.html(data);
		}
	});
}


function toIndex(pageIndex, pageSize) {
//	$("#pageIndex").val(pageIndex);
//	$("#searchForm").submit();
//	queryData(pageIndex);
	commonSearch(pageIndex, pageSize);
}

function commonSearch(pageIndex, pageSize) {
//	$("#searchForm").submit();
	var params = {pageIndex : 1, pageSize : 10};
	if (pageIndex) {
		params.pageIndex = pageIndex;
	}
	if (pageSize) {
		params.pageSize = pageSize;
	}
	var simpleQueryParam = $("#simpleQueryParam").val();
	if (simpleQueryParam) {
		params.simpleQueryParam = simpleQueryParam;
	}
	
	loadData(url, params, $("#data"));
//	queryData();
}

function clearSearch() {
	$("input:not([name=curPage],[name=pageSize])", "#searchForm").val('');
	commonSearch();
}

//简单Ajax Post操作数据
function simpleAjaxPost(url, parms, sucCallbackFun, failCallbackFun) {
	$.ajax({
		url : url,
		type : 'POST',
		data : parms,
		error : function() {
			alertError();
		},
		success : function(data) {
			var result = $.parseJSON(data);
			if (result.success) {
				if (sucCallbackFun) {
					sucCallbackFun(data); // 回调函数
				} else {
					alertSuccess();
				}
			} else {
				if (failCallbackFun) {
					failCallbackFun(data); // 回调函数
				} else {
					alertError('操作失败', result.msg);
				}
			}
		}
	});
}

//表单窗口ajax 提交
function formWinAjaxSubmit(formModalId, formId, rules, messages, sucCallbackFun, failCallbackFun) {
	var formModal = $("#" + formModalId);
	var form = $("#" + formId);
	var callbackFun = function() {
		alertSuccess();
		form[0].reset();
		formModal.modal("hide");
		formModal.removeData("bs.modal");
		if (sucCallbackFun) {
			sucCallbackFun(); // 回调函数
		}
	}
	formAjaxSubmit(formId, rules, messages, callbackFun, failCallbackFun);
}

//基本表单ajax 提交
function formAjaxSubmit(formId, rules, messages, sucCallbackFun, failCallbackFun) {
	var sucCallback = function(responseText, statusText) {
		if (responseText.success) {
			if (sucCallbackFun) {
				sucCallbackFun(); // 回调函数
			} else {
				alertSuccess();
			}
		} else {
			if (failCallbackFun) {
				failCallbackFun(); // 回调函数
			} else {
				alertError('操作失败', responseText.msg);
			}
		}
	}
	var options = {
		success : sucCallback, // 提交后的回调函数
		dataType : 'json', // 接受服务端返回的类型
		clearForm : true, // 成功提交后，清除所有表单元素的值
		resetForm : true, // 成功提交后，重置所有表单元素的值
		timeout : 5000
	}
	var form = $("#" + formId);
	// 表单验证
	var validator = form.validate({
		rules : rules == null ? {} : rules,
		messages : messages == null ? {} : messages,
		// errorPlacement : function(error, element) {
		// error.insertBefore(element.parent());
		// },
		submitHandler : function(f) {
			form.ajaxSubmit(options);
		}
	});
	return false; // 阻止表单默认提交
}

//展开子节点
function openChildNode(parentNode){
	console.log(123123);
}
