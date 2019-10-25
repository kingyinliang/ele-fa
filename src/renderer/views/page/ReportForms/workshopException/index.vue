<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <linkage :plantList="plantList" :lablewidth="true"></linkage>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="100px">
              <el-form-item label="生产日期：" style="width: 400px" class="dateinput">
                <el-row>
                  <el-col :span="12">
                    <el-date-picker v-model="plantList.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                  </el-col>
                  <el-col :span="12">
                    <el-date-picker v-model="plantList.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listExc')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportExc')">导出</el-button>
          </el-col>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0">
      <el-card class="tableCard">
        <div class="toggleSearchTop">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-table
          :data="dataList"
          border
          tooltip-effect="dark"
          header-row-class-name="tableHead"
          style="width: 100%;margin-bottom: 20px">
          <el-table-column
            prop="productDate"
            label="生产日期"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="factoryName"
            label="工厂"
            :show-overflow-tooltip="true"
            width="90">
          </el-table-column>
          <el-table-column
            prop="workShopName"
            label="车间"
            :show-overflow-tooltip="true"
            width="95">
          </el-table-column>
          <el-table-column
            prop="productLineName"
            label="产线"
            :show-overflow-tooltip="true"
            width="70">
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="生产订单"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            label="物料"
            :show-overflow-tooltip="true"
            width="180">
            <template slot-scope="scope">
              {{scope.row.materialH}}
            </template>
          </el-table-column>
          <el-table-column
            prop="expCodeName"
            label="异常情况"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="expInfo"
            label="异常描述"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="expStartDate"
            label="异常开始时间"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="expEndDate"
            label="异常结束时间"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="expContinue"
            label="异常时间"
            :show-overflow-tooltip="true"
            width="77">
          </el-table-column>
          <el-table-column
            prop="expContinueUnit"
            label="单位"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <el-table-column
            prop="deviceIdName"
            label="设备"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="materialShortName"
            label="物料分类简称"
            :show-overflow-tooltip="true"
            width="105">
          </el-table-column>
          <el-table-column
            prop="energyName"
            label="能源"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <el-table-column
            prop="affectProduction"
            label="影响产量"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="affectProductionUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            :show-overflow-tooltip="true"
            width="80">
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
  </el-row>
</template>

<script>
import {REP_API, SYSTEMSETUP_API} from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      lodingS: false,
      SerchSapList: [],
      dataList: [],
      plantList: {
        commitDateOne: '',
        commitDateTwo: '',
        factory: '',
        workshop: '',
        productline: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      }
    }
  },
  mounted () {
    headanimation(this.$)
  },
  methods: {
    GetList (st) {
      this.lodingS = true
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.REPEXCLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.page.list
          // this.GetmaterialShort()
          // this.Getenery()
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.lodingS = false
      })
    },
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.REPEXCOUTPUT_API}`, '车间异常统计报表数据导出', that)
    },
    // 获取物料分类简称
    GetmaterialShort () {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: '', type: 'MATERIAL_SHORT'}).then(({data}) => {
        if (data.code === 0) {
          this.dataList.forEach((item, index) => {
            data.dicList.forEach((items, index) => {
              if (item.materialShort === items.code) {
                item.materialShortName = items.value
                this.dataList.splice(this.dataList.length, 0, {})
                this.dataList.splice(this.dataList.length - 1, 1)
              }
            })
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取能源下拉
    Getenery (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'ENERGY'}).then(({data}) => {
        if (data.code === 0) {
          this.dataList.forEach((item, index) => {
            data.dicList.forEach((items, index) => {
              if (item.energy === items.code) {
                item.energyName = items.value
                this.dataList.splice(this.dataList.length, 0, {})
                this.dataList.splice(this.dataList.length - 1, 1)
              }
            })
          })
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
    }
  },
  computed: {},
  components: {
    Linkage: resolve => {
      require(['@/views/page/ReportForms/common/linkage'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
