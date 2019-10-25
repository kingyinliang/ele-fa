<template>
  <div>
    <div class="main">
      <el-card class="searchCard newCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="50px">
              <el-form-item label="工厂：" label-width="80px">
                <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px" @change="changeOptions('factory')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：">
                <el-select v-model="params.workshopId" class="selectwpx" style="width: 140px"  @change="changeOptions('workshop')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="罐号：" >
                <el-select v-model="params.potId" class="selectwpx" filterable style="width: 140px" @change="changeOptions('pot')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in potList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="物料：" >
                <el-select v-model="params.materialCode" @change="changeOptions('material')" class="selectwpx" filterable style="width: 140px">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in materialList" :key="sole.materialCode" :label="sole.materialCode + ' ' + sole.materialName" :value="sole.materialCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单日期：" label-width="80px">
                <el-date-picker type="date" v-model="params.startDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                - <el-date-picker type="date" v-model="params.endDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 80px">
            <el-button type="primary" size="small" @click="getOrderList()" style="float: right" v-if="isAuth('fer:order:list')">查询</el-button>
          </el-col>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0px" >
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-tabs ref='tabs'  v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="border-radius: 15px;overflow: hidden">
          <el-tab-pane name="1">
            <span slot="label" class="spanview">
              <el-button>未申请</el-button>
            </span>
            <el-row>
              <el-col>
                <el-button type='primary' size='small' style='float:right; margin-bottom:10px;' @click="applyOrder()" v-if="isAuth('fer:order:applyFerOrder')">申请订单</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-table @selection-change="handleChange" header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column label="容器" :show-overflow-tooltip="true" width="100">
                  <template slot-scope="scope">
                    {{scope.row.holdName}}
                  </template>
                </el-table-column>
                <el-table-column label="物料" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.ferMaterialCode + ' ' + scope.row.ferMaterialName}}
                  </template>
                </el-table-column>
                <el-table-column label="订单量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.ferAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    {{scope.row.ferUnit}}
                  </template>
                </el-table-column>
                <el-table-column label="开始日期" width="100">
                  <template slot-scope="scope">
                    {{scope.row.startDate}}
                  </template>
                </el-table-column>
                <el-table-column label="结束日期" width="100">
                  <template slot-scope="scope">
                    {{scope.row.endDate}}
                  </template>
                </el-table-column>
                <el-table-column label="制曲工单" width="120">
                  <template slot-scope="scope">
                    {{scope.row.kjmOrderNo}}
                  </template>
                </el-table-column>
                <el-table-column label="制曲物料" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.kjmMaterialCode + ' ' + scope.row.kjmMaterialName}}
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.kjmAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    {{scope.row.kjmUnit}}
                  </template>
                </el-table-column>
                <el-table-column label="批次" width="120">
                  <template slot-scope="scope">
                    {{scope.row.batch}}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="申请人员" width="100">
                  <template slot-scope="scope">
                  </template>
                </el-table-column>
                <el-table-column label="申请时间" width="100">
                  <template slot-scope="scope">
                  </template>
                </el-table-column>
                <el-table-column label="订单号" width="100">
                  <template slot-scope="scope">
                  </template>
                </el-table-column> -->
              </el-table>
            </el-row>
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
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label"  class="spanview">
              <el-button>已申请</el-button>
            </span>
            <el-row>
              <el-table header-row-class-name="tableHead" :data="applyedList" border tooltip-effect="dark" >
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column label="容器" :show-overflow-tooltip="true" width="100">
                  <template slot-scope="scope">
                    {{scope.row.holdName}}
                  </template>
                </el-table-column>
                <el-table-column label="物料" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.ferMaterialCode + ' ' + scope.row.ferMaterialName}}
                  </template>
                </el-table-column>
                <el-table-column label="订单量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.ferAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    {{scope.row.ferUnit}}
                  </template>
                </el-table-column>
                <el-table-column label="开始日期" width="100">
                  <template slot-scope="scope">
                    {{scope.row.startDate}}
                  </template>
                </el-table-column>
                <el-table-column label="结束日期" width="100">
                  <template slot-scope="scope">
                    {{scope.row.endDate}}
                  </template>
                </el-table-column>
                <el-table-column label="制曲工单" width="120">
                  <template slot-scope="scope">
                    {{scope.row.kjmOrderNo}}
                  </template>
                </el-table-column>
                <el-table-column label="制曲物料" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.kjmMaterialCode + ' ' + scope.row.kjmMaterialName}}
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.kjmAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    {{scope.row.kjmUnit}}
                  </template>
                </el-table-column>
                <el-table-column label="批次" width="120">
                  <template slot-scope="scope">
                    {{scope.row.batch}}
                  </template>
                </el-table-column>
                <el-table-column label="申请人员" width="140">
                  <template slot-scope="scope">
                    {{scope.row.applyUser}}
                  </template>
                </el-table-column>
                <el-table-column label="申请时间" width="160">
                  <template slot-scope="scope">
                    {{scope.row.applyDate}}
                  </template>
                </el-table-column>
                <el-table-column label="订单号" width="120">
                  <template slot-scope="scope">
                    {{scope.row.ferOrderNo}}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row>
              <el-pagination
                @size-change="handleApplySizeChange"
                @current-change="handleApplyCurrentChange"
                :current-page="applyCurrPage"
                :page-sizes="[10, 15, 20]"
                :page-size="applyPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="applyTotalCount">
              </el-pagination>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {BASICDATA_API, FERMENTATION_API} from '@/api/api'
