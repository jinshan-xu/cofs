const express=require("express")
const router=express.Router()
const pool=require("../pool")

//  /iteaProducts
//  /list-name
router.get("/list-name",(req,res)=>{
  var sql=`SELECT cid,name,type,img FROM itea_pro_class `;
  pool.query(sql,[],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })
  
})

//  /list
router.get("/list",(req,res)=>{
  var type = req.query.type;
  console.log(type);
  var sql=`SELECT did,name,price,spec,img FROM itea_pro_detail 
		   WHERE type = ?
		`;
  pool.query(sql,[type],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })  
  // 测试 localhost:3000/products/list?type=1001
});

//  /details
router.get("/details",(req,res)=>{
  var did = req.query.did;
  console.log(did);
  var sql=`SELECT did,name,price,spec,img, stock, title, detail, sale_volu FROM itea_pro_detail 
		   WHERE did = ?
		`;
  pool.query(sql,[did],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })  
  // 测试 localhost:3000/products/details?did=431
});




module.exports=router