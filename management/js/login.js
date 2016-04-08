$(function() {// 加载执行

	// 初始化弹出框
	$('#emailGroup').popover({
		html : true,
		content : "<strong class='text-danger'>用户名或密码错误</strong>",
		container : 'body',
		placement : 'top',
		trigger : 'manual'
	});

	$('#captchaGroup').popover({
		html : true,
		content : "<strong class='text-danger'>验证码错误</strong>",
		container : 'body',
		placement : 'top',
		trigger : 'manual'
	});

	// 切换验证码
	$("#captcha_btn").click(function() {
		$("#captcha_img").attr("src", "img/captcha"+parseInt(10*Math.random())%3+".jpg?r=" + Math.random());
	});

	// 表单提交
	$("form").submit(function() {
		var captch = $("#captcha").val();

		if (captch.length != 4) {
			captchaError();
			return false;
		}

		$.post("json/auth/login.json", $("form").serialize(), function(data) {

			if (data.success) {
				// 跳转到首页
				location.href = "home.html";
			} else {
				if (data.errorCode == "captchaError") {
					captchaError();
				} else {
					loginError();
				}
			}
		});
		return false;
	});

	// 添加事件，获取光标时触发事件
	$("#inputEmail , #inputPassword").focus(function() {
		$('#emailGroup').popover('hide');
	});

	$("#captcha").focus(function() {
		$('#captchaGroup').popover('hide');
	});

	//提示信息
	showInfoDialog(null, "提示", "全部都是静态页面，随便填~~", null); 
});

/**
 * 验证码错误
 */
function captchaError() {
	popoverClear("#captchaGroup");
}
/**
 * 登录错误
 */
function loginError() {
	popoverClear("#emailGroup");
}

/**
 * 弹出提示，并清空验证码
 * 
 * @param id
 *            popover ID
 */
function popoverClear(id) {
	$(id).popover('show');
	// 清空验证码
	$("#captcha").val("");
	// 切换验证码
	$("#captcha_btn").click();

	setTimeout(function() {
		$(id).popover('hide');
	}, 3000);
}
