<template>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card>
          <el-row class="clearfix">
            <div style="float: right">
              <el-form :inline="true" :model="condition" size="small" label-width="68px" class="topforms2" @keyup.enter.native="getList(true)">
                <el-form-item>
                  <el-input v-model="condition.param" placeholder="用户名/工号" suffix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="getList(true)">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>组织架构</span>
                </div>
                <el-tree :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" @node-click="setdetail" :expand-on-click-node="false"></el-tree>
              </el-card>
            </el-col>
            <el-col :span="16" v-if="isAuth('sys:user:checkList')">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>人员</span>
                </div>
                <div>
                  <el-button type="danger" @click="remove()" style="float: right;margin:0 20px 20px 0" size="small" v-if="isAuth('sys:user:delete')">批量删除</el-button>
                  <el-button type="primary" @click="addOrupdate()" style="float: right;margin:0 20px 20px 0" size="small" v-if="isAuth('sys:user:save')">增加</el-button>
                  <el-table
                    ref="table1"
                    :data="userArr"
                    @selection-change="handleSelectionChange"
                    header-row-class-name="tableHead"
                    border
                    tooltip-effect="dark"
                    style="width: 100%;margin-bottom: 20px">
                    <el-table-column
                      type="selection"
                      width="34">
                    </el-table-column>
                    <el-table-column
                      type="index"
                      :index="indexMethod"
                      width="55">
                    </el-table-column>
                    <el-table-column
                      prop="workNum"
                      label="人员工号"
                      width="87">
                    </el-table-column>
                    <el-table-column
                      prop="workNumTemp"
                      label="虚拟工号"
                      width="110">
                    </el-table-column>
                    <el-table-column
                      prop="realName"
                      label="人员姓名"
                      width="87">
                    </el-table-column>
                    <el-table-column
                      prop="deptName"
                      label="所属部门"
                      width="87"
                      :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                      prop="post"
                      label="职务"
                      :show-overflow-tooltip="true"
                      width="150">
                    </el-table-column>
                    <el-table-column
                      prop="email"
                      label="邮箱"
                      :show-overflow-tooltip="true"
                      width="250">
                    </el-table-column>
                    <el-table-column
                      prop="mobile"
                      label="手机号"
                      :show-overflow-tooltip="true"
                      width="112">
                    </el-table-column>
                    <el-table-column
                      prop="created"
                      label="创建日期"
                      width="160">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      fixed="right"
                      width="65">
                      <template slot-scope="scope">
                        <el-button style="padding: 0;" type="text" @click="addOrupdate(scope.row.userId)" v-if="isAuth('sys:user:update') && isAuth('sys:user:info')">编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
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
            </el-col>
          </el-row>
        </el-card>
      </div>
      <user-add-or-update v-if="visible" ref="addOrupdate" @refreshDataList="getList" :OrgTree="OrgTree"></user-add-or-update>
    </el-col>
</template>

<script>
import UserAddOrUpdate from './UserAddOrUpdate'
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'UserManages',
  data () {
    return {
      condition: {
        param: ''
      },
      visible: false,
      deptId: '',
      deptName: '',
      OrgTree: [],
      userArr: [],
      multipleSelection: [],
      totalCount: 1,
      currPage: 1,
      arrList: [],
      pageSize: 10
    }
  },
  mounted () {
    this.getTree()
  },
  methods: {
    // 序号
    indexMethod (index) {
      return index + 1 + (this.currPage * 1 - 1) * (this.pageSize * 1)
    },
    // 获取组织结构树
    getTree () {
      this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
        if (data.code === 0) {
          this.OrgTree = data.deptList
          this.arrList = [this.OrgTree[0].children[0].deptId]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 根据deptId查询用户
    setdetail (data) {
      this.deptId = data.deptId
      this.deptName = data.deptName
      this.getList()
    },
    // 获取列表
    getList (st) {
      if (st) {
        this.currPage = 1
      }
      if (!this.deptId) {
        this.$message.error('请选择组织层级')
        return
      }
      this.$http(`${SYSTEMSETUP_API.USERLIST1_API}`, 'POST', {
        deptId: this.deptId,
        param: this.condition.param,
        currPage: JSON.stringify(this.currPage),
        pageSize: JSON.stringify(this.pageSize)
      }).then(({data}) => {
        if (data.code === 0) {
          this.multipleSelection = []
          this.userArr = data.page.list
          this.currPage = data.page.currPage
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.visible = false
      })
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.userId)
      })
    },
    // 新增  修改
    addOrupdate (id) {
      if (this.deptId) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.addOrupdate.init(this.deptId, this.deptName, id)
        })
      } else {
        this.$message.error('请先选择部门')
      }
    },
    // 删除
    remove () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的用户')
      } else {
        this.$confirm('确认删除用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${SYSTEMSETUP_API.USERDEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.multipleSelection = []
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.getList()
    }
  },
  computed: {},
  components: {
    UserAddOrUpdate
  }
}
</script>

<style scoped>
.el-button {  }
</style>
