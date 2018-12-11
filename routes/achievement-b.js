/*
   user 模块路由器
*/

const express = require('express');
const pool = require('../pool.js');
var router = express.Router();


var n,num;
router.get('/list',(req,res)=>
{
    let obj = req.query;  // {num: , n: , type:}
    let $start = (obj.n-1)*obj.num;  // 计算起始查询位置
    n = obj.n;
    num = obj.num;
    if(!obj.num)
    {
        res.send({code:402,msg:'num required'});
        return;
    }
    if(!obj.n)
    {
        res.send({code:401,msg:'n required'});
        return;
    }
    // 这里 表名 不能通过 ？ 来添加,否则无法查询！
    var sqlJour=`SELECT title,detail,all_author,all_author_mid,pub_year,url,isExh,(SELECT COUNT(*) FROM ${obj.type}) as total FROM ${obj.type} ORDER BY pub_year DESC LIMIT ?,?;`;
    var sqlOther = `SELECT title,detail,all_author,all_author_mid,pub_year,isExh,(SELECT COUNT(*) FROM ${obj.type}) as total FROM ${obj.type} ORDER BY pub_year DESC LIMIT ?,?;`;
    pool.query(obj.type=='journal_article'?sqlJour:sqlOther,[$start,+obj.num],(err,results)=>
    {
        if(err) throw err;
        if (results.length > 0)
        {
            // results -> [{obj},{} ...]
            // {obj} -> {title,detail,all_author,all_author_mid,pub_year,url,isExh,total}
            var htmlArr = addData(results);
            var totalNum = results[0].total;
            res.send({code:200,html:htmlArr[0],info:htmlArr[1],msg:"Success",total:totalNum});
        }
        else
        {
            res.send({code:402,msg:`<span>query ${obj.type} list error</span>`});
        }
    });

});

router.get('/query',(req,res)=>
{
  // 限制以空格连接关键字
  var kws = req.query.kws.trim().toLowerCase();
  var reg2 = /^[^\w]+$/;           // 这里包括了全中文情况
  var reg = /^[\u4e00-\u9fa5]+$/;  // 这里反复出现问题的原因是正则使用 g ,会在 test() 方法中发生继续向后查找的问题
  if(reg2.test(kws) && !(reg.test(kws)))
  {
    res.send({code:400,msg:"<span>抱歉,未查询到相关记录！</span>"});
    return;
  }
  if(!kws)  // 如果查询为空
  {
    res.send({code:400,msg:"<span>抱歉,未查询到相关记录！</span>"});
    return;
  }
  // 把所有非字母/汉字/_的字符转换为空格
  var regReplace = /[^\w\u4e00-\u9fa5]+/g;
  kws = kws.replace(regReplace,' ').trim();
  // 以空格分割关键字
  var regSpace = /\s+/g;
  var kwsArr = kws.split(regSpace);
  // 是否是四位纯数字，以查询年份信息
  var regYear = /^[0-9]{4}$/;
  var queryStr = '';
  for(var k of kwsArr)
  {
    var midArr = getMidArr(k);
    if(midArr.length>0) // 是人名
    {
      for(var i=0;i<midArr.length;i++)
      {
        if(queryStr)   // 判断此句是否为第一句
          {
            if(i==0)
            {
              queryStr += ` AND (all_author_mid like '%${midArr[i]}%' `;
            }
            if(i==midArr.length-1)
            {
              queryStr += ` OR all_author_mid like '%${midArr[i]}%' ) `;
            }
            else
            {
              queryStr += ` OR all_author_mid like '%${midArr[i]}%' `;
            }
          }
        else
          {
            if(i==0)
            {
              queryStr += ` ( all_author_mid like '%${midArr[i]}%' `;
            }
            if(i==midArr.length-1)
            {
              queryStr += ` OR all_author_mid like '%${midArr[i]}%' ) `;
            }
          }
      }
    }
    else if(regYear.test(k)) // 是年份
    {
      if(queryStr)   // 判断此句是否为第一句
        queryStr += ` AND pub_year like '%${k}%' `;
      else
        queryStr += ` pub_year like '%${k}%' `;
    }
    else                     // 普通字符串
    {
      var s = k.replace('_',' ');
      if(queryStr)   // 判断此句是否为第一句
        queryStr += ` AND (title LIKE '%${s}%' OR detail LIKE '%${s}%') `;
      else
        queryStr += ` (title LIKE '%${s}%' OR detail LIKE '%${s}%') `;
    }
  }
  // type -> 会议/报告-> conf_article | 区->期刊 | 专利->patent
  queryStrJour = ` SELECT title,detail,all_author,all_author_mid,pub_year,type,url,isExh,(select Count(title) from journal_article where ${queryStr} ) as total FROM journal_article WHERE ${queryStr} `;
  queryStrConf = ` SELECT title,detail,all_author,all_author_mid,pub_year,type,url,isExh,(select Count(title) from conf_article where ${queryStr} ) as total FROM conf_article WHERE ${queryStr}  `;
  queryStrPatent = ` SELECT title,detail,all_author,all_author_mid,pub_year,type,url,isExh,(select Count(title) from patent where ${queryStr} ) as total FROM patent WHERE ${queryStr} ;`;

    var sql = `
      ${queryStrJour}
      UNION ALL
      ${queryStrConf}
      UNION ALL
      ${queryStrPatent}
    `;
  pool.query(sql,[],(err,results)=>
    {
        if(err) throw err;
        if(results.length>0)
        {
            var htmlArr = addData(results,kwsArr);
            res.send({code:200,html:htmlArr[0],info:htmlArr[1],msg:"Success"});
        }
        else
        {
            res.send({code:400,msg:"<span>抱歉,未查询到相关记录！</span>"});
            return;
        }
    });
});

