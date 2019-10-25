<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <!--<div class="topTitle">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item>基础数据</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>设备管理</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <div class="main">
      <el-card>
        <el-row class="clearfix">
          <div style="float: right">
            <el-form :inline="true" :model="param" size="small" label-width="68px" class="topforms2" @keyup.enter.native="getList(true)" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="param.param" placeholder="设备编号" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="getList(true)" v-if="isAuth('sys:device:checkList')">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="orgcard">
              <div slot="header" class="clearfix">
                <span>组织架构一览</span>
              </div>
              <el-tree :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" @node-click="setdetail" :expand-on-click-node="false"></el-tree>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="orgcard">
              <div slot="header" class="clearfix">
                <span>设备管理</span>
              </div>
              <div>
                <el-button type="danger" size="small" @click="remove()" style="float: right;margin-bottom: 20px"  v-if="isAuth('sys:device:delete')">批量删除</el-button>
                <el-button type="primary" size="small" @click="addOrupdate(deptId)" v-if="isAuth('sys:device:save')" style="float: right;margin-bottom: 20px;margin-right: 10px">新增</el-button>
                <el-table
                  ref="table1"
                  border
                  header-row-class-name="tableHead"
                  :data="deviceList"
                  @selection-change="handleSelectionChange"
                  tooltip-effect="dark"
                  style="width: 100%;margin-bottom: 20px">
                  <el-table-column
                    type="selection"
                    width="34">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    :index="indexMethod"
                    label="序号"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="deviceNo"
                    width="120"
                    :show-overflow-tooltip="true"
                    label="设备编号">
                  </el-table-column>
                  <el-table-column
                    prop="deviceName"
                    label="设备描述"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="65">
                    <template slot-scope="scope">
                      <el-button type="text" @click="addOrupdate(deptId, scope.row)" v-if="isAuth('sys:device:update')">编辑</el-button>
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
    <add-orupdate v-if="visible" ref="addOrupdate" @refreshDataList="getList()"></add-orupdate>
  </el-col>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
import AddOrupdate from './DeviceAddorUpdate'
export default {
  name: 'DeviceManage',
  data () {
    return {
      arrList: [],
      deptId: 0,
      visible: false,
      OrgTree: [],
      param: {
        param: ''
      },
      deviceList: [],
      multipleSelection: [],
      totalCount: 0,
      currPage: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.getTree()
  },
  methods: {
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
    // 获取设备列表
    setdetail (data) {
      this.deptId = data.deptId
      this.getList()
    },
    // 获取列表
    getList (st) {
      if (st) {
        this.currPage = 1
      }
      this.$http(`${BASICDATA_API.DEVICELIST1_API}`, 'POST', {
        param: this.param.param,
        deptId: this.deptId,
        currPage: JSON.stringify(this.currPage),
        pageSize: JSON.stringify(this.pageSize)
      }).then(({data}) => {
        this.visible = false
        if (data.code === 0) {
          this.deviceList = data.list.list
          this.pageSize = data.list.pageSize
          this.totalCount = data.list.totalCount
          this.currPage = data.list.currPage
        } else {
          this.$message.error(data.msg)
        }
        this.multipleSelection = []
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
    // 添加和编辑
    addOrupdate (deptId, id) {
      if (deptId === 0) {
        this.$message.error('请选择部门后新增')
      } else {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.addOrupdate.init(deptId, id)
        })
      }
    },
    // 删除
    remove () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的设备')
      } else {
        this.$confirm('确认删除设备, 是否继续?', '删除设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${BASICDATA_API.DEVICEDEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
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
    AddOrupdate
  }
}
</script>

<style lang="scss">
.el-table-column--selection .cell { padding-right: 0 !important; }
</style>
