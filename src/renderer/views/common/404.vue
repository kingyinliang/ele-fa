<template>
  <div>
    <div class="error clearfix">
      <img src="@/assets/img/404.png" alt="">
      <div class="errortxt">
        <h3>404</h3>
        <p>抱歉，你访问的页面不存在</p>
        <el-button type="primary" size="small" @click="$router.push({ name: 'home' })">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error404',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.error{
  padding: 30px 0;
  width: 790px;
  margin: auto;
  margin-top: 50px;
  img{
    width: 443px;
    height: 340px;
    float: left;
  }
  .errortxt{
    margin-top: 120px;
    margin-left: 40px;
    width: 300px;
    float: left;
  }
  h3{
    text-align: left;
    font-size: 60px;
    font-weight: bold;
    letter-spacing: 5px;
  }
  p{
    text-align: left;
    font-size: 20px;
    color: #8a979e;
    line-height: 45px;
  }
}
</style>
