<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <!--<div class="topTitle">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item>基础数据</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>库位管理</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <div class="main">
      <el-card>
        <div class="clearfix">
          <el-row style="float: right">
            <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="GetLocationList(true)" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="form.deptName" placeholder="车间" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="GetLocationList(true)" v-if="isAuth('sys:sto:list')">查询</el-button>
                <el-button type="primary" size="small" @click="visible1 = true" v-if="isAuth('sys:sto:list')">高级查询</el-button>
                <el-button type="primary" size="small" @click="addLocation()" v-if="isAuth('sys:sto:save')">新增</el-button>
                <el-button type="danger" size="small" @click="remove()" v-if="isAuth('sys:sto:delete')">批量删除</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
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
              label="序号"
              :index="indexMethod"
              width="55">
            </el-table-column>
            <el-table-column
              prop="factoryName"
              width="120"
              :show-overflow-tooltip="true"
              label="工厂">
            </el-table-column>
            <el-table-column
              prop="deptName"
              width="120"
              :show-overflow-tooltip="true"
              label="车间">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="物料类型">
              <template slot-scope="scope">
                {{ scope.row.materialTypeCode + ' ' + scope.row.materialTypeName}}
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="物料编码">
              <template slot-scope="scope">
                {{ scope.row.materialCode + ' ' + scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              prop="storageLocation"
              label="库位">
            </el-table-column>
            <el-table-column
              width="91"
              label="是否样品库">
              <template slot-scope="scope">
                {{scope.row.isSample === '0'? '否':'是'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="materialOperation"
              width="84"
              label="发料/入库">
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
    <el-dialog
      title="高级查询"
      :close-on-click-modal="false"
      :visible.sync="visible1">
      <el-form :model="form" size="small" label-width="110px" class="locationdialog">
        <el-form-item label="车间：" prop="orderNo1">
          <el-select v-model="form.deptId" placeholder="请选择">
            <el-option label=""  value=""></el-option>
            <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料类型：" prop="orderNo2">
          <el-select v-model="form.materialTypeCode" placeholder="请选择">
            <el-option label=""  value=""></el-option>
            <el-option :label="item.value" v-for="(item, index) in sapList" :key="index" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位：">
          <el-input v-model="form.storageLocation" placeholder="手工录入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible1 = false">取消</el-button>
        <el-button type="primary" @click="GetLocationList(true)">确定</el-button>
      </span>
    </el-dialog>
    <location-add v-if="visible" ref="locationAdd" @refreshDataList="GetLocationList()"></location-add>
  </el-col>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
import LocationAdd from './LocationAdd'
export default {
  name: 'LocationManage',
  data () {
    return {
      visible1: false,
      visible: false,
      form: {
        deptName: '',
        deptId: '',
        materialTypeCode: '',
        storageLocation: ''
      },
      serch: {},
      list: [],
      multipleSelection: [],
      sapList: [],
      workshop: [],
      SerchSapList: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 0
    }
  },
  mounted () {
    this.GetLocationList()
    this.$http(`${BASICDATA_API.FINDORG_API}?code=workshop`, 'POST').then(({data}) => {
      if (data.code === 0) {
        this.workshop = data.typeList
      } else {
        this.$message.error(data.msg)
      }
    })
    this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: '', type: 'material_type'}).then(({data}) => {
      if (data.code === 0) {
        this.sapList = data.dicList
      } else {
        this.$message.error(data.msg)
      }
    })
    // this.$http(`${BASICDATA_API.SERCHSAPLIST_API}`, 'POST', {params: ''}).then(({data}) => {
    //   if (data.code === 0) {
    //     this.SerchSapList = data.allList
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // })
  },
  methods: {
    // 序号
    indexMethod (index) {
      return index + 1 + (this.currPage * 1 - 1) * (this.pageSize * 1)
    },
    // 获取库位列表
    GetLocationList (st) {
      if (st) {
        this.currPage = 1
      }
      this.$http(`${BASICDATA_API.LOCATIONLIST_API}`, 'POST', {
        deptId: this.form.deptId,
        deptName: this.form.deptName,
        materialTypeCode: this.form.materialTypeCode,
        storageLocation: this.form.storageLocation,
        currPage: this.currPage,
        pageSize: this.pageSize
      }).then(({data}) => {
        this.visible = false
        this.visible1 = false
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
    // 批量删除
    remove () {
      this.$confirm('确认删除库位, 是否继续?', '删除库位', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${BASICDATA_API.LOCATIONDEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.multipleSelection = []
            this.GetLocationList()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 新增库位
    addLocation () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.locationAdd.init()
      })
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.id)
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.GetLocationList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.GetLocationList()
    }
  },
  computed: {},
  components: {
    LocationAdd
  }
}
</script>

<style scoped>

</style>
