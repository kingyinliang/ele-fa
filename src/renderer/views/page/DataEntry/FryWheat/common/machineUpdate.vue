<template>
  <el-dialog :title="machineTimeData.deviceName" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="machineTimeData" size="small" label-width="125px">
      <el-form-item label="开始时间：" v-if="machineTimeData.openTime">
        <el-date-picker type="datetime" v-model="machineTimeData.openTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="开始人：" v-if="machineTimeData.openTime">
        <span>{{machineTimeData.openMan}}</span>
      </el-form-item>
      <el-form-item label="结束时间：" v-if="machineTimeData.closeTime">
        <el-date-picker type="datetime" v-model="machineTimeData.closeTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束人：" v-if="machineTimeData.closeTime">
        <span>{{machineTimeData.closeMan}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updateMachineTime()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'machineUpdate',
  data () {
    return {
      visible: false,
      machineTimeData: {}
    }
  },
  mounted () {
  },
  methods: {
    init (row) {
      this.visible = true
      this.machineTimeData = Object.assign({}, row)
    },
    updateMachineTime () {
      this.visible = false
      let obj = Object.assign({}, this.machineTimeData)
      this.$emit('updateRow', obj)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
