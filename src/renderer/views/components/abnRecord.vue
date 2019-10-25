<template>
  <div>
    <div class="audit"><span>异常情况记录</span></div>
    <div><el-input type="textarea" class="textarea" style="width: 100%;height:90px"></el-input></div>
  </div>
</template>

<script>
export default {
  name: 'abnRecord',
  props: {
    tableData: {}
  },
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
.audit{
  line-height: 32px;
  margin: 10px 0;
  i{
    font-size: 22px;
    float: left;
  }
  span{
    font-size: 16px;
  }
}
</style>
