/*
   1. 验证登录时是否输入用户名/密码
*/
function loginTestBlur(attr){   // 将操作节点的 name 属性值 attr 传入
   var xhr = getXhr(); 
   var tagName = `[name="${attr}"]`;
   var val = $(tagName).value;  // 获取 name='attr' 的节点的 value 值
   var queryStr = `?${attr}=${val}`; 
   var nameSpan = $('#nameSpan');
   var pwdSpan = $('#pwdSpan');
   var sub = $('#submit');
   xhr.onreadystatechange = function(){
     if (4 == xhr.readyState && 200 == xhr.status)
     {
		 var res = xhr.responseText;
		 var resObj = JSON.parse(res);
		 var code = resObj.code;
		 var msg = resObj.msg;
		 if (code == 401)
		 {
			 nameSpan.style.color = 'red';
		 }
		 else if (code == 402)
		 {
			 pwdSpan.style.color = 'red';
		 }
		 else if (code == 201)
		 {
             nameSpan.style.color = '#aaa';
		 } 
		 else 
		 {  		 
		     pwdSpan.style.color = '#aaa';
		 }
         
     }
   }
   xhr.open('get','/user/login'+queryStr,true);  // 路由传参
   xhr.send(null);
}

/*
   2. 验证用户名 / 密码是否正确
*/
function loginCheck(){
   var xhr = getXhr(),
       unameTag = $('[name="uname"]'),
       upwdTag = $('[name="upwd"]'),
	   loginInfo = $('#loginInfo'),
	   uname = unameTag.value,
	   upwd = upwdTag.value;
   xhr.onreadystatechange = function(){
     if (4 == xhr.readyState && 200 == xhr.status)
     {
		 var res = xhr.responseText,
		     resObj = JSON.parse(res),
			 code = resObj.code,
			 msg = resObj.msg;
		 if (code == 200)
		 {
			 loginInfo.style.color = '#aaa';
             loginInfo.innerText = msg;
		 }
		 else if (code == 400)
		 {
			 loginInfo.style.color = 'red';
			 loginInfo.innerText = msg;
		 }
		 
     }
   }
   xhr.open('get','/user/loginCheck'+`?uname=${uname}&upwd=${upwd}`,true);
   xhr.send(null);
}


function loginFocus(attr)
{   
   var nameSpanTag = $('#nameSpan'),
	   pwdSpanTag = $('#pwdSpan'),
	   loginInfoTag = $('#loginInfo');
   if (attr == 'uname')
   {   
	   console.log(attr);
       nameSpanTag.style.color = '#aaa';
	   loginInfoTag.innerText = '';
   } 
   else 
   {
       pwdSpanTag.style.color = '#aaa';
	   loginInfoTag.innerText = '';
   }
}










