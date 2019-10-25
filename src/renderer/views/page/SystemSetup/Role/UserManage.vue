<template>
  <el-dialog
    title="人员管理"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
      <el-row>
        <el-transfer
          filterable
          :titles="['未分配人员', '已分配人员']"
          :filter-method="filterMethod"
          filter-placeholder="请输入用户名称"
          v-model="selctId"
          :data="userlist">
        </el-transfer>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updatauser">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {SYSTEMSETUP_API} from '@/api/api'
import { transfer } from '@/net/validate'
export default {
  name: 'UserManage',
  data () {
    return {
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      },
      roleId: '',
      userlist: [],
      selctId: [],
      type: true,
      visible: false
    }
  },
  mounted () {
  },
  methods: {
    init (id) {
      this.roleId = id
      this.$http(`${SYSTEMSETUP_API.ROLEUSER_API}`, 'POST', {
        roleId: id
      }).then(({data}) => {
        if (data.code === 0) {
          this.userlist = transfer(data.list).res
          this.selctId = transfer(data.list).selcedid
        } else {
          this.$message.error(data.msg)
        }
        this.visible = true
      })
    },
    updatauser () {
      if (this.type) {
        this.type = false
        this.$http(`${SYSTEMSETUP_API.ROLEUSERUPDATE_API}`, 'POST', {
          roleId: this.roleId,
          userId: this.selctId
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
      } else {
        this.$message.error('请分配人员')
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
