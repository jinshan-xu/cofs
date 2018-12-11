/*
   ofsc 服务器主入口
*/

/*
   引入包
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// cofs 项目
var user = require('./routes/user.js');
var admin = require('./routes/admin.js');
var achievement = require('./routes/achievement-1.js');
var member = require('./routes/member.js');
var index = require('./routes/index.js');

// supermarket 项目
var supIndex = require('./routes/supermarket-index.js');
var supOrder = require('./routes/supermarket-order.js');
var supProducts = require('./routes/supermarket-products.js');
var supUser = require('./routes/supermarket-user.js');

// itea 项目
var iteaIndex = require('./routes/itea-index.js');
var iteaProducts = require('./routes/itea-products.js');

/*
   创建服务器
*/
var app = express();
app.listen(5050,()=>
{
});

app.use(bodyParser.urlencoded(
{
   extended:false
}));

app.use(cors({
  origin: 'https://cofs.applinzi.com',
  credentials: true
}));

app.use(express.static('./static'));
app.use(express.static('./static/html'));

/*
   挂载路由器
*/
// cofs 项目
app.use('/user',user);
app.use('/admin',admin);
app.use('/achievement',achievement);
app.use('/member',member);
app.use('/index',index);

// supermarket 项目
app.use('/supIndex',supIndex);
app.use('/supOrder',supOrder);
app.use('/supProducts',supProducts);
app.use('/supUser',supUser);

// itea 项目
app.use('/iteaIndex', iteaIndex);
app.use('/iteaProducts', iteaProducts);

 
// 能否这样处理 404?
app.get('*', (req,res)=>{
  res.sendFile(__dirname + '/static/html/404.html');
})

