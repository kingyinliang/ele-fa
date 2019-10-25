<template>
  <div class="main">
    <el-card class="reportForms">
      <el-form :inline="true" :model="plantList" size="small" label-width="82px" class="topform clearfix">
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
        <el-form-item label="发酵罐：">
          <el-select v-model="plantList.childPotNo" filterable style="width: 150px">
            <el-option label="请选择"  value=""></el-option>
            <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期：">
          <el-date-picker v-model="plantList.commitDateOne" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker> - <el-date-picker v-model="plantList.commitDateTwo" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker>
        </el-form-item>
        <span style="float: right">
          <el-button size="small" @click="GetList(true)" v-if="isAuth('report:res:proSta')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:res:expectProSta')">导出</el-button>
        </span>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%;margin-bottom: 20px">
        <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true" width="90"></el-table-column>
        <el-table-column prop="workShopName" label="车间" :show-overflow-tooltip="true" width="95"></el-table-column>
        <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="100"></el-table-column>
        <el-table-column prop="useMaterial" label="领用物料" :show-overflow-tooltip="true" width="150"></el-table-column>
        <el-table-column prop="useAmount" label="领用量" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="material" label="生产物料" :show-overflow-tooltip="true" width="150"></el-table-column>
        <el-table-column prop="inPotAmount" label="入库量" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="oneCage" label="1#笼数" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="twoCage" label="2#笼数" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="threeCage" label="3#笼数" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="fourCage" label="4#笼数" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="boardNum" label="酱渣板数" :show-overflow-tooltip="true" width="90"></el-table-column>
        <el-table-column prop="spiral" label="出油率" :show-overflow-tooltip="true" width="70"></el-table-column>
        <el-table-column prop="fermentationTankName" label="发酵罐" :show-overflow-tooltip="true" width="100"></el-table-column>
        <el-table-column prop="originalTankName" label="原汁罐" :show-overflow-tooltip="true" width="100"></el-table-column>
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
import { Getdeptcode, Getdeptbyid } from '@/assets/js/util'
export default {
  name: 'index',
  data () {
    return {
      factory: [],
      workshop: [],
      Pot: [],
      plantList: {
        factory: '',
        workShop: '',
        childPotNo: '',
        commitDateOne: '',
        commitDateTwo: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      dataList: []
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      Getdeptbyid(this, n, '压榨')
    },
    'plantList.workShop' (n, o) {
      this.GetPot(n)
    }
  },
  mounted () {
    Getdeptcode(this)
  },
  methods: {
    GetList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.PROSTA_LIST_API}`, 'POST', this.plantList).then(({data}) => {
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
    // 导出
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.PROSTA_EXPECT_API}`, '生产品项统计报表', that)
    },
    GetPot (id) {
      if (id) {
        let workShopName = this.workshop.find(item => item.deptId === id).deptName
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
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
