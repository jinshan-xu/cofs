const express=require("express")
const router=express.Router()
const pool=require("../pool")

//  /supOrder
//  /shoppingcar
router.get("/shoppingcar",(req,res)=>{
  var sql = `SELECT s.pid, s.user_id, s.count_num, s.is_checked, p.img, p.name, p.price, p.spec FROM supermarket_shoppingcar s INNER JOIN supermarket_pro_detail p ON p.did = s.pid`;
  pool.query(sql,[],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })  
  // 测试 localhost:3000/order/shoppingcar
});

//  /list
router.get("/list",(req,res)=>{
  var user_id = req.query.user_id;
  var sql = `SELECT oid, pid, user_id, status, count_num FROM supermarket_p_order WHERE user_id = ?`;
  pool.query(sql,[user_id],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  })    
  // 测试 localhost:3000/order/
});

router.post("/addPro",(req, res)=>{
	// user_id / count_num / pid
  var obj = req.body;  
  var sql = `INSERT INTO supermarket_shoppingcar SET ?`;
  pool.query(sql,[obj],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows > 0)
    {
      res.send({code:1});
    }
    else
      res.send({code:000});
  });
});



module.exports=router