import {Vue, Component, Watch} from 'vue-property-decorator'
import {dateFormat, headanimation} from '@/net/validate'
@Component({
  components: {
  }
})

export default class Index extends Vue {
  // 将common中的参数复制一份到本地
  params = JSON.parse(JSON.stringify(this.$store.state.common.FerOrderManage))
  factoryList = []
  workshopList = []
  potList = []
  materialList = []
  dataList = []
  currPage = 0
  pageSize = 10
  totalCount = 0
  applyedList = []
  applyCurrPage = 0
  applyPageSize = 10
  applyTotalCount = 0
  selectedList = []
  activeName = '1'
  searched: boolean = false
  mounted () {
    headanimation(Vue.prototype.$)
    const now = dateFormat(new Date(), 'yyyy-MM-dd')
    this.params.startDate = now
    this.params.endDate = now
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.getMaterialList(this.params.factoryId)
    this.getFermentPot(this.params.factoryId, this.params.workshopId)
  }
  isAuth (key) {
    return Vue.prototype.isAuth(key)
  }
  get mainTabs () {
    return this.$store.state.common.mainTabs
  }
  set mainTabs (val) {
    this.$store.commit('common/updateMainTabs', val)
  }
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
    } else if (flag === 'pot') {
      let item = this.potList.find(ele => ele.holderId === this.params.potId)
      this.params.potName = item ? item.holderName : ''
    } else if (flag === 'material') {
      let item = this.materialList.find(ele => ele.materialCode === this.params.materialCode)
      this.params.materialName = item ? item.materialName : ''
    }
  }

  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    this.currPage = 1
    this.retrieveDataList()
  }
  handleApplySizeChange (val: number) {
    this.applyPageSize = val
    this.applyCurrPage = 1
    this.retrieveApplyedList()
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
    this.retrieveDataList()
  }
  // 跳转页数
  handleApplyCurrentChange (val: number) {
    this.applyCurrPage = val
    this.retrieveApplyedList()
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
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '发酵'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  // 发酵罐
  getFermentPot (fid: string, wid: string) {
    this.potList = []
    if (fid && wid) {
      Vue.prototype.$http(`${BASICDATA_API.BASEHOLDERLIST_API}`, 'POST', {factory: fid, workShop: wid}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.potList = res.data.holderList
          // if (!this.params.factoryId && res.data.num.length > 0) {
          //   this.params.workshopId = res.data.num[0].holderId
          // }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  getMaterialList (fid: string) {
    this.materialList = []
    if (fid) {
      Vue.prototype.$http(`${BASICDATA_API.BASEMATERIALIST_API}`, 'POST', {factory: fid}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.materialList = res.data.materialList
          // if (!this.params.factoryId && res.data.num.length > 0) {
          //   this.params.workshopId = res.data.num[0].holderId
          // }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  setStore (params) {
    this.$store.commit('common/updateFerOrderManage', params)
  }
  getOrderList () {
    if (this.params.factoryId === '') {
      this.$message.error('请选择工厂')
      return
    }
    // if (this.params.workshopId === '') {
    //   this.$message.error('请选择车间')
    //   return
    // }
    // if (this.params.potId === '') {
    //   this.$message.error('请选择罐号')
    //   return
    // }
    // if (this.params.materialCode === '') {
    //   this.$message.error('请选择物料')
    //   return
    // }
    // if (this.params.startDate === '') {
    //   this.$message.error('请选择开始日期')
    //   return
    // }
    // if (this.params.endDate === '') {
    //   this.$message.error('请选择结束日期')
    //   return
    // }
    this.searched = true
    // 保存选项值到common store
    this.setStore(this.params)
    this.retrieveDataList()
    this.retrieveApplyedList()
  }
  retrieveDataList () {
    let queryParams = {
      factory: this.params.factoryId,
      workShop: this.params.workshopId,
      startDateFrom: this.params.startDate,
      startDateTo: this.params.endDate,
      holderId: this.params.potId,
      kjmMaterialCode: this.params.materialCode,
      turnFlag: '0',
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    this.dataList = []
    Vue.prototype.$http(`${FERMENTATION_API.ORDER_LIST_API}`, `POST`, queryParams).then((res) => {
      if (res.data.code === 0) {
        this.dataList = res.data.orderPage.list
        this.totalCount = res.data.orderPage.totalCount
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  retrieveApplyedList () {
    let queryParams = {
      factory: this.params.factoryId,
      workShop: this.params.workshopId,
      startDateFrom: this.params.startDate,
      startDateTo: this.params.endDate,
      holderId: this.params.potId,
      kjmMaterialCode: this.params.materialCode,
      turnFlag: '1',
      currPage: this.applyCurrPage + '',
      pageSize: this.applyPageSize + ''
    }
    this.applyedList = []
    Vue.prototype.$http(`${FERMENTATION_API.ORDER_LIST_API}`, `POST`, queryParams).then((res) => {
      if (res.data.code === 0) {
        this.applyedList = res.data.orderPage.list
        this.applyTotalCount = res.data.orderPage.totalCount
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 多选
  handleChange (selections) {
    this.selectedList = selections
  }
  applyOrder () {
    if (!this.selectedList || this.selectedList.length === 0) {
      this.$message.error('请选择要申请的订单')
      return
    }
    this.$confirm('确认申请订单，是否继续?', '申请确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      Vue.prototype.$http(`${FERMENTATION_API.ORDER_APPLY_API}`, `POST`, this.selectedList).then((res) => {
        if (res.data.code === 0) {
          this.getOrderList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    })
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
    this.selectedList = []
    this.dataList = []
    this.applyedList = []
    this.currPage = 1
    this.pageSize = 10
    this.totalCount = 0
    this.applyCurrPage = 1
    this.applyPageSize = 10
    this.applyTotalCount = 0
  }
  @Watch('params.factoryId')
  onFactoryValue (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.params.potId = ''
    this.params.potName = ''
    this.params.materialCode = ''
    this.params.materialName = ''
    this.getWorkshop(newVal)
    this.getMaterialList(newVal)
    this.getFermentPot(newVal, this.params.workshopId)
  }
  @Watch('params.workshopId')
  onWorkshopValue (newVal: string, oldVal: string) {
    this.params.potId = ''
    this.params.potName = ''
    this.getFermentPot(this.params.factoryId, newVal)
  }
}
</script>

<style lang="scss">
</style>
