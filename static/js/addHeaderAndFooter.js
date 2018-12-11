// 向页面中引入 header & footer;
$(function(){
  // 引入 header.css & footer.css
  $('<link rel="stylesheet" href="../../css/header.css">')
    .appendTo('head');
  $('<link rel="stylesheet" href="../../css/footer.css">')
    .appendTo('head');
  $.ajax({
    url:'../header-footer/headerAndFooter.html',
    type: 'get',
    success: function(res){
      $(res).children('#header').replaceAll('header.container-fluid');
      $(res).children('#footer').replaceAll('footer.container-fluid');
      // 头部 SZU 重指向
      $($('header>.container>.navbar>.w-100').get(0)).click(function(e){
        var $tar = $(e.target);
        if($tar.is('img[alt=SZU-LOGO]'))
        {
          e.preventDefault();
          location.href = 'http://www.szu.edu.cn';
        }
      });
    }
  });

});