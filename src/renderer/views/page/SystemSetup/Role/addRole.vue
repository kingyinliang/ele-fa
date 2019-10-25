<template>
  <el-dialog
    :title="roleId?'修改角色信息':'新增角色'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="85px">
        <el-form-item label="角色名称：">
          <el-input v-model="dataForm.roleName" placeholder="手动输入"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="dataForm.roleCode" placeholder="手动输入"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'addRole',
  data () {
    return {
      roleId: '',
      visible: false,
      dataForm: {
        roleId: '',
        roleName: '',
        roleCode: ''
      },
      type: true
    }
  },
  mounted () {
  },
  methods: {
    init (id) {
      if (id) {
        this.roleId = id.roleId
        this.dataForm.roleId = id.roleId
        this.dataForm.roleName = id.roleName
        this.dataForm.roleCode = id.roleCode
      } else {
        this.roleId = ''
        this.dataForm = {}
      }
      this.visible = true
    },
    // 提交
    dataFormSubmit () {
      if (this.type) {
        this.type = false
        this.$http(`${this.roleId ? SYSTEMSETUP_API.ROLEUPDATE_API : SYSTEMSETUP_API.ROLEADD_API}`, 'POST', this.dataForm).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.type = true
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.type = true
            this.$message.error(data.msg)
          }
        })
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
