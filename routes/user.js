/*
   user 模块路由器
*/

const express = require('express');
const pool = require('../pool.js');
var router = express.Router();

/*
router.post('/login',(req,res)=>
{
    var obj = req.body;
    var $uname = obj.uname;
	var $upwd = obj.upwd;
	if (!$uname)
	{
		res.send({code:401,msg:'uname required'});
	    return;
	}
	if (!$upwd)
	{
		res.send({code:401,msg:'upwd required'});
	}
    var sql='SELECT * FROM user WHERE uname=? AND upwd=?;';
	pool.query(sql,[$uname,$upwd],(err,results)=>
		{
		    if(err) throw err;
			if (results.length > 0)
			{
				res.send({code:200,msg:'login success!'});
				return;
			}
			else 
			{
			    res.send({code:401,msg:'login failed!'});
			}

	    });

});
*/

router.get('/login',(req,res)=>
{
    var obj = req.query;
    if ('uname' in obj)      // 如果操作的用户名输入框
    {   
       var $uname = obj.uname;
       if (!$uname)
       {                   // 用户名不能为空
		   res.send({code:401,msg:"用户名不能为空!"});
		   return;
       }
	   else{res.send({code:201,msg:""});}
    }
	else if ('upwd' in obj) // 操作的时密码输入框
	{
       var $upwd = obj.upwd;
	   if (!$upwd)
	   {
		   res.send({code:402,msg:"密码不能为空!"});
	   }
	   else{res.send({code:202,msg:""});}
	}
});

router.get('/loginCheck',(req,res)=>
{
   var obj = req.query,
       $uname = obj.uname,
	   $upwd = obj.upwd,
       sql = 'SELECT * FROM user WHERE uname=? AND upwd=?;';
   
   pool.query(sql,[$uname,$upwd],(err,result)=>
   {
	   if (err)
	   {
		   throw err;
	   }
	   if (result.length > 0)
	   {
		   res.send({code:200,msg:"登录成功!"});
	   }
	   else
       {
		   res.send({code:400,msg:"密码验证失败,请重新登录!"});
	   }
   
   });
});

/*
   注册页面 uname 验证
*/
router.get('/unameCheck',(req,res)=>
{
	var obj = req.query;
	var $uname = obj.uname;
	if (!$uname)
	{   // 注册用户名不能为空
		res.send({code:401,msg:"*用户名不能为空"});
		return;
	}
	var reg = new RegExp('[a-zA-Z0-9\-\_\\u4e00-\\u9fa5]','g');
	var flage = reg.test($uname);
    var len = $uname.length;
	if (!flage)
	{   // 注册用户名只能使用 数字,字母, _ , -
		res.send({code:402,msg:"*用户名字符不合法"});
		return;
	}
	if (len<6)
	{  // 长度限制
		res.send({code:403,msg:"*用户名长度过短"});
		return;
	}
	else if (len>12)
	{
		res.send({code:404,msg:"*用户名长度过长"});
		return;
	}
	else
    {
		res.send({code:200,msg:"*用户名设置成功"});
		return;
	}

});


/*
   注册页面 upwd 验证
*/
router.get('/upwdCheck',(req,res)=>
{
	var obj = req.query;
	var $upwd = obj.upwd;
	if (!$upwd)
	{   // 注册用户名不能为空
		res.send({code:401,msg:"*密码不能为空"});
		return;
	}
	var reg = new RegExp('[a-zA-Z0-9\-\_]','g');
	var flage = reg.test($upwd);
    var len = $upwd.length;
	if (!flage)
	{   // 注册密码只能使用 数字,字母, _ , -
		res.send({code:402,msg:"*密码输入不合法"});
		return;
	}
	if (len<6)
	{  // 长度限制
		res.send({code:403,msg:"*密码长度过短"});
		return;
	}
	else if (len>12)
	{
		res.send({code:404,msg:"*密码长度过长"});
		return;
	}
	else
    {
		res.send({code:200,msg:"*密码设置完成"});
		return;
	}

});


/*
   注册页面 secUpwd 验证
*/
router.get('/secUpwdCheck',(req,res)=>
{
	var obj = req.query;
	var $secUpwd = obj.secUpwd;
	var $upwd = obj.upwd;
	if (!$secUpwd)
	{
        res.send({code:400,msg:"*密码不能为空"});
		return;
	}
	if ($upwd !== $secUpwd)
	{   // 注册密码两次不相同
		res.send({code:401,msg:"*两次密码须相同"});
		return;
	}
	else 
    {
		res.send({code:200,msg:"*密码设置成功"});
		return;
	}

});
















module.exports = router;