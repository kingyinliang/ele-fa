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
              <el-form-item label="布浆线：">
                <el-select v-model="plantList.productLine" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker v-model="plantList.startTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:199px"></el-date-picker> - <el-date-picker v-model="plantList.endTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:199px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" style="text-align:right;">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:formPress:pressList')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:formPress:exportPress')">导出</el-button>
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
          <el-table-column label="工厂" prop="factoryName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="车间" prop="workShop" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="生产日期" prop="created" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="布浆线" prop="pulpName" :show-overflow-tooltip="true" width="80"></el-table-column>
          <el-table-column label="气垫车号" prop="hovercraftName" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="布号" prop="clothNo" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="自重自淋时间" prop="selfDrenchTime" :show-overflow-tooltip="true" width="110"></el-table-column>
          <el-table-column label="布浆量(方)" prop="pulpAmount" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="压榨一东碎布数" prop="destoryNumEast" :show-overflow-tooltip="true" width="130"></el-table-column>
          <el-table-column label="压榨一西碎布数" prop="destoryNumWest" :show-overflow-tooltip="true" width="130"></el-table-column>
          <el-table-column label="压榨二碎布数" prop="destoryNum" :show-overflow-tooltip="true" width="110"></el-table-column>
          <el-table-column label="发酵罐1" prop="potOne" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="发酵罐2" prop="potTwo" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="布浆张数" prop="pulpNum" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="布浆开始时间" prop="pulpStartDate" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="布浆结束时间" prop="pulpEndDate" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="布浆时间" prop="pulpTime" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="自淋时间" prop="drenchTime" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="预压机号" prop="deviceName" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="预压开始时间" prop="prePressStart" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="预压结束时间" prop="prePressEnd" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="预压时间" prop="prePressTime" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="终压机号" prop="endDeviceName" :show-overflow-tooltip="true" width="100"></el-table-column>
          <el-table-column label="终压开始时间" prop="pressStart" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="终压结束时间" prop="pressEnd" :show-overflow-tooltip="true" width="190"></el-table-column>
          <el-table-column label="酱醪品质" prop="sauceClass" :show-overflow-tooltip="true" width="100"></el-table-column>
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
      productline: [],
      plantList: {
        factory: '',
        workShop: '',
        productLine: '',
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
      this.GetParentline(n)
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
      this.plantList.productLine = ''
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
    // 获取产线
    GetParentline (id) {
      this.plantList.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {parentId: id, deptType: 'proLine'}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.productline = []
      }
    },
    GetList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${REP_API.SQUEEZEPRESSLIST_API}`, 'POST', this.plantList).then(({data}) => {
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
      exportFile(`${REP_API.REPSQUEEZEPRESS_API}`, '压榨报表数据导出', that)
    }
  }
}
</script>

<style scoped>
</style>
