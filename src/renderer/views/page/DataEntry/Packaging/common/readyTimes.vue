<template>
  <el-form :inline="true" :model="readyDate" ref="timesForm" size="small" label-width="125px">
    <div class="clearfix topBox">
      <h3>录入数据单位：MIN</h3>
      <el-form-item label="班次：" style="float: right;width: 162px" label-width="60px" v-if="readyDate.isCause === '1'">
        <el-select style="width: 100px" v-model="readyDate.classes" placeholder="请选择" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))">
          <el-option label="白班" value="白班"></el-option>
          <el-option label="中班" value="中班"></el-option>
          <el-option label="夜班" value="夜班"></el-option>
          <el-option label="多班" value="多班"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否停线交接班：" style="float: right;width: 230px">
        <el-select style="width: 100px" v-model="readyDate.isCause" placeholder="是否停线交接班" disabled>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-card class="box-card" v-if="readyDate.classes === '' || readyDate.classes === '白班' || readyDate.classes === '多班'">
      <div slot="header" class="clearfix">
        白班录入
        <span class="readyshiftBtn dayshift" name="dayshift">收起<i class="el-icon-caret-top"></i></span>
      </div>
      <div class="dayshiftBox">
        <el-form-item label="工作开始时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.dayStartDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="开线时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.dayStartLineDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="切换时间：">
          <el-input v-model="readyDate.dayChange" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" placeholder="手工录入"></el-input>
        </el-form-item>
        <el-form-item label="工作结束时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.dayEndDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="停线时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.dayCauseDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="用餐时间：" >
          <el-input v-model="readyDate.dayDinner" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" placeholder="手工录入"></el-input>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card" v-if="readyDate.isCause == '1' &&(readyDate.classes === '' || readyDate.classes === '中班' || readyDate.classes === '多班')">
      <div slot="header" class="clearfix">
        中班录入
        <span class="readyshiftBtn middleshift" name="middleshift">收起 <i class="el-icon-caret-top"></i></span>
      </div>
      <div class="middleshiftBox">
        <el-form-item label="工作开始时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.midStartDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="开线时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.midStartLineDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="切换时间：">
          <el-input v-model="readyDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
        </el-form-item>
        <el-form-item label="工作结束时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.midEndDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="停线时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.midCauseDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="用餐时间：" >
          <el-input v-model="readyDate.midDinner" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card" v-if="readyDate.isCause == '1' &&(readyDate.classes === '' || readyDate.classes === '夜班' || readyDate.classes === '多班')">
      <div slot="header" class="clearfix">
        夜班录入
        <span class="readyshiftBtn nightshift" name="nightshift">收起 <i class="el-icon-caret-top"></i></span>
      </div>
      <div class="nightshiftBox">
        <el-form-item label="工作开始时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.nightStartDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="开线时间：" >
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.nightStartLineDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="切换时间：" >
          <el-input v-model="readyDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
        </el-form-item>
        <el-form-item label="工作结束时间：">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.nightEndDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="停线时间：">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="readyDate.nightCauseDate" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))" style="width: 184px"></el-date-picker>
        </el-form-item>
        <el-form-item label="用餐时间：" >
          <el-input v-model="readyDate.nightDinner" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
        </el-form-item>
      </div>
    </el-card>
    <div style="padding: 20px">
      <el-form-item label="交接班：">
        <el-input v-model="readyDate.shift" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
      </el-form-item>
      <el-form-item label="班前会：">
        <el-input v-model="readyDate.meeting" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
      </el-form-item>
      <el-form-item label="生产前准备：">
        <el-input v-model="readyDate.prepared" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
      </el-form-item>
      <el-form-item label="生产后清场：">
        <el-input v-model="readyDate.clear" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status ==='noPass' || readyDate.status ==='saved' || readyDate.status ===''))"></el-input>
      </el-form-item>
    </div>
    <auditLog :tableData="ReadAudit"></auditLog>
  </el-form>
</template>

