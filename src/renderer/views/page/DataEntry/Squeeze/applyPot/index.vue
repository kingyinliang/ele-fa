<template>
  <div>
    <div class="main">
      <el-card class="searchCard newCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="50px">
              <el-form-item label="工厂：" >
                <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px" @change="changeOptions('factory')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：">
                <el-select v-model="params.workshopId" class="selectwpx" style="width: 140px" @change="changeOptions('workshop')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单日期：" label-width="80px">
                <el-date-picker type="date" v-model="params.orderDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width:140px">
            <el-button type="primary" size="small" v-if="isAuth('fer:openHolder:list')"  @click="getOrderList()">查询</el-button>
            <el-button type='primary' size='small' style='float:right; margin-bottom:10px;'  @click="pushPage('')">新增</el-button>
          </el-col>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0px">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-card>
          <el-row>
            <el-col>
              <div style="line-height: 40px;" ><i style="font-size: 22px;float:left;" class="iconfont factory-shouqicaidan"></i><span style="font-size:16px;font-weight:bold;margin-left:12px;">申请列表</span></div>
            </el-col>
          </el-row>
          <el-row>
            <el-table @row-dblclick="showDetail" header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" >
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column label="车间" :show-overflow-tooltip="true"  width="120">
                <template slot-scope="scope">
                  {{scope.row.workShopName}}
                </template>
              </el-table-column>
              <el-table-column label="申请编码" :show-overflow-tooltip="true"  width="140">
                <template slot-scope="scope">
                   {{scope.row.applyNo}}
                </template>
              </el-table-column>
              <el-table-column label="物料" :show-overflow-tooltip="true"  width="180">
                <template slot-scope="scope">
                  {{scope.row.materialCode + ' ' + scope.row.materialName}}
                </template>
              </el-table-column>
              <el-table-column label="半成品类别" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                  {{scope.row.halfName}}
                </template>
              </el-table-column>
              <el-table-column label="申请数量" width="100">
                <template slot-scope="scope">
                  {{scope.row.amount}}
                </template>
              </el-table-column>
              <el-table-column label="生产日期" width="120">
                <template slot-scope="scope">
                  {{scope.row.productDate}}
                </template>
              </el-table-column>
              <el-table-column label="申请人员" width="170">
                <template slot-scope="scope">
                  {{scope.row.changer}}
                </template>
              </el-table-column>
              <el-table-column label="申请时间" width="170">
                <template slot-scope="scope">
                  {{scope.row.changed}}
                </template>
              </el-table-column>
               <el-table-column
                  fixed="right"
                  label="操作"
                  width="80">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="pushPage(scope.row.id)" v-if="isAuth('fer:openHolder:list')" >详情</el-button>
                  </template>
                </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currPage"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </el-row>
        </el-card>
      </div>
    </div>
    <div class="main" style="padding-top: 0px">
      <div class="tableCard">
        <el-card>
          <el-row>
            <div style="line-height: 40px;" ><i style="font-size: 22px;float:left;" class="iconfont factory-shouqicaidan"></i><span style="font-size:16px;font-weight:bold;margin-left:12px;">开罐明细</span></div>
          </el-row>
          <el-row>
            <el-table header-row-class-name="tableHead" :data="detailList" border tooltip-effect="dark" >
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column label="申请编码" width="140">
                <template slot-scope="scope">
                  {{scope.row.applyNo}}
                </template>
              </el-table-column>
              <el-table-column label="罐号" :show-overflow-tooltip="true" width="160">
                <template slot-scope="scope">
                  {{scope.row.holderName}}
                </template>
              </el-table-column>
              <el-table-column label="发酵天数/天" :show-overflow-tooltip="true" width="140">
                <template slot-scope="scope">
                  {{scope.row.ferDays}}
                </template>
              </el-table-column>
              <el-table-column label="半成品类别" :show-overflow-tooltip="true" width="140">
                <template slot-scope="scope">
                  {{scope.row.halfType}}
                </template>
              </el-table-column>
              <el-table-column label="批次" width="140">
                <template slot-scope="scope">
                  {{scope.row.batch}}
                </template>
              </el-table-column>
              <el-table-column label="确认人员" width="160">
                <template slot-scope="scope">
                  {{scope.row.changer}}
                </template>
              </el-table-column>
              <el-table-column label="确认时间" >
                <template slot-scope="scope">
                   {{scope.row.changed}}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <!-- <el-pagination
              @size-change="handleDataSizeChange"
              @current-change="handleDataCurrentChange"
              :current-page="dataCurrPage"
              :page-sizes="[10, 15, 20]"
              :page-size="dataPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dataTotalCount">
            </el-pagination> -->
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {BASICDATA_API, SQU_API} from '@/api/api'
import {Vue, Component, Watch} from 'vue-property-decorator'
import {dateFormat, headanimation} from '@/net/validate'
@Component({
  components: {
  }
})

