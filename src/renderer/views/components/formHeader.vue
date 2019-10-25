<template>
  <el-form :inline="true" :model="formHeader" size="small" label-width="82px" class="topform">
    <el-form-item label="生产车间：">
      <p class="el-input">{{formHeader.workShopName || ''}}</p>
    </el-form-item>
    <el-form-item label="产线：">
      <p class="el-input" v-if="!pro">{{formHeader.productLineName || ''}}</p>
      <p class="el-input" v-else>
        <span v-if="formHeader.factoryCode !== '6010'">{{formHeader.productLineName || ''}}</span>
        <el-select v-model="formHeader.productLine" :disabled="!isRedact" v-else>
          <el-option :label="iteam.deptName" :value="iteam.deptId" v-for="(iteam, index) in Team" :key="index"></el-option>
        </el-select>
      </p>
    </el-form-item>
    <el-form-item label="订单号：">
      <p class="el-input">{{formHeader.orderNo || ''}}</p>
    </el-form-item>
    <el-form-item label="生产品项：">
      <el-tooltip class="item" effect="dark" :content="(formHeader.materialCode || '') + ' ' + (formHeader.materialName || '')" placement="top">
        <p class="el-input" style="text-overflow: ellipsis;" >{{(formHeader.materialCode || '') + ' ' + (formHeader.materialName || '')}}</p>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="订单日期：">
      <p class="el-input">{{formHeader.orderDate | formatDate}}</p>
    </el-form-item>
    <el-form-item label="计划产量：">
      <p class="el-input">{{(formHeader.planOutput || '') + ' ' + (formHeader.outputUnit || '')}}</p>
    </el-form-item>
    <el-form-item label="生产日期：">
      <el-date-picker size="small" type="date" @change="updateProductDate" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="formHeader.productDate" style="width: 145px"></el-date-picker>
    </el-form-item>
    <el-form-item label="提交人员：">
      <p class="el-input">{{formHeader.operator || ''}}</p>
    </el-form-item>
    <el-form-item label="提交时间：">
      <p class="el-input">{{formHeader.operDate? (formHeader.operDate.indexOf('.')!==-1?formHeader.operDate.substring(0, formHeader.operDate.indexOf('.')):formHeader.operDate):''}}</p>
    </el-form-item>
  </el-form>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'formHeader',
  data () {
    return {
      Team: []
    }
  },
  props: {
    formHeader: {},
    pro: Boolean,
    isRedact: Boolean,
    updateProductDateCallback: Function
  },
  mounted () {
  },
  methods: {
    updateProductDate: function (val) {
      this.$emit('updateProductDateCallback', val)
    },
    getLin (id) {
      this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
        if (data.code === 0) {
          this.Team = data.childList
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  computed: {},
  components: {},
  filters: {
    formatDate (date) {
      if (date) {
        return date
      }
      return ''
    }
  }
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
  @import '@/assets/scss/_common.scss';
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
