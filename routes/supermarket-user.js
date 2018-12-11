const express=require("express")
const router=express.Router()
const pool=require("../pool")

//  /supUser
//  /get-info
router.get("/get-info",(req,res)=>{
  var uid = req.query.uid;
  var sql=`SELECT uid, uname, nickname, phone, birth FROM supermarket_user WHERE uid = ?`;
  pool.query(sql,[uid],(err,result)=>{
    if(err)
      console.log(err);
    res.send(result);
  });  
})

router.post("/add-user", (req,res)=>{
  var obj = req.body;
  var sql=`INSERT INTO supermarket_user SET ?`;
  pool.query(sql, [obj], (err, result)=>{
  if(err)
      console.log(err);
	if(result.affectedRows > 0)
    {
      res.send({code:1});
    }
    else
      res.send({code:0});
  });
});


module.exports=router