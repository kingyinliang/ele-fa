<template>
  <el-col v-loading.fullscreen.lock="lodings" element-loading-text="加载中">
    <div class="main">
      <el-card>
        <el-row>
          <el-form :inline="true" :model="dataForm" size="small" label-width="68px" class="topforms2">
            <el-form-item>
              <el-input v-model="dataForm.workNum" placeholder="用户名" suffix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('sys:user:userManagementList')">查询</el-button>
              <el-button type="primary" size="small" @click="outPut()">导出</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table
            class="orderTable"
            ref="table1"
            border
            header-row-class-name="tableHead"
            :data="UserList"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom: 20px">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="55">
            </el-table-column>
            <el-table-column
              label="用户名"
              width="200"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ `${scope.row.realName}（${scope.row.workNum}）` }}
              </template>
            </el-table-column>
            <el-table-column
              label="角色名称"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button style="padding: 0;" type="text" v-if="isAuth('sys:user:userManagementList')" v-for="(item, index) in scope.row.roleName" :key="index">{{item.roleName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作">
              <template slot-scope="scope">
                <!--<el-button style="padding: 0;" type="text" @click="PasswordReset(scope.row.user_id)" v-if="isAuth('sys:user:reset')">重置密码</el-button>-->
                <el-button style="padding: 0;" type="text" @click="PasswordReset(scope.row.userId)" v-if="isAuth('sys:user:reset')">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
  </el-col>
</template>

<script>
import {SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'UserExport',
  data () {
    return {
      lodings: false,
      dataForm: {
        workNum: ''
      },
      UserListArr: [],
      UserList: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 1
    }
  },
  mounted () {
    this.GetList()
  },
  methods: {
    outPut () {
      this.$message.error('敬请期待')
      return false
      // let that = this
      // exportFile(`${REP_API.REPOUT_API}`, '用户表导出', that)
    },
    PasswordReset (id) {
      this.$confirm('确认重置密码, 是否继续?', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.PASSWORDRESET_API}`, 'POST', {userId: id}).then(({data}) => {
          this.lodings = false
          if (data.code === 0) {
            this.$message.success('重置成功')
            this.GetList()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    dataPro (num) {
      this.UserList = this.UserListArr.slice((num - 1) * this.pageSize, num * this.pageSize)
      this.totalCount = this.UserListArr.length
      this.currPage = num
    },
    GetList (st) {
      if (st) {
        this.currPage = 1
      }
      this.lodings = true
      this.$http(`${SYSTEMSETUP_API.USERLISTPASS_API}`, 'POST', {
        workNum: this.dataForm.workNum
      }).then(({data}) => {
        this.lodings = false
        if (data.code === 0) {
          this.UserListArr = data.page
          this.dataPro(1)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.deviceId)
      })
    },
    // 序号
    indexMethod (index) {
      return index + 1 + (this.currPage * 1 - 1) * (this.pageSize * 1)
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.dataPro(val)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
