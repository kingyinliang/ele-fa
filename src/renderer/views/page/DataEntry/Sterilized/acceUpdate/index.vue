<template>
  <div style="padding: 5px 10px">
    <el-card class="searchCard  newCard" style="margin-bottom: 5px">
      <el-row type="flex">
        <el-col>
          <el-form :inline="true" size="small" :model="formHeader" label-width="75px" class="topform">
            <el-form-item label="生产工厂：">
              <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="formHeader.productDate" style="width: 180px"></el-date-picker>
            </el-form-item>
            <el-form-item label="杀菌锅：">
              <el-select v-model="formHeader.panId" placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option v-for="(sole, index) in PotList" :key="index" :value="sole.holderId" :label="sole.holderName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产订单：">
              <el-input v-model="formHeader.orderNo" placeholder="请输入" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="生产物料：">
              <el-select v-model="formHeader.materialCode" filterable placeholder="请选择" style="width: 180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.materialCode+' '+ item.materialName" v-for="(item, index) in Matertail" :key="index" :value="item.materialCode"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="width: 250px">
          <el-row>
            <el-button type="primary" size="small" @click="GetDataList(true)">查询</el-button>
            <el-button type="primary" size="small" @click="isRedact = !isRedact">{{isRedact?'取消':'编辑'}}</el-button>
          </el-row>
          <el-row style="margin-top: 15px" v-if="isRedact ">
            <el-button type="primary" size="small" @click="SavedOr('已保存')">保存</el-button>
            <el-button type="primary" size="small" @click="pushData('已推送')">推送</el-button>
            <el-button type="primary" size="small" @click="pushData('已确认')">确认</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="searchCard  newCard">
      <div class="clearfix" style="padding-top: 5px;padding-bottom: 5px">
        <h3 style="line-height: 32px">订单列表</h3>
      </div>
      <el-table ref="multipleTable" header-row-class-name="tableHead" :data="dataList" @selection-change="handleSelectionChange" @row-dblclick="Dblckick" border tooltip-effect="dark">
        <el-table-column type="selection" :selectable="CheckBoxOrder" width="40"></el-table-column>
        <el-table-column type="index" width="55" label="序号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="辅料状态" width="80" prop="supStatus" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="订单号" width="80" prop="orderNo" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="杀菌锅" width="80" prop="panName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true"><template slot-scope="scope">{{scope.row.materialCode + ' ' + scope.row.materialName}}</template></el-table-column>
        <el-table-column label="订单量" width="80" prop="planOutPut" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="单位" width="80" prop="unit" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="杀菌状态" width="110" prop="steStatus" :show-overflow-tooltip="true">
          <template slot="header"><i class="reqI">*</i><span>杀菌状态</span></template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.steStatus" placeholder="请选择" size="mini" :disabled="!isRedact || scope.row.supStatus === '已确认'">
              <el-option label="正常订单"  value="正常订单"></el-option>
              <el-option label="异常订单"  value="异常订单"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态备注" width="80" prop="steStatusRemake" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input v-model="scope.row.steStatusRemake" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="SAP备注" width="80" prop="sapRemake" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="提交人员" width="80" prop="oprDate" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="提交时间" width="80" prop="oprter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-row >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </el-row>
    </el-card>
    <el-card class="newCard" style="margin: 5px 0">
      <div class="clearfix" style="padding-top: 5px;padding-bottom: 5px">
        <h3 style="line-height: 32px">辅料添加记录</h3>
      </div>
      <el-table header-row-class-name="tableHead" :data="AddSupDate" border tooltip-effect="dark">
        <el-table-column type="index" width="55" label="序号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="添加状态" width="80" prop="addStatus" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true"><template slot-scope="scope">{{scope.row.materialCode + ' ' + scope.row.materialName}}</template></el-table-column>
        <el-table-column label="需求数量" width="80" prop="planAmount" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="差额" width="80" prop="unit" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.diffAmount = scope.row.adjustAmount*1 - scope.row.planAmount*1}}
          </template>
        </el-table-column>
        <el-table-column label="调整后需求数量" width="120" prop="unit" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input v-model="scope.row.adjustAmount" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="50" prop="unit" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="批次" width="100" prop="batch" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="领用数量" width="100" prop="receiveAmount" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="newCard">
      <div class="clearfix" style="padding-top: 5px;padding-bottom: 5px">
        <h3 style="line-height: 32px;float: left">增补料记录</h3>
        <el-button type="primary" icon="el-icon-plus" circle size="mini" :disabled="!isRedact" style="float: right" @click="addSup()"></el-button>
      </div>
      <el-table header-row-class-name="tableHead" :data="SupDate" border tooltip-effect="dark">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="添加状态" width="80" prop="addStatus" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true">
          <template slot="header"><i class="reqI">*</i><span>物料</span></template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.materialCode" placeholder="请选择" size="mini" style="width: 180px">
              <el-option label="请选择"  value=""></el-option>
              <el-option :label="item.materialCode + ' ' + item.materialName" v-for="(item, index) in Materails" :key="index" :value="item.materialCode"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="添加数量" width="110" prop="addAmount" :show-overflow-tooltip="true">
          <template slot="header"><i class="reqI">*</i><span>添加数量</span></template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.addAmount" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="100" prop="unit" :show-overflow-tooltip="true">
          <template slot="header"><i class="reqI">*</i><span>单位</span></template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.unit" placeholder="请选择" size="mini">
              <el-option label="请选择"  value=""></el-option>
              <el-option :label="item.value" v-for="(item, index) in Unit" :key="index" :value="item.code"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="100" label="批次">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batch" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="领用数量" width="80" prop="receiveAmount" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注" width="90">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" :disabled="!isRedact || scope.row.supStatus === '已确认'" placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="del(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getFactory, getWorkshop} from '@/net/validate'
