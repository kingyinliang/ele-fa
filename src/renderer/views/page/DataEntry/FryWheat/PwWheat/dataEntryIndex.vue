<template>
  <el-col>
    <div class="main">
      <el-card class="searchCard newCard" style="margin: 0">
        <el-row type="flex">
          <el-col :span="21">
            <form-header :formHeader="formHeader" :isRedact="isRedact" @updateProductDateCallback='updateProductDate' ></form-header>
          </el-col>
          <el-col :span="3" >
            <!-- <div>
              <span class="point" :style="{'background': orderStatus === 'noPass'? 'red': '#7ED321'}"></span>
              订单状态：
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">
                {{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}
              </span>
            </div> -->
            <div style="float:right; line-height:31px;font-size: 14px">
              <div style="float:left">
                <span class="point" :style="{'background': orderStatus === 'noPass'? 'red': '#7ED321'}"></span>订单状态：
              </div>
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-FryWheat-index'})">返回</el-button>
            <el-button type="primary" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('sys:whtPwMaterial:update')">{{isRedact?'取消':'编辑'}}</el-button>
          </template>
          <template v-if="isRedact && enableOpt" style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('sys:whtPwMaterial:update')">保存</el-button>
            <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('sys:whtPwMaterial:update')">提交</el-button>
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
        <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" id="DaatTtabs" class="NewDaatTtabs"  :before-leave='beforeLeave' type="border-card">
          <el-tab-pane name="1">
            <span slot="label">
              <el-tooltip class="item" effect="dark" :content="this.appyMaterielState === 'noPass'? '不通过':this.appyMaterielState === 'saved'? '已保存':this.appyMaterielState === 'submit' ? '已提交' : this.appyMaterielState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': this.appyMaterielState === 'noPass'? 'red' : ''}">物料领用</el-button>
              </el-tooltip>
            </span>
            <pw-apply-materiel ref="pwapplymateriel" :isRedact="isRedact" :order="formHeader" @updateOrderInfo="updateOrderInfo" @setAppyMaterielState='setAppyMaterielState' :appyMaterielState="appyMaterielState" ></pw-apply-materiel>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="spanview">
              <el-tooltip class="item" effect="dark" :content="this.readyState === 'noPass'? '不通过':this.readyState === 'saved'? '已保存':this.readyState === 'submit' ? '已提交' : this.readyState === 'checked'? '通过':'未录入'" placement="top-start">
                <el-button :style="{'color': readyState === 'noPass'? 'red' : ''}">工时录入</el-button>
              </el-tooltip>
            </span>
            <pw-time ref="pwtime" :isRedact="isRedact" :order="formHeader" @SetReadyStatus="SetReadyStatus"></pw-time>
          </el-tab-pane>
          <el-tab-pane name="3" >
            <span slot="label" class="spanview">
              <el-button>异常记录</el-button>
            </span>
            <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
          </el-tab-pane>
          <el-tab-pane name="4" >
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
import ExcRecord from '@/views/components/excRecord'
import PwTime from '../common/pwTime'
import PwApplyMateriel from '../common/pwApplyMateriel'
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
        orderNo: this.$store.state.common.PWorder.orderNo,
        orderId: this.$store.state.common.PWorder.orderId,
        factory: this.$store.state.common.FWfactoryid,
        factoryName: this.$store.state.common.FWfactoryName,
        workShop: this.$store.state.common.FWworkShop,
        workShopName: this.$store.state.common.FWworkShopName,
        productLine: this.$store.state.common.PWorder.productLine,
        productLineName: this.$store.state.common.PWorder.productLineName,
        // yyyy-MM-dd
        productDate: `${this.$store.state.common.PWorder.productDate.substring(0, 4)}-${this.$store.state.common.PWorder.productDate.substring(4, 6)}-${this.$store.state.common.PWorder.productDate.substring(6, 8)}`
      },
      activeName: '1',
      // save / submit 是否可用
      enableOpt: false,
      // 物料领用
      appyMaterielState: '',
      // 准备时间
      readyState: ''
    }
  },
  mounted () {
    headanimation(this.$)
    this.orderNo = this.PWorderNo
    // yyyyMMdd
    this.productDate = this.$store.state.common.PWorder.productDate
    this.workShop = this.FWworkShop
    this.GetOrderList()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    beforeLeave (activeName, oldActiveName) {
      if (!this.enableOpt && activeName !== '1') {
        this.$message({type: 'error', message: '请申请订单之后操作', duration: 1000})
        return false
      }
      return true
    },
    // 获取表头
    GetOrderList () {
      this.isRedact = false
      this.$refs.pwapplymateriel.GetWheatCangList(this.$store.state.common.FWfactoryid, this.$store.state.common.FWworkShop)
      if (this.orderNo) {
        // 有订单号
        this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
          workShop: this.workShop,
          productDate: this.productDate,
          orderNo: this.orderNo
        }).then(({data}) => {
          // 2018-06-27
          this.formHeader = data.list[0]
          this.orderStatus = data.list[0].orderStatus
          // console.log('this.formHeader', JSON.stringify(this.formHeader))
          this.$refs.pwapplymateriel.getMaterielDataList(this.formHeader.orderId)
          this.$refs.pwapplymateriel.getDictList(this.$store.state.common.FWfactoryid)
          this.$refs.pwtime.GetPwTimeList()
        })
      } else {
        this.$refs.pwapplymateriel.getDictList(this.$store.state.common.FWfactoryid)
      }
    },
    // 修改表头
    OrderUpdate (str, resolve) {
      let countOutput = 0
      this.$refs.pwapplymateriel.materielDataList.forEach((item) => {
        countOutput += parseInt(item.inStorageWeight)
      })
      this.formHeader.orderStatus = str
      this.formHeader.countOutputUnit = 'KG'
      this.formHeader.countOutput = countOutput + ''
      this.formHeader.realOutput = countOutput + ''
      this.formHeader.expAllDate = this.$refs.excrecord.ExcNum
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
    // 保存
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
      if (str === 'submit') {
        if (!this.$refs.pwtime.timerul()) {
          return false
        }
        if (!this.$refs.excrecord.excrul()) {
          return false
        }
        if (!this.$refs.pwapplymateriel.validate('submit')) {
          return false
        }
      }
      let that = this
      let net0 = new Promise((resolve, reject) => {
        that.OrderUpdate(str, resolve)
      })
      let net1 = new Promise((resolve, reject) => {
        that.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve)
      })
      let net3 = new Promise((resolve, reject) => {
        that.$refs.textrecord.UpdateText(this.formHeader, str, resolve)
      })
      let net4 = new Promise((resolve, reject) => {
        that.$refs.pwtime.PwTimeUpdate(str, resolve, reject)
      })
      if (str === 'submit') {
        let net10 = Promise.all([net0, net1, net3, net4])
        net10.then(function () {
          let net5 = new Promise((resolve, reject) => {
            that.$refs.pwapplymateriel.submitMateriel(resolve)
          })
          let net6 = new Promise((resolve, reject) => {
            that.Timeupdate(resolve)
          })
          let net12 = Promise.all([net5, net6])
          net12.then(() => {
            that.GetOrderList()
            that.$message.success('提交成功')
          })
        })
      } else {
        let net2 = new Promise((resolve, reject) => {
          that.$refs.pwapplymateriel.saveMateriel(resolve)
        })
        let net10 = Promise.all([net0, net1, net2, net3, net4])
        net10.then(function () {
          that.GetOrderList()
          that.$message.success('保存成功')
        })
      }
    },
    // 工时提交
    Timeupdate (resolve) {
      this.$http(WHT_API.PWMATERIELTIMESUBMIT_API, 'POST', [this.$refs.pwtime.pwTimeDate[0], {
        orderId: this.formHeader.orderId,
        outputUnit: this.formHeader.outputUnit,
        realOutput: this.formHeader.realOutput,
        countOutput: this.formHeader.countOutput,
        countOutputUnit: this.formHeader.countOutputUnit,
        productDate: this.formHeader.productDate
      }]).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      })
    },
    updateOrderInfo: function (orderInfo) {
      // 申请订单之后，订单号回写
      this.orderNo = orderInfo.orderNo
      // 更新common store
      this.PWorderNo = orderInfo.orderNo
      this.PWorderId = orderInfo.orderId
    },
    updateProductDate: function (dataStr) {
      if (dataStr) {
        let data = dataStr.replace(/-/g, '')
        this.productDate = data
        // 更新common store
        this.PWproductDate = data
      }
    },
    setAppyMaterielState: function (state) {
      this.appyMaterielState = state
      // 强制tabs刷新
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    // 准备时间状态
    SetReadyStatus (status) {
      this.readyState = status
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    }
  },
  watch: {
    'orderNo' (n, o) {
      // 申请订单之后触发全局刷新
      if (n) {
        // 有订单号情况下才可用
        this.enableOpt = true
      }
      this.GetOrderList()
    }
  },
  computed: {
    PWorderNo: {
      get () { return this.$store.state.common.PWorder.orderNo },
      set (val) { this.$store.commit('common/updatePWorderNo', val) }
    },
    PWorderId: {
      get () { return this.$store.state.common.PWorder.orderId },
      set (val) { this.$store.commit('common/updatePWorderId', val) }
    },
    FWworkShop: {
      get () { return this.$store.state.common.FWworkShop },
      set (val) { this.$store.commit('common/updateFWWorkShop', val) }
    },
    PWproductDate: {
      get () { return this.$store.state.common.PWorder.productDate },
      set (val) { this.$store.commit('common/updatePWproductDate', val) }
    }
  },
  components: {
    FormHeader,
    ExcRecord,
    TextRecord,
    PwTime,
    PwApplyMateriel
  }
}
</script>

<style lang="scss">
#DaatTtabs{
  h3{
    font-size: 16px;
    font-weight: bold;
    float: left;
  }
  border-top: 1px solid #e8e8e8;
  span{
    .el-button{
      background-color: inherit;
      font-size: 16px;
      padding: 0;
      border: none;
    }
  }
  .el-tabs__item{
    height: 40px;
    line-height: 40px;
  }
  table{
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .notNull{
    color: red;
  }
  .el-table .warning-row:hover>td{
    background: #bbbbbb!important;
    background-color: #bbbbbb!important;
  }
  .el-table .warning-row>td{
    background: #bbbbbb!important;
    background-color: #bbbbbb!important;
  }
  // .el-input--small .el-input__inner { height: 22px; line-height: 22px; }
}
.required{
  position: relative;
  padding-left: 15px;
  .reqI{
    color: red;
    position: absolute;
    left: 0;
    line-height: 32px;
  }
}
</style>
