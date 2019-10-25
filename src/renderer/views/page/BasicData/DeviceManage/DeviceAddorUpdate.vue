<template>
  <el-dialog
    :title="form.deviceId?'修改设备信息':'新增设备'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
      <el-form :model="form" size="small" label-width="110px" class="devicedialog" @keyup.enter.native="submitForm()">
        <el-form-item label="设备编号：">
          <el-input v-model="form.deviceNo" placeholder="手工录入"></el-input>
        </el-form-item>
        <el-form-item label="设备描述：">
          <el-input v-model="form.deviceName" placeholder="手工录入"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'DeviceAddorUpdate',
  data () {
    return {
      id: '',
      visible: false,
      form: {
        deviceName: '',
        deviceNo: ''
      },
      submitType: true
    }
  },
  mounted () {
  },
  methods: {
    init (deptId, id) {
      this.visible = true
      this.form = {}
      if (id) {
        this.form = id
        this.id = id.deviceId
      }
      this.form.deptId = deptId
    },
    // 提交订单
    submitForm () {
      if (this.submitType) {
        this.submitType = false
        if (this.id) {
          this.$http(`${BASICDATA_API.DEVICEUPDATE_API}`, 'POST', this.form).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.submitType = true
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.submitType = true
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$http(`${BASICDATA_API.DEVICEADD_API}`, 'POST', this.form).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.submitType = true
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.submitType = true
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
