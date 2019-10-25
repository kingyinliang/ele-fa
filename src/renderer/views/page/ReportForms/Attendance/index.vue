<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="90px">
              <el-form-item label="工厂：">
                <el-select v-model="plantList.factory" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：">
                <el-select v-model="plantList.workshop" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考勤类型：">
                <el-select v-model="plantList.kqlx" placeholder="请选择" size="small">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in ARtype" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker type="month" v-model="plantList.productDate" placeholder="选择月份" value-format="yyyy-MM" style="width: 199px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listAttM')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportAttM')">导出</el-button>
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
            prop="deptIdName"
            label="班组"
            :show-overflow-tooltip="true"
            width="70">
          </el-table-column>
          <el-table-column
            prop="kqdlName"
            label="考勤大类"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="kqlxName"
            label="考勤类型"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="userId"
            label="人员"
            :show-overflow-tooltip="true">
          </el-table-column>
          <div v-if="dataList.length > 0">
          <el-table-column
            :label="month + '月' + (index+1).toString() + '日'" v-for="(item,index) in dataList[0].listMonth.length" :key="item">
            <el-table-column
              prop="pieceTime"
              label="计时时数"
              :show-overflow-tooltip="true"
              width="80">
              <template slot-scope="scope">
                {{scope.row.listMonth[index].timedTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="timedTime"
              label="计件时数"
              :show-overflow-tooltip="true"
              width="80">
              <template slot-scope="scope">
                {{scope.row.listMonth[index].pieceTime}}
              </template>
            </el-table-column>
          </el-table-column>
          </div>
          <el-table-column
            label="统计">
            <el-table-column
              prop="allTime"
              label="出勤总时数"
              :show-overflow-tooltip="true"
              width="95">
            </el-table-column>
            <el-table-column
              prop="allDay"
              label="出勤总天数"
              :show-overflow-tooltip="true"
              width="95">
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
import { BASICDATA_API, SYSTEMSETUP_API, REP_API } from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      month: '',
      lodingS: false,
      ARtype: [],
      factory: [],
      workshop: [],
      dataList: [],
      plantList: {
        kqlx: '',
        productDate: '',
        factory: '',
        workshop: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      }
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
      this.GetARtype(n)
    }
  },
  mounted () {
    this.GetARtype()
    this.Getdeptcode()
    headanimation(this.$)
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
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取考勤类型
    GetARtype (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'other_time'}).then(({data}) => {
        if (data.code === 0) {
          this.ARtype = data.dicList
          this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'normal_time'}).then(({data}) => {
            if (data.code === 0) {
              this.ARtype = this.ARtype.concat(data.dicList)
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetList (st) {
      if (!this.plantList.productDate) {
        this.$message.error('请选择月份')
        return false
      }
      this.lodingS = true
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.REPATTMLIST_API}`, 'POST', this.plantList).then(({data}) => {
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
      exportFile(`${REP_API.REPATTMOUTPUT_API}`, '计时考勤报表', that)
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
  }
}
</script>

<style scoped>

</style>
