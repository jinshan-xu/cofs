/*------------------------------- 后台管理逻辑 ---------------------------*/

/****************** 人员列表 ********************/
function getMemberList(){
  $.ajax({
    url: '/admin/memberList',
    type: 'get',
    dataType: 'json',
    success: function(res){
      new Vue({
        el: '#member_list',
        data(){
          return {
            res: res.msg
          }
        },
        methods:{
          alter(mid){
            toggleShow('#member_alter');
            memberAlter(mid);
          },
          del(mid){
            console.log(mid);
            if(confirm('确认删除吗?'))
            {
              $.ajax({
                url: '/admin/delMember'+'?mid='+mid,
                type: 'get',
                dataType: 'json',
                success(res){
                  if(res.code == 200)
                    alert(res.msg);
                }
              });
            }
          },
          getPos(type){
            return getPos(type);
          }
        }
      });
    }
  });
}
getMemberList();

/************************** 修改人员信息 ****************************/
function memberAlter(mid){
  $.ajax({
    url: '/admin/getMemberInfo' + '?mid=' + mid,
    type: 'get',
    dataType: 'json',
    success: function(res){
      alterMemberVue.member = res.msg[0];
    }
  });
}
/************************** 为修改人员信息创建 vue ****************************/
var alterMemberVue = new Vue({
  el: '#member_alter',
  data(){
    return {
      member: []
    }
  },
  methods: {
    getPos(type){
      return getPos(type);
    },
    submitAlter(){
      if(confirm('人员信息数据非常重要,确认修改吗?'))
      {
        this.member = trimObj(this.member);
        $.ajax({
          url: '/admin/saveMemberInfo',
          type: 'post',
          data: this.member,
          dataType: 'json',
          success(res){
            if(res.code == 200)
              alert(res.msg);
          }
        });
      }
    }
  }
});
/************************** 为添加人员信息创建 vue ****************************/
var addMemberVue = new Vue({
  el: '#add_member',
  data(){
    return {
      member: {
        isInLab:1,
        isExh:1,
        "pos_desc": "#",
        "job_desc": "#",
        "real_name_cn": '',
        "real_name_eng": '',
        mname: '',
        mid: '',
        "now_type": '',
        "pre_type": '',
        addr: '',
        "nav_place": '',
        email: '',
        tel: '',
        gender: 1
      }
    }
  },
  methods: {
    addMember() {
      if (confirm('确认提交吗?'))
      {
        this.member = trimObj(this.member);
        if (checkInfo(this.member))
        {
          var reg = /\s{1}/;
          if(reg.test(this.member['real_name_eng']))
          {
            var res = dealName(this.member['real_name_eng']);
            this.member['real_name_eng'] = res[0];
            this.member.mname = res[1];
            console.log(this.member);
            $.ajax({
              url: '/admin/addMember',
              type: 'post',
              data: this.member,
              dataType: 'json',
              success(res){
                if(res.code == 200)
                  alert(res.msg);
              }
            });
          }
          else
            alert('请重新检查拼音姓名是否正确!');
        }
        else
          alert('还有未填项目! 请补充完整.');
      }
    }
  }
});

/************************** 点击切换显示事件 ****************************/
$('[data-target]').click(function(e){
  var target = $(e.target).parent().attr('data-target');
  var id = '#' + target;
  toggleShow(id);
  // 当需要列出 文章/会议/专利 时,需要读取 data-type 的值.
  if(target == 'article-list')
  {
    var type = $(e.target).parent().attr('data-type');
    showArticleList(type);
  }
  if(target == 'add-article')
  {
    var type = $(e.target).parent().attr('data-type');
    // 新增文章 / 会议论文 / 专利 列表
    addArticleList(type);
  }
});

/************************** 切换页面显示和隐藏 ****************************/
function toggleShow(id){
  $('.my-show').removeClass('my-show').addClass('my-hide');
  $(id).removeClass('my-hide').addClass('my-show');
}

/************************** 根据人员 type 值获取职称 ****************************/
function getPos(num){
  switch (num) {
    case '1': return '教师';
    case '2': return '博后';
    case '3': return '博士';
    case '4': return '硕士';
    case '5': return '出站博后';
    case '6': return '毕业博士';
    case '7': return '毕业硕士';
    default: return '合作交流';
  }
}

