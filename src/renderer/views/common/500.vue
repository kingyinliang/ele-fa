<template>
  <div>
    <div class="error clearfix">
      <img src="@/assets/img/500.png" alt="">
      <div class="errortxt">
        <h3>500</h3>
        <p>抱歉，服务器出错了</p>
        <el-button type="primary" size="small" @click="$router.push({ name: 'home' })">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error500',
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
    margin-top: 120px;
    img{
      width: 419px;
      height: 202px;
      float: left;
    }
    .errortxt{
      margin-top: 20px;
      margin-left: 60px;
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
