<template>
  <div class="main">
    <el-card class="newCard searchCard">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" size="small" label-width="85px">
            <el-form-item label="生产车间：">
              <p class="input_bommom">&nbsp;{{formHeader.workShopName ? formHeader.workShopName : ''}}</p>
            </el-form-item>
            <el-form-item label="曲房号：">
              <p class="input_bommom">&nbsp;{{formHeader.houseNoName ? formHeader.houseNoName : ''}}</p>
            </el-form-item>
            <el-form-item label="生产订单：">
              <p class="input_bommom">&nbsp;{{formHeader.orderNo ? formHeader.orderNo : ''}}</p>
            </el-form-item>
            <el-form-item label="生产品项：">
              <p class="input_bommom">&nbsp;{{(formHeader.materialCode ? formHeader.materialCode : '') + ' ' + (formHeader.materialName ? formHeader.materialName : '')}}</p>
            </el-form-item>
            <el-form-item label="生产日期：">
              <p class="input_bommom">&nbsp;{{formHeader.inKjmDate ? formHeader.inKjmDate : ''}}</p>
            </el-form-item>
            <el-form-item label="入罐号：">
              <p class="input_bommom">&nbsp;{{formHeader.inPotNoName ? formHeader.inPotNoName : ''}}</p>
            </el-form-item>
            <el-form-item label="连续蒸煮号：">
              <p>
                <el-select v-model="cookingNoId" :disabled="!isRedact" style="width:147px">
                  <el-option v-for="(item, index) in this.holderList" :key="index" :label="item.holderName" :value="item.holderName"></el-option>
                </el-select>
              </p>
            </el-form-item>
            <el-form-item label="提交人员：">
              <p class="input_bommom">&nbsp;{{formHeader.changer ? formHeader.changer : ''}}</p>
            </el-form-item>
            <el-form-item label="提交时间：">
              <p class="input_bommom">&nbsp;{{formHeader.changed? (formHeader.changed.indexOf('.')!==-1?formHeader.changed.substring(0, formHeader.changed.indexOf('.')):formHeader.changed):''}}</p>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div style="float:right; line-height:31px;font-size: 14px">
            <div style="float:left">
              <span class="point" :style="{'background': orderStatus === 'noPass'? 'red' : orderStatus === 'saved'? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align:right;">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-KojiMaking-index'})">返回</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('kjm:bean:material:update')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('kjm:bean:material:update')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('kjm:bean:material:update')">提交</el-button>
        </template>
      </el-row>
      <div class="toggleSearchBottom">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
    <div class="tableCard">
      <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" type="border-card" class="NewDaatTtabs" id="DaatTtabs" style="margin-top:15px">
        <el-tab-pane name="1">
          <span slot="label" class="spanview">
            <el-tooltip class="item" effect="dark"  :content="applyMaterielState === 'noPass'? '不通过':applyMaterielState === 'saved'? '已保存':applyMaterielState === 'submit' ? '已提交' : applyMaterielState === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': applyMaterielState === 'noPass'? 'red' : ''}">原料领用</el-button>
            </el-tooltip>
          </span>
          <Material ref="material" :isRedact="isRedact" :formHeader="formHeader" @setApplyMaterielState='setApplyMaterielState'></Material>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="spanview">
            <el-tooltip class="item" effect="dark"  :content="applyCraftState === 'noPass'? '不通过':applyCraftState === 'saved'? '已保存':applyCraftState === 'submit' ? '已提交' : applyCraftState === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': applyCraftState === 'noPass'? 'red' : ''}">工艺控制</el-button>
            </el-tooltip>
          </span>
          <Craft ref="craft" :isRedact="isRedact" :formHeader="formHeader" @setApplyCraftState='setApplyCraftState'></Craft>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" class="spanview">
            <el-button>异常记录</el-button>
          </span>
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="4">
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
import {KJM_API, BASICDATA_API} from '@/api/api'
import {headanimation} from '@/net/validate'
import Material from './common/material'
import Craft from './common/craft'
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
export default {
  name: 'boileIndex',
  data () {
    return {
      activeName: '1',
      formHeader: {},
      orderStatus: '',
      isRedact: false,
      formLabelWidth: '100px',
      applyMaterielState: '', // 物料状态
      applyCraftState: '', // 工艺状态
      holderList: [],
      cookingNoId: '', // 连续蒸煮号
      succmessage: '保存成功'
    }
  },
  watch: {
    'applyCraftState' () {
      console.log('status:' + this.applyCraftState)
    }
  },
  mounted () {
    headanimation(this.$)
    this.GetheadList()
    this.GetholderList()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    GetheadList () {
      this.$http(`${KJM_API.DOUHEAERLIST}`, `POST`, {orderHouseId: this.$store.state.common.ZQWorkshop.params.beanOrderHouseId, deptName: '煮豆'}, false, false, false).then((res) => {
        if (res.data.code === 0) {
          this.formHeader = res.data.headList[0]
          this.cookingNoId = this.formHeader.cookingNoName
          this.orderStatus = res.data.headList[0].beanStatus
          // this.$refs.material.GetrealTime(this.formHeader)
          // this.$refs.material.GetrealWheatTime(this.formHeader)
          this.$refs.material.getMaiholdList(this.formHeader)
          this.$refs.material.getDouholdList(this.formHeader)
          this.$refs.material.GetPuplList(this.formHeader)
          this.$refs.excrecord.GetequipmentType(this.formHeader.processId)
          this.$refs.excrecord.getDataList(this.formHeader.factory)
          if (this.orderStatus !== '已同步') {
            this.$refs.material.getList(this.formHeader)
            this.$refs.craft.getList(this.formHeader)
            this.$refs.excrecord.GetExcDate({
              order_id: this.formHeader.orderId,
              orderHouseId: this.formHeader.id,
              blongProc: this.formHeader.processId
            })
            this.$refs.textrecord.GetText({
              order_id: this.formHeader.orderId,
              orderHouseId: this.formHeader.orderHouseId,
              blongProc: this.formHeader.processId
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 表头 连续蒸煮号
    GetholderList () {
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {currPage: 1, holder_type: '008', pageSize: 9999, type: 'holder_type'}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.holderList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 表头更改
    UpdateHeader (str, resolve) {
      let holderNamestr = this.holderList.find(item => item.holderName === this.cookingNoId)['holderId']
      this.$http(`${KJM_API.DOUHEADER_API}`, 'POST', {cookingNoId: holderNamestr, orderHouseId: this.formHeader.orderHouseId}).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error('保存表头' + data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      })
    },
    UpdateHeaderCreator (str, resolve) {
      this.$http(`${KJM_API.DOUMATERHEADCREATOR_API}`, 'POST', {orderId: this.formHeader.orderId}).then(({data}) => {
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
      if (!this.cookingNoId || this.cookingNoId === '') {
        this.$message.error('请选择连续蒸煮号')
        return false
      }
      if (str === 'submit') {
        this.$set(this.formHeader, 'submitStatus', 'submit')
        if (!this.$refs.material.mainrules()) {
          return false
        }
        if (!this.$refs.craft.craftrules()) {
          return false
        }
        if (!this.$refs.excrecord.excrul()) {
          return false
        }
        this.succmessage = '提交成功'
      } else {
        this.$set(this.formHeader, 'submitStatus', 'saved')
      }
      let that = this
      let excSaveNet = new Promise((resolve, reject) => {
        that.$refs.excrecord.saveOrSubmitExc({
          orderId: that.formHeader.orderId,
          orderHouseId: that.formHeader.orderHouseId,
          blongProc: that.formHeader.processId
        }, str, resolve, reject)
      })
      let textSaveNet = new Promise((resolve, reject) => {
        that.$refs.textrecord.UpdateText({
          orderId: that.formHeader.orderId,
          orderHouseId: that.formHeader.orderHouseId,
          blongProc: that.formHeader.processId
        }, str, resolve, reject)
      })
      let net100 = new Promise((resolve, reject) => {
        that.UpdateHeader(str, resolve)
      })
      let net101 = new Promise((resolve, reject) => {
        that.UpdateHeaderCreator(str, resolve)
      })
      let net0 = new Promise((resolve, reject) => {
        that.$refs.material.savemains(resolve, reject)
      })
      let net1 = new Promise((resolve, reject) => {
        that.$refs.material.savewheats(resolve, reject)
      })
      let net2 = new Promise((resolve, reject) => {
        that.$refs.material.savepulps(resolve, reject)
      })
      let net3 = new Promise((resolve, reject) => {
        that.$refs.material.savestauts(resolve, reject)
      })
      let net99
      net99 = Promise.all([net100, net101, net0, net1, net2, net3, excSaveNet, textSaveNet])
      net99.then(function () {
        new Promise((resolve, reject) => {
          that.$refs.craft.updatezhu(resolve, reject)
        }).then(function () {
          let net5 = new Promise((resolve, reject) => {
            that.$refs.craft.updatelishui(resolve, reject)
          })
          let net6 = new Promise((resolve, reject) => {
            that.$refs.craft.updatezhengzhu(resolve, reject)
          })
          let net7 = new Promise((resolve, reject) => {
            that.$refs.craft.updatehunhe(resolve, reject)
          })
          Promise.all([net5, net6, net7]).then(function () {
            that.$message.success(that.succmessage)
            that.GetheadList()
            that.isRedact = false
          }).catch(() => {
            that.$message.error('网络请求失败，请刷新重试')
          })
        })
      })
    },
    setApplyMaterielState (status) {
      this.applyMaterielState = status
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    setApplyCraftState (status) {
      this.applyCraftState = status
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    }
  },
  components: {
    Material,
    Craft,
    ExcRecord,
    TextRecord
  }
}
</script>

<style>
.rowDel{display: none;}
</style>
<style lang="less" scoped>
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
.searchCard {
  .el-button--primary,.el-button--primary:focus{
    color: #000000;
    background-color: #FFFFFF;
    border-color: #D9D9D9;
  }
  .el-button--primary:hover{
    background-color: #1890FF;
    color: #FFFFFF
  }
  .el-button--primary:first-child{
    background-color: #1890FF;
    color: #FFFFFF;
    border-color: #1890FF;
  }
}
#DaatTtabs{
  border-radius: 15px;
  overflow: hidden;
}
.htitle {
  margin: 0 0 10px 0;
}
</style>