/************************** 将对象转换为查询字符串 ****************************/
function obj2str(obj){
  var s = '?';
  for(var key in obj)
  {
    s = s + key + '=' + obj[key] + '&';
  }
  s = s.slice(0,s.length-1);
  return s;
}

/************************** 为对象属性值除去前后空格 ****************************/
function trimObj(obj){
  for(var key in obj)
  {
    obj[key] = (obj[key]+'').trim();
  }
  return obj;
}

/************************** 检验添加人员信息是否有空 ****************************/
function checkInfo(obj){
  for(var key in obj)
  {
    if(key != 'mname')
    {
      if(!obj[key] && obj[key] !== '0')
        return false;
    }
  }
  return true;
}

/************************** 由 real_name_eng 获取 mname ****************************/
function dealName(str){
  var arr = str.split(' ');
  arr.map((ele,i)=>{
    arr[i] = ele[0].toUpperCase() + ele.slice(1);
  });
  return [arr.join(' '), arr.join('-')];
}


/********************* 为 文章 / 会议 / 专利 请求数据库数据 ************************/
function showArticleList(type){
  $.ajax({
    url: '/admin/getArticleList'+'?type='+type,
    type: 'get',
    dataType: 'json',
    success(res){
      if(res.code == 200)
      {
        articleListVue.articleList = res.msg;
      }
    }
  });
}

/********************* 为 文章 / 会议 / 专利 的列表创建 vue ************************/
var articleListVue = new Vue({
  el: '#article-list',
  data(){
    return {
      articleList: [
        {
          "all_author": 'all_author',
          title: 'title',
          detail: 'detail'
        }
      ]
    }
  },
  methods:{
    alterArticle(){
      console.log('alterArticle');
    },
    delArticle(){
      console.log('delArticle');
    }
  }
});

/********************* 点击添加文章 / 会议 / 专利  ************************/
function addArticleList(type){
  // 获取人员姓名和对应 mid
  $.ajax({
    url: '/admin/authorList',
    type: 'get',
    dataType: 'json',
    success(res){
      if(res.code == 200)
      {
        addArticleVue.nameCnList = res.nameCnList;
        addArticleVue.nameEngList = res.nameEngList;
        addArticleVue.midList = res.midList;
        addArticleVue.selectType = type;
      }
    }
  });
}

/********************* 为 文章 / 会议 / 专利 的添加创建 vue ************************/
var addArticleVue = new Vue({
  el: '#add-article',
  data(){
    return {
      title: '',
      detail:'',
      isExh: 1,
      allAuthorCnList:[],
      allAuthorEngList:[],
      all_author:'',
      allAuthorMidList:[],
      all_author_mid:'',
      pub_year:'',
      type:'',
      nameCnList:["示例"],
      nameEngList:['Demo'],
      midList:['Demo'],
      otherMember:'',
      selectType:''
    }
  },
  methods: {
    addMember(e,i){
      this.allAuthorCnList.push(this.nameCnList[i]);
      this.allAuthorEngList.push(this.nameEngList[i]);
      this.allAuthorMidList.push(this.midList[i]);
      e.target.className = 'selected';
    },
    addOtherMember(){
      if(this.otherMember)
      {
        this.allAuthorCnList.push(this.otherMember);
        this.allAuthorEngList.push(this.otherMember);
        this.allAuthorMidList.push(' ');
        this.otherMember = '';
      }
    },
    delMember(i){
      this.allAuthorCnList.splice(i,1);
      this.allAuthorEngList.splice(i,1);
      this.allAuthorMidList.splice(i,1);
    },
    finish(){
      this.all_author_mid = this.allAuthorMidList.join('#') + '#';
      var len = this.allAuthorEngList.length;
      if(len>1)
      {
        var tempArr = this.allAuthorEngList.slice();
        tempArr[len-1] = 'and ' + tempArr[len-1];
      }
      this.all_author = tempArr.join(', ');
    },
    useNameCn(){
      this.all_author = this.allAuthorCnList.join(', ');
    },
    useNameEng(){
      this.finish();
    },
    submitArticleInfo(){
      if(confirm("确认提交?"))
      {
        var reg = /^[0-9]{4}$/;
        if( this.title && this.detail && this.pub_year && this.all_author && this.all_author_mid && this.type )
        {
          if(reg.test(this.pub_year))
          {
            var obj = {
              title: this.title.trim(),
              detail: this.detail.trim(),
              pub_year: this.pub_year,
              all_author: this.all_author.trim(),
              all_author_mid: this.all_author_mid.trim(),
              type: this.type.trim(),
              isExh: this.isExh,
              selectType: this.selectType.trim()
            };
            console.log(this.isExh);
            $.ajax({
              url: '/admin/addArticleAndPatent',
              type: 'post',
              data: obj,
              success(res){
                if(res.code == 200)
                  alert('数据提交成功!');
                else
                  alert('数据提交失败!');
              }
            });
          }
          else
            alert("请输入文章/专利的四位数发表年份信息!");
        }
        else
          alert("存在未输入内容的关键项目,请检查后重新提交!");
      }
    }
  },
  computed:{
    articleType(){
      return this.selectType ==='journal_article'?'期刊文章':(this.selectType==='conf_article'?'会议文章':'发明专利');
    }
  }
});

