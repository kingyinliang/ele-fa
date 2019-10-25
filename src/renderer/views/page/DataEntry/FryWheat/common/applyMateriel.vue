<!--生产入库-->
<template>
  <div>
    <!--数据录入-->
    <el-row>
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(sole, index) in WheatCangList" :key="index">
            <el-card class="Card_item">
              <div slot="header">小麦罐号：{{sole.holderName}} <el-button type="primary" size="small" @click="Receive(sole.holderName, sole.holderId)" :disabled="!isRedact || applyMaterielState == 'submit' || applyMaterielState == 'checked'" style="float:right; margin-top:-8px;">立即领用</el-button></div>
              <div style="display: flex">
                <div class="Card_item_img">
                  <div class="Card_item_img_box">
                    <div class="Card_item_img_box_bg" style="height: 50%"></div>
                  </div>
                  <img src="@/assets/img/granary.png" alt="">
                </div>
                <div class="Card_item_text">
                  <el-card style="margin-top: 25px">
                    <div slot="header">库存明细 <span style="float: right">合计：{{sole.cangtotal}}KG</span></div>
                    <div style="position: relative">
                      <el-row  class="Card_item_text_item bgbox" style="padding-top: 0">
                        <el-col :span="16">批次</el-col>
                        <el-col :span="8">数量</el-col>
                      </el-row >
                      <div class="Card_item_text_box_bg1"></div>
                      <div class="Card_item_text_box">
                        <el-row class="Card_item_text_item" v-for="(soles, indexs) in sole.wheatData" :key="indexs">
                          <el-col :span="16">{{soles.batch}}</el-col>
                          <el-col :span="8">{{soles.currentQuantity}}KG</el-col>
                        </el-row>
                      </div>
                      <div class="Card_item_text_box_bg2"></div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-card>
          </el-col>