/*----------------- 将数据拼接 html 字符串 --------------------*/
function addData(data,kwsArr){
  // 查询数据 [{title,detail,all_author,all_author_mid,pub_year,[type,url,] isExh,total},...]
  // 表格添加
  var tHead = `<table><tr><td class="title">序号</td><td class="title">文章/作者</td><td class="title">发表时间</td></tr>`;
  var tBody = '';
  var tFoot = '</table>';

  // 循环遍历 data 数据
  var info = `<span>共 ${data[0].total} 篇文章记录！</span>`;

  if(kwsArr !== undefined)
  {
    n = 1;
    var jourSum = 0;
    var confSum = 0;
    var patentSum = 0;
    for(let i=0;i<data.length;i++)
    {
      if(!data[i].type) //-> jour_article
        jourSum = data[i].total;
      if(data[i].type.includes('区'))
        jourSum = data[i].total;
      if(data[i].type.includes('专利'))
        patentSum = data[i].total;
      if((/报告|会议/).test(data[i].type))
        confSum = data[i].total;
    }
    info = `
      <p>通过搜索关键字:<span>${kwsArr}</span>.查询得到<span>${data.length}</span>篇相关记录！其中:</p>
      <ul>
        <li><span>${jourSum}</span>篇期刊文章</li>
        <li><span>${confSum}</span>篇会议文章</li>
        <li><span>${patentSum}</span>篇专利</li>
      </ul>
    `;
  }

  tBody = data.reduce(preDeal,'');

  if(kwsArr !== undefined)
  {   // 高亮关键词
    kwsArr = getNameArr(kwsArr);

    for(let name of kwsArr)
    {
      var regKws = new RegExp(`${name}`,'ig');
      tBody = tBody.replace(regKws,`<mark>${name}</mark>`);
    }
  }
  return [(tHead + tBody + tFoot),info];
}

