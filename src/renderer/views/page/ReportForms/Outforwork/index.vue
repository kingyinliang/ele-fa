<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <linkage :plantList="plantList"></linkage>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listShopAttM')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportShopAttM')">导出</el-button>
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
            prop="teamName"
            label="班组"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="userId"
            label="人员"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <template v-if="dataList.length > 0">
            <el-table-column :label="month + '月' + (index+1).toString() + '日'" v-for="(item,index) in dataList[0].listMonth.length" :key="item">
              <el-table-column
                label="白班时数"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].dayTime}}
                </template>
              </el-table-column>
              <el-table-column
                label="夜班时数"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].nightTime}}
                </template>
              </el-table-column>
            </el-table-column>
          </template>
          <el-table-column
            label="统计">
            <el-table-column
              prop="dayAllDay"
              label="白班天数"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="nightAllDay"
              label="夜班天数"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="allTime"
              label="总计出勤数（H）"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="workAllDay"
              label="上班天数"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="offDutyAllDay"
              label="休班天数"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
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
import { REP_API } from '@/api/api'
import { getNewDate, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      ExportTime: {},
      month: '',
      lodingS: false,
      Team: [],
      dataList: [],
      plantList: {
        deptId: '',
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
      this.$http(`${REP_API.REPATTM_API}`, 'POST', this.plantList).then(({data}) => {
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
      if (!this.plantList.productDate) {
        this.$message.error('请选择月份')
        return false
      }
      this.lodingS = true
      this.$http(`${REP_API.REPOUTFORWORKOUTPUT_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.ExportTime = setInterval(() => {
            this.GetExportExcel()
          }, 4000)
        } else {
          this.lodingS = false
          this.$message.error(data.msg)
        }
      })
      // let that = this
      // exportFile(`${REP_API.REPOUTFORWORKOUTPUT_API}`, '车间出勤汇总报表', that)
    },
    GetExportExcel () {
      this.$http(`${REP_API.GETREPOUTFORWORKOUTPUT_API}`, 'GET').then(({data}) => {
        if (data.code === 0) {
          if (data.asyncRecord) {
            if (data.asyncRecord.asyncStatus === '0') {
              this.lodingS = false
              clearInterval(this.ExportTime)
              this.$message.error('导出失败')
            } else if (data.asyncRecord.asyncStatus === '1') {
              this.lodingS = false
              clearInterval(this.ExportTime)
              this.$message.success('导出成功')
              let elink = document.createElement('a')
              elink.download = `车间出勤汇总报表${getNewDate()}.xlsx`
              elink.style.display = 'none'
              elink.href = data.asyncRecord.fileUrl
              document.body.appendChild(elink)
              elink.click()
              document.body.removeChild(elink)
            }
          }
        } else {
          this.lodingS = false
          clearInterval(this.ExportTime)
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.lodingS = false
        clearInterval(this.ExportTime)
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
