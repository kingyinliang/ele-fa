<template>
  <el-col>
    <div class="main">
      <el-card class="searchCard newCard" style="margin:0">
        <el-row type="flex">
          <el-col :span="21">
            <el-form :inline="true" size="small" label-width="85px">
              <el-form-item label="生产车间：">
                <p class="input_bommom">{{formHeader.workShopName}}</p>
              </el-form-item>
              <el-form-item label="订单号：">
                <p class="input_bommom">{{formHeader.orderNo}}</p>
              </el-form-item>
              <el-form-item label="订单日期：">
                <p class="input_bommom">{{formHeader.orderDate}}</p>
              </el-form-item>
              <el-form-item label="品项：">
                <p class="input_bommom">{{formHeader.materialCode + ' ' + formHeader.materialName}}</p>
              </el-form-item>
              <el-form-item label="计划产量：">
                <p class="input_bommom">{{formHeader.planOutput}}</p>
              </el-form-item>
              <el-form-item label="入罐号：">
                <p class="input_bommom">{{formHeader.inPotNoName}}</p>
              </el-form-item>
              <el-form-item label="生产日期：">
                <p class="input_bommom">{{formHeader.productDate}}</p>
              </el-form-item>
              <el-form-item label="提交人员：">
                <p class="input_bommom">{{formHeader.changer}}</p>
              </el-form-item>
              <el-form-item label="提交时间：">
                <p class="input_bommom">{{formHeader.changed}}</p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" >
            <div style="float:right;line-height:31px;font-size:14px">
              <div style="float:left">
                <span class="point" :style="{'background': formHeader.orderStatus === 'noPass'? 'red' : formHeader.orderStatus === 'saved'? '#1890f' : formHeader.orderStatus === 'submit' ? '#1890ff' : formHeader.orderStatus === '已拆分' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
              </div>
              <span :style="{'color': formHeader.orderStatus === 'noPass'? 'red' : '' }">{{formHeader.orderStatus === 'noPass'? '审核不通过' : formHeader.orderStatus === 'saved' ? '已保存' : formHeader.orderStatus === 'submit' ? '已提交' : formHeader.orderStatus === 'checked' ? '通过':formHeader.orderStatus === '已同步' ? '已同步' : formHeader.orderStatus === '已拆分' ? '未录入' :  formHeader.orderStatus === 'toBeAudited' ? '待审核' : formHeader.orderStatus}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right;margin-left:10px;">
            <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-KojiMaking-orderManage-index'})">返回</el-button>
            <el-button type="primary" size="small" @click="submitForm" v-if="formHeader.orderStatus !== 'submit' && formHeader.orderStatus !== 'checked' && isAuth('sys:midTimeSheet:udpate')">提交</el-button>
          </template>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top:0px">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color:white;margin-bottom:8px;position:relative;border-radius:5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="border-radius:15px;overflow:hidden">
          <el-tab-pane name="1">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark" :content="readyState === 'noPass'? '不通过':readyState === 'saved'? '已保存':readyState === 'submit' ? '已提交' : readyState === 'checked' ? '通过': readyState === 'toBeAudited' ? '待审核' : '未录入'" placement="top-start">
                <el-button :style="{'color': readyState === 'noPass'? 'red' : ''}">报工工时</el-button>
              </el-tooltip>
            </span>
            <el-row>
              <el-table header-row-class-name="tableHead" :data="workHourList"  border tooltip-effect="dark" >
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="工序" width="140">
                  <template slot-scope="scope">
                    {{scope.row.productLineName}}
                  </template>
                </el-table-column>
                <el-table-column label="曲房" width="120">
                  <template slot-scope="scope">
                    {{scope.row.houseName}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="准备工时"
                  width="100">
                  <template slot-scope="scope">
                    {{scope.row.confActivity1}}
                  </template>
                </el-table-column>
                <el-table-column width="60" label="单位">
                  <template slot-scope="scope">
                    {{scope.row.confActiUnit1}}
                  </template>
                </el-table-column>
                <el-table-column width="140" label="人工工时">
                  <template slot-scope="scope">
                    {{scope.row.confActivity3}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    <span>{{scope.row.confActiUnit3}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="机器工时" width="140">
                  <template slot-scope="scope">
                    <el-input size="small" type="number" v-model.number="scope.row.confActivity2"  placeholder="手工录入" :disabled="scope.row.disabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    <span>{{scope.row.confActiUnit2}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="140">
                  <template slot-scope="scope">
                    {{scope.row.remark}}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="145">
                  <template slot-scope="scope">
                    <el-button style='float:left' type="primary" size="small" @click="enbaleEdit(scope.row)" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit'" v-if="scope.row.disabled && isAuth('sys:midTimeSheet:udpate')">编辑</el-button>
                    <el-button style='float:left' type="primary" size="small" @click="saveWorkHour(scope.row)" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit'" v-if="!scope.row.disabled && isAuth('sys:midTimeSheet:udpate')">保存</el-button>
                    <el-button style='float:right' type="primary" size="small"  @click="goBack('报工工时', scope.row)" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" v-if="isAuth('sys:midTimeSheet:udpate')">退回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row>
              <el-col :span="24">
                <auditLog :tableData="workHourAuditList"></auditLog>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark" :content="inStorageState === 'noPass'? '不通过':inStorageState === 'saved'? '已保存':inStorageState === 'submit' ? '已提交' : inStorageState === 'checked'? '通过':inStorageState === 'toBeAudited'?'待审核':'未录入'" placement="top-start">
                <el-button :style="{'color': inStorageState === 'noPass'? 'red' : ''}">生产入库</el-button>
              </el-tooltip>
            </span>
            <el-row>
              <el-table header-row-class-name="tableHead" :data="inStockList"  border tooltip-effect="dark" >
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="曲房" width="100">
                  <template slot-scope="scope">
                    {{scope.row.houseName}}
                  </template>
                </el-table-column>
                <el-table-column label="豆粕量(KG)" width="100">
                  <template slot-scope="scope">
                    {{scope.row.pulpWeight}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="麦粉量(KG)"
                  width="100">
                  <template slot-scope="scope">
                    {{scope.row.wheatWeight}}
                  </template>
                </el-table-column>
                <el-table-column width="80" label="盐水量">
                  <template slot-scope="scope">
                    {{scope.row.saltWaterWeight}}
                  </template>
                </el-table-column>
                <el-table-column width="180" label="入库物料">
                  <template slot-scope="scope">
                    {{scope.row.materialCode + ' ' + scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column label="入库量" width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.sauceWeight}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="入库批次" width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.batch}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    <span>{{scope.row.unit}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作人" width="150">
                  <template slot-scope="scope">
                    {{scope.row.changer}}
                  </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                  <template slot-scope="scope">
                    {{scope.row.changed}}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="80">
                  <template slot-scope="scope">
                    <el-button style='float:right' type="primary" size="small" @click="goBack('生产入库', scope.row)" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" v-if="isAuth('sys:midTimeSheet:udpate')">退回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row style="margin-top:20px;">
              <el-col>
                <div>
                  <span>入库数合计：</span>{{totalInstock}} L
                  <span>&nbsp;&nbsp;实际入库数：</span><el-input size="small" type="number" v-model.number='realInAmount' style="display:inline-block; width:150px;" :disabled="!isEdit"></el-input> L
                </div>
              </el-col>
            </el-row>
            <!-- <el-row style="margin-top:20px;">
              <el-col>
                <span>实际入库数：</span><el-input size="small" type="number" v-model.number='realInAmount' style="display:inline-block; width:150px;"></el-input> L
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="24">
                <auditLog :tableData="inStockAuditList"></auditLog>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark"  :content="applyMaterielState === 'noPass'? '不通过':applyMaterielState === 'saved'? '已保存':applyMaterielState === 'submit' ? '已提交' : applyMaterielState === 'checked'? '通过':applyMaterielState === 'toBeAudited'? '待审核' : '未录入'" placement="top-start">
                <el-button :style="{'color': applyMaterielState === 'noPass'? 'red' : ''}">物料领用</el-button>
              </el-tooltip>
            </span>
            <el-row>
              <el-table header-row-class-name="tableHead" :data="applyMaterieList"  border tooltip-effect="dark" >
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="曲房" width="100">
                  <template slot-scope="scope">
                    {{scope.row.houseName}}
                  </template>
                </el-table-column>
                <el-table-column label="物料" width="180">
                  <template slot-scope="scope">
                    {{scope.row.materialCode + ' ' + scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="领用容器"
                  width="140">
                  <template slot-scope="scope">
                    {{scope.row.holderName}}
                  </template>
                </el-table-column>
                <el-table-column width="120" label="批次">
                  <template slot-scope="scope">
                    {{scope.row.batch}}
                  </template>
                </el-table-column>
                <el-table-column width="80" label="数量">
                  <template slot-scope="scope">
                    {{scope.row.entryQnt}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                  <template slot-scope="scope">
                    <span>{{scope.row.entryUom ? (scope.row.entryUom === 'box' ? '盒' : scope.row.entryUom === 'L' ? '升' : scope.row.entryUom === 'KG' ? '千克' : scope.row.entryUom) : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作人" width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.changer}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                  <template slot-scope="scope">
                    <span>{{scope.row.changed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="80">
                  <template slot-scope="scope">
                    <el-button style='float:right' type="primary" size="small" @click="goBack('物料领用', scope.row)" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" v-if="isAuth('sys:midTimeSheet:udpate')">退回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row>
              <el-col :span="24">
                <auditLog :tableData="applyMaterieAuditList"></auditLog>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label" class="spanview">
              <el-button>文本记录</el-button>
            </span>
            <text-record ref="textrecord" isRedact="true" ></text-record>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-col>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import {KJM_API} from '@/api/api'
import TextRecord from '@/views/components/textRecord.vue'
import AuditLog from '@/views/components/AuditLog.vue'
import {WorkHour, InStock, Material} from '../entity/WorkHour.ts'
@Component({
  components: {
    TextRecord,
    AuditLog
  }
})
export default class Index extends Vue {
  formHeader = {
    orderId: '',
    workShop: '',
    productDate: '',
    orderNo: '',
    materialCode: '',
    materialName: '',
    planOutput: 0,
    orderStatus: '',
    workShopName: '',
    orderDate: '',
    inPotNo: '',
    inPotNoId: '',
    inPotNoName: '',
    inKjmDate: '',
    // 实际入库值
    realInAmount: 0
  }
  workHourList: WorkHour[] = []
  workHourAuditList = []
  inStockList: InStock[] = []
  inStockAuditList = []
  applyMaterieList: Material[] = []
  applyMaterieAuditList = []
  // 实际入库数量
  realInAmount = 0
  activeName = '1'
  // 报工工时状态
  readyState = ''
  // 生产入库状态
  inStorageState = ''
  // 物料申请状态
  applyMaterielState = ''
  mounted () {
    this.getList()
  }
  get totalInstock () : number {
    let total = 0
    for (let ele of this.inStockList) {
      total += parseFloat(ele.sauceWeight)
    }
    return parseFloat(total.toFixed(2))
  }
  isAuth (key) {
    return Vue.prototype.isAuth(key)
  }
  getList () {
    // 全部页签页返回数据之后强制刷新tabs
    Promise.all([this.getFormHeader(), this.getWorkHourList(), this.getInStockList(), this.getMaterialList()]).then((result) => {
      // 如果订单状态是 submit/noPass/checked 实际入库值从表头取， 否则自动从storeageList计算出
      if (this.formHeader.orderStatus === 'submit' || this.formHeader.orderStatus === 'noPass' || this.formHeader.orderStatus === 'checked') {
        this.realInAmount = this.formHeader.realInAmount
      } else {
        this.realInAmount = this.totalInstock
      }
      let tabs: any = this.$refs.tabs
      tabs.handleTabClick(tabs.panes[parseInt(tabs.currentName) - 1])
    })
  }
  get isEdit () {
    return this.formHeader.orderStatus !== 'submit' && this.formHeader.orderStatus !== 'checked'
  }
  tabClick (val: any) {
    let tabs: any = this.$refs.tabs
    tabs.setCurrentName(val.name)
  }
  async getFormHeader () {
    let orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId
    await Vue.prototype.$http(`${KJM_API.KJMAKINGHEAD_API}`, 'POST', {orderId}).then(res => {
      if (res.data.code === 0 && res.data.list && res.data.list.length > 0) {
        let item = res.data.list[0]
        Object.assign(this.formHeader, item)
      } else {
        this.$message.error(res.data.code === 0 ? '数据异常，请稍后再试' : res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return 'ooooo'
  }
  async getWorkHourList () {
    let orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId
    this.workHourList = []
    this.workHourAuditList = []
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKTIME_API}`, 'POST', {orderId}).then(res => {
      if (res.data.code === 0) {
        let no = 0
        let sub = 0
        let che = 0
        let sav = 0
        let tobe = 0
        let inState = ''
        for (let item of res.data.list) {
          let workHour = new WorkHour(item)
          this.workHourList.push(workHour)
          if (item.status === 'noPass') {
            no = no + 1
          } else if (item.status === 'submit') {
            sub = sub + 1
          } else if (item.status === 'checked') {
            che = che + 1
          } else if (item.status === 'saved') {
            sav = sav + 1
          } else if (item.status === 'toBeAudited') {
            ++tobe
          }
        }
        this.workHourAuditList = res.data.vrlist
        if (no > 0) {
          inState = 'noPass'
        } else if (tobe > 0) {
          inState = 'toBeAudited'
        } else if (sub > 0) {
          inState = 'submit'
        } else if (sav > 0) {
          inState = 'saved'
        } else if (che > 0) {
          inState = 'checked'
        }
        this.readyState = inState
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return 'aaaaa'
  }
  async getInStockList () {
    let orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId
    this.inStockList = []
    this.inStockAuditList = []
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKSTORAGE_API}`, 'POST', {orderId}).then(res => {
      if (res.data.code === 0) {
        let no = 0
        let sub = 0
        let che = 0
        let sav = 0
        let tobe = 0
        let inState = ''
        for (let item of res.data.list) {
          let instorage = new InStock(item)
          this.inStockList.push(instorage)
          if (item.status === 'noPass') {
            no = no + 1
          } else if (item.status === 'submit') {
            sub = sub + 1
          } else if (item.status === 'checked') {
            che = che + 1
          } else if (item.status === 'saved') {
            sav = sav + 1
          } else if (item.status === 'toBeAudited') {
            ++tobe
          }
        }
        this.inStockAuditList = res.data.vrlist
        if (no > 0) {
          inState = 'noPass'
        } else if (tobe > 0) {
          inState = 'toBeAudited'
        } else if (sub > 0) {
          inState = 'submit'
        } else if (sav > 0) {
          inState = 'saved'
        } else if (che > 0) {
          inState = 'checked'
        }
        this.inStorageState = inState
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return 'bbbb'
  }
  async getMaterialList () {
    let orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId
    let orderNo = this.$store.state.common.ZQWorkshop.checkParams.orderNo
    this.applyMaterieList = []
    this.applyMaterieAuditList = []
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKMATERIALE_API}`, 'POST', {orderId, orderNo}).then(res => {
      let no = 0
      let sub = 0
      let che = 0
      let sav = 0
      let tobe = 0 // 待审核
      let inState = ''
      if (res.data.code === 0) {
        for (let item of res.data.list) {
          let m = new Material(item)
          this.applyMaterieList.push(m)
          if (item.status === 'noPass') {
            no = no + 1
          } else if (item.status === 'submit') {
            sub = sub + 1
          } else if (item.status === 'checked') {
            che = che + 1
          } else if (item.status === 'saved') {
            sav = sav + 1
          } else if (item.status === 'toBeAudited') {
            ++tobe
          }
        }
        this.applyMaterieAuditList = res.data.vrlist
        if (no > 0) {
          inState = 'noPass'
        } else if (tobe > 0) {
          inState = 'toBeAudited'
        } else if (sub > 0) {
          inState = 'submit'
        } else if (sav > 0) {
          inState = 'saved'
        } else if (che > 0) {
          inState = 'checked'
        }
        this.applyMaterielState = inState
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return 'hhhhh'
  }
  enbaleEdit (row) {
    row.disabled = false
  }
  saveWorkHour (row) {
    row.status = 'saved'
    Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKTIMESAVE_API}`, 'POST', row).then(res => {
      if (res.data.code === 0) {
        this.$message.success('数据保存成功!')
        this.getList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  goBack (flag, row) {
    row.status = 'noPass'
    if (flag === '报工工时') {
      this.timeGoBack(row)
    } else if (flag === '生产入库') {
      this.storageGoBack(row)
    } else if (flag === '物料领用') {
      this.materialGoBack(row)
    }
  }
  timeGoBack (row) {
    let params = Object.assign({}, row, {workShop: this.formHeader.workShop, inKjmDate: this.formHeader.inKjmDate})
    Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKTIMEBACK_API}`, 'POST', params).then(res => {
      if (res.data.code === 0) {
        this.$message.success('数据回退成功!')
        this.getList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  storageGoBack (row) {
    Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKSTORAGEBACK_API}`, 'POST', row).then(res => {
      if (res.data.code === 0) {
        this.$message.success('数据回退成功!')
        this.getList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  materialGoBack (row) {
    Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKMATERIALEBACK_API}`, 'POST', row).then(res => {
      if (res.data.code === 0) {
        this.$message.success('数据回退成功!')
        this.getList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }

  submitForm () {
    let that = this
    this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (!this.validateTime()) {
        return
      }
      Promise.all([that.timeSubmit(), that.storageSubmit(), that.materialSubmit()]).then((result) => {
        that.$message.success('提交成功')
        that.getList()
      })
    })
  }

  validateTime () {
    if (!this.workHourList || this.workHourList.length === 0) {
      this.$message.error('报工工时无数据，不可提交')
      return false
    }
    let sum = 0
    for (let item of this.workHourList) {
      if (!isNaN(item.confActivity2)) {
        sum += item.confActivity2
      }
    }
    if (sum <= 0) {
      this.$message.error('机器工时之和不能小于0')
      return false
    }
    return true
  }
  async timeSubmit () {
    let total = this.totalInstock
    let realTotal = this.realInAmount
    this.workHourList.forEach(function (item) {
      item.status = 'submit'
      item.countOutput = total
      item.realInAmount = realTotal
      item.countOutputUnit = 'L'
    })
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKTIMESUBMIT_API}`, 'POST', this.workHourList).then(res => {
      if (res.data.code !== 0) {
        this.$message.error('报工工时提交失败：' + res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return ''
  }
  async storageSubmit () {
    let total = this.totalInstock
    let realTotal = this.realInAmount
    this.inStockList.forEach(function (item) {
      item.status = 'submit'
      item.countOutput = total
      item.realInAmount = realTotal
      item.countOutputUnit = 'L'
    })
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKSTORAGESUBMIT_API}`, 'POST', this.inStockList).then(res => {
      if (res.data.code !== 0) {
        this.$message.error('生产入库提交失败：' + res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return ''
  }
  async materialSubmit () {
    this.applyMaterieList.forEach(function (item) { item.status = 'submit' })
    await Vue.prototype.$http(`${KJM_API.KJMAKINGCHECKMATERIALESUBMIT_API}`, 'POST', this.applyMaterieList).then(res => {
      if (res.data.code !== 0) {
        this.$message.error('物料领用提交失败：' + res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
    return ''
  }
  // 报工工时
  setReadyStatus (status) {
    this.readyState = status
  }
  // 入库状态
  setInStorageState (status) {
    this.inStorageState = status
  }
  // 物料状态
  setApplyMaterielState (status) {
    this.applyMaterielState = status
  }
}
</script>
<style lang="scss">
.input_bommom {
  width: 147px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
  border-bottom: solid 1px #D8D8D8;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 8px
}
</style>