<!-- <el-button @click="Receive(sole.holderName, sole.holderId)" :disabled="!isRedact || applyMaterielState == 'submit' || applyMaterielState == 'checked'">立即领用</el-button>
-->
        </el-row>
        <el-card body-style="padding-top:10px;">
          <el-table ref="table1" header-row-class-name="tableHead" :data="materielDataList" @row-dblclick="EditReceive" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="width: 100%;  margin-bottom: 20px">
            <el-table-column label="物料">
              <template slot-scope="scope">{{scope.row.materialCode}} {{scope.row.materialName}}</template>
            </el-table-column>
            <el-table-column label="粮仓" :show-overflow-tooltip="true" prop="holderName"></el-table-column>
            <el-table-column label="物料批次" prop="batch"></el-table-column>
            <el-table-column width="160" label="小麦领用数" prop="wheatWeight"></el-table-column>
            <el-table-column label="单位" width="120" prop="weightUnit"></el-table-column>
            <!-- <el-table-column label="备注" width="160" prop="remark"></el-table-column> -->
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'"  @click="dellistbomS(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top:20px;">
            <el-col>
              <div><span>领用数合计：</span>{{totalInstock}} KG</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--审批-->
    <el-row >
      <el-col :span="24">
        <auditLog :tableData="readAudit"></auditLog>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="cang" size="small" :rules="cangrules" ref="cang">
        <el-form-item label="领用粮仓：" :label-width="formLabelWidth">{{cang.holderName}}</el-form-item>
        <el-form-item label="批次：" :label-width="formLabelWidth" prop="batch">
          <el-select v-model="cang.batch">
            <el-option v-for="(sole, index) in piciList" :label="sole.batch" :value="sole.batch" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料：" :label-width="formLabelWidth">{{cang.materialCode}} {{cang.materialName}}</el-form-item>
        <el-form-item label="剩余量（KG）：" :label-width="formLabelWidth">{{cang.currentQuantity}}</el-form-item>
        <el-form-item label="数量（KG）：" :label-width="formLabelWidth" prop="wheatWeight">
          <el-input v-model.number="cang.wheatWeight" @keyup.native="proving1" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：" :label-width="formLabelWidth">{{cang.changed}}</el-form-item>
        <el-form-item label="操作人：" :label-width="formLabelWidth">{{cang.changer}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="DialogSave('cang')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { dateFormat } from '@/net/validate'
import { WHT_API, BASICDATA_API, SYSTEMSETUP_API } from '@/api/api'
export default {
  data () {
    return {
      materialDictList: [],
      wheatContainerList: [],
      readAudit: [],
      materielDataList: [],
      WheatCangList: [],
      dialogFormVisible: false,
      dialogTitle: '',
      formLabelWidth: '150px',
      cang: {},
      cangrules: {
        batch: [
          {required: true, message: '请选择批次', trigger: 'change'}
        ],
        wheatWeight: [
          {required: true, message: '请填写数量', trigger: 'blur'},
          {type: 'number', message: '必须为数字'}
        ]
      },
      piciList: {},
      materielDataListArray: [{
        batch: '',
        quantotal: 0
      }]
    }
  },
  mounted () {
    this.getMaterialDictList()
    this.getWheatContainerList()
    // this.getMaterielDataList()
    // this.GetWheatCang()
  },
  props: {
    isRedact: Boolean,
    applyMaterielState: String,
    order: Object
  },
  methods: {
    // 保存
    saveMateriel (resolve) {
      if (this.materielDataList.length > 0) {
        this.materielDataList.forEach((item) => {
          // 应产品要求，如果对不通过数据做修改保存操作，页签状态还是未通过，故此处不做状态赋值。
          // if (item.status !== 'submit' || item.status !== 'checked') {
          //   item.status = 'saved'
          // }
          // 新增行赋值saved
          if (typeof item.status === 'undefined' || item.status == null || item.status.trim() === '') {
            item.status = 'saved'
          }
        })
        this.$http(WHT_API.APPLYMATERIELSAVE_API, 'POST', this.materielDataList).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error(data.msg)
          }
          if (resolve) {
            resolve('resolve')
          }
        }).catch((error) => {
          console.log('catch data::', error)
        })
      } else {
        if (resolve) {
          resolve('resolve')
        }
      }
    },
    // 物料提交
    submitMateriel (resolve) {
      if (this.materielDataList.length > 0) {
        this.materielDataList.forEach((item) => {
          if (item.status !== 'checked') {
            item.status = 'submit'
          }
          item.factory = this.order.factory
          item.workShop = this.order.workShop
        })
        this.$http(`${WHT_API.APPLYMATERIELSUBMIT_API}`, 'POST', this.materielDataList).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error(data.msg)
          }
          if (resolve) {
            resolve('resolve')
          }
        }).catch((error) => {
          console.log('catch data::', error)
        })
      } else {
        if (resolve) {
          resolve('resolve')
        }
      }
    },
    validate () {
      if (this.materielDataList === undefined || this.materielDataList.length === 0) {
        this.$message.error('物料领用未录入数据')
        return false
      }
      for (let item of this.materielDataList) {
        if (item.delFlag === '0') {
          if (item.materialCode == null || item.materialCode.trim() === '') {
            this.$message.error('物料不能为空')
            return false
          }
          if (item.deviceId == null || item.deviceId === '') {
            this.$message.error('粮仓不能为空')
            return false
          }
          if (item.batch == null || item.batch.trim() === '') {
            this.$message.error('物料批次不能为空')
            return false
          }
          if (item.batch.trim().length > 10) {
            this.$message.error('物料批次长度不能超过10')
            return false
          }
          if (item.wheatWeight === '') {
            this.$message.error('小麦领用数不能为空')
            return false
          }
          if (item.wheatWeight <= 0) {
            this.$message.error('小麦领用数必须大于0')
            return false
          }
        }
      }
      return true
    },
    // 粮仓
    getWheatContainerList () {
      this.wheatContainerList = []
      if (typeof this.order === 'undefined' || typeof this.order.workShopName === 'undefined') {
        return
      }
      let params = {
        type: 'holder_type',
        holder_type: '002',
        // holder_no: '001',
        pageSize: 9999,
        workShopName: this.order.workShopName,
        currPage: 1
      }
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params).then(({data}) => {
        if (data.code === 0) {
          this.wheatContainerList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('catch data::', error)
      })
    },
    // 物料选项
    getMaterialDictList () {
      this.materialDictList = []
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: this.$store.state.common.FWfactoryid, type: 'CM_material'}).then(({data}) => {
        if (data.code === 0) {
          this.materialDictList = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('catch data::', error)
      })
    },
    // 获取物料数据
    getMaterielDataList (orderId) {
      this.materielDataList = []
      this.readAudit = []
      // if (typeof this.order === 'undefined' || typeof this.order.orderId === 'undefined') {
      //   return
      // }
      let inState = ''
      this.$http(`${WHT_API.APPLYMATERIELLIST_API}`, 'POST', {order_id: orderId}).then(({data}) => {
        if (data.code === 0) {
          // success
          this.materielDataList = data.listForm
          this.readAudit = data.listApproval
          let no = 0
          let sub = 0
          let che = 0
          let sav = 0
          this.materielDataList.forEach((item) => {
            if (item.status === 'noPass') {
              no = no + 1
            } else if (item.status === 'submit') {
              sub = sub + 1
            } else if (item.status === 'checked') {
              che = che + 1
            } else if (item.status === 'saved') {
              sav = sav + 1
            }
            // 获取每个批次当前在list中使用的总和
            if (this.materielDataListArray.find((items) => items.batch === item.batch)) {
              this.materielDataListArray.find((items) => items.batch === item.batch).quantotal += item.wheatWeight
            } else {
              this.materielDataListArray.push({
                batch: item.batch,
                quantotal: item.wheatWeight
              })
            }
          })
          if (no > 0) {
            inState = 'noPass'
          } else if (sub > 0) {
            inState = 'submit'
          } else if (sav > 0) {
            inState = 'saved'
          } else if (che > 0) {
            inState = 'checked'
          }
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      }).finally(() => {
        this.$emit('setApplyMaterielState', inState)
      })
    },
    // 新增
    addNewRecord () {
      // 复制上一条数据的手动录入部分
      let lastArr = this.materielDataList.filter(item => { return item.delFlag === '0' })
      let last = lastArr && lastArr.length > 0 ? lastArr[lastArr.length - 1] : null
      this.materielDataList.push({
        id: '',
        orderId: this.order.orderId,
        // 物料编码默认值
        materialCode: last ? last.materialCode : '',
        materialName: last ? last.materialName : '',
        // 粮仓号
        deviceId: last ? last.deviceId : '',
        // 粮仓名称
        holderName: last ? last.holderName : '',
        // 批次号
        batch: last ? last.batch : '',
        wheatWeight: last ? last.wheatWeight : 0,
        weightUnit: 'KG',
        remark: last ? last.remark : '',
        delFlag: '0'
      })
    },
    // 删除
    dellistbomS (row) {
      row.delFlag = '1'
    },
    //  RowDelFlag
    rowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    changeWheatContainer (row) {
      let ele = this.wheatContainerList.find((item) => item.holderId === row.deviceId)
      if (ele) {
        row.holderName = ele.holderName
      }
    },
    changeProduct: function (row) {
      let ele = this.materialDictList.find((item) => item.code === row.materialCode)
      if (ele) {
        row.materialName = ele.value
      }
    },
    // saveOrSubmitMateriel (str, resolve) {
    //   if (this.materielDataList.length > 0) {
    //     console.log(this.materielDataList)
    //     if (resolve) {
    //       resolve('resolve')
    //     }
    //   }
    // }
    // 粮仓列表
    GetWheatCang () {
      this.$http(`${WHT_API.WHEATCANGLIST_API}`, 'POST', {factory: this.order.factory, workShop: this.order.workShop}).then(({data}) => {
        if (data.code === 0) {
          this.WheatCangList = data.holder
          this.WheatCangList.map((item) => {
            item.cangtotal = 0
            item.wheatData.map((items) => {
              item.cangtotal = item.cangtotal + items.currentQuantity
              this.materielDataListArray.push({
                batch: items.batch,
                quantotal: 0
              })
            })
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 立即领用弹框
    Receive (holderName, holderId) {
      this.cang = {}
      this.dialogTitle = holderName + '领用'
      this.dialogFormVisible = true
      this.piciList = this.WheatCangList.find(item => item.holderId === holderId).wheatData
      this.cang = {
        uid: this.uuid(),
        id: '',
        orderId: this.order.orderId,
        deviceId: holderId,
        holderName: holderName,
        weightUnit: 'KG',
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        remark: '',
        delFlag: '0'
      }
    },
    // 修改弹框
    EditReceive (row) {
      if (this.isRedact) {
        this.dialogFormVisible = true
        this.piciList = this.WheatCangList.find(item => item.holderId === row.deviceId).wheatData
        let picisole = this.piciList.find(item => item.batch === row.batch)
        row.currentQuantity = picisole.currentQuantity
        this.cang = Object.assign({}, row)
      }
    },
    // 立即领用弹框保存
    DialogSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 领用数是否大于剩余量
          let total = 0
          let currentRecord = []
          if (this.cang.hasOwnProperty('uid')) {
            // 新增行
            this.materielDataList.map((item) => {
              if (item.delFlag === '0' && (item.batch === this.cang.batch) && (item.uid !== this.cang.uid)) {
                total += item.wheatWeight
              }
            })
            currentRecord = this.materielDataList.filter(data => data.uid === this.cang.uid)
          } else {
            // 原有行
            this.materielDataList.map((item) => {
              if (item.delFlag === '0' && (item.batch === this.cang.batch) && (item.id !== this.cang.id)) {
                total = total + item.wheatWeight
              }
            })
            currentRecord = this.materielDataList.filter(data => data.id === this.cang.id)
          }
          let abc
          abc = this.cang.currentQuantity + this.materielDataListArray.find((items) => items.batch === this.cang.batch).quantotal
          if ((this.cang.wheatWeight + total) > abc) {
            this.$message.error('领用数大于该批次剩余量')
            return false
          }
          if (currentRecord && currentRecord.length > 0) {
            Object.assign(currentRecord[0], {
              batch: this.cang.batch,
              currentQuantity: this.cang.currentQuantity,
              wheatWeight: this.cang.wheatWeight
            })
          } else {
            this.materielDataList.push(this.cang)
          }
          this.dialogFormVisible = false
          // this.$nextTick(()=>{
          //   this.$refs[formName].resetFields()
          // })
        } else {
          return false
        }
      })
    },
    proving1 () {
      // this.cang.wheatWeight = this.cang.wheatWeight.replace(/[^\.\d]/g, '')
      this.cang.wheatWeight = this.cang.wheatWeight.replace('.', '')
      this.cang.wheatWeight = this.cang.wheatWeight.replace('-', '')
    }
  },
  computed: {
    totalInstock: function () {
      let total = 0
      for (let ele of this.materielDataList) {
        if (ele.delFlag === '0' && typeof ele.wheatWeight === 'number') {
          total += parseFloat(ele.wheatWeight)
        }
      }
      return total
    }
  },
  watch: {
    'cang.batch' () {
      let picisole = this.piciList.find(item => item.batch === this.cang.batch)
      this.cang.materialCode = picisole.materialCode
      this.cang.materialName = picisole.materialName
      this.cang.currentQuantity = picisole.currentQuantity
    }
  },
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss">
.Card_item{
  .el-card__header{
    padding: 15px 20px;
    font-size: 16px;
    color: #666;
  }
  &_detail{
    float: right;
    cursor: pointer;
    color: #1890FF;
  }
  &_img{
    width: 250px;
    position: relative;
    img{
      width: 250px;
    }
    &_box{
      width: 89px;
      height: 161px;
      position: absolute;
      left: 83px;
      top: 33px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-end;
      &_bg{
        flex: 1;
        height: 161px;
        align-items: center;
        position: relative;
        background: linear-gradient(#35C3FF,#1890FF);
        overflow: hidden;
        &:hover{
          &::before,&::after{
            animation: roateOne 10s linear infinite;
          }
        }
        &::before,&::after{
          content: "";
          position: absolute;
          left: 50%;
          min-width: 155px;
          min-height: 145px;
          background: #fff;
          animation: roateTwo 10s linear infinite;
        }

        &::before {
          top: -138px;
          border-radius: 45%;
        }
        &::after {
          top: -132px;
          opacity: 0.5;
          border-radius: 47%;
        }
      }
    }
  }
  &_text{
    flex: 1;
    .el-card__header{
      font-size: 14px;
      padding: 10px 12px;
      background: #1890FF;
      color: white;
    }
    &_box{
      position: relative;
      padding-bottom: 6px;
      max-height: 180px;
      overflow: scroll;
      &_bg1,&_bg2{
        position: absolute;
        width: 100%;
        height: 20px;
        background: linear-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
        z-index: 999;
      }
      &_bg2{
        bottom: 0;
        background: linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
      }
    }
    .Card_item_text_box::-webkit-scrollbar {
      display: none;
    }
    &_item{
      color: #4A4A4A;
      font-size: 14px;
      padding-top: 10px;
    }
  }
}
@keyframes roateOne {
  0% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -1%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, -0%) rotateZ(360deg);
  }
}
@keyframes roateTwo {
  0% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
  100% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
}
</style>
