var nameMap = {
  "SZU-COFS-001T":	["王义平","Yiping Wang","WangYiping"],
  "SZU-COFS-002T":	["廖常锐","Changrui Liao","LiaoChangrui"],
  "SZU-COFS-003T":	["王英","Ying Wang","WangYing"],
  "SZU-COFS-005M":	["钟晓勇","Zhengyong Li","ZhongXiaoyong"],
  "SZU-COFS-006M":	["周江涛","Xiaoyong Zhong","ZhouJiangtao"],
  "SZU-COFS-007M":	["刘颖洁","Jiangtao Zhou","LiuYingjie"],
  "SZU-COFS-008P":	["王冠军","Yingjie Liu","WangGuanjun"],
  "SZU-COFS-009P":	["尹国路","Guanjun Wang","YinGuolu"],
  "SZU-COFS-010P":	["孙兵","Guolu Yin","SunBing"],
  "SZU-COFS-011PT":	["何俊","Bing Sun","HeJun"],
  "SZU-COFS-022PT":	["白志勇","Jun He","BaiZhiyong"],
  "SZU-COFS-012P":	["赵静","Jing Zhao","ZhaoJing"],
  "SZU-COFS-013DP":	["唐剑","Jian Tang","TangJian"],
  "SZU-COFS-014MD":	["杨凯明","Kaiming Yang","YangKaiming"],
  "SZU-COFS-015D":	["徐锡镇","Xizhen Xu","XuXizhen"],
  "SZU-COFS-016M":	["王侨","Qiao Wang","WangQiao"],
  "SZU-COFS-017P":	["汪超","Chao Wang","WangChao"],
  "SZU-COFS-018D":	["刘申","Shen Liu","LiuShen"],
  "SZU-COFS-019M":	["谭展","Zhan Tan","TanZhan"],
  "SZU-COFS-020MD":	["黄益建","Yijian Huang","HuangYijian"],
  "SZU-COFS-021M":	["邓蜜","Mi Deng","DengMi"],
  "SZU-COFS-023P":	["李明全","Zhiyong Bai","LiMingquan"],
  "SZU-COFS-025M":	["杨天航","Mingquan Li","YangTianhang"],
  "SZU-COFS-026M":	["许金山","Cailing Fu","XuJinshan"],
  "SZU-COFS-027M":	["曹绍情","Tianhang Yang","CaoShaoqing"],
  "SZU-COFS-028MD":	["张哲","Jinshan Xu","ZhangZhe"],
  "SZU-COFS-029MD":	["郭奎奎","Shaoqing Cao","GuoKuikui"],
  "SZU-COFS-030M":	["朱峰","Zhe Zhang","ZhuFeng"],
  "SZU-COFS-031P":	["张峰","Kuikui Guo","ZhangFeng"],
  "SZU-COFS-032P":	["伍铁生","Feng Zhu","WuTiesheng"],
  "SZU-COFS-033P":	["侯茂祥","Feng Zhang","HouMaoxiang"],
  "SZU-COFS-034VM":	["刘聪","Tiesheng Wu","LiuCong"],
  "SZU-COFS-035VD":	["张聪哲","Maoxiang Hou","ZhangCongzhe"],
  "SZU-COFS-036VM":	["王巧妮","Cong Liu","WangQiaoni"],
  "SZU-COFS-037M":	["林初跑","Congzhe Zhang","LinChupao"],
  "SZU-COFS-038P":	["班建峰","Qiaoni Wang","BanJianfeng"],
  "SZU-COFS-039M":	["李自亮","Chupao Lin","LiZiliang"],
  "SZU-COFS-040M":	["王佳","Jianfeng Ban","WangJia"],
  "SZU-COFS-041M":	["张龙飞","Ziliang Li","ZhangLongfei"],
  "SZU-COFS-042M":	["邵宇","Jia Wang","ShaoYu"],
  "SZU-COFS-043M":	["张岩","Longfei Zhang","ZhangYan"],
  "SZU-COFS-044T":	["周慕蓉","Yu Shao","ZhouMurong"],
  "SZU-COFS-045M":	["张云芳","Yan Zhang","ZhangYunfang"],
  "SZU-COFS-046M":	["李驰","Murong Zhou","LiChi"],
  "SZU-COFS-047M":	["鞠帅","Yunfang Zhang","JuShuai"],
  "SZU-COFS-048M":	["毛淳","Chi Li","MaoChun"],
  "SZU-COFS-050M":	["黄伟","Shuai Ju","HuangWei"],
  "SZU-COFS-051P":	["周鹏","Chun Mao","ZhouPeng"],
  "SZU-COFS-052P":	["柏云龙","Wei Huang","BaiYunlong"],
  "SZU-COFS-053P":	["孙仲元","Peng Zhou","SunZhongyuan"],
  "SZU-COFS-024DP":	["付彩玲","Yunlong Bai","FuCailing"],
  "SZU-COFS-054P":	["王彩","Zhongyuan Sun","WangCai"],
  "SZU-COFS-004MDP":	["李正勇","Cai Wang","LiZhengyong"],
  "SZU-COFS-055P":	["蔡贵龙","Guilong Cai","CaiGuilong"],
  "SZU-COFS-056P":	["王佳晨","Jiachen Wang","WangJiachen"],
  "SZU-COFS-057P":	["张莉超","Lichao Zhang","ZhangLichao"],
  "SZU-COFS-058P":	["余建","Jian Yu","YuJian"],
  "SZU-COFS-059D":	["杜斌","Bin Du","DuBin"],
  "SZU-COFS-060M":	["张凤婵","Fengchan Zhang","ZhangFengchan"],
  "SZU-COFS-061M":	["韩金利","Jinli Han","HanJinli"],
  "SZU-COFS-062M":	["刘雪雅","Xueya Liu","LiuXueya"],
  "SZU-COFS-063M":	["朱梦","Meng Zhu","ZhuMeng"],
  "SZU-COFS-064M":	["王静如","Jingru Wang","WangJingru"],
  "SZU-COFS-065M":	["吴晗","Han Wu","WuHan"],
  "SZU-COFS-066D":	["邵来鹏","Laipeng Shao","ShaoLaipeng"],
  "SZU-COFS-067M":	["李亚莉","Yali Li","LiYali"],
  "SZU-COFS-068M":	["刘朝","Chao Liu","LiuZhao"],
  "SZU-COFS-069M":	["丘志鸿","Zhihong Qiu","QiuZhihong"],
  "SZU-COFS-070M":	["熊聪","Cong Xiong","XiongCong"],
  "SZU-COFS-071M":	["赵媛媛","Yuanyuan Zhao","ZhaoYuanyuan"]

};






