export default class Index extends Vue {
  // 将common中的参数复制一份到本地
  params = {
    factoryId: this.$store.state.common.SqueezeApplyPot.factoryId,
    factoryName: this.$store.state.common.SqueezeApplyPot.factoryName,
    workshopId: this.$store.state.common.SqueezeApplyPot.workshopId,
    workshopName: this.$store.state.common.SqueezeApplyPot.workshopName,
    orderDate: this.$store.state.common.SqueezeApplyPot.orderDate
  }
  factoryList = []
  workshopList = []
  potList = []
  materialList = []
  totalList = []
  detailList = []
  searched: boolean = false
  currPage: number = 1
  pageSize: number = 5
  totalCount: number = 0
  mounted () {
    headanimation(Vue.prototype.$)
    const now = dateFormat(new Date(), 'yyyy-MM-dd')
    this.params.orderDate = now
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    // this.getFermentPot(this.params.factoryId)
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
  pushPage (applyId) { // applyNo = ''就是新增
    // 保存当前单号
    this.$store.commit('common/updateSqueezeApplyPotApplyId', applyId)
    const name = 'DataEntry-Squeeze-applyPot-detail'
    this.mainTabs = this.mainTabs.filter(item => item.name !== name)
    let that = this
    setTimeout(function () {
      that.$router.push({name})
    }, 100)
  }
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
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
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '压榨'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  // 发酵罐
  // getFermentPot (fid: string) {
  //   this.potList = []
  //   if (fid) {
  //     Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', {factory: fid}, false, false, false).then(res => {
  //       if (res.data.code === 0) {
  //         this.potList = res.data.num
  //         // if (!this.params.factoryId && res.data.num.length > 0) {
  //         //   this.params.workshopId = res.data.num[0].holderId
  //         // }
  //       } else {
  //         this.$message.error(res.data.msg)
  //       }
  //     })
  //   }
  // }
  setStore (params) {
    this.$store.commit('common/updateSqueezeApplyPot', params)
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
    // if (this.params.orderDate === '') {
    //   this.$message.error('请选择订单日期')
    //   return
    // }
    this.searched = true
    // 保存选项值到common store
    this.setStore(this.params)
    let queryParams = {
      factory: this.params.factoryId,
      workShop: this.params.workshopId,
      productDate: this.params.orderDate ? this.params.orderDate : ''
    }
    this.retrieveOrderList(queryParams)
  }
  retrieveOrderList (params) {
    this.totalList = []
    Vue.prototype.$http(`${SQU_API.POT_APPLY_LIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        this.totalList = res.data.page.list
        this.totalCount = this.totalList.length
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  showDetail (row) {
    this.detailList = []
    Vue.prototype.$http(`${SQU_API.POT_APPLY_DETAIL_API}`, `POST`, {openId: row.id}).then((res) => {
      if (res.data.code === 0) {
        this.detailList = res.data.list
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    this.currPage = 1
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
  }
  get dataList () {
    return this.totalList.slice((this.currPage - 1) * this.pageSize, this.currPage * this.pageSize)
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
    this.totalList = []
    this.detailList = []
  }
  @Watch('params.factoryId')
  onFactoryValue (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.getWorkshop(newVal)
    // this.getFermentPot(newVal)
  }
}
</script>

<style lang="scss">
</style>
