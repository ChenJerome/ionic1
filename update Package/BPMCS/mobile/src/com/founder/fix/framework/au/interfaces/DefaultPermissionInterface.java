package com.founder.fix.framework.au.interfaces;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.founder.fix.apputil.AppInfo;
import com.founder.fix.apputil.Const;
import com.founder.fix.apputil.Const.DBConnBeanID;
import com.founder.fix.apputil.Const.PermissionType;
import com.founder.fix.apputil.OnlineUser;
import com.founder.fix.apputil.exception.ExceptionFactory;
import com.founder.fix.apputil.log.LogFactory;
import com.founder.fix.apputil.log.OnlineLog;
import com.founder.fix.apputil.to.ldap.LdapTo;
import com.founder.fix.apputil.to.operation.DeleteOperationTo;
import com.founder.fix.apputil.to.operation.InsertOperationTo;
import com.founder.fix.apputil.to.permission.ObjRelPermissionTo;
import com.founder.fix.apputil.to.permission.PermissionTo;
import com.founder.fix.apputil.to.permission.RoleTo;
import com.founder.fix.apputil.util.CacheUtil;
import com.founder.fix.apputil.util.GuidUtil;
import com.founder.fix.apputil.util.ListUtil;
import com.founder.fix.apputil.util.MD5;
import com.founder.fix.apputil.util.NumberUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.apputil.util.ldap.LdapCore;
import com.founder.fix.dbcore.CommandType;
import com.founder.fix.dbcore.DBGetResult;
import com.founder.fix.dbcore.DataTable;
import com.founder.fix.dbcore.DataTable.DataRow;
import com.founder.fix.dbcore.DataTableUtil;
import com.founder.fix.dbcore.Parm_Struct;
import com.founder.fix.fl.core.LicenseConst;
import com.founder.fix.framework.common.interfaces.DBOperationInterface;
import com.founder.fix.webcore.BaseInterface;
import com.founder.fix.webcore.DataView;
import com.founder.fix.webcore.permission.IPermissionInterface;
import com.founder.fix.webcore.permission.PermissionHander;

public class DefaultPermissionInterface extends BaseInterface implements IPermissionInterface{
	
	/**
	 * 角色权限表的表名
	 */
	public static final String RP_BELONGTYPE= "fix_au_rolepermissionpru";
	
	/**
	 * 用户权限表的表名
	 */
	public static final String UP_BELONGTYPE= "fix_au_userpermissionpru";
	
	public static final String RP_GIVE_BELONGTYPE= "FIX_AU_ROLEPERMISSIONGIVE";
	
	public static final String PERMISSION_LIMIT="FIX_AU_PERMISSIONLIMIT";
	
	private static final OnlineLog log = LogFactory.getOnlineLog(DefaultPermissionInterface.class);
	
	public List<RoleTo> getUserRelRole(String userId) throws Exception{
		List<RoleTo> result = new ArrayList<RoleTo>();
		DBGetResult dbgr = new DBGetResult();
		try{
			dbgr.openConn();
			StringBuffer sb = new StringBuffer();
			List<Parm_Struct> params = new ArrayList<Parm_Struct>();
			Parm_Struct param = new Parm_Struct(userId);
			params.add(param);
			sb.append("select t2.roleid, t2.name from Au_Rolemember t1,au_roleinfo t2 where t1.roleid=t2.roleid and t1.userid=?");
			
			DataTable dt = dbgr.GetDataTable(sb.toString(), CommandType.SQL, params);
			if(DataTableUtil.isNotEmpty(dt)){
				for(DataRow row:dt.Rows){
					RoleTo tmp = new RoleTo();
					tmp.setRoleId(StringUtil.getString(row.Item("ROLEID").Value));
					tmp.setRoleName(StringUtil.getString(row.Item("NAME").Value));
					result.add(tmp);
				}
			}
		}finally{
			dbgr.closeConn();
		}
		return result;
	}
	
	public static void main(String[] args){
		String str = "1$3er";
		String type = str.substring(0,str.indexOf("$"));
		String id	= str.substring(str.indexOf("$")+1);
		System.out.println(type);
		System.out.println(id);
	}
	
