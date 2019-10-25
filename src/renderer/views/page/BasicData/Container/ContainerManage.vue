<template>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <!--<div class="topTitle">-->
        <!--<el-breadcrumb separator="/">-->
          <!--<el-breadcrumb-item>基础数据</el-breadcrumb-item>-->
          <!--<el-breadcrumb-item>容器管理</el-breadcrumb-item>-->
        <!--</el-breadcrumb>-->
      <!--</div>-->
      <div class="main">
        <el-card>
          <h3>容器管理列表</h3>
          <el-row type="flex">
            <el-col>
              <el-form :inline="true" :model="form" size="small" label-width="100px" class="topforms1" @keyup.enter.native="qurery()" @submit.native.prevent>
                <el-form-item label="归属工厂：" >
                  <el-select v-model="form.factoryId" placeholder="请选择">
                    <el-option :label="item.deptName" v-for="(item, index) in factoryList" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="归属车间：">
                  <el-select v-model="form.deptId" placeholder="请选择">
                    <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="容器类型：">
                  <el-select v-model="form.holderType" placeholder="请选择">
                    <el-option label=""  value=""></el-option>
                    <el-option :label="item.value" v-for="(item, index) in dictList" :key="index" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="容器号：">
                  <el-input v-model="form.holderNo" placeholder="手动输入"></el-input>
                </el-form-item>
                <el-form-item label="容器量：">
                  <el-input v-model="form.holderHold" placeholder="手动输入"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width: 320px">
              <el-button type="primary" size="small" @click="qurery(true)" v-if="isAuth('sys:holder:checkList')">查询</el-button>
              <el-button type="primary" size="small" @click="addOrupdate()" v-if="isAuth('sys:holder:save')">新增</el-button>
              <el-button type="danger" size="small" @click="remove" v-if="isAuth('sys:holder:delete')">批量删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              ref="table1"
              header-row-class-name="tableHead"
              @selection-change="handleSelectionChange"
              :data="list"
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
                label="序号"
                width="55">
              </el-table-column>
              <el-table-column
                prop="typeName"
                label="容器类型"
                :show-overflow-tooltip="true"
                width="100">
              </el-table-column>
              <el-table-column
                prop="holderNo"
                label="容器号"
                :show-overflow-tooltip="true"
                width="80">
              </el-table-column>
              <el-table-column
                prop="holderName"
                :show-overflow-tooltip="true"
                label="容器描述">
              </el-table-column>
              <el-table-column
                prop="holderHold"
                label="容器量"
                :show-overflow-tooltip="true"
                width="80">
              </el-table-column>
              <el-table-column
                prop="holderPatch"
                label="批数"
                :show-overflow-tooltip="true"
                width="80">
              </el-table-column>
              <el-table-column
                prop="holderArea"
                label="物理区域"
                :show-overflow-tooltip="true"
                width="120">
              </el-table-column>
              <el-table-column
                prop="factoryName"
                label="归属工厂"
                :show-overflow-tooltip="true"
                width="92">
              </el-table-column>
              <el-table-column
                prop="deptName"
                label="归属车间"
                :show-overflow-tooltip="true"
                width="92">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                header-align="left"
                align="left"
                width="65">
                <template slot-scope="scope">
                  <el-button style="padding: 0;" type="text" @click="addOrupdate(scope.row.holderId)"  v-if="isAuth('sys:holder:delete') && isAuth('sys:holder:findById')">编辑</el-button>
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
      <con-addor-update v-if="visible" ref="addOrupdate" @refreshDataList="GetContainerList"></con-addor-update>
    </el-col>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
import ConAddorUpdate from './ContaninerAddorUpdate'
export default {
  name: 'ContainerManage',
  data () {
    return {
      visible: false,
      form: {},
      factoryList: [],
      workshop: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      multipleSelection: [],
      dictList: [],
      list: []
    }
  },
  mounted () {
    this.GetContainerList()
    this.getDictList()
    this.getFactoryList()
    // this.Getdeptcode(this.form.factoryId)
  },
  methods: {
    // 序号
    indexMethod (index) {
      return index + 1 + (this.currPage * 1 - 1) * (this.pageSize * 1)
    },
    // 获取容器列表
    GetContainerList (obj) {
      if (!obj) {
        obj = {
          type: 'holder_type',
          pageSize: this.pageSize,
          currPage: this.currPage
        }
      }
      this.$http(`${BASICDATA_API.CONTAINERLIST1_API}`, 'POST', obj).then(({data}) => {
        if (data.code === 0) {
          this.multipleSelection = []
          this.list = data.page.list
          this.currPage = data.page.currPage
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.visible = false
      })
    },
    // 容器参数下拉
    getDictList (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'holder_type'}).then(({data}) => {
        if (data.code === 0) {
          this.dictList = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getFactoryList () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
        if (res.data.code === 0) {
          this.factoryList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 获取归属车间,根据工厂ID
    Getdeptcode (factoryId) {
      if (factoryId) {
        this.$set(this.form, 'deptId', '')
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: factoryId}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.holderId)
      })
    },
    // 查询
    qurery (st) {
      if (st) {
        this.currPage = 1
      }
      this.GetContainerList({
        type: 'holder_type',
        pageSize: this.pageSize,
        currPage: this.currPage,
        holder_type: this.form.holderType,
        holder_no: this.form.holderNo,
        holder_hold: this.form.holderHold,
        factory: this.form.factoryId,
        dept_id: this.form.deptId
      })
    },
    // 编辑
    addOrupdate (id) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.addOrupdate.init(id)
      })
    },
    // 删除
    remove () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的容器')
      } else {
        this.$confirm('确认删除容器, 是否继续?', '删除容器', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${BASICDATA_API.CONTAINERDEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.multipleSelection = []
              this.GetContainerList()
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
      this.GetContainerList({
        type: 'holder_type',
        pageSize: val,
        currPage: '1',
        holder_type: this.form.holderType,
        holder_no: this.form.holderNo,
        holder_hold: this.form.holderHold,
        factory: this.form.factoryId,
        dept_id: this.form.deptId
      })
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.GetContainerList({
        type: 'holder_type',
        holder_type: this.form.holderType,
        holder_no: this.form.holderNo,
        holder_hold: this.form.holderHold,
        dept_id: this.form.deptId,
        pageSize: this.pageSize,
        factory: this.form.factoryId,
        currPage: val
      })
    }
  },
  watch: {
    'form.factoryId' (n) {
      this.Getdeptcode(n)
      this.getDictList(n)
    }
  },
  computed: {},
  components: {
    ConAddorUpdate
  }
}
</script>

<style scoped>

</style>
<style lang="scss">
.main{
  h3{
    font-size: 16px;
    font-weight: bold;
    line-height: 38px;
    margin-bottom: 10px;
  }
}
.topforms1{
  input{
    width: 140px!important;
  }
}
</style>
