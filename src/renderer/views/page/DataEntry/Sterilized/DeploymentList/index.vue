<template>
  <div class="main">
    <el-card class="searchCard searchCards">
      <el-row>
        <el-col>
          <el-form :model="formHeader" :inline="true" size="small" label-width="82px">
            <el-form-item label="生产工厂：">
              <el-select v-model="formHeader.factory" placeholder="请选择" class="width150px">
                <el-option value="">请选择</el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="formHeader.workShop" palceholder="请选择" class="width150px">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调配罐号：">
              <el-select v-model="formHeader.holderId" palceholder="请选择" class="width150px">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) in holderList" :key="index" :value="item.holderId" :label="item.holderName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调配日期：">
              <el-date-picker v-model="formHeader.allocateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width:140px"></el-date-picker>
            </el-form-item>
            <el-form-item label="调配单号：">
              <el-input style="width:150px" v-model="formHeader.orderNo"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="text-align: right">
        <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('ste:allocate:allocateListTp')">查询</el-button>
        <el-button type="primary" size="small" @click="CreateOrder()" v-if="isAuth('ste:allocate:allocateCreateTp')">生成</el-button>
      </el-row>
      <div class="toggleSearchBottom">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
    <div class="secondcard" style="padding-top: 0">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <el-card>
        <el-row>
          <el-col style="font-weight:bold;">调配列表</el-col>
        </el-row>
        <el-table :data="dataList" @row-dblclick="GetInfo" @selection-change="handleSelectionChange" border header-row-class-name="tableHead" style="margin-top:10px">
          <el-table-column type="selection" width="35" :selectable="CheckBoxInit" fixed="left"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="调配单号" prop="orderNo" width="130"></el-table-column>
          <el-table-column label="生产车间" prop="workShopName" width="100"></el-table-column>
          <el-table-column label="调配单日期" prop="allocateDate" width="170"></el-table-column>
          <el-table-column label="杀菌物料" width="190" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="计划BL原汁总量" prop="planAmount"></el-table-column>
          <el-table-column label="BL原汁总量" prop="blAmount"></el-table-column>
          <el-table-column label="单位" prop="unit" width="50"></el-table-column>
          <el-table-column label="调配罐号" width="130" prop="holderName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="调配日期" width="110" prop="allocateTime"></el-table-column>
          <el-table-column label="调配单备注" prop="remark" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="创建人员" prop="creator" width="150"></el-table-column>
          <el-table-column label="创建时间" prop="created" width="170"></el-table-column>
          <el-table-column label="调配人员" prop="changer" width="150"></el-table-column>
          <el-table-column label="调配时间" prop="changed" width="170"></el-table-column>
          <el-table-column width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="GoInfo(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.totalCount">
        </el-pagination>
        <el-row>
          <el-col style="font-weight:bold;">调配订单信息</el-col>
        </el-row>
        <el-table :data="orderInfoList" border header-row-class-name="tableHead" style="margin-top:10px">
          <el-table-column label=" 订单号" prop="orderNo" width="120"></el-table-column>
          <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              {{scope.row.materialCode}} {{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单数量" prop="planOutput" width="80"></el-table-column>
          <el-table-column label="订单单位" prop="outputUnit" width="80"></el-table-column>
          <el-table-column label="订单开始日期" prop="productDate"></el-table-column>
          <el-table-column label="订单结束日期"></el-table-column>
          <el-table-column label="生产调度员" prop="dispatchMan"></el-table-column>
          <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import {headanimation} from '@/net/validate'
import {BASICDATA_API, STERILIZED_API} from '@/api/api'
export default {
  name: 'watiDeploymentList',
  data () {
    return {
      formHeader: {
        factory: '',
        workShop: '',
        holderId: ''
      },
      pages: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: [],
      workshop: [],
      holderList: [],
      dataListAll: [],
      dataList: [],
      multipleSelection: [],
      orderInfoList: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
      this.GetHolderList(n)
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.workshop = []
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.formHeader.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.formHeader.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '杀菌'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.formHeader.workShop = data.typeList[0].deptId
            } else {
              this.formHeader.workShop = ''
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 获取罐
    GetHolderList (id) {
      this.$http(`${STERILIZED_API.JUICEDEPLOYMENTHOLDER}`, 'POST', {factory: id}).then(({data}) => {
        if (data.code === 0) {
          this.holderList = data.holderList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetList () {
      if (this.formHeader.factory === '') {
        this.$message.error('请选择工厂')
        return false
      }
      this.$http(`${STERILIZED_API.JUICEDEPLOYMENTLISTTP}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.dataListAll = data.orderInfo
          this.pages.currPage = 1
          this.dataList = this.GetPagesList()
          this.pages.totalCount = this.dataListAll.length
          this.orderInfoList = []
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 复选框初始状态
    CheckBoxInit (row, index) {
      if (row.status === '已保存') {
        return 1
      } else {
        return 0
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
      this.dataList = this.GetPagesList()
    },
    handleCurrentChange (val) {
      this.pages.currPage = val
      this.dataList = this.GetPagesList()
    },
    GetPagesList () {
      return this.dataListAll.slice((this.pages.currPage - 1) * this.pages.pageSize, Number((this.pages.currPage - 1) * this.pages.pageSize) + Number(this.pages.pageSize))
    },
    GetInfo (row) {
      this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {orderNo: row.id}).then(({data}) => {
        if (data.code === 0) {
          this.orderInfoList = data.allocateInfo.orderInfo
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GoInfo (row) {
      this.Sterilized = {
        orderNoList: [],
        orderNo: row.id
      }
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Sterilized-WaitDeploymentList-doDeployment')
      setTimeout(() => {
        this.$router.push({ name: `DataEntry-Sterilized-WaitDeploymentList-doDeployment` })
      }, 100)
    },
    CreateOrder () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选数据')
        return false
      }
      this.$confirm('确认生成调配单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATETP}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('生成成功')
            this.GetList()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  },
  computed: {
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    Sterilized: {
      get () {
        return this.$store.state.common.Sterilized
      },
      set (val) {
        this.$store.commit('common/updateSterilized', val)
      }
    }
  }
}
</script>
