<template>
  <el-col>
    <div class="main">
      <el-card class="searchCard newCard" style="margin: 0">
        <el-row type="flex">
          <el-col :span="21">
            <form-header :formHeader="formHeader" :isRedact="isRedact" @updateProductDateCallback='updateProductDate'></form-header>
          </el-col>
          <el-col :span="3" >
            <div style="float:right; line-height:31px;font-size: 14px">
              <div style="float:left">
                <span class="point" :style="{'background': orderStatus === 'noPass'? 'red' : orderStatus === 'saved'? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
              </div>
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-FryWheat-index'})">返回</el-button>
            <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('wht:order:update')">{{isRedact?'取消':'编辑'}}</el-button>
          </template>
          <template v-if="isRedact" style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('wht:order:update')">保存</el-button>
            <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('sys:whtInStorage:submit')">提交</el-button>
          </template>
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
        <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="border-radius: 15px;overflow: hidden">
          <el-tab-pane name="1">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark" :content="readyState === 'noPass'? '不通过':readyState === 'saved'? '已保存':readyState === 'submit' ? '已提交' : readyState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': readyState === 'noPass'? 'red' : ''}">准备时间</el-button>
              </el-tooltip>
            </span>
            <ready-time ref="readytime" :isRedact="isRedact" :formHeader="formHeader" @SetReadyStatus="SetReadyStatus"></ready-time>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label"  class="spanview">
              <el-tooltip class="item" effect="dark" :content="readyState === 'noPass'? '不通过':readyState === 'saved'? '已保存':readyState === 'submit' ? '已提交' : readyState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': readyState === 'noPass'? 'red' : ''}">人员</el-button>
              </el-tooltip>
            </span>
            <worker ref="workerref" :isRedact="isRedact" :order="formHeader"></worker>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="spanview">
              <el-button>异常记录</el-button>
            </span>
            <exc-record ref="excrecord" :isRedact="isRedact" :order="formHeader"></exc-record>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark" :content="inStorageState === 'noPass'? '不通过':inStorageState === 'saved'? '已保存':inStorageState === 'submit' ? '已提交' : inStorageState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': inStorageState === 'noPass'? 'red' : ''}">生产入库</el-button>
              </el-tooltip>
            </span>
            <in-stock ref="instock" :isRedact="isRedact" :order="formHeader" @setInStorageState='setInStorageState' :inStorageState="inStorageState"></in-stock>
          </el-tab-pane>
          <el-tab-pane name="5">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark"  :content="applyMaterielState === 'noPass'? '不通过':applyMaterielState === 'saved'? '已保存':applyMaterielState === 'submit' ? '已提交' : applyMaterielState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': applyMaterielState === 'noPass'? 'red' : ''}">物料领用</el-button>
              </el-tooltip>
            </span>
            <apply-materiel ref="applymateriel" :isRedact="isRedact" :order="formHeader" @setApplyMaterielState='setApplyMaterielState' :applyMaterielState='applyMaterielState'></apply-materiel>
          </el-tab-pane>
          <el-tab-pane name="6">
            <span slot="label" class="spanview">
              <el-button>文本记录</el-button>
            </span>
            <text-record ref="textrecord" :isRedact="isRedact"></text-record>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-col>
</template>

