package com.purvar.bpm.mobile.tools.form;



import java.util.Map;

public class MField {
	private String bizObj;
	
	private String field;
	
	private String fieldName;
	
	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getBizObj() {
		return bizObj;
	}

	public void setBizObj(String bizObj) {
		this.bizObj = bizObj;
	}
	
	
	
	private Map<String, Object> properties;

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public Map<String, Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, Object> properties) {
		this.properties = properties;
	}
}
