<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <linkage :plantList="plantList" :lablewidth="true" :isPackaging="true"></linkage>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="100px">
              <el-form-item label="品项：">
                <el-select v-model="plantList.material" filterable placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option
                    v-for="item in SerchSapList"
                    :key="item.sapCode+' '+item.itemName"
                    :label="item.sapCode+' '+item.itemName"
                    :value="item.sapCode+' '+item.itemName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：" class="dateinput">
                <el-date-picker type="month" v-model="plantList.productDate" placeholder="选择月份" value-format="yyyy-MM" style="width: 199px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listProductM')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportProductM')">导出</el-button>
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
            label="生产品项"
            :show-overflow-tooltip="true"
            width="180">
            <template slot-scope="scope">
              {{scope.row.materialH}}
            </template>
          </el-table-column>
          <el-table-column
            prop="production"
            label="月计"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="productionUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="basic"
            label="月计"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="basicUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="ml"
            label="月计"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="mlUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="cubic"
            label="月计"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="cubicUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="brand"
            label="品牌"
            :show-overflow-tooltip="true"
            width="70">
          </el-table-column>
          <el-table-column
            prop="largeClass"
            label="类别"
            :show-overflow-tooltip="true"
            width="70">
          </el-table-column>
          <el-table-column
            prop="boxSpec"
            label="箱规格"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <el-table-column
            prop="boxSpecUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="productSpec"
            label="瓶规格"
            :show-overflow-tooltip="true"
            width="70">
          </el-table-column>
          <el-table-column
            prop="productSpecUnitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="40">
          </el-table-column>
          <el-table-column
            prop="unitName"
            label="单位"
            :show-overflow-tooltip="true"
            width="50">
          </el-table-column>
          <div v-if="dataList.length > 0">
            <el-table-column :label="month + '月' + (index+1).toString() + '日'" v-for="(item,index) in dataList[0].listMonth.length" :key="item">
              <el-table-column
                label="白班产量"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].dayProduction}}
                </template>
              </el-table-column>
              <el-table-column
                label="中班产量"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].midProduction}}
                </template>
              </el-table-column>
              <el-table-column
                label="夜班产量"
                :show-overflow-tooltip="true"
                width="80">
                <template slot-scope="scope">
                  {{scope.row.listMonth[index].nigProduction}}
                </template>
              </el-table-column>
            </el-table-column>
          </div>
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
import {BASICDATA_API, REP_API} from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      month: '',
      lodingS: false,
      SerchSapList: [],
      dataList: [],
      plantList: {
        productDate: '',
        material: '',
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
    this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', {params: ''}, false, false, false).then(({data}) => {
      if (data.code === 0) {
        this.SerchSapList = data.list
      } else {
        this.$message.error(data.msg)
      }
    })
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
      if (this.plantList.material !== '') {
        this.plantList.materialCode = this.plantList.material.substring(0, this.plantList.material.indexOf(' '))
        this.plantList.materialName = this.plantList.material.substring(this.plantList.material.indexOf(' ') + 1)
      } else {
        this.plantList.materialCode = ''
        this.plantList.materialName = ''
      }
      this.$http(`${REP_API.REPPRODUCTMLIST_API}`, 'POST', this.plantList).then(({data}) => {
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
      let that = this
      exportFile(`${REP_API.REPPRODUCTMOUTPUT_API}`, '产量月汇总', that)
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
