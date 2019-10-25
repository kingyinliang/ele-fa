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
            <el-form-item label="工序：">
              <p class="input_bommom">&nbsp;看曲</p>
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
              <p class="input_bommom">&nbsp;{{formHeader.cookingNoName ? formHeader.cookingNoName : ''}}</p>
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
            <div style="float: right;">
              <span class="point" :style="{'background': orderStatus === 'noPass'? 'red' : orderStatus === 'saved'? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
              <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="$router.push({ path: '/DataEntry-KojiMaking-index'})">返回</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('kjm:guard:tech:update')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('kjm:guard:tech:update')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('kjm:guard:tech:update')">提交</el-button>
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
            <el-tooltip class="item" effect="dark"  :content="applyCraftState === 'noPass'? '不通过':applyCraftState === 'saved'? '已保存':applyCraftState === 'submit' ? '已提交' : applyCraftState === 'checked'? '通过':'未录入'" placement="top-start">
              <el-button :style="{'color': applyCraftState === 'noPass'? 'red' : ''}">工艺控制</el-button>
            </el-tooltip>
          </span>
          <Craft ref="craft" :isRedact="isRedact" :formHeader="formHeader" :submitStatus="submitStatus" @setApplyCraftState='setApplyCraftState'></Craft>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="spanview">
            <el-button>异常记录</el-button>
          </span>
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="3">
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
import {headanimation} from '@/net/validate'
import Craft from './common/craft'
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
export default {
  name: 'look',
  data () {
    return {
      activeName: '1',
      formHeader: {},
      orderStatus: '已同步',
      isRedact: false,
      submitStatus: 'saved',
      applyCraftState: '', // 工艺状态
      succmessage: '保存成功'
    }
  },
  mounted () {
    headanimation(this.$)
    this.GetheadList()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    GetheadList () {
      this.$http(`${KJM_API.DOUHEAERLIST}`, `POST`, {orderHouseId: this.$store.state.common.ZQWorkshop.params.lookOrderHouseId, deptName: '看曲'}, false, false, false).then((res) => {
        if (res.data.code === 0) {
          this.formHeader = res.data.headList[0]
          this.orderStatus = res.data.headList[0].guardStatus
          // console.log(this.formHeader)
          this.$refs.excrecord.GetequipmentType(this.formHeader.processId)
          this.$refs.excrecord.getDataList(this.formHeader.factory)
          if (this.orderStatus !== '已同步') {
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
    // 保存
    savedOrSubmitForm (str) {
      // 提交
      if (str === 'submit') {
        this.submitStatus = 'submit'
        if (!this.$refs.craft.Readyrules()) {
          return false
        }
        if (!this.$refs.excrecord.excrul()) {
          return false
        }
        this.succmessage = '提交成功'
      } else {
        this.submitStatus = 'saved'
      }
      let that = this
      new Promise((resolve, reject) => {
        that.$refs.craft.savesmain(resolve, reject)
      }).then(function () {
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
        let net101 = new Promise((resolve, reject) => {
          that.UpdateHeaderCreator(str, resolve)
        })
        let net1 = new Promise((resolve, reject) => {
          that.$refs.craft.savestauts(resolve, reject)
        })
        let net2 = new Promise((resolve, reject) => {
          that.$refs.craft.savesecond(resolve, reject)
        })
        let net3 = new Promise((resolve, reject) => {
          that.$refs.craft.savefeel(resolve, reject)
        })
        Promise.all([net1, net2, net3, excSaveNet, textSaveNet, net101]).then(function () {
          that.$message.success(that.succmessage)
          that.GetheadList()
          that.isRedact = false
        }).catch(() => {
          that.$message.error('网络请求失败，请刷新重试')
        })
      })
    },
    setApplyCraftState (status) {
      this.applyCraftState = status
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    }
  },
  components: {
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
