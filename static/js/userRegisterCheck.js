/*
   1. 用于注册页面验证
*/

/*
   2. AJAX 验证输入用户名的合法性
   function checkUname(val){ }
      1. 验证用户名长度 / 特殊字符 / 是否和已有用户名冲突
*/
function checkUname(val)
{
	var xhr = getXhr();
	var queryStr = '?uname='+val;
	var infoSpan = $('#unameSpan');
	xhr.onreadystatechange = function()
    {
		if (4 == xhr.readyState && 200 == xhr.status)
		{
			var res = xhr.responseText;
            var resObj = JSON.parse(res);
			var flag = (resObj.code == '200');
			if (flag)
			{
				infoSpan.style.color='green';
			}
			else
            {   infoSpan.style.color='red';  }
			submitData(flag);
            infoSpan.innerText = resObj.msg;

		}
	}
	xhr.open('get','/user/unameCheck'+queryStr,true);
    xhr.send(null);
}

/*
   3. AJAX 验证输入密码的合法性
   function checkUpwd(val){ }
      1. 密码长度 / 特殊字符 
*/
function checkUpwd(val)
{
	var xhr = getXhr();
	var queryStr = '?upwd='+val;
	var infoSpan = $('#upwdSpan');
	xhr.onreadystatechange = function()
    {
		if (4 == xhr.readyState && 200 == xhr.status)
		{
			var res = xhr.responseText;
            var resObj = JSON.parse(res);
			var flag = (resObj.code == '200');
			if (flag)
			{
				infoSpan.style.color='green';
			}
			else
            {   infoSpan.style.color='red';  }
			submitData(flag);
            infoSpan.innerText = resObj.msg;

		}
	}
	xhr.open('get','/user/upwdCheck'+queryStr,true);
    xhr.send(null);
}


/*
   4. AJAX 验证两次输入密码是否相同
   function checkSecUpwd(val){ }
      1. 是否和上次密码输入相同
*/
function checkSecUpwd(val)
{
	var xhr = getXhr();
	var upwd = $('[name="upwd"]').value;  // 第一次输入密码
	var queryStr = '?secUpwd='+val+'&upwd='+upwd;
	var infoSpan = $('#secUpwdSpan');
	xhr.onreadystatechange = function()
    {
		if (4 == xhr.readyState && 200 == xhr.status)
		{
			var res = xhr.responseText;
            var resObj = JSON.parse(res);
			var flag = (resObj.code == '200');
			if (flag)
			{
				infoSpan.style.color='green';
			}
			else
            {   infoSpan.style.color='red';  }
			submitData(flag);
            infoSpan.innerText = resObj.msg;

		}
	}
	xhr.open('get','/user/secUpwdCheck'+queryStr,true);
    xhr.send(null);
}



/*
   5. AJAX 生成验证码
      1. 动态生成数字验证码;需要有干扰(暂时不做干扰项)
*/



/*
    6. 设置 submit 按钮是否可以提交注册信息
*/
function submitData(canSubmit){
    var submit = $('[type="submit"]');
	if (canSubmit)
	{
		submit.disabled = false;
	}
	else
    {
		submit.disabled = true;	
	}
}


/*
   7. AJAX 在注册成功提示
      1. 账号密码创建成功,返回创建成功状态
*/
