<template>
  <div>
    <div class="clearfix">
      <el-button type="primary" @click="AddWorkerDate(WorkerDate)" size="small" :disabled="!isRedact" style="float: right">新增</el-button>
    </div>
    <el-table header-row-class-name="tableHead" :data="WorkerDate" border tooltip-effect="dark">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="白/中/夜班" width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.classType" placeholder="请选择" size="small" :disabled="!isRedact">
            <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="班组/工序" width="100">
        <template slot-scope="scope">
          <el-select filterable v-model="scope.row.deptId" placeholder="请选择" size="small" :disabled="!isRedact">
            <el-option :label="iteam.deptName" :value="iteam.deptId" v-for="(iteam, index) in Team" :key="index"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="人员属性" width="130">
        <template slot="header">
          <i class="reqI">*</i>
          <span>人员属性</span>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.userType" placeholder="请选择" size="small" :disabled="!isRedact" @change="userTypesele(scope.row)">
            <el-option label="正式" value="正式"></el-option>
            <el-option label="借调" value="借调"></el-option>
            <el-option label="临时工" value="临时工"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="人员选择" :show-overflow-tooltip="true" width="300">
        <template slot="header">
          <i class="reqI">*</i>
          <span>人员选择</span>
        </template>
        <template slot-scope="scope">
          <div class="required" style="min-height: 32px">
            <span v-if="!isRedact" style="cursor: pointer">
              <i v-for="(item,index) in scope.row.userId" :key="index">{{item}}，</i>
            </span>
            <span style="cursor: pointer" @click="selectUser(scope.row)" v-if="isRedact && scope.row.userType !=='临时工'">
              <i v-for="(item,index) in scope.row.userId" :key="index">{{item}}，</i>
              <i>点击选择人员</i>
            </span>
            <span style="cursor: pointer" @click="dayLaborer(scope.row)" v-if="scope.row.userType=='临时工' && isRedact">
              <i v-for="(item,index) in scope.row.userId" :key="index">{{item}}，</i>
              <i>点击输入临时工</i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="241" label="开始时间">
        <template slot-scope="scope">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="scope.row.startDate" size="small" :disabled="!isRedact"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="用餐时间" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dinner" size="small" type="number" min="0" :disabled="!isRedact"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="241" label="结束时间">
        <template slot-scope="scope">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="scope.row.endDate" size="small" :disabled="!isRedact"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="工作时长" width="100">
        <template slot-scope="scope">
          <p>{{workTime(scope.row.endDate, scope.row.startDate, scope.row)}}H</p>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact" @click="delUser(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <p style="font-size: 14px;line-height: 62px">实际作业人数：{{countMan}}</p>
    <audit-log :tableData="UserAudit"></audit-log>
    <official-worker v-if="officialWorkerStatus" ref="officialWorker" @changeUser="changeUser"></official-worker>
    <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" :OrgTree="OrgTree" :arrList="arrList"></loaned-personnel>
    <temporary-worker v-if="temporaryWorkerStatus" ref="temporaryWorker" @changeUser="changeUser"></temporary-worker>
  </div>
</template>

<script>
import { PACKAGING_API, SYSTEMSETUP_API, BASICDATA_API } from '@/api/api'
import { toDate } from '@/net/validate'
import OfficialWorker from './officialWorker'
import LoanedPersonnel from './loanedPersonnel'
import TemporaryWorker from './temporaryWorker'
export default {
  name: 'worker',
  data () {
    return {
      WorkerDate: [],
      UserAudit: [],
      productShift: [],
      Team: [],
      OrgTree: [],
      arrList: [],
      row: {},
      officialWorkerStatus: false,
      loanedPersonnelStatus: false,
      temporaryWorkerStatus: false
    }
  },
  props: {
    isRedact: {},
    order: {}
  },
  watch: {
    'order.factory' (n, o) {
      this.GetProductShift(n)
    }
  },
  mounted () {
    // this.getTree()
    this.GetProductShift()
  },
  methods: {
    // 人员列表
    GetTimeUserList (list) {
      this.WorkerDate = list
    },
    GetUserList (id) {
      this.$http(`${PACKAGING_API.PKGUSERLIST_API}`, 'POST', {
        order_id: id
      }, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.WorkerDate = data.listForm
          this.UserAudit = data.listApproval
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 返回人员列表
    GetUser () {
      return this.WorkerDate
    },
    // 人员保存
    TimeUserSave () {},
    UpdateUser (str, resolve) {
      if (this.WorkerDate.length > 0) {
        this.WorkerDate.forEach((item) => {
          if (item.status) {
            if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
          } else {
            item.status = str
          }
        })
        this.$http(`${PACKAGING_API.PKGUSERUPDATE_API}`, 'POST', this.WorkerDate).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error('修改人员' + data.msg)
          }
          if (resolve) {
            resolve('resolve')
          }
        })
      } else {
        if (this.order.orderId) {
          this.$http(`${PACKAGING_API.PKGUSERUPDATE_API}`, 'POST', [{
            status: '',
            orderId: this.order.orderId,
            classType: '',
            deptId: '',
            userType: '',
            userId: [],
            startDate: '',
            dinner: '60',
            endDate: '',
            remark: ''
          }]).then(({data}) => {
            if (data.code === 0) {
            } else {
              this.$message.error('修改人员' + data.msg)
            }
            if (resolve) {
              resolve('resolve')
            }
          })
        } else {
          if (resolve) {
            resolve('resolve')
          }
        }
      }
    },
    // 校验
    userrul () {
      let ty = true
      if (this.WorkerDate.length === 0) {
        ty = false
        this.$message.error('人员不能为空')
        return false
      }
      this.WorkerDate.forEach((item) => {
        if (item.userType && item.userId.length !== 0 && item.startDate && item.endDate) {} else {
          ty = false
          this.$message.error('人员必填项未填')
          return false
        }
      })
      return ty
    },
    // 获取生产班次
    GetProductShift (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'product_shift'}).then(({data}) => {
        if (data.code === 0) {
          this.productShift = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间下工序
    GetTeam (id, faid) {
      if (id) {
        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {id: id, factory: faid}).then(({data}) => {
          if (data.code === 0) {
            this.Team = data.teamList
          } else {
            this.$message.error(data.msg)
          }
        })
        // this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
        //   if (data.code === 0) {
        //     this.Team = data.childList
        //   } else {
        //     this.$message.error(data.msg)
        //   }
        // })
      } else {
        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {factory: faid}).then(({data}) => {
          if (data.code === 0) {
            this.Team = data.teamList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 人员属性下拉
    userTypesele (row) {
      row.userId = []
    },
    // 获取组织结构树
    getTree (factory) {
      this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {flag: factory}).then(({data}) => {
      // this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
        if (data.code === 0) {
          this.OrgTree = data.deptList
          this.arrList = [this.OrgTree[0].children[0].deptId]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 选择人员 正式借调
    selectUser (row) {
      this.row = row
      if (row.userType === '借调') {
        this.loanedPersonnelStatus = true
        this.$nextTick(() => {
          this.$refs.loanedPersonnel.init(row.userId)
        })
      } else if (row.userType === '正式') {
        if (row.deptId) {
          this.officialWorkerStatus = true
          this.$nextTick(() => {
            this.$refs.officialWorker.init(row.deptId, row.userId)
          })
        } else {
          this.$message.error('请选择工序')
        }
      } else {
        this.$message.error('请选择人员属性')
      }
    },
    // 临时工
    dayLaborer (row) {
      this.row = row
      this.temporaryWorkerStatus = true
      this.$nextTick(() => {
        this.$refs.temporaryWorker.init(row)
      })
    },
    // 员工确认
    changeUser (userId) {
      this.row.userId = userId
      this.officialWorkerStatus = false
      this.loanedPersonnelStatus = false
      this.temporaryWorkerStatus = false
    },
    // 人员删除
    delUser (row) {
      this.WorkerDate.splice(this.WorkerDate.indexOf(row), 1)
    },
    // 新增人员
    AddWorkerDate (form) {
      if (form.length) {
        form.push({
          status: '',
          orderId: this.order.orderId,
          classType: '',
          deptId: '',
          userType: '',
          userId: [],
          startDate: form[form.length - 1].startDate,
          dinner: '60',
          endDate: form[form.length - 1].endDate,
          remark: ''
        })
      } else {
        form.push({
          status: '',
          orderId: this.order.orderId,
          classType: '',
          deptId: '',
          userType: '',
          userId: [],
          startDate: '',
          dinner: '60',
          endDate: '',
          remark: ''
        })
      }
    }
  },
  computed: {
    countMan: function () {
      let num = 0
      if (this.WorkerDate) {
        this.WorkerDate.forEach((item) => {
          num += item.userId.length
        })
        return num
      }
    },
    workTime: function () {
      return function (end, start, row) {
        if (end && start && row.delFlag !== '1') {
          return ((toDate(end) - toDate(start)) / 3600000).toFixed(2) * 1 - ((row.dinner * 1) / 60).toFixed(2) * 1
        }
      }
    }
  },
  components: {
    OfficialWorker,
    LoanedPersonnel,
    TemporaryWorker,
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
