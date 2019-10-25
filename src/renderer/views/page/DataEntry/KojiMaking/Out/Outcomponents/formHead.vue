<template>
  <el-form :inline="true" :model="formHeader" size="small" label-width="82px" class="topform">
    <el-form-item label="生产车间：">
      <p class="el-input">{{formHeader.workShopName ? formHeader.workShopName : ''}}</p>
    </el-form-item>
    <el-form-item label="制曲房号：">
      <p class="el-input">{{formHeader.houseName ? formHeader.houseName : ''}}</p>
    </el-form-item>
    <el-form-item label="生产订单：">
      <p class="el-input">{{formHeader.orderNo ? formHeader.orderNo : ''}}</p>
    </el-form-item>
    <el-form-item label="生产品项：">
      <el-tooltip class="item" effect="dark" :content="(formHeader.materialCode ? formHeader.materialCode : '') + ' ' + (formHeader.materialName ? formHeader.materialName : '')" placement="top">
        <p class="el-input">{{(formHeader.materialCode ? formHeader.materialCode : '') + ' ' + (formHeader.materialName ? formHeader.materialName : '')}}</p>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="生产日期：">
      <p class="el-input">{{formHeader.productDate ? formHeader.productDate : ''}}</p>
    </el-form-item>
    <el-form-item label="入罐号：">
      <el-select v-model="formHeader.inPotNo" placeholder="请选择" filterable size="small" style="width: 145px" :disabled="!(CraftControlStatus !== 'submit')">
        <el-option :label="iteam.holderName" :value="iteam.holderId" v-for="iteam in InPot" :key="iteam.holderName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="连续蒸煮号：" label-width="85px">
      <p class="el-input">{{formHeader.cookingName ? formHeader.cookingName : ''}}</p>
    </el-form-item>
    <el-form-item label="提交人员：">
      <p class="el-input">{{formHeader.changer ? formHeader.changer : ''}}</p>
    </el-form-item>
    <el-form-item label="提交时间：">
      <p class="el-input">{{formHeader.changed? (formHeader.changed.indexOf('.')!==-1?formHeader.changed.substring(0, formHeader.changed.indexOf('.')):formHeader.changed):''}}</p>
    </el-form-item>
  </el-form>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'fromHead',
  data () {
    return {
      InPot: []
    }
  },
  props: {
    formHeader: {},
    CraftControlStatus: {},
    isRedact: {}
  },
  mounted () {
    this.GetInPot()
  },
  methods: {
    GetInPot () {
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
        currPage: 1,
        holder_type: '001',
        pageSize: 9999,
        type: 'holder_type'
      }).then(({data}) => {
        if (data.code === 0) {
          this.InPot = data.page.list
        } else {
          this.$message.error(data.msg)
        }
        this.visible = false
      })
    }
  },
  computed: {},
  components: {}
}
</script>
<style lang="scss">
  .topform{
    .el-form-item__content{
      height: 32px;
      border-bottom: 1px solid #D8D8D8;
    }
  }
</style>
<style lang="scss" scoped>
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
