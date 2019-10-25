<template>
  <el-row v-loading.fullscreen.lock="lodingS">
    <div class="main">
      <el-card class="searchCard" element-loading-text="加载中">
        <el-row>
          <el-col :span="21">
            <el-form :model="plantList" :inline="true" size="small" label-width="85px">
              <el-form-item label="生产工厂：">
                <el-select v-model="plantList.factory" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产车间：">
                <el-select v-model="plantList.workShop" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发酵罐：">
                <el-select v-model="plantList.childPotNo" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.holderName" v-for="(item, index) in potList" :key="index" :value="item.holderId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker v-model="plantList.startTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:199px"></el-date-picker> - <el-date-picker v-model="plantList.endTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:199px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" style="text-align:right;">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:formPress:oilYieldList')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:formPress:exportoilYield')">导出</el-button>
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
        <el-table border :data="pressList" header-row-class-name="tableHead">
          <el-table-column label="工厂" prop="factoryName" :show-overflow-tooltip="true" width="230"></el-table-column>
          <el-table-column label="车间" prop="workShop" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="生产日期" prop="productDate" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="出品率" prop="yield" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column label="发酵罐" prop="holderName" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column label="领用酱醪量" prop="childUsedAmount" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="原汁产量" prop="inPotAmount" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="plantList.currPage"
        :page-sizes="[10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="plantList.totalCount">
        </el-pagination>
      </el-card>
    </div>
  </el-row>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
import { headanimation, dateFormat, exportFile } from '@/net/validate'
export default {
  name: 'press',
  data () {
    return {
      lodingS: false,
      factory: [],
      workshop: [],
      potList: [],
      plantList: {
        factory: '',
        workShop: '',
        childPotNo: '',
        startTime: dateFormat(new Date(), 'yyyy-MM-dd'),
        endTime: dateFormat(new Date(), 'yyyy-MM-dd'),
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      pressList: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'plantList.workShop' (n, o) {
      this.GetPot(n)
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
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
      this.plantList.childPotNo = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '压榨'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 获取罐
    GetPot (id) {
      this.plantList.childPotNo = ''
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
        holder_type: '001',
        type: 'holder_type',
        factory: this.plantList.factory,
        dept_id: id,
        currPage: 1,
        pageSize: 9999
      }).then(({data}) => {
        if (data.code === 0) {
          this.potList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.SQUEEZEOILERLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.pressList = data.page.list
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetList()
    },
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetList()
    },
    ExportExcel (st) {
      let that = this
      exportFile(`${REP_API.REPSQUEEZEOILERLIST_API}`, '出油率报表数据导出', that)
    }
  }
}
</script>

<style scoped>
</style>
