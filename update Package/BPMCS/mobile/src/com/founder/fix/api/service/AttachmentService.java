package com.founder.fix.api.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.founder.fix.api.bean.AttachmentInfoDiy;
import com.founder.fix.api.util.Utils;
import com.founder.fix.apputil.to.steam.AttachmentInfoTo;
import com.founder.fix.apputil.to.steam.AttachmentTO;
import com.founder.fix.apputil.util.JSONUtil;
import com.founder.fix.apputil.util.StringUtil;
import com.founder.fix.webcore.AttachmentInterface;

//@Path(value = "/attachment")
@Controller
@RequestMapping("/attachment")
public class AttachmentService {

//	@Context
//	HttpServletRequest request;
//	@Context
//	HttpServletResponse response;

//	@POST
//	@Path("/getAttachmentList")
//	@Consumes(MediaType.APPLICATION_JSON)
//	@Produces(MediaType.TEXT_PLAIN)
	@RequestMapping("/getAttachmentList")  
	@ResponseBody
	public String getFormData(HttpServletRequest request, HttpServletResponse response, @RequestBody String jsonStr) throws Exception {
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(jsonStr);

		String guid = StringUtil.getString(jsonParam.get("guid"));

		AttachmentInterface dao = new AttachmentInterface();
		Map<String, String> params = new HashMap<String, String>();
		params.put("fieldToken", guid); // 0720e6d4-9942-4338-aaa1-07b86cbb9e97为业务对象对应附件字段
		// path即为附件的路径
		StringBuffer path = new StringBuffer();
		List<AttachmentInfoTo> list = dao.getAttachments(params);
		List<AttachmentInfoDiy> diyList = new ArrayList<AttachmentInfoDiy>();
		if (list != null && list.size() > 0) {
			for (AttachmentInfoTo to : list) {

				AttachmentInfoDiy diy = new AttachmentInfoDiy();
				BeanUtils.copyProperties(to, diy);
				diyList.add(diy);

				// FileStoreTo store = FileUtil.getFileStore("normal");
				// FileStoreItem item = store.getCurrentStoreItem();
				// if
				// (store.getCurrentStoreItem().getStoreType().equals(StoreType.file))
				// {
				// path.append(item.getPath());
				// path.append(AppInfo.getPathChar());
				// String fileEx = FileUtil.getFileEx(to.getFileName());
				// path.append(fileEx);
				// path.append(AppInfo.getPathChar());
				// path.append(to.getFileName());
				// path.append(",");
				// }
			}
		}

		return JSONUtil.parseObject2JSON(diyList);

	}

//	@POST
//	@Path("/downloadAttachment")
//	@Consumes(MediaType.APPLICATION_JSON)
//	@Produces(MediaType.TEXT_PLAIN)
	@RequestMapping(value="/downloadAttachment", produces="text/plain")  
	@ResponseBody
	public String downloadFile(HttpServletRequest request, HttpServletResponse response, @RequestBody String jsonStr) throws Exception {
		String path = request.getSession().getServletContext().getRealPath("") +"/rest/" + "file";
		String rePath =  "/file";
		File file = new File(path);
		// 判断上传文件的保存目录是否存在
		if (!file.exists() && !file.isDirectory()) {
			System.out.println(path + "目录不存在，需要创建");
			// 创建目录
			file.mkdir();
		}
		System.out.println(path);
		response.setContentType("application/octet-stream");
		Map<String, Object> jsonParam = Utils.parseJsonStrToMap(jsonStr);

		String guid = StringUtil.getString(jsonParam.get("guid"));
		String fileId = StringUtil.getString(jsonParam.get("fileId"));

		AttachmentInterface dao = new AttachmentInterface();
		Map<String, String> params = new HashMap<String, String>();
		params.put("fieldToken", guid); // 0720e6d4-9942-4338-aaa1-07b86cbb9e97为业务对象对应附件字段
		List<AttachmentInfoTo> list = dao.getAttachments(params);
		for (AttachmentInfoTo to : list) {
			AttachmentTO attachmentTo = to.getAttachmentTo();
			if (attachmentTo.getFileId().equals(fileId)) {
				InputStream stream = to.getStream();
			path += "/" + attachmentTo.getFileName();
				rePath += "/" + attachmentTo.getFileName();
				FileOutputStream out = new FileOutputStream(path);
				// 创建一个缓冲区
				byte buffer[] = new byte[1024];
				// 判断输入流中的数据是否已经读完的标识
				int len = 0;
				// 循环将输入流读入到缓冲区当中，(len=in.read(buffer))>0就表示in里面还有数据
				while ((len = stream.read(buffer)) > 0) {
					// 使用FileOutputStream输出流将缓冲区的数据写入到指定的目录(savePath + "\\" +
					// filename)当中
					out.write(buffer, 0, len);
				}
				out.flush();
				out.close();
			}
		}
		System.out.println("================" + rePath);
		
		return rePath;
	}

}
