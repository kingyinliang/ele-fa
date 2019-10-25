<template>
  <el-dialog
    title="部门分配"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div style="height: 300px;overflow: auto">
      <el-tree
        :data="OrgTree"
        node-key="deptId"
        ref="deptListTree"
        :default-expand-all="true"
        show-checkbox>
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'RoleDept',
  data () {
    return {
      roleId: '',
      visible: false,
      type: true,
      OrgTree: []
    }
  },
  mounted () {
  },
  methods: {
    // 获取组织结构树
    init (id) {
      this.roleId = id
      this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {flag: '1'}).then(({data}) => {
        if (data.code === 0) {
          this.OrgTree = data.deptList
        } else {
          this.$message.error(data.msg)
        }
        this.visible = true
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.LISTDEPT_API}`, 'POST', {
          roleId: id
        }).then(({data}) => {
          if (data.code === 0) {
            this.$refs.deptListTree.setCheckedKeys(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 提交
    dataFormSubmit () {
      if (this.type) {
        this.type = false
        this.$http(`${SYSTEMSETUP_API.ROLEDEPTUPDATE_API}`, 'POST', {
          roleId: this.roleId,
          deptId: [[].concat(this.$refs.deptListTree.getCheckedKeys()), [].concat(this.$refs.deptListTree.getHalfCheckedKeys())]
        }).then(({data}) => {
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
            this.$message.error(data.msg)
          }
          this.visible = true
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
