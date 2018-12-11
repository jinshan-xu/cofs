const express=require("express");
const router=express.Router();
const pool=require("../pool");

// supIndex

//  /swiper  
router.get("/swiper",(req,res)=>{
  var sql=`SELECT img FROM supermarket_swiper`;
  pool.query(sql,[],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })
});

//  /banner
router.get("/banner",(req,res)=>{
  var sql=`SELECT img,type,top_img FROM supermarket_banner`;
  pool.query(sql,[],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })
});

//  /new-pro
router.get("/new-pro",(req,res)=>{
  var sql=`SELECT did,name,price,spec,img FROM supermarket_pro_detail
		   WHERE is_new = ? 
		   `;
  pool.query(sql,[1],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })
});









module.exports=router;