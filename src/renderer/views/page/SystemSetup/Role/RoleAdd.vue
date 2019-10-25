<template>
  <el-dialog
    title="功能分配"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div style="height: 300px;overflow: auto">
      <el-tree
        :data="menuList"
        :props="menuListTreeProps"
        node-key="menuId"
        ref="menuListTree"
        :default-expand-all="true"
        :expand-on-click-node="false"
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
import { treeDataTranslate } from '@/net/validate'
import {MAIN_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'RoleAdd',
  data () {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      type: true
    }
  },
  mounted () {
  },
  methods: {
    // 获取功能
    init (id) {
      this.roleId = id
      this.$http(`${MAIN_API.MENULIST_API}`, 'GET', {}).then(({data}) => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.visible = true
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.LISTMENU_API}`, 'POST', {
          roleId: id
        }).then(({data}) => {
          if (data.code === 0) {
            this.$refs.menuListTree.setCheckedKeys(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (this.type) {
        this.type = false
        this.$http(`${SYSTEMSETUP_API.ROLEMENUUPDATE_API}`, 'POST', {
          roleId: this.roleId,
          menuId: [[].concat(this.$refs.menuListTree.getCheckedKeys()), [].concat(this.$refs.menuListTree.getHalfCheckedKeys())]
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
