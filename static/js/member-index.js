/*
*   为人物简介中内容较多者设置边栏垂直导航
*
* */
$(function(){
  var $container = $('div.container');
  var $verNav = $('#ver-nav');
  var left = $container.offset().left;
  if(left > 120)  // 判断屏幕宽度
  {
    $verNav.css({right: (left-120)});
    var $allEle = $container.children().not('.details').not('#ver-nav');
    var $ul = $('#ver-nav>ul');

    var classTop = [];
    for(var ele of $allEle)
    {
      var $ele = $(ele);
      // 创建垂直导航条
      var title = $ele.children('.title').text();
      var li = '<li>'+title+'</li>';
      var $li = $(li);
      var className = ($ele.attr('class'));
      $li.addClass(className);
      $ul.append($li);
      classTop.push($ele);
      console.log($ele.offset().top);
    }
    // 回到顶部
    var liHtml = '<li>' + '回到顶部' + '</li>';
    var $liEle = $(liHtml);
    $liEle.addClass('backTop');
    $ul.append($liEle);

    var before = 0;
    $(window).scroll(function(){
      var count = 0;
      var top = $(this).scrollTop();
      for(var i=0;i<classTop.length;i++)
      {
        if(classTop[i].offset().top - 150 < top)
        {
          console.log(classTop[i].offset().top);
          count++;
        }
      }
      if(count != before)
      {
        for(var j=0;j<classTop.length;j++)
        {
          if(j == (count-1))
            $($ul.children().get(j)).addClass('highlight');
          else
            $($ul.children().get(j)).removeClass('highlight');
        }
        before = count;
      }
      // 初始化垂直导航条位置
      if(top < 182)
        $verNav.css({top: 182});
      else
        $verNav.css({top: 0});

    });

    $ul.on('click','li',function(){
      var i = $(this).index();
      if($(this).is(':last-child'))
        $('html,body').animate({scrollTop: 0},1000);
      else
        $('html,body').animate({scrollTop: classTop[i].offset().top},1000)
    })
  }
  else
    $verNav.css({display: 'none'});
});

