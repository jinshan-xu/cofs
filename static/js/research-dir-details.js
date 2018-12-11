$(function(){
  // 点击跳转
  var id = location.hash;
  if(id)
  {
    var href = '[href=' + '\"'  + id + '\"' + ']';   // [href=#id]
    $(href).click();
  }
  // 根据 li 元素个数动态修改宽度
  if(parseInt($('div.container').css('width')) > 576)
  {
    var $lis = $('.nav-pills').children();
    var len = $lis.length;
    var width = (1/len).toFixed(6)*100 + '%';
    $lis.css('width', width);
  }
});