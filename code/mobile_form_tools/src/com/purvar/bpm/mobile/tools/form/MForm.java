package com.purvar.bpm.mobile.tools.form;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MForm {
	private String formKey;
	
	private String funcName;
	
	private MBizObject masterObj = new MBizObject();
	
	private Map<String, MBizObject> relatedObj = new HashMap<String, MBizObject>();
	
	public String getFormKey() {
		return formKey;
	}

	public void setFormKey(String formKey) {
		this.formKey = formKey;
	}
	
	
	public MBizObject getMasterObj() {
		return masterObj;
	}

	public void setMasterObj(MBizObject masterObj) {
		this.masterObj = masterObj;
	}
	
	public Map<String, MBizObject> getRelatedObj() {
		return relatedObj;
	}

	public void setRelatedObj(Map<String, MBizObject> relatedObj) {
		this.relatedObj = relatedObj;
	}
	
	public List<MField> getFieldList(){
		List<MField> fieldList = new ArrayList<MField>();
		
		for(MBizObject bizObject : relatedObj.values()){
			fieldList.addAll(bizObject.getFieldList());
		}
		
		return fieldList;
	}
	
	public String getFuncName() {
		return funcName;
	}

	public void setFuncName(String funcName) {
		this.funcName = funcName;
	}
}
