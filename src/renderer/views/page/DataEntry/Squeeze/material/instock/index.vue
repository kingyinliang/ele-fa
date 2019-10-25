<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" >
                <el-form-item label="生产工厂：" >
                  <el-select v-model="params.factoryId" style="width:150px" @change="changeOptions('factory')" >
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                  <el-select v-model="params.workshopId"  style="width:150px" @change="changeOptions('workshop')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="布浆线：">
                  <el-select v-model="params.productLineId" style="width:150px" @change="changeOptions('productline')" >
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in productlineList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="入罐日期：" >
                  <el-date-picker type="date" v-model="params.applyDate" value-format="yyyy-MM-dd" style="width:150px"></el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <!-- <el-col style='width:180px'>
              <div style="float:right; line-height:31px;font-size: 14px">
                <div style="float:left">
                  <span class="point" :style="{'background': orderStatus === 'noPass'? 'red' : orderStatus === 'saved'? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>订单状态：
                </div>
                <span :style="{'color': orderStatus === 'noPass'? 'red' : '' }">{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
              </div>
            </el-col> -->
          </el-row>
          <el-row class="rowButton" style="display:flex; justify-content:flex-end;">
            <el-button type="primary" size="small"  @click="getOrderList()"  v-if="isAuth('prs:inStorage:list')">查询</el-button>
            <el-button type="primary" size="small"  @click="setDisabled(!disabled)"  v-if="(isAuth('prs:inStorage:mySaveOrUpdate') || isAuth('prs:inStorage:submitToOrde')) && searched && orderStatus !== 'submit' &&  orderStatus !== 'checked'">{{disabled?'编辑':'返回'}}</el-button>
            <el-button type="primary" size="small"  @click="doSaveAction()"  v-if="isAuth('prs:inStorage:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' &&  orderStatus !== 'checked'">保存</el-button>
            <el-button type="primary" size="small"  @click="doSubmitAction()"  v-if="isAuth('prs:inStorage:submitToOrder') && searched && !disabled && orderStatus !== 'submit' &&  orderStatus !== 'checked'">提交</el-button>
          </el-row>
        </el-card>
        <el-row v-if="searched" style="margin-top:10px;background-color:#fff;padding-bottom:10px;">
          <el-col :span="5" style="">
            <el-row type="flex" justify="center" style="margin-top:20px">
              <div  class="pot-box">
                <div class="pot-box-header">
                  <span class="pot-box-title" style="margin-left:5px;">原汁罐</span>
                  <span class="pot-box-title" style="float:right;margin-right:5px;">{{isAvailable==='0'? '待入库': '入库中'}}</span>
                </div>
                <div class='pot-box-container img'>
                </div>
                <div class="pot-box-footer" >
                  <div class="pot-box-button"  v-if="!disabled && isAvailable === '0' && orderStatus !== 'submit' &&  orderStatus !== 'checked'" @click="inPotStart()">
                    <span class="pot-box-button-title">入罐开始</span>
                  </div>
                  <div class="pot-box-button-disabled"  v-else>
                    <span class="pot-box-button-title-disabled">入罐开始</span>
                  </div>
                  <div class="pot-box-button"  v-if="!disabled && isAvailable === '1' && orderStatus !== 'submit' &&  orderStatus !== 'checked'" @click="inPotEnd()">
                    <span class="pot-box-button-title" >入罐结束</span>
                  </div>
                  <div class="pot-box-button-disabled"  v-else>
                    <span class="pot-box-button-title-disabled" >入罐结束</span>
                  </div>
                </div>
              </div>
            </el-row>
          </el-col>
          <el-col :span="19">
            <el-row  style="margin-top:20px">
              <el-table header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" @row-dblclick="modifyRecord" ref='table'>
                <el-table-column label="日期" width='100'>
                  <template slot-scope="scope">
                     {{scope.row.inDate}}
                  </template>
                </el-table-column>
                <el-table-column label="原汁罐号" :show-overflow-tooltip="true" width='120'>
                  <template slot-scope="scope">
                    {{scope.row.potName}}
                  </template>
                </el-table-column>
                <el-table-column label="原汁批次" width='120' >
                  <template slot-scope="scope">
                    {{scope.row.batch}}
                  </template>
                </el-table-column>
                <el-table-column label="起始数">
                  <template slot-scope="scope">
                    {{scope.row.startAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="结束数">
                  <template slot-scope="scope">
                    {{scope.row.endAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="入罐数量">
                  <template slot-scope="scope">
                    {{scope.row.inAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="满罐数量">
                  <template slot-scope="scope">
                    {{scope.row.fullPotAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unit}}
                  </template>
                </el-table-column>
                <el-table-column label="混合罐类型" width="120">
                  <template slot-scope="scope">
                    {{scope.row.mixType}}
                  </template>
                </el-table-column>
                <el-table-column label="是否满罐" >
                  <template slot-scope="scope">
                    {{scope.row.fullPot==='1'?'是' : '否'}}
                  </template>
                </el-table-column>
                <el-table-column label="满罐日期" width="100">
                  <template slot-scope="scope">
                    {{scope.row.fulPotDate}}
                  </template>
                </el-table-column>
                <el-table-column label="操作人" width='140' >
                  <template slot-scope="scope">
                    {{scope.row.changer}}
                  </template>
                </el-table-column>
                <el-table-column label="备注" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{scope.row.remark}}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="500px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>入罐开始</span>
        </div>
        <div >
          <el-form :model="startForm"  :label-width="formLabelWidth" size="small" ref="startForm">
            <el-form-item label="原汁罐号：" required>
              <el-select @change="changeOptions('pot')"  v-model="startForm.potNo" value-key="holderId" placeholder="请选择" filterable style="width:220px" >
                <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批次：" required>
              <el-input v-model.trim="startForm.batch" style='width:220px'/>
            </el-form-item>
            <el-form-item label="起始数：" required>
              <el-input  type='number' v-model.number="startForm.startAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="混合罐类型：" required>
              <el-select v-model="startForm.mixType" placeholder="请选择" filterable style="width:220px" >
                <el-option label="正常" value="正常"></el-option>
                <el-option label="单用混合" value="单用混合"></el-option>
                <el-option label="共用混合" value="共用混合"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间：">
              <label>{{startForm.changed}}</label>
            </el-form-item>
            <el-form-item label="操作人：">
              <label>{{startForm.changer}}</label>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveStart()">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogFormVisible2" width="500px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>入罐结束</span>
        </div>
        <div>
          <el-form :model="endForm"  :label-width="formLabelWidth" size="small" ref="endForm">
            <el-form-item label="原汁罐号：" required>
              {{endForm.potName}}
            </el-form-item>
            <el-form-item label="批次：" required>
              {{endForm.batch}}
            </el-form-item>
            <el-form-item label="结束数：" required>
              <el-input  type='number' v-model.number="endForm.endAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="是否满罐：">
              <el-select v-model="endForm.fullPot" placeholder="请选择" filterable style="width:220px" >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="满罐数量：">
              <el-input  type='number' v-model.number="endForm.fullPotAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="满罐日期：">
              <el-date-picker type="date" v-model="endForm.fulPotDate" value-format="yyyy-MM-dd" style="width:220px"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：" >
              <el-input v-model.trim="endForm.remark" style='width:220px'/>
            </el-form-item>
            <el-form-item label="操作时间：" >
              <label>{{endForm.changed}}</label>
            </el-form-item>
            <el-form-item label="操作人：" >
              <label>{{endForm.changer}}</label>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible2 = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveEnd()">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogFormVisible3" width="500px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>入罐修改</span>
        </div>
        <div >
          <el-form :model="modifyForm"  :label-width="formLabelWidth" size="small" ref="modifyForm">
            <el-form-item label="原汁罐号：" required>
              <el-select @change="changeOptions('potModify')"  v-model="modifyForm.potNo" value-key="holderId" placeholder="请选择" filterable style="width:220px" >
                <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批次：" required>
              <el-input v-model.trim="modifyForm.batch" style='width:220px'/>
            </el-form-item>
            <el-form-item label="起始数：" required>
              <el-input  type='number' v-model.number="modifyForm.startAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="结束数：" required>
              <el-input  type='number' v-model.number="modifyForm.endAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="混合罐类型：" required>
              <el-select v-model="modifyForm.mixType" placeholder="请选择" filterable style="width:220px" >
                <el-option label="正常" value="正常"></el-option>
                <el-option label="单用混合" value="单用混合"></el-option>
                <el-option label="共用混合" value="共用混合"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否满罐：">
              <el-select v-model="modifyForm.fullPot" placeholder="请选择" filterable style="width:220px" >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="满罐数量：">
              <el-input  type='number' v-model.number="modifyForm.fullPotAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="满罐日期：">
              <el-date-picker type="date" v-model="modifyForm.fulPotDate" value-format="yyyy-MM-dd" style="width:220px"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：" >
              <el-input v-model.trim="modifyForm.remark" style='width:220px'/>
            </el-form-item>
            <el-form-item label="操作时间：">
              <label>{{modifyForm.changed}}</label>
            </el-form-item>
            <el-form-item label="操作人：">
              <label>{{modifyForm.changer}}</label>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible3 = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveModify()">保存</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {BASICDATA_API, SQU_API} from '@/api/api'
import {dateFormat} from '@/net/validate'
import {Vue, Component, Watch} from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class Index extends Vue {
  // 将common中的参数复制一份到本地
  params = JSON.parse(JSON.stringify(this.$store.state.common.SqueezeWorkshop))
  factoryList = []
  workshopList = []
  productlineList = []
  dataList = []
  potList = []
  isAvailable = '0'
  searched: boolean = false
  disabled: boolean = true
  dialogFormVisible:boolean = false
  dialogFormVisible2:boolean = false
  dialogFormVisible3:boolean = false
  formLabelWidth: string = '130px'
  startForm = {
    inDate: '',
    potNo: '',
    potName: '',
    batch: '',
    startAmount: 0,
    mixType: '',
    changed: '',
    changer: ''
  }
  endForm = {
    potNo: '',
    potName: '',
    batch: '',
    endAmount: 0,
    fullPot: '',
    fullPotAmount: 0,
    fulPotDate: '',
    remark: '',
    changed: '',
    changer: ''
  }
  modifyForm = {
    id: '',
    recordId: '',
    inDate: '',
    potNo: '',
    potName: '',
    batch: '',
    startAmount: 0,
    endAmount: 0,
    mixType: '',
    fullPot: '',
    fullPotAmount: 0,
    fulPotDate: '',
    remark: '',
    changed: '',
    changer: ''
  }
  mounted () {
    this.params.applyDate = dateFormat(new Date(), 'yyyy-MM-dd')
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.getProductLine(this.params.workshopId)
    this.getPot(this.params.workshopName)
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
  get orderStatus () {
    let status = ''
    let no = 0
    let sub = 0
    let che = 0
    let sav = 0
    this.dataList.forEach((item) => {
      if (item.status === 'noPass') {
        no = no + 1
      } else if (item.status === 'saved') {
        sav = sav + 1
      } else if (item.status === 'submit') {
        sub = sub + 1
      } else if (item.status === 'checked') {
        che = che + 1
      }
    })
    if (no > 0) {
      // 有一条数据不通过，则总状态为不通过
      status = 'noPass'
    } else if (sav > 0) {
      status = 'saved'
    } else if (sub > 0) {
      status = 'submit'
    } else if (che > 0) {
      status = 'checked'
    }
    return status
  }
  modifyRecord (row) {
    if (this.disabled || row.status === 'submit' || row.status === 'checked') {
      return
    }
    this.modifyForm = {
      id: row.id ? row.id : 'id',
      recordId: row.recordId ? row.recordId : 'record',
      inDate: row.inDate ? row.inDate : dateFormat(new Date(), 'yyyy-MM-dd'),
      potNo: row.potNo ? row.potNo : '',
      potName: row.potName ? row.potName : '',
      batch: row.batch ? row.batch : '',
      startAmount: row.startAmount ? row.startAmount : 0,
      endAmount: row.endAmount ? row.endAmount : 0,
      mixType: row.mixType ? row.mixType : '正常',
      fullPot: row.fullPot ? row.fullPot : '0',
      fullPotAmount: row.fullPotAmount ? row.fullPotAmount : 0,
      fulPotDate: row.fulPotDate ? row.fulPotDate : dateFormat(new Date(), 'yyyy-MM-dd'),
      remark: row.remark ? row.remark : '',
      changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
      changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
    }
    this.dialogFormVisible3 = true
  }
  saveModify () {
    if (this.modifyValidate()) {
      let matchedIndex = -1
      this.dataList.forEach((item, index) => { if (item.id === this.modifyForm.id) { matchedIndex = index } })
      if (matchedIndex < 0) {
        // 新增
        this.dataList.forEach((item, index) => { if (item.recordId === this.modifyForm.recordId) { matchedIndex = index } })
      }
      if (matchedIndex >= 0) {
        let record = this.dataList[matchedIndex]
        Object.assign(record, {
          batch: this.modifyForm.batch,
          inDate: this.modifyForm.inDate,
          potNo: this.modifyForm.potNo,
          potName: this.modifyForm.potName,
          startAmount: this.modifyForm.startAmount,
          mixType: this.modifyForm.mixType,
          endAmount: this.modifyForm.endAmount,
          inAmount: this.modifyForm.endAmount - this.modifyForm.startAmount,
          remark: this.modifyForm.remark,
          fullPot: this.modifyForm.fullPot,
          fullPotAmount: this.modifyForm.fullPotAmount,
          fulPotDate: this.modifyForm.fulPotDate,
          changed: this.modifyForm.changed,
          changer: this.modifyForm.changer
        })
        this.dataList.splice(matchedIndex, 1, record)
      }
      this.dialogFormVisible3 = false
    }
  }
  inPotStart () {
    this.startForm = {
      inDate: this.params.applyDate,
      potNo: '',
      potName: '',
      batch: '',
      startAmount: 0,
      mixType: '正常',
      changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
      changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
    }
    this.dialogFormVisible = true
  }
  saveStart () {
    if (this.startValidate()) {
      let recordId = Vue.prototype.uuid()
      let result = {
        recordId,
        factory: this.params.factoryId,
        workShop: this.params.workshopId,
        productLine: this.params.productLineId,
        batch: this.startForm.batch,
        inDate: this.startForm.inDate,
        potNo: this.startForm.potNo,
        potName: this.startForm.potName,
        startAmount: this.startForm.startAmount,
        mixType: this.startForm.mixType,
        changed: this.startForm.changed,
        changer: this.startForm.changer,
        delFlag: 0
      }
      this.dataList.push(result)
      this.dialogFormVisible = false
      this.isAvailable = '1'
    }
  }
  inPotEnd () {
    let startData = this.dataList.find((item, index) => index === this.dataList.length - 1)
    this.endForm = {
      potNo: startData.potNo,
      potName: startData.potName,
      batch: startData.batch,
      endAmount: startData.endAmount ? startData.endAmount : 0,
      fullPot: startData.fullPot ? startData.fullPot : '0',
      fullPotAmount: startData.fullPotAmount ? startData.fullPotAmount : 0,
      fulPotDate: startData.fulPotDate ? startData.fulPotDate : dateFormat(new Date(), 'yyyy-MM-dd'),
      remark: startData.remark ? startData.remark : '',
      changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
      changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
    }
    this.dialogFormVisible2 = true
  }
  saveEnd () {
    if (this.endValidate()) {
      this.isAvailable = '0'
      let startData = this.dataList.pop()
      if (startData) {
        Object.assign(startData, {
          endAmount: this.endForm.endAmount,
          inAmount: this.endForm.endAmount - startData.startAmount,
          remark: this.endForm.remark,
          fullPot: this.endForm.fullPot,
          fullPotAmount: this.endForm.fullPotAmount,
          fulPotDate: this.endForm.fulPotDate,
          changed: this.endForm.changed,
          changer: this.endForm.changer})
        this.dataList.push(startData)
      }
      this.dialogFormVisible2 = false
    }
  }
  startValidate () {
    if (this.startForm.potNo === '') {
      this.$message.error('原汁罐号不能为空')
      return false
    } else if (this.startForm.batch.length !== 10) {
      this.$message.error('批次长度必须为10')
      return false
    } else if (this.startForm.startAmount.toString() === '') {
      this.$message.error('起始数不能为空')
      return false
    }
    return true
  }
  endValidate () {
    if (this.endForm.endAmount.toString() === '') {
      this.$message.error('结束数不能为空')
      return false
    } else if (this.endForm.fullPot === '1' && this.endForm.fullPotAmount.toString() === '') {
      this.$message.error('满罐数量不能为空')
      return false
    } else if (this.endForm.fullPot === '1' && this.endForm.fulPotDate === '') {
      this.$message.error('满罐日期不能为空')
      return false
    }
    return true
  }
  modifyValidate () {
    if (this.modifyForm.potNo === '') {
      this.$message.error('原汁罐号不能为空')
      return false
    } else if (this.modifyForm.batch.length !== 10) {
      this.$message.error('批次长度必须为10')
      return false
    } else if (this.modifyForm.startAmount.toString() === '') {
      this.$message.error('起始数不能为空')
      return false
    } else if (this.modifyForm.endAmount.toString() === '') {
      this.$message.error('结束数不能为空')
      return false
    } else if (this.modifyForm.fullPot === '1' && this.modifyForm.fullPotAmount.toString() === '') {
      this.$message.error('满罐数量不能为空')
      return false
    } else if (this.modifyForm.fullPot === '1' && this.modifyForm.fulPotDate === '') {
      this.$message.error('满罐日期不能为空')
      return false
    }
    return true
  }
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
    } else if (flag === 'productline') {
      let item = this.productlineList.find(ele => ele.deptId === this.params.productLineId)
      this.params.productLineName = item ? item.deptName : ''
    } else if (flag === 'pot') {
      let item = this.potList.find(ele => ele.holderId === this.startForm.potNo)
      this.startForm.potName = item ? item.holderName : ''
    } else if (flag === 'potModify') {
      let item = this.potList.find(ele => ele.holderId === this.modifyForm.potNo)
      this.modifyForm.potName = item ? item.holderName : ''
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
  // 产线
  getProductLine (wid: string) {
    this.productlineList = []
    if (wid) {
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: wid, deptType: 'proLine'}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.productlineList = data.childList
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
  // 原汁罐
  getPot (wName: string) {
    let params = {
      type: 'holder_type',
      holder_type: '013',
      pageSize: 9999,
      workShopName: wName,
      currPage: 1
    }
    this.potList = []
    if (wName) {
      Vue.prototype.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.potList = res.data.page.list
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  setDisabled (flag: boolean) {
    this.disabled = flag
  }
  setStore (params) {
    this.$store.commit('common/updateSqueezeWorkshop', params)
  }
  getOrderList () {
    if (this.params.factoryId === '') {
      this.$message.error('请选择工厂')
      return
    }
    if (this.params.workshopId === '') {
      this.$message.error('请选择车间')
      return
    }
    if (this.params.productLineId === '') {
      this.$message.error('请选择布浆线')
      return
    }
    if (this.params.applyDate === null || this.params.applyDate === '') {
      this.$message.error('请选择入罐日期')
      return
    }
    // 保存选项值到common store
    this.setStore(this.params)
    this.searched = true
    let params = {
      factory: this.params.factoryId,
      workShop: this.params.workshopId,
      productLine: this.params.productLineId,
      created: this.params.applyDate
    }
    this.retrieveOrderList(params)
  }
  retrieveOrderList (params) {
    Vue.prototype.$http(`${SQU_API.MATERIAL_IN_LIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        this.dataList = res.data.list
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  async save () {
    let result = {code: 0, msg: ''}
    this.dataList.map(item => { if (item.status !== 'submit' && item.status !== 'checked') { item.status = 'saved' } })
    await Vue.prototype.$http(`${SQU_API.MATERIAL_IN_SAVE_API}`, `POST`, this.dataList).then((res) => {
      result = {code: res.data.code, msg: res.data.code === 0 ? '保存成功' : res.data.msg}
    }).catch(err => {
      result = {code: 1, msg: '保存失败：' + err}
    })
    return result
  }
  save2 () {
    let that = this
    that.dataList.map(item => { if (item.status !== 'submit' && item.status !== 'checked') { item.status = 'saved' } })
    return new Promise(function (resolve, reject) {
      let result = {code: 0, msg: ''}
      Vue.prototype.$http(`${SQU_API.MATERIAL_IN_SAVE_API}`, `POST`, that.dataList).then((res) => {
        result = {code: res.data.code, msg: res.data.code === 0 ? '保存成功' : res.data.msg}
        if (res.data.code === 0) {
          resolve(result)
        } else {
          reject(result)
        }
      }).catch(err => {
        result = {code: 1, msg: '保存失败：' + err}
        reject(result)
      })
    })
  }
  doSaveAction () {
    // Promise.resolve(this.save()).then((result) => {
    //   this.$message.success(result.msg)
    //   if (result.code === 0) {
    //     this.getOrderList()
    //   }
    // })
    let that = this
    this.save2().then((result : { code: number, msg: string }) => {
      that.$message.success(result.msg)
      that.getOrderList()
    }).catch((result: { code: number, msg: string }) => {
      that.$message.error(result.msg)
    })
  }
  async submit () {
    let result = {code: 0, msg: ''}
    this.dataList.map(item => { if (item.status !== 'checked') { item.status = 'submit' } })
    await Vue.prototype.$http(`${SQU_API.MATERIAL_IN_SUBMIT_API}`, `POST`, this.dataList).then((res) => {
      result = {code: res.data.code, msg: res.data.code === 0 ? '提交成功' : res.data.msg}
    }).catch(err => {
      result = {code: 1, msg: '提交失败：' + err}
    })
    return result
  }
  submit2 () {
    let that = this
    let result = {code: 0, msg: ''}
    that.dataList.map(item => { if (item.status !== 'checked') { item.status = 'submit' } })
    return new Promise(function (resolve, reject) {
      Vue.prototype.$http(`${SQU_API.MATERIAL_IN_SUBMIT_API}`, `POST`, that.dataList).then((res) => {
        result = {code: res.data.code, msg: res.data.code === 0 ? '提交成功' : res.data.msg}
        if (res.data.code === 0) {
          resolve(result)
        } else {
          reject(result)
        }
      }).catch(err => {
        result = {code: 1, msg: '提交失败：' + err}
        reject(result)
      })
    })
  }
  doSubmitAction () {
    // Promise.all([this.save(), this.submit()]).then((result) => {
    //   if (result[0].code === 0 && result[1].code === 0) {
    //     this.getOrderList()
    //   } else {
    //     this.$message.success('提交失败')
    //   }
    // })
    let that = this
    this.save2().then(() => this.submit2()).then((result : { code: number, msg: string }) => {
      that.$message.success(result.msg)
      that.getOrderList()
    }).catch((result : { code: number, msg: string }) => {
      that.$message.error(result.msg)
    })
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
    this.disabled = true
  }
  @Watch('params.factoryId')
  onFactoryValue (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.getWorkshop(newVal)
  }
  @Watch('params.workshopId')
  onChangeWorkshop (newVal: string, oldVal: string) {
    this.params.productLineId = ''
    this.params.productLineName = ''
    this.getProductLine(newVal)
    this.getPot(this.params.workshopName)
  }
}
</script>
<style lang="scss" >
.dialog__class{
  border-radius:6px 6px 0px 0px !important;
  .el-dialog__header{
    height:59px;
    background:rgba(24,144,255,1);
    border-radius:6px 6px 0px 0px;
    color: #fff;
    font-size:20px;
    .el-dialog__headerbtn .el-dialog__close{
      color: #fff
    }
  }
  .reqI{
    color: red;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/_common.scss';
.pot-box {
  width:217px;
  height:250px;
  border-radius:2px;
  border:1px solid rgba(232,232,232,1);
  .pot-box-header {
    height:40px;
    line-height:40px;
    background:rgba(235,235,235,1);
    border-radius:4px 4px 0px 0px;
    .pot-box-title {
      font-size:14px;
      font-family:PingFangSC-Medium;
      font-weight:500;color:rgba(0,0,0,0.65);
    }
  }
  .pot-box-container {
    width:120px;
    height:120px;
    margin:auto;
    margin-top:16px;
  }
  .img {
    background: url('~@/assets/img/sq_G1.png')
  }
  .pot-box-footer {
    margin-top:20px;
    display:flex;
    justify-content:center;
    .pot-box-button {
      width:72px;
      height:24px;
      border-radius:4px;
      border:1px solid rgba(0,0,0,0.25);
      text-align:center;
      cursor:pointer;
      margin-left: 4px;
      margin-right: 4px;
      &:hover{
        background:rgba(24,144,255,1);
      }
    }
    .pot-box-button-title {
      line-height:24px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#000;
      &:hover{
        color:#fff;
      }
    }
    .pot-box-button-disabled{
      width:72px;
      height:24px;
      border-radius:4px;
      border:1px solid rgba(0,0,0,0.25);
      text-align:center;
      cursor:pointer;
      margin-left: 4px;
      margin-right: 4px;
      color:rgba(0, 0, 0, 0.6);
      background:#F7F9FA;
      &:hover{
        cursor:not-allowed
      }
    }
    .pot-box-button-title-disabled {
      line-height:24px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.6);
    }
  }
}
.rowButton{
  button{
    margin: 0px 3px!important;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