import {BASICDATA_API, STERILIZED_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      isRedact: false,
      formHeader: {
        factory: '',
        workShop: '',
        productDate: '',
        panId: '',
        orderNo: '',
        materialCode: ''
      },
      factory: [],
      workshop: [],
      PotList: [],
      Matertail: [],
      Materails: [],
      Unit: [],
      SumDataList: [],
      dataList: [],
      multipleSelection: [],
      AddSupDate: [],
      SupDate: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 0
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.formHeader.workShop = ''
      getWorkshop(this, n, '杀菌')
      this.GetPot(n)
      this.GetMaterail(n)
      this.GetUnit(n)
    }
  },
  mounted () {
    getFactory(this)
  },
  methods: {
    GetDataList (st) {
      if (st) {
        this.currPage = 1
      }
      this.$http(`${STERILIZED_API.STE_SUP_LIST_API}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.SumDataList = data.list
          this.AddSupDate = []
          this.SupDate = []
          this.totalCount = data.list.length
          this.dataList = this.SumDataList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 双击
    Dblckick (row) {
      this.GetMaterails(row.factory, row.orderNo)
      if (row.supStatus !== '已确认') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
      if (row.steSupMaterialBean.resultList) {
        this.AddSupDate = row.steSupMaterialBean.resultList
      } else {
        this.AddSupDate = row.steSupMaterialBean.resultList = []
      }
      if (row.steSupMaterialBean.supList) {
        this.SupDate = row.steSupMaterialBean.supList
      } else {
        this.SupDate = row.steSupMaterialBean.resultList = []
      }
    },
    // 保存
    SavedOr (str) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择订单')
        return
      }
      this.multipleSelection.forEach((item) => {
        item.supStatus = str
        item.steSupMaterialBean.resultList.forEach((item1) => {
          item1.supStatus = str
          item1.status = 'saved'
        })
        item.steSupMaterialBean.supList.forEach((item1) => {
          item1.supStatus = str
          item1.planAmount = item.planOutPut
          item1.orderId = item.orderId
          item1.materialName = (this.Materails.filter(it => it.code === item1.materialCode)[0]).value
        })
      })
      this.$http(`${STERILIZED_API.STE_SUP_SAVED_API}`, 'POST', this.multipleSelection).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.GetDataList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 推送
    pushData (str) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择订单')
        return
      }
      if (str === '已确认') {
        this.$confirm('订单确认后，将允许生产正常出料！, 是否继续?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pushOrConfirm(str)
        })
      } else {
        this.pushOrConfirm(str)
      }
    },
    pushOrConfirm (str) {
      if (!this.dataRul()) {
        return
      }
      this.multipleSelection.forEach((item) => {
        item.supStatus = str
        item.steSupMaterialBean.resultList.forEach((item1) => {
          item1.supStatus = str
          item1.status = 'saved'
        })
        item.steSupMaterialBean.supList.forEach((item1) => {
          item1.supStatus = str
          item1.planAmount = item.planOutPut
          item1.orderId = item.orderId
          item1.materialName = (this.Materails.filter(it => it.code === item1.materialCode)[0]).value
        })
      })
      this.$http(`${STERILIZED_API.STE_SUP_PUSH_API}`, 'POST', this.multipleSelection).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.GetDataList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 验证
    dataRul () {
      let ty = true
      this.multipleSelection.forEach((item) => {
        if (!item.steStatus) {
          ty = false
          this.$message.error('杀菌状态必填')
          return false
        }
        if (item.steStatus === '异常订单') {
          if (!item.steStatusRemake) {
            ty = false
            this.$message.error('订单状态为异常，状态备注必填')
            return false
          }
        }
        item.steSupMaterialBean.supList.forEach((item1) => {
          if (!item1.materialCode) {
            ty = false
            this.$message.error('增补料记录物料必填')
            return false
          }
          if (!item1.addAmount) {
            ty = false
            this.$message.error('增补料记录添加数量必填')
            return false
          }
          if (!item1.unit) {
            ty = false
            this.$message.error('增补料记录单位必填')
            return false
          }
        })
      })
      return ty
    },
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item)
      })
    },
    // 增补料新增
    addSup () {
      this.SupDate.push({
        addAmount: '',
        addStatus: '未添加',
        adjustAmount: '',
        adjustAmountPro: '',
        batch: '',
        delFlag: '0',
        diffAmount: '',
        id: '',
        isOperation: '',
        isSplit: '1',
        isSupplement: '1',
        materialCode: '',
        materialName: '',
        orderId: '',
        planAmount: '',
        receiveAmount: '',
        remark: '',
        status: 'saved',
        supStatus: '',
        unit: ''
      })
    },
    // 删除
    del (row) {
      row.delFlag = '1'
    },
    // 物料字典
    GetMaterails (factory, id) {
      this.$http(`${STERILIZED_API.STE_SUP_MAT_LIST_API}`, 'POST', {factory: factory, orderNo: id}).then(({data}) => {
        if (data.code === 0) {
          this.Materails = data.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 单位字典
    GetUnit (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'unit'}).then(({data}) => {
        if (data.code === 0) {
          this.Unit = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 罐下拉
    GetPot (id) {
      this.$http(`${BASICDATA_API.PUPLWHEATLIST}`, 'POST', {types: ['014'], factory: id}).then(({data}) => {
        this.PotList = data.list
      })
    },
    // 物料下拉
    GetMaterail (id) {
      this.$http(`${BASICDATA_API.SERCHSAPLIST_API}`, 'POST', {factory: id, param: '欣和半成品'}).then(({data}) => {
        this.Matertail = data.allList
      })
    },
    // 复选
    CheckBoxOrder (row) {
      if (row.supStatus === '已确认') {
        return 0
      } else {
        return 1
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.dataList = this.SumDataList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize)
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.dataList = this.SumDataList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
