<template>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card>
          <el-row>
            <el-button type="primary" v-if="isAuth('sys:menu:save')" @click="addOrUpdateHandle()" style="margin-bottom: 22px;" size="small">新增</el-button>
          </el-row>
          <el-row>
            <el-table
              header-row-class-name="tableHead"
              :data="dataList"
              border
              tooltip-effect="dark"
              style="width: 100%;">
              <el-table-column
                prop="menuId"
                header-align="left"
                align="left"
                width="80"
                label="ID">
              </el-table-column>
              <table-tree-column
                prop="name"
                header-align="left"
                treeKey="menuId"
                width="150"
                :show-overflow-tooltip=true
                label="名称">
              </table-tree-column>
              <el-table-column
                prop="parentName"
                header-align="left"
                align="left"
                width="100"
                :show-overflow-tooltip=true
                label="上级菜单">
              </el-table-column>
              <el-table-column
                header-align="left"
                align="left"
                :show-overflow-tooltip=true
                label="图标">
                <template slot-scope="scope">
                  <i class="iconfont" :class="scope.row.icon"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="type"
                header-align="left"
                align="left"
                :show-overflow-tooltip=true
                label="类型">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.type === '0'" size="small">目录</el-tag>
                  <el-tag v-else-if="scope.row.type === '1'" size="small" type="success">菜单</el-tag>
                  <el-tag v-else-if="scope.row.type === '2'" size="small" type="info">按钮</el-tag>
                  <el-tag v-else-if="scope.row.type === '3'" size="small" type="success">三级页面</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="orderNum"
                header-align="left"
                align="left"
                width="80"
                :show-overflow-tooltip=true
                label="排序号">
              </el-table-column>
              <el-table-column
                prop="url"
                header-align="left"
                align="left"
                width="180"
                :show-overflow-tooltip=true
                label="菜单URL">
              </el-table-column>
              <el-table-column
                prop="perms"
                header-align="left"
                align="left"
                width="180"
                :show-overflow-tooltip=true
                label="授权标识">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="left"
                align="left"
                width="88"
                label="操作">
                <template slot-scope="scope">
                  <el-button style="padding: 0;" v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
                  <el-button style="padding: 0;" v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-card>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </el-col>
</template>

<script>
import TableTreeColumn from '@/views/components/table-tree-column'
import { treeDataTranslate } from '@/net/validate'
import AddOrUpdate from './menuAdd'
import {MAIN_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'menuManage',
  data () {
    return {
      addOrUpdateVisible: false,
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.$http(`${MAIN_API.MENULIST_API}`, 'GET', {}).then(({data}) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.addOrUpdateVisible = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.MENUDEL_API}/${id}`, 'POST', {}).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  },
  computed: {},
  components: {
    TableTreeColumn,
    AddOrUpdate
  }
}
</script>

<style scoped>

</style>
