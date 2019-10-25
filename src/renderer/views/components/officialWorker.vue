<template>
  <el-dialog title="人员分配" :close-on-click-modal="false" :visible.sync="visible">
    <el-row>
      <el-col style="width: 500px">
        <el-transfer filterable :titles="['未分配人员', '已分配人员']" :filter-method="filterMethod" filter-placeholder="请输入用户名称" v-model="selctId" :data="userlist"></el-transfer>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updatauser">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api'
import { setUserList } from '@/net/validate'
export default {
  name: 'officialWorker',
  data () {
    return {
      visible: false,
      selctId: [],
      userlist: [],
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      }
    }
  },
  mounted () {
  },
  methods: {
    // 根据部门id查人
    init (id, userId) {
      this.visible = true
      this.$http(`${SYSTEMSETUP_API.USERALL_API}`, 'POST', id ? {dept_id: id} : {}).then(({data}) => {
        if (data.code === 0) {
          this.userlist = setUserList(data.listUser)
          this.selctId = userId
          this.visible = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 确定人员
    updatauser () {
      this.visible = false
      this.$emit('changeUser', this.selctId)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
