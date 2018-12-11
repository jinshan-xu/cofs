// admin 用户模块

const express = require('express');
const pool = require('../pool.js');
var router = express.Router();

/*------------------------- 向数据库添加新成员信息 ---------------------------*/
router.post('/add-member',(req,res)=>
{
    var obj = req.body;
    var $mid = obj.mid,
        $mname = obj.mname,
        $mpwd = obj.mpwd,
        $tel = obj.tel,
        $email = obj.email,
        $realNameCn = obj.real_name_cn,
        $realNameEng = obj.real_name_eng,
        $type = obj.type,
        $isExh = obj.isExh;
    // 检测输入信息
    // tel
    var regTel = /\d{11}/g;
    if(!regTel.test($tel))
    {
        res.send({code:401,msg:"*请输入正确联系方式!"});
        return;
    }
    // email
    var regEmail = /^([0-9a-zA-Z\_\-\.\s]+)@([0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}(\.[a-z]{2,3})?(\.[a-z]{2,3})?)$/g;
    if(!regEmail.test($email))
    {
        res.send({code:402,msg:"*请输入正确邮箱格式!"});
        return;
    }
    // realNameEn
    var regName = /^([a-z]+)\-([A-Z]{1}[a-z]+)$/g;
    if(!regName.test($realNameEng))
    {
        res.send({code:403,msg:"*请输入正确姓名拼音!"});
        return;
    }
    // 暂时不开通上传头像功能！

    // 验证 mid 是否存在
    var sqlMid = 'SELECT mid FROM members WHERE mid = ?';
    pool.query(sqlMid,$mid,(err,results)=>
    {
        if(err) throw err;
        if("mid" in results[0])
        {
            res.send({code:400,msg:"* 用户编号已存在,请重新输入!"});
            flage = true;
            return;
        }
        else
        {
            // 写入数据库
            var sql = 'INSERT INTO members SET ?';
            pool.query(sql,obj,(err,results)=>
            {
                if(err) throw err;
                if (results.affectedRows > 0)
                {
                    res.send({code:200,msg:"*新增成员成功!"});
                    return;
                }
                else
                {
                    res.send({code:405,msg:"*新增用户失败!"});
                    return;
                }
            });
        }
    });

});

/*------------------------- 向数据库添加文章信息 ---------------------------*/
router.post('/addArticle',(req,res)=>
{
    var obj = req.body;
    var sql = 'INSERT INTO journal_article SET ?';
    pool.query(sql,obj,(err,results)=>
    {
        if(err) throw err;
        if(results.affectedRows>0)
        {
            res.send({code:200,msg:"*添加成功！"});
            return;
        }
        else
        {
            res.send({code:401,msg:"*添加失败！"});
            return;
        }
    });
});

/*------------------------- 向数据库添加会议文章信息 --------------------------*/
router.post('/addConArticle',(req,res)=>
{
    var obj = req.body;
    var sql = 'INSERT INTO conf_article SET ?';
    pool.query(sql,obj,(err,results)=>
    {
        if(err) throw err;
        if(results.affectedRows>0)
        {
            res.send({code:200,msg:"*添加成功！"});
            return;
        }
        else
        {
            res.send({code:401,msg:"*添加失败！"});
            return;
        }
    });
});

/*------------------------- 向数据库添加专利信息 --------------------------*/
router.post('/addPatent',(req,res)=>
{
    var obj = req.body;
    var sql = 'INSERT INTO patent SET ?';
    pool.query(sql,obj,(err,results)=>
    {
        if(err) throw err;
        if(results.affectedRows>0)
        {
            res.send({code:200,msg:"*添加成功！"});
            return;
        }
        else
        {
            res.send({code:401,msg:"*添加失败！"});
            return;
        }
    });

});



