<template>
  <div class="main">
    <el-card class="searchCard searchCards">
      <el-row>
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
          <el-form-item label="生产日期：">
            <el-date-picker v-model="formHeader.allocateDate" type="date" placeholder="请选择" style="width:150px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="调配单号：">
            <el-input v-model="formHeader.orderNo" style="width:150px"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="text-align:right">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" v-if="isAuth('ste:allocate:allocateList')" @click="SearchList">查询</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="isAuth('ste:allocate:allocateUpdate')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="SavedForm()">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm()">提交</el-button>
        </template>
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
        <el-table :data="dataList" @selection-change="handleSelectionChange" @row-dblclick="ShowDetail" border header-row-class-name="tableHead">
          <el-table-column type="selection" width="35" :selectable="CheckBoxInit"></el-table-column>
          <el-table-column label="状态" width="90" prop="status" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="调配单号" prop="orderNo" width="130"></el-table-column>
          <el-table-column label="生产车间" prop="workShopName" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="调配单日期" prop="allocateDate" width="170"></el-table-column>
          <el-table-column label="杀菌物料" width="190" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="计划BL原汁总量" prop="planAmount"></el-table-column>
          <el-table-column label="BL原汁总量" prop="blAmount"></el-table-column>
          <el-table-column label="单位" prop="unit" width="50"></el-table-column>
          <el-table-column width="130">
            <template slot="header">
              <i class="reqI">*</i> 调配罐
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.holderId" size="small" :disabled="!isRedact">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) in holderList" :key="index" :label="item.holderName" :value="item.holderId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="170">
            <template slot="header">
              <i class="reqI">*</i> 调配日期
            </template>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.allocateTime" :disabled="!isRedact" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:150px" size="small"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="调配单备注" prop="remark" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="创建人员" prop="creator" width="150"></el-table-column>
          <el-table-column label="创建时间" prop="created" width="170"></el-table-column>
          <el-table-column label="调配人员" prop="changer" width="150"></el-table-column>
          <el-table-column label="调配时间" prop="changed" width="170"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.currentTotal">
        </el-pagination>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" width="1000px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">调配列表</div>
      <el-table :data="ItemList" border header-row-class-name="tableHead">
        <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            {{scope.row.materialCode}} {{scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column label="订单单位" width="80" prop="unit"></el-table-column>
        <el-table-column label="计划领料" prop="planAmount" width="80"></el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-button type="text" :disabled="SplitStatus(scope.row.materialName)" @click="SplitDate(scope.row, scope.$index)"><i class="icons iconfont factory-chaifen"></i>拆分</el-button>
          </template>
        </el-table-column>
        <el-table-column label="罐号" prop="productDate" width="150" >
          <template slot-scope="scope">
            <el-select v-model="scope.row.holderId" size="small"  :disabled="!(lineStatus !== '已提交' && lineStatus !== '审核通过' && isRedact !== false)">
              <el-option value=''>请选择</el-option>
              <el-option v-for="(item, index) in thrwHolderList" :key="index" :label="item.holderName" :value="item.holderId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot="header">
            <i class="reqI">*</i> 实际领料
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.receiveAmount" :disabled="SplitStatuss(scope.row.materialName)" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="130">
          <template slot="header">
            <i class="reqI">*</i> 批次
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.batch" maxlength="10" :disabled="SplitStatuss(scope.row.materialName)" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" :disabled="!(lineStatus !== '已提交' && lineStatus !== '审核通过' && isRedact !== false)" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="scope.row.isSplit === '0' || lineStatus === '已提交' || lineStatus === '审核通过' || isRedact === false"  @click="DelOrderNo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <template v-if="lineStatus !== '已提交' && lineStatus !== '审核通过' && isRedact !== false">
          <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="SaveSplit()" size="small">确 定</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {headanimation, dateFormat} from '@/net/validate'
import {BASICDATA_API, STERILIZED_API} from '@/api/api'
export default {
  name: 'JuiceDeployment',
  data () {
    return {
      formHeader: {
        factory: '',
        workShop: ''
      },
      pages: {
        currentTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 10
      },
      factory: [],
      workshop: [],
      isRedact: false,
      dataList: [],
      dialogTableVisible: false,
      ItemList: [],
      multipleSelection: [],
      holderList: [],
      lineStatus: '',
      thrwHolderList: []
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
    },
    'formHeader.workShop' (n, o) {
      this.dataList = []
      this.ThrowHolder(n)
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
    ThrowHolder (id) {
      this.thrwHolderList = []
      if (id) {
        let params = {
          factory: this.formHeader.factory,
          workShop: id,
          code: '013'
        }
        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTHROWHOLDER}`, 'POST', params).then(({data}) => {
          if (data.code === 0) {
            this.thrwHolderList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 查询
    SearchList () {
      if (this.formHeader.factory === '') {
        this.$message.error('请选择工厂')
        return false
      }
      this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSEARCHLIST}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.dataListAll = data.orderInfo
          this.dataListAll.map((item) => {
            if (item.allocateTime === '' || item.allocateTime === null) {
              item.allocateTime = dateFormat(new Date(), 'yyyy-MM-dd')
            }
          })
          this.pages.currentTotal = this.dataListAll.length
          this.pages.currentPage = 1
          this.dataList = this.dataListAll.slice((this.pages.currentPage - 1) * this.pages.pageSize, this.pages.currentPage * this.pages.pageSize)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    ShowDetail (row) {
      // row.id = 'C57A2AE171024496AD26B0BEE8B0ACAD'
      this.$http(`${STERILIZED_API.JUICEDEPLOYMENTITEMS}`, 'POST', {orderNo: row.id, factory: this.formHeader.factory}).then(({data}) => {
        if (data.code === 0) {
          this.ItemList = data.info
          this.ItemList.map((item) => {
            if (item.receiveAmount === '' || !item.receiveAmount) {
              item.receiveAmount = item.planAmount
            }
          })
          this.dialogTableVisible = true
          this.lineStatus = row.status
          this.ID = row.id
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 拆分
    SplitDate (row, index) {
      this.ItemList.splice(index + 1, 0, {
        materialName: row.materialName,
        materialCode: row.materialCode,
        unit: row.unit,
        planAmount: row.planAmount,
        holderId: '',
        receiveAmount: '',
        batch: '',
        remark: '',
        isSplit: 1
      })
    },
    SaveSplit () {
      let batchList = []
      for (let item of this.ItemList) {
        batchList.push(item.batch)
        item.ID = this.ID
        if (!item.receiveAmount || item.receiveAmount === '') {
          this.$message.error('请填写实际领料')
          return false
        }
        if (!item.batch || item.batch === '') {
          this.$message.error('请填写批次')
          return false
        }
        if (item.batch.length !== 10) {
          this.$message.error('批次应为10位')
          return false
        }
        if (item.materialName.indexOf('原汁') !== -1 && (item.holderId === '' || !item.holderId)) {
          this.$message.error('原汁物料需选择罐号')
          return false
        }
      }
      if (new Set(batchList).size !== batchList.length) {
        this.$message.error('批次不能重复')
        return false
      }
      this.$http(`${STERILIZED_API.JUICEDEPLOYMENTITEMSAVE}`, 'POST', this.ItemList).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('保存成功')
          this.dialogTableVisible = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    SavedForm () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选数据')
      } else {
        this.multipleSelection.map((item) => {
          item.status = '已调配'
        })
        this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSAVE}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('保存成功')
            this.isRedact = false
            this.SearchList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    SubmitForm () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选数据')
        return false
      }
      this.$confirm('确认要提交数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let item of this.multipleSelection) {
          if (!item.holderId || !item.allocateTime || item.holderId === '' || item.allocateTime === '') {
            this.$message.error('请填写必填项')
            return false
          }
        }
        this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSAVE}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSUBMIT}`, 'POST', this.multipleSelection).then(({data}) => {
              if (data.code === 0) {
                this.$message.success('提交成功')
                this.isRedact = false
                this.SearchList()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 复选框初始状态
    CheckBoxInit (row, index) {
      if (this.isRedact === false || row.status === '已提交' || row.status === '审核通过') {
        return 0
      } else {
        return 1
      }
    },
    handleSizeChange (val) {
      this.pages.pageSize = val
    },
    handleCurrentChange (val) {
      this.pages.currentPage = val
      this.dataList = this.dataListAll.slice((this.pages.currentPage - 1) * this.pages.pageSize, this.pages.currentPage * this.pages.pageSize)
    },
    // 删除
    DelOrderNo (row) {
      this.ItemList.splice(this.ItemList.indexOf(row), 1)
    },
    SplitStatus (materialName) {
      if (materialName.indexOf('原汁') === -1) {
        return (this.lineStatus === '已提交' || this.lineStatus === '审核通过' || this.isRedact === false)
      } else {
        return true
      }
    },
    SplitStatuss (materialName) {
      if (materialName.indexOf('原汁') === -1) {
        return (!(this.lineStatus !== '已提交' && this.lineStatus !== '审核通过' && this.isRedact !== false))
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less">
.dialog__class{
  border-radius:6px 6px 6px 6px !important;
  .el-dialog__header{
    height:59px;
    background:rgba(24,144,255,1);
    border-radius:6px 6px 0px 0px;
    color: #fff;
    font-size:20px;
    .el-dialog__headerbtn .el-dialog__close{
      color: #fff
    }
  }
}
</style>
