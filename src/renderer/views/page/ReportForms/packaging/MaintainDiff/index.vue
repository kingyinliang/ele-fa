<template>
  <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <linkage :plantList="plantList" :lablewidth="true" :isPackaging="true"></linkage>
          </el-col>
          <el-col style="width: 200px">
            <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('report:form:listJWZPIS')">查询</el-button>
            <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:form:exportJWZPIS')">导出</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="100px">
            <el-form-item label="订单号：">
              <el-input v-model="plantList.orderNo" style="width: 200px"></el-input>
            </el-form-item>
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
            <el-form-item label="生产日期：" style="width: 400px" class="dateinput">
              <el-row>
                <el-col :span="12">
                  <el-date-picker v-model="plantList.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                  <span>-</span>
                </el-col>
                <el-col :span="12">
                  <el-date-picker v-model="plantList.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
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
            prop="orderNo"
            label="品项"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.materialH}}
            </template>
          </el-table-column>
          <el-table-column
            prop="batch"
            label="生产批次"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orgnDifferent"
            label="差异数量"
            :show-overflow-tooltip="true"
            width="80">
          </el-table-column>
          <el-table-column
            prop="differentInfo"
            label="差异说明"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            :show-overflow-tooltip="true"
            width="100">
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
import {BASICDATA_API, REP_API} from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      lodingS: false,
      SerchSapList: [],
      dataList: [],
      plantList: {
        material: '',
        commitDateOne: '',
        commitDateTwo: '',
        orderNo: '',
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
      this.$http(`${REP_API.REPMADIFFLIST_API}`, 'POST', this.plantList).then(({data}) => {
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
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.REPMADIFFOUTPUT_API}`, '机维组数量差异报表数据导出', that)
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
