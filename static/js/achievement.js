
    /*
    *   成果展示页逻辑
    */

    /*----------------- 获取数据库数据 --------------------*/
    function getContentList(type,num,n=1)
    {
        let queryStr = `?num=${num}&n=${n}&type=${type}`;
        let xhr = getXhr();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = xhr.responseText;
                var resObj =  JSON.parse(res);
                if(resObj.code == 200)
                {
                    // return resObj.data;  // [{},{}...]  这里无法返回！
                    if(n==1)
                    {creatPageNav(resObj.data)}
                    addData(resObj.data);
                }
                else{
                    addData(resObj.msg);
                }
            }
        }
        xhr.open('get','/achievement/list'+queryStr,true);
        xhr.send(null);
    }

    /*----------------- 查询关键字,返回查询结果 --------------------*/
    function queryKws(){
        // kws  -> yiping(Yiping) / wang(Wang) / Yiping Wang / fiber(Fiber)
        //         光纤 / 杭州 / Optical fiber / 张三 ... / impr.. / 2018 /
        var kws = $('input[name="search-box"]').value;
        var xhr = getXhr();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = xhr.responseText;
                var resObj =  JSON.parse(res);
                if(resObj.code == 200)
                {
                    // return resObj.data;  // [{},{}...]  这里无法返回！
                    addData(resObj.data,kws);
                    // 将所有数据列出,把分页器删除
                    $('#pageNav').innerHTML = '';
                    $('p.info').innerText = `搜索成功,共搜索到 ${resObj.data.length} 条记录！`;
                }
                else{
                    addData(resObj.msg);
                }
            }
        }
        xhr.open('get',`/achievement/query?kws=${kws}`,true);
        xhr.send(null);

    }



    /*----------------- 添加表格数据到页面 --------------------*/
    function addData(data,kws){
        // 查询数据 [{title,detail,all_author,all_author_mid,pub_year,url,isExh,total},...]
        var pInfoEle = $('p.info');  // 如果查询错误,报错于此
        var type = $('a[class*="active"]').title;  // 此种类型数据
        var addEle = $(`div[class*="${type}"]`);  // 根据数据类型添加到不同位置
        // 表格添加
        var tHead = `<table><tr><td class="title">序号</td><td class="title">文章/作者</td><td class="title">发表时间</td></tr>`;
        var tBody = '';
        var tFoot = '</table>';
        // 循环遍历 data 数据
        if(typeof data === 'string')  // 后端查询出错！
        {
            pInfoEle.innerText = data;
        }
        else
        {
            pInfoEle.innerText = `共 ${data[0].total} 篇文章记录！`
            tBody = data.reduce(preDeal,'')
        }
        if(kws !== undefined)
        {   // 高亮关键词
            var regKws = new RegExp(`${kws}`,'ig');
            tBody = tBody.replace(regKws,`<mark>${kws}</mark>`);
        }
        addEle.innerHTML = tHead + tBody + tFoot;
    }


    /*----------------- 对查询数据进行处理拼接 --------------------*/
    function preDeal(prev,obj,index,arr){
        //{title,detail,all_author,all_author_mid,pub_year,url,isExh,total}
        var num = getNum();  // 这两个数为了文章列表的序号显示
        var n = $(`li[class="actived"]`)?$(`li[class="actived"]`).innerText:1;
        var start = (n-1)*num;
        if(obj.isExh == 1) // 确认展示
        {
            var authorArr = obj.all_author.replace('and','').split(',');
            var authorListArr = [];
            authorArr.map(ele=>
            {
                if(ele.trim())
                    authorListArr.push(ele.trim());
            });
            var authorMidArr = obj.all_author_mid.split('#');
            authorMidArr.pop(); // 最后一个元素原为 '';
            var nameString = '';
            // 处理人名链接 <p> /之内的部分/  </p>
            var regName = /[a-z\s]+/ig;
            for(let i=0;i<authorListArr.length;i++)
            {
                if(authorMidArr[i]!=' ')
                {   // 如果人名 mid 不为空, 添加 a 链接.此链接还需要后期确定
                    if(i == authorListArr.length-1)
                    {
                        nameString += `${authorListArr.length==1?'':'and'} <a href="../members/${authorListArr[i].match(regName)[0].toLowerCase().split(' ').join('-')}.html" target="_self">${authorListArr[i]}.</a>`;
                    }
                    else{
                    nameString += `<a href="../member/${authorListArr[i].match(regName)[0].toLowerCase().split(' ').join('-')}.html" target="_self">${authorListArr[i]}, </a>`;
                    }
                }
                else
                {
                    //console.log(`空人物：,'${authorMidArr[i]}'`);
                    nameString += `${authorListArr[i]}, `;
                }
            }
            // 判断 url 是否存在？
            if(obj.url)
            {
                return prev+`<tr><td>${start+index+1}</td><td><p>${nameString}</p><p><a href="../papers/${obj.url}.pdf" target="_blank">"${obj.title}"</a></p><p>${obj.detail}</p></td><td>${obj.pub_year}</td></tr>`;
            }
            else{
            return prev+`<tr><td>${start+index+1}</td><td><p>${nameString}</p><p>"${obj.title}"</p><p>${obj.detail}</p></td><td>${obj.pub_year}</td></tr>`;
            }
        }
    }


    /*----------------- 获取 pageNum 设置的每页显示数值 --------------------*/
    function getNum(){
        return $('[name="pageNum"]').value;
    }

    /*----------------- 返回导航条显示内容 --------------------*/
    function getType(){
        var type = $('a[class*="active"]').title;
        switch(type){
            case 'jour-article': return 'journal_article';
            case 'conf-article': return 'conf_article';
            case 'patent': return 'patent';
        }
    }

    /*---------------- 主函数 -----------------*/
    function initial(type)
    {
        if(type === undefined)
        {
            type = getType();
            console.log(type);
        }
        let num = getNum();     // 每页查询条数
        getContentList(type,num,n=1);
        addListener();
    }
    // 初始化页面 -> num = 10 ; type -> jour_article ; n -> 1

    /*----------------- 创建分页条 --------------------*/
    function creatPageNav(data){
        // [{},{}..] 包含数据总数和返回查询记录
        let total = data[0].total;  // 数据总数
        let num = getNum();
        let sum = Math.ceil(total/num);    // 分 sum 页

        // 创建分页条
        let pageNavEle = $('#pageNav');  // 获取分页条元素
        // 向页面添加内容
        let pageHtmlPre = '<a href=javascript:void(0) onclick="clickPage(1)"><li>首页</li></a><a href=javascript:void(0) onclick="prePage()"><li>&lt;&lt;</li></a>';
        let pageHtmlNow = '';
        let pageHtmlNext = `<a href=javascript:void(0) onclick='nextPage()'><li>&gt;&gt;</li></a>`;
        let pageHtmlSearch = `<li><input type='text' name='searchPageNum'></li><li><a href=javascript:void(0) onclick='searchPage()'>GO</a></li>`;

        // 少于5页不需要隐藏
        if (sum<=5)
        {
            for (let i=1;i<=sum ;i++ )
            {
                pageHtmlNow += `<a href=javascript:void(0) onclick='clickPage(${i})' value='${i}'><li>${i}</li></a>`;
            }
            pageHtml = pageHtmlPre + pageHtmlNow + pageHtmlNext + pageHtmlSearch;
            pageNavEle.innerHTML = pageHtml;
            // 默认为第一页设置背景
            pageNavEle.children[2].firstChild.setAttribute('class','actived');
        }

        // 多于5页需要隐藏
        else
        {
            for (let i=1;i<=5 ;i++ )
            {   // 将第四页隐藏
                if (i == 4)
                {
                    pageHtmlNow += `<a href='#'><li>...</li></a>`;
                }
                // 最后一页
                else if (i == 5)
                {
                    pageHtmlNow += `<a href='#' onclick='clickPage(${sum})' value='${sum}'><li>${sum}</li></a>`;
                }
                else
                {
                    pageHtmlNow += `<a href='#' onclick='clickPage(${i})' value='${i}'><li>${i}</li></a>`;
                }

            }
            pageHtml = pageHtmlPre + pageHtmlNow + pageHtmlNext + pageHtmlSearch;
            pageNavEle.innerHTML = pageHtml;
            // 默认为第一页设置背景
            pageNavEle.children[2].firstChild.setAttribute('class','actived');
        }

    }


    /*----------------- 是否需要隐藏某页 --------------------*/
    function isHidden(n,sum){
        return sum-n>3;
    }

    /*----------------- 上一页 --------------------*/
    function prePage(){
        // 当前高亮的元素包裹的 a 元素
        var nowEle = $('li[class="actived"]');
        // 当前高亮元素的值
        var nowN = nowEle.innerText;
        var preN = nowN - 1 ;
        // 当前高亮为 1 的话,不动作
        if (nowN != '1')
        {
            // 相当于点中高亮元素之前的元素
            clickPage(preN);
        }
    }

    /*----------------- 下一页 --------------------*/
    function nextPage(){
        var nowEle = $('li[class="actived"]');
        var nowN = nowEle.innerText;
        var nextN = +nowN + 1;
        // 存在下一个元素,才能执行
        if ($(`a[value="${nextN}"]`))
        {
            clickPage(nextN);
        }
    }

    /*----------------- 搜索某页 --------------------*/
    function searchPage()
    {
        var searchEle = $('input[name="searchPageNum"]');
        var searchNum = +(searchEle.value); // 查询页数
        var len = $('#pageNav').children.length;
        var liNum = +($('#pageNav').children[len-4].innerText);  // 最大页数
        // 查询页数不能大于最大页数,也不能 <= 0
        if (searchNum > 0 && searchNum <= liNum)
        {
            clickPage(searchNum);
            // 搜查成功清空搜索框
            searchEle.value = '';

        }
        else
        {
            alert('输入页码不正确');
        }
    }

    /*----------------- 点击页码 --------------------*/
    function clickPage(n){
        var pageNavEle = $('#pageNav');   // 拿到导航条 ul 节点
        var liNum = pageNavEle.children.length-4;    // 共有 num 个子 页码li 节点
        var sum = +(pageNavEle.children[liNum].innerText); // 共有 sum 页

        var pageHtmlPre = '<a href="javascript:void(0)" onclick="clickPage(1)"><li>首页</li></a><a href="javascript:void(0)" onclick="prePage()"><li>&lt;&lt;</li></a>';
        var pageHtmlNow = '';
        var pageHtmlNext = `<a href='javascript:void(0)' onclick='nextPage()'><li>&gt;&gt;</li></a>`;
        var pageHtmlSearch = `<li><input type='text' name='searchPageNum'></li><li><a href='javascript:void(0)' onclick='searchPage()'>GO</a></li>`;

        // 只有在当前页不是第一页并且所有页码大于 5 时才选择隐藏
        if (n>1 && sum >5)
        {
            // 需要隐藏某些页码
            if (isHidden(n,sum))
            {   // 最多支持 5 个页码li 标签
                for (let i=1;i<6 ;i++ )
                {
                    //倒数第二个页码为隐藏符 ...
                    if (i==4)
                    {
                        pageHtmlNow += `<a href='javascript:void(0)'><li>...</li></a>`;
                    }
                    // 最后一个页码设为 num
                    else if (i==5)
                    {
                        pageHtmlNow += `<a href='javascript:void(0)' onclick='clickPage(${sum})' value='${sum}'><li>${sum}</li></a>`;
                    }
                    else
                    {
                        pageHtmlNow += `<a href='javascript:void(0)' onclick='clickPage(${n+i-2})' value='${n+i-2}'><li>${n+i-2}</li></a>`;
                    }
                }
                pageHtml = pageHtmlPre + pageHtmlNow + pageHtmlNext + pageHtmlSearch;
                pageNavEle.innerHTML = pageHtml;
            }
            // 不需要隐藏页码
            else
            {
                for (let i=4;i>=0 ;i-- )
                {
                    pageHtmlNow += `<a href='javascript:void(0)' onclick='clickPage(${sum-i})' value='${sum-i}'><li>${sum-i}</li></a>`;
                }
                pageHtml = pageHtmlPre + pageHtmlNow + pageHtmlNext + pageHtmlSearch;
                pageNavEle.innerHTML = pageHtml;
            }
        }
        // 如果输入 searchNum == 1 并且需要隐藏某些节点,执行如下操作
        else if (n==1 && sum >5)
        {
            for (let i=1;i<6 ;i++ )
            {
                //倒数第二个页码为隐藏符 ...
                if (i==4)
                {
                    pageHtmlNow += `<a href='javascript:void(0)'><li>...</li></a>`;
                }
                // 最后一个页码设为 num
                else if (i==5)
                {
                    pageHtmlNow += `<a href='javascript:void(0)' onclick='clickPage(${sum})' value='${sum}'><li>${sum}</li></a>`;
                }
                else
                {
                    pageHtmlNow += `<a href='javascript:void(0)' onclick='clickPage(${n+i-1})' value='${n+i-1}'><li>${n+i-1}</li></a>`;
                }
            }
            pageHtml = pageHtmlPre + pageHtmlNow + pageHtmlNext + pageHtmlSearch;
            pageNavEle.innerHTML = pageHtml;
        }

        // 为当前页增加背景
        for (let i=2;i<=liNum+1 ;i++ )
        {
            pageNavEle.children[i].firstChild.setAttribute('class','');
            // 如果第 i 的 li 是当前点击的
            if (pageNavEle.children[i].firstChild.innerText == n)
            {
                pageNavEle.children[i].firstChild.setAttribute('class','actived');
            }
        }
        // 列出此时高亮选择 li 元素指向的分页数据
        var num = getNum();
        var type = getType();
        getContentList(type,num,n);
    }


function addListener(){
    var searchBox = document.querySelector('[name="search-box"]');
    var searchButton = document.querySelector('[name="submit-query"]');
    searchBox.onfocus = function(){
        console.log('focus');
        document.addEventListener('keydown',onKeyDown);
    };
    searchBox.onblur = function(){
        console.log('blur');
        document.removeEventListener('keydown',onKeyDown)
    }
}
// 这里需要好好看看总结下！！！
function onKeyDown(event){
  console.log('keyDown');
  if(window.event)
      event = window.event;
  if((event.keyCode || event.charCode) == 13)
  {
      queryKws();
  }
}

window.onload = initial('journal_article');


