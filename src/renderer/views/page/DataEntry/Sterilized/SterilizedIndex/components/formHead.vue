<template>
  <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform marbottom">
    <el-form-item label="生产车间：">
      <p class="el-input">{{formHeader.workShopName || ''}}</p>
    </el-form-item>
    <el-form-item label="杀菌锅号：">
      <p class="el-input">{{formHeader.panName || ''}}</p>
    </el-form-item>
    <el-form-item label="订单号：">
      <p class="el-input">{{formHeader.orderNo || ''}}</p>
    </el-form-item>
    <el-form-item label="生产品项：">
      <p class="el-input">{{formHeader.materialCode + ' ' + formHeader.materialName}}</p>
    </el-form-item>
    <el-form-item label="生产日期：">
      <p class="el-input">{{formHeader.productDate || ''}}</p>
    </el-form-item>
    <el-form-item label="计划产量：">
      <p class="el-input">{{formHeader.planOutput || ''}}</p>
    </el-form-item>
    <el-form-item label="杀菌状态：">
      <p class="el-input">{{formHeader.steStatus || ''}}</p>
    </el-form-item>
    <el-form-item label="提交人员：">
      <p class="el-input">{{formHeader.changer || ''}}</p>
    </el-form-item>
    <el-form-item label="提交时间：">
      <p class="el-input">{{formHeader.changed || ''}}</p>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'formHead',
  data () {
    return {}
  },
  props: {
    formHeader: {}
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style scoped>
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 8px!important;
  }
  .el-input{
    width: 145px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 32px;
  }
</style>
