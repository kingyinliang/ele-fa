<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex" style="border-bottom:1px solid #E9E9E9;margin-bottom:12px">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px">
                <el-form-item label="生产工厂：">
                  <el-select v-model="params.factoryId" class="selectwpx" style="width:140px" @change="changeOptions('factory')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                  <el-select v-model="params.workshopId" multiple class="selectwpx" style="width:293px" @change="changeOptions('workshop')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产产线：">
                  <el-select v-model="params.productlineId" multiple class="selectwpx" style="width:140px" @change="changeOptions('productline')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in productlineList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产品项：">
                  <el-select v-model="params.materialCode" class="selectwpx" style="width:140px" @change="changeOptions('material')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in materialList" :key="sole.materialCode" :label="sole.materialName" :value="sole.materialCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <el-date-picker type="date" v-model="params.startDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                  - <el-date-picker type="date" v-model="params.endDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                </el-form-item>
                <el-form-item >
                  <template>
                    <el-radio v-model="params.radio" label="OEE" style='margin-right:10px;'>OEE</el-radio>
                    <el-radio v-model="params.radio" label="OPE">OPE</el-radio>
                  </template>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width:340px">
              <el-row class="rowButton">
                <el-button type="primary" size="small" @click="exportExcel()" style="float:right" v-if='isExcelAuth()'>导出</el-button>
                <el-button type="primary" size="small" @click="getCompleteData()" style="float:right" v-if='isQueryAuth()'>查询</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-row v-show="searched" style="margin-top:20px;">
          <div style="min-height:320px">
            <el-table border  header-row-class-name="tableHead" :data="dataList" v-show="params.radio === 'OEE'">
              <el-table-column fixed label="工厂"  width="130" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.factoryName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="车间"  :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.workShopName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="产线"  :show-overflow-tooltip="true" width="60">
                <template slot-scope="scope">
                  {{scope.row.productLineName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="品项"  width="150"  :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.materialName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="日期"  width="100">
                <template slot-scope="scope">
                  {{scope.row.productDate}}
                </template>
              </el-table-column>
              <el-table-column fixed label="可用率"  width="80">
                <template slot-scope="scope">
                  {{scope.row.avbRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="时间稼动率"  width="100">
                <template slot-scope="scope">
                  {{scope.row.timeCropRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="性能稼动率" width="100">
                <template slot-scope="scope">
                  {{scope.row.performCropRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="良品率"  width="80">
                <template slot-scope="scope">
                  {{scope.row.googRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="综合效率(OEE)"  width="90">
                <template slot-scope="scope">
                  {{scope.row.theOEERatio}}
                </template>
              </el-table-column>
              <el-table-column label="生产效率(无可用率)"  width="95">
                <template slot-scope="scope">
                  {{scope.row.proDuctRatio}}
                </template>
              </el-table-column>
              <el-table-column label="总时间(min)"  width="110">
                <template slot-scope="scope">
                  {{scope.row.allTolTime}}
                </template>
              </el-table-column>
              <el-table-column label="计划停机时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.planStop}}
                </template>
              </el-table-column>
              <el-table-column label="实际投入时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.alltime}}
                </template>
              </el-table-column>
              <el-table-column label="除外时间(min)" :show-overflow-tooltip="true" width="90">
                <template slot-scope="scope">
                  {{scope.row.removeTime}}
                </template>
              </el-table-column>
              <el-table-column label="异常损失时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.excptTime}}
                </template>
              </el-table-column>
              <el-table-column label="净作业时间(min)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.netOprTime}}
                </template>
              </el-table-column>
              <el-table-column label="产出数(件)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.output}}
                </template>
              </el-table-column>
              <el-table-column label="不良品数(件)" :show-overflow-tooltip="true" width="120">
                <template slot-scope="scope">
                  {{scope.row.allBad}}
                </template>
              </el-table-column>
              <el-table-column label="标准产能(件/h)" :show-overflow-tooltip="true" width="130">
                <template slot-scope="scope">
                  {{scope.row.basicCapacity}}
                </template>
              </el-table-column>
              <el-table-column label="产出时间(h)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.outPutTime}}
                </template>
              </el-table-column>
              <el-table-column label="净作业时间(h)" :show-overflow-tooltip="true" width="120">
                <template slot-scope="scope">
                  {{scope.row.netOprTimeHour}}
                </template>
              </el-table-column>
            </el-table>
            <el-table border  header-row-class-name="tableHead" :data="opeDataList" v-show="params.radio === 'OPE'">
              <el-table-column fixed label="工厂"  width="130" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.factoryName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="车间"  :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.workShopName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="产线"  :show-overflow-tooltip="true" width="60">
                <template slot-scope="scope">
                  {{scope.row.productLineName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="品项"  width="150"  :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.materialName}}
                </template>
              </el-table-column>
              <el-table-column fixed label="日期"  width="100">
                <template slot-scope="scope">
                  {{scope.row.productDate}}
                </template>
              </el-table-column>
              <el-table-column fixed label="可用率"  width="80">
                <template slot-scope="scope">
                  {{scope.row.avbRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="时间稼动率"  width="100">
                <template slot-scope="scope">
                  {{scope.row.timeCropRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="操作效率" width="100">
                <template slot-scope="scope">
                  {{scope.row.performCropRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="良品率"  width="80">
                <template slot-scope="scope">
                  {{scope.row.googRatio}}
                </template>
              </el-table-column>
              <el-table-column fixed label="综合效率(OPE)"  width="90">
                <template slot-scope="scope">
                  {{scope.row.theOEERatio}}
                </template>
              </el-table-column>
              <el-table-column label="生产效率(无可用率)"  width="95">
                <template slot-scope="scope">
                  {{scope.row.proDuctRatio}}
                </template>
              </el-table-column>
              <el-table-column label="总时间(min)"  width="110">
                <template slot-scope="scope">
                  {{scope.row.allTolTime}}
                </template>
              </el-table-column>
              <el-table-column label="计划停机时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.planStop}}
                </template>
              </el-table-column>
              <el-table-column label="实际投入时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.alltime}}
                </template>
              </el-table-column>
              <el-table-column label="除外时间(min)" :show-overflow-tooltip="true" width="90">
                <template slot-scope="scope">
                  {{scope.row.removeTime}}
                </template>
              </el-table-column>
              <el-table-column label="异常损失时间(min)" :show-overflow-tooltip="true" width="110">
                <template slot-scope="scope">
                  {{scope.row.excptTime}}
                </template>
              </el-table-column>
              <el-table-column label="净作业时间(min)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.netOprTime}}
                </template>
              </el-table-column>
              <el-table-column label="产出数(件)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.output}}
                </template>
              </el-table-column>
              <el-table-column label="不良品数(件)" :show-overflow-tooltip="true" width="120">
                <template slot-scope="scope">
                  {{scope.row.allBad}}
                </template>
              </el-table-column>
              <el-table-column label="标准产能(件/h)" :show-overflow-tooltip="true" width="130">
                <template slot-scope="scope">
                  {{scope.row.basicCapacity}}
                </template>
              </el-table-column>
              <el-table-column label="标配人力数量(人/线)" :show-overflow-tooltip="true" width="130">
                <template slot-scope="scope">
                  {{scope.row.standardOfMan}}
                </template>
              </el-table-column>
              <el-table-column label="实际人力数量(人/线)" :show-overflow-tooltip="true" width="130">
                <template slot-scope="scope">
                  {{scope.row.acManNum}}
                </template>
              </el-table-column>
              <el-table-column label="产出时间(h)" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.outPutTime}}
                </template>
              </el-table-column>
              <el-table-column label="净作业时间(h)" :show-overflow-tooltip="true" width="120">
                <template slot-scope="scope">
                  {{scope.row.netOprTimeHour}}
                </template>
              </el-table-column>
            </el-table>

            <el-row style="font-size:14px;line-height:30px;margin-top:10px">
            </el-row>
          </div>
          <el-row>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </el-row>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {BASICDATA_API, REP_API} from '@/api/api'
import {exportFile} from '@/net/validate'
import {Vue, Component, Watch} from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class Index extends Vue {
  params = {
    factoryId: '',
    factoryName: '',
    workshopId: [],
    workshopName: '',
    productlineId: [],
    productlineName: '',
    materialCode: '',
    materialName: '',
    startDate: '',
    endDate: '',
    radio: 'OEE'
  }
  factoryList = []
  workshopList = []
  productlineList = []
  materialList = []
  dataList = []
  sumBean = null
  opeDataList = []
  opeSumBean = null
  searched: boolean = false
  currPage: number = 1
  pageSize: number = 10
  totalCount: number = 0
  plantList = {}
  mounted () {
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.getProductLine(this.params.workshopId)
    // this.getMaterialList()
  }
  // button 权限
  isQueryAuth () {
    if (this.params.radio === 'OEE') {
      return Vue.prototype.isAuth('report:formh:productEfficiencyList')
    } else {
      return Vue.prototype.isAuth('report:formh:productEfficOPEList')
    }
  }
  isExcelAuth () {
    if (this.params.radio === 'OEE') {
      return Vue.prototype.isAuth('report:formh:exportProductEfficiencyList')
    } else {
      return Vue.prototype.isAuth('report:formh:exportProductEfficOPEList')
    }
  }
  // 切换表头选项
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
    } else if (flag === 'productline') {
      let item = this.productlineList.find(ele => ele.deptId === this.params.productlineId)
      this.params.productlineName = item ? item.deptName : ''
    } else if (flag === 'material') {
      let item = this.materialList.find(ele => ele.materialCode === this.params.materialCode)
      this.params.materialName = item ? item.materialName : ''
    }
  }
  // 获取工厂
  getFactory () {
    this.factoryList = []
    Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
      if (res.data.code === 0) {
        this.factoryList = res.data.typeList
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 根据工厂获车间
  getWorkshop (fid: string) {
    this.workshopList = []
    if (fid) {
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '包装 组装'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  // 产线
  getProductLine (wid) {
    wid = wid.join(',')
    this.productlineList = []
    if (wid) {
      Vue.prototype.$http(`${REP_API.OEE_PRODUCT_API}`, 'POST', {deptIds: wid}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.productlineList = data.childList
        } else {
          this.$message.error(data.msg)
        }
      })
    }
    // this.productlineList = []
    // if (wid) {
    //   Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: wid}, false, false, false).then(({data}) => {
    //     if (data.code === 0) {
    //       this.productlineList = data.childList
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   })
    // }
  }
  getMaterialList (wid) {
    wid = wid.join(',')
    this.materialList = []
    Vue.prototype.$http(`${BASICDATA_API.MATERIALS_API}`, 'POST', {productLine: wid}).then(({data}) => {
      if (data.code === 0) {
        this.materialList = data.materialList
      } else {
        this.$message.error(data.msg)
      }
    })
    // Vue.prototype.$http(`${BASICDATA_API.MATERIAL_API}`, 'POST', {param: '欣和成品'}, false, false, false).then(({data}) => {
    //   if (data.code === 0) {
    //     this.materialList = data.allList
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // })
  }
  exportExcel () {
    this.plantList = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId.join(','),
      productLine: this.params.productlineId.join(','),
      materialCode: this.params.materialCode,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate
    }
    let that = this
    if (this.params.radio === 'OEE') {
      exportFile(`${REP_API.OEE_EXCEL_API}`, 'OEE报表', that)
    } else {
      exportFile(`${REP_API.OPE_EXCEL_API}`, 'OPE报表', that)
    }
  }
  getCompleteData () {
    this.searched = true
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId.join(','),
      productLine: this.params.productlineId.join(','),
      materialCode: this.params.materialCode,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    let that = this
    let net0 = new Promise((resolve, reject) => {
      that.getDataList(params, resolve, reject)
    })
    let net1 = new Promise((resolve, reject) => {
      that.getSumBean(params, resolve, reject)
    })
    Promise.all([net0, net1]).then((ret) => {
      if (this.params.radio === 'OEE') {
        if (that.dataList && that.sumBean) {
          Object.assign(that.sumBean, {productDate: '合计'})
          that.dataList.push(that.sumBean)
        }
      } else {
        if (that.opeDataList && that.opeSumBean) {
          Object.assign(that.opeSumBean, {productDate: '合计'})
          that.opeDataList.push(that.opeSumBean)
        }
      }
    })
  }
  getDataList (params, resolve?, reject?) {
    if (this.params.radio === 'OEE') {
      this.retrieveOEEDataList(params, resolve, reject)
    } else {
      this.retrieveOPEDataList(params, resolve, reject)
    }
  }
  getSumBean (params, resolve?, reject?) {
    if (this.params.radio === 'OEE') {
      this.sumBean = null
      Vue.prototype.$http(`${REP_API.OEE_SUM_API}`, 'POST', params).then(res => {
        if (res.data.code === 0) {
          this.sumBean = res.data.sumBean
        } else {
          this.$message.error(res.data.msg)
        }
        if (resolve) {
          resolve()
        }
      }).catch(err => {
        console.log('catch data::', err)
        if (reject) {
          reject()
        }
      })
    } else {
      this.opeSumBean = null
      Vue.prototype.$http(`${REP_API.OPE_SUM_API}`, 'POST', params).then(res => {
        if (res.data.code === 0) {
          this.opeSumBean = res.data.sumBean
        } else {
          this.$message.error(res.data.msg)
        }
        if (resolve) {
          resolve()
        }
      }).catch(err => {
        console.log('catch data::', err)
        if (reject) {
          reject()
        }
      })
    }
  }
  retrieveOEEDataList (params, resolve?, reject?) {
    this.dataList = []
    Vue.prototype.$http(`${REP_API.OEE_LIST_API}`, 'POST', params).then(res => {
      if (res.data.code === 0) {
        this.dataList = res.data.page.list
        this.totalCount = res.data.page.totalCount
      } else {
        this.$message.error(res.data.msg)
      }
      if (resolve) {
        resolve()
      }
    }).catch(err => {
      console.log('catch data::', err)
      if (reject) {
        reject()
      }
    })
  }
  retrieveOPEDataList (params, resolve?, reject?) {
    this.opeDataList = []
    Vue.prototype.$http(`${REP_API.OPE_LIST_API}`, 'POST', params).then(res => {
      if (res.data.code === 0) {
        this.opeDataList = res.data.page.list
        this.totalCount = res.data.page.totalCount
      } else {
        this.$message.error(res.data.msg)
      }
      if (resolve) {
        resolve()
      }
    }).catch(err => {
      console.log('catch data::', err)
      if (reject) {
        reject()
      }
    })
  }
  // getSummaries (param) {
  //   let sums = []
  //   sums[0] = ''
  //   sums[1] = ''
  //   sums[2] = ''
  //   sums[3] = ''
  //   sums[4] = '总价'
  //   sums[5] = this.sumBean.avbRatio
  //   sums[6] = this.sumBean.timeCropRatio
  //   sums[7] = this.sumBean.performCropRatio
  //   sums[8] = this.sumBean.googRatio
  //   sums[9] = this.sumBean.theOEERatio
  //   sums[10] = this.sumBean.proDuctRatio
  //   sums[11] = this.sumBean.allTolTime
  //   sums[12] = this.sumBean.planStopTime
  //   sums[13] = this.sumBean.alltime
  //   sums[14] = this.sumBean.removeTime
  //   sums[15] = this.sumBean.excptTime
  //   sums[16] = this.sumBean.netOprTime
  //   sums[17] = this.sumBean.output
  //   sums[18] = this.sumBean.allBad
  //   sums[19] = this.sumBean.basicCapacity
  //   sums[20] = this.sumBean.outPutTime
  //   sums[21] = this.sumBean.netOprTimeHour
  //   return sums
  // }
  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId.join(','),
      productLine: this.params.productlineId.join(','),
      materialCode: this.params.materialCode,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    let that = this
    let net0 = new Promise((resolve, reject) => {
      that.getDataList(params, resolve, reject)
    })
    net0.then((ret) => {
      if (this.params.radio === 'OEE') {
        if (that.dataList && that.sumBean) {
          Object.assign(that.sumBean, {productDate: '合计'})
          that.dataList.push(that.sumBean)
        }
      } else {
        if (that.opeDataList && that.opeSumBean) {
          Object.assign(that.opeSumBean, {productDate: '合计'})
          that.opeDataList.push(that.opeSumBean)
        }
      }
    })
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId.join(','),
      productLine: this.params.productlineId.join(','),
      materialCode: this.params.materialCode,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    let that = this
    let net0 = new Promise((resolve, reject) => {
      that.getDataList(params, resolve, reject)
    })
    net0.then((ret) => {
      if (this.params.radio === 'OEE') {
        if (that.dataList && that.sumBean) {
          Object.assign(that.sumBean, {productDate: '合计'})
          that.dataList.push(that.sumBean)
        }
      } else {
        if (that.opeDataList && that.opeSumBean) {
          Object.assign(that.opeSumBean, {productDate: '合计'})
          that.opeDataList.push(that.opeSumBean)
        }
      }
    })
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
    this.currPage = 1
    this.pageSize = 10
    this.totalCount = 0
  }
  @Watch('params.factoryId')
  onChangeFactory (newVal: string, oldVal: string) {
    this.params.workshopId = []
    this.params.workshopName = ''
    this.getWorkshop(newVal)
  }
  @Watch('params.workshopId')
  onChangeWorkshop (newVal: string, oldVal: string) {
    this.params.productlineId = []
    this.params.productlineName = ''
    this.getProductLine(newVal)
  }
  @Watch('params.productlineId')
  onChangeProductLineId (newVal: string, oldVal: string) {
    this.getMaterialList(newVal)
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_common.scss';
</style>
<style lang="scss" scoped>
  .box-item{
    height:220px;
    box-sizing:border-box;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(232,232,232,1);
    .box-item-top{
      height:178px;
      padding:10px 10px;
      padding-bottom:0px;
      border-bottom: 1px solid rgba(232,232,232,1);
      .box-item-title{
        display:flex;
        justify-content:space-between;
        flex:1;
        height:34px;
        .box-item-title-name{
          display:flex;
          flex:1;
          :first-child{
            height:30px;
            width:30px;
            border-radius:15px;
            background:#FFBF00;
            font-size:12px;
            font-weight:500;
            color:#fff;
            line-height:30px;
            text-align:center;
          }
          :nth-child(2){
            font-size:16px;
            font-weight:400;
            color:rgba(0,0,0,0.85);
            line-height:22px;
            margin-top:4px;
            margin-left:5px;
          }
        }
        .box-item-title-state{
          flex:1;
          font-size:14px;
          font-weight:500;
          color:rgba(0,0,0,0.65);
          line-height:20px;
          text-align:right;
          margin-top:4px;
          &:before{
            content:'';
            display: inline-block;
            height:6px;
            width:6px;
            margin-right:10px;
            margin-bottom:2px;
            background:rgba(126,211,33,1)
          }
        }
        .box-item-title-state-nopass{
          flex:1;
          font-size:14px;
          font-weight:500;
          color:red;
          line-height:20px;
          text-align:right;
          margin-top:4px;
          &:before{
            content:'';
            display: inline-block;
            height:6px;
            width:6px;
            margin-right:10px;
            margin-bottom:2px;
            background:red
          }
        }
      }
      .box-item-container{
        display:flex;
        flex:1;
        justify-content:space-between;
        height:129px;
        .box-item-container-left{
          display:flex;
          justify-content:center;
          width:130px;
          padding-top:10px;
          .box-item-container-img{
            width:94px;
            height:86px;
            background: url('~@/assets/img/fajiaoguan.png')
          }
        }
        .box-item-container-right{
          flex:1;
          display:flex;
          flex-direction:column;
          margin-left:10px;
          .box-item-container-item{
            flex:1;
            display:flex;
            justify-content:space-between;
            .name{
              width:60px;
              font-size:12px;
              font-weight:400;
              color:rgba(0,0,0,0.45);
              line-height:20px;
            }
            .detail{
              flex:1;
              font-size:14px;
              font-weight:500;
              color:rgba(0,0,0,0.65);
              line-height:17px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
          }
        }
      }
    }
    .box-item-bottom{
      height:40px;
      box-sizing:border-box;
      display:flex;
      justify-content:space-between;
      background:rgba(247,249,250,1);
      border-radius:0px 0px 2px 2px;
      .box-item-bottom-item{
        flex:1;
        text-align:center;
        line-height:40px;
        font-size:12px;
        font-weight:500;
        color:rgba(0,0,0,0.65);
        &:hover{
          color:#fff;
          background:#1890FF;
          cursor:pointer
        }
      }
      .box-item-bottom-split{
        width:1px;
        height:16px;
        background:rgba(232,232,232,1);
        margin-top:12px;
      }
    }
  }
  .rowButton{
    button{
      margin: 0px 3px!important;
    }
  }
.box-card{
  .pro-line { border-bottom: 1px solid #dcdfe6; }
  .pro-line p { color: red; font-size: 16px; letter-spacing: .1em; }
  b{
    font-size: 16px;
    line-height: 32px;
    float: left;
  }
  .item{
    margin-top: 20px;
    display: flex;
    img{
      float: left;
      width: 220px;
      height: 220px;
      border-radius: 6px;
      border: 1px solid #dcdfe6;
      margin-right: 20px;
    }
    .itemForm{
      flex: 1;
      p{
        color: #8a979e;
      }
    }
    .margb20px{margin-bottom: 10px}
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