/********************* 下面为旧版本 ************************/

/*------------------------------- 添加新成员 ---------------------------*/
function addMembers()
{
    // 获取填写信息
    var midEle = $('input[name="mid"]'),
        telEle = $('input[name="tel"]'),
        emailELe = $('input[name="email"]'),
        realNameCnEle = $('input[name="real_name_cn"]'),
        realNameEngELe = $('input[name="real_name_eng"]'),  // 'xiaosi-zhang'
        typeEle = $('input[name="type"]:checked'),
        isExhEle = $('input[name="isExh"]:checked');
    // 返回信息显示处
    var resultShowEle = $('input[type="file"]');

    // 输入是否为空的判断
    var eleArr = [midEle,telEle,emailELe,realNameCnEle,realNameEngELe,typeEle,isExhEle];
    var info = '* 输入不能为空！';
    var flage = eleArr.every(function(ele,index,arr)
    {
        if(!ele || !ele.value)
        {
            ele === typeEle ? returnInfo($('input[name="type"]'),info):returnInfo(ele,info);
            return false;
        }
        returnInfo(ele,'');
        return true;
    });
    if(!flage){
        return;
    }
    // 拼接字符串
    var formData = `mid=${eleArr[0].value.toLowerCase()}&mname=${eleArr[4].value}&mpwd=ofsc666&tel=${eleArr[1].value}&email=${eleArr[2].value}&real_name_cn=${eleArr[3].value}&real_name_eng=${eleArr[4].value}&type=${eleArr[5].value}&isExh=${eleArr[6].value}`;
    var xhr = getXhr();
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            var result = xhr.responseText;
            var resObj = JSON.parse(result);
            var code = resObj.code;
            var msg = resObj.msg;
            if(code == 200)
            {
                confirm(`${msg}`)?clearInfo():clearInfo();
            }
            else
            {
                confirm(`${msg}`);
            }

        }
    }
    xhr.open('post','/admin/add-member',true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(formData);
}

/*----------------------------- 向页面中添加提示信息------------------------*/
function returnInfo(ele,info,code=0)
{
    var parent = ele.parentElement;
    var nextEle = parent.nextElementSibling;
    nextEle.innerText = info;
    nextEle.style.color = 'red';
    if(code == 200)
    {
        nextEle.style.color = 'green';
    }
}

/*------------------------------- 清空表格信息 ---------------------------*/
function clearInfo()
{
    // 刷新页面！ 但是为什么第一个不能用？
    // document.execCommand('Refresh');
    history.go(0);
}

