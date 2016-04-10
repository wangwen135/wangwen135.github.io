$(function() {
	/**
	 * 注册工具提示
	 */
	$("[data-toggle='tooltip']").tooltip();

	/**
	 * 弹出框
	 */
	$('[data-toggle="popover"]').popover()

	/**
	 * 设置ajax 全局选项 这个是不推荐使用的
	 */
	$.ajaxSetup({
		timeout : 10000,
		type : "get",
		async : true
	});

	/**
	 * 注册ajax 全局错误处理
	 */
	$(document).ajaxError(ajaxErrorHandler);

	/**
	 * 注册ajax 全局开始
	 */
	$(document).ajaxStart(ajaxStartHandler);

	/**
	 * 注册ajax 全局完成
	 */
	$(document).ajaxComplete(ajaxCompleteHandler);

})

// !!!!!!!!!!!!!!!!!!!!!!!!!!! 全局对象，注意命名冲突 !!!!!!!!!!!!!!!!!!!!!!!!!!!//

/** ######################## Ajax ########################* */

/**
 * ajax全局开始处理
 */
function ajaxStartHandler() {
	// debugger;
	// alert("ajaxStart");
}
/**
 * ajax 全局完成处理
 * 
 * @param event
 * @param xhr
 * @param settings
 */
function ajaxCompleteHandler(event, xhr, settings) {
	// debugger;
	// alert("ajaxComplete");
}

/**
 * 
 * <pre>
 * ajax全局错误处理
 * <br>
 * 要求页面中需要有一个模态窗口errorModal，模态窗口包含标题：errorModalTitle 和 内容：errorModalTxt
 * </pre>
 * 
 * @param event
 * @param jqXHR
 * @param ajaxSettings
 * @param thrownError
 */
function ajaxErrorHandler(event, jqXHR, ajaxSettings, thrownError) {
	// debugger;
	$("#errorModalTitle").text(jqXHR.status + " : " + thrownError);
	var json = jqXHR.responseJSON;
	if (json != null) {
		$("#errorModalTxt").html(json.errorCode + "<br/>" + json.message);
	} else {
		if (jqXHR.status == 0) {
			if (thrownError == "timeout") {
				$("#errorModalTxt").html("请求超时");
			} else {
				$("#errorModalTxt").html("请求失败");
			}

		} else if (jqXHR.status == 401) {
			$("#errorModalTxt").html("请求的资源未授权<br/><br/><a class='btn btn-warning btn-sm' role='button'  href='login.html'>重新登录系统</a>");
		} else if (jqXHR.status == 404) {
			$("#errorModalTxt").html("请求的资源不存在");
		} else {
			$("#errorModalTxt").html("未知错误");
		}
	}
	// 弹出
	$('#errorModal').modal('show')

}
/** ######################## Ajax end ########################* */

/**
 * 弹出错误模态窗口
 * 
 * @param title
 *            错误标题
 * @param content
 *            错误内容
 */
function showErrorModal(title, content) {
	$("#errorModalTitle").html(title);
	$("#errorModalTxt").html(content);
	$('#errorModal').modal('show')
}

/** ######################## 弹出对话框 start ########################* */
/**
 * 显示信息对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素<br>
 *            如果为空，则在body中弹出
 * @param title
 *            标题
 * @param content
 *            内容
 * @param closeCallBack
 *            关闭回调函数
 */
function showInfoDialog(panel, title, content, closeCallBack) {
	showDialog(panel, title, content, "info", closeCallBack, null);
}
/**
 * 显示成功信息对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素<br>
 *            如果为空，则在body中弹出
 * @param title
 *            标题
 * @param content
 *            内容
 * @param closeCallBack
 *            关闭回调函数
 */
function showSuccessDialog(panel, title, content, closeCallBack) {
	showDialog(panel, title, content, "success", closeCallBack, null);
}
/**
 * 显示警告信息对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素<br>
 *            如果为空，则在body中弹出
 * @param title
 *            标题
 * @param content
 *            内容
 * @param closeCallBack
 *            关闭回调函数
 */
function showWarningDialog(panel, title, content, closeCallBack) {
	showDialog(panel, title, content, "warning", closeCallBack, null);
}
/**
 * 显示错误信息对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素<br>
 *            如果为空，则在body中弹出
 * @param title
 *            标题
 * @param content
 *            内容
 * @param closeCallBack
 *            关闭回调函数
 */
