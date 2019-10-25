<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <!--<div class="topTitle">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item>系统管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>定时任务</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <div class="main">
      <el-card>
        <div class="mod-schedule">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(true)">
            <el-form-item>
              <el-input v-model="dataForm.beanName" placeholder="bean名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getDataList(true)">查询</el-button>
              <el-button v-if="isAuth('sys:schedule:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
              <el-button v-if="isAuth('sys:schedule:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
              <el-button v-if="isAuth('sys:schedule:pause')" type="danger" @click="pauseHandle()" :disabled="dataListSelections.length <= 0">批量暂停</el-button>
              <el-button v-if="isAuth('sys:schedule:resume')" type="danger" @click="resumeHandle()" :disabled="dataListSelections.length <= 0">批量恢复</el-button>
              <el-button v-if="isAuth('sys:schedule:run')" type="danger" @click="runHandle()" :disabled="dataListSelections.length <= 0">批量立即执行</el-button>
              <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="logHandle()">日志列表</el-button>
            </el-form-item>
          </el-form>
          <el-table
            header-row-class-name="tableHead"
            :data="dataList"
            tooltip-effect="dark"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              width="34">
            </el-table-column>
            <el-table-column
              prop="jobId"
              width="55"
              label="ID">
            </el-table-column>
            <el-table-column
              prop="beanName"
              :show-overflow-tooltip=true
              label="bean名称">
            </el-table-column>
            <el-table-column
              prop="methodName"
              :show-overflow-tooltip=true
              label="方法名称">
            </el-table-column>
            <el-table-column
              prop="params"
              width="80"
              :show-overflow-tooltip=true
              label="参数">
            </el-table-column>
            <el-table-column
              prop="cronExpression"
              width="100"
              :show-overflow-tooltip=true
              label="cron表达式">
            </el-table-column>
            <el-table-column
              prop="remark"
              width="100"
              :show-overflow-tooltip=true
              label="备注">
            </el-table-column>
            <el-table-column
              prop="status"
              width="63"
              header-align="left"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" size="small">正常</el-tag>
                <el-tag v-else size="small" type="danger">暂停</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :show-overflow-tooltip=true
              width="232"
              label="操作">
              <template slot-scope="scope">
                <el-button style="padding: 1px 0;" v-if="isAuth('sys:schedule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
                <el-button style="padding: 1px 0;" v-if="isAuth('sys:schedule:delete')" type="text" size="small" @click="deleteHandle(scope.row.jobId)">删除</el-button>
                <el-button style="padding: 1px 0;" v-if="isAuth('sys:schedule:pause')" type="text" size="small" @click="pauseHandle(scope.row.jobId)">暂停</el-button>
                <el-button style="padding: 1px 0;" v-if="isAuth('sys:schedule:resume')" type="text" size="small" @click="resumeHandle(scope.row.jobId)">恢复</el-button>
                <el-button style="padding: 1px 0;" v-if="isAuth('sys:schedule:run')" type="text" size="small" @click="runHandle(scope.row.jobId)">立即执行</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
          <!-- 弹窗, 日志列表 -->
          <log v-if="logVisible" ref="log"></log>
        </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>
import {SYSTEMSETUP_API} from '@/api/api'
import AddOrUpdate from './schedule-add-or-update'
import Log from './schedule-log'
export default {
  name: 'schedule',
  data () {
    return {
      dataForm: {
        beanName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      logVisible: false
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (st) {
      if (st) {
        this.pageIndex = 1
      }
      this.dataListLoading = true
      this.$http(`${SYSTEMSETUP_API.SCHEDULELIST_API}`, 'GET', {
        page: this.pageIndex,
        limit: this.pageSize,
        beanName: this.dataForm.beanName
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.SCHEDULEDEL_API}`, 'POST', ids).then(({data}) => {
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
    },
    // 暂停
    pauseHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.SCHEDULEPAUSE_API}`, 'POST', ids).then(({data}) => {
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
    },
    // 恢复
    resumeHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.SCHEDULERESUME_API}`, 'POST', ids).then(({data}) => {
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
    },
    // 立即执行
    runHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${SYSTEMSETUP_API.SCHEDULERUN_API}`, 'POST', ids).then(({data}) => {
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
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  },
  computed: {},
  components: {
    AddOrUpdate,
    Log
  }
}
</script>

<style scoped>

</style>
