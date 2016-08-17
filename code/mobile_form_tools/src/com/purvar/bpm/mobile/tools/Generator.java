package com.purvar.bpm.mobile.tools;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Random;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import com.purvar.bpm.mobile.tools.form.MForm;

public class Generator {
	private static final String ENCODING = "UTF-8";

	private static VelocityEngine ve = new VelocityEngine();
	private static Template FORM_TEMPLATE;
	private static Template CONFIG_TEMPLATE;

	static {
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		ve.setProperty("classpath.resource.loader.class",
				ClasspathResourceLoader.class.getName());

		ve.init();

		FORM_TEMPLATE = ve.getTemplate("detailForm.html", ENCODING);
		CONFIG_TEMPLATE = ve.getTemplate("config.js", ENCODING);
	}

	public static void main(String args[]) throws Exception {

		String formDirPath = "D:\\01_Work\\01_Purvar\\02_Project\\09_Mobile_SJHL_CLIENT\\Fix BPMCS\\workspace\\sjhl\\WebRoot\\forms\\Daily_Office\\OA_MEETING_ROOM_SCHEDULE_IN";
		/*
		 * String formPath = formDirPath + "Company_AddForm.html";
		 * 
		 * formPath = "E:\\formTmp";
		 */
		String distDir = "d://formTmp//";

		testGenerateByFile(formDirPath, distDir);
		Random r = new Random(99);
		r.nextInt();
		// test(formDirPath);
	}

	private static void testGenerateByFile(String formDirPath, String distDir)
			throws Exception, IOException {
		FormAnalyze formAnalyze = new HtmlFormAnalyze();
		File dir = new File(formDirPath);
		for (File eachFile : dir.listFiles()) {

			String path = eachFile.getAbsolutePath();

			if (!path.endsWith(".html")) {
				continue;
			}

			MForm mForm = formAnalyze.getMForm(path);
			String prefixStr = path.substring(path.lastIndexOf("\\") + 1)
					.replace(".html", "");
			System.out.println(prefixStr);

			String fileName = prefixStr + "_config.js";

			String str = generatorByFile(mForm, CONFIG_TEMPLATE);
			FileWriter fw = new FileWriter(new File(distDir + fileName));
			fw.write(str);
			fw.close();

			fileName = prefixStr + ".html";
			str = generatorByFile(mForm, FORM_TEMPLATE);
			fw = new FileWriter(new File(distDir + fileName));
			fw.write(str);
			fw.close();

		}
	}

	private static void test(String formPath) throws Exception, IOException {
		FormAnalyze formAnalyze = new HtmlFormAnalyze();
		MForm mForm = formAnalyze.getMForm(formPath);
		String str = "";
		str = generatorByFile(mForm, CONFIG_TEMPLATE);
		System.out
				.println("======================生成config文件========================");
		System.out.println(str);
		FileWriter fw = new FileWriter(new File("C://config.js"));
		fw.write(str);
		fw.close();

		// 生成form文件
		System.out
				.println("======================生成form文件========================");
		str = generatorByFile(mForm, FORM_TEMPLATE);
		System.out.println(str);
		fw = new FileWriter(new File("C://form.html"));
		fw.write(str);
		fw.close();
	}

	/**
	 * 生成单个文件
	 * 
	 * @param mForm
	 * @return
	 * @throws Exception
	 */
	private static String generatorByFile(MForm mForm, Template t)
			throws Exception {
		String str = "";
		VelocityContext ctx = new VelocityContext();
		ctx.put("mForm", mForm);

		StringWriter writer = new StringWriter();
		writer = new StringWriter();
		t.merge(ctx, writer);
		str = writer.toString();

		return str;
	}

}