/*------------------------------- 添加作者 ---------------------------*/
function addAuthor(ele)
{
    // 获取作者列表节点
    var spanEle = ele.previousElementSibling;
    // 为选中的作者添加高亮
    spanEle.style.borderColor = '#cb1e00';
    var real_name_cn = '';
    // 作者 中文名. 验证是否是 input 元素
    if(!spanEle.innerText)
    {
        // 验证输入格式是否为 Taibai-Li
        var reg = /^[A-Z][a-z]*-[A-Z][a-z]*$/g;
        if(!reg.test(spanEle.value))
        {
            spanEle.previousElementSibling.innerText = '*请输入正确姓名拼音格式！';
            return;
        }
        spanEle.previousElementSibling.innerText = '';
        real_name_cn = spanEle.value;
        spanEle.value = '';
        // 对 Unrecord-m 的 title+1 以方便后续同 mid 的验证
        spanEle.title++;
    }
    else
    {
        real_name_cn = spanEle.innerText;
        spanEle.style.backgroundColor = '#89ee8a';
    }
    // 作者 mid
    var mid = spanEle.title;
    // 所选作者列表 ele
    var ulEle = document.getElementsByClassName('selected-member')[0];
    // 现有作者人数
    var len = ulEle.children.length;
    // 向 ulEle 中添加新作者
    ulEle.innerHTML = ulEle.innerHTML + `<li><span class="order">${++len}</span><span class="sele-member-name" title="${mid!=0?mid:(mid+len)}">${real_name_cn}</span><a href="javascript:void(0)" onclick="delAuthor(this)">Del</a></li>`;
}


/*------------------------------- 删除所添加作者 ----------------------*/
function delAuthor(ele)
{
    // 父元素 li
    var liEle = ele.parentElement;
    // li 父元素 ul
    var ulEle = liEle.parentElement;
    liEle.parentNode.removeChild(liEle);
    // 剩余元素重排序
    var len = ulEle.children.length;
    for(let i=0;i<len;i++)
    {
        ulEle.children[i].firstElementChild.innerText = i+1;
    }
}

/*--------------------------- 提交文章信息 -----------------------*/
function addArticle()
{
    // 非空验证
    if(!checkInput()){return;}
    // 获取各元素节点
    var ar_titleEle = $('textarea'),
        // 直接获取 姓名/mid 的 span 标签
        spanEles = document.getElementsByClassName('sele-member-name'),
        pub_dateEle = $('input[name="pub_date"]'),
        journal_nameEle = $('input[name="journal_name"]'),
        if_numEle = $('input[name="if_num"]'),
        ar_urlEle = $('input[name="ar_url"]'),
        isExhEle = $('input[name="isExh"]:checked');
    // 文章名
    var arTitle = ar_titleEle.value; // 文章名
    // 作者名 / mid 及其验证
    var author_list = [];
    var author_mid = [];
    for(let i=0;i<spanEles.length;i++)
    {
        author_list.push(spanEles[i].innerText);
        author_mid.push(spanEles[i].title);
    }// 所选作者不能为空, mid 不能重！
    if (author_mid.length == 0)
    {
        alert('请选择文章作者！');
        return;
    }
    else
    {
        for(let i=0;i<author_mid.length;i++)
        {
            var flage = false;
            for(let j=i+1;j<author_mid.length;j++)
            {
                if(author_mid[i] === author_mid[j])
                {
                    flage = true;
                    break;
                }
            }
            if(flage)
            {
                returnInfo(spanEles[0].parentElement.parentElement,'*出现相同作者名！');
                return;
            }
        }
        returnInfo(spanEles[0].parentElement.parentElement,'*输入成功！',200);
    }
    // 期刊名
    var journalName = journal_nameEle.value;
    // 影响因子
    var ifNum = if_numEle.value;
    // 出版日期
    var pubDate = pub_dateEle.value;
    var reg = /^[\d]{1,2}\/[\d]{1,2}\/([\d]{4})$/g;
    if(!reg.test(pubDate))
    {
        returnInfo(pub_dateEle,'*请输入正确日期格式!');
        return;
    }
    else{returnInfo(pub_dateEle,'*输入成功!',200)}

    var formData = `ar_title=${arTitle}&all_author_mid=${author_mid.toString()}&pub_date=${pubDate}&journal_name=${journalName}&if_num=${ifNum}&ar_url=${arTitle}&isExh=${isExhEle.value}`;
    var xhr = getXhr();
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState ==4 && xhr.status == 200 )
        {
            var res = xhr.responseText;
            var resObj = JSON.parse(res);
            returnInfo(isExhEle,resObj.msg,resObj.code);
            if(resObj.code == 200)
            {
                confirm(`${resObj.msg}`)?clearInfo():clearInfo();
                return;
            }
        }
    }
    xhr.open('post','/admin/addArticle',true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(formData);
}