function showErrorDialog(panel, title, content, closeCallBack) {
	showDialog(panel, title, content, "error", closeCallBack, null);
}
/**
 * 显示确认信息对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素 <br>
 *            如果为空，则在body中弹出
 * @param title
 *            标题
 * @param content
 *            内容
 * @param closeCallBack
 *            关闭回调函数
 * @param affirmCallBack
 *            确认回调函数
 */
function showConfirmDialog(panel, title, content, closeCallBack, affirmCallBack) {
	showDialog(panel, title, content, "confirm", closeCallBack, affirmCallBack);
}
/**
 * 弹出对话框
 * 
 * @param panel
 *            要弹出对话框的面板元素<br>
 *            如果为空，则在body中弹出，相对于窗口绝对定位
 * @param title
 *            标题
 * @param content
 *            内容
 * @param type
 *            类型 { info , success , warning , error , confirm }
 * @param closeCallBack
 *            关闭回调函数
 * @param affirmCallBack
 *            确认回调函数
 */
function showDialog(panel, title, content, type, closeCallBack, affirmCallBack) {

	var modalClass = "message-modal";
	// 如果为空就在body上弹出
	if (panel == null) {
		panel = $("body");
		// 相对于浏览器窗口绝对定位
		modalClass = "message-modal-body";
	}

	var dialog = "<div class='" + modalClass + "' id='messageModal_tmp' role='dialog' tabindex='-1'>"
	dialog += "<div class='message-modal-dialog' id='messageModalDialog'>"
	dialog += "<div class='modal-content '>"
	dialog += "<div class='modal-header '>"

	switch (type) {
	case "info":
		dialog += "<span class='text-info '>"
		dialog += "<span class='glyphicon  glyphicon-info-sign' aria-hidden='true'></span> "
		break;
	case "success":
		dialog += "<span class='text-success '>"
		dialog += "<span class='glyphicon  glyphicon glyphicon-ok-sign' aria-hidden='true'></span> "
		break;
	case "warning":
		dialog += "<span class='text-warning '>"
		dialog += "<span class='glyphicon  glyphicon-warning-sign' aria-hidden='true'></span> "
		break;
	case "error":
		dialog += "<span class='text-danger '>"
		dialog += "<span class='glyphicon  glyphicon-remove-sign' aria-hidden='true'></span> "
		break;
	case "confirm":
		dialog += "<span class='text-primary '>"
		dialog += "<span class='glyphicon  glyphicon-question-sign' aria-hidden='true'></span> "
		break;
	default:
		dialog += "<span class='text-primary '>"
		dialog += "<span class='glyphicon  glyphicon-info-sign' aria-hidden='true'></span> "
		break;
	}

	dialog += title;// 标题
	dialog += "</span>"
	dialog += "<button type='button' class='close ' data-close='dialog' aria-hidden='true'>&times;</button> "
	dialog += "</div>"
	dialog += "<div class='modal-body '>";
	dialog += content;//
	dialog += "</div>";
	dialog += "<div class='modal-footer'>"
	// 确认，取消
	if (type == "confirm") {
		dialog += "<button type='button' id='affirm' class='btn btn-primary btn-sm'>确认</button> "
		dialog += "<button type='button' data-close='dialog' class='btn btn-default btn-sm'>取消</button> "
	} else {
		dialog += "<button type='button' data-close='dialog' class='btn btn-default btn-sm'>关闭</button> "
	}

	dialog += "</div>"
	dialog += "</div>"
	dialog += "</div> "
	dialog += "<div tabindex='0' data-focus='dialog'></div>"
	dialog += "</div> "

	// 添加 并重新查找
	var dialogObj = panel.prepend(dialog).find("#messageModal_tmp");

	// 确认按钮
	if (type == "confirm") {
		dialogObj.find("#affirm").click(function() {
			// 关闭
			close();
			// 回调
			if (affirmCallBack != null)
				affirmCallBack();
		});
	}

	// 关闭按钮
	dialogObj.find("button[data-close='dialog']").click(function() {
		close();
	});
	// ESC键关闭
	dialogObj.keyup(function(e) {
		var key = e.which;
		if (key == 27) {
			close();
		}
	});

	// 焦点控制
	dialogObj.find("[data-focus='dialog']").focus(function() {
		dialogObj.focus();
	});

	// 开启
	show();

	function show() {
		dialogObj.fadeIn(100);
		dialogObj.focus();
	}
	function close() {
		// 关闭时直接移除对象
		dialogObj.remove();
		// 关闭回调
		if (closeCallBack != null)
			closeCallBack();
	}
}

