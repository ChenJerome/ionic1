<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="row">
	<div class="col-xs-4">
		<div class="dataTables_length" id="dataTable_length">每页显示 10 条数据</div>
	</div>
	<div class="col-xs-4">
		<div class="page-text text-center" id="pagerText">
			<c:choose>
				<c:when test="${modalpage.totalRecord > 0}">
					第 ${modalpage.startRow + 1} 至
				</c:when>
				<c:otherwise>
					第 0 至
				</c:otherwise>
			</c:choose>
			${modalpage.endRow >= modalpage.totalRecord ? modalpage.totalRecord : modalpage.endRow}
			条记录，共 ${modalpage.totalRecord} 条</div>
	</div>
	<div class="col-xs-4" >
		<ul class="pagination pull-right page-index" id="pager">
			<c:choose>
				<c:when test="${modalpage.curPage == 1}">
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
						onclick="modelToIndex(1, ${modalpage.pageSize})">首页</a></li>
					<li class="paginate_button previous" aria-controls="dataTable"
						tabindex="0" id="dataTable_previous"><a href="#"
						onclick="modelToIndex(${modalpage.curPage - 1}, ${modalpage.pageSize})"><i
							class="fa fa-chevron-left"></i></a></li>
				</c:otherwise>
			</c:choose>
			<li class="paginate_button active" aria-controls="dataTable"
				tabindex="0"><a href="#">${modalpage.curPage}</a></li>
			<c:choose>
				<c:when test="${modalpage.curPage == modalpage.pageCount}">
					<li class="paginate_button next disabled" aria-controls="dataTable"
						tabindex="0" id="dataTable_next"><a href="#"><i
							class="fa fa-chevron-right"></i></a></li>
					<li class="paginate_button last disabled" aria-controls="dataTable"
						tabindex="0" id="dataTable_last"><a href="#">下一页</a></li>
				</c:when>
				<c:otherwise>
					<li class="paginate_button next" aria-controls="dataTable"
						tabindex="0" id="dataTable_next"><a href="#"
						onclick="modelToIndex(${modalpage.curPage + 1}, ${modalpage.pageSize})"><i
							class="fa fa-chevron-right"></i></a></li>
					<li class="paginate_button last" aria-controls="dataTable"
						tabindex="0" id="dataTable_last"><a href="#"
						onclick="modelToIndex(${modalpage.pageCount}, ${modalpage.pageSize})">末页</a></li>
				</c:otherwise>
			</c:choose>
		</ul>
	</div>
</div>