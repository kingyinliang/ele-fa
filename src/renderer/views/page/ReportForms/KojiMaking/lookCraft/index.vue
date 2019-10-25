<template>
  <div class="main">
    <el-card>
      <el-row class="searchCard">
        <el-col :span="20">
          <el-form :model="plantList" :inline="true" size="small" label-width="85px">
            <el-form-item label="生产工厂：">
              <el-select v-model="plantList.factory">
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="plantList.workShop">
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in workShop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="曲房：">
              <el-select v-model="plantList.houseNoID" filterable>
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in houseList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发酵罐：">
              <el-select v-model="plantList.inPotNoID" filterable>
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in inPotList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产订单：">
              <el-input v-model="plantList.orderNo" size="small" class="width199px"></el-input>
            </el-form-item>
            <el-form-item label="制曲日期：">
              <el-date-picker v-model="plantList.inKjmDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:199px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="float:right; width:128px">
          <el-button type="primary" size="small" @click="GetList" v-if="isAuth('report:kjmORwht:guardTechList')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:kjmORwht:expectGuardTech')">导出</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width:100%; margin-bottom: 20px">
        <el-table-column label="工厂" width="120" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="车间" prop="workShopName" width="100"></el-table-column>
        <el-table-column label="制曲日期" prop="inKjmDate" width="100"></el-table-column>
        <el-table-column label="曲房" prop="houseNoName" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="发酵罐" prop="inPotNoName" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="入曲开始时间" prop="inStartTime" width="165"></el-table-column>
        <el-table-column label="入曲结束时间" prop="inEndTime" width="165"></el-table-column>
        <el-table-column label="二翻加水量" prop="overWeight" width="95"></el-table-column>
        <el-table-column label="出曲加水量" prop="outWeight" width="95"></el-table-column>
        <el-table-column label="U">
          <el-table-column label="一翻感官" prop="oneCodeU"></el-table-column>
          <el-table-column label="二翻感官" prop="twoCodeU"></el-table-column>
          <el-table-column label="出曲感官" prop="outCodeU"></el-table-column>
        </el-table-column>
        <el-table-column label="S">
          <el-table-column label="一翻感官" prop="oneCodeS"></el-table-column>
          <el-table-column label="二翻感官" prop="twoCodeS"></el-table-column>
          <el-table-column label="出曲感官" prop="outCodeS"></el-table-column>
        </el-table-column>
        <el-table-column label="A">
          <el-table-column label="一翻感官" prop="oneCodeA"></el-table-column>
          <el-table-column label="二翻感官" prop="twoCodeA"></el-table-column>
          <el-table-column label="出曲感官" prop="outCodeA"></el-table-column>
        </el-table-column>
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
  data () {
    return {
      plantList: {
        factory: '',
        workShop: '',
        houseNoID: '',
        inPotNoID: '',
        inKjmDate: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: '',
      workShop: '',
      houseList: '',
      inPotList: '',
      dataList: []
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.plantList.workShop = ''
      this.plantList.houseNoID = ''
      this.plantList.inPotNoID = ''
      this.Getdeptbyid(n)
    },
    'plantList.workShop' (n, o) {
      this.plantList.houseNoID = ''
      this.plantList.inPotNoID = ''
      this.GetinPotList(n)
      this.GethouseList(n)
    }
  },
  mounted () {
    this.Getdeptcode()
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
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '制曲'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workShop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取发酵罐
    GetinPotList (id) {
      if (id) {
        let workShopName = this.workShop.find(item => item.deptId === id)['deptName']
        this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {currPage: 1, dept_id: id, holder_type: '001', pageSize: 9999, type: 'holder_type', workShopName: workShopName}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.inPotList = data.page.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取曲房
    GethouseList (id) {
      if (id) {
        let workShopName = this.workShop.find(item => item.deptId === id)['deptName']
        this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {currPage: 1, dept_id: id, holder_type: '005', pageSize: 9999, type: 'holder_type', workShopName: workShopName}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.houseList = data.page.list
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
      this.$http(`${REP_API.REPOUTLOOKCRAFT_API}`, 'POST', this.plantList).then(({data}) => {
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
      exportFile(`${REP_API.REPOUTLOOKCRAFTEXPORT_API}`, '看曲工艺报表', that)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table th>.cell {text-align: center}
.width199px {width:199px;}
.el-date-editor .el-range-input {width:100px;}
.el-range-editor--small .el-range-separator {padding-right:20px}
.searchCard {
  .el-button--primary,.el-button--primary:focus{
    color: #000000;
    background-color: #FFFFFF;
    border-color: #D9D9D9;
  }
  .el-button--primary:hover{
    background-color: #1890FF;
    color: #FFFFFF
  }
  .el-button--primary:first-child{
    background-color: #1890FF;
    color: #FFFFFF;
    border-color: #1890FF;
  }
}
</style>
