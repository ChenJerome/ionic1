<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="row">
	<div class="col-xs-4">
		<div class="dataTables_length" id="dataTable_length">每页显示 10 条数据</div>
	</div>
	<div class="col-xs-4">
		<div class="page-text text-center">
			<c:choose>
				<c:when test="${page.totalRecord > 0}">
					第 ${page.startRow + 1} 至
				</c:when>
				<c:otherwise>
					第 0 至
				</c:otherwise>
			</c:choose>
			${page.endRow >= page.totalRecord ? page.totalRecord : page.endRow}
			条记录，共 ${page.totalRecord} 条</div>
	</div>
	<div class="col-xs-4">
		<ul class="pagination pull-right page-index">
			<c:choose>
				<c:when test="${page.curPage == 1}">
					<li class="paginate_button first disabled"
						aria-controls="dataTable" tabindex="0" id="dataTable_first"><a
						href="#">首页</a></li>
					<li class="paginate_button previous disabled"
						aria-controls="dataTable" tabindex="0" id="dataTable_previous"><a
						href="#"><i class="fa fa-chevron-left"></i></a></li>
				</c:when>
				<c:otherwise>
					<li class="paginate_button first" aria-controls="dataTable"
						tabindex="0" id="dataTable_first"><a href="#"
						onclick="toIndex(1, ${page.pageSize})">首页</a></li>
					<li class="paginate_button previous" aria-controls="dataTable"
						tabindex="0" id="dataTable_previous"><a href="#"
						onclick="toIndex(${page.curPage - 1}, ${page.pageSize})"><i
							class="fa fa-chevron-left"></i></a></li>
				</c:otherwise>
			</c:choose>
			<li class="paginate_button active" aria-controls="dataTable"
				tabindex="0"><a href="#">${page.curPage}</a></li>
			<c:choose>
				<c:when test="${page.curPage == page.pageCount}">
					<li class="paginate_button next disabled" aria-controls="dataTable"
						tabindex="0" id="dataTable_next"><a href="#"><i
							class="fa fa-chevron-right"></i></a></li>
					<li class="paginate_button last disabled" aria-controls="dataTable"
						tabindex="0" id="dataTable_last"><a href="#">下一页</a></li>
				</c:when>
				<c:otherwise>
					<li class="paginate_button next" aria-controls="dataTable"
						tabindex="0" id="dataTable_next"><a href="#"
						onclick="toIndex(${page.curPage + 1}, ${page.pageSize})"><i
							class="fa fa-chevron-right"></i></a></li>
					<li class="paginate_button last" aria-controls="dataTable"
						tabindex="0" id="dataTable_last"><a href="#"
						onclick="toIndex(${page.pageCount}, ${page.pageSize})">末页</a></li>
				</c:otherwise>
			</c:choose>
		</ul>
	</div>
</div>