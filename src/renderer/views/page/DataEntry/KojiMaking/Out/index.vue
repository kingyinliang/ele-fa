<template>
  <div>
    <div class="main">
      <el-card class="searchCard  newCard">
        <el-row type="flex">
          <el-col>
            <form-head :formHeader="formHeader" :isRedact="isRedact" :CraftControlStatus="CraftControlStatus"></form-head>
          </el-col>
          <el-col style="width:180px;font-size: 14px;line-height: 32px">
            <div style="float: right;">
              <span class="point" :style="{'background': orderStatus === 'noPass'? 'red' : orderStatus === 'saved'? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-KojiMaking-index'})">返回</el-button>
            <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('sys:kjmOutMaterial:mySaveOrUpdate')">{{isRedact?'取消':'编辑'}}</el-button>
          </template>
          <template v-if="isRedact" style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('sys:kjmOutMaterial:mySaveOrUpdate')">保存</el-button>
            <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('sys:kjmOutMaterial:mySaveOrUpdate')">提交</el-button>
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
      </div>
      <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" id="OutTabs" class="NewDaatTtabs" type="border-card">
        <el-tab-pane name="1">
          <span slot="label" class="spanview">
            <el-tooltip class="item" effect="dark" :content="Materielstatus === 'noPass'? '不通过':Materielstatus === 'saved'? '已保存':Materielstatus === 'submit' ? '已提交' : Materielstatus === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': Materielstatus === 'noPass'? 'red' : ''}">原料领用</el-button>
            </el-tooltip>
          </span>
          <meateriel ref="meateriel" :isRedact="isRedact" :formHeader="formHeader" @GetMaterielStatus="GetMaterielStatus" @SetMeaterielNum="SetMeaterielNum"></meateriel>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="spanview">
            <el-tooltip class="item" effect="dark" :content="InStockStatus === 'noPass'? '不通过':InStockStatus === 'saved'? '已保存':InStockStatus === 'submit' ? '已提交' : InStockStatus === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': InStockStatus === 'noPass'? 'red' : ''}">生产入库</el-button>
            </el-tooltip>
          </span>
          <in-stock ref="outinstorage" :isRedact="isRedact" :formHeader="formHeader" @GetInStockStatus="GetInStockStatus"></in-stock>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" class="spanview">
            <el-tooltip class="item" effect="dark" :content="CraftControlStatus === 'noPass'? '不通过':CraftControlStatus === 'saved'? '已保存':CraftControlStatus === 'submit' ? '已提交' : CraftControlStatus === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': CraftControlStatus === 'noPass'? 'red' : ''}">工艺控制</el-button>
            </el-tooltip>
          </span>
          <craft-control ref="outtech" :isRedact="isRedact" :formHeader="formHeader" @GetCraftControlStatus="GetCraftControlStatus"></craft-control>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label" class="spanview">
            <el-button>异常记录</el-button>
          </span>
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label" class="spanview">
            <el-button>文本记录</el-button>
          </span>
          <text-record ref="textrecord" :isRedact="isRedact"></text-record>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {KJM_API} from '@/api/api'
