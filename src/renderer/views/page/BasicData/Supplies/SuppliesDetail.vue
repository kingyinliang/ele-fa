<template>
  <el-dialog
    class="sapdetail"
    title="物料详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="detailDialog" size="small" label-width="124px">
      <div class="title"><p>基础信息：</p></div>
      <el-form-item label="SAP编码：" >
        <span>{{detailDialog.sapCode}}</span>
      </el-form-item>
      <el-form-item label="物料描述：" >
        <span>{{detailDialog.itemName}}</span>
      </el-form-item>
      <el-form-item label="物料类型：" >
        <span>{{detailDialog.itemType}}</span>
      </el-form-item>
      <el-form-item label="基本单位：" >
        <span>{{detailDialog.itemBasicUnit}}</span>
      </el-form-item>
      <el-form-item label="物料组：" >
        <span>{{detailDialog.itemGroup}}</span>
      </el-form-item>
      <el-form-item label="跨公司冻结状态：" >
        <span>{{detailDialog.crossLockStatus}}</span>
      </el-form-item>
      <div class="title"><p>生产信息：</p></div>
      <el-form-item label="生产单位：" >
        <span>{{detailDialog.itemProductUnit}}</span>
      </el-form-item>
      <el-form-item label="换算比例：" >
        <span>{{detailDialog.ratio}}</span>
      </el-form-item>
      <div class="title"><p>生产信息：</p></div>
      <el-form-item label="工厂：" >
        <span>{{detailDialog.factory}}</span>
      </el-form-item>
      <el-form-item label="工厂冻结状态：" >
        <span>{{detailDialog.facLockStatus}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'SuppliesDetail',
  data () {
    return {
      visible: false,
      detailDialog: {}
    }
  },
  mounted () {
  },
  methods: {
    init (id) {
      this.$http(`${BASICDATA_API.SAPDETAIL_API}/${id}`, 'GET', {}).then(({data}) => {
        if (data.code === 0) {
          this.detailDialog = data.sapMaterialItemEntity
        } else {
          this.$message.error(data.msg)
        }
      }).then(() => {
        this.visible = true
      })
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
  .sapdetail{
    .el-form--inline .el-form-item__content{
      min-width: 155px;
    }
    .title{
      margin-bottom: 10px;
      border-top: 1px solid #bbbbbb;
      p{
        line-height: 40px;
        width: 100px;
        text-align: right
      }
    }
  }
</style>