<script>
import {PACKAGING_API} from '@/api/api'
import { toDate, Readyanimation } from '@/net/validate'
export default {
  name: 'readyTimes',
  data () {
    return {
      readyDate: {
        classes: '多班',
        id: '',
        status: '',
        orderId: '',
        isCause: '1',
        dayStartDate: '',
        dayStartLineDate: '',
        dayChange: '',
        dayDinner: '',
        dayCauseDate: '',
        dayEndDate: '',
        midCauseDate: '',
        midChange: '',
        midDinner: '',
        midEndDate: '',
        midStartDate: '',
        midStartLineDate: '',
        nightCauseDate: '',
        nightChange: '',
        nightDinner: '',
        nightEndDate: '',
        nightStartDate: '',
        nightStartLineDate: '',
        shift: '',
        meeting: '',
        prepared: '',
        clear: ''
      },
      ReadAudit: [],
      readyStatus: true
    }
  },
  props: {
    isRedact: {},
    order: {}
  },
  watch: {
    'readyDate.classes' (val) {
      if (val === '白班') {
        this.readyDate.midCauseDate = null
        this.readyDate.midChange = null
        this.readyDate.midDinner = null
        this.readyDate.midEndDate = null
        this.readyDate.midStartDate = null
        this.readyDate.midStartLineDate = null
        this.readyDate.nightCauseDate = null
        this.readyDate.nightChange = null
        this.readyDate.nightDinner = null
        this.readyDate.nightEndDate = null
        this.readyDate.nightStartDate = null
        this.readyDate.nightStartLineDate = null
      } else if (val === '中班') {
        this.readyDate.dayStartDate = null
        this.readyDate.dayStartLineDate = null
        this.readyDate.dayChange = null
        this.readyDate.dayDinner = null
        this.readyDate.dayCauseDate = null
        this.readyDate.dayEndDate = null
        this.readyDate.nightCauseDate = null
        this.readyDate.nightChange = null
        this.readyDate.nightDinner = null
        this.readyDate.nightEndDate = null
        this.readyDate.nightStartDate = null
        this.readyDate.nightStartLineDate = null
      } else if (val === '夜班') {
        this.readyDate.dayStartDate = null
        this.readyDate.dayStartLineDate = null
        this.readyDate.dayChange = null
        this.readyDate.dayDinner = null
        this.readyDate.dayCauseDate = null
        this.readyDate.dayEndDate = null
        this.readyDate.midCauseDate = null
        this.readyDate.midChange = null
        this.readyDate.midDinner = null
        this.readyDate.midEndDate = null
        this.readyDate.midStartDate = null
        this.readyDate.midStartLineDate = null
      } else if (val === '多班') {
        this.readyDate.midCauseDate = null
        this.readyDate.midChange = null
        this.readyDate.midDinner = null
        this.readyDate.midEndDate = null
        this.readyDate.midStartDate = null
        this.readyDate.midStartLineDate = null
      }
    }
  },
  mounted () {
    Readyanimation(this.$)
  },
  methods: {
    // 获取包装车间准备时间列表
    Getpkgready (id) {
      this.$http(`${PACKAGING_API.PKGREADYLIST_API}`, 'POST', {
        order_id: id
      }).then(({data}) => {
        if (data.code === 0) {
          if (data.listForm.length > 0) {
            this.$emit('GetReadyStatus', data.listForm[0].status)
            this.readyDate = data.listForm[0]
            this.ReadAudit = data.listApproval
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    readyrul () {
      let ty = true
      if (this.order.workShopName !== '组装车间2（礼盒）') {
        if (this.readyDate.classes === '白班') {
          if (this.readyDate.dayStartLineDate && this.readyDate.dayStartDate && (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) && this.readyDate.dayCauseDate && this.readyDate.dayEndDate) {
            if (((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间白班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间白班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '中班') {
          if (this.readyDate.midCauseDate && this.readyDate.midStartDate && (this.readyDate.midDinner || this.readyDate.midDinner === 0) && this.readyDate.midCauseDate && this.readyDate.midEndDate) {
            if (((toDate(this.readyDate.midEndDate) - toDate(this.readyDate.midCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间中班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间中班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '夜班') {
          if (this.readyDate.nightStartLineDate && this.readyDate.nightStartDate && (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) && this.readyDate.nightCauseDate && this.readyDate.nightEndDate) {
            if (((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间夜班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间夜班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '多班') {
          if (this.readyDate.dayStartLineDate && this.readyDate.dayStartDate && (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) && this.readyDate.dayCauseDate && this.readyDate.dayEndDate && this.readyDate.nightStartLineDate && this.readyDate.nightStartDate && (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) && this.readyDate.nightCauseDate && this.readyDate.nightEndDate) {
            if (((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间白班工作结束时间不能早于停线时间')
              return false
            }
            if (((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间夜班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间白班和夜班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '白班') {
          if (this.readyDate.dayStartLineDate && this.readyDate.dayStartDate && (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) && this.readyDate.dayCauseDate && this.readyDate.dayEndDate) {
            if (((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间白班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间白班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '中班') {
          if (this.readyDate.midCauseDate && this.readyDate.midStartDate && (this.readyDate.midDinner || this.readyDate.midDinner === 0) && this.readyDate.midCauseDate && this.readyDate.midEndDate) {
            if (((toDate(this.readyDate.midEndDate) - toDate(this.readyDate.midCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间中班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间中班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '夜班') {
          if (this.readyDate.nightStartLineDate && this.readyDate.nightStartDate && (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) && this.readyDate.nightCauseDate && this.readyDate.nightEndDate) {
            if (((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间夜班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间夜班必填字段未填')
            return false
          }
        } else if (this.readyDate.classes === '多班') {
          if (this.readyDate.dayStartLineDate && this.readyDate.dayStartDate && (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) && this.readyDate.dayCauseDate && this.readyDate.dayEndDate && this.readyDate.nightStartLineDate && this.readyDate.nightStartDate && (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) && this.readyDate.nightCauseDate && this.readyDate.nightEndDate) {
            if (((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间白班工作结束时间不能早于停线时间')
              return false
            }
            if (((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000) < 0) {
              ty = false
              this.$message.error('准备时间夜班工作结束时间不能早于停线时间')
              return false
            }
          } else {
            ty = false
            this.$message.error('准备时间白班和夜班必填字段未填')
            return false
          }
        }
      }
      return ty
    },
    // 修改准备时间
    UpdateReady (id, str, resolve, reject) {
      this.readyDate.orderId = id
      if (!this.readyDate.status) {
        this.readyDate.status = str
      } else {
        if (this.readyDate.status === 'saved') { this.readyDate.status = str } else if (this.readyDate.status === 'noPass' && str === 'submit') { this.readyDate.status = str }
      }
      this.$http(`${PACKAGING_API.PKGREADYUPDATE_API}`, 'POST', this.readyDate).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      }).catch(() => {
        if (resolve) {
          reject('reject')
        }
      })
    }
  },
  computed: {},
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
  .readyshiftBtn{
    font-weight: normal;
    cursor: pointer;
    color: #3a8ee6;
  }
</style>
