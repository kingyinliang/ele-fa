<template>
<div>
  <div class="audit"><i class="iconfont factory-shouqicaidan"></i><span>审核日志</span></div>
  <el-table
    :data="tableData"
    header-row-class-name="tableHead"
    border
    style="width: 100%">
    <el-table-column
      label="序号"
      type="index"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="审核动作"
      width="180">
      <template slot-scope="scope">{{scope.row.status === 'noPass'? '不通过':scope.row.status === 'checked'? '通过' : scope.row.status === 'submit'?  '反审' : '' }}</template>
    </el-table-column>
    <el-table-column
      prop="memo"
      label="审核意见">
    </el-table-column>
    <el-table-column
      prop="verify_man"
      label="审核人">
    </el-table-column>
    <el-table-column
      prop="verify_date"
      label="审核时间">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: 'AuditLog',
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
    line-height: 40px;
  i{
    font-size: 22px;
    float: left;
  }
  span{
    margin-left: 12px;
    font-size: 16px;
    font-weight: bold;
  }
  }
</style>
