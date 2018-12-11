/*
*   团队成员列表
* */

/********************* jQuery 重写逻辑 *************************/

$('.nav-link').click(function(e){
  var $a = $(e.target);
  if($a.is('a'))
  {
    e.preventDefault();
    var type = $a.attr('href').slice(1);  // inLab / isGraduated
    var signal = type === 'isGraduated'?0:(type==='inLab'?1:2);
    if(signal === 2 && $('#inLab').is('.active'))
    {
      $('html,body').animate({scrollTop: $($a.attr('href')).offset().top},1000);
      return;
    }
    if(signal===1 || signal === 2)
    {
      type = 'inLab';
      var jobObj = {
        teacher: '导师',
        postDoc: '在站博后',
        doctor: '在读博士',
        master: '在读硕士'
      };
    }
    else
    {
      jobObj = {
        teacher: '导师',
        postDoc: '出站博后',
        doctor: '毕业博士',
        master: '毕业硕士'
      };
    }
    $.ajax({
      url: '/member/list?type=' + type,
      type: 'get',
      dataType: 'json',
      success: function(res){
        // res -> {code:200,data:results}
        // results -> { teacher: ['',num], postDot: , ... }
        if(signal == 1 || signal == 2)
        {
          // 平滑跳转
          $('#inLab').addClass('active');
          $('#isGraduated').removeClass('active');
          $('html,body').animate({scrollTop: $($a.attr('href')).offset().top},1000);
        }
        else
        {
          $('#inLab').removeClass('active');
          $('#isGraduated').addClass('avtive');
        }
        var data = res.data;
        for(var key in data)
        {
          var title = '#' + type + '>.'+ key +'>.title';
          var num = data[key][1];
          var titleContent = '<span>'+jobObj[key]+'共&nbsp;&nbsp;'+num+'&nbsp;&nbsp;人</span>';
          $(title).empty().append(titleContent);
          var typeSel = '#' + type + '>.'+ key +'>.list';
          var typeEle = $(typeSel);
          var typeContent = data[key][0];
          if(typeEle)
            $(typeSel).empty().append(typeContent);
        }
        navChang(type);
      }
    })

  }
});


(function(){
  $("[href='#inLab']").trigger('click');
})();



/*----------------- 垂直导航条定位 ----------------------*/
function fixToTop(){

    var verNav = document.getElementsByClassName('ver-nav')[0].children[0];
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var verNavScrTop = verNav.scrollTop+250;  // 这里还是有问题
    if(scrollTop > verNavScrTop)
    {
        verNav.className = 'nav-fix nav-style';
    }
    else
    {
        verNav.className = 'nav-style';
    }
}
// 绑定鼠标滚动事件
if(window.attachEvent) // IE
{
    window.attachEvent('onmousewheel',fixToTop);
    window.attachEvent('onscroll',fixToTop);

    document.attachEvent('onmousewheel',fixToTop);
    document.attachEvent('onscroll',fixToTop);
}
else // chrome / FF
{
    window.addEventListener('onmousewheel',fixToTop,false);
    window.addEventListener('scroll',fixToTop,false);

    document.addEventListener('onmousewheel',fixToTop,false);
    document.addEventListener('scroll',fixToTop,false);
}

// 切换页面时修改垂直导航条

function navChang(type){
    var ulEle = document.querySelector('.ver-nav ul');
    dataLeave = {
        'postDoc-leave':'出站博后',
        'doctor-leave':'毕业博士',
        'master-leave':'毕业硕士'
    };
    dataIn = {
        'teacher':'导师',
        'postDoc':'博后',
        'doctor':'博士',
        'master':'硕士'
    };
    ulEle.innerHTML = '';
    var frag = document.createDocumentFragment();
    var data = type=='inLab'?dataIn:dataLeave;
    for(var key in data)
    {

        var a = document.createElement('a');
        a.href = '#'+key;
        var li = document.createElement('li');
        li.innerHTML = data[key];
        a.appendChild(li);
        frag.appendChild(a);
    }
    ulEle.appendChild(frag);
}

/*************** 为垂直导航条绑定页面滚动事件 *******************/
$('.ver-nav').on('click','li',function(e){
  var $li = $(this);
  var id = $li.parent().attr('href');
  $('html,body').animate({scrollTop: $(id).offset().top},1000);
});


/****************** 为垂直导航条设置自动背景 ******************/
var before = 0;
$(function(){
  $(window).scroll(function(){      // 为 window 绑定下拉事件
    var top = $(this).scrollTop();  // 获取页面滚动距离
    var count = 0;
    var arr = find$id();
    var topObj = arr[0];
    var aArr = arr[1];
    for(var i=0;i<topObj.length;i++)
    {
      if(topObj[i].offset().top < top+20)
      {
        count++;
      }
    }
    if(count != before)
    {
      for(var j=0;j<topObj.length;j++)
      {
        if(j == (count-1))
          aArr[j].addClass('highlight');
        else
          aArr[j].removeClass('highlight');
      }
      before = count;
    }
  })
});

function find$id(){
  // 所以 a 连接在的 id
  var $a = $('.ver-nav>div>ul>a');
  var $topObj = [];  // 所有 $(id) 对象
  var $aArr = [];    // 所有 a 标记元素
  for(var i=0;i<$a.length;i++)
  {
    var id = $($a[i]).attr('href');
    $topObj.push($(id));
    $aArr.push($($a[i]));
  }
  return [$topObj,$aArr];
}