/** ######################## 弹出对话框 end ########################* */

/**
 * ### 模态框通用工具 ###
 */
var ModalDivUtils = {

	/**
	 * 模态窗口焦点控制--通用
	 * 
	 * @param modalDiv
	 *            模态窗口
	 */
	focusControl : function(modalDiv) {
		modalDiv.find("[data-focus='modal']").focus(function() {
			$(this).parent().focus();
		});
	},

	/**
	 * 关闭模态窗口--通用
	 * 
	 * @param modalDiv
	 *            模态窗口
	 */
	closeModal : function(modalDiv) {
		// 两个关闭按钮
		var modalClose = modalDiv.find("button[data-dismiss='modal']");
		modalClose.click(function() {
			// modalDiv.fadeOut("fast");
			modalDiv.slideUp(100);
		});
		// ESC键关闭
		modalDiv.keyup(function(e) {
			var key = e.which;
			if (key == 27) {
				modalDiv.slideUp(100);
			}
		});
	},

	/**
	 * 模态窗口中的表单排列--通用
	 * 
	 * @param modalDiv
	 *            模态窗口
	 */
	formAlign : function(modalDiv) {
		var formAlignList = modalDiv.find("#formAlignList");// 列表
		var formAlignJustify = modalDiv.find("#formAlignJustify");// 流动两端对齐
		var formAlignJustifyBlock = modalDiv.find("#formAlignJustifyBlock");// 流动块形式两端对齐
		var modalForm = modalDiv.find("#modalForm");// 表单
		formAlignList.click(function() {
			modalForm.attr("class", "form-horizontal");
			modalForm.find(".form-group label").attr("class", "col-sm-3 control-label");
			modalForm.find(".form-group div").attr("class", "col-sm-9");
			formAlignList.addClass("red");
			formAlignJustify.removeClass("red");
			formAlignJustifyBlock.removeClass("red");
		});
		formAlignJustify.click(function() {
			modalForm.attr("class", "form-inline");
			modalForm.find(".form-group label").attr("class", "control-label");
			modalForm.find(".form-group div").attr("class", "form-group-div");
			formAlignJustify.addClass("red");
			formAlignList.removeClass("red");
			formAlignJustifyBlock.removeClass("red");
		});
		formAlignJustifyBlock.click(function() {
			modalForm.attr("class", "form-inline");
			modalForm.find(".form-group label").attr("class", "control-label");
			modalForm.find(".form-group div").attr("class", "form-group-div-auto");
			formAlignJustifyBlock.addClass("red");
			formAlignJustify.removeClass("red");
			formAlignList.removeClass("red");
		});
	}
}

/** ######################## 过滤表格中的数据 ########################* */

/**
 * 将表格中匹配的内容突出显示<br>
 * 当key为空时，将清空表格中的突出显示
 * 
 * @param table
 *            表格
 * @param filterKey
 *            关键字
 */
function tableDataFilter(table, filterKey) {
	var allTableRow = table.children("tbody").children("tr");
	// 先清空样式
	allTableRow.removeClass("data-filter-row-match");
	allTableRow.children("td").removeClass("data-filter-td-match");

	if (filterKey == null || filterKey == "") {
		return;
	}
	// 遍历表格
	allTableRow.filter(function(index) {
		var result = false;
		$(this).children("td").filter(function(index2) {
			if ($(this).text().match(filterKey)) {
				result = true;
				return true;
			}
		}).addClass("data-filter-td-match");
		return result;
	}).addClass("data-filter-row-match");
}

/** ** ######################## 工具类 ######################## *** */

/**
 * 格式化工具
 */
var FormatTools = {

}
/**
 * 格式化工具
 */
