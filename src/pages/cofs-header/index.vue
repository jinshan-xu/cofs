<style lang='stylus'>
@import '~assets/styles/theme'
.cofs-header
  background-color $main-color
  background $main-color url(../../assets/imgs/index/hbg-red-current.png) // TODO
  border-bottom 5px solid $golden-color-3
  .container 
    position relative
  .header 
    &__prefix
      position absolute
      right 10px
      top 10px
      &-item 
        display inline-block
        padding 0 20px
        border-right 1px solid $grey-color-2
        color $grey-color-2
        cursor pointer
        &:hover
          color #fff
          border-color #fff
        &:last-child
          border none 
          padding-right 0
  .header__brands
    display flex 
    justify-content space-between
    align-items center
    padding 40px 0 10px
  .brands__cofs
    display flex 
    align-items center 
    cursor pointer
  img.brands__cofs-logo
    flex-shrink 0
    width 90px
    margin-right 10px
  img.brands__szu
    flex-shrink 0
    width 200px
    cursor pointer
  .cn,.en
    color $grey-color-1
  .en 
    font-size 16px
  .cn 
    font-size 32px
    letter-spacing 1px
    font-weight 500
    padding-bottom 10px
  .header__menu.el-menu--horizontal
    background-color transparent
    border-bottom none
    >li.el-menu-item, .el-submenu__title
      color $golden-color-2
      font-size 20px
      border-bottom-color $golden-color-3
    .el-submenu__icon-arrow
      color $golden-color-3
    
</style>


<template lang="pug">
.cofs-header
  //- 大屏幕下显示
  .hidden-xs-only.container
    .header__prefix 
      .header__prefix-item(v-for='item,idx in prefixList' :key='idx' @click='handleRedirect(item.url)') {{item.label}}
    .header__brands
      .brands__cofs
        img.brands__cofs-logo(src='~assets/imgs/index/logo-colors.png' alt='cofs-logo')
        .brands__cofs-name
          .cn 广东省光纤传感技术粤港联合研究中心
          .en Guangdong and Hong Kong Joint Research Centre for Optical Fibre Sensors
      img.brands__szu(src='~assets/imgs/index/szu-white.png' alt='szu-logo')
    .header__nav
      el-menu(class='header__menu' 
        mode="horizontal" 
        :default-active='defaultActive'
        @select='handleSelect')
        template(v-for='item in headerMenuList' :index='item.key')
          el-submenu(v-if='item.subMenu' :index='item.key')
            template(slot='title') {{item.label}}
            el-menu-item(v-for='ele in item.subMenu' :key='ele.key' :index='ele.key') {{ele.label}}
          el-menu-item(v-else :index='item.key') {{item.label}}
          

  //- 小屏幕下显示
  .hidden-sm-and-up.container 
    

  


</template>

<script>
import {headerMenuList} from 'src/enum/cofs-header'

export default {
  name: "cofs-header",
  data(){
      return {
        headerMenuList,
        defaultActive: '1',
        prefixList: [
          {label: '登录', url: '1'},
          {label: '深大内部网', url: '2'},
          {label: '教师邮箱', url: '3'},
          {label: '学生邮箱', url: '4'},
          {label: '图书馆', url: '5'},
          {label: 'English', url: '6'}

        ]
      }
  },
  mounted() {
      
  },
  methods: {
    handleRedirect(url){},
    handleSelect(){}
  },
};
</script>