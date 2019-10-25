<template>
  <div>
    <el-card class="box-card newCard" style="margin-bottom: 20px">
      <el-form :inline="true" :model="readyTimeDate" ref="timesForm" size="small" label-width="125px">
        <div class="clearfix" style="">
          <h3 style="font-size: 14px;line-height: 32px">准备工时 (单位:min)</h3>
          <el-button type="text" class="readyshiftBtn" name="ready" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
          <el-form-item label="班次：" style="float: right">
            <el-select v-model="readyTimeDate.classes" placeholder="请选择" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))">
              <el-option label="白班" value="白班"></el-option>
              <el-option label="中班" value="中班"></el-option>
              <el-option label="夜班" value="夜班"></el-option>
              <el-option label="多班" value="多班"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="readyBox" style="overflow: hidden">
          <el-row v-if="readyTimeDate.classes === '白班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
            <el-form-item label="交接班（白班）：">
              <el-input v-model="readyTimeDate.dayChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="班前会：" label-width="80px">
              <el-input v-model="readyTimeDate.dayChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产前准备：" label-width="100px">
              <el-input v-model="readyTimeDate.dayChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产后清场：" label-width="100px">
              <el-input v-model="readyTimeDate.dayChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="readyTimeDate.classes === '中班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
            <el-form-item label="交接班（中班）：">
              <el-input v-model="readyTimeDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="班前会：" label-width="80px">
              <el-input v-model="readyTimeDate.midChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产前准备：" label-width="100px">
              <el-input v-model="readyTimeDate.midChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产后清场：" label-width="100px">
              <el-input v-model="readyTimeDate.midChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="readyTimeDate.classes === '夜班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
            <el-form-item label="交接班（夜班）：">
              <el-input v-model="readyTimeDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="班前会：" label-width="80px">
              <el-input v-model="readyTimeDate.nightChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产前准备：" label-width="100px">
              <el-input v-model="readyTimeDate.nightChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
            <el-form-item label="生产后清场：" label-width="100px">
              <el-input v-model="readyTimeDate.nightChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="clearfix" style="margin-bottom: 20px">
        <h3 style="font-size: 14px;line-height: 32px">机器工时 (单位:min)</h3>
        <el-button type="text" class="readyshiftBtn" name="machine" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
      </div>
      <div class="machineBox" style="overflow: hidden">
        <el-row :gutter="10">
          <el-col :span="8" style="margin-bottom: 15px" v-for="(item, index) in Machine" :key="index">
            <el-card class="box-card">
              <div class="clearfix machinediv">
                <img src="@/assets/img/machineicon.png" alt="">
                <div style="margin-left: 15px">
                  <p class="machineTit">{{ item.deviceName }}</p>
                  <!--<p class="machineTxt">这台酱油炒麦机是2018年在日本进口的。</p>-->
                </div>
              </div>
              <el-row>
                <el-col :span="8"><el-button class="machineBtn" @click="machineStartOrEnd(true, item)" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))">开始</el-button></el-col>
                <el-col :span="8"><el-button class="machineBtn" @click="machineStartOrEnd(false, item)" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))">结束</el-button></el-col>
                <el-col :span="8"><el-button class="machineBtn" @click="machineTest(item)" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))">检测</el-button></el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-table :data="machineTimeData" header-row-class-name="tableHead" border tooltip-effect="dark" @row-dblclick="rowUpdateMachine" :row-class-name="RowDelFlag">
          <el-table-column label="日期" width="120" prop="productDate"></el-table-column>
          <el-table-column label="炒麦机" width="120" prop="deviceName"></el-table-column>
          <el-table-column label="开始时间" prop="openTime"></el-table-column>
          <el-table-column label="开始人" width="140" prop="openMan"></el-table-column>
          <el-table-column label="结束时间" prop="closeTime"></el-table-column>
          <el-table-column label="结束人" width="140" prop="closeMan"></el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))" @click="delmachine(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <audit-log :tableData="timeAuditlog"></audit-log>
    <machine-time v-if="visible" ref="machinetime" @changeMachineTime="changeMachineTime"></machine-time>
    <machine-test v-if="visible1" ref="machinetest"></machine-test>
    <machineUpdate v-if="visible2" ref="machinetimeupdate" @updateRow="updateRow"></machineUpdate>
  </div>
</template>

<script>
import { BASICDATA_API, WHT_API } from '@/api/api'
import { Readyanimation } from '@/net/validate'
import MachineTime from './machineTime'
import MachineTest from './machineTest'
import MachineUpdate from './machineUpdate'
export default {
  name: 'readyTime',
  data () {
    return {
      orderId: '',
      visible: false,
      visible1: false,
      visible2: false,
      readyTimeDate: {
        id: '',
        status: '',
        classes: '多班',
        dayChange: '',
        dayChangeBefore: '',
        dayChangePre: '',
        dayChangeAfter: '',
        midChange: '',
        midChangeBefore: '',
        midChangePre: '',
        midChangeAfter: '',
        nightChange: '',
        nightChangeBefore: '',
        nightChangePre: '',
        nightChangeAfter: ''
      },
      Machine: [],
      rows: {},
      timeAuditlog: [],
      machineTimeData: []
    }
  },
  props: {
    isRedact: {},
    formHeader: {}
  },
  watch: {
    'readyTimeDate.classes' (val) {
      if (val === '白班') {
        this.readyTimeDate.midChange = null
        this.readyTimeDate.midChangeBefore = null
        this.readyTimeDate.midChangePre = null
        this.readyTimeDate.midChangeAfter = null
        this.readyTimeDate.nightChange = null
        this.readyTimeDate.nightChangeBefore = null
        this.readyTimeDate.nightChangePre = null
        this.readyTimeDate.nightChangeAfter = null
      } else if (val === '中班') {
        this.readyTimeDate.dayChange = null
        this.readyTimeDate.dayChangeBefore = null
        this.readyTimeDate.dayChangePre = null
        this.readyTimeDate.dayChangeAfter = null
        this.readyTimeDate.nightChange = null
        this.readyTimeDate.nightChangeBefore = null
        this.readyTimeDate.nightChangePre = null
        this.readyTimeDate.nightChangeAfter = null
      } else if (val === '夜班') {
        this.readyTimeDate.dayChange = null
        this.readyTimeDate.dayChangeBefore = null
        this.readyTimeDate.dayChangePre = null
        this.readyTimeDate.dayChangeAfter = null
        this.readyTimeDate.midChange = null
        this.readyTimeDate.midChangeBefore = null
        this.readyTimeDate.midChangePre = null
        this.readyTimeDate.midChangeAfter = null
      }
    }
  },
  mounted () {
    Readyanimation(this.$)
  },
  methods: {
    // 获取准备时间数据
    GetReadyList (id) {
      let status = ''
      this.$http(`${WHT_API.READYTIMELIST_API}`, 'POST', {
        order_id: id
      }, false, false, false).then(({data}) => {
        if (data.code === 0) {
          if (data.listForm[0]) {
            this.readyTimeDate = data.listForm[0]
            status = data.listForm[0].status
          }
          this.machineTimeData = data.listFormMachine
          this.timeAuditlog = data.listApproval
        } else {
          this.$message.error(data.msg)
        }
      }).finally(() => {
        this.$emit('SetReadyStatus', status)
      })
    },
    // 准备时间修改
    UpdateReady (str, resolve, reject) {
      this.readyTimeDate.orderId = this.formHeader.orderId
      this.readyTimeDate.dayChange = ((this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) ? this.readyTimeDate.dayChange + '' : this.readyTimeDate.dayChange)
      this.readyTimeDate.dayChangeBefore = ((this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) ? this.readyTimeDate.dayChangeBefore + '' : this.readyTimeDate.dayChangeBefore)
      this.readyTimeDate.dayChangePre = ((this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) ? this.readyTimeDate.dayChangePre + '' : this.readyTimeDate.dayChangePre)
      this.readyTimeDate.dayChangeAfter = ((this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0) ? this.readyTimeDate.dayChangeAfter + '' : this.readyTimeDate.dayChangeAfter)
      this.readyTimeDate.midChange = ((this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) ? this.readyTimeDate.midChange + '' : this.readyTimeDate.midChange)
      this.readyTimeDate.midChangeBefore = ((this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) ? this.readyTimeDate.midChangeBefore + '' : this.readyTimeDate.midChangeBefore)
      this.readyTimeDate.midChangePre = ((this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) ? this.readyTimeDate.midChangePre + '' : this.readyTimeDate.midChangePre)
      this.readyTimeDate.midChangeAfter = ((this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0) ? this.readyTimeDate.midChangeAfter + '' : this.readyTimeDate.midChangeAfter)
      this.readyTimeDate.nightChange = ((this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) ? this.readyTimeDate.nightChange + '' : this.readyTimeDate.nightChange)
      this.readyTimeDate.nightChangeBefore = ((this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) ? this.readyTimeDate.nightChangeBefore + '' : this.readyTimeDate.nightChangeBefore)
      this.readyTimeDate.nightChangePre = ((this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) ? this.readyTimeDate.nightChangePre + '' : this.readyTimeDate.nightChangePre)
      this.readyTimeDate.nightChangeAfter = ((this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0) ? this.readyTimeDate.nightChangeAfter + '' : this.readyTimeDate.nightChangeAfter)
      if (!this.readyTimeDate.status) {
        this.readyTimeDate.status = str
      } else {
        if (this.readyTimeDate.status === 'saved') { this.readyTimeDate.status = str } else if (this.readyTimeDate.status === 'noPass' && str === 'submit') { this.readyTimeDate.status = str }
      }
      this.$http(`${WHT_API.READYTIMEUPDATE_API}`, 'POST', this.readyTimeDate).then(({data}) => {
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
    },
    // 机器工时修改
    UpdateMachine (str, resolve) {
      this.machineTimeData.forEach((item) => {
        item.orderId = this.formHeader.orderId
        if (item.status) {
          if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
        } else {
          item.status = str
        }
      })
      this.$http(`${WHT_API.MACHINETIMEUPDATE_API}`, 'POST', this.machineTimeData).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      })
    },
    // 校验
    Readyrul () {
      let ty = true
      let day = ((this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) && (this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) && (this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) && (this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0))
      let mid = ((this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) && (this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) && (this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) && (this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0))
      let night = ((this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) && (this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) && (this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) && (this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0))
      if (this.readyTimeDate.classes === '白班') {
        if (day) {} else {
          ty = false
          this.$message.error('准备时间白班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '中班') {
        if (mid) {} else {
          ty = false
          this.$message.error('准备时间中班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '夜班') {
        if (night) {} else {
          ty = false
          this.$message.error('准备时间夜班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '多班') {
        if (day && night) {} else {
          ty = false
          this.$message.error('准备时间多班必填项未填写完全')
          return false
        }
      }
      if (this.machineTimeData.length > 0) {
        this.machineTimeData.forEach((item, index) => {
          if (!item.closeTime) {
            ty = false
            this.$message.error('机器工时没结束，请结束后提交')
            return false
          }
        })
      } else {
        ty = false
        this.$message.error('机器工时为空数据')
        return false
      }
      return ty
    },
    // 机器列表双击
    rowUpdateMachine (row) {
      if (!(this.isRedact && (this.readyTimeDate.status === 'noPass' || this.readyTimeDate.status === 'saved' || this.readyTimeDate.status === ''))) {
        return false
      }
      this.rows = row
      this.visible2 = true
      this.$nextTick(() => {
        this.$refs.machinetimeupdate.init(row)
      })
    },
    updateRow (row) {
      Object.keys(row).forEach((key) => {
        this.rows[key] = row[key]
      })
      this.visible2 = false
    },
    // 机器删除
    delmachine (row) {
      row.delFlag = '1'
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    // 炒麦机
    GetMachine (productLine) {
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '炒麦机',
        deptId: productLine,
        currPage: '1',
        pageSize: '50'
      }).then(({data}) => {
        if (data.code === 0) {
          this.Machine = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 开始结束按钮
    machineStartOrEnd (st, me) {
      let tmp = st
      this.machineTimeData.forEach((item, index) => {
        if (item.deviceId === me.deviceId && item.openTime && !item.closeTime) {
          if (st) {
            tmp = false
            this.$message.error('请结束后开始')
          } else {
            tmp = true
          }
        }
      })
      if (tmp) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.machinetime.init(me, st)
        })
      } else if (!st && !tmp) {
        this.$message.error('请开始后结束')
      }
    },
    // 检测
    machineTest (me) {
      this.visible1 = true
      this.$nextTick(() => {
        this.$refs.machinetest.init(me, this.formHeader.orderId)
      })
    },
    // 更新机器工时
    changeMachineTime (date) {
      this.visible = false
      if (date.endDate) {
        this.machineTimeData.forEach((item, index) => {
          if (item.deviceId === date.deviceId && !item.closeTime) {
            item.closeTime = date.endDate
            item.closeMan = date.changer
            item.closeOperateTime = ''
            item.delFlag = '0'
          }
        })
      } else if (date.startDate) {
        this.machineTimeData.push({
          delFlag: '0',
          id: '',
          productDate: this.formHeader.productDate,
          deviceName: date.deviceName,
          deviceId: date.deviceId,
          openTime: date.startDate,
          openOperateTime: '',
          openMan: date.changer,
          closeTime: '',
          closeOperateTime: '',
          closeMan: ''
        })
      }
    }
  },
  computed: {},
  components: {
    MachineTime,
    MachineTest,
    MachineUpdate,
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss">
.readyBox{
  input{
    width: 153px;
  }
}
.readyshiftBtn{
  padding: 0;
  margin-left: 15px;
  line-height: 32px;
  /*float: right;*/
}
.machineBox{
  .box-card{
    padding: 0;
    .el-card__body{
      padding: 0;
    }
  }
  .machinediv{
    display: flex;
    padding: 20px;
    img{
      width: 48px;
      height: 48px;
    }
    .machineTit{
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .machineTxt{
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px
    }
  }
  .machineBtn{
    width: 100%;
    height: 40px;
  }
}

</style>
