<template>
<div>
  <div class="main">
    <el-card class="searchCard  newCard">
      <el-row type="flex">
        <el-col :span="21">
          <el-form :inline="true" :model="formHeader" size="small" label-width="82px" class="topform">
            <el-form-item label="生产工厂：">
              <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="formHeader.productDate" style="width: 180px"></el-date-picker>
            </el-form-item>
            <el-form-item label="提交人员：">
              <p class="el-input" style="width: 180px">{{formHeader.changer || ''}}</p>
            </el-form-item>
            <el-form-item label="提交时间：">
              <p class="el-input" style="width: 180px">{{formHeader.changed || ''}}</p>
            </el-form-item>
          </el-form>
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
          <el-button type="primary" size="small" @click="GetList">查询</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="isSerch && orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('sys:kjmOutMaterial:mySaveOrUpdate')">{{isRedact?'取消':'编辑'}}</el-button>
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
  <div class="main" style="padding-top: 0px" v-show="isSerch">
    <div class="tableCard">
      <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
        <i class="el-icon-caret-bottom"></i>
      </div>
    </div>
    <el-tabs @tab-click='tabClick' ref='tabs' v-model="activeName" id="OutTabs" class="NewDaatTtabs" type="border-card">
      <el-tab-pane name="1">
        <span slot="label" class="spanview">
          <el-tooltip class="item" effect="dark" :content="statusArr[0].status === 'noPass'? '不通过':statusArr[0].status === 'saved'? '已保存':statusArr[0].status === 'submit' ? '已提交' : statusArr[0].status === 'checked'? '通过':'未录入'" placement="top-start">
            <el-button :style="{'color': statusArr[0].status === 'noPass'? 'red' : ''}" style="font-size: 14px">申请订单</el-button>
          </el-tooltip>
        </span>
        <apply-order ref="applyorder" :isRedact="isRedact"  :orderAudit="orderAudit" :fumet="orderFumet" :SerchSapList="SerchSapList" @GetFunet="GetFunet"></apply-order>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label" class="spanview">
          <el-tooltip class="item" effect="dark" :content="statusArr[1].status === 'noPass'? '不通过':statusArr[1].status === 'saved'? '已保存':statusArr[1].status === 'submit' ? '已提交' : statusArr[1].status === 'checked'? '通过':'未录入'" placement="top-start">
            <el-button :style="{'color': statusArr[1].status === 'noPass'? 'red' : ''}" style="font-size: 14px">物料领用</el-button>
          </el-tooltip>
        </span>
        <materiel ref="materielref" :isRedact="isRedact" :fumet="fumet" :SerchSapList="SerchSapListM"></materiel>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label" class="spanview">
          <el-tooltip class="item" effect="dark" :content="statusArr[2].status === 'noPass'? '不通过':statusArr[2].status === 'saved'? '已保存':statusArr[2].status === 'submit' ? '已提交' : statusArr[2].status === 'checked'? '通过':'未录入'" placement="top-start">
            <el-button :style="{'color': statusArr[2].status === 'noPass'? 'red' : ''}" style="font-size: 14px">工时计算</el-button>
          </el-tooltip>
        </span>
        <man-hour ref="manhour" :isRedact="isRedact" :formHeader="formHeader"></man-hour>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
