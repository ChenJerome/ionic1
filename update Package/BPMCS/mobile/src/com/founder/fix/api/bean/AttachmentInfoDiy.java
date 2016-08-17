package com.founder.fix.api.bean;

import com.founder.fix.apputil.to.steam.AttachmentTO;

public class AttachmentInfoDiy {

	private String fileFullPath;

	private AttachmentTO attachmentTo = new AttachmentTO();

	public String getFileFullPath() {
		return fileFullPath;
	}

	public void setFileFullPath(String fileFullPath) {
		this.fileFullPath = fileFullPath;
	}

	public AttachmentTO getAttachmentTo() {
		return attachmentTo;
	}

	public void setAttachmentTo(AttachmentTO attachmentTo) {
		this.attachmentTo = attachmentTo;
	}

}