var DateTools = {
	pattern_datatime_default : "yyyy-MM-dd HH:mm:ss",
	pattern_datetime_local : "yyyy-MM-ddTHH:mm:ss",
	pattern_date : "yyyy-MM-dd",
	pattern_time : "HH:mm",

	/**
	 * 格式化成默认格式
	 * 
	 * @param time
	 *            毫秒数
	 * @returns yyyy-MM-dd HH:mm:ss 或 “”
	 */
	format2DataTimeDefault : function(time) {
		return this.format(time, this.pattern_datatime_default);
	},

	/**
	 * 格式化成datatime格式
	 * 
	 * @param time
	 *            毫秒数
	 * @returns yyyy-MM-ddTHH:mm:ss 或 “”
	 */
	format2DataTime : function(time) {
		return this.format(time, this.pattern_datetime_local);
	},

	/**
	 * 格式化成日期格式
	 * 
	 * @param time
	 *            毫秒数
	 * @returns yyyy-MM-dd 或 “”
	 */
	format2Data : function(time) {
		return this.format(time, this.pattern_date);
	},

	/**
	 * 格式化成时间格式
	 * 
	 * @param time
	 *            毫秒数
	 * @returns HH:mm 或 “”
	 */
	format2Time : function(time) {
		return this.format(time, this.pattern_time);
	},

	/**
	 * 格式化成本地时间格式
	 * 
	 * @param time
	 *            时间
	 * @returns 本地化的字符串，如：2015/12/30 上午11:37:21
	 */
	format2LocaleString : function(time) {
		if (this.checkTime(time)) {
			return new Date(time).toLocaleString()
		} else {
			return "";
		}
	},

	/**
	 * 检查时间毫秒数
	 * 
	 * @param time
	 *            毫秒数
	 * @returns {Boolean} true：大于0的数字
	 */
	checkTime : function(time) {
		if (typeof time != "number") {
			return false;
		}
		if (time <= 0) {
			return false;
		}
		return true;
	},

	/**
	 * 格式化日期时间
	 * 
	 * @param time
	 *            1970年1月1日午夜到指定日期（字符串）的毫秒数。
	 * @param pattern
	 *            格式
	 * @returns 格式化后的日期 或者 空字符串
	 */
	format : function(time, pattern) {
		if (this.checkTime(time)) {
			return new Date(time).Format(pattern);
		} else {
			return "";
		}
	}
};

/**
 * 表单工具类
 */
var FormTools = {

	/**
	 * 重置表单
	 * 
	 * @param form
	 *            表单 JQuery 对象
	 */
	resetForm : function(form) {
		form[0].reset();
	},

	/**
	 * 清空表单
	 * 
	 * @param form
	 *            表单 JQuery 对象
	 */
	clearForm : function(form) {
		form.find(':input').not(':button, :submit, :reset').val('').removeAttr('checked').removeAttr('selected');
	},
	/**
	 * 设置值到表单 <br>
	 * 先只处理文本框，下拉框 ，日期框<br>
	 * 单选、多选 后面再说
	 * 
	 * @param form
	 *            表单
	 * @param datas
	 *            值 JSON
	 */
	setValueToForm : function(form, datas) {

		form.find(':input').not(':button, :submit, :reset').each(function() {
			// 获取name 属性
			var name = $(this).attr("name");

			if (name != null) {
				var type = $(this).attr("type");
				var _value = datas[name];
				if (type == "datetime-local") {
					if (_value != null)
						$(this).val(new Date(_value).Format("yyyy-MM-ddTHH:mm:ss"));
				} else if (type == "date") {
					if (_value != null)
						$(this).val(new Date(_value).Format("yyyy-MM-dd"));
				} else if (type == "time") {
					if (_value != null)
						$(this).val(new Date(_value).Format("HH:mm"));
				} else {
					$(this).val(_value);
				}
			}
		});
	}
}

/**
 * ######################## 全局配置 ########################
 */
var GlobalConfig = {
	/**
	 * 双击表格的时候是否弹出查看面板
	 */
	tableDblclickShowView : true
}

/**
 * ######################## 类型扩展 ########################
 */
