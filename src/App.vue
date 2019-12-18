<style lang="stylus">
@import '~assets/styles/container'
@import '~assets/styles/colors'
@import '~assets/styles/reset'
#app
  background-color $background-color
  min-height 100vh
  font-size 14px
  font-family "微软雅黑", "Arial","Tahoma","Helvetica","STHeiti","Hiragino Sans GB","宋体","Microsoft Yahei",sans-serif;
</style>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
