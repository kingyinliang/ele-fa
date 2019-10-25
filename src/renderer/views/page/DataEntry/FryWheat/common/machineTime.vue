<template>
  <el-dialog :title="machineTimeData.deviceName" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="machineTimeData" size="small" label-width="125px">
      <el-form-item label="开始时间：" v-if="status">
        <el-date-picker type="datetime" v-model="machineTimeData.startDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：" v-if="!status">
        <el-date-picker type="datetime" v-model="machineTimeData.endDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="操作时间：">
        <span>{{machineTimeData.changed}}</span>
      </el-form-item>
      <el-form-item label="操作人：">
        <span>{{machineTimeData.changer = `${this.realName}(${this.userName})`}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updateMachineTime()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getNewDate } from '@/net/validate'
export default {
  name: 'machineTime',
  data () {
    return {
      visible: false,
      status: false,
      machine: '',
      machineTimeData: {
        startDate: '',
        endDate: '',
        changed: getNewDate(),
        changer: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    init (me, str) {
      this.visible = true
      this.machineTimeData = {
        deviceId: '',
        startDate: '',
        endDate: '',
        changed: getNewDate(),
        changer: ''
      }
      if (me) {
        this.machineTimeData.deviceId = me.deviceId
        this.machineTimeData.deviceName = me.deviceName
      }
      if (str) {
        this.status = str
      }
    },
    updateMachineTime () {
      this.visible = false
      this.$emit('changeMachineTime', this.machineTimeData)
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name },
      set (val) { this.$store.commit('user/updateName', val) }
    },
    realName: {
      get () { return this.$store.state.user.realName },
      set (val) { this.$store.commit('user/updateName', val) }
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