/*----------------- 字符拼接 --------------------*/
function preDeal(prev,obj,index,arr){
  //{title,detail,all_author,all_author_mid,pub_year,[type,] url,isExh,total}
  n = n || 1;
  num = num || 1;
  var start = (n-1)*num;
  if(obj.isExh == 1) // 确认展示
  {
    var authorArr = obj.all_author.replace('and','').split(',');
    var authorListArr = [];
    authorArr.map(ele=>
    {
      if(ele.trim())
        authorListArr.push(ele.trim());
    });
    var authorMidArr = obj.all_author_mid.split('#');
    authorMidArr.pop(); // 最后一个元素原为 '';
    var nameString = '';
    // 处理人名链接 <p> /之内的部分/  </p>
    var regName = /[a-z\s]+/ig;  // Yiping Wang*
    for(let i=0;i<authorListArr.length;i++)
    {
      if(authorMidArr[i]!=' ' && regName.test(authorListArr[i]) )  // 中文名无法添加链接
      {   // 如果人名 mid 不为空, 添加 a 链接.此链接还需要后期确定
        if(i == authorListArr.length-1)
        {
          nameString += `${authorListArr.length==1?'':'and'} <a href="../members/${authorListArr[i].match(regName)[0].toLowerCase().split(' ').join('-')}.html" target="_self">${authorListArr[i]}.</a>`;
        }
        else{
          nameString += `<a href="../members/${authorListArr[i].match(regName)[0].toLowerCase().split(' ').join('-')}.html" target="_self">${authorListArr[i]}, </a>`;
        }
      }
      else
      {
        //console.log(`空人物：,'${authorMidArr[i]}'`);
        nameString += `${authorListArr[i]}, `;
      }
    }
    // 判断 url 是否存在？
    if(obj.url)
    {
      return prev+`<tr><td>${start+index+1}</td><td><p>${nameString}</p><p><a href="../papers/${obj.url}.pdf" target="_blank">"${obj.title}"</a></p><p>${obj.detail}</p></td><td>${obj.pub_year}</td></tr>`;
    }
    else{
      return prev+`<tr><td>${start+index+1}</td><td><p>${nameString}</p><p>"${obj.title}"</p><p>${obj.detail}</p></td><td>${obj.pub_year}</td></tr>`;
    }
  }
}

