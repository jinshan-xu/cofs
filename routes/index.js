/*
  index 模块
    1. 返回 headerAndFooter.html



*/
const express = require('express');
const pool = require('../pool.js');
var path = require('path');
var router = express.Router();

router.get('/getHeaderAndFooter',(req,res)=>{
  res.sendFile(path.resolve(__dirname, '../static/html/header-footer/headerAndFooter.html'));
});

router.get('/test', (req,res)=>{
  res.send({code:1, msg:"test"});
});


router.get('/demo', (req,res)=>{
  //res.sendFile('../static/html/header-footer/headerAndFooter.html');
});

router.get('/demo1', (req,res)=>{
  //res.sendFile('index.html');
});

module.exports = router;