/*------------------------------- 动态创建作者列表 ---------------------------*/
function queryAuthorList()
{
    // 获取作者列表父元素
    var ulEle = document.getElementById('member-list-id').firstElementChild;
    var xhr = getXhr();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            var res = xhr.responseText;
            var resObj = JSON.parse(res);
            if(resObj.code == 200)
            {
                var nameList = resObj.nameList;
                var midList = resObj.midList;
                var htmlText = '';
                for(let i=0;i<nameList.length;i++)
                {
                    htmlText += `<li><span class="member-name" title="${midList[i]}" >${nameList[i]}</span><a href="javascript:void(0)" onclick="addAuthor(this)" name="">Add</a></li>`;
                }
                ulEle.innerHTML = htmlText;
            }
            else
            {
                ulEle.innerHTML =  `<li style="color:red;font-size:2rem;">${resObj.msg}</li>`;
            }
        }
    }
    xhr.open('get','/admin/authorList',true);
    xhr.send(null);
}

/*--------------------- 对 input 文本输入框进行非空验证 --------------------*/
function checkInput()
{
    var inputEles = document.querySelectorAll('.content>input[type="text"]');
    var textAreaEle = $('textarea');
    var eleArr = [textAreaEle];
    for(let i=0;i<inputEles.length;i++)
    {
        eleArr.push(inputEles[i]);
    }
    return eleArr.every(function(ele)
    {   // 输入为空
        if(!ele.value)
        {
            returnInfo(ele,'* 请按要求输入');
            return false;
        }
        returnInfo(ele,'* 输入成功!',200)
        return true;
    });
}

/*------------------------- 提交会议文章 ------------------------*/
function addConArticle()
{
    // 先验证 input 是否为空
    if(!checkInput()){return;}
    // 获取各元素节点
    var ar_titleEle = $('textarea'),
        // 直接获取 姓名/mid 的 span 标签
        spanEles = document.getElementsByClassName('sele-member-name'),
        // 开始日期
        conStartDateEle = $('input[name="con_start_date"]'),
        // 结束日期
        conEndDateEle = $('input[name="con_end_date"]'),
        // 会议名称
        conNameEle = $('input[name="con_name"]'),
        // 举办地址
        conAddrEle = $('input[name="con_addr"]'),
        // 文章类型
        arTypeEle = $('input[name="ar_type"]'),
        isExhEle = $('input[name="isExh"]:checked');
    // 文章名
    var arTitle = ar_titleEle.value; // 文章名
    // 作者名 / mids 及其验证
    var author_list = [];
    var author_mid = [];
    for(let i=0;i<spanEles.length;i++)
    {
        author_list.push(spanEles[i].innerText);
        author_mid.push(spanEles[i].title);
    }
    if (author_mid.length == 0)
    {
        alert('请选择文章作者！');
        return;
    }
    // 所选作者 mid 不能相同
    for(let i=0;i<author_mid.length;i++)
    {
        var flage = false;
        for(let j=i+1;j<author_mid.length;j++)
        {
            if(author_mid[i] === author_mid[j])
            {
                flage = true;
                break;
            }
        }
        if(flage)
        {
            returnInfo(spanEles[0].parentElement.parentElement,'*出现相同作者名！');
            return;
        }
    }
    returnInfo(spanEles[0].parentElement.parentElement,'*输入成功！',200);
    // 开始日期 / 结束日期 以及格式验证
    var conStartDate = conStartDateEle.value;
    var conEndDate = conEndDateEle.value;
    var f = [conStartDateEle,conEndDateEle].every(function(ele)
    {
        var reg = /^[\d]{1,2}\/[\d]{1,2}\/([\d]{4})$/g;
        if(!reg.test(ele.value))
        {
            returnInfo(ele,'*请输入正确日期格式!');
            return false;
        }
        else{returnInfo(ele,'*输入成功!',200)}
        return true;
    });
    if(!f){return;}
    // 会议名称 / 举办地点 / 文章类型
    var conName = conNameEle.value;
    var conAddr = conAddrEle.value;
    var arType = arTypeEle.value;
    var isExh = isExhEle.value;

    var formData = `ar_title=${arTitle}&all_author_mid=${author_mid.toString()}&con_start_date=${conStartDate}&con_end_date=${conEndDate}&con_name=${conName}&con_addr=${conAddr}&ar_type=${arType}&isExh=${isExh}`;
    var xhr = getXhr();
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState ==4 && xhr.status == 200 )
        {
            var res = xhr.responseText;
            var resObj = JSON.parse(res);
            returnInfo(isExhEle,resObj.msg,resObj.code);
            if(resObj.code == 200)
            {
                confirm(`${resObj.msg}`)?clearInfo():clearInfo();
                return;
            }
        }
    }
    xhr.open('post','/admin/addConArticle',true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(formData);
}

