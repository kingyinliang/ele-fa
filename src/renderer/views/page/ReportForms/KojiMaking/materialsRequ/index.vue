<template>
  <div class="main">
    <el-card>
      <el-row class="searchCard">
        <el-col :span="20">
          <el-form :model="plantList" :inline="true" size="small" label-width="85px">
            <el-form-item label="生产工厂：">
              <el-select v-model="plantList.factory" class="width158px">
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="plantList.workShop" class="width158px">
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="sole in workShop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产订单：">
              <el-input v-model="plantList.orderNo" class="width158px"></el-input>
            </el-form-item>
            <el-form-item label="容器类型：">
              <el-select v-model="plantList.type" class="width158px">
                <el-option label="请选择"  value=""></el-option>
                <el-option label="豆粕计量仓" value="豆粕计量仓"></el-option>
                <el-option label="麦粉计量仓" value="麦粉计量仓"></el-option>
                <el-option label="盐水罐" value="盐水罐"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="容器号：">
              <el-input v-model="plantList.holderName" class="width158px"></el-input>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker v-model="plantList.commitDateOne" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker> - <el-date-picker v-model="plantList.commitDateTwo" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:135px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="float:right; width:128px">
          <el-button type="primary" size="small" @click="GetList" v-if="isAuth('report:kjmORwht:kjmMaterialList')">查询</el-button>
          <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:kjmORwht:expectKjmMaterial')">导出</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:10px">
      <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="margin-bottom: 20px">
        <el-table-column label="生产日期" width="100" prop="productDate"></el-table-column>
        <el-table-column label="工厂" width="120" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="车间" prop="workShopName" width="110" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="工序" prop="processName" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="生产订单" prop="orderNo" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="品项" prop="material" width="180" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="领用物料" prop="useMaterial" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="领用容器" prop="holderName" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="数量" prop="amount"></el-table-column>
        <el-table-column label="单位" width="50" prop="unitName"></el-table-column>
        <el-table-column label="物料批次" prop="materialBatch" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="生产批次" prop="productBatch" :show-overflow-tooltip="true"></el-table-column>
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
        commitDateOne: '',
        commitDateTwo: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: '',
      workShop: '',
      dataList: []
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
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
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workShop = data.typeList
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
      this.$http(`${REP_API.REPOUTMATERIALREQU_API}`, 'POST', this.plantList).then(({data}) => {
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
      exportFile(`${REP_API.REPOUTMATERIALREQUEXPORT_API}`, '物料领用汇总报表', that)
    }
  }
}
</script>

<style lang="less" scoped>
.width158px {width:158px;}
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