	public void assignGivePermission() throws Exception{
		String ids = StringUtil.getString(dataView.get("permissionIds"));
		String roleids = StringUtil.getString(dataView.get("roleIds"));
		String roleId = StringUtil.getString(dataView.get("roleId"));
		String[] idArray = ids.split(",");
		String[] roleidArray = roleids.split(",");
		
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("ROLEID", roleId);
		DBOperationInterface operation = DBOperationInterface.getDBOperationBean();
		DeleteOperationTo delete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), RP_GIVE_BELONGTYPE, map);
		operation.dbDeleteParam(delete);
		if(ListUtil.isNotEmpty(idArray) && !(idArray.length==1&&StringUtil.isEmpty(idArray[0]))){
			for(String tmp:idArray){
				if(StringUtil.isNotEmpty(tmp) && tmp.indexOf("$")!=-1){
					int n = tmp.indexOf("$");
					String type = tmp.substring(0,n);
					String id	= tmp.substring(n+1);
					Map<String,Object> values = new HashMap<String,Object>();
					values.put("AUID", GuidUtil.getRandomGUID(true));
					values.put("roleId", roleId);
					values.put("PERMISSION", id);
					values.put("PERMISSIONTYPE", type);
					InsertOperationTo insert = DBOperationInterface.createInsertOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), RP_GIVE_BELONGTYPE, values);
					operation.dbInsertParam(insert);
				}
			}
			
			List<String> rids = new ArrayList<String>();
			rids.add(roleId);
			
			List<ObjRelPermissionTo> permissions = getAllPermissionGiveInfo(rids,RP_GIVE_BELONGTYPE,"roleId");
			PermissionHander.initSpecialPermissionGive(permissions);
		}else{
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("belongId", roleId);
			params.put("belongType", RP_GIVE_BELONGTYPE);
			PermissionHander.clearSpecialPermissionGive(params);
		}
		
		Map<String,Object> rolemap = new HashMap<String,Object>();
		rolemap.put("OWNERID", roleId);

		DeleteOperationTo roledelete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), PERMISSION_LIMIT, rolemap);
		operation.dbDeleteParam(roledelete);
		if(ListUtil.isNotEmpty(roleidArray) && !(roleidArray.length==1&&StringUtil.isEmpty(roleidArray[0]))){
			for(String tmp:roleidArray){
				if(StringUtil.isNotEmpty(tmp) && tmp.indexOf("$")!=-1){
					int n = tmp.indexOf("$");
					String type = tmp.substring(0,n);
					String id	= tmp.substring(n+1);
					Map<String,Object> values = new HashMap<String,Object>();
					values.put("GUID", GuidUtil.getRandomGUID(true));
					values.put("OWNERID", roleId);
					values.put("OWNERTYPE", "2");
					values.put("TARGETID", id);
					values.put("TARGETTYPE", "2");
					InsertOperationTo insert = DBOperationInterface.createInsertOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), PERMISSION_LIMIT, values);
					operation.dbInsertParam(insert);
				}
			}
		}
	}
	
	private void checkPermission() throws Exception{
		if(!dataView.getUser().isAdmin()){
			Map<String,ObjRelPermissionTo> rels = PermissionHander.getPermissionInterface().getNowUserPermissionGive(dataView.getUser());
			if(ListUtil.isEmpty(rels)){
				throw ExceptionFactory.createCustomerNormalException("当前用户没有赋权权限！无法继续操作！");
			}
		}
	}
	
	public void assignPermission() throws Exception{
		checkPermission();
		String ids = StringUtil.getString(dataView.get("permissionIds"));
		String roleId = StringUtil.getString(dataView.get("roleId"));
		String[] idArray = ids.split(",");
		
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("ROLEID", roleId);
		DBOperationInterface operation = DBOperationInterface.getDBOperationBean();
		DeleteOperationTo delete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), RP_BELONGTYPE, map);
		operation.dbDeleteParam(delete);
		if(ListUtil.isNotEmpty(idArray) && !(idArray.length==1&&StringUtil.isEmpty(idArray[0]))){
			for(String tmp:idArray){
				if(StringUtil.isNotEmpty(tmp) && tmp.indexOf("$")!=-1){
					int n = tmp.indexOf("$");
					String type = tmp.substring(0,n);
					String id	= tmp.substring(n+1);
					Map<String,Object> values = new HashMap<String,Object>();
					values.put("AUID", GuidUtil.getRandomGUID(true));
					values.put("roleId", roleId);
					values.put("PERMISSION", id);
					values.put("PERMISSIONTYPE", type);
					InsertOperationTo insert = DBOperationInterface.createInsertOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), RP_BELONGTYPE, values);
					operation.dbInsertParam(insert);
				}
			}
			
			List<String> rids = new ArrayList<String>();
			rids.add(roleId);
			
			List<ObjRelPermissionTo> permissions = getAllPermissionInfo(rids,RP_BELONGTYPE,"roleId");
			PermissionHander.initSpecialPermission(permissions);
		}else{
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("belongId", roleId);
			params.put("belongType", RP_BELONGTYPE);
			PermissionHander.clearSpecialPermission(params);
		}
	}
	
	public DataTable getRolePermissionTree2View() throws Exception{
		String roleId = dataView.getQueryData().get(0);
		List<PermissionTo> permissions = PermissionHander.getPermissionTree();
		List<String> roleIds = new ArrayList<String>();
		roleIds.add(roleId);
		List<String> fields = new ArrayList<String>();
		fields.add("PERMISSION");
		DataTable dt1 = getSpecialPermissionInfo(RP_BELONGTYPE,fields,"ROLEID",roleIds,null);
		boolean isNotEmpty = DataTableUtil.isNotEmpty(dt1);
		List<PermissionTo> newPermissionList = new ArrayList<PermissionTo>();
		for(PermissionTo to:permissions){
			String id = to.getPermissionId();
			if(isNotEmpty){
				DataRow[] rows = dt1.Rows;

				for(DataRow row:rows){
					Object obj = row.ItemValue("PERMISSION");
					if(id.equals(obj)){
						newPermissionList.add(to);
						break;
					}
				}
			}
		}
		return DataTableUtil.parseObjList2DT(newPermissionList);
	}
	
	private DataTable getRolePermissionTreePru(boolean doProcess) throws Exception{
		String roleId = dataView.getQueryData().get(0);
		List<PermissionTo> permissions = PermissionHander.getPermissionTree();
		List<PermissionTo> result = new ArrayList<PermissionTo>();
		List<String> roleIds = new ArrayList<String>();
		roleIds.add(roleId);
		List<String> fields = new ArrayList<String>();
		fields.add("PERMISSION");
		DataTable dt1 = getSpecialPermissionInfo(RP_BELONGTYPE,fields,"ROLEID",roleIds,null);
		boolean isNotEmpty = DataTableUtil.isNotEmpty(dt1);
		Map<String,ObjRelPermissionTo> rels = this.getNowUserPermissionGive(dataView.getUser());
		for(PermissionTo to:permissions){
			if(doProcess && !dataView.getUser().isAdmin()){
				if(rels.get(to.getPermissionId())==null)
					continue;
			}
			String id = to.getPermissionId();
			if(isNotEmpty){
				DataRow[] rows = dt1.Rows;

				for(DataRow row:rows){
					Object obj = row.ItemValue("PERMISSION");
					if(id.equals(obj)){
						to.setChecked("1");
						break;
					}
				}
			}
			to.setPermissionId(to.getPermissionType().getValue()+"$"+id);
			if(StringUtil.isNotEmpty(to.getParentId())){
				to.setParentId(to.getParentPermissionType().getValue()+"$"+to.getParentId());
			}
			result.add(to);
		}

		
		return DataTableUtil.parseObjList2DT(result);
	}
	
	public DataTable getAllRolePermissionTree() throws Exception{
		return getRolePermissionTreePru(false);
	}
	
	public DataTable getRolePermissionTree() throws Exception{
		return getRolePermissionTreePru(true);
	}
	
	public DataTable getRolePermissionGive() throws Exception{
		String roleId = dataView.getQueryData().get(0);
		List<PermissionTo> permissions = PermissionHander.getPermissionTree();
		List<String> roleIds = new ArrayList<String>();
		roleIds.add(roleId);
		List<String> fields = new ArrayList<String>();
		fields.add("PERMISSION");
		String key = PermissionHander.getPermissionGiveKey(RP_GIVE_BELONGTYPE,roleId);
		Map<String,ObjRelPermissionTo> tmpRolePermissionList = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(key);
		for(PermissionTo to:permissions){
			String id = to.getPermissionId();
			if(tmpRolePermissionList!=null && tmpRolePermissionList.get(to.getPermissionId())!=null){
				to.setChecked("1");
			}

			to.setPermissionId(to.getPermissionType().getValue()+"$"+id);
			if(StringUtil.isNotEmpty(to.getParentId())){
				to.setParentId(to.getParentPermissionType().getValue()+"$"+to.getParentId());
			}
		}

		
		return DataTableUtil.parseObjList2DT(permissions);
	}
	
	/**
	 * 获取指定类型的权限数据
	 * @param onlineUser
	 * @param permissionType
	 * @return
	 * @throws Exception
	 */
	private Map<String,ObjRelPermissionTo> getPermission(OnlineUser onlineUser,PermissionType permissionType) throws Exception{
		Map<String,ObjRelPermissionTo> result = new HashMap<String,ObjRelPermissionTo>();
		String roleIDs = (String) onlineUser.getItem("roleIDs");
		if(StringUtil.isNotEmpty(roleIDs)){
			String[] roleids = roleIDs.split(",");
			for(String roleId:roleids){
				String key = PermissionHander.getPermissionKey(RP_BELONGTYPE,roleId,permissionType);
				Map<String,ObjRelPermissionTo> tmpRolePermissionList = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(key);
				if(tmpRolePermissionList!=null){
					result.putAll(tmpRolePermissionList);
				}
			}
		}
		String userKey = PermissionHander.getPermissionKey(UP_BELONGTYPE,onlineUser.getUserID(),permissionType);
		Map<String,ObjRelPermissionTo> tmpRolePermissionList = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(userKey);
		if(tmpRolePermissionList!=null){
			result.putAll(tmpRolePermissionList);
		}

		return result;
	}
	
	private Map<String,ObjRelPermissionTo> getPermissionGive(OnlineUser onlineUser) throws Exception{
		Map<String,ObjRelPermissionTo> result = new HashMap<String,ObjRelPermissionTo>();
		String roleIDs = (String) onlineUser.getItem("roleIDs");
		if(StringUtil.isNotEmpty(roleIDs)){
			String[] roleids = roleIDs.split(",");
			for(String roleId:roleids){
				String key = PermissionHander.getPermissionGiveKey(RP_GIVE_BELONGTYPE,roleId);
				Map<String,ObjRelPermissionTo> tmpRolePermissionList = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(key);
				if(tmpRolePermissionList!=null){
					result.putAll(tmpRolePermissionList);
				}
			}
		}
//		String userKey = PermissionHander.getPermissionKey(UP_BELONGTYPE,onlineUser.getUserID(),permissionType);
//		Map<String,ObjRelPermissionTo> tmpRolePermissionList = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(userKey);
//		if(tmpRolePermissionList!=null){
//			result.putAll(tmpRolePermissionList);
//		}

		return result;
	}
	
	/**
	 * @param roleId
	 * @return
	 */
	public static String getRoleServicePrx(String roleId){
		return Const.CacheKeyPrefix.ROLE_SERVICE+roleId;
	}
	
	/**
	 * 获取一个角色所拥有的服务列表
	 * @param roleId
	 * @return
	 */
	public List<String> getRoleService(String roleId){
		String cacheKey = getRoleServicePrx(roleId);
		List<String> result = (List<String>)CacheUtil.getCacheData(cacheKey);
		if(result==null){
			Set<String> uniqueServices = new HashSet<String>();
			Map<String,ObjRelPermissionTo> userPermissions  = new HashMap<String,ObjRelPermissionTo>();
			Map<String,List<String>> p2s = PermissionHander.getAllPermission2Service();
			String cacheKey2 = PermissionHander.getPermissionKey(RP_BELONGTYPE,roleId,PermissionType.menuPermission);
			Map<String,ObjRelPermissionTo> tmpUserPermissionList1 = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(cacheKey2);
			if(tmpUserPermissionList1!=null){
				userPermissions.putAll(tmpUserPermissionList1);
			}
			
			String cacheKey3 = PermissionHander.getPermissionKey(UP_BELONGTYPE,roleId,PermissionType.viewPermission);
			Map<String,ObjRelPermissionTo> tmpUserPermissionList2 = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(cacheKey3);
			if(tmpUserPermissionList2!=null){
				userPermissions.putAll(tmpUserPermissionList2);
			}
			
			for(String key:userPermissions.keySet()){
				List<String> services = p2s.get(key);
				if(services!=null){
					uniqueServices.addAll(services);
				}
			}
			result = new ArrayList<String>(uniqueServices);
			CacheUtil.putCacheData(cacheKey, result);
		}
		return result;
	}
	
	/**
	 * @param userId
	 * @return
	 */
	public static String getUserServicePrx(String userId){
		return Const.CacheKeyPrefix.USER_SERVICE+userId;
	}
	
	/**
	 * 获取一个用户的服务列表
	 * @param userId
	 * @return
	 */
	public List<String> getUserService(String userId){
		String cacheKey = getRoleServicePrx(userId);
		List<String> result = (List<String>)CacheUtil.getCacheData(cacheKey);
		if(result==null){
			Set<String> uniqueServices = new HashSet<String>();
			Map<String,ObjRelPermissionTo> rolePermissions  = new HashMap<String,ObjRelPermissionTo>();
			Map<String,List<String>> p2s = PermissionHander.getAllPermission2Service();
			String cacheKey2 = PermissionHander.getPermissionKey(UP_BELONGTYPE,userId,PermissionType.menuPermission);
			Map<String,ObjRelPermissionTo> tmpRolePermissionList1 = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(cacheKey2);
			if(tmpRolePermissionList1!=null){
				rolePermissions.putAll(tmpRolePermissionList1);
			}
			
			String cacheKey3 = PermissionHander.getPermissionKey(UP_BELONGTYPE,userId,PermissionType.viewPermission);
			Map<String,ObjRelPermissionTo> tmpRolePermissionList2 = (Map<String,ObjRelPermissionTo>)CacheUtil.getCacheData(cacheKey3);
			if(tmpRolePermissionList2!=null){
				rolePermissions.putAll(tmpRolePermissionList2);
			}
			
			for(String key:rolePermissions.keySet()){
				List<String> services = p2s.get(key);
				if(services!=null){
					uniqueServices.addAll(services);
				}
			}
			result = new ArrayList<String>(uniqueServices);
			CacheUtil.putCacheData(cacheKey, result);
		}
		return result;
	}
	
	/* (non-Javadoc)
	 * @see com.founder.fix.webcore.permission.IPermissionInterface#getNowRowUserService(com.founder.fix.apputil.OnlineUser)
	 */
	public Set<String> getNowRowUserService(OnlineUser onlineUser)throws Exception{
		Set<String> result = new HashSet<String>();
		String roleIDs = (String) onlineUser.getItem("roleIDs");
		if(StringUtil.isNotEmpty(roleIDs)){
			String[] roleid = roleIDs.split(",");
			List<String> roleids = Arrays.asList(roleid);
			for(String tmp:roleids){
				result.addAll(getRoleService(tmp));
			}
		}
		
		result.addAll(getUserService(onlineUser.getUserID()));
		
		return result;
	}
	
	public Map<String,ObjRelPermissionTo> getNowUserPermissionGive(OnlineUser onlineUser) throws Exception{
		Map<String,ObjRelPermissionTo> result = getPermissionGive(onlineUser);
		if(result==null){
			List<ObjRelPermissionTo> relList = new ArrayList<ObjRelPermissionTo>();
			String roleIDs = (String) onlineUser.getItem("roleIDs");
			if(StringUtil.isNotEmpty(roleIDs)){
				String[] roleid = roleIDs.split(",");
				List<String> roleids = Arrays.asList(roleid);
				DataTable dt1 = getSpecialPermissionInfo(RP_GIVE_BELONGTYPE,null,"ROLEID",roleids,null);
				List<ObjRelPermissionTo> rolePermissions = getRolePermissionInfo(dt1);
				relList.addAll(rolePermissions);
			}
		}
		return result;
	}

	/* (non-Javadoc)
	 * @see com.founder.fix.webcore.permission.IPermissionInterface#getNowUserTreePermission(com.founder.fix.apputil.OnlineUser)
	 */
	public Map<String,ObjRelPermissionTo> getNowUserTreePermission(OnlineUser onlineUser) throws Exception{
		Map<String,ObjRelPermissionTo> result = getPermission(onlineUser,PermissionType.menuPermission);
		if(result==null){
			Map<String,String> appenWhere = new HashMap<String,String>();
			appenWhere.put("PERMISSIONTYPE", "1");
			List<ObjRelPermissionTo> relList = new ArrayList<ObjRelPermissionTo>();
			String roleIDs = (String) onlineUser.getItem("roleIDs");
			if(StringUtil.isNotEmpty(roleIDs)){
				String[] roleid = roleIDs.split(",");
				List<String> roleids = Arrays.asList(roleid);
				DataTable dt1 = getSpecialPermissionInfo(RP_BELONGTYPE,null,"ROLEID",roleids,appenWhere);
				List<ObjRelPermissionTo> rolePermissions = getRolePermissionInfo(dt1);
				relList.addAll(rolePermissions);
			}
			List<String> userid = new ArrayList<String>();
			userid.add(onlineUser.getUserID());
			DataTable dt2 = getSpecialPermissionInfo(UP_BELONGTYPE,null,"USERID",userid,appenWhere);
			List<ObjRelPermissionTo> rolePermissions = getUserPermissionInfo(dt2);
			relList.addAll(rolePermissions);
			result = PermissionHander.initSpecialPermission(relList);
		}
		return result;
	}
	
	public void deleteRole() throws Exception{
		DeleteOperationTo deleteTo = (DeleteOperationTo)dataView.get(DataView.RESOURCE_OPERATION);
		DBOperationInterface dboperation = DBOperationInterface.getDBOperationBean();
		dboperation.dbDeleteParam(deleteTo);
		DeleteOperationTo roleMemberDelete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), "AU_ROLEMEMBER", deleteTo.getFieldValues());
		dboperation.dbDeleteParam(roleMemberDelete);
		DeleteOperationTo rolecDelete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), "FIX_AU_ROLECOLUMNPRU", deleteTo.getFieldValues());
		DeleteOperationTo rolepDelete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), "FIX_AU_ROLEPERMISSIONPRU", deleteTo.getFieldValues());
		DeleteOperationTo roledDelete = DBOperationInterface.createDeleteOperationTo(DBConnBeanID.DB_FIX_BIZ_BASE.toString(), "FIX_AU_ROLEDATAPRU", deleteTo.getFieldValues());
		dboperation.dbDeleteParam(rolecDelete);
		dboperation.dbDeleteParam(rolepDelete);
		dboperation.dbDeleteParam(roledDelete);
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("belongId", deleteTo.getFieldValues().get("ROLEID").getValue());
		params.put("belongType", RP_BELONGTYPE);
		PermissionHander.clearSpecialPermission(params);
		PermissionHander.clearSpecialDataSubset(params);
		PermissionHander.clearSpecialDataSensitive(params);
	}
	
	/* (non-Javadoc)
	 * @see com.founder.fix.webcore.permission.IPermissionInterface#getNowUserViewPermission(com.founder.fix.apputil.OnlineUser)
	 */
	public Map<String,ObjRelPermissionTo> getNowUserViewPermission(OnlineUser onlineUser) throws Exception{
		Map<String,ObjRelPermissionTo> result = getPermission(onlineUser,PermissionType.viewPermission);
		if(result==null){
			Map<String,String> appenWhere = new HashMap<String,String>();
			appenWhere.put("PERMISSIONTYPE", "2");
			List<ObjRelPermissionTo> relList = new ArrayList<ObjRelPermissionTo>();
			String roleIDs = (String) onlineUser.getItem("roleIDs");
			if(StringUtil.isNotEmpty(roleIDs)){
				String[] roleid = roleIDs.split(",");
				List<String> roleids = Arrays.asList(roleid);
				DataTable dt1 = getSpecialPermissionInfo(RP_BELONGTYPE,null,"ROLEID",roleids,appenWhere);
				List<ObjRelPermissionTo> rolePermissions = getRolePermissionInfo(dt1);
				relList.addAll(rolePermissions);
			}
			List<String> userid = new ArrayList<String>();
			userid.add(onlineUser.getUserID());
			DataTable dt2 = getSpecialPermissionInfo(UP_BELONGTYPE,null,"USERID",userid,appenWhere);
			List<ObjRelPermissionTo> rolePermissions = getUserPermissionInfo(dt2);
			relList.addAll(rolePermissions);
			result = PermissionHander.initSpecialPermission(relList);
		}
		return result;
	}
	
	private static DataRow getLDAPldapUserInfo(String userName,String password,String ssoId) throws Exception{
		DataRow result = null;
		if(ssoId!=null){
			result =  getDBUserInfo(null,null,ssoId);
		}else{
			LdapTo ldap = new LdapTo();
			ldap.setUserName(userName);
			ldap.setPassword(password);
			ldap.setLdapUrl(AppInfo.getLdapInfo().getLdapUrl());
			ldap.setSecurity(AppInfo.getLdapInfo().getSecurity());
			ldap.setBase(AppInfo.getLdapInfo().getBase());
			
			boolean res = LdapCore.connect(ldap);
			
			if(res){
				DBGetResult dbgr = new DBGetResult();
				dbgr.openConn();
				try{
					//密码加密处理
					String sql = "select t1.*, t2.ORGID, t2.ORGNAME, t2.GUID from AU_USERINFO t1 left join (select t2.userid,t2.guid,t3.* from AU_ORGMEMBER t2, AU_ORGINFO t3 where t2.orgid=t3.orgid and t2.ISPRIDUTY = 1) t2 on t1.userid=t2.userid where (Lower(LOGINID) = ? or Lower(t1.userid) = ?) and ISENABLE = '1'";
					List params = new ArrayList();
					Parm_Struct ps1 = new Parm_Struct(userName.toLowerCase());
					Parm_Struct ps2 = new Parm_Struct(userName.toLowerCase());
					params.add(ps1);
					params.add(ps2);
					DataTable dt = dbgr.GetDataTable(sql, CommandType.SQL, params);
					if (dt.Rows.length == 0) 
					{
						Map<String,Object> obj = new HashMap<String,Object>();
						obj.put("LOGINID", userName);
						obj.put("USERID", userName);
						obj.put("USERNAME", userName);
						obj.put("PASSWORD", MD5.getMD5(password.getBytes()));
						DBOperationInterface.getDBOperationBean().dbInsertOperation(Const.DBConnBeanID.DB_FIX_BIZ_BASE.toString() , "AU_USERINFO", obj);
						
						dt = dbgr.GetDataTable(sql, CommandType.SQL, params);
						
					}
					
					DataTable.DataRow sqldr = dt.Rows[0];
					result = sqldr;
					
					
				}finally{
					dbgr.closeConn();
				}
			}
		}
		return result;
	}
	
	private static DataRow getDBUserInfo(String userName,String password,String ssoId) throws Exception{
		DBGetResult dbgr = new DBGetResult();
		dbgr.openConn();
		DataRow result = null;
		try{

			
			String sql = null;
			List params = new ArrayList();
			if(StringUtil.isNotEmpty(ssoId)){
				//密码加密处理
				sql = "select t1.*, t2.ORGID, t2.ORGNAME, t2.GUID from AU_USERINFO t1 left join (select t2.userid,t2.guid,t3.* from AU_ORGMEMBER t2, AU_ORGINFO t3 where t2.orgid=t3.orgid and t2.ISPRIDUTY = 1) t2 on t1.userid=t2.userid where Lower(SSOID) = ? and ISENABLE = '1'";
				Parm_Struct ps1 = new Parm_Struct(ssoId);
				params.add(ps1);
			}else{
				password = MD5.getMD5(password.getBytes());
				//密码加密处理
				sql = "select t1.*, t2.ORGID, t2.ORGNAME, t2.GUID from AU_USERINFO t1 left join (select t2.userid,t2.guid,t3.* from AU_ORGMEMBER t2, AU_ORGINFO t3 where t2.orgid=t3.orgid and t2.ISPRIDUTY = 1) t2 on t1.userid=t2.userid where (Lower(LOGINID) = ? or Lower(t1.userid) = ?) and ISENABLE = '1'";
				Parm_Struct ps1 = new Parm_Struct(userName.toLowerCase());
				Parm_Struct ps2 = new Parm_Struct(userName.toLowerCase());
				params.add(ps1);
				params.add(ps2);
			}
			

			DataTable dt = dbgr.GetDataTable(sql, CommandType.SQL, params);
			
			if (dt.Rows.length > 0) 
			{
				DataTable.DataRow sqldr = dt.Rows[0];
				String ObjPwd = sqldr.Item("password").ToString();

                if ((StringUtil.isNotEmpty(ssoId) && StringUtil.isEmpty(userName) && StringUtil.isEmpty(password)) ||
                		(ObjPwd.toString().equals("")&&password.equals("")) || 
                		(!ObjPwd.toString().equals("") && password.equals(ObjPwd) && !password.equals(""))
                	){
                	result = sqldr;
                }
			}
		}finally{
			dbgr.closeConn();
		}
		
		return result;
	}

	public boolean login(String loginName, String password,boolean saveInfo ,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
//		String SessionID = session.getId();

		OnlineUser user = (OnlineUser)session.getAttribute(Const.NOW_ONLINE_USER);
		if (user == null)
			return false;
		user.Clear();

		boolean isUser = false;

		DBGetResult dbgr = new DBGetResult();
		dbgr.openConn();

		try 
		{
			DataTable.DataRow sqldr = null;
			if(AppInfo.isEnableLDAPVerify()){
				sqldr = getLDAPldapUserInfo(loginName,password,null);
			}else{
				sqldr = getDBUserInfo(loginName,password,null);
			}

            if (sqldr!=null)
            {
				
				user.setLoginId(sqldr.Item("LOGINID").ToString());
				user.setUserID(sqldr.Item("USERID").ToString());
				user.setUserName(sqldr.Item("USERNAME").ToString());
				user.setTel(sqldr.Item("TELEPHONE").ToString());
				user.setMobil(sqldr.Item("MOBILEPHONE").ToString());
				user.setFax(sqldr.Item("FAX").ToString());
				user.setEmail(sqldr.Item("EMAIL").ToString());
				user.setTitle(sqldr.Item("TITLEOFPOST").ToString());
				user.setSsoValueId(sqldr.Item("SSOID").ToString());
				
				user.setItem("jobId", sqldr.Item("JOBID").ToString());
				user.setItem("isAdmin", sqldr.Item("ISADMIN").ToString());
				user.setItem("workedTime", sqldr.Item("WORKED_TIME").ToString());
				user.setItem("isEnable", sqldr.Item("ISENABLE").ToString());
				user.setItem("memoMEMO", sqldr.Item("MEMO").ToString());
				user.setItem("confPassword", sqldr.Item("CONF_PASSWORD").ToString());
				
				user.setLoginIp(request.getRemoteAddr());
				String orgId = sqldr.Item("ORGID").ToString();
				user.setOrgId((orgId != null) ? orgId : "");
				user.setItem("orgName", sqldr.Item("ORGNAME").ToString());
				String guid = sqldr.Item("GUID").ToString();
				
				//取角色
				
				String sql2 = "select rm.roleid, r.name from au_rolemember rm, au_roleinfo r where rm.userid=? and rm.roleid=r.roleid";
				Parm_Struct psUserName = new Parm_Struct(sqldr.Item("userid").ToString());
				List<Parm_Struct> params1 = new ArrayList();
				params1.add(psUserName);
				DataTable dt2 = dbgr.GetDataTable(sql2, CommandType.SQL, params1);
				String roleIDs = "";
				String roleNames = "";
				for ( int i = 0; i < dt2.Rows.length; i++ )
				{
					roleIDs += dt2.Rows[i].Items[0].ToString();
					roleNames += dt2.Rows[i].Items[1].ToString();
					if ( i < dt2.Rows.length-1 ) {
						roleIDs += ",";
						roleNames += ",";
					}
				}
				user.setItem("roleIDs", roleIDs);
				user.setItem("RoleNames", roleNames);
				
				user.Login(request,response,null);
				
				

				log.info("用户登录成功");
				isUser = true;
				
				Cookie userinfo = null;
				String UserCodeStr = sqldr.Item("loginid").ToString();
				UserCodeStr = URLEncoder.encode(UserCodeStr,Const.PAGEENCODING);
				if(saveInfo)
				{
					userinfo = new Cookie( "login_"+LicenseConst.PRODUCTKEY.replaceAll(" ", ""), UserCodeStr );
				}
				else
				{
					userinfo = new Cookie( "login_"+LicenseConst.PRODUCTKEY.replaceAll(" ", ""), "" );
				}
				userinfo.setMaxAge(9999999);
				response.addCookie(userinfo);
            }
            else
            {
            	log.info("用户登录失败");
                isUser = false;                 
            }

		} 
		finally 
		{
			dbgr.closeConn();
		}

		return isUser;
	}

	public boolean ssoLogin(String ssoId, String ssoValueId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
//		String SessionID = session.getId();
		boolean isUser = false;
		OnlineUser user = (OnlineUser)session.getAttribute(Const.NOW_ONLINE_USER);
		DBGetResult dbgr = new DBGetResult();
		dbgr.openConn();
		if(user==null){
			user = new OnlineUser(session);
		}
		try 
		{
			DataTable.DataRow sqldr = null;
			if(AppInfo.isEnableLDAPVerify()){
				sqldr = getLDAPldapUserInfo(null,null,ssoValueId);
			}else{
				sqldr = getDBUserInfo(null,null,ssoValueId);
			}

            if (sqldr!=null)
            {
					
				user.setLoginId(sqldr.Item("LOGINID").ToString());
				user.setUserID(sqldr.Item("USERID").ToString());
				user.setUserName(sqldr.Item("USERNAME").ToString());
				user.setTel(sqldr.Item("TELEPHONE").ToString());
				user.setMobil(sqldr.Item("MOBILEPHONE").ToString());
				user.setFax(sqldr.Item("FAX").ToString());
				user.setEmail(sqldr.Item("EMAIL").ToString());
				user.setTitle(sqldr.Item("TITLEOFPOST").ToString());
				user.setSsoValueId(sqldr.Item("SSOID").ToString());
				
				user.setItem("jobId", sqldr.Item("JOBID").ToString());
				user.setItem("isAdmin", sqldr.Item("ISADMIN").ToString());
				user.setItem("workedTime", sqldr.Item("WORKED_TIME").ToString());
				user.setItem("isEnable", sqldr.Item("ISENABLE").ToString());
				user.setItem("memoMEMO", sqldr.Item("MEMO").ToString());
				user.setItem("confPassword", sqldr.Item("CONF_PASSWORD").ToString());
				
				user.setLoginIp(request.getRemoteAddr());
				String orgId = sqldr.Item("ORGID").ToString();
				user.setOrgId((orgId != null) ? orgId : "");
				user.setItem("orgName", sqldr.Item("ORGNAME").ToString());
				String guid = sqldr.Item("GUID").ToString();

					//取角色
					String sql2 = "select rm.roleid, r.name from au_rolemember rm, au_roleinfo r where rm.userid=? and rm.roleid=r.roleid";
					Parm_Struct psUserName = new Parm_Struct(sqldr.Item("userid").ToString());
					List<Parm_Struct> params1 = new ArrayList();
					params1.add(psUserName);
					DataTable dt2 = dbgr.GetDataTable(sql2, CommandType.SQL, params1);
					String roleIDs = "";
					String roleNames = "";
					for ( int i = 0; i < dt2.Rows.length; i++ )
					{
						roleIDs += dt2.Rows[i].Items[0].ToString();
						roleNames += dt2.Rows[i].Items[1].ToString();
						if ( i < dt2.Rows.length-1 ) {
							roleIDs += ",";
							roleNames += ",";
						}
					}
					user.setItem("roleIDs", roleIDs);
					user.setItem("RoleNames", roleNames);

					user.Login(request,response,ssoId);
					isUser=true;
					log.info("用户登录成功");
					
					Cookie userinfo = null;
					String UserCodeStr = sqldr.Item("loginid").ToString();
					UserCodeStr = URLEncoder.encode(UserCodeStr,Const.PAGEENCODING);

					userinfo = new Cookie( "login_"+LicenseConst.PRODUCTKEY.replaceAll(" ", ""), UserCodeStr );

					userinfo.setMaxAge(9999999);
					response.addCookie(userinfo);
					//不在登录的时候做此事了。 建议用户手工操作，在外出设置的界面加返回的按钮
					//sql = "update sys_user set isEnable=1 where UserID = '"
					//		+ username + "'";
					//dbgr.execSQLCmd(sql);

			} else {
				log.info("用户登录失败");
				isUser=false;
			}
		} 
		finally 
		{
			dbgr.closeConn();
		}
		
		return isUser;
	}
	
	public List<ObjRelPermissionTo> getAllPermissionInfo(List<String> belongIds ,String belongType,String belongCol) throws Exception{
		List<ObjRelPermissionTo> result = new ArrayList<ObjRelPermissionTo>();
		DataTable dt1 = null;
		
		if(ListUtil.isNotEmpty(belongIds) && StringUtil.isNotEmpty(belongType) && StringUtil.isNotEmpty(belongCol)){
			dt1 = getSpecialPermissionInfo(belongType,null,belongCol,belongIds,null);
		}else{
			dt1 = getSpecialPermissionInfo(RP_BELONGTYPE,null,null,null,null);
		}
		
		result.addAll(getRolePermissionInfo(dt1));
//		DataTable dt2 = getSpecialPermissionInfo(UP_BELONGTYPE,null,null,null,null);
//		result.addAll(getUserPermissionInfo(dt2));
		
		return result;
	}
	
	public List<ObjRelPermissionTo> getAllPermissionGiveInfo(List<String> belongIds ,String belongType,String belongCol) throws Exception{
		List<ObjRelPermissionTo> result = new ArrayList<ObjRelPermissionTo>();
		DataTable dt1 = null;
		
		if(ListUtil.isNotEmpty(belongIds) && StringUtil.isNotEmpty(belongType) && StringUtil.isNotEmpty(belongCol)){
			dt1 = getSpecialPermissionInfo(belongType,null,belongCol,belongIds,null);
		}else{
			dt1 = getSpecialPermissionInfo(RP_GIVE_BELONGTYPE,null,null,null,null);
		}
		
		result.addAll(getPermissionInfo(dt1,"ROLEID",RP_GIVE_BELONGTYPE));
//		DataTable dt2 = getSpecialPermissionInfo(UP_BELONGTYPE,null,null,null,null);
//		result.addAll(getUserPermissionInfo(dt2));
		
		return result;
	}

	
	protected List<ObjRelPermissionTo> getRolePermissionInfo(DataTable dt){
		return getPermissionInfo(dt,"ROLEID",RP_BELONGTYPE);
	}
	
	protected List<ObjRelPermissionTo> getUserPermissionInfo(DataTable dt){
		return getPermissionInfo(dt,"USERID",UP_BELONGTYPE);
	}
	
	protected List<ObjRelPermissionTo> getPermissionInfo(DataTable dt,String id,String type){
		List<ObjRelPermissionTo> result = new ArrayList<ObjRelPermissionTo>();
		
		if(dt!=null && dt.Rows.length>0){
			DataRow[] rows = dt.Rows;
			for(DataRow row:rows){
				ObjRelPermissionTo permission = new ObjRelPermissionTo();
				String uniqueId = StringUtil.getString(row.Item("AUID").Value);
				String belongId = StringUtil.getString(row.Item(id).Value);
				String belongType=type;
				String permissionId=StringUtil.getString(row.Item("PERMISSION").Value);
				int permissionType=NumberUtil.convertToInt(row.Item("PERMISSIONTYPE").Value);
				
				permission.setUniqueId(uniqueId);
				permission.setBelongId(belongId);
				permission.setBelongType(belongType);
				permission.setPermissionId(permissionId);
				permission.setPermissionType(PermissionType.createPermisionType(permissionType));
				result.add(permission);
			}
		}
		
		return result;
	}
	
	protected DataTable getSpecialPermissionInfo(String belongTable,List<String> fields,String belongid,List<String> belongValues,Map<String,String> appendWhere) throws Exception{
		
		DataTable dt= null;
		StringBuffer sb = new StringBuffer();
		StringBuffer field = new StringBuffer();
		if(ListUtil.isNotEmpty(fields)){
			for(String tmp:fields){
				if(field.length()!=0){
					field.append(",");
				}
				field.append(tmp);
			}
		}else{
			field.append("*");
		}
		sb.append("select "+field.toString()+" from ");
		sb.append(belongTable);
		if(belongValues!=null && belongValues.size()>0){
			sb.append(" where ");
			sb.append(belongid);
			sb.append(" in(");
			for(int i=0;i<belongValues.size();i++){
				if(i!=0)
					sb.append(",");
				sb.append("'");
				sb.append(belongValues.get(i));
				sb.append("'");
			}
			sb.append(")");
			if(appendWhere!=null){
				for(String key:appendWhere.keySet()){
					sb.append(" and ");
					sb.append(key);
					sb.append("='");
					sb.append(appendWhere.get(key));
					sb.append("'");
				}
			}
		}
		
		DBGetResult dbgr = new DBGetResult();
		dbgr.openConn();
		try{
			dt = dbgr.GetDataTable(sb.toString());
		}catch(Exception e){
			throw e;
		}finally{
			dbgr.closeConn();
		}
		
		return dt;
	}
}