<script>
import {WHT_API} from '@/api/api'
import { headanimation } from '@/net/validate'
import FormHeader from '@/views/components/formHeader'
import ReadyTime from '../common/readyTime'
import Worker from '@/views/components/worker'
import ExcRecord from '@/views/components/excRecord'
import InStock from '../common/inStock'
import ApplyMateriel from '../common/applyMateriel'
import TextRecord from '@/views/components/textRecord'
export default {
  name: 'dataEntryIndex',
  data () {
    return {
      orderStatus: '',
      isRedact: false,
      orderNo: '',
      productDate: '',
      workShop: '',
      formHeader: {
        orderNo: this.$store.state.common.FWorderNo,
        orderId: this.$store.state.common.FWorderId,
        factory: this.$store.state.common.FWfactoryid,
        factoryName: this.$store.state.common.FWfactoryName,
        workShop: this.$store.state.common.FWworkShop,
        workShopName: this.$store.state.common.FWworkShopName,
        // 'C6049059024F4EF08290AA40D80F1F4B',
        productLine: this.$store.state.common.FWproductLine,
        // '炒麦'
        productLineName: this.$store.state.common.FWproductLineName,
        // yyy-MM-dd
        productDate: `${this.$store.state.common.FWproductDate.substring(0, 4)}-${this.$store.state.common.FWproductDate.substring(4, 6)}-${this.$store.state.common.FWproductDate.substring(6, 8)}`
      },
      activeName: '1',
      readyState: '',
      // 生产入库状态
      inStorageState: '',
      // 物料申请状态
      applyMaterielState: ''
    }
  },
  mounted () {
    headanimation(this.$)
    this.orderNo = this.FWorderNo
    // yyyyMMdd
    this.productDate = this.FWproductDate
    this.workShop = this.FWworkShop
    this.GetOrderList()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    // 获取表头
    GetOrderList () {
      this.isRedact = false
      this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
        workShop: this.workShop,
        productDate: this.productDate,
        orderNo: this.orderNo
      }, false, false, false).then(({data}) => {
        this.formHeader = {}
        this.formHeader = data.list[0]
        this.orderStatus = data.list[0].orderStatus
        this.$refs.readytime.GetMachine(this.formHeader.productLine)
        this.$refs.excrecord.GetequipmentType(this.formHeader.productLine)
        this.$refs.excrecord.getDataList(this.formHeader.factory)
        this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory)
        this.$refs.workerref.getTree(this.formHeader.factory)
        this.$refs.workerref.GetProductShift(this.formHeader.factory)
        this.$refs.instock.getWheatDataList(this.formHeader.orderId)
        this.$refs.applymateriel.getMaterielDataList(this.formHeader.orderId)
        this.$refs.applymateriel.GetWheatCang(this.formHeader)
        if (this.orderStatus !== '已同步') {
          this.$refs.readytime.GetReadyList(this.formHeader.orderId)
          this.$refs.workerref.GetUserList(this.formHeader.orderId)
          this.$refs.excrecord.GetExcDate(this.formHeader.orderId)
          this.$refs.textrecord.GetText(this.formHeader.orderId)
        }
      })
    },
    // 修改表头
    UpdateformHeader (str, resolve) {
      let countOutput = 0
      this.$refs.instock.wheatDataList.forEach((item) => {
        if (item.delFlag === '0') {
          countOutput += parseInt(item.inPortWeight)
        }
      })
      this.formHeader.orderStatus = str
      this.formHeader.realOutput = countOutput + ''
      this.formHeader.countOutputUnit = 'KG'
      this.formHeader.countOutput = countOutput + ''
      this.formHeader.countMan = this.$refs.workerref.countMan
      this.formHeader.expAllDate = this.$refs.excrecord.ExcNum
      this.formHeader.germs = null
      if (str !== 'saved') {
        this.formHeader.operator = `${this.realName}(${this.userName})`
        this.formHeader.operDate = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString() + '-' + new Date().getDay().toString()
      }
      this.$http(`${WHT_API.WHTORDERUPDATE_API}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error('保存表头' + data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      })
    },
    // 保存 or 提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    savedOrSubmitForm (str) {
      // this.activeName = '1'
      if (str === 'submit') {
        if (!this.$refs.readytime.Readyrul()) {
          return false
        }
        if (!this.$refs.workerref.userrul()) {
          return false
        }
        if (!this.$refs.excrecord.excrul()) {
          return false
        }
        if (!this.$refs.instock.validate()) {
          return false
        }
        if (!this.$refs.applymateriel.validate()) {
          return false
        }
      }
      let that = this
      let net0 = new Promise((resolve, reject) => {
        that.UpdateformHeader(str, resolve)
      })
      let net1 = new Promise((resolve, reject) => {
        that.$refs.readytime.UpdateReady(str, resolve)
      })
      let net2 = new Promise((resolve, reject) => {
        that.$refs.readytime.UpdateMachine(str, resolve)
      })
      let net3 = new Promise((resolve, reject) => {
        that.$refs.workerref.UpdateUser(str, resolve)
      })
      let net4 = new Promise((resolve, reject) => {
        that.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve)
      })
      let net5 = new Promise((resolve, reject) => {
        that.$refs.textrecord.UpdateText(this.formHeader, str, resolve)
      })
      if (str === 'submit') {
        let net10 = Promise.all([net0, net1, net2, net3, net4, net5])
        net10.then(function () {
          let net6 = new Promise((resolve, reject) => {
            that.ProHours(resolve, reject)
          })
          let net7 = new Promise((resolve, reject) => {
            that.$refs.instock.submitIn(resolve)
          })
          let net8 = new Promise((resolve, reject) => {
            that.$refs.applymateriel.submitMateriel(resolve)
          })
          let net12 = Promise.all([net6, net7, net8])
          net12.then(() => {
            that.GetOrderList()
            that.$message.success('提交成功')
          })
        })
      } else {
        let instock = new Promise((resolve, reject) => {
          that.$refs.instock.saveIn(resolve)
        })
        let material = new Promise((resolve, reject) => {
          that.$refs.applymateriel.saveMateriel(resolve)
        })
        let net10 = Promise.all([net0, net1, net2, net3, net4, net5, instock, material])
        net10.then(function () {
          that.GetOrderList()
          that.$message.success('保存成功')
        })
      }
    },
    // 报工提交
    ProHours (resolve) {
      let data = [this.$refs.readytime.readyTimeDate, this.$refs.readytime.machineTimeData, this.$refs.workerref.WorkerDate, {
        orderId: this.formHeader.orderId,
        outputUnit: this.formHeader.outputUnit,
        realOutput: this.formHeader.realOutput,
        countOutput: this.formHeader.countOutput,
        countOutputUnit: this.formHeader.countOutputUnit,
        productDate: this.formHeader.productDate
      }]
      this.$http(`${WHT_API.MATERIELTIMESUBMIT_API}`, 'POST', data).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      })
    },
    // 准备时间状态
    SetReadyStatus (status) {
      this.readyState = status
      // 强制刷新tabs
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    // 入库状态
    setInStorageState (status) {
      this.inStorageState = status
      // 强制刷新tabs
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    // 物料状态
    setApplyMaterielState (status) {
      this.applyMaterielState = status
      // 强制刷新tabs
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    // 表头更改生产日期
    updateProductDate: function (dataStr) {
      if (dataStr) {
        let data = dataStr.replace(/-/g, '')
        this.productDate = data
        // 更新common store
        this.FWproductDate = data
      }
    }
  },
  computed: {
    FWworkShop: {
      get () { return this.$store.state.common.FWworkShop },
      set (val) { this.$store.commit('common/updateFWWorkShop', val) }
    },
    FWproductDate: {
      get () { return this.$store.state.common.FWproductDate },
      set (val) { this.$store.commit('common/updateFWProductDate', val) }
    },
    FWorderNo: {
      get () { return this.$store.state.common.FWorderNo },
      set (val) { this.$store.commit('common/updateFWOrderNo', val) }
    },
    FWorderId: {
      get () { return this.$store.state.common.FWorderId },
      set (val) { this.$store.commit('common/updateFWorderId', val) }
    }
  },
  components: {
    FormHeader,
    ReadyTime,
    Worker,
    ExcRecord,
    TextRecord,
    InStock,
    ApplyMateriel
  }
}
</script>

<style lang="scss">
</style>