/*------------------------- 提交专利 ------------------------*/
function addPatent()
{
    if(!checkInput()){return;}
    // 获取各元素节点
    var p_titleEle = $('textarea'),
        // 直接获取 姓名/mid 的 span 标签
        spanEles = document.getElementsByClassName('sele-member-name'),
        // 申请日期
        applyDateEle = $('input[name="apply_date"]'),
        // 授权日期
        getDateEle = $('input[name="get_date"]'),
        // 申请单位
        applyDepartmentEle = $('input[name="apply_department"]'),
        // 专利号
        pNumberEle = $('input[name="p_number"]'),
        // 专利类型
        pTypeEle = $('input[name="p_type"]'),
        // 是否授权
        isAuthorizedEle = $('input[name="isAuthorized"]:checked');
        // 是否展示
        isExhEle = $('input[name="isExh"]:checked');
    // 专利名
    var pTitle = p_titleEle.value; // 文章名
    //  作者名 / mids 及其验证
    var author_list = [];
    var author_mid = [];
    for(let i=0;i<spanEles.length;i++)
    {
        author_list.push(spanEles[i].innerText);
        author_mid.push(spanEles[i].title);
    }
    if (author_mid.length == 0)
    {
        alert('请选择专利作者！');
        return;
    }
    // 所选作者 mid 不能相同
    for(let i=0;i<author_mid.length;i++)
    {
        var flage = false;
        for(let j=i+1;j<author_mid.length;j++)
        {
            if(author_mid[i] === author_mid[j])
            {
                flage = true;
                break;
            }
        }
        if(flage)
        {
            returnInfo(spanEles[0].parentElement.parentElement,'*出现相同作者名！');
            return;
        }
    }
    returnInfo(spanEles[0].parentElement.parentElement,'*输入成功！',200);
    // 申请日期 / 授权日期 以及格式验证
    var applyDate = applyDateEle.value;
    var getDate = getDateEle.value;
    var f = [applyDateEle,getDateEle].every(function(ele)
    {
        var reg = /^[\d]{1,2}\/[\d]{1,2}\/([\d]{4})$/g;
        if(!reg.test(ele.value))
        {
            returnInfo(ele,'*请输入正确日期格式!');
            return false;
        }
        else{returnInfo(ele,'*输入成功!',200)}
        return true;
    });
    if(!f){return;}
    // 申请单位 / 专利号 / 专利类型 / 是否授权
    var applyDepartment = applyDepartmentEle.value;
    var pNumber = pNumberEle.value;
    var pType = pTypeEle.value;
    var isAuthorized = isAuthorizedEle.value;
    var isExh = isExhEle.value;

    var formData = `p_title=${pTitle}&all_author_mid=${author_mid.toString()}&apply_date=${applyDate}&get_date=${getDate}&apply_department=${applyDepartment}&p_number=${pNumber}&p_type=${pType}&isAuthorized=${isAuthorized}&isExh=${isExh}`;
    var xhr = getXhr();
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState ==4 && xhr.status == 200 )
        {
            var res = xhr.responseText;
            var resObj = JSON.parse(res);
            returnInfo(isExhEle,resObj.msg,resObj.code);
            if(resObj.code == 200)
            {
                confirm(`${resObj.msg}`)?clearInfo():clearInfo();
                return;
            }
        }
    }
    xhr.open('post','/admin/addPatent',true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(formData);
}