import {SYSTEMSETUP_API, BASICDATA_API, SQU_API} from '@/api/api'
import ApplyOrder from './applyOrder'
import Materiel from './material'
import ManHour from './manHour'
import {GetStatus} from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      isRedact: false,
      isSerch: false,
      activeName: '1',
      orderStatus: '',
      orderS: '',
      factory: [],
      workshop: [],
      formHeader: {
        factory: '',
        workShop: '',
        productDate: ''
      },
      SerchSapList: [],
      SerchSapListM: [],
      orderFumet: [],
      orderAudit: [],
      fumet: [],
      statusArr: [{status: ''}, {status: ''}, {status: ''}]
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  methods: {
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    },
    GetList () {
      if (!this.formHeader.factory) {
        this.$message.error('请选择工厂')
        return
      }
      if (!this.formHeader.workShop) {
        this.$message.error('请选择车间')
        return
      }
      if (!this.formHeader.productDate) {
        this.$message.error('请选择生产日期')
        return
      }
      this.$refs.materielref.getPot(this.formHeader)
      this.getMaterial(this.formHeader.factory)
      this.getMaterialM(this.formHeader.factory)
      this.GetFunet()
    },
    // 获取原汁信息
    GetFunet () {
      this.$http(`${SQU_API.SUM_FUMET_LIST_API}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.isSerch = false
          data.orderList.forEach((item, index) => {
            item.material = item.materialCode + ' ' + item.materialName
          })
          this.orderS = GetStatus(data.orderList)
          this.orderFumet = data.orderList
          this.orderAudit = data.orderAudit
          this.fumet = data.orderList
          if (data.orderList) {
            this.formHeader.changed = data.orderList[0].changed
            this.formHeader.changer = data.orderList[0].changer
          }
          let list1 = new Promise((resolve, reject) => {
            this.$refs.materielref.getMaterialList(this.formHeader, resolve, reject)
          })
          let list2 = new Promise((resolve, reject) => {
            this.$refs.manhour.GetTimeList(this.formHeader, resolve, reject)
          })
          Promise.all([list1, list2]).then(() => {
            this.GetOrderStatus()
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 订单状态
    GetOrderStatus () {
      this.statusArr[0].status = this.orderS
      this.statusArr[1].status = this.$refs.materielref.materialS
      this.statusArr[2].status = this.$refs.manhour.timeS
      this.orderStatus = GetStatus(this.statusArr)
      this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
      this.isSerch = true
    },
    // 保存or提交
    savedOrSubmitForm (str) {
      if (str === 'submit') {
        if (!this.$refs.materielref.materialRul()) {
          return
        }
      }
      let that = this
      let updateApplyorder = new Promise((resolve, reject) => {
        that.$refs.applyorder.UpdateOrder(str, resolve, reject)
      })
      let updateMaterial = new Promise((resolve, reject) => {
        that.$refs.materielref.updateMaterial(str, resolve, reject)
      })
      let UpdateTime = new Promise((resolve, reject) => {
        that.$refs.manhour.UpdateTime(str, resolve, reject)
      })
      if (str === 'submit') {
        let saveNet = Promise.all([updateApplyorder, updateMaterial, UpdateTime])
        saveNet.then(function () {
          let SubmitApplyorder = new Promise((resolve, reject) => {
            that.$refs.applyorder.UpdateOrder(str, resolve, reject, true)
          })
          let SubmitMaterial = new Promise((resolve, reject) => {
            that.$refs.materielref.updateMaterial(str, resolve, reject, true)
          })
          let SubmitTime = new Promise((resolve, reject) => {
            that.$refs.manhour.UpdateTime(str, resolve, reject, true)
          })
          let SubmitNet = Promise.all([SubmitApplyorder, SubmitMaterial, SubmitTime])
          SubmitNet.then(function () {
            that.isRedact = false
            that.$message.success('提交成功')
            that.GetList()
          }, err => {
            that.$message.error(err)
          })
        })
      } else {
        let saveNet = Promise.all([updateApplyorder, updateMaterial, UpdateTime])
        saveNet.then(function () {
          that.isRedact = false
          that.$message.success('保存成功')
          that.GetList()
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
    // 获取物料下拉
    getMaterial (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'YA_M_MATERIAL'}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.SerchSapList = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取物料下拉
    getMaterialM (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'YZ_ZUJIAN_MATERIAL'}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.SerchSapListM = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.formHeader.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.formHeader.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '压榨'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList[0]) {
              this.formHeader.workShop = data.typeList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  },
  computed: {},
  components: {
    ApplyOrder,
    Materiel,
    ManHour
  }
}
</script>

<style lang="scss" scoped>
</style>
