<template>
  <el-dialog
    width="500px"
    title="修改密码"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="原密码：" prop="password">
          <el-input v-model="dataForm.password" placeholder="请输入原始密码" minlength="8" maxlength="12" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="dataForm.newPassword" placeholder="请输入新密码（8~12位数字大小写字母组合）" minlength="8" maxlength="12" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="conPassword">
          <el-input v-model="dataForm.conPassword" placeholder="请再次输入新密码（8~12位数字大小写字母组合）" minlength="8" maxlength="12" type="password"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit" icon="el-icon-edit-outline">修改密码</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {MAIN_API} from '@/api/api'
export default {
  name: 'updatePass',
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dataRule: {
        password: [
          { required: true, message: '原密码必填', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在 8 到 12 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在 8 到 12 个字符', trigger: 'blur' }
        ],
        conPassword: [
          {validator: validatePass2, trigger: 'blur', min: 8, max: 12}
        ]
      },
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        conPassword: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.visible = true
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http(`${MAIN_API.UPPASS_API}`, 'POST', this.dataForm).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
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
