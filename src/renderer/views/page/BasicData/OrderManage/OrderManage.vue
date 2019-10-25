<template>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <!--<div class="topTitle">-->
        <!--<el-breadcrumb separator="/">-->
          <!--<el-breadcrumb-item>基础数据</el-breadcrumb-item>-->
          <!--<el-breadcrumb-item>订单管理</el-breadcrumb-item>-->
        <!--</el-breadcrumb>-->
      <!--</div>-->
      <div class="main">
        <el-card>
          <div class="clearfix">
            <el-row style="float: right">
              <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="querys(true)" @submit.native.prevent>
                <el-form-item>
                  <el-input v-model="form.orderNo" placeholder="订单号" suffix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="querys(true)" v-if="isAuth('sys:sapOrder:list')">查询</el-button>
                  <el-button type="primary" size="small" @click="visible = true" v-if="isAuth('sys:sapOrder:list')">高级查询</el-button>
                  <el-button type="primary" size="small" @click="sapOrderUpdate" v-if="isAuth('sys:sapOrder:syncOrderManual')">同步</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </div>
          <el-row
            v-loading.fullscreen.lock="loading"
            element-loading-text="正在同步中">
            <el-table
              class="orderTable"
              ref="table1"
              border
              header-row-class-name="tableHead"
              :data="sapOrderlist"
              tooltip-effect="dark"
              style="width: 100%;margin-bottom: 20px">
              <el-table-column
                width="122"
                label="生产订单">
                <template slot-scope="scope">
                  {{scope.row.orderNo}}
                </template>
              </el-table-column>
              <el-table-column
                label="订单类型"
                width="77">
                <template slot-scope="scope">
                  {{ scope.row.orderType }}
                </template>
              </el-table-column>
              <el-table-column
                prop="factory"
                label="工厂"
                width="77">
              </el-table-column>
              <el-table-column
                prop="commitDate"
                label="基本完成日期"
                header-align="center"
                width="105">
              </el-table-column>
              <el-table-column
                prop="startDate"
                label="基本开始日期"
                header-align="center"
                width="105">
              </el-table-column>
              <el-table-column
                label="物料"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{ scope.row.materialCode }} {{ scope.row.materialName }}
                </template>
              </el-table-column>
              <el-table-column
                prop="orderNum"
                label="订单数量"
                header-align="center"
                align="left"
                width="80">
              </el-table-column>
              <el-table-column
                prop="orderUnit"
                label="订单单位"
                header-align="center"
                width="80">
              </el-table-column>
              <el-table-column
                prop="dispatchMan"
                label="生产调度员"
                header-align="center"
                width="91">
              </el-table-column>
              <el-table-column
                prop="syncDate"
                label="同步日期"
                width="100">
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
        :visible.sync="visible">
        <div class="formdata">
          <el-form :model="form" size="small" label-width="110px" class="orderdialog">
            <el-form-item label="生产订单：">
              <el-input v-model="form.orderNo" placeholder="手工录入"></el-input>
            </el-form-item>
            <el-form-item label="物料：">
              <el-input v-model="form.materialCode" placeholder="手工录入"></el-input>
            </el-form-item>
            <el-form-item label="生产调度员：">
              <el-input v-model="form.dispatchMan" placeholder="手工录入"></el-input>
            </el-form-item>
            <el-form-item label="基本开始日期：" class="times">
              <el-row>
                <el-col :span="12">
                  <el-date-picker v-model="form.startDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker v-model="form.startDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="基本完成日期：" class="times">
              <el-row>
                <el-col :span="12">
                  <el-date-picker v-model="form.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker v-model="form.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="querys(true)">确定</el-button>
        </span>
      </el-dialog>
    </el-col>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'OrderManage',
  data () {
    return {
      loading: true,
      visible: false,
      orderTime: {},
      form: {
        orderNo: '',
        materialCode: '',
        dispatchMan: '',
        startDateOne: '',
        commitDateOne: ''
      },
      sapOrderlist: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 1
    }
  },
  mounted () {
    this.GetOrderList()
  },
  methods: {
    // 获取订单管理
    GetOrderList () {
      this.form.currPage = JSON.stringify(this.currPage)
      this.form.pageSize = JSON.stringify(this.pageSize)
      this.$http(`${BASICDATA_API.ORDERLIST_API}`, 'POST', this.form).then(({data}) => {
        this.loading = false
        if (data.code === 0) {
          this.sapOrderlist = data.page.list
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
          this.currPage = data.page.currPage
          this.visible = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 同步
    sapOrderUpdate () {
      this.loading = true
      this.$http(`${BASICDATA_API.SAPORDERUPDATE_API}`, 'GET').then(({data}) => {
        if (data.code === 0) {
          this.orderTime = setInterval(() => {
            this.GetOrderUpdateStatus()
          }, 4000)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    GetOrderUpdateStatus () {
      this.$http(`${BASICDATA_API.GETSAPORDERUPDATE_API}`, 'GET').then(({data}) => {
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
              this.GetOrderList()
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
    // 查询
    querys (st) {
      if (st) {
        this.form.currPage = 1
      }
      this.GetOrderList()
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.GetOrderList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.GetOrderList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.formdata{
  .times{
    input{
      width: 200px!important;
    }
  }
}
</style>
<style lang="scss">
  .orderdialog{
    margin: auto;
    input{
      width: 300px!important;
    }
    .times{
      input{
        width: 150px!important;
      }
    }
  }
</style>
