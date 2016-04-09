$(function() {

	/**
	 * 清空内容
	 */
	function cleanContent() {
		$("#rightPanel").fadeOut("fast", function() {
			$("#tabList").empty();
			$("#tabContent").empty()
			// 显示
			$(this).fadeIn("fast");
		});
	}

	/**
	 * 模块切换<br>
	 * 淡入淡出清空内容
	 * 
	 * @param callBack
	 *            重新加载菜单的回调函数
	 */
	function switchModule(callBack) {
		$("#containerBody").fadeOut("fast", function() {
			// 清空菜单
			$("#leftMenu").empty();

			// 清空内容标签页
			$("#tabList").empty();
			$("#tabContent").empty()

			callBack();

			// 显示
			$(this).fadeIn("fast");
		});
	}

	/**
	 * 加载模块
	 */
	function loadModule() {
		$.get("json/home/loadModule.json", function(ret) {
			var modules = $("#modules");
			var moduleList = ret.data;
			for (var i = 0; i < moduleList.length; i++) {
				var moduleEntity = moduleList[i];
				var key = moduleEntity.key;
				var name = moduleEntity.name;
				var icon = moduleEntity.icon;
				var li = "<li id=" + key + "><a href='javascript:void(0)'>";
				if (icon != null) {
					li += "<span class='glyphicon " + icon + "'></span>"
				}

				li += name + "</a></li>";
				// 添加模块
				modules.append(li);
				// 绑定事件
				modules.children("#" + key).children("a").bind("click", {
					tkey : key,
					tname : name
				}, function(e) {
					loadMenu(e.data.tkey, e.data.tname);
				});

			}
			// 默认应该加载第一个菜单
			if (moduleList.length > 0) {
				modules.children("li:first").children("a").click();
			}
		});
	}

	/**
	 * 加载菜单
	 * 
	 * @param moduleCode
	 *            模块代码
	 * @param moduleName
	 *            模块名称
	 */
	function loadMenu(moduleCode, moduleName) {
		$.get("json/home/loadMenu/" + moduleCode + ".json", function(ret) {
			// 设置选择
			$("#modules").children().removeClass("active");
			$("#modules #" + moduleCode).addClass("active");

			switchModule(function() {
				// 设置标题
				$("#leftMenuTitle").text(moduleName);
				var leftMenu = $("#leftMenu");
				var menuList = ret.data;
				for (var i = 0; i < menuList.length; i++) {
					var menuEntity = menuList[i];
					var li;
					if (menuEntity.type == 0) {
						li = "<li><a href='javascript:void(0)' data-targetPage='" + menuEntity.key + "'>" + menuEntity.name;
						if (menuEntity.icon != null) {
							li += "<span class='glyphicon " + menuEntity.icon + "'></span>"
						}
						li += "</a></li>";

					} else if (menuEntity.type == 1) {
						li = "<li class='separator'></li>";
					} else if (menuEntity.type == 2) {
						li = "<li class='text-separator'>" + menuEntity.name + "</li>";
					} else {
						continue;
					}
					leftMenu.append(li);// 加载新菜单
				}
				// 添加点击事件
				menuClick(moduleCode);
			});
		});
	}

	/**
	 * 添加菜单点击事件
	 * 
	 * @param moduleName
	 *            模块名称
	 */
	function menuClick(moduleName) {
		// 菜单按钮
		$("#leftMenu li")
				.has("a[data-targetPage]")
				.click(
						function() {
							// 清空其他菜单的选中状态
							// $("#leftMenu li").attr("class", "");

							// 判断当前是否是选中状态，如果是选中则只是切换标签页
							var select = $(this).attr("data-select");
							var tableId = $(this).children().attr("data-targetPage");
							var text = $(this).children().text();

							if (select) {
								// 是选中状态
								// 切换标签页
								$("#tabList a[href='#" + tableId + "']").tab('show')
								// 修改样式

							} else {
								// 当前不是选中状态
								// 选中当前菜单
								$(this).addClass("active currentSelect");
								// 标记为选中
								$(this).attr("data-select", "1");

								// 创建标签
								var li = "<li role='presentation'><a href='#" + tableId + "' aria-controls='" + tableId + "' role='tab'  data-toggle='tab'>"
										+ text + "<span role='button' aria-label='Close' aria-hidden='true' class='tabClose' >&times;</span></a></li>";

								// 添加标签
								$("#tabList").append(li);

								// loading的内容页面
								var loading = "<br/><div class='progress'>"
										+ "<div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 45%'>"
										+ "<span class='sr-only'>45% Complete</span>页面加载中</div></div>" + " <p>请稍候...</p><br/>";

								// 创建或者获取内容
								var contentDiv = "<div class='tab-pane fade in' id='" + tableId + "'>" + loading + "</div>";

								// 添加标签内容
								$("#tabContent").append(contentDiv);

								// 新添加的 li 元素
								var liElement = $('#tabList a:last');

								// 激活添加的标签页面
								liElement.tab('show');

								// 标签激活时修改菜单样式
								liElement.on('shown.bs.tab', function(e) {
									debugger;
									var href = e.target.href;
									var targetPage = href.substring(href.lastIndexOf('#') + 1);
									// 先清空
									$("#leftMenu li").removeClass("currentSelect");
									// 再标记当前选中
									$("#leftMenu li a[data-targetPage='" + tableId + "']").parent().addClass("currentSelect");
								})

								// 关闭事件
								liElement.children("span.tabClose").click(
										function(e) {
											// 阻止事件冒泡
											e.stopPropagation();

											// a 元素
											var aElement = $(this).parent()

											// 获取对应的ID
											var tableId = aElement.attr('aria-controls');

											// 移除对应的元素
											// 移除标签
											aElement.parent().remove();
											// 移除内容
											$("#tabContent #" + tableId).remove();

											// 将菜单设置为未选中
											$("#leftMenu li a[data-targetPage='" + tableId + "']").parent().attr("data-select", "").removeClass(
													"active currentSelect");
											// 判断是否有激活的标签页
											if ($("#tabList li.active").length == 0) {
												// 没有激活的标签，激活最后一个
												$('#tabList a:last').tab('show');
											}
											return false;
										});

								/** 全部完了再正式加载页面 */
								contentDiv = $("#tabContent #" + tableId);
								contentDiv
										.load(
												"/" + moduleName + "/" + tableId ,
												function(response, status, xhr) {

													if (status != "success") {
														var loadFailed = "<br/><div class='progress'>"
																+ "<div class='progress-bar  progress-bar-danger progress-bar-striped' role='progressbar' aria-valuenow='65' aria-valuemin='0' aria-valuemax='100' style='width: 65%'>"
																+ "<span class='sr-only'>65% Complete</span>页面加载失败</div></div>" + "<p class='red'>错误代码："
																+ xhr.status + "<br> 错误描述：" + xhr.statusText + "</p>" + "<p>页面加载失败，请稍候重试！</p><br/>";
														$("#tabContent #" + tableId).html(loadFailed);
													} else {
														// 页面加载完成再加载JS脚本
														$.getScript("/resources/js/" + moduleName + "/" + tableId + ".js").fail(function() {
															showErrorDialog(contentDiv, "错误", "脚本加载失败，请关闭页面重试！", null);
														});
													}
												});
							}
						});
	}

	/**
	 * 登出系统
	 */
	function logout() {
		$.get("json/auth/logout.json", function(ret) {
			showInfoDialog(null, "操作成功", "您已经退出系统", function() {
				// 跳转到登陆页面
				location.href = "login.html";
			});
			// 5秒未操作就自动跳转到登陆页面
			setTimeout(function() {
				location.href = "login.html";
			}, 5000);
		});
	}

	/**
	 * 用户配置文件
	 */
	function profile() {
		
		showSuccessDialog(null, "用户配置文件", "这个是没有做的", null); 
	}
	/**
	 * 修改密码
	 */
	function changePwd() {
		showConfirmDialog(null, "确认？", "确认要修改密码？", null, function(){
			showInfoDialog(null, "呵呵", "这个也是没有做的", null); 	
		}); 
	}
	
	/**
	* 显示任务列表
	*/
	function showTask(){
		location.href = "error.html";
	}
	
	/**
	* 显示邮件列表
	*/
	function showEmail(){
		showSuccessDialog(null, "通知列表", "这个是没有做的", null); 
	}

	// 用户配置文件
	$("#profile").click(profile);
	// 修改登录密码
	$("#changePwd").click(changePwd);
	// 退出系统
	$("#logout").click(logout);

	// 任务列表
	$("#taskBadge").click(showTask);
	$("#taskMenu").click(showTask);
	
	// 通知列表
	$("#emailBadge").click(showEmail);
	$("#emailMenu").click(showEmail);

	// 启动时加载模块信息
	loadModule();

});