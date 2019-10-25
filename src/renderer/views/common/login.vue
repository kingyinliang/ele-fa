<template>
  <div>
    <video width="100%" height="100%" autoplay ref="videos" id="videos" muted src="@/assets/img/video.mp4">
      您的浏览器不支持 video 标签。
    </video>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="loginForm" @keyup.enter.native="submitForm('ruleForm2')">
      <el-form-item label="账号：" prop="user">
      <el-input v-model="ruleForm2.user" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="loginFormBg"></div>
    <el-dialog
      width="500px"
      title="修改密码"
      :visible.sync="visible">
      <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
      <el-button type="primary" @click="dataFormSubmit" icon="el-icon-edit-outline">修改密码</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {MAIN_API} from '@/api/api'

export default {
  name: 'login',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (value.length !== 8) {
        callback(new Error('长度为 8 个字符工号'))
      } else {
        callback()
      }
    }
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
      },
      ruleForm2: {
        user: '',
        pass: ''
      },
      curr: 0,
      videoList: [],
      rules2: {
        user: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        pass: [
          { min: 8, max: 12, message: '长度在 8 到 12 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    var that = this
    this.$refs.videos.addEventListener('ended', function () {
      that.play()
    })
  },
  methods: {
    play (e) {
      this.curr++
      if (this.curr >= this.videoList.length) this.curr = 0
      this.$refs.videos.load()
      this.$refs.videos.play()
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
                  this.$router.push({path: '/home'})
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http(`${MAIN_API.LOGIN_API}`, 'POST', {
          // this.$http(`http://localhost:3000/mds/login`, 'POST', {
            username: this.ruleForm2.user,
            password: this.ruleForm2.pass
          }).then(res => {
            if (res.data.code === 0) {
              this.$cookie.set('token', res.data.Authorization)
              this.mainTabs = []
              this.Pkgfactoryid = ''
              this.PkgworkShop = ''
              this.PkgproductDate = ''
              this.PkgorderNo = ''
              if (res.data.list[0].isFirst === '1') {
                this.visible = true
              } else {
                // window.sessionStorage.setItem('menuList', JSON.stringify(res.data.data.menuList))
                this.$router.push({path: '/home'})
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    Pkgfactoryid: {
      get () { return this.$store.state.common.Pkgfactoryid },
      set (val) { this.$store.commit('common/updateFactoryid', val) }
    },
    PkgworkShop: {
      get () { return this.$store.state.common.PkgworkShop },
      set (val) { this.$store.commit('common/updateWorkShop', val) }
    },
    PkgproductDate: {
      get () { return this.$store.state.common.PkgproductDate },
      set (val) { this.$store.commit('common/updateProductDate', val) }
    },
    PkgorderNo: {
      get () { return this.$store.state.common.PkgorderNo },
      set (val) { this.$store.commit('common/updateOrderNo', val) }
    }
  },
  components: {}
}
</script>

<style lang="scss">
video{
  object-fit: fill;
}
.loginForm{
  width: 400px;
  height: 180px;
  position: fixed;
  top: 200px;
  right: 100px;
  z-index: 999;
  label{
    color: white!important;
  }
  input{
    background: #ffffff!important;
  }
}
.loginFormBg{
  border-radius: 10px;
  background-color: rgba(60, 60, 60, 0.6);
  box-shadow: 0px 5px 19px 1px
  rgba(214, 221, 237, 0.45);
  width: 425px;
  height: 220px;
  position: fixed;
  top: 165px;
  right: 65px;
}
</style>