/**
 * ## Data类型 扩展 ##
 * 
 * <pre>
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format(&quot;yyyy-MM-dd HH:mm:ss.S&quot;) ==&gt; 2006-07-02 08:09:04.423
 * (new Date()).Format(&quot;yyyy-M-d H:m:s.S&quot;) ==&gt; 2006-7-2 8:9:4.18
 * </pre>
 */
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"H+" : this.getHours(), // 小时 0~23
		"m+" : this.getMinutes(), // 分 (0 ~ 59)
		"s+" : this.getSeconds(), // 秒 (0 ~ 59)
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒 (0 ~ 999)
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * ######################## 自定义类 ########################
 */

/**
 * <pre>
 * 通用 分页控件
 * 
 * init() 
 * 初始化方法，new时自动调用
 * 
 * createPagination(totaSize, pageSize) 
 * 创建分页控件
 * 
 * activePagination(page, pageDataSize)
 * 激活某一页，并设置记录条数
 * 
 * </pre>
 * 
 * @param paginationDiv
 *            创建分页控件的DIV
 * @param clickCallback
 *            选择页码时的回调函数
 */
function Pagination(paginationDiv, clickCallback) {

	/**
	 * 放置分页控件的DIV
	 */
	this.paginationDiv = paginationDiv;

	/**
	 * 分页标签列表
	 */
	this.paginationUl;
	/**
	 * 总页数
	 */
	this.totalSizeSpan;
	/**
	 * 当前页开始条数
	 */
	this.currentDataStartSpan;
	/**
	 * 当前页结束条数
	 */
	this.currentDataEndSpan;
	/**
	 * 点击时的回调函数
	 */
	this.clickCallback = clickCallback;
	/**
	 * 总记录数
	 */
	this.totalSize = 0;
	/**
	 * 页大小
	 */
	this.pageSize = 10;
	/**
	 * 总页数
	 */
	this.totalPage = 0;
	/**
	 * 当前页
	 */
	this.currentPage = 0;
	/**
	 * 当前数据条数
	 */
	this.currentDataSize = 0;
	/**
	 * 最大显示数量
	 */
	this.maxDisplayNumber = 15;

	/**
	 * 初始化<br>
	 * 构建时自动调用
	 */
	this.init = function() {
		var content = "<div class='total-size'>总共	<span id='totalSize'>0</span> 条数据，";
		content += "当前第 <span id='currentDataStart'>0</span> - <span id='currentDataEnd'>0</span> 条</div>";
		content += "<nav><ul class='pagination' id='pagination'>";
		content += "<li><a href='javascript:void(0)' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
		content += "<li class='active'><a href='javascript:void(0)'>0</a></li>";
		content += "<li><a href='javascript:void(0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
		content += "</ul></nav>";

		// 插入
		this.paginationDiv.append(content);

		// 分页标记
		this.paginationUl = this.paginationDiv.find("#pagination");
		// 总记录数span
		this.totalSizeSpan = this.paginationDiv.find("#totalSize");
		// 当前页开始条数
		this.currentDataStartSpan = this.paginationDiv.find("#currentDataStart");
		// 当前页结束条数
		this.currentDataEndSpan = this.paginationDiv.find("#currentDataEnd");
	}

	/**
	 * 计算页数，生成分页标签，添加对应事件<br>
	 * 并选中当前页
	 * 
	 * @param totaSize
	 *            总记录条数
	 * @param pageSize
	 *            页大小
	 * @param maxDisplay
	 *            最大显示页码数，非必填，默认15
	 */
	this.createPagination = function(totaSize, pageSize, maxDisplay) {

		this.totalSize = totaSize;
		this.pageSize = parseInt(pageSize);
		if (maxDisplay != null && !isNaN(maxDisplay)) {
			this.maxDisplayNumber = parseInt(maxDisplay);
		}

		// 设置总记录数
		this.totalSizeSpan.text(totaSize);

		// 可以分成几页
		this.totalPage = Math.ceil(this.totalSize / this.pageSize);

		// 先清空原来的页面
		this.paginationUl.empty();

		// 再添加新的
		var paginationList = "<li data_page='previous'><a href='javascript:void(0)' aria-label='Previous'><span>&laquo;</span></a></li>";
		for (i = 1; i <= this.totalPage; i++) {
			paginationList += "<li data_page='" + i + "'><a href='javascript:void(0)' >" + i + "</a></li>";
		}
		paginationList += "<li data_page='next'><a href='javascript:void(0)' aria-label='Next'><span>&raquo;</span></a></li>";
		this.paginationUl.append(paginationList);

		// 判断页码数量是否大于最大的数量
		if (this.totalPage > this.maxDisplayNumber) {
			// 在第一个页码之后插入...
			this.paginationUl.children("[data_page='1']").after("<li data_page='leftOmit'><span>...</span></li>");
			// 在最后一个之前插入...
			this.paginationUl.children("[data_page='" + this.totalPage + "']").before("<li data_page='rightOmit'><span>...</span></li>");
		}

		// 添加事件
		this.paginationUl.children("li").bind("click", {
			obj : this
		}, function(event) {
			event.data.obj.flipAction($(this).attr('data_page'));
		});

		// 激活当前页面
		this.activePaginationPage(this.currentPage);
	}

	/**
	 * 翻页动作<br>
	 * 回调clickCallback 函数
	 * 
	 * @param pageLi
	 *            页码，可以是{ 'previous' , 'next' , 或者任何数据 }
	 */
	this.flipAction = function(clickPage) {
		if (clickPage == "previous") {
			if (this.currentPage <= 1) {// 第一页
				return;
			} else {
				clickPage = this.currentPage - 1;
			}
		} else if (clickPage == "next") {
			if (this.currentPage == this.totalPage) {// 最后一页
				return;
			} else {
				clickPage = this.currentPage + 1;
			}
		} else {
			// 判断是否是数字
			if (isNaN(clickPage)) {
				return;
			}
			// 点中当前页
			if (this.currentPage == clickPage) {
				return;
			}
		}
		clickPage = parseInt(clickPage)
		// 回调
		this.clickCallback(clickPage);
	}

	/**
	 * 激活分页控件<br>
	 * 设置页码，计算起始和结束数据条数
	 * 
	 * @param page
	 *            页码
	 * @param pageDataSize
	 *            当前页有多少条数据
	 */
	this.activePagination = function(page, pageDataSize) {
		this.activePaginationPage(page);
		this.calcStartAndEnd(pageDataSize);
	}

	/**
	 * 激活分页中的某一页<br>
	 * 
	 * @param 页码
	 */
	this.activePaginationPage = function(page) {
		this.currentPage = page;
		this.paginationUl.find("li").removeClass("active");
		this.paginationUl.find("li[data_page='" + page + "']").addClass("active");

		// 计算应该要显示的
		if (this.totalPage > this.maxDisplayNumber) {
			// 先将中间的全部隐藏
			this.paginationUl.children("[data_page]").slice(2, -2).hide();

			// 两端的数量，减去1
			var both = Math.ceil(this.maxDisplayNumber / 2) - 1;

			// 开始和结束的页码
			var startNumber;
			var endNumber;
			// 最少显示 maxDisplayNumber 个页码
			if ((this.currentPage - both) > 1) {
				startNumber = (this.currentPage - both);
				if ((this.currentPage + both) > this.totalPage) {
					endNumber = this.totalPage;
					startNumber = this.totalPage - this.maxDisplayNumber;
				} else {
					endNumber = (this.currentPage + both);
				}
			} else {
				startNumber = 1;
				endNumber = this.maxDisplayNumber;
			}

			// 判断是否需要显示省略号
			if (startNumber > 2) {
				this.paginationUl.children("[data_page='leftOmit']").show();
			}
			if (endNumber < (this.totalPage - 1)) {
				this.paginationUl.children("[data_page='rightOmit']").show();
			}
			// 显示
			for (var i = startNumber; i <= endNumber; i++) {
				this.paginationUl.children("[data_page='" + i + "']").show();
			}
		}
	}

	/**
	 * 计算并设置开始和结束条数
	 * 
	 * @param currentDataSize
	 *            当前的数据条数
	 */
	this.calcStartAndEnd = function(currentDataSize) {
		this.currentDataSize = currentDataSize;
		// 计算当前页中的数据开始和结束条数
		var startSize = 0;
		var endSize = 0;
		if (this.currentPage != 0) {
			startSize = (this.currentPage - 1) * this.pageSize;
			if (this.currentDataSize != null) {
				endSize = startSize + this.currentDataSize;
			} else {
				endSize = startSize;
			}
		}
		this.currentDataStartSpan.text(startSize);
		this.currentDataEndSpan.text(endSize);
	}

	// 调用初始化方法
	this.init();
}
