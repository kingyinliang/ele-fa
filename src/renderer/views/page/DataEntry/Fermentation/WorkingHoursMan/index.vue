<template>
  <div class="main">
    <el-card class="searchCard">
      <el-row>
        <el-col>
          <el-form :inline="true" :model="form" size="small" label-width="85px">
            <el-form-item label="生产工厂：">
              <el-select v-model="form.factory" placeholder="请选择" class="width170px">
                <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="form.workShop" placeholder="请选择" class="width170px">
                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="罐号：">
              <el-select v-model="form.holderId" clearable filterable class="width170px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) of holderList" :key="index" :label="item.holderName" :value="item.holderId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="form.status" clearable class="width170px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
              <el-input v-model="form.orderNo" style="width:170px"></el-input>
            </el-form-item>
            <el-form-item label="订单日期：">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width:170px"></el-date-picker> - <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width:170px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="SearchList(true)" v-if="isAuth('fer:report:selectReports')">查询</el-button>
          <el-button type="primary" class="button" size="small" v-if="isAuth('fer:report:workingSaveAndSubmit')" @click="isRedact = !isRedact">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="SaveForm()">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm()">提交</el-button>
        </template>
        <template style="float:right; margin-left: 10px;"><el-button type="primary" @click="DataSynchronism()" v-if="isAuth('fer:report:workingSaveAndSubmit')" size="small">报工同步</el-button></template>
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="tabClick" type="border-card" style="margin-top:15px">
      <el-tab-pane name="noMatureReport" label="未成熟">
        <el-table :data="dataList" border header-row-class-name="tableHead" @selection-change="handleSelectionChange" @row-dblclick="editRow">
          <el-table-column type="selection" :selectable="CheckBoxInit"></el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" width="100">
            <template slot-scope="scope">
              <label :style="{'color': scope.row.status === 'fail'? 'red' : scope.row.status === 'success'? '#7ED321' : '' }">{{scope.row.status === 'success' ? '已审核' : scope.row.status === 'fail' ? '审核不通过' : scope.row.status === 'init' ? '已保存' : scope.row.status === 'submit' ? '已提交' : ''}}</label>
            </template>
          </el-table-column>
          <el-table-column label="容器" :show-overflow-tooltip="true" prop="holderNo"></el-table-column>
          <el-table-column label="订单号" :show-overflow-tooltip="true" width="120" prop="orderNo"></el-table-column>
          <el-table-column label="物料" :show-overflow-tooltip="true" width="210">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单量(L)" :show-overflow-tooltip="true" width="90" prop="amount"></el-table-column>
          <el-table-column label="实际生产数量" :show-overflow-tooltip="true" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.actAmount" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="50"></el-table-column>
          <el-table-column label="准备工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prepareTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="prepareTimesUnit" width="50"></el-table-column>
          <el-table-column label="机器工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.machineTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="machineTimesUnit" width="50"></el-table-column>
          <el-table-column label="人工工时" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.humanTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="humanTimesUnit" width="50"></el-table-column>
          <el-table-column label="执行开始日期" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.startDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="执行结束日期" prop="amount" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.endDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="部分/完全报工" :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              <!-- <el-select v-model="scope.row.reportType" :disabled="GetCheck(scope.row)" size="small">
                <el-option v-for="(item, index) in reportTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select> -->
              <el-input v-model="scope.row.reportType" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作人员" :show-overflow-tooltip="true" prop="creator" width="100"></el-table-column>
          <el-table-column label="操作时间" :show-overflow-tooltip="true" width="170" prop="changed"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.totalCount">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane name="maturedReport" label="已成熟">
        <el-table :data="dataList" border header-row-class-name="tableHead" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="CheckBoxInit"></el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" width="100">
            <template slot-scope="scope">
              <label :style="{'color': scope.row.status === 'fail'? 'red' : scope.row.status === 'success'? '#7ED321' : '' }">{{scope.row.status === 'success' ? '已审核' : scope.row.status === 'fail' ? '审核不通过' : scope.row.status === 'init' ? '已保存' : scope.row.status === 'submit' ? '已提交' : ''}}</label>
            </template>
          </el-table-column>
          <el-table-column label="容器" :show-overflow-tooltip="true" prop="holderNo"></el-table-column>
          <el-table-column label="订单号" :show-overflow-tooltip="true" width="120" prop="orderNo"></el-table-column>
          <el-table-column label="物料" :show-overflow-tooltip="true" width="200">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单量(L)" :show-overflow-tooltip="true" width="90" prop="amount"></el-table-column>
          <el-table-column label="实际生产数量" :show-overflow-tooltip="true" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.actAmount" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="50"></el-table-column>
          <el-table-column label="准备工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prepareTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="prepareTimesUnit" width="50"></el-table-column>
          <el-table-column label="机器工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.machineTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="machineTimesUnit" width="50"></el-table-column>
          <el-table-column label="人工工时" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.humanTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="humanTimesUnit" width="50"></el-table-column>
          <el-table-column label="执行开始日期" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.startDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="执行结束日期" prop="amount" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.endDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="部分/完全报工" :show-overflow-tooltip="true" width="130">
            <template slot-scope="scope">
              <!-- <el-select v-model="scope.row.reportType" :disabled="GetCheck(scope.row)" size="small">
                <el-option v-for="(item, index) in reportTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select> -->
              <el-input v-model="scope.row.reportType" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作人员" :show-overflow-tooltip="true" prop="creator" width="100"></el-table-column>
          <el-table-column label="操作时间" :show-overflow-tooltip="true" width="170" prop="changed"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.totalCount">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane name="rework" label="返工订单">
        <el-table :data="dataList" border header-row-class-name="tableHead" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="CheckBoxInit"></el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" width="100">
            <template slot-scope="scope">
              <label :style="{'color': scope.row.status === 'fail'? 'red' : scope.row.status === 'success'? '#7ED321' : '' }">{{scope.row.status === 'success' ? '已审核' : scope.row.status === 'fail' ? '审核不通过' : scope.row.status === 'init' ? '已保存' : scope.row.status === 'submit' ? '已提交' : ''}}</label>
            </template>
          </el-table-column>
          <el-table-column label="容器" :show-overflow-tooltip="true" prop="holderNo"></el-table-column>
          <el-table-column label="订单号" :show-overflow-tooltip="true" width="120" prop="orderNo"></el-table-column>
          <el-table-column label="物料" :show-overflow-tooltip="true" width="200">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单量(L)" :show-overflow-tooltip="true" width="90" prop="amount"></el-table-column>
          <el-table-column label="实际生产数量" :show-overflow-tooltip="true" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.actAmount" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="50"></el-table-column>
          <el-table-column label="准备工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prepareTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="prepareTimesUnit" width="50"></el-table-column>
          <el-table-column label="机器工时" :show-overflow-tooltip="true" prop="created">
            <template slot-scope="scope">
              <el-input v-model="scope.row.machineTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="machineTimesUnit" width="50"></el-table-column>
          <el-table-column label="人工工时" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.humanTimes" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位" :show-overflow-tooltip="true" prop="humanTimesUnit" width="50"></el-table-column>
          <el-table-column label="执行开始日期" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.startDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="执行结束日期" prop="amount" width="150">
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row.endDate" placeholder="选择日期" :disabled="GetCheck(scope.row)" size="small" style="width:140px;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="部分/完全报工" :show-overflow-tooltip="true" width="130">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reportType" :disabled="GetCheck(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作人员" :show-overflow-tooltip="true" prop="creator" width="100"></el-table-column>
          <el-table-column label="操作时间" :show-overflow-tooltip="true" width="180" prop="changed"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.totalCount">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-card style="margin-top:15px">
      <div class="audit"><i class="iconfont factory-shouqicaidan"></i><span>审核日志</span></div>
      <el-table border :data="LogList" header-row-class-name="tableHead">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="审核动作">
          <template slot-scope="scope">
            {{scope.row.status === 'checked' ? '审核成功' : scope.row.status === 'noPass' ? '审核失败' : scope.row.status === 'submit' ? '提交' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="审核意见" prop="memo"></el-table-column>
        <el-table-column label="审核人" prop="verifyMan"></el-table-column>
        <el-table-column label="审核时间" prop="verifyDate"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { BASICDATA_API, FERMENTATION_API } from '@/api/api'
// import Loglist from './common/logList'
export default {
  name: 'working',
  data () {
    return {
      form: {
        factory: '',
        workShop: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: '',
      workshop: '',
      isRedact: false,
      statusList: [{
        name: '已保存',
        value: 'init'
      }, {
        name: '已提交',
        value: 'submit'
      }, {
        name: '审核成功',
        value: 'success'
      }, {
        name: '审核失败',
        value: 'fail'
      }],
      reportTypeList: [{
        name: '部分报工',
        value: 'part'
      }, {
        name: '完全报工',
        value: 'all'
      }],
      activeName: 'noMatureReport',
      multipleSelection: [],
      holderList: [],
      dataList: [],
      LogList: []
    }
  },
  mounted () {
    this.GetFactoryList()
  },
  watch: {
    'form.factory' (n, o) {
      this.GetWorkshopList(n)
      this.GetHolderList()
    },
    'form.workShop' (n, o) {
      setTimeout(() => {
        this.GetHolderList()
      }, 900)
      // this.GetHolderList()
    }
  },
  methods: {
    // 获取工厂
    GetFactoryList () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.form.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    GetWorkshopList (id) {
      this.form.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '发酵'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.workshop = data.typeList
              if (data.typeList.length > 0) {
                this.form.workShop = data.typeList[0].deptId
              }
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 罐
    GetHolderList () {
      this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENT_API}`, 'POST', {factory: this.form.factory, deptId: this.form.workShop}).then(({data}) => {
        if (data.code === 0) {
          this.holderList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查询
    SearchList (st) {
      if (st) {
        this.form.currPage = 1
      }
      this.form.reportType = this.activeName
      this.$http(`${FERMENTATION_API.WORKINGHOURSMANLIST_API}`, 'POST', this.form).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.data.list
          this.dataList.map((item) => {
            if (item.reportType === 'part') {
              item.reportType = ''
            } else {
              item.reportType = 'X'
            }
          })
          this.form.totalCount = data.data.totalCount
          this.LogList = []
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    tabClick (value) {
      this.activeName = value.name
      this.SearchList()
      this.form.currPage = 1
      this.LogList = []
      // console.log(this.activeName)
    },
    // 复选框勾选
    CheckBoxInit (row, index) {
      if (this.isRedact === false || row.status === 'submit' || row.status === 'success') {
        return 0
      } else {
        return 1
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.form.pageSize = val
      this.SearchList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.form.currPage = val
      this.SearchList()
    },
    SaveForm (types) {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先勾选数据')
      } else {
        let url
        let msg
        if (types === 'submit') {
          // 非空判断
          for (var i in this.multipleSelection) {
            if (this.multipleSelection[i].actAmount === '' || this.multipleSelection[i].prepareTimes === '' || this.multipleSelection[i].machineTimes === '' || this.multipleSelection[i].humanTimes === '' || this.multipleSelection[i].startDate === '' || this.multipleSelection[i].endDate === '' || this.multipleSelection[i].unMatureUse === '' || this.multipleSelection[i].actAmount === null || this.multipleSelection[i].prepareTimes === null || this.multipleSelection[i].machineTimes === null || this.multipleSelection[i].humanTimes === null || this.multipleSelection[i].startDate === null || this.multipleSelection[i].endDate === null || this.multipleSelection[i].unMatureUse === null) {
              this.$message.error('请填写必填项')
              return false
            }
          }
          msg = '提交'
          url = FERMENTATION_API.WORKINGHOURSMANSUBMIT_API
        } else {
          msg = '保存'
          url = FERMENTATION_API.WORKINGHOURSMANSAVE_API
        }
        this.$http(url, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success(msg + '成功')
            this.SearchList()
            this.isRedact = false
            this.form.currPage = 1
            this.LogList = []
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    SubmitForm () {
      this.$confirm('是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.SaveForm('submit')
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    GetLogList (orderId) {
      this.$http(`${FERMENTATION_API.WORKINGHOURSMANLOGLIST_API}`, 'POST', {orderId: orderId}).then(({data}) => {
        if (data.code === 0) {
          this.LogList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    editRow (row) {
      this.$http(`${FERMENTATION_API.WORKINGHOURSMANLOGLIST_API}`, 'POST', {orderId: row.orderId}).then(({data}) => {
        if (data.code === 0) {
          this.LogList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetCheck (row) {
      // console.log(!this.isRedact || row.status === 'submit' || row.status === 'success')
      return (!this.isRedact || row.status === 'submit' || row.status === 'success')
    },
    // 数据同步
    DataSynchronism () {
      this.$http(`${FERMENTATION_API.WORKINGHOURTONGBU_API}`, 'GET').then(({data}) => {
        if (data.code === 0) {
          this.$message.success('同步成功')
        } else {
          this.$message.error('同步失败')
        }
      })
    }
  }
  // components: {
  //   Loglist
  // }
}
</script>

<style lang="less" >
.width170px {width:170px}
.audit{
  line-height: 40px;
  i{
    font-size: 22px;
    float: left;
  }
  span{
    margin-left: 12px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
<style lang="less" scoped>
.searchCard {
  .el-button--primary,.el-button--primary:focus{
    color: #000000;
    background-color: #FFFFFF;
    border-color: #D9D9D9;
  }
  .el-button--primary:hover{
    background-color: #1890FF;
    color: #FFFFFF
  }
  .el-button--primary:first-child{
    background-color: #1890FF;
    color: #FFFFFF;
    border-color: #1890FF;
  }
}
</style>