var nameMap = {
  "SZU-COFS-001T":["王义平","Yiping Wang","WangYiping"],
  "SZU-COFS-002T":["廖常锐","Changrui Liao","LiaoChangrui"],
  "SZU-COFS-003T":["王英","Ying Wang","WangYing"],
  "SZU-COFS-005M":["钟晓勇","Xiaoyong Zhong","ZhongXiaoyong"],
  "SZU-COFS-006M":["周江涛","Jiangtao Zhou","ZhouJiangtao"],
  "SZU-COFS-007M":["刘颖洁","Yingjie Liu","LiuYingjie"],
  "SZU-COFS-008P":["王冠军","Guanjun Wang","WangGuanjun"],
  "SZU-COFS-009P":["尹国路","Guolu Yin","YinGuolu"],
  "SZU-COFS-010P":["孙兵","Bing Sun","SunBing"],
  "SZU-COFS-011PT":["何俊","Jun He","HeJun"],
  "SZU-COFS-022PT":["白志勇","Zhiyong Bai","BaiZhiyong"],
  "SZU-COFS-012P":["赵静","Jing Zhao","ZhaoJing"],
  "SZU-COFS-013DP":["唐剑","Jian Tang","TangJian"],
  "SZU-COFS-014MD":["杨凯明","Kaiming Yang","YangKaiming"],
  "SZU-COFS-015D":["徐锡镇","Xizhen Xu","XuXizhen"],
  "SZU-COFS-016M":["王侨","Qiao Wang","WangQiao"],
  "SZU-COFS-017P":["汪超","Chao Wang","WangChao"],
  "SZU-COFS-018D":["刘申","Shen Liu","LiuShen"],
  "SZU-COFS-019M":["谭展","Zhan Tan","TanZhan"],
  "SZU-COFS-020MD":["黄益建","Yijian Huang","HuangYijian"],
  "SZU-COFS-021M":["邓蜜","Mi Deng","DengMi"],
  "SZU-COFS-023P":["李明全","Mingquan Li","LiMingquan"],
  "SZU-COFS-025M":["杨天航","Tianhang Yang","YangTianhang"],
  "SZU-COFS-026M":["许金山","Jinshan Xu","XuJinshan"],
  "SZU-COFS-027M":["曹绍情","Shaoqing Cao","CaoShaoqing"],
  "SZU-COFS-028MD":["张哲","Zhe Zhang","ZhangZhe"],
  "SZU-COFS-029MD":["郭奎奎","Kuikui Guo","GuoKuikui"],
  "SZU-COFS-030M":["朱峰","Feng Zhu","ZhuFeng"],
  "SZU-COFS-031P":["张峰","Feng Zhang","ZhangFeng"],
  "SZU-COFS-032P":["伍铁生","Tiesheng Wu","WuTiesheng"],
  "SZU-COFS-033P":["侯茂祥","Maoxiang Hou","HouMaoxiang"],
  "SZU-COFS-034VM":["刘聪","Cong Liu","LiuCong"],
  "SZU-COFS-035VD":["张聪哲","Congzhe Zhang","ZhangCongzhe"],
  "SZU-COFS-036VM":["王巧妮","Qiaoni Wang","WangQiaoni"],
  "SZU-COFS-037M":["林初跑","Chupao Lin","LinChupao"],
  "SZU-COFS-038P":["班建峰","Jianfeng Ban","BanJianfeng"],
  "SZU-COFS-039M":["李自亮","Ziliang Li","LiZiliang"],
  "SZU-COFS-040M":["王佳","Jia Wang","WangJia"],
  "SZU-COFS-041M":["张龙飞","Longfei Zhang","ZhangLongfei"],
  "SZU-COFS-042M":["邵宇","Yu Shao","ShaoYu"],
  "SZU-COFS-043M":["张岩","Yan Zhang","ZhangYan"],
  "SZU-COFS-044T":["周慕蓉","Murong Zhou","ZhouMurong"],
  "SZU-COFS-045M":["张云芳","Yunfang Zhang","ZhangYunfang"],
  "SZU-COFS-046M":["李驰","Chi Li","LiChi"],
  "SZU-COFS-047M":["鞠帅","Shuai Ju","JuShuai"],
  "SZU-COFS-048M":["毛淳","Chun Mao","MaoChun"],
  "SZU-COFS-050M":["黄伟","Wei Huang","HuangWei"],
  "SZU-COFS-051P":["周鹏","Peng Zhou","ZhouPeng"],
  "SZU-COFS-052P":["柏云龙","Yunlong Bai","BaiYunlong"],
  "SZU-COFS-053P":["孙仲元","Zhongyuan Sun","SunZhongyuan"],
  "SZU-COFS-024DP":["付彩玲","Cailing Fu","FuCailing"],
  "SZU-COFS-054P":["王彩","Cai Wang","WangCai"],
  "SZU-COFS-004MDP":["李正勇","Zhengyong Li","LiZhengyong"],
  "SZU-COFS-055P":["蔡贵龙","Guilong Cai","CaiGuilong"],
  "SZU-COFS-056P":["王佳晨","Jiachen Wang","WangJiachen"],
  "SZU-COFS-057P":["张莉超","Lichao Zhang","ZhangLichao"],
  "SZU-COFS-058P":["余建","Jian Yu","YuJian"],
  "SZU-COFS-059D":["杜斌","Bin Du","DuBin"],
  "SZU-COFS-060M":["张凤婵","Fengchan Zhang","ZhangFengchan"],
  "SZU-COFS-061M":["韩金利","Jinli Han","HanJinli"],
  "SZU-COFS-062M":["刘雪雅","Xueya Liu","LiuXueya"],
  "SZU-COFS-063M":["朱梦","Meng Zhu","ZhuMeng"],
  "SZU-COFS-064M":["王静如","Jingru Wang","WangJingru"],
  "SZU-COFS-065M":["吴晗","Han Wu","WuHan"],
  "SZU-COFS-066D":["邵来鹏","Laipeng Shao","ShaoLaipeng"],
  "SZU-COFS-067M":["李亚莉","Yali Li","LiYali"],
  "SZU-COFS-068M":["刘朝","Zhao Liu","LiuZhao"],
  "SZU-COFS-069M":["丘志鸿","Zhihong Qiu","QiuZhihong"],
  "SZU-COFS-070M":["熊聪","Cong Xiong","XiongCong"],
  "SZU-COFS-071M":["赵媛媛","Yuanyuan Zhao","ZhaoYuanyuan"]
};

function getMidArr(nameStr){
  var midArr = [];
  for(let key in nameMap)
  {
    for(let name of nameMap[key])
    {
      if(name.toLowerCase().includes(nameStr))
      {
        if(midArr.indexOf(key) === -1)
          midArr.push(key);
      }
    }
  }
  return midArr;
}

function getNameArr(kwsArr){
  var names = [];
  for(let kws of kwsArr)
  {
    var midArr = getMidArr(kws);
    if(midArr.length>0)  // 是人名
    {
      for(let mid of midArr)
      {
        names = names.concat(nameMap[mid]);
      }
    }
    else
      names.push(kws);  // 不是人名重新放回
  }
  return names;
}






module.exports = router;