<template>
<div>
  <el-table ref="table1" header-row-class-name="tableHead" @selection-change="handleSelectionChange" border tooltip-effect="dark">
    <el-table-column type="selection" :selectable='checkboxT' width="34"></el-table-column>
    <el-table-column prop="orderNo" label="生产订单号" width="120"></el-table-column>
    <el-table-column label="生产物料" width="360">
      <template slot-scope="scope">
        {{ scope.row.materialCode + ' ' + scope.row.materialName}}
      </template>
    </el-table-column>
    <el-table-column prop="planOutput" label="计划生产数量" width="105"></el-table-column>
    <el-table-column prop="outputUnitName" label="单位" width="50"></el-table-column>
    <el-table-column label="入库物料" width="360">
      <template slot-scope="scope">
        {{ scope.row.materialCode + ' ' + scope.row.materialName}}
      </template>
    </el-table-column>
    <el-table-column prop="planOutput" label="实际生产数量" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="单位" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="物料批次" width="105"></el-table-column>
    <el-table-column prop="mixType" label="是否混合罐" width="105"></el-table-column>
    <el-table-column prop="potNo" label="原汁罐号" width="105"></el-table-column>
    <el-table-column prop="fullPotAmount" label="满罐数量" width="105"></el-table-column>
    <el-table-column prop="fullPotDate" label="满罐日期" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="移动类型" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="库存类型" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="交货已完成标识" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="货架寿命到期日" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="入库库位" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="接口回写" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="审核意见" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="审核人" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="审核时间" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="备注" width="105"></el-table-column>
    <el-table-column prop="planOutput" label="备注" width="105"></el-table-column>
    <el-table-column fixed="right" label="操作" width="65">
      <template slot-scope="scope">
        <el-button style="padding: 0;" @click="redact(scope.row)" type="text" v-if="!((scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass') && isAuth('sys:verifyInStorage:auditing')">{{ scope.row.redact? '保存' : '编辑'}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: 'squeeze',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item)
      })
    },
    // 审核通过禁用
    checkboxT (row) {
      if ((row.status === 'checked' && row.interfaceReturnStatus === '1') || row.status === 'noPass') {
        return 0
      } else {
        return 1
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
