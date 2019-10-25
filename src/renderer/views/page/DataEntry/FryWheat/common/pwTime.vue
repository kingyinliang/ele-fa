<template>
  <div>
    <!--<el-button type="primary" @click="AddpwTimeDate()" size="small" :disabled="!isRedact" style="float: right;margin-bottom: 10px">新增</el-button>-->
    <el-table header-row-class-name="tableHead" :data="pwTimeDate" :row-class-name="RowDelFlag" border tooltip-effect="dark">
      <el-table-column label="生产订单号">
        <template slot-scope="scope">
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column label="准备工时" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.prepareTime" :disabled="!(isRedact && order.orderId)" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="60">
        <template slot-scope="scope">
          <span>H</span>
        </template>
      </el-table-column>
      <el-table-column label="*机器工时" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.machineTime" :disabled="!(isRedact && order.orderId)" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="60">
        <template slot-scope="scope">
          <span>H</span>
        </template>
      </el-table-column>
      <el-table-column label="*人工工时" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.humanTime" :disabled="!(isRedact && order.orderId)" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="60">
        <template slot-scope="scope">
          <span>H</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="110">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expInfo" :disabled="!(isRedact && order.orderId)" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" width="60" fixed="right">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact" @click="delpwTimeDate(scope.row)"></el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <audit-log :tableData="timeAudit"></audit-log>
  </div>
</template>

<script>
import {WHT_API} from '@/api/api'
export default {
  name: 'pwTime',
  data () {
    return {
      pwTimeDate: [{
        id: '',
        orderNo: '',
        orderId: '',
        status: '',
        prepareTime: '',
        prepareTimeUnit: 'H',
        machineTime: '',
        machineTimeUnit: 'H',
        humanTime: '',
        humanTimeUnit: 'H',
        remark: ''
      }],
      timeAudit: []
    }
  },
  props: {
    isRedact: {},
    order: {}
  },
  mounted () {
  },
  methods: {
    // 获取pw工时数据
    GetPwTimeList () {
      if (this.order.orderId) {
        let status = ''
        this.$http(`${WHT_API.MATERIELTIMELIST_API}`, 'POST', {
          order_id: this.order.orderId
        }).then(({data}) => {
          if (data.code === 0) {
            if (data.listForm && data.listForm.length !== 0) {
              this.pwTimeDate = data.listForm
              this.pwTimeDate[0].prepareTime = this.pwTimeDate[0].prepareTime
              this.pwTimeDate[0].machineTime = this.pwTimeDate[0].machineTime
              this.pwTimeDate[0].humanTime = this.pwTimeDate[0].humanTime
              status = data.listForm[0].status
              this.timeAudit = data.listApproval
            } else {
              this.pwTimeDate = [{
                id: '',
                orderNo: this.order.orderNo,
                orderId: '',
                status: '',
                prepareTime: '',
                prepareTimeUnit: 'H',
                machineTime: '',
                machineTimeUnit: 'H',
                humanTime: '',
                humanTimeUnit: 'H',
                remark: ''
              }]
            }
          } else {
            this.$message.error(data.msg)
          }
        }).finally(() => {
          this.$emit('SetReadyStatus', status)
        })
      }
    },
    // pw工时校验
    timerul () {
      let ty = true
      if ((this.pwTimeDate[0].prepareTime || this.pwTimeDate[0].prepareTime === 0) && (this.pwTimeDate[0].machineTime || this.pwTimeDate[0].machineTime === 0) && (this.pwTimeDate[0].humanTime || this.pwTimeDate[0].humanTime === 0)) {} else {
        ty = false
        this.$message.error('工时录入必填项未填')
        return false
      }
      return ty
    },
    // pw工时修改
    PwTimeUpdate (str, resolve, reject) {
      this.pwTimeDate[0].prepareTime = this.pwTimeDate[0].prepareTime
      this.pwTimeDate[0].machineTime = this.pwTimeDate[0].machineTime
      this.pwTimeDate[0].humanTime = this.pwTimeDate[0].humanTime
      this.pwTimeDate[0].orderId = this.order.orderId
      this.pwTimeDate[0].status = str
      this.$http(`${WHT_API.MATERIELTIMEUPDATE_API}`, 'POST', this.pwTimeDate[0]).then(({data}) => {
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
    AddpwTimeDate () {
      this.pwTimeDate.push({})
    },
    delpwTimeDate (row) {
      row.delFlag = '1'
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
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

<style scoped>

</style>
