<template>
  <div id="app">
    <router-view id="Router"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // if (this.$route.meta.title) document.title = this.$route.meta.title
    if (self === top) {
      document.documentElement.style.visibility = 'visible'
    } else {
      alert('在iframe中,请检查链接')
    }
  }
}
</script>

<style>
  @import "assets/css/base.css";
  @import "assets/icon/iconfont.css";
  html{
    visibility: hidden;
  }
</style>
