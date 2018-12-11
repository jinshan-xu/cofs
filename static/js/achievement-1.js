/***************** achievement-list.html 页面逻辑 *************************/
$(function(){

/***** 异步加载数据 ******/
function getData(num,type,n){
  // type -> n -> pageList  num -> data numbers
  type = type || getType();  // 首次加载显示 jour_article;
  n = n || 1;  // 首次加载显示第一页
  var getUrl = '/achievement/list' + '?n=' + n + '&num=' + num + '&type=' + type;
  $.ajax({   // 请求数据
    url: getUrl,
    type: 'get',
    dataType: 'json',
    success: function(res){
      // res -> {code: 200 , msg: 'success' , html: '<table>..',info: '',total:''}
      appendData(res,type);
      initNav(res.total,n);
    }
  });
}
getData(getNum());

/****** 加载页面之后初始化 ul-list ******/
function initNav(total,n){
  var $ul = $('#pageNav');
  var sum = Math.ceil(total / getNum());  // 共有 sum 页
  if(sum>5)  // 需要折叠格子
  {
    $($ul.children().get(6)).empty().append(sum);
    if(n>1)
    {
      if(sum-n>3) // 需要折叠, 否则不需要
      {
        var $nowLi = $($ul.children().get(3));
        $nowLi.empty().append(n).addClass('actived');
        $nowLi.prev().empty().append(n-1);
        $nowLi.next().empty().append(++n);
        $nowLi.next().next().empty().append('...');
      }
      else
      {
        htmlStr(n,sum);
      }
    }
    if(n == 1)
    {
      $($ul.children().get(2)).addClass('actived');
    }
  }
  else  // 不需要折叠格子
  {
    htmlStr(n,sum);
  }
}
/****** 拼接字符串 ******/
function htmlStr(n,sum){  // n-> 当前点击页码  sum -> 所有页码
  var htmlPre = '<li>首页</li><li>&lt;&lt;</li>';
  var htmlAfter = '<li>&gt;&gt;</li><li><input type="text" name="searchPageNum"></li><li>GO</li>';
  var htmlMiddle = '';
  if(sum<=5)
  {
    for(let i=0;i<sum;i++)
    {
      if(i+1 == n)
        htmlMiddle += '<li class="actived">' + (i+1) + '</li>';
      else
        htmlMiddle += '<li>'+ (i+1) + '</li>';
    }
  }
  else
  {
    for(let i=0;i<5;i++)
    {
      if(sum-4+i == n)
        htmlMiddle += '<li class="actived">' + (sum-4+i) + '</li>';
      else
        htmlMiddle += '<li>'+ (sum-4+i) + '</li>';
    }
  }
  var s = htmlPre+htmlMiddle+htmlAfter;
  var $html = $(s);
  $('#pageNav').empty().append($html);
}

/****** 查询关键字 ******/
function queryKws(){
   var $input = $('[name=search-box]');
   var kws = $input.val();
   var getUrl = '/achievement/query' + '?kws=' + kws;
  $.ajax({
     url: getUrl,
     type: 'get',
     dataType: 'json',
     success: function(res){
       // res -> {code: 200 , msg: 'success' , html: '<table>..',info: ''}
       appendData(res,getType());
       if(res.code == 200)
         $input.val('');
     }
   });
}
/****** 向页面中添加DOM元素 ******/
function appendData(res,type){
  var $info = $('p.info');
  var id = '#' + type;
  var $parent = $(id);  // 返回数据放放在此处
  if(res.code == 200)
  {
    $info.empty().append($(res.info));
    $parent.empty().append($(res.html));
  }
  else
  {
    $info.empty().append($(res.msg));
    $parent.empty();
  }
}

/****** 查询文章类型 ******/
function getType(){
  return $('a[class*="active"]').attr('title');
}

/****** 获取 num 每页显示记录数 ******/
function getNum(){
  return $('select').val();
}

/****** 获取 n 显示第 n 页 ******/
function getN(){
  return parseInt($('#pageNav>.actived').html());
}

/****** select 点击事件 ******/
$('select').change(function(){
  getData($(this).val(),getType(),1);
});


/****** li 点击事件 ******/
$('#pageNav').on('click','li',function(){
  var $li = $(this);
  var $ul = $('#pageNav');
  var val = $li.html().trim();
  var reg = /[0-9]+/;
  if(reg.test(val))
  {
    getData(getNum(),getType(),$li.html());
  }
  else if(val == '&lt;&lt;')
  {
    if(!prevPage($li,$ul))
      return;
  }
  else if(val == '&gt;&gt;')
  {
    if(!nextPage($li,$ul))
      return;
  }
  else if(val=='首页')
  {
    getData(getNum(),getType(),1);
  }
  else if(val == 'GO')
  {
    if(!goPage($li,$ul))
      return;
  }
  else
    return;
  $ul.children('.actived').removeClass('actived');
});

/****** 分页条功能 前一页 ******/
function prevPage($li,$ul){
  if($li.next().is('.actived'))  // 是否第一页
    return false;
  var n = $ul.children('.actived').html();
  getData(getNum(),getType(),--n);
  return true;
}
/****** 分页条功能 后一页 ******/
function nextPage($li,$ul){
  if($li.prev().is('.actived'))  // 是否是最后一页
    return false;
  var n = $ul.children('.actived').html();
  getData(getNum(),getType(),++n);
  return true;
}
/****** 分页条功能 GO 页 ******/
function goPage($li,$ul){
  var val = $li.prev().children('input').val();
  var total = $li.prev().prev().html();
  var reg = /^[0-9]+$/;
  if(reg.test(val))
  {
    if(val <= total && val >0)
    {
      getData(getNum(),getType(),val);
      return true;
    }
    else
      return false;
  }
  return false;
}

/****** 搜索框点击事件 ******/
$('[name=submit-query]').click(function(){
  queryKws();
  $('#pageNav').empty();
});

/****** 顶部导航条事件 ******/
$('.nav-tabs').on('click','a',function(){
  var type = $(this).attr('title');
  var $searchBox = $('.search-box');
  var $statement = $('.statement');
  var $number = $('.number');
  var $pageList = $('.page-list');
  if(type != 'award')
  {
    $searchBox.removeClass('hide');
    $statement.removeClass('hide');
    $number.removeClass('hide');
    $pageList.removeClass('hide');
    getData(getNum(),type,1);
  }
  else
  {
    $searchBox.addClass('hide');
    $statement.addClass('hide');
    $number.addClass('hide');
    $pageList.addClass('hide');
  }
});

/****** 为搜索框绑定键盘事件 ******/
var $searchBox = $('[name=search-box]');
$searchBox.on('focus',enterSearchEvent);
$searchBox.on('blur',blurEvent);

function enterSearchEvent(){
  $('.search-help').show();
  $searchBox.keyup(function(e){
    if(window.e)
      e = window.e;
    if(e.keyCode == 13 || e.charCode == 13)
    {
      queryKws();
      $('#pageNav').empty();
    }
  })
}
function blurEvent(){
  $('.search-help').hide();
}
});