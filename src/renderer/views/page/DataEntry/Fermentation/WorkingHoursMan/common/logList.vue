<template>
  <div></div>
</template>

<script>
export default {
  name: 'working',
  data () {
    return {
      form: {
      },
      statusList: [{
        name: '已保存',
        value: '0'
      }, {
        name: '已提交',
        value: '1'
      }]
    }
  }
}
</script>

<style lang="less">
.selectwidth {width:170px}
</style>
