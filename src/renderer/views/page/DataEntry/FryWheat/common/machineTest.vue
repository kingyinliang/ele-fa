<template>
<el-dialog :title="`${machineName}检测`" :visible.sync="visible" width="850px">
  <el-button type="primary" @click="AddMachineTest" size="small" style="float: right;margin-bottom: 15px">新增</el-button>
  <el-table :data="machineTest" header-row-class-name="tableHead" :row-class-name="RowDelFlag"  border tooltip-effect="dark">
    <el-table-column label="检测时间" width="160">
      <template slot-scope="scope">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择" v-model="scope.row.checkTime" size="small"></el-date-picker>
      </template>
    </el-table-column>
    <el-table-column label="焦糊率（%）*" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.cokingRate" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="膨胀率*" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.expandRate" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="粉碎度*" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.piecesRate" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="检测人员" width="120" prop="changer"></el-table-column>
    <el-table-column label="备注">
      <template slot-scope="scope">
        <el-input v-model="scope.row.remark" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="55" fixed="right">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="dellist(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button @click="visible = false" size="small">取消</el-button>
    <el-button type="primary" @click="updateMachineTest" size="small">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
import { WHT_API } from '@/api/api'
import { getNewDate } from '@/net/validate'
export default {
  name: 'machineTest',
  data () {
    return {
      visible: false,
      machineId: '',
      machineName: '',
      orderId: '',
      machineTest: []
    }
  },
  mounted () {
  },
  methods: {
    init (machine, orderId) {
      this.visible = true
      this.machineId = machine.deviceId
      this.machineName = machine.deviceName
      this.orderId = orderId
      this.$http(`${WHT_API.MACHINETESTlist_API}`, 'POST', {
        device_id: this.machineId,
        order_id: this.orderId
      }).then(({data}) => {
        if (data.code === 0) {
          this.machineTest = data.record
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    AddMachineTest () {
      this.machineTest.push({
        id: '',
        checkTime: `${getNewDate()} ${new Date().getHours()}:${new Date().getMinutes()}:00`,
        cokingRate: '',
        expandRate: '',
        piecesRate: '',
        remark: '',
        orderId: this.orderId,
        deviceId: this.machineId,
        delFlag: '0'
      })
    },
    // 删除
    dellist (row) {
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
    // 校验
    Machinerul () {
      let ty = true
      this.machineTest.forEach((item, index) => {
        if (!item.cokingRate || !item.expandRate || !item.piecesRate) {
          ty = false
          this.$message.error('必填项未填')
          return false
        }
      })
      return ty
    },
    updateMachineTest () {
      if (!this.Machinerul()) {
        return false
      }
      this.$http(`${WHT_API.MACHINETESTUPDATE_API}`, 'POST', this.machineTest).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('保存成功')
          this.visible = false
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