/*------------------------- add_journal_article 返回作者姓名/mid ---------------------------*/
router.get('/authorList',(req,res)=>
{
    var sql = 'SELECT real_name_eng,real_name_cn,mid FROM members ORDER BY now_type';
    pool.query(sql,(err,results)=>
    {
        if(err) throw err;
        if(results.length>0)
        {
            var nameCn = [];
            var mids = [];
            var nameEng = [];
            for(let i=0;i<results.length;i++)
            {
                nameEng.push(results[i].real_name_eng);
                nameCn.push(results[i].real_name_cn);
                mids.push(results[i].mid);
            }
            res.send({code:200,msg:"*初始化作者列表成功！",nameEngList:nameEng,nameCnList:nameCn,midList:mids});
            return;
        }
        else{
            res.send({code:400,msg:"*初始化作者列表失败！"});
            return;
        }
    });
});


/*************************** memberList 人员列表 **************************/
router.get('/memberList',(req,res)=>{
  var sql = `SELECT real_name_cn,email,mid,now_type FROM members ORDER BY now_type ASC , mid ASC `;
  pool.query(sql,[],(err,results)=> {
    if (err) throw err;
    if (results.length > 0)
    {
      res.send({code:200,msg:results});
    }
  });
});

/*************************** getMemberInfo 获取人员详细信息 **************************/
router.get('/getMemberInfo',(req,res)=>{
  var mid = req.query.mid;
  var sql = `SELECT mid, tel, email, real_name_cn, real_name_eng, gender, pos_desc, job_desc, pre_type, now_type, addr, nav_place, isInLab, isExh FROM members WHERE mid = ?`;
  pool.query(sql,[mid],(err,results)=>{
    if(err) throw err
    if(results.length>0)
    {
      res.send({code:200,msg:results})
    }
  });
});

/*************************** 提交人员修改信息到数据库 **************************/
router.post('/saveMemberInfo',(req,res)=>{
  var obj = req.body;
  var sql = `UPDATE members SET ? WHERE mid = ?`;
  pool.query(sql,[obj,obj.mid],(err,results)=>{
    if(err) throw err
    if(results.affectedRows == 1)
    {
      res.send({code:200,msg:"修改成功!"})
    }
  });
});

/*************************** 添加新成员 **************************/
router.post('/addMember',(req,res)=>{
  var obj = req.body;
  obj.id = null;
  var sql = `INSERT INTO members SET ? ;`;
  pool.query(sql,[obj],(err,results)=>{
    if(err) throw err;
    if(results.affectedRows == 1)
    {
      res.send({code: 200,msg: "添加成员成功~!"});
    }
  })
});

/*************************** 删除成员 **************************/
router.get('/delMember',(req,res)=>{
  var mid = req.query.mid;
  var sql = `DELETE FROM members WHERE mid = ?`;
  pool.query(sql,[mid],(err,results)=>{
    if(err) throw err;
    if(results.affectedRows == 1)
    {
      res.send({code:200,msg:"删除成功!"});
    }
  });
});

/*************************** 返回 文章/专利 数据 **************************/
router.get('/getArticleList',(req,res)=>{
  var type = req.query.type;
  var sql = `SELECT title,all_author,detail FROM ${type} ORDER BY pub_year DESC;`;
  pool.query(sql,[type],(err,result)=>{
    if(err) throw err;
    if(result.length>0)
      res.send({code:200,msg:result})
  });
});

/*************************** 提交 文章/专利 数据 **************************/
router.post('/addArticleAndPatent',(req,res)=>{
  var obj = req.body;
  obj.id = null;
  var type = obj.selectType;
  delete obj.selectType;
  if(type == 'journal_article') // 为 journal_article 设置 url
  {
    obj.url = obj.pub_year + '-' + obj.all_author.split(',')[0].split(' ').join('-') + '-' + obj.title.split(' ')[0];
  }    
  var sql = `INSERT INTO ${type} SET ? ;`;
  pool.query(sql,[obj],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows > 0)
    {
      res.send({code:200});
    }
    else
      res.send({code:400});
  });
});




module.exports = router;