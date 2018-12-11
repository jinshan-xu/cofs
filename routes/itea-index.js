const express=require("express");
const router=express.Router();
const pool=require("../pool");

// iteaIndex

//  /list  
router.get("/pro-list",(req,res)=>{  
  var result = [];  
  // SELECT GROUP_CONCAT(pid, name, description, img, new_price, old_price, stock), type FROM pro_detail WHERE is_show=1 GROUP BY type
  var sql=`SELECT p.pid, p.name, p.description, p.img, p.new_price, p.dis_count, p.stock, p.type, p.chos_spec, p.spec, p.mate, p.top_mate, p.bot_mate, p.sugar, p.taste, p.sta, p.temp, c.icon_name, c.cname, c.list_order FROM itea_pro_detail p INNER JOIN itea_pro_class c ON p.type=c.type`;
  pool.query(sql,[],(err,result)=>{
    if(err) throw err;
    if(result.length>0)
    {
      console.log(result);
      res.send(result);
    }    
  })
});
//  /class-list
router.get("/class-list",(req,res)=>{
  var sql=`SELECT cid,cname,icon_name,type FROM itea_pro_class WHERE is_show = ?`;
  pool.query(sql,[1],(err,result)=>{
    if(err) throw err;   
    res.send(result);
  })
});

//  /banner
router.get("/banner",(req,res)=>{
  var sql=`SELECT img,bid FROM itea_banner`;
  pool.query(sql,[],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })
});




module.exports=router;