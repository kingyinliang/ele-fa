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
                <el-form-item label="领用日期：" >
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
            <el-button type="primary" size="small"  @click="getOrderList()"  v-if="isAuth('prs:material:list')">查询</el-button>
            <el-button type="primary" size="small"  @click="setDisabled(!disabled)"  v-if="isAuth('prs:material:mySaveOrUpdate') && searched && orderStatus !== 'submit' &&  orderStatus !== 'checked'">{{disabled?'编辑':'返回'}}</el-button>
            <el-button type="primary" size="small"  @click="save()"  v-if="isAuth('prs:material:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' &&  orderStatus !== 'checked'">保存</el-button>
            <el-button type="primary" size="small"  @click="submit()"  v-if="isAuth('prs:material:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' &&  orderStatus !== 'checked'">提交</el-button>
          </el-row>
        </el-card>
        <el-row v-if="searched" style="margin-top:10px;background-color:#fff">
          <el-col :span="24">
            <el-row type="flex" justify="center" style="margin-top:20px">
              <div  class="pot-box"  v-for="(item, index) in sdList" :key="index" >
                <div class="pot-box-header">
                  <span class="pot-box-title" style="margin-left:5px;">{{item.deviceName}}</span>
                  <span class="pot-box-title" style="float:right;margin-right:5px;">{{availableMap.get(item.deviceId)==='0'?'待领用':availableMap.get(item.deviceId)==='1'?'领用中':'不可用'}}</span>
                </div>
                <div class='pot-box-container img'>
                </div>
                <div class="pot-box-footer" >
                  <div class="pot-box-button"  v-if="!disabled && availableMap.get(item.deviceId)==='0' && orderStatus !== 'submit' && orderStatus !== 'checked'" @click="inPotStart(item.deviceId, item.deviceName)">
                    <span class="pot-box-button-title">入罐开始</span>
                  </div>
                  <div class="pot-box-button-disabled"  v-else>
                    <span class="pot-box-button-title-disabled">入罐开始</span>
                  </div>
                  <div class="pot-box-button"  v-if="!disabled && availableMap.get(item.deviceId)==='1' && orderStatus !== 'submit' && orderStatus !== 'checked'" @click="inPotEnd(item.deviceId, item.deviceName)">
                    <span class="pot-box-button-title" >入罐结束</span>
                  </div>
                  <div class="pot-box-button-disabled"  v-else>
                    <span class="pot-box-button-title-disabled" >入罐结束</span>
                  </div>
                </div>
              </div>
              <!-- <div  class="pot-box">
                <div class="pot-box-header">
                  <span class="pot-box-title" style="margin-left:5px;">2#暂存罐</span>
                  <span class="pot-box-title" style="float:right;margin-right:5px;">领用中</span>
                </div>
                <div class='pot-box-container img'>
                </div>
                <div class="pot-box-footer" >
                  <div class="pot-box-button" @click="inPotStart()">
                    <span class="pot-box-button-title" >入罐开始</span>
                  </div>
                  <div class="pot-box-button" @click="inPotEnd()">
                    <span class="pot-box-button-title"  >入罐结束</span>
                  </div>
                </div>
              </div> -->
            </el-row>
            <el-row>
              <el-table header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" @row-dblclick="modifyRecord">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column label="布浆线" :show-overflow-tooltip="true" >
                  <template slot-scope="scope" width="120">
                    {{scope.row.productLineName}}
                  </template>
                </el-table-column>
                <el-table-column label="暂存罐" :show-overflow-tooltip="true" width="120">
                  <template slot-scope="scope">
                    {{scope.row.storagePotName}}
                  </template>
                </el-table-column>
                <el-table-column label="发酵罐号" :show-overflow-tooltip="true" width="120">
                  <template slot-scope="scope">
                    {{scope.row.fermentPotName}}
                  </template>
                </el-table-column>
                <el-table-column label="批次" :show-overflow-tooltip="true" width="120" >
                  <template slot-scope="scope">
                    {{scope.row.batch}}
                  </template>
                </el-table-column>
                <el-table-column label="发酵剩余量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.remainAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="起始数" >
                  <template slot-scope="scope">
                    {{scope.row.startAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="终止数" >
                  <template slot-scope="scope">
                    {{scope.row.endAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="打料数" >
                  <template slot-scope="scope">
                    {{scope.row.amount}}
                  </template>
                </el-table-column>
                <el-table-column label="暂存剩余量" width="100">
                  <template slot-scope="scope">
                    {{scope.row.storageAmount}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" >
                  <template slot-scope="scope">
                    {{scope.row.unit}}
                  </template>
                </el-table-column>
                <el-table-column label="备注" >
                  <template slot-scope="scope">
                    {{scope.row.remark}}
                  </template>
                </el-table-column>
                <el-table-column label="操作时间" width='160' >
                  <template slot-scope="scope">
                    {{scope.row.changed}}
                  </template>
                </el-table-column>
                <el-table-column label="操作人" width='140'>
                  <template slot-scope="scope">
                    {{scope.row.changer}}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="500px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>{{startForm.deviceName}}开始</span>
        </div>
        <div >
          <el-form :model="startForm"  :label-width="formLabelWidth" size="small" ref="startForm">
            <el-form-item label="领用发酵罐：" required>
              <el-select @change="changeOptions('fermentPotStart')"  v-model="startForm.fermentPotNo" value-key="holderId" placeholder="请选择" filterable style="width:220px" >
                <el-option v-for="(item, index) in fermentPotList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批次：" required>
              <el-input v-model.trim="startForm.batch" style='width:220px'/>
            </el-form-item>
            <el-form-item label="发酵罐剩余量：">
              <el-input type='number' v-model.number="startForm.remainAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="起始数(方)：" required>
              <el-input  type='number' v-model.number="startForm.startAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="暂存量(L)：" >
              <el-input  type='number' v-model.number="startForm.storageAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="对应布浆线：">
              <label>{{startForm.productLineName}}</label>
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
          <span>{{endForm.deviceName}}结束</span>
        </div>
        <div>
          <el-form :model="endForm"  :label-width="formLabelWidth" size="small" ref="endForm">
            <el-form-item label="领用发酵罐：" required>
              {{endForm.fermentPotName}}
            </el-form-item>
            <el-form-item label="批次：" required>
              {{endForm.batch}}
            </el-form-item>
            <el-form-item label="发酵罐剩余量：">
              {{endForm.remainAmount}}
            </el-form-item>
            <el-form-item label="打料结束数(L)：" required>
              <el-input  type='number' v-model.number="endForm.endAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="对应布浆线：">
              <label>{{endForm.productLineName}}</label>
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
        <div>
          <el-form :model="modifyForm"  :label-width="formLabelWidth" size="small" ref="modifyForm">
            <el-form-item label="领用发酵罐：" required>
              <el-select @change="changeOptions('fermentPotModify')"  v-model="modifyForm.fermentPotNo" value-key="holderId" placeholder="请选择" filterable style="width:220px" >
                <el-option v-for="(item, index) in fermentPotList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批次：" required>
              <el-input v-model.trim="modifyForm.batch" style='width:220px'/>
            </el-form-item>
            <el-form-item label="发酵罐剩余量：">
              <el-input type='number' v-model.number="modifyForm.remainAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="起始数(方)：" required>
              <el-input  type='number' v-model.number="modifyForm.startAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="打料结束数(L)：" required>
              <el-input  type='number' v-model.number="modifyForm.endAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="暂存量(L)：" >
              <el-input  type='number' v-model.number="modifyForm.storageAmount" style='width:220px'/>
            </el-form-item>
            <el-form-item label="备注：" >
              <el-input v-model.trim="modifyForm.remark" style='width:220px'/>
            </el-form-item>
            <el-form-item label="对应布浆线：">
              <label>{{modifyForm.productLineName}}</label>
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
  // 暂存罐
  sdList = []
  availableMap = new Map<string, string>()
  matchedMap = new Map<string, string>()
  // 发酵罐
  fermentPotList = []
  searched: boolean = false
  disabled: boolean = true
  dialogFormVisible:boolean = false
  dialogFormVisible2:boolean = false
  dialogFormVisible3:boolean = false
  formLabelWidth: string = '130px'
  startForm = {
    deviceId: '',
    deviceName: '',
    fermentPotNo: '',
    fermentPotName: '',
    orderId: '',
    batch: '',
    remainAmount: 0,
    remainAmountUnit: 'L',
    startAmount: 0,
    storageAmount: 0,
    productLine: '',
    productLineName: '',
    changed: '',
    changer: ''
  }
  endForm = {
    deviceId: '',
    deviceName: '',
    fermentPotNo: '',
    fermentPotName: '',
    orderId: '',
    batch: '',
    remainAmount: 0,
    endAmount: 0,
    productLine: '',
    productLineName: '',
    remark: '',
    changed: '',
    changer: ''
  }
  modifyForm = {
    id: '',
    recordId: '',
    deviceId: '',
    deviceName: '',
    fermentPotNo: '',
    fermentPotName: '',
    orderId: '',
    batch: '',
    remainAmount: 0,
    remainAmountUnit: 'L',
    startAmount: 0,
    storageAmount: 0,
    endAmount: 0,
    remark: '',
    productLine: '',
    productLineName: '',
    changed: '',
    changer: ''
  }
  // dataRule = {
  //   fermentPotNo: [
  //     {required: true, message: '必填', trigger: 'blur'}
  //   ],
  //   batch: [
  //     {required: true, message: '必填', trigger: 'blur'},
  //     {max: 10, message: '长度不能超过10', trigger: 'blur'}
  //   ],
  //   startAmount: [
  //     {required: true, message: '必填', trigger: 'blur'}
  //   ]
  // }
  // dataRule2 = {
  //   fermentPotNo: [
  //     {required: true, message: '必填', trigger: 'blur'}
  //   ],
  //   batch: [
  //     {required: true, message: '必填', trigger: 'blur'},
  //     {max: 10, message: '长度不能超过10', trigger: 'blur'}
  //   ],
  //   endAmount: [
  //     {required: true, message: '必填', trigger: 'blur'}
  //   ]
  // }
  mounted () {
    this.params.applyDate = dateFormat(new Date(), 'yyyy-MM-dd')
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.getProductLine(this.params.workshopId)
    this.getFermentPot(this.params.factoryId)
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
    if (this.dataList && this.dataList.length > 0) {
      return this.dataList[0].status
    }
    return ''
  }
  modifyRecord (row) {
    if (this.disabled || row.status === 'submit' || row.status === 'checked') {
      return
    }
    this.modifyForm = {
      id: row.id ? row.id : 'id',
      recordId: row.recordId ? row.recordId : 'record',
      deviceId: row.storagePotNo,
      deviceName: row.storagePotName,
      fermentPotNo: row.fermentPotNo ? row.fermentPotNo : '',
      fermentPotName: row.fermentPotName ? row.fermentPotName : '',
      orderId: row.orderId ? row.orderId : '',
      batch: row.batch ? row.batch : '',
      remainAmount: row.remainAmount ? row.remainAmount : 0,
      remainAmountUnit: row.remainAmountUnit ? row.remainAmountUnit : 'L',
      startAmount: row.startAmount ? row.startAmount : 0,
      storageAmount: row.storageAmount ? row.storageAmount : 0,
      endAmount: row.endAmount ? row.endAmount : 0,
      remark: row.remark ? row.remark : '',
      productLine: row.productLine,
      productLineName: row.productLineName,
      changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
      changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
    }
    this.dialogFormVisible3 = true
  }
  saveModify () {
    if (this.modifyValidate()) {
      let record = this.dataList.find(item => item.id === this.modifyForm.id)
      if (!record) {
        record = this.dataList.find(item => item.recordId === this.modifyForm.recordId)
      }
      if (record) {
        Object.assign(record, {
          fermentPotNo: this.modifyForm.fermentPotNo,
          fermentPotName: this.modifyForm.fermentPotName,
          orderId: this.modifyForm.orderId,
          batch: this.modifyForm.batch,
          remainAmount: this.modifyForm.remainAmount,
          remainAmountUnit: this.modifyForm.remainAmountUnit,
          startAmount: this.modifyForm.startAmount,
          storageAmount: this.modifyForm.storageAmount,
          endAmount: this.modifyForm.endAmount,
          amount: this.modifyForm.endAmount - this.modifyForm.startAmount,
          remark: this.modifyForm.remark,
          changed: this.modifyForm.changed,
          changer: this.modifyForm.changer
        })
      }
      this.dialogFormVisible3 = false
    }
  }
  inPotStart (deviceId: string, deviceName: string) {
    this.startForm = {
      deviceId,
      deviceName,
      fermentPotNo: '',
      fermentPotName: '',
      orderId: '',
      batch: '',
      remainAmount: 0,
      remainAmountUnit: 'L',
      startAmount: 0,
      storageAmount: 0,
      productLine: this.params.productLineId,
      productLineName: this.params.productLineName,
      changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
      changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
    }
    this.dialogFormVisible = true
  }
  saveStart () {
    if (this.startValidate()) {
      let uuid = Vue.prototype.uuid()
      this.availableMap.set(this.startForm.deviceId, '1')
      this.matchedMap.set(this.startForm.deviceId, uuid)
      let resultData = {
        // "id": "1",
        // "status": "saved",
        recordId: uuid,
        factory: this.params.factoryId,
        workShop: this.params.workshopId,
        productLine: this.params.productLineId,
        storagePotNo: this.startForm.deviceId,
        fermentPotNo: this.startForm.fermentPotNo,
        // 额外信息
        orderId: this.startForm.orderId,
        batch: this.startForm.batch,
        remainAmount: this.startForm.remainAmount,
        // 额外信息
        remainAmountUnit: this.startForm.remainAmountUnit,
        startAmount: this.startForm.startAmount,
        endAmount: null,
        amount: null,
        storageAmount: this.startForm.storageAmount,
        unit: null,
        // operated: null,
        // operator: null,
        remark: null,
        delFlag: 0,
        changed: this.startForm.changed,
        changer: this.startForm.changer,
        productLineName: this.params.productLineName,
        storagePotName: this.startForm.deviceName,
        fermentPotName: this.startForm.fermentPotName
      }
      this.dataList.push(resultData)
      this.dialogFormVisible = false
    }
  }
  inPotEnd (deviceId: string, deviceName: string) {
    let recordId = this.matchedMap.get(deviceId)
    let startData = this.dataList.find(item => item.recordId === recordId)
    if (startData) {
      this.endForm = {
        deviceId,
        deviceName,
        fermentPotNo: startData.fermentPotNo,
        fermentPotName: startData.fermentPotName,
        orderId: startData.orderId,
        batch: startData.batch,
        remainAmount: startData.remainAmount,
        endAmount: startData.endAmount ? startData.endAmount : 0,
        productLine: startData.productLine,
        productLineName: startData.productLineName,
        remark: startData.remark ? startData.remark : '',
        changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
      }
    }
    this.dialogFormVisible2 = true
  }
  saveEnd () {
    if (this.endForm.endAmount.toString() === '') {
      this.$message.error('结束数不能为空')
      return false
    }
    this.availableMap.set(this.endForm.deviceId, '0')
    let recordId = this.matchedMap.get(this.endForm.deviceId)
    let startData = this.dataList.find(item => item.recordId === recordId)
    // let startData = this.dataList.find(item => item.storagePotNo === this.endForm.deviceId)
    if (startData) {
      Object.assign(startData, {
        endAmount: this.endForm.endAmount,
        amount: this.endForm.endAmount - startData.startAmount,
        remark: this.endForm.remark,
        changed: this.endForm.changed,
        changer: this.endForm.changer})
    }
    this.dialogFormVisible2 = false
  }
  startValidate () {
    if (this.startForm.fermentPotNo === '') {
      this.$message.error('领用发酵罐不能为空')
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
  modifyValidate () {
    if (this.modifyForm.fermentPotNo === '') {
      this.$message.error('领用发酵罐不能为空')
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
    } else if (flag === 'fermentPotStart') {
      let item = this.fermentPotList.find(ele => ele.holderId === this.startForm.fermentPotNo)
      this.startForm.fermentPotName = item ? item.holderName : ''
      this.startForm.orderId = item ? item.orderId : ''
    } else if (flag === 'fermentPotModify') {
      let item = this.fermentPotList.find(ele => ele.holderId === this.modifyForm.fermentPotNo)
      this.modifyForm.fermentPotName = item ? item.holderName : ''
      this.modifyForm.orderId = item ? item.orderId : ''
      this.modifyForm.remainAmount = 0
      this.modifyForm.remainAmountUnit = 'L'
      this.modifyForm.batch = ''
      this.getRemanAmountModify(this.params.workshopId, this.modifyForm.fermentPotNo, this.modifyForm.orderId)
    }
  }
  // 获取工厂
  getFactory () {
    this.factoryList = []
    Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
      if (res.data.code === 0) {
        this.factoryList = res.data.typeList
        // if (!this.params.factoryId && res.data.typeList.length > 0) {
        //   this.params.factoryId = res.data.typeList[0].deptId
        //   this.params.factoryName = res.data.typeList[0].deptName
        // }
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
          // if (!this.params.workshopId && res.data.typeList.length > 0) {
          //   this.params.workshopId = res.data.typeList[0].deptId
          //   this.params.workshopName = res.data.typeList[0].deptName
          // }
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
  // 发酵罐
  getFermentPot (fid: string) {
    this.fermentPotList = []
    if (fid) {
      Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', {factory: fid}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.fermentPotList = res.data.num
          // if (!this.params.factoryId && res.data.num.length > 0) {
          //   this.params.workshopId = res.data.num[0].holderId
          // }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  getRemanAmountStart (wId: string, fId: string, orderId: string) {
    Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_REMAIN_AMOUNT_API}`, 'POST', {workShop: wId, potNo: fId, orderId}, false, false, false).then(res => {
      if (res.data.code === 0) {
        this.startForm.remainAmount = (res.data.psp && res.data.psp.remainAmount) ? res.data.psp.remainAmount : 0
        this.startForm.remainAmountUnit = (res.data.psp && res.data.psp.remainAmountUnit) ? res.data.psp.remainAmountUnit : 'L'
        this.startForm.batch = (res.data.psp && res.data.psp.batch) ? res.data.psp.batch : ''
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  getRemanAmountModify (wId: string, fId: string, orderId: string) {
    Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_REMAIN_AMOUNT_API}`, 'POST', {workShop: wId, potNo: fId, orderId}, false, false, false).then(res => {
      if (res.data.code === 0) {
        this.modifyForm.remainAmount = (res.data.psp && res.data.psp.remainAmount) ? res.data.psp.remainAmount : 0
        this.modifyForm.remainAmountUnit = (res.data.psp && res.data.psp.remainAmountUnit) ? res.data.psp.remainAmountUnit : 'L'
        this.modifyForm.batch = (res.data.psp && res.data.psp.batch) ? res.data.psp.batch : ''
      } else {
        this.$message.error(res.data.msg)
      }
    })
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
      this.$message.error('请选择领用日期')
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
    // let params = {
    //   factory: '1',
    //   workShop: '',
    //   productLine: '3ECBE91F774B45F28707697937CBB6E7',
    //   created: ''
    // }
    this.retrieveOrderList(params)
  }
  retrieveOrderList (params) {
    this.dataList = []
    this.sdList = []
    this.availableMap.clear()
    this.matchedMap.clear()
    Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_LIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        this.dataList = res.data.list
        this.sdList = res.data.sdList
        // let that = this
        this.sdList.forEach(item => this.availableMap.set(item.deviceId, '0'))
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  save () {
    this.dataList.map(item => { if (item.status !== 'submit' && item.status !== 'checked') { item.status = 'saved' } })
    Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_UPDATE_API}`, `POST`, this.dataList).then((res) => {
      if (res.data.code === 0) {
        this.$message.success('保存成功')
        this.getFermentPot(this.params.factoryId)
        this.getOrderList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      this.$message.error('保存失败: ' + err)
    })
  }
  submit () {
    this.dataList.map(item => { if (item.status !== 'checked') { item.status = 'submit' } })
    Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_UPDATE_API}`, `POST`, this.dataList).then((res) => {
      if (res.data.code === 0) {
        this.$message.success('提交成功')
        this.getFermentPot(this.params.factoryId)
        this.getOrderList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      this.$message.error('提交失败: ' + err)
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
    this.getFermentPot(newVal)
  }
  @Watch('params.workshopId')
  onChangeWorkshop (newVal: string, oldVal: string) {
    this.params.productLineId = ''
    this.params.productLineName = ''
    this.getProductLine(newVal)
  }
  @Watch('startForm.fermentPotNo')
  onChangeFerment (newVal: string, oldVal: string) {
    this.startForm.remainAmount = 0
    this.startForm.remainAmountUnit = 'L'
    this.startForm.batch = ''
    this.getRemanAmountStart(this.params.workshopId, newVal, this.startForm.orderId)
  }
  // @Watch('modifyForm.fermentPotNo', {immediate: false})
  // onChangeFerment2 (newVal: string, oldVal: string) {
  //   console.log('--------------------------------------------------')
  //   this.modifyForm.remainAmount = 0
  //   this.modifyForm.remainAmountUnit = 'L'
  //   this.getRemanAmountModify(this.params.workshopId, newVal, this.modifyForm.orderId)
  // }
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
  margin-right:50px;
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
