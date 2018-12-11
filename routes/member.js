const express = require('express');
const pool = require('../pool.js');
var router = express.Router();

// 查询 member 数据库
router.get('/list',(req,res)=>
{
    var type = req.query.type;
    if(type != 'inLab' && type != 'isGraduated')
    {
        res.send({code:400,msg:"传入查询指令错误!"});
        return;
    }
    var sqlInLab = `SELECT mid,mname, real_name_cn,email,photo_url,pos_desc,job_desc,fix_tel,pre_type,now_type FROM members WHERE isInlab = 1 AND isExh = 1`;
    var sqlIsGraduated = `SELECT mid,mname, real_name_cn,email,photo_url,pos_desc,job_desc,fix_tel,pre_type,now_type FROM members WHERE isInLab = 0 OR pre_type != now_type AND isExh = 1`;
    if(type == 'inLab' )
    {
        pool.query(sqlInLab,(err,results)=>
        {
            if(err) throw err;
            if(results.length > 0)
            {
                //res.send({code:200,data:results});
                var resObj = addData(results,type);
                res.send({code:200,data:resObj});
            }
        });
    }
    if(type == 'isGraduated' )
    {
        pool.query(sqlIsGraduated,(err,results)=>
        {
            if(err) throw err;
            if(results.length > 0)
            {
              //console.log(results);
              //res.send({code:200,data:results});
                var resObj = addData(results,type);
                res.send({code:200,data:resObj});
            }
        });
    }
});

// 对数据库返回数据进行分类

function addData(data,signal){
    // signal -> 1-> inLab   0-> isGraduated
    signal = signal==='inLab' ? 1:0;
    var classifiedData = classify(data);
    var contentObj = {
        teacher: ['',0],
        postDoc: ['',0],
        doctor: ['',0],
        master: ['',0]
    };
    for(var key in classifiedData)
    {   // 修改标题
        // 拼接内容
        for(var obj of classifiedData[key])
        {
            if(signal == 1)
            {   // 如果访问团队成员页
                if(obj.now_type == 1)
                {
                    contentObj.teacher[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                    contentObj.teacher[1]++;
                }
                if(obj.now_type == 2)
                {
                    contentObj.postDoc[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.postDoc[1]++;
                }
                if(obj.now_type == 3)
                {
                    contentObj.doctor[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.doctor[1]++;
                }
                if(obj.now_type == 4)
                {
                    contentObj.master[0] += joinStr(obj.mid,obj.mname, obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.master[1]++;
                }
            }
            else
            {
              // 访问毕业成员页
                if(obj.now_type == 1)
                {
                    contentObj.teacher[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                    contentObj.teacher[0]++;
                }
                if(obj.now_type == 5 || obj.pre_type == 2)
                {
                    contentObj.postDoc[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.postDoc[1]++;
                }
                if(obj.now_type == 6 || obj.pre_type == 3)
                {
                  contentObj.doctor[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.doctor[1]++;
                }
                if(obj.now_type == 7 || obj.pre_type == 4)
                {
                    contentObj.master[0] += joinStr(obj.mid,obj.mname,obj.photo_url,obj.real_name_cn,obj.pos_desc,obj.job_desc,obj.fix_tel,obj.email,signal);
                  contentObj.master[1]++;
                }
            }
        }
    }
  return contentObj;
}

// 拼接字符串
function joinStr(mid,mname,photoUrl,name,posiDesc,jobDesc,fixTel,email,signal){
  return `<div class="item col-12 col-md-6">
               <div class="d-flex bg-color">
                   <div class="photo">
                       <a href="../members/${mname.toLowerCase()}.html" target="_self">
                           <img src="../../images/members/photo/${photoUrl}" onerror="notFind(this)">
                       </a>
                   </div>
                   <table>
                       <tr>
                         <td class="name"><a href="../members/${mname.toLowerCase()}.html" target="_self">${name}</a></td>
                         <td> ${posiDesc=='#'||signal==0?'':posiDesc}</td>
                       </tr>
                       ${fixTel=='#'||signal==0?'':`
                        <tr>
                          <td>Tel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</td>
                          <td>${fixTel}</td>
                        </tr>
                       `}                       
                       <tr>
                         <td>E-mail&nbsp;:</td>
                         <td>${email}</td>
                       </tr>
                       ${jobDesc=='#'||signal==1?'':`
                        <tr>
                         <td>现工作:</td>
                         <td>${jobDesc}</td>
                       </tr>
                       `}                       
                   </table>
               </div>
           </div>`;
}



// 分类
function classify(data){
  // data -> [{},{}..]
  // 数据按 {}.type 分类
  var cObj = {
    /* teacher: [ {t1},{t2} ]   */
  };
  cObj.teacher = [];
  cObj.postDoc = [];
  cObj.doctor = [];
  cObj.master = [];
  for(var key of data)
  {
    if(key.now_type == 1)
    {   // 导师
      cObj.teacher.push(key);
    }
    if(key.now_type == 2 || key.now_type == 5)
    {   // 博后 / 出站博后
      cObj.postDoc.push(key);
    }
    if(key.now_type == 3 || key.now_type == 6)
    {   // 博士 / 毕业博士
      cObj.doctor.push(key);
    }
    if(key.now_type == 4 || key.now_type == 7)
    {   // 毕业硕士
      cObj.master.push(key);
    }
  }
  return cObj;
}
















module.exports = router;