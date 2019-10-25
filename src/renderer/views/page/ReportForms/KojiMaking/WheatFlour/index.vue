<template>
  <div class="main">
    <el-card class="reportForms">
      <el-form :inline="true" :model="plantList" size="small" label-width="82px" class="topform">
        <el-form-item label="生产工厂：">
          <el-select v-model="plantList.factory" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产车间：">
          <el-select v-model="plantList.workShop" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="炒麦机：">
          <el-select v-model="plantList.deviceId" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in Machine" :key="sole.deviceId" :label="sole.deviceName" :value="sole.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号：">
          <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="生产日期：">
          <el-date-picker v-model="plantList.commitDateOne" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker> - <el-date-picker v-model="plantList.commitDateTwo" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker>
        </el-form-item>
        <span style="float: right">
          <el-button size="small" @click="GetList(true)" v-if="isAuth('report:kjmORwht:checkRecordList')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)"  v-if="isAuth('report:kjmORwht:expectCheckRecord')">导出</el-button>
        </span>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width:100%; margin-bottom: 20px">
        <el-table-column label="工厂" width="150" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="车间" prop="workShopName" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="生产订单" prop="orderNo" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="生产日期" width="110" prop="productDate"></el-table-column>
        <el-table-column label="炒麦机" prop="deviceName" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="检测时间" prop="checkTime" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="焦糊率" prop="cokingRate" width="65" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="膨胀率" prop="expandRate" width="65" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="粉碎度" prop="piecesRate" width="65" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="检测人员" prop="changer" width="140" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-row >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="plantList.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="plantList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="plantList.totalCount">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
import { exportFile } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      plantList: {
        factory: '',
        workShop: '',
        deviceId: '',
        orderNo: '',
        commitDateOne: '',
        commitDateTwo: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      dataList: [],
      factory: '',
      workshop: '',
      Machine: []
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'plantList.workShop' (n, o) {
      this.GetMachine(n)
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.plantList.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '炒麦'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 炒麦机
    GetMachine (productLine) {
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '炒麦机',
        deptId: productLine,
        currPage: '1',
        pageSize: '50'
      }).then(({data}) => {
        if (data.code === 0) {
          this.Machine = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.REPCHECKRECORDLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetList()
    },
    // 导出
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.REPEXPECTCHECKRECORD_API}`, '麦粉检测报表', that)
    }
  },
  computed: {},
  components: {}
}
</script>

<style>
  .reportForms .el-card__body{
    padding: 12px!important;
  }
</style>
<style scoped>

</style>
