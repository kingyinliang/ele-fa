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
          <el-select v-model="plantList.workshop" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发酵罐：">
          <el-select v-model="plantList.inPotNo" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产订单：">
          <el-input v-model="plantList.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="生产日期：">
          <el-date-picker v-model="plantList.commitDateOne" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker> - <el-date-picker v-model="plantList.commitDateTwo" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker>
        </el-form-item>
        <span style="float: right">
          <el-button size="small" @click="GetList(true)" v-if="isAuth('report:formh:kjmSauceList')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:formh:kjmSauceList')">导出</el-button>
        </span>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width:100%; margin-bottom: 20px">
        <el-table-column label="生产日期" width="100" prop="productDate" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="工厂" width="170" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="车间" prop="workShopName" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="生产订单" prop="orderNo" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="品项" prop="material" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="发酵罐" prop="holderName" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="发酵罐容量" prop="holderHold" width="95" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="计划产量" prop="planOutput" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="实际产量" prop="realOutput" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="投罐日期" prop="canningDate" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="满罐日期" prop="canfulDate" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="180天成熟期" prop="oheDate" width="110" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="130天成熟期" prop="ohtDate" width="110" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="日期" prop="nowDate" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="发酵天数" prop="fDate"></el-table-column>
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
        workshop: '',
        inPotNo: '',
        commitDateOne: '',
        commitDateTwo: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      dataList: [],
      factory: '',
      workshop: '',
      room: [],
      Pot: []
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'plantList.workshop' (n, o) {
      this.GetPot(n)
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
      this.plantList.workshop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '制曲'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    GetPot (id) {
      if (id) {
        let workShopName = ''
        this.workshop.forEach((item, index) => {
          if (id === item.deptId) {
            workShopName = item.deptName
          }
        })
        this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, `POST`, {
          currPage: 1,
          holder_type: '001',
          pageSize: 9999,
          type: 'holder_type',
          workShopName: workShopName,
          dept_id: id
        }, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.Pot = data.page.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    GetList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      let obj = JSON.parse(JSON.stringify(this.plantList))
      obj.currPage = obj.currPage + ''
      obj.pageSize = obj.pageSize + ''
      obj.totalCount = obj.totalCount + ''
      this.$http(`${REP_API.REPRAW_API}`, 'POST', obj).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.lodingS = false
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
      exportFile(`${REP_API.REPRAWOUT_API}`, '生酱醪统计报表', that)
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
