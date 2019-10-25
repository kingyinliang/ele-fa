<template>
  <el-col v-loading.fullscreen.lock="loginstatus" element-loading-text="加载中">
    <div class="main">
      <el-card>
        <el-row class="clearfix">
          <div style="float: right">
            <el-form :inline="true" :model="capacity" size="small" label-width="68px" class="topforms2" @keyup.enter.native="GetList()">
              <el-form-item>
                <el-input v-model="capacity.capacity" placeholder="物料" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="GetList(false,true)" v-if="isAuth('sys:capacity:listCapa')">查询</el-button>
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
              <el-tree :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" @node-click="GetList" :expand-on-click-node="false"></el-tree>
            </el-card>
          </el-col>
          <el-col :span="16" v-if="isAuth('sys:capacity:listCapa')">
            <el-card>
              <div slot="header" class="clearfix">
                <span>产能信息</span>
              </div>
              <div>
                <el-button type="danger" @click="remove()" style="float: right;margin:0 20px 20px 0" size="small" v-if="isAuth('sys:capacity:deleteCapa')">批量删除</el-button>
                <el-button type="primary" @click="addOrupdate()" style="float: right;margin:0 20px 20px 0" size="small" v-if="isAuth('sys:capacity:saveOrUpdateCapa')">增加</el-button>
              </div>
              <el-table
                ref="table1"
                :data="CapacityList"
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
                  label="序号"
                  :index="indexMethod"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="workNum"
                  :show-overflow-tooltip="true"
                  label="物料">
                  <template slot-scope="scope">
                    {{scope.row.materialCode + ' ' + scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="basicCapacity"
                  label="标准产能"
                  :show-overflow-tooltip="true"
                  width="87">
                </el-table-column>
                <el-table-column
                  prop="basicCapacityUnitName"
                  label="单位"
                  width="50"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  prop="standardOfMan"
                  label="标配人力"
                  width="80"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  prop="changer"
                  label="操作人"
                  width="87"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  prop="changed"
                  label="操作时间"
                  width="120"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="50">
                  <template slot-scope="scope">
                    <el-button style="padding: 0;" type="text" @click="addOrupdate(scope.row)" v-if="isAuth('sys:capacity:saveOrUpdateCapa')">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
    <capacity-add-or-update v-if="visible" :SerchSapList="SerchSapList" ref="capaaddupdate" @refreshDataList="GetList"></capacity-add-or-update>
  </el-col>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
import CapacityAddOrUpdate from './CapacityAddOrUpdate'
export default {
  name: 'CapacityManage',
  data () {
    return {
      loginstatus: false,
      visible: false,
      capacity: {
        capacity: ''
      },
      SerchSapList: [],
      deptId: '',
      OrgTree: [],
      CapacityList: [],
      arrList: [],
      multipleSelection: [],
      totalCount: 1,
      currPage: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.getTree()
    this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', {params: ''}, false, false, false).then(({data}) => {
      if (data.code === 0) {
        this.SerchSapList = data.list
      } else {
        this.$message.error(data.msg)
      }
    })
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
    // 获取产能列表
    GetList (data, st) {
      this.loginstatus = true
      if (data) {
        this.deptId = data.deptId
      }
      if (st) {
        this.currPage = 1
      }
      this.$http(`${BASICDATA_API.CAPALIST_API}`, 'POST', {
        deptId: this.deptId,
        materialCode: this.capacity.capacity,
        currPage: JSON.stringify(this.currPage),
        pageSize: JSON.stringify(this.pageSize)
      }).then(({data}) => {
        if (data.code === 0) {
          this.multipleSelection = []
          this.CapacityList = data.page.list
          this.currPage = data.page.currPage
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.visible = false
        this.loginstatus = false
      })
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.id)
      })
    },
    // 新增  修改
    addOrupdate (data) {
      if (this.deptId) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.capaaddupdate.init(this.deptId, data)
        })
      } else {
        this.$message.error('请先选择部门')
      }
    },
    // 删除
    remove () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的产能')
      } else {
        this.$confirm('确认删除该物料产能, 是否继续?', '删除产能', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${BASICDATA_API.CAPADEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.multipleSelection = []
              this.GetList()
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
      this.GetList()
    }
  },
  computed: {},
  components: {
    CapacityAddOrUpdate
  }
}
</script>

<style scoped>

</style>
