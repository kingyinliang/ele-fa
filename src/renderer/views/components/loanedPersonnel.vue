<template>
  <el-dialog width="850px" title="借调人员" :close-on-click-modal="false" :visible.sync="visible">
    <el-row>
      <el-col style="width: 250px">
        <el-card style="height: 303px;overflow-y: scroll">
          <el-row style="font-size: 16px;color: black;margin-bottom: 10px">组织架构</el-row>
          <el-tree :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" @node-click="setdetail" ref="orgtree" :expand-on-click-node="false"></el-tree>
        </el-card>
      </el-col>
      <el-col style="width: 250px">
        <el-card style="height: 303px;overflow-y: scroll">
          <el-input v-model="filterText" size="small" placeholder="搜索人员"></el-input>
          <el-tree ref="userlistTree" :filter-node-method="filterNode" node-key="userId" @node-click="treeNodeClick" :data="userlist" show-checkbox :props="userListTreeProps"  :expand-on-click-node="false" @check-change="userTree"></el-tree>
        </el-card>
      </el-col>
      <el-col style="width: 50px;padding: 70px 5px">
        <el-button type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px" @click="delSelcted()" :disabled="!tree2Status"></el-button>
        <el-button type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0" @click="addSelcted()" :disabled="!tree1Status"></el-button>
      </el-col>
      <el-col style="width: 250px">
        <el-card style="height: 303px;overflow-y: scroll">
          <el-input v-model="filterText1" size="small" placeholder="搜索人员"></el-input>
          <el-tree ref="userlistTree1" :filter-node-method="filterNode1" node-key="userId" @node-click="treeNodeClick1" :data="selctId"  show-checkbox :props="selctListTreeProps"  :expand-on-click-node="false" @check-change="userTree1"></el-tree>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updateUser">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api'
export default {
  name: 'loanedPersonnel',
  data () {
    return {
      visible: false,
      filterText: '',
      userlist: [],
      tree1Status: false,
      filterText1: '',
      selctId: [],
      tree2Status: false,
      userListTreeProps: {
        label: function (data, node) {
          return data.realName + '（' + ((data.workNum !== null && data.workNum !== '') ? data.workNum : data.workNumTemp) + '）'
        },
        children: ''
      },
      selctListTreeProps: {
        label: function (data, node) {
          return data.label
        },
        children: ''
      }
    }
  },
  props: {
    OrgTree: {},
    arrList: {}
  },
  watch: {
    filterText (val) {
      this.$refs.userlistTree.filter(val)
    },
    filterText1 (val) {
      this.$refs.userlistTree1.filter(val)
    }
  },
  mounted () {
  },
  methods: {
    init (userId) {
      this.visible = true
      this.selctId = []
      this.userlist = []
      if (userId && userId.length > 0) {
        userId.forEach((item, index) => {
          this.selctId.push({label: item})
        })
      }
    },
    // 根据组织架构查人
    setdetail (data) {
      this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
        deptId: data.deptId,
        param: '',
        currPage: '1',
        pageSize: '1000'
      }).then(({data}) => {
        if (data.code === 0) {
          this.userlist = data.page.list
          this.tree1Status = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 部门下树节点点击
    treeNodeClick (data) {
      if (JSON.stringify(this.$refs.userlistTree.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
        let arr = this.$refs.userlistTree.getCheckedNodes()
        arr.push(data)
        this.$refs.userlistTree.setCheckedNodes(arr)
      }
    },
    // 选中树节点点击
    treeNodeClick1 (data) {
      if (JSON.stringify(this.$refs.userlistTree1.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
        let arr = this.$refs.userlistTree1.getCheckedNodes()
        arr.push(data)
        this.$refs.userlistTree1.setCheckedNodes(arr)
      }
    },
    // 往左
    delSelcted () {
      this.$refs.userlistTree1.getCheckedNodes().forEach((item, index) => {
        this.selctId.splice(this.selctId.indexOf(item), 1)
      })
      this.tree2Status = false
    },
    // 往右
    addSelcted () {
      this.$refs.userlistTree.getCheckedNodes().forEach((item, index) => {
        let obj = {}
        obj.label = item.realName + '（' + ((item.workNum !== null && item.workNum !== '') ? item.workNum : item.workNumTemp) + '）'
        if (JSON.stringify(this.selctId).indexOf(JSON.stringify(obj)) === -1) {
          this.selctId.push(obj)
        }
      })
    },
    // 部门搜索人员
    filterNode (value, data) {
      if (!value) return true
      // 如果没有workNum, 使用workNumTemp
      let workNum = data.workNum ? data.workNum : data.workNumTemp
      return data.realName.indexOf(value) !== -1 || workNum.indexOf(value) !== -1
    },
    // 选中搜索人员
    filterNode1 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 部门下树节点选中状态监听
    userTree () {
      if (this.$refs.userlistTree.getCheckedNodes().length > 0) {
        this.tree1Status = true
      } else {
        this.tree1Status = false
      }
    },
    // 选中树节点选中状态监听
    userTree1 () {
      if (this.$refs.userlistTree1.getCheckedNodes().length > 0) {
        this.tree2Status = true
      } else {
        this.tree2Status = false
      }
    },
    // 确定人员
    updateUser () {
      this.visible = false
      let row = []
      this.selctId.forEach((item) => {
        row.push(item.label)
      })
      this.$emit('changeUser', row)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
