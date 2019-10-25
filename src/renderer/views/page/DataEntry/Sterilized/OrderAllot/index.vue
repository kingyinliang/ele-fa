<template>
  <div>
    <div class="main">
      <el-card class="searchCards searchCard">
        <el-row>
          <el-col>
            <el-form :model="formHeader" :inline="true" size="small" label-width="82px">
              <el-form-item label="生产工厂：">
                <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                  <el-option value="">请选择</el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产车间：">
                <el-select v-model="formHeader.workShop" palceholder="请选择" class="width180px">
                  <el-option value="">请选择</el-option>
                  <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单号：">
                <el-input v-model="formHeader.orderNo"></el-input>
              </el-form-item>
              <el-form-item label="订单状态：">
                <el-select v-model="formHeader.orderStatus" placeholder="请选择" style="width: 160px">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option label="未录入"  value="未录入"></el-option>
                  <el-option label="已同步"  value="已同步"></el-option>
                  <el-option label="已保存"  value="saved"></el-option>
                  <el-option label="已提交"  value="submit"></el-option>
                  <el-option label="审核通过"  value="checked"></el-option>
                  <el-option label="审核不通过"  value="noPass"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker v-model="formHeader.productDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="请选择" style="width:180px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="text-align:right">
          <template>
            <el-button type="primary" size="small" @click="GetList(true)">查询</el-button>
            <el-button type="primary" size="small" @click="isRedact = !isRedact" v-if="isAuth('ste:allot:update')">{{isRedact === false? '编辑' : '取消'}}</el-button>
          </template>
          <template v-if="isRedact">
            <el-button type="primary" size="small" @click="SaveForm()">保存</el-button>
            <!-- <el-button type="primary" size="small" @click="SaveForm()">提交</el-button> -->
          </template>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <el-card>
        <el-table :data="dataList" @selection-change="handleSelectionChange" border header-row-class-name="tableHead" style="margin-top:10px">>
          <el-table-column type="selection" width="35" :selectable="CheckBoxInit" fixed="left"></el-table-column>
          <el-table-column label="订单状态" prop="orderStatus">
            <template slot-scope="scope">
              {{scope.row.orderStatus === 'saved' ? '已保存' : scope.row.orderStatus === 'submit' ? '已提交' : scope.row.orderStatus === 'checked' ? '审核通过' : scope.row.orderStatus === 'nopass' ? '审核不通过' : scope.row.orderStatus }}
            </template>
          </el-table-column>
          <el-table-column label="订单号" width="120" prop="orderNo"></el-table-column>
          <el-table-column label="品项" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              {{scope.row.materialCode}} {{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="planOutput"></el-table-column>
          <el-table-column label="单位" width="50" prop="outputUnit"></el-table-column>
          <el-table-column label="订单开始日期" width="110" prop="startDate"></el-table-column>
          <el-table-column label="订单结束日期" width="110" prop="commitDate"></el-table-column>
          <el-table-column label="调配罐号" width="110" prop="holderName"></el-table-column>
          <el-table-column label="BL原汁量" width="110" prop="amount"></el-table-column>
          <el-table-column width="160" prop="orderDate">
            <template slot="header">
              <i class="reqI">*</i>
              <span>生产日期</span>
            </template>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.orderDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="ReturnStatus(scope.row)" size="small" type="date" placeholder="请选择" style="width:140px"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column width="140">
            <template slot="header">
              <i class="reqI">*</i>
              <span>锅号</span>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.panId" :disabled="ReturnStatus(scope.row)" size="small" placeholder="请选择">
                <el-option v-for="(item, index) of holderList" :key="index" :value="item.holderId" :label="item.holderName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="110" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="ReturnStatus(scope.row)" size="small"></el-input>
            </template>
          </el-table-column>
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
  </div>
</template>

<script>
import {BASICDATA_API, STERILIZED_API} from '@/api/api'
import {headanimation} from '@/net/validate'
export default {
  name: 'OrderAllot',
  data () {
    return {
      isRedact: false,
      formHeader: {
        factory: '',
        workShop: '',
        orderNo: '',
        orderStatus: '',
        productDate: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: [],
      workshop: [],
      holderList: [],
      dataList: [],
      multipleSelection: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'formHeader.workShop' (n, o) {
      this.getHolderList(n)
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
    // 锅
    getHolderList () {
      let params = {
        type: 'holder_type',
        holder_type: '014',
        currPage: 1,
        pageSize: 9999,
        factory: this.formHeader.factory,
        dept_id: this.formHeader.workshop
      }
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params).then(({data}) => {
        if (data.code === 0) {
          this.holderList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('catch data::', error)
      })
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
      this.$http(`${STERILIZED_API.ORDERALLOTLIST}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.list.list
          this.formHeader.totalCount = data.list.totalCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 复选框初始状态
    CheckBoxInit (row, index) {
      if (this.isRedact === false || row.orderStatus === 'submit' || row.orderStatus === 'checked') {
        return 0
      } else {
        return 1
      }
    },
    ReturnStatus (row) {
      return (this.isRedact === false || row.orderStatus === 'submit' || row.orderStatus === 'checked')
    },
    handleSizeChange (val) {
      this.formHeader.pageSize = val
      this.GetList()
    },
    handleCurrentChange (val) {
      this.formHeader.currPage = val
      this.GetList()
    },
    // 保存
    SaveForm () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选数据')
        return false
      } else {
        for (let item of this.multipleSelection) {
          if (!item.orderDate || !item.panId) {
            this.$message.error('生产日期与锅号为必填项')
            return false
          }
        }
        this.multipleSelection.map((item) => {
          if (item.orderStatus === '已同步') {
            item.orderStatus = '未录入'
          } else {
            item.orderStatus = item.orderStatus
          }
        })
        this.$http(`${STERILIZED_API.ORDERALLOTSAVE}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('保存成功')
            this.isRedact = false
            this.GetList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
