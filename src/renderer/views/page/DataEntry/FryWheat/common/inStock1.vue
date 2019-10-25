<!--生产入库-->
<template>
  <div>
    <!--数据录入-->
    <el-row>
      <el-col :span="24">
        <el-card>
          <!--录入-->
          <div>
            <el-row  :gutter="36" v-for="(item, index) in flourContainerList" :key="index" v-if="index%4===0" style="margin-top:5px">
              <el-col :span="6" v-if="index < flourContainerList.length">
                  <div class="stock-box">
                    <div class="stock-img"></div>
                    <div class="stock-text">{{flourContainerList[index].holderName}}</div>
                    <div class="clearfix"></div>
                    <div class="stock-button enabled" @click="addNewRecord(flourContainerList[index].holderId, flourContainerList[index].holderName)" v-if="isRedact && (inStorageState != 'submit' && inStorageState != 'checked')"> 入罐</div>
                    <div class="stock-button disabled"  v-else> 入罐</div>
                  </div>
              </el-col>
              <el-col :span="6" v-if="index + 1 < flourContainerList.length">
                  <div class="stock-box">
                    <div class="stock-img"></div>
                    <div class="stock-text">{{flourContainerList[index + 1].holderName}}</div>
                    <div class="clearfix"></div>
                    <div class="stock-button enabled" @click="addNewRecord(flourContainerList[index + 1].holderId, flourContainerList[index + 1].holderName)" v-if="isRedact && (inStorageState != 'submit' && inStorageState != 'checked')"> 入罐</div>
                    <div class="stock-button disabled"  v-else> 入罐</div>
                  </div>
              </el-col>
              <el-col :span="6" v-if="index + 2 < flourContainerList.length">
                  <div class="stock-box">
                    <div class="stock-img"></div>
                    <div class="stock-text">{{flourContainerList[index + 2].holderName}}</div>
                    <div class="clearfix"></div>
                    <div class="stock-button enabled" @click="addNewRecord(flourContainerList[index + 2].holderId, flourContainerList[index + 2].holderName)" v-if="isRedact && (inStorageState != 'submit' && inStorageState != 'checked')"> 入罐</div>
                    <div class="stock-button disabled"  v-else> 入罐</div>
                  </div>
              </el-col>
              <el-col :span="6" v-if="index + 3 < flourContainerList.length">
                  <div class="stock-box">
                    <div class="stock-img"></div>
                    <div class="stock-text">{{flourContainerList[index + 3].holderName}}</div>
                    <div class="clearfix"></div>
                    <div class="stock-button enabled" @click="addNewRecord(flourContainerList[index + 3].holderId, flourContainerList[index + 3].holderName)" v-if="isRedact && (inStorageState != 'submit' && inStorageState != 'checked')"> 入罐</div>
                    <div class="stock-button disabled"  v-else> 入罐</div>
                  </div>
              </el-col>
            </el-row>
          </div>
          <!--table-->
          <!-- <el-button type='primary' size="small" @click="saveStockList">baocun</el-button>
          <el-button type='primary' size="small" @click="submitStockList">tijiao</el-button> -->
          <el-row  style="margin-top:20px;" >
            <el-col>
              <el-table @row-dblclick="modifyOldRecord" header-row-class-name="tableHead" :data="wheatDataList"  border tooltip-effect="dark" :row-class-name="rowDelFlag">
                <el-table-column label="日期" width="130">
                  <template slot-scope="scope">
                    {{scope.row.inPortDate | formatDate}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="麦粉计量仓"
                  :show-overflow-tooltip="true"
                  width="120">
                  <template slot-scope="scope">
                    {{scope.row.flourDeviceName}}
                  </template>
                </el-table-column>
                <el-table-column width="80" label="粮仓">
                  <template slot-scope="scope">
                    {{scope.row.wheatDeviceName}}
                  </template>
                </el-table-column>
                <el-table-column width="90" label="起始">
                  <template slot-scope="scope">
                    {{scope.row.startWeight}}
                  </template>
                </el-table-column>
                <el-table-column label="结束" width="90">
                  <template slot-scope="scope">
                    <span>{{scope.row.endWeight}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="入库数" width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.inPortWeight}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单位" width="80">
                  <template slot-scope="scope">
                     <span>{{scope.row.weightUnit = 'kg'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="入库批次" width="150">
                  <template slot-scope="scope">
                     <span>{{scope.row.inPortBatch}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作人员" width="100">
                  <template slot-scope="scope">
                     <span>{{scope.row.changer}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作时间" width="100">
                  <template slot-scope="scope">
                     <span>{{scope.row.changed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="60">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked' "  @click="dellistbomS(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--审批-->
    <el-row>
      <el-col :span="24">
        <auditLog :tableData="readAudit"></auditLog>
      </el-col>
    </el-row>
    <el-dialog :title="this.stockForm.flourDeviceName" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="stockForm" :rules="dataRule" ref="stockForm">
        <el-form-item label="粮仓" :label-width="formLabelWidth" required prop="wheatDeviceId">
          <el-select @change="changeWheatContainer"  v-model="stockForm.wheatDeviceId" value-key="wheatDeviceId" placeholder="请选择粮仓" style="width:220px" :disabled="!isRedact">
            <el-option v-for="(item, index) in wheatContainerList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始(KG)" :label-width="formLabelWidth" required prop="startWeight">
          <el-input tyle='number' v-model.number="stockForm.startWeight"  style="width:220px;" :disabled="!isRedact"></el-input>
        </el-form-item>
        <el-form-item label="结束(KG)" :label-width="formLabelWidth" required prop="endWeight">
          <el-input tyle='number' v-model.number="stockForm.endWeight"  style="width:220px;" :disabled="!isRedact"></el-input>
        </el-form-item>
        <el-form-item label="入库批次" :label-width="formLabelWidth" required prop="inPortBatch">
          <el-input  maxlength='10' v-model="stockForm.inPortBatch"  style="width:220px;" :disabled="!isRedact"></el-input>
        </el-form-item>
         <el-form-item label="操作时间" :label-width="formLabelWidth">
          <!-- <el-input v-model="stockForm.operateTime" ></el-input> -->
          <label>{{stockForm.changed}}</label>
          <!-- <el-date-picker type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" v-model="stockForm.operateTime" :disabled="!isRedact"></el-date-picker> -->
        </el-form-item>
         <el-form-item label="操作人" :label-width="formLabelWidth">
          <label>{{stockForm.changer}}</label>
          <!-- <el-input v-model="stockForm.operatorId"  style="width:220px;" :disabled="!isRedact"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="!isRedact">取消</el-button>
        <el-button type="primary" @click="cacheStockData()" :disabled="!isRedact">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from '@/net/validate'
import { WHT_API, BASICDATA_API } from '@/api/api'
export default {
  data () {
    return {
      // stoppageType: [],
      // equipmentType: [],
      // materialShort: [],
      // enery: [],
      wheatDataList: [],
      readAudit: [],
      flourContainerList: [],
      wheatContainerList: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      stockForm: {},
      dataRule: {
        wheatDeviceId: [
          {required: true, message: '必选', trigger: 'click'}
        ],
        startWeight: [
          {required: true, message: '必填', trigger: 'blur'},
          {type: 'number', message: '必须为数字', trigger: 'blur'}
        ],
        endWeight: [
          {required: true, message: '必填', trigger: 'blur'},
          {type: 'number', message: '必须为数字', trigger: 'blur'}
        ],
        inPortBatch: [
          {required: true, message: '必填', trigger: 'blur'},
          {max: 10, message: '长度不能超过10', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getFlourContainerList()
    this.getWheatContainerList()
    // this.getWheatDataList()
  },
  props: {
    isRedact: Boolean,
    inStorageState: String,
    order: Object
  },
  filters: {
    formatDate (date) {
      if (date && date.length > 10) {
        return date.substring(0, 10)
      }
      return date
    }
  },
  methods: {
    // 麦粉计量仓容器
    getFlourContainerList () {
      this.flourContainerList = []
      if (typeof this.order === 'undefined' || typeof this.order.workShopName === 'undefined') {
        return
      }
      let params = {
        type: 'holder_type',
        holder_type: '009',
        // holder_no: 'MM002',
        pageSize: 9999,
        workShopName: this.order.workShopName,
        currPage: 1
      }
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params).then(({data}) => {
        if (data.code === 0) {
          this.flourContainerList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('catch data::', error)
      })
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
        pageSize: 100,
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
    // 获取入库数据
    getWheatDataList (orderId) {
      this.wheatDataList = []
      this.readAudit = []
      // if (typeof this.order === 'undefined' || typeof this.order.orderId === 'undefined') {
      //   return
      // }
      this.$http(`${WHT_API.INSTORAGELIST_API}`, 'POST', {orderId}).then(({data}) => {
        if (data.code === 0) {
          // success
          this.wheatDataList = data.wlist
          this.readAudit = data.vrlist
          let inState = ''
          let no = 0
          let sub = 0
          let che = 0
          let sav = 0
          this.wheatDataList.forEach((item) => {
            if (item.status === 'noPass') {
              no = no + 1
            } else if (item.status === 'submit') {
              sub = sub + 1
            } else if (item.status === 'checked') {
              che = che + 1
            } else if (item.status === 'saved') {
              sav = sav + 1
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
          this.$emit('setInStorageState', inState)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('catch data::', error)
      })
    },
    addNewRecord (flourDeviceId, flourDeviceName) {
      let now = new Date()
      let dateStr = dateFormat(now, 'yyyy-MM-dd hh:mm:ss')
      let inPortDateStr = dateFormat(new Date(this.order.productDate), 'yyyy-MM-dd hh:mm:ss')
      this.stockForm = {
        wheatDeviceId: '',
        startWeight: 0,
        endWeight: 0,
        created: dateStr,
        creator: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        changed: dateStr,
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        orderId: this.order.orderId,
        flourDeviceId,
        flourDeviceName,
        recordId: this.uuid(),
        inPortDate: inPortDateStr,
        inPortBatch: '',
        delFlag: '0'
      }
      this.dialogFormVisible = true
      if (this.$refs['stockForm'] !== undefined) {
        this.$refs['stockForm'].resetFields()
      }
    },
    modifyOldRecord (row) {
      // noPass saved
      if (!this.isRedact || row.status === 'submit' || row.status === 'checked') {
        return
      }
      this.dialogFormVisible = true
      // if (this.$refs['stockForm'] !== undefined) {
      //   this.$refs['stockForm'].resetFields()
      // }
      // 点击保存之前，不能对列表数据做更改，此处用clone
      this.stockForm = Object.assign({}, row)
      this.stockForm.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.stockForm.changer = this.$store.state.user.realName + `(${this.$store.state.user.name})`
    },
    cacheStockData () {
      this.$refs['stockForm'].validate((valid) => {
        if (valid) {
          let currentRecord = []
          if (this.stockForm.hasOwnProperty('recordId')) {
            // 新增行
            currentRecord = this.wheatDataList.filter(data => data.recordId === this.stockForm.recordId)
          } else {
            // 原有行
            currentRecord = this.wheatDataList.filter(data => data.id === this.stockForm.id)
          }
          this.stockForm.inPortWeight = this.stockForm.endWeight - this.stockForm.startWeight
          if (currentRecord && currentRecord.length > 0) {
            // modify
            Object.assign(currentRecord[0], this.stockForm)
          } else {
            // add
            let clone = Object.assign({}, this.stockForm)
            this.wheatDataList.push(clone)
          }
          this.dialogFormVisible = false
        }
      })
    },
    // 保存
    saveIn (resolve) {
      if (this.wheatDataList.length > 0) {
        this.wheatDataList.forEach((item) => {
          // 应产品要求，如果对不通过数据做修改保存操作，页签状态还是未通过，故此处不做状态赋值。
          // if (item.status !== 'submit' || item.status !== 'checked') {
          //   item.status = 'saved'
          // }
          // 新增行赋值saved
          if (typeof item.status === 'undefined' || item.status == null || item.status.trim() === '') {
            item.status = 'saved'
          }
        })
        this.$http(WHT_API.INSTORAGESAVE_API, 'POST', this.wheatDataList).then(({data}) => {
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
    // 入库提交
    submitIn (resolve) {
      if (this.wheatDataList.length > 0) {
        this.wheatDataList.forEach((item) => {
          if (item.status !== 'checked') {
            item.status = 'submit'
          }
        })
        this.$http(`${WHT_API.INSTORAGESUBMIT_API}`, 'POST', this.wheatDataList).then(({data}) => {
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
    changeWheatContainer (value) {
      let wheat = this.wheatContainerList.find((item) => item.holderId === value)
      let holderNo = ''
      if (wheat) {
        this.stockForm.wheatDeviceName = wheat.holderName
        holderNo = wheat.holderNo
      }
      let now = new Date()
      this.stockForm.inPortBatch = dateFormat(now, 'yyMMdd') + holderNo
    },
    // 删除
    dellistbomS (row) {
      row.delFlag = '1'
    },
    // RowDelFlag
    rowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    }
  },
  computed: {
    operator: function () {
      return `(${this.stockForm.changer})${this.stockForm.changer}`
    }
  },
  watch: {
    'order.productDate' (n, o) {
      // 监听头部生产日期
      this.wheatDataList.forEach((item) => {
        if (item.status !== 'submit' && item.status !== 'checked') {
          item.inPortDate = dateFormat(new Date(n), 'yyyy-MM-dd hh:mm:ss')
        }
      })
    }
  },
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
  // @import '~@/assets/scss/common.scss';
  // @import '../../../../../assets/scss/common.scss';
  .stock-box{
    height: 184px;
    border: 1px solid #E9E9E9;
    border-radius: 2px;
    .stock-img{
      width:48px;
      height:48px;
      border-radius:24px;
      float:left;
      margin-left:24px;
      margin-top:24px;
      // background: url('../../../../../assets/img/wheat.png')
      background: url('~@/assets/img/wheat.png')
      // ~ 表示根目录，@表示src目录
    }
    .stock-text{
      float:left;
      margin-left:20px;
      margin-top:30px;
      font-size:16px;
      font-weight:500;
      font-family:PingFangSC-Medium;
    }
    .stock-button{
      height:48px;
      margin-top:62px;
      font-size:14px;
      line-height:48px;
      text-align:center;
      border-top:1px solid #e9e9e9;
      border-radius: 0 0 2px 2px;
    }
    .enabled{
      background:#F7F9FA;
      &:hover{
        color:#fff;
        background:#1890FF;
        cursor:pointer
      }
    }
    .disabled{
      color:rgba(0, 0, 0, 0.6);
      background:#F7F9FA;
      &:hover{
        cursor:not-allowed
      }
    }
  }
</style>