import { headanimation } from '@/net/validate'
import FormHead from './Outcomponents/formHead'
import Meateriel from './Outcomponents/materiel'
import InStock from './Outcomponents/inStock'
import CraftControl from './Outcomponents/craftControl'
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
export default {
  name: 'index',
  data () {
    return {
      isRedact: false,
      formHeader: {},
      MeaterielNum: 0,
      orderStatus: '',
      activeName: '1',
      Materielstatus: '',
      InStockStatus: '',
      // 工艺控制的页签状态
      CraftControlStatus: ''
    }
  },
  mounted () {
    headanimation(this.$)
    this.GetOrderList()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    // 获取表头
    GetOrderList () {
      this.$http(`${KJM_API.FORMHEAD_API}`, 'POST', {
        id: this.ZQWorkshop.params.outOrderHouseId
      }, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.isRedact = false
          this.formHeader = data.list[0]
          this.orderStatus = data.list[0].outStatus
          this.$refs.meateriel.GetBrineTankNo(this.formHeader)
          this.$refs.meateriel.GetBrine(this.formHeader.factory)
          this.$refs.outinstorage.GetThreeNum(this.formHeader)
          this.$refs.outinstorage.GetParams(this.formHeader.factory)
          this.$refs.outtech.selectUser(this.formHeader.prolineId)
          this.$refs.outtech.GetTechList(this.formHeader)
          this.$refs.excrecord.GetequipmentType(this.formHeader.prolineId)
          this.$refs.excrecord.getDataList(this.formHeader.factory)
          if (this.orderStatus !== '已同步') {
            this.$refs.meateriel.GetmaterielDate(this.formHeader)
            this.$refs.outinstorage.GetOutInStorage(this.formHeader)
            this.$refs.excrecord.GetExcDate({
              order_id: this.formHeader.orderId,
              orderHouseId: this.formHeader.id,
              blongProc: this.formHeader.prolineId
            })
            this.$refs.textrecord.GetText({
              order_id: this.formHeader.orderId,
              orderHouseId: this.formHeader.id,
              blongProc: this.formHeader.prolineId
            })
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 修改表头
    UpdateOrderHead (str, resolve, reject) {
      this.formHeader.outStatus = str
      this.$http(`${KJM_API.FORMHEADUPDATE_API}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          this.$message.error('保存表头' + data.msg)
          if (reject) {
            reject('保存表头' + data.msg)
          }
        }
      })
    },
    // 保存
    savedOrSubmitForm (str) {
      if (str === 'submit') {
        if (!this.$refs.meateriel.saveRul()) {
          return false
        }
        if (!this.$refs.outinstorage.InStockRul()) {
          return false
        }
        if (!this.$refs.excrecord.excrul()) {
          return false
        }
      }
      let that = this
      let excSaveNet = new Promise((resolve, reject) => {
        that.$refs.excrecord.saveOrSubmitExc({
          orderId: that.formHeader.orderId,
          orderHouseId: that.formHeader.id,
          blongProc: that.formHeader.prolineId
        }, str, resolve, reject)
      })
      let textSaveNet = new Promise((resolve, reject) => {
        that.$refs.textrecord.UpdateText({
          orderId: that.formHeader.orderId,
          orderHouseId: that.formHeader.id,
          blongProc: that.formHeader.prolineId
        }, str, resolve, reject)
      })
      let OrderHeadSaveNet = new Promise((resolve, reject) => {
        that.UpdateOrderHead(str, resolve, reject)
      })
      if (str === 'submit') {
        let saveNet = Promise.all([OrderHeadSaveNet, excSaveNet, textSaveNet])
        saveNet.then(function () {
          let meaterielSubmit = new Promise((resolve, reject) => {
            that.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject)
          })
          let InstockSubmit = new Promise((resolve, reject) => {
            that.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject)
          })
          let submitNet = Promise.all([meaterielSubmit, InstockSubmit])
          submitNet.then(function () {
            that.GetOrderList()
            that.$message.success('提交成功')
          }, err => {
            that.$message.error(err)
          })
        })
      } else {
        let meaterielSave = new Promise((resolve, reject) => {
          that.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject)
        })
        let InstockSave = new Promise((resolve, reject) => {
          that.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject)
        })
        let saveNet = Promise.all([OrderHeadSaveNet, meaterielSave, InstockSave, excSaveNet, textSaveNet])
        saveNet.then(function () {
          that.GetOrderList()
          that.$message.success('保存成功')
        }, err => {
          that.$message.error(err)
        })
      }
    },
    // 提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    // 原料领用状态
    GetMaterielStatus (status) {
      this.Materielstatus = status
      // this.$forceUpdate()
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    SetMeaterielNum (num) {
      // this.$refs.outtech.GetsaltWaterUsed(num)
      this.$refs.outinstorage.setBrineNum(num)
    },
    // 生产入库状态
    GetInStockStatus (status) {
      this.InStockStatus = status
      // this.$forceUpdate()
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    // 工艺控制状态
    GetCraftControlStatus (status) {
      this.CraftControlStatus = status
      // this.$forceUpdate()
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    }
  },
  computed: {
    ZQWorkshop: {
      get () { return this.$store.state.common.ZQWorkshop }
    }
  },
  components: {
    FormHead,
    Meateriel,
    InStock,
    CraftControl,
    ExcRecord,
    TextRecord
  }
}
</script>

<style scoped>

</style>
