<template>
<div>
  <el-col :span="24">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
          <el-select placeholder="请选择活动区域" v-model="scope.row.address">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="asdasd"
        width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.user" placeholder="审批人"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
          <el-select placeholder="请选择活动区域" v-model="scope.row.address">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="筛前罐 KG">
        <el-table-column label="入（起始）A">
          <template slot-scope="scope">
            <el-input v-model="scope.user" placeholder="审批人"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="出（起始）B">
          <template slot-scope="scope">
            <el-input v-model="scope.user" placeholder="审批人"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="出（结束）C">
          <template slot-scope="scope">
            <el-input v-model="scope.user" placeholder="审批人"></el-input>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </el-col>
</div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      tableData: [
        {
          name: 'test',
          editeFlage: false,
          address: null
        },
        {
          name: 'test',
          editeFlage: false,
          address: null
        },
        {
          name: 'test',
          editeFlage: false,
          address: null
        },
        {
          name: 'test',
          editeFlage: false,
          address: null
        },
        {
          name: 'test',
          editeFlage: false,
          address: null
        }
      ]
    }
  },
  mounted () {
    // httoProxy(`${MAIN_API.USERLIST_API}`, 'GET', {
    // }).then(res => {
    // })
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
