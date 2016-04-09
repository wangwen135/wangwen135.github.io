$(function() {
	/** !!!!!!!!!!!!!!!!!! 只能操作当前页面的对象 !!!!!!!!!!!!!!!!!!!!!!* */

	// 主界面
	var mainDiv = $("#tabContent #car");

	// 查询表单
	var form = mainDiv.find("#searchForm");

	/** 操作按钮**/
	// 新增
	var btn_insert = mainDiv.find("#insert");
	// 查看
	var btn_view = mainDiv.find("#view");
	// 修改
	var btn_modify = mainDiv.find("#modify");
	// 禁用
	var btn_disable = mainDiv.find("#disable");
	// 启用
	var btn_enablie = mainDiv.find("#enablie");
	// 删除
	var btn_delete = mainDiv.find("#delete");

	// 页大小
	var pageSizeSelect = mainDiv.find("#pageSize");

	// 内容表格
	var contentTable = mainDiv.find("#contentTable");

	// 数据过滤
	var dataFilterText = mainDiv.find("#dataFilter");

	/** ================== 模态窗口 ==================* */
	var modalDiv = mainDiv.find("#modal");
	// 模态窗口中的表单
	var modalForm = modalDiv.find("#modalForm");
	// 模块框中的保存按钮
	var modalSaveBtn = modalDiv.find("#saveBtn");
	// 模态框中的修改按钮
	var modalModifyBtn = modalDiv.find("#modifyBtn");

	// ============== 模态窗口表单排列 ==============
	ModalDivUtils.formAlign(modalDiv);

	// ============== 关闭模态窗口 ============
	ModalDivUtils.closeModal(modalDiv);

	// ============== 模态窗口焦点控制 ============
	ModalDivUtils.focusControl(modalDiv);

	/**
	 * ========================== 新增 修改 start ==============================
	 */
	var submitAction;
	modalSaveBtn.click(function() {
		submitAction = "save";
	});
	modalModifyBtn.click(function() {
		submitAction = "modify";
	});

	modalForm.submit(function(e) {
		e.preventDefault();
		// 表单提交
		var vv = $(this).serialize();

		if (submitAction == "save") {
			addData(vv);
		} else if (submitAction == "modify") {
			modifyData(vv);
		}

		return false;
	});

	/**
	 * 保存数据
	 */
	function addData(data) {

		$.get("json/base/car/add.json.json", data, function(ret) {
			if (ret.success) {
				showSuccessDialog(modalDiv, "操作成功", "保存成功！<br>新插入的数据ID是：" + ret.data, function() {
					// 回调关闭模态窗口
					modalDiv.slideUp(100);
					// 重新查询数据
					querySize(function() {
						queryData(paginationObj.totalPage);
					});
				});
			} else {
				showErrorDialog(modalDiv, "操作失败", "保存失败！<br>错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
			}
		});
	}
	/**
	 * 修改数据
	 */
	function modifyData(data) {
		$.get("json/base/car/modify.json.json", data, function(ret) {
			if (ret.success) {
				showSuccessDialog(modalDiv, "操作成功", "数据修改成功！", function() {
					// 回调关闭模态窗口
					modalDiv.slideUp(100);
					// 重新查询当前页的数据
					requeryData();
				});
			} else {
				showErrorDialog(modalDiv, "操作失败", "数据修改失败！<br>错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
			}
		});
	}
	/**
	 * ========================== 新增 修改 end ==============================
	 */

	/**
	 * ========================== 按钮操作区域 start ==============================
	 */

	/** ============== 新增 ============== */
	btn_insert.click(function() {
		// 清空弹出框
		modalForm[0].reset();
		// 设置标题
		showTitle("insertTitle");

		// 禁用按钮
		modalModifyBtn.hide()
		modalSaveBtn.show();

		modalDiv.slideDown(100);
		modalDiv.focus();
	});

	/** ============== 查看 ============== */
	btn_view.click(function() {
		// 判断是否有数据
		if (currentData == null) {
			showInfoDialog(mainDiv, "提示", "请先查询数据", null);
			return;
		}
		// 判断是否选中
		if (currentSelectedRow == null) {
			showInfoDialog(mainDiv, "提示", "请先选中要查看的行", null);
			return;
		}

		// 清空弹出框
		FormTools.resetForm(modalForm);
		// 设置新的值到表单中
		FormTools.setValueToForm(modalForm, currentData[currentSelectedRow]);

		// 设置标题
		showTitle("viewTitle");
		// 禁用按钮
		modalModifyBtn.hide()
		modalSaveBtn.hide();

		modalDiv.slideDown(100);
		modalDiv.focus();
	});

	/** ============== 修改 ============== */
	btn_modify.click(function() {
		// 判断是否有数据
		if (currentData == null) {
			showInfoDialog(mainDiv, "提示", "请先查询数据", null);
			return;
		}
		// 判断是否选中
		if (currentSelectedRow == null) {
			showInfoDialog(mainDiv, "提示", "请先选中要修改的行", null);
			return;
		}

		// 清空弹出框
		FormTools.resetForm(modalForm);
		// 设置新的值到表单中
		FormTools.setValueToForm(modalForm, currentData[currentSelectedRow]);

		// 设置标题
		showTitle("modifyTitle");
		// 禁用按钮
		modalModifyBtn.show()
		modalSaveBtn.hide();

		modalDiv.slideDown(100);
		modalDiv.focus();
	});

	/**
	 * 设置标题
	 */
	function showTitle(titleId) {
		// 先隐藏
		var modalDialog = modalDiv.find("#modalDialog");
		modalDialog.find(".modal-title").hide();
		// 再显示
		modalDialog.find("#" + titleId).show();
	}

	/** ============== 禁用 ============== */
	btn_disable.click(function() {
		// 判断是否有数据
		if (currentData == null) {
			showInfoDialog(mainDiv, "提示", "请先查询数据", null);
			return;
		}
		// 判断是否选中
		if (currentSelectedRow == null) {
			showInfoDialog(mainDiv, "提示", "请先选中要禁用的行", null);
			return;
		}
		setEnable(currentData[currentSelectedRow].behaviorClassId, false);
	});

	/** ============== 启用 ============== */
	btn_enablie.click(function() {
		// 判断是否有数据
		if (currentData == null) {
			showInfoDialog(mainDiv, "提示", "请先查询数据", null);
			return;
		}
		// 判断是否选中
		if (currentSelectedRow == null) {
			showInfoDialog(mainDiv, "提示", "请先选中要启用的行", null);
			return;
		}
		setEnable(currentData[currentSelectedRow].behaviorClassId, true);
	});

	/**
	 * 设置启用、禁用
	 * 
	 * @param id
	 *            主键
	 * @param enable
	 *            是否启用
	 */
	function setEnable(id, enable) {
		var data = "id=" + id + "&enable=" + enable;

		$.get("json/base/car/enable.json", data, function(ret) {
			if (ret.success) {
				showSuccessDialog(mainDiv, "操作成功", (enable ? "数据已被启用！" : "数据已经被禁用！"), function() {
					// 重新查询当前页的数据
					requeryData();
				});
			} else {
				showErrorDialog(mainDiv, "操作失败", "错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
			}
		});
	}

	/** ============== 删除 ============== */
	btn_delete.click(function() {
		// 判断是否有数据
		if (currentData == null) {
			showInfoDialog(mainDiv, "提示", "请先查询数据", null);
			return;
		}
		// 判断是否选中
		if (currentSelectedRow == null) {
			showInfoDialog(mainDiv, "提示", "请先选中要删除的行", null);
			return;
		}

		showConfirmDialog(mainDiv, "请确认", "确认删除选中的行？<br><span class='red'><span class='glyphicon glyphicon-warning-sign'> </span> 该操作不可逆，将进行物理删除！</span>",
				null, function() {
					var data = "id=" + currentData[currentSelectedRow].behaviorClassId;

					$.get("json/base/car/delete.json", data, function(ret) {
						if (ret.success) {
							showSuccessDialog(mainDiv, "操作成功", "数据已经被删除！", function() {
								// 重新查询记录
								querySize(requeryData);
							});
						} else {
							showErrorDialog(mainDiv, "操作失败", "错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
						}
					});
				});
	});

	/**
	 * ========================== 按钮操作区域 end ==============================
	 */

	/**
	 * ========================== 查询数据 start ==============================
	 */

	/**
	 * 创建分页控件对象
	 */
	var paginationObj = new Pagination(mainDiv.find("#paginationDiv"), function(page) {
		queryData(page);
	});

	// 查询参数---只有提交表单的时候赋值
	var formValue;
	// 当前表格中的数据
	var currentData;
	// 当前选中的行
	var currentSelectedRow;

	/**
	 * 表单查询
	 */
	form.submit(function(e) {
		e.preventDefault();
		// 这里提交表单
		formValue = $(this).serialize();

		// 查询总记录数，并生成分页
		querySize();

		// 查询第一页数据
		queryData(1);

		return false;
	});

	/**
	 * 页大小改变
	 */
	pageSizeSelect.change(pageSizeChange);

	/**
	 * 页大小改变，重新查询
	 */
	function pageSizeChange() {
		// 查询总记录数，并生成分页
		querySize();
		// 查询第一页数据
		queryData(1);
	}

	/**
	 * 查询总记录数，并生成分页
	 * 
	 * @param callBack
	 *            分页成功之后的回调函数
	 */
	function querySize(callBack) {
		// 查询总记录数
		$.get("json/base/car/selectSize.json", formValue, function(ret) {
			if (ret.success) {
				// 生成页码
				paginationObj.createPagination(ret.data, pageSizeSelect.val());

				if (callBack != null) {
					callBack();
				}
			} else {
				showErrorDialog(mainDiv, "查询失败", "查询总记录数失败！<br>错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
			}
		});
	}

	/**
	 * 重新查询当前页的数据
	 */
	function requeryData() {
		// 如果当前页大于最大页，则查最后页
		if (paginationObj.currentPage > paginationObj.totalPage) {
			paginationObj.currentPage = paginationObj.totalPage;
		}
		queryData(paginationObj.currentPage);
	}

	/**
	 * 查询某一页的数据，并加载数据到表格中
	 * 
	 * @param page
	 *            页数
	 */
	function queryData(page) {
		$.get("json/base/car/select"+(page==null?0:(page%3))+".json", formValue + "&pageSize=" + pageSizeSelect.val() + "&pageNum=" + page, function(ret) {
			if (ret.success) {// 查询成功

				// 加载数据到表格中
				loadData(ret.data);

				// 激活分页控件
				paginationObj.activePagination(page, ret.data.length)

			} else {
				showErrorDialog(mainDiv, "查询失败", "查询数据失败！<br>错误代码：" + ret.errorCode + "<br>错误信息：" + ret.message);
			}
		});
	}

	/**
	 * 清空表格原有数据，并重新加载数据到表格
	 */
	function loadData(data) {
		// 删除内容
		contentTable.children("tbody").remove();
		// 清空原来选中的行数
		currentSelectedRow = null;
		// 重新构建表格
		var tbody = "<tbody>";
		for (var i = 0; i < data.length; i++) {
			tbody += "<tr data-row-index='" + i + "'>";
			tbody += "<td>" + data[i].carModelId + "</td>";
			tbody += "<td>" + data[i].firstLetter + "</td>";
			tbody += "<td>" + data[i].brand + "</td>";
			tbody += "<td>" + data[i].name + "</td>";
			tbody += "<td>" + data[i].level + "</td>";

			tbody += "<td>" + (data[i].ifValid == 1 ? "<span class='label label-success'>1 有效</span>" : "<span class='label label-danger'>0  无效</span>")
					+ "</td>";
			tbody += "<td>" + data[i].languageCode + "</td>";
			tbody += "<td>" + DateTools.format2LocaleString(data[i].createTime) + "</td>";
			tbody += "<td>" + data[i].createUserId + "</td>";
			tbody += "<td>" + DateTools.format2LocaleString(data[i].modifyTime) + "</td>";
			tbody += "<td>" + data[i].modifyUserId + "</td>";
			tbody += "<td>" + DateTools.format2LocaleString(data[i].deleteTime) + "</td>";
			tbody += "<td>" + data[i].deleteUserId + "</td>";
			tbody += "</tr>";
		}
		tbody += "</tbody>";
		contentTable.append(tbody);
		// 保存数据
		currentData = data;
		// 为所有的行添加单击事件
		var allRow = contentTable.children("tbody").children("tr");
		allRow.click(function() {// 设置颜色
			allRow.removeClass("selected");
			$(this).addClass("selected");
			// 保存选中的行数
			var rowIndex = $(this).attr("data-row-index");
			currentSelectedRow = parseInt(rowIndex);
		});
		//双击查看
		allRow.dblclick(function(){
			if (GlobalConfig.tableDblclickShowView) {
				btn_view.click();
			}
		});
		
		// 过滤数据
		filterData();
	}
	/**
	 * ========================== 查询数据 end ==============================
	 */

	// 数据过滤
	dataFilterText.keyup(filterData);

	/**
	 * 过滤表格中的数据
	 */
	function filterData() {
		// 调用用公用方法
		tableDataFilter(contentTable, dataFilterText.val());
	}

});
