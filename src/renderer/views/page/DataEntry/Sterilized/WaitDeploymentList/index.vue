<template>
  <div class="main">
    <el-card class="searchCards">
      <el-row>
        <el-col style="width:975px; float:left">
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
            <el-form-item label="生产物料：">
              <el-select v-model="formHeader.materialCode" palceholder="请选择" class="width150px">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) in materialList" :key="index" :value="item.materialCode" :label="item.materialCode + ' ' + item.materialName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker v-model="formHeader.created" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width:140px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col  style="width:127px; float:right">
          <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('ste:pkgOrder:orderList')">查询</el-button>
          <el-button type="primary" size="small" @click="isRedact = !isRedact" v-if="isAuth('ste:allocate:allocateOrderSave')">{{isRedact === false? '编辑' : '取消'}}</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="secondcard">
      <el-row>
        <el-col style="text-align: right">
          <el-button type="primary" size="small" @click="DoDeploy" :disabled="!isRedact">调配</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" :row-key="getRowKeys" @selection-change="handleSelectionChange" border header-row-class-name="tableHead" style="margin-top:10px">
        <el-table-column type="selection" width="35" :selectable="CheckBoxInit"></el-table-column>
        <el-table-column label="订单号" prop="orderNo" width="120"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            {{scope.row.materialCode}} {{scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column label="订单数量" prop="planOutput" width="80"></el-table-column>
        <el-table-column label="订单单位" prop="outputUnit" width="80"></el-table-column>
        <el-table-column label="订单开始日期" prop="productDate"></el-table-column>
        <!-- <el-table-column label="订单结束日期"></el-table-column> -->
        <el-table-column label="生产调度员" prop="dispatchMan"></el-table-column>
        <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formHeader.currPage"
        :page-sizes="[10, 15, 20]"
        :page-size="formHeader.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="formHeader.totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {BASICDATA_API, STERILIZED_API} from '@/api/api'
export default {
  name: 'watiDeploymentList',
  data () {
    return {
      isRedact: false,
      formHeader: {
        factory: '',
        workShop: '',
        materialCode: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: [],
      workshop: [],
      materialList: [],
      multipleSelection: [],
      dataList: [],
      checkList: []
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'formHeader.workShop' (n, o) {
      this.GetMaterialList()
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
    // 物料下拉
    GetMaterialList () {
      this.formHeader.materialCode = ''
      this.$http(`${STERILIZED_API.WAITDEPLOYMENTMATERIALISTAPI}`, 'POST', {factory: this.formHeader.factory, workShop: this.formHeader.workShop}).then(({data}) => {
        if (data.code === 0) {
          this.materialList = data.productsInfo
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 复选框初始状态
    CheckBoxInit (row, index) {
      if (this.isRedact === false) {
        return 0
      } else {
        return 1
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.checkList = []
      if (val) {
        val.forEach(row => {
          if (row) {
            this.checkList.push(row.orderNo)
          }
        })
      }
    },
    GetList (st) {
      if (this.formHeader.factory === '') {
        this.$message.error('请选择工厂')
        return false
      }
      if (this.formHeader.workShop === '') {
        this.$message.error('请选择车间')
        return false
      }
      if (st) {
        this.formHeader.currPage = 1
      }
      let prarms = {
        factory: this.formHeader.factory,
        workShop: this.formHeader.workShop,
        created: this.formHeader.created,
        materialCode: this.formHeader.materialCode,
        currPage: '1',
        pageSize: '9000'
      }
      this.$http(`${STERILIZED_API.WAITDEPLOYMENTLIST_API}`, 'POST', prarms).then(({data}) => {
        if (data.code === 0) {
          this.dataListAll = data.orderInfo.list
          this.dataList = data.orderInfo.list.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
          this.formHeader.totalCount = this.dataListAll.length
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 调配
    DoDeploy () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选订单')
      } else {
        let materialCode = this.multipleSelection[0].materialCode
        let dispatchMan = this.multipleSelection[0].dispatchMan
        for (let item of this.multipleSelection) {
          if (materialCode !== item.materialCode) {
            this.$message.error('物料冲突，请重新选择订单！')
            return false
          }
          if (dispatchMan !== item.dispatchMan) {
            this.$message.error('调度人员冲突，请重新选择订单！')
            return false
          }
        }
        let planOutputTotal = 0
        this.checkList.map((item) => {
          planOutputTotal = planOutputTotal + this.dataListAll.find(items => item === items.orderNo)['planOutput']
        })
        this.Sterilized = {
          factory: this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'],
          workshop: this.workshop.find(item => item.deptId === this.formHeader.workShop)['deptName'],
          factoryId: this.formHeader.factory,
          workshopId: this.formHeader.workShop,
          orderNoList: this.checkList,
          orderNo: '',
          planOutputTotal: planOutputTotal,
          materialCode: materialCode,
          materialName: this.multipleSelection[0].materialName
        }
        this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Sterilized-WaitDeploymentList-doDeployment')
        setTimeout(() => {
          this.$router.push({ name: `DataEntry-Sterilized-WaitDeploymentList-doDeployment` })
        }, 100)
      }
    },
    handleSizeChange (val) {
      this.formHeader.pageSize = val
      this.dataList = this.dataListAll.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
    },
    handleCurrentChange (val) {
      this.formHeader.currPage = val
      this.dataList = this.dataListAll.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
    },
    getRowKeys (row) {
      return row.orderNo
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
