package com.purvar.bpm.mobile.tools.form;


import java.util.ArrayList;
import java.util.List;

public class MBizObject {
	private List<MField> fieldList = new ArrayList<MField>();

	private String objName = "";
	
	
	
	public String getObjName() {
		return objName;
	}

	public void setObjName(String objName) {
		this.objName = objName;
	}

	public List<MField> getFieldList() {
		return fieldList;
	}

	public void setFieldList(List<MField> fieldList) {
		this.fieldList = fieldList;
	}
	
}
