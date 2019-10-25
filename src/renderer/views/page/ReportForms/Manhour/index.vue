<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <linkage :plantList="plantList"></linkage>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px">
              <el-form-item label="日期：">
                <el-date-picker type="month" v-model="plantList.productDate" placeholder="选择月份" value-format="yyyy-MM" style="width: 199px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listWorkshopWHoursM')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportWorkshopWHoursM')">导出</el-button>
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
            prop="factoryName"
            label="工厂"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="workShopName"
            label="车间"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="productLineName"
            label="产线"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="boxSpec"
            label="箱规格"
            :show-overflow-tooltip="true"
            width="65">
          </el-table-column>
          <el-table-column
            prop="boxSpecUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="55">
          </el-table-column>
          <el-table-column
            prop="productSpec"
            label="瓶规格"
            :show-overflow-tooltip="true"
            width="65">
          </el-table-column>
          <el-table-column
            prop="productSpecUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <template v-if="dataList.length > 0">
            <el-table-column
              :label="month + '月' + (index+1).toString() + '日'" v-for="(item,index) in dataList[0].listMonth.length" :key="item">
              <el-table-column
                prop="machineWorking"
                label="机器工时"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].machineWorking}}
                </template>
              </el-table-column>
              <el-table-column
                prop="peopleWorking"
                label="人工工时"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].peopleWorking}}
                </template>
              </el-table-column>
            </el-table-column>
          </template>
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
import { REP_API } from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      month: '',
      lodingS: false,
      dataList: [],
      plantList: {
        productDate: '',
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
      if (!this.plantList.productDate) {
        this.$message.error('请选择月份')
        return false
      }

      this.lodingS = true
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.REPMANHOURLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
          this.month = this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1).split('')[0] === '0' ? this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1).slice(1) : this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1)
        } else {
          this.$message.error(data.msg)
        }
        this.lodingS = false
      })
    },
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.REPMANHOUROUTPUT_API}`, '车间工时报表', that)
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
