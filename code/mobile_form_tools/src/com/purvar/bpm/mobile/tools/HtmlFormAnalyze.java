package com.purvar.bpm.mobile.tools;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.AndFilter;
import org.htmlparser.filters.HasAttributeFilter;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.nodes.TagNode;
import org.htmlparser.tags.CompositeTag;
import org.htmlparser.util.NodeList;

import com.google.gson.Gson;
import com.purvar.bpm.mobile.tools.form.MBizObject;
import com.purvar.bpm.mobile.tools.form.MField;
import com.purvar.bpm.mobile.tools.form.MForm;
import com.purvar.bpm.mobile.tools.utils.StringUtil;

public class HtmlFormAnalyze implements FormAnalyze {

	private static final String FIX_CONFIG = "FixConfig";
	private static final String BIZ_OBJ = "bizObj";
	private static Logger logger = Logger.getLogger(HtmlFormAnalyze.class);

	@SuppressWarnings("unchecked")
	public MForm getMForm(String filePath) throws Exception {

		MForm mForm = new MForm();

		Parser parser = new Parser(filePath);

		HasAttributeFilter styleFilter = new HasAttributeFilter("style");

		NodeList styleNodes = parser.extractAllNodesThatMatch(styleFilter);

		Map<String, Map<String, String>> tagAttribsMap = new HashMap<String, Map<String, String>>();

		if (styleNodes != null) {
			for (int i = 0; i < styleNodes.size(); i++) {
				TagNode tagNode = (TagNode) styleNodes.elementAt(i);
				String componentID = tagNode.getAttribute("ComponentID");
				if (StringUtil.isNotEmpty(componentID)) {
					Gson gson = new Gson();
					String attribute = "{" + tagNode.getAttribute("style")
							+ "}";

					try {
						@SuppressWarnings("unchecked")
						Map<String, String> style = gson.fromJson(attribute,Map.class);

						if (style.containsKey("DISPLAY")) {
							tagAttribsMap.put(componentID, style);
						}
					} catch (Exception e) {
						System.out.println("错误的属性：" + attribute);
					}
				}

			}
		}
<<<<<<< .mine

=======
		
		
		parser.reset();
		NodeFilter labelTagFilter = new TagNameFilter("LABEL");
		HasAttributeFilter funcNameFilter = new HasAttributeFilter("ComponentID", "funcName");
//		NodeFilter andFilter = new AndFilter(labelTagFilter, funcNameFilter);
		NodeList nodes = parser.extractAllNodesThatMatch(funcNameFilter);
		if(nodes.size() == 1){
			CompositeTag compositeTag  = (CompositeTag) nodes.elementAt(0);
			String funcName = compositeTag.toPlainTextString();
			if(StringUtil.isNotEmpty(funcName)){
				funcName = funcName.replaceAll("&nbsp;", "");
				logger.debug("找到 funcName"+ funcName);
				mForm.setFuncName(funcName);
			}
		}
		
		
>>>>>>> .r447
		parser.reset();
		// 主业务对象id
		String masterObjId = "";

		HasAttributeFilter fixConfigFilter = new HasAttributeFilter(FIX_CONFIG);
		nodes = parser.extractAllNodesThatMatch(fixConfigFilter);
		logger.debug("解析 masterObj, 找FixConfig属性");
		if (nodes.size() == 1) {
			CompositeTag compositeTag = (CompositeTag) nodes.elementAt(0);
			String content = compositeTag.getAttribute(FIX_CONFIG);
			logger.debug("找到FixConfig属性:" + content);
			Gson gson = new Gson();
			Map<String, Object> configMap = gson.fromJson(content, Map.class);
			masterObjId = StringUtil.getString(configMap.get(BIZ_OBJ));
			if (!"".equals(masterObjId)) {
				logger.debug("找到masterObject: " + masterObjId);
			}
			mForm.getMasterObj().setObjName(masterObjId);

		} else {
			logger.error("未找到FixConfig属性，解析失败");
			return mForm;
		}

		NodeFilter scriptTagFilter = new TagNameFilter("SCRIPT");
		HasAttributeFilter evnetTypeFilter = new HasAttributeFilter(
				"eventType", "config");
		NodeFilter filter = new AndFilter(scriptTagFilter, evnetTypeFilter);
		// 每次用完filger 解析器要reset一下，否则指针会停留在上次解析的位置
		parser.reset();
		nodes = parser.extractAllNodesThatMatch(filter);

		if (nodes != null) {

			String formKey = getFormKey(filePath);

			mForm.setFormKey(formKey);
			Map<String, MBizObject> relatedObj = new HashMap<String, MBizObject>();
			mForm.setRelatedObj(relatedObj);

			for (int i = 0; i < nodes.size(); i++) {
				Node textnode = (Node) nodes.elementAt(i);
				CompositeTag compositeTag = (CompositeTag) nodes.elementAt(i);
				String content = textnode.toPlainTextString();

				Map<String, Object> fieldConfigMap = getFieldConfigMap(content);
				// System.out.println(fieldConfigMap);

				MField mfield = new MField();

				// 如果没有 bizObj属性，则不解析
				if (fieldConfigMap.get(BIZ_OBJ) == null) {
					continue;
				}

				/* 开始解析字段 */
				String bizObjName = StringUtil.getString(fieldConfigMap
						.get(BIZ_OBJ));

				// 未绑定业务对象的字段，可能是附加用来显示的
				if (StringUtil.isEmpty(bizObjName)) {
					bizObjName = "EMPTY_OBJECT";
				}

				/*
				 * 找字段所属业务对象 可能就是主表对象，可能是已经添加的关联对象，可能是第一次找到
				 */
				MBizObject mBizObj = null;
				if (bizObjName.equals(masterObjId)) {
					mBizObj = mForm.getMasterObj();
				} else if (relatedObj.containsKey(bizObjName)) {
					mBizObj = relatedObj.get(bizObjName);
				} else {
					mBizObj = new MBizObject();
					mBizObj.setObjName(bizObjName);
					relatedObj.put(bizObjName, mBizObj);
				}

				mfield.setField(StringUtil.getString(fieldConfigMap
						.get("alias")));
				mfield.setFieldName(StringUtil.getString(fieldConfigMap
						.get("fieldname")));
				mfield.setBizObj(bizObjName);

				Map<String, Object> properties = new HashMap<String, Object>();

				properties.put("datatype",
						StringUtil.getString(fieldConfigMap.get("datatype")));
				properties.put("isPK",
						isNull(fieldConfigMap.get("isPK"), false));

				String forId = compositeTag.getAttribute("forid");
				logger.debug("forID：" + forId);
				if (StringUtil.isNotEmpty(forId)) {
					Map<String, String> style = tagAttribsMap.get(forId);
					if (style != null) {
						properties.put("style", style);
					}
				}

				mfield.setProperties(properties);

				mBizObj.getFieldList().add(mfield);
			}
		}

		// HasAttributeFilter fixEngineMapFilter = new HasAttributeFilter("id",
		// "Fix.Engine.Map");
		// parser.reset();
		// nodes = parser.extractAllNodesThatMatch(fixEngineMapFilter);
		//
		// if (nodes != null) {
		// for (int i = 0; i < nodes.size(); i++) {
		// Node textnode = (Node) nodes.elementAt(i);
		// String content = textnode.toPlainTextString();
		//
		// Map<String, Object> fieldConfigMap = getFieldConfigMap(content);
		//
		// List<Object> children = (List<Object>)
		// fieldConfigMap.get("children");
		// if(children != null){
		// for(Object childBizObj : children){
		// Map<String, Object> childBizPropMap = (Map<String,
		// Object>)childBizObj;
		// String objId1 = StringUtil.getString(childBizPropMap.get(BIZ_OBJ));
		// }
		// }
		// }
		// }

		return mForm;
	}

	private Map<String, Object> getFieldConfigMap(String content) {
		int indexS = content.indexOf("{");
		content = content.substring(indexS, content.length() - 1);
		content = content.replace("\r\n", "");

		Gson gson = new Gson();

		@SuppressWarnings("unchecked")
		Map<String, Object> fieldConfigMap = gson.fromJson(content, Map.class);
		return fieldConfigMap;
	}

	private String getFormKey(String filePath) {
		return filePath.substring(filePath.lastIndexOf("\\") + 1,
				filePath.lastIndexOf("."));
	}

	private Object isNull(Object obj, Object value) {
		if (obj == null || "".equals(obj)) {
			return value;
		} else {
			return obj;
		}
	}

}
