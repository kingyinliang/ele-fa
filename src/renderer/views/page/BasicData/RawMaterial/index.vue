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
                <el-input v-model="form.batch" placeholder="批次" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('sys:sapGranaryMaterial:list')">查询</el-button>
                <el-button type="primary" size="small" @click="visible1 = true" v-if="isAuth('sys:sapGranaryMaterial:list')">高级查询</el-button>
                <el-button type="primary" size="small" @click="DataSynchronism()" v-if="isAuth('sys:sapGranaryMaterial:syncInstorageManual')">同步</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
        <el-row v-loading.fullscreen.lock="loading" element-loading-text="正在同步中">
          <el-table
            ref="table1"
            header-row-class-name="tableHead"
            :data="list"
            border
            tooltip-effect="dark"
            style="width: 100%;margin-bottom: 20px">
            <el-table-column label="物料" :show-overflow-tooltip="true" width="170px">
              <template slot-scope="scope">
                {{scope.row.materialCode}} {{scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column label="物料类型" :show-overflow-tooltip="true" width="130px">
              <template slot-scope="scope">
                {{scope.row.materialTypeCode}} {{scope.row.materialTypeName}}
              </template>
            </el-table-column>
            <el-table-column label="工厂" :show-overflow-tooltip="true" prop="factoryName"></el-table-column>
            <el-table-column label="过账日期" :show-overflow-tooltip="true" prop="postingDate" width="100px"></el-table-column>
            <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" width="120px"></el-table-column>
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="quantity" width="100px"></el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="60px"></el-table-column>
            <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="moveType" width="90px"></el-table-column>
            <el-table-column label="库存" :show-overflow-tooltip="true" prop="quantity" width="80px"></el-table-column>
            <el-table-column label="罐号" :show-overflow-tooltip="true" prop="holderNo" width="60px"></el-table-column>
            <el-table-column label="同步日期" :show-overflow-tooltip="true" prop="syncDate" width="100px"></el-table-column>
          </el-table>
        </el-row>
        <el-row >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visible1" width="510px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">高级查询</div>
      <el-form :model="form" size="small" label-width="130px" class="locationdialog">
        <el-form-item label="批次：" prop="orderNo1">
          <el-input v-model="form.batch" style="width:283px"></el-input>
        </el-form-item>
        <el-form-item label="物料：" prop="orderNo2">
          <el-input v-model="form.materialCode" style="width:283px"></el-input>
        </el-form-item>
        <el-form-item label="罐号：" prop="holderId">
          <el-select v-model="form.holderId" placeholder="请选择" filterable style="width:283px">
            <el-option v-for="(sole, index) in this.guanList" :key="index" :value="sole.holderId" :label="sole.holderName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过账日期：">
          <el-date-picker v-model="form.commitDateOne" type="date" placeholder="选择日期" style="width:135px"></el-date-picker> - <el-date-picker v-model="form.commitDateTwo" type="date" placeholder="选择日期" style="width:135px"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible1 = false">取消</el-button>
        <el-button type="primary" @click="GetList(true, 'highc')">确定</el-button>
      </span>
    </el-dialog>
  </el-col>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'RawMaterial',
  data () {
    return {
      loading: false,
      visible1: false,
      form: {
        bath: '',
        materialCode: '',
        commitDateOne: '',
        commitDateTwo: ''
      },
      serch: {},
      list: [],
      multipleSelection: [],
      sapList: [],
      workshop: [],
      SerchSapList: [],
      currentPage: 1,
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      guanList: []
    }
  },
  mounted () {
    this.GetList()
    this.PuplWheatList()
  },
  methods: {
    // 获取库位列表
    GetList (st, type = 'normal') {
      if (st) {
        this.currPage = 1
      }
      if (type === 'normal') {
        this.form = {
          batch: this.form.batch,
          materialCode: '',
          commitDateOne: '',
          commitDateTwo: ''
        }
      }
      this.$http(`${BASICDATA_API.MATERIALRAWLIST_API}`, 'POST', {
        batch: this.form.batch,
        materialCode: this.form.materialCode,
        commitDateOne: this.form.commitDateOne,
        commitDateTwo: this.form.commitDateTwo,
        currPage: JSON.stringify(this.currPage),
        pageSize: JSON.stringify(this.pageSize),
        holderId: this.form.holderId
      }).then(({data}) => {
        this.visible1 = false
        if (data.code === 0) {
          this.list = data.page.list
          this.currPage = data.page.currPage
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
      })
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
    },
    // 数据同步
    DataSynchronism () {
      this.loading = true
      this.$http(`${BASICDATA_API.MATERIALRAWSYNCHRONISM_API}`, 'GET').then(({data}) => {
        if (data.code === 0) {
          this.orderTime = setInterval(() => {
            this.GetDataSynchronismStatus()
          }, 4000)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    GetDataSynchronismStatus () {
      this.$http(`${BASICDATA_API.MATERIALRAWSYNCHRONISMSTASUS_API}`, 'GET').then(({data}) => {
        if (data.code === 0) {
          if (data.asyncRecord) {
            if (data.asyncRecord.asyncStatus === '0') {
              this.loading = false
              clearInterval(this.orderTime)
              this.$message.error('同步失败')
            } else if (data.asyncRecord.asyncStatus === '1') {
              this.loading = false
              clearInterval(this.orderTime)
              this.$message.success('同步成功')
              this.GetList()
            }
          }
        } else {
          this.loading = false
          clearInterval(this.orderTime)
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.loading = false
        clearInterval(this.orderTime)
      })
    },
    // 罐号
    PuplWheatList () {
      this.$http(`${BASICDATA_API.PUPLWHEATLIST}`, 'POST', {types: ['002', '012']}).then(({data}) => {
        this.guanList = data.list
      })
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss">
.dialog__class{
  border-radius:6px 6px 6px 6px !important;
  .el-dialog__header{
    height:59px;
    background:rgba(24,144,255,1);
    border-radius:6px 6px 0px 0px;
    color: #fff;
    font-size:20px;
    .el-dialog__headerbtn .el-dialog__close{
      color: #fff
    }
  }
}
</style>
