function createImageUploader(container, fileUploadUrl, isMulti, filedName) {
	//定义变量
	var $ = jQuery;
	var $list = container.find('.thelist'); //列表
	var $btn = container.find('.ctlBtn'); //上传按钮
	var state = 'pending';
	var $picker = container.find('.picker'); //选择按钮
	var uploader;

	//优化retina屏
	var ratio = window.devicePixelRatio || 1;
	var thumbnailWidth = 100 * ratio;
	var thumbnailHeight = 100 * ratio;

	var acceptExtensions = 'png,jpg,jpeg,gif,bmp';
	uploader = WebUploader.create({
		//选完文件后，是否自动上传
		auto : true,
		//swf文件路径
		swf : 'js/webuploader-0.1.5/Uploader.swf',
		//文件接收服务端
		server : fileUploadUrl,
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick : container.find('.picker'),
		//上传类型限制，只允许图片文件
		accept : {
			title : 'Images',
			extensions : acceptExtensions,
			mimeTypes : 'image/*'
		}
	});

	uploader.customFileQueued = function(file, custom) {
		if (!isMulti) {
			$list.html("");
		}
		var $li = $('<div style="width:120px;height:140px;" id="'
				+ file.id
				+ '" class="file-item thumbnail col-xs-2">'
				+ '<img>'
				+ '<span class="state pull-left">等待上传</span><a class="pull-right delBtn" style="cursor: pointer;">删除</a>'
				+ '</div>'), $img = $li.find('img');
		$li.append($('<input type="hidden" class="fileNameInput" name="'
				+ filedName + '">'));
		$list.append($li);

		if (custom) {
			$img.attr('src', file.src);
			$('#' + file.id).find('input.fileNameInput').val(file.id);
			$img.width(thumbnailWidth);
			$img.height(thumbnailHeight);
			$('#' + file.id).find('span.state').text(' ')
		} else {
			// 创建缩略图
			uploader.makeThumb(file, function(error, src) {
				if (error) {
					$img.replaceWith('<span>不能预览</span>');
					return;
				}
				$img.attr('src', src).width(110).height(110);
				;
			}, thumbnailWidth, thumbnailHeight);
		}

		$li.find('.delBtn').on('click', function() {
			$li.remove();
		});
	}

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		uploader.customFileQueued(file, false);
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage) {
		var $li = $('#' + file.id);
		$li.find('span.state').text('上传中' + (percentage * 100) + '%');
	});

	uploader.on('uploadSuccess', function(file) {
		$('#' + file.id).find('span.state').text('已上传')
				.addClass('text-success');
	});

	uploader.on('uploadError', function(file) {
		$('#' + file.id).find('span.state').text('上传出错')
				.addClass('text-danger');
		;
	});

	uploader.on('uploadComplete', function(file) {
		// $('#' + file.id).find('.progress').fadeOut();
	});

	uploader.on('uploadAccept',
			function(file, response) {
				if (response.success) {
					$('#' + file.file.id).find('input.fileNameInput').val(
							response.obj);
				} else {
					return false;
				}
			});

	uploader.on('all', function(type) {
		if (type === 'startUpload') {
			state = 'uploading';
		} else if (type === 'stopUpload') {
			state = 'paused';
		} else if (type === 'uploadFinished') {
			state = 'done';
		}

		if (state === 'uploading') {
			$btn.text('暂停上传');
		} else {
			$btn.text('开始上传');
		}
	});
	if (isMulti) {
		$btn.on('click', function() {
			if (state === 'uploading') {
				uploader.stop();
			} else {
				uploader.upload();
			}
		});
	}
	return uploader;
}