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
        <el-form-item label="生产曲房：">
          <el-select v-model="plantList.houseId" style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in room" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制曲日期：">
          <el-date-picker v-model="plantList.inKjmDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="发酵罐：">
          <el-select v-model="plantList.inPotNo" filterable style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
          </el-select>
        </el-form-item>
        <span style="float: right">
          <el-button size="small" @click="GetList(true)" v-if="isAuth('report:formh:kjmOutTechList')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:formh:exportkjmOutTechList')">导出</el-button>
        </span>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width:100%; margin-bottom: 20px">
        <el-table-column label="工厂" width="170" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="车间" prop="workShopName" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="曲房" prop="houseName" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="发酵罐" prop="inPotName" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="制曲日期" prop="inKjmDate" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲开始时间" prop="outStartTime" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲结束时间" prop="outEndTime" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="盐水温度" prop="saltWaterTemp" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="盐水浓度" prop="saltWaterNd" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲温度1" prop="outTempOne" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲混合料温度1" prop="blendTempOne" width="128" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲风速1" prop="windSpeedOne" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲温度2" prop="outTempTwo" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲混合料温度2" prop="blendTempTwo" width="128" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲风速2" prop="windSpeedTwo" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲温度3" prop="outTempThree" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲混合料温度3" prop="blendTempThree" width="128" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲风速3" prop="windSpeedThree" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲温度4" prop="outTempFour" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲混合料温度4" prop="blendTempFour" width="128" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲风速4" prop="windSpeedFour" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲温度5" prop="outTempFive" width="90" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲混合料温度5" prop="blendTempFive" width="128" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="出曲风速5" prop="windSpeedFive" width="90" :show-overflow-tooltip="true"></el-table-column>
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
        houseId: '',
        inPotNo: '',
        inKjmDate: '',
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
      this.Getroom(n)
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
    // 获取曲房
    Getroom (id) {
      if (id) {
        this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, `POST`, {
          currPage: 1,
          holder_type: '005',
          pageSize: 9999,
          type: 'holder_type',
          dept_id: id
        }, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.room = data.page.list
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
      this.$http(`${REP_API.REPOUTCRAFT_API}`, 'POST', obj).then(({data}) => {
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
      exportFile(`${REP_API.REPOUTCRAFTOUT_API}`, '出曲工艺报表', that)
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
