// 弹出窗口
toastr.options = {
	closeButton : true,
	debug : false,
	progressBar : true,
	positionClass : 'toast-top-right',
	timeOut : 2000
};

//操作成功
function alertSuccess(title, message) {
	toastr.success(!message ? '恭喜您，操作成功!' : message, !title ? '操作成功' : title);
};
//系统消息
function alertInfo(title, message) {
	toastr.info(!message ? '系统消息' : message, !title ? '系统消息!' : title);
};
// 系统警告
function alertWarning(title, message) {
	toastr.warning(!message ? '系统警告' : message, !title ? '系统警告!' : title);
};
// 系统错误
function alertError(title, message) {
	toastr.error(!message ? '对不起，操作失败!' : message, !title ? '系统错误' : title);
};
//confirmDialog
function confirmDialog(title, message, okCallbackFun, cancelCallbackFun) {
	bootstrapQ.confirm({
		title : !title ? '操作确认' : title,
		msg : !message ? '您确定要执行该操作吗？！' : message,
		okbtn : '确定',
		qubtn : '取消'
	}, okCallbackFun, cancelCallbackFun);
};