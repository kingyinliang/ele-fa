<template>
  <div>
    <div class="main">
      <el-card class="newCard searchCard searchCards">
        <el-form :model="formHeader" :inline="true" size="small" label-width="80px" style="margin-top:10px">
          <el-row>
            <el-col :span="21">
              <el-form-item label="生产工厂：">
                <el-tooltip class="item" effect="dark" :content="formHeader.factory" placement="top-start">
                  <p class="input_bottom">{{this.formHeader.factory}}</p>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="生产车间：">
                <p class="input_bottom">{{this.formHeader.workshop}}</p>
              </el-form-item>
              <el-form-item label="调配单号：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.ORDER_NO}}</p>
              </el-form-item>
              <el-form-item label="调配罐号：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.HOLDER_ID}}</p>
              </el-form-item>
              <el-form-item label="提交人员：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.CREATOR}}</p>
              </el-form-item>
              <el-form-item label="提交日期：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.CREATED}}</p>
              </el-form-item>
              <el-form-item label="调配日期：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.ALLOCATE_DATE}}</p>
              </el-form-item>
              <el-form-item label="杀菌物料：">
                <el-tooltip class="item" effect="dark" :content="formHeader.materialCode + `${formHeader.materialName}`" placement="top-start">
                  <p class="input_bottom">{{this.formHeader.materialCode}}{{this.formHeader.materialName}}</p>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="订单状态：">
                <p class="input_bottom">&nbsp;{{this.formHeaders.STATUS}}</p>
              </el-form-item>
              <el-form-item>
                <span style="color:#606266; width:162px; float:left; margin-left:15px;">计划BL原汁总量（L）：</span>
                <p style="float:left" class="input_bottom">{{this.planOutputTotal}}</p>
              </el-form-item>
              <el-form-item label="备注：">
                <textarea v-model="remark" :disabled="!isRedact" style="width:887px; height:50px; background:rgba(255,255,255,1); border-radius:4px; border:1px solid rgba(217,217,217,1);"></textarea>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align:right">
              <div style="width:100%">
                <el-button type="primary" size="small" v-if="isAuth('ste:allocate:allocateOrderSave')" :disabled="(formHeaders.STATUS !== '已保存' && formHeaders.STATUS !== '')" @click="isRedact = !isRedact">{{isRedact === false? '编辑' : '取消'}}</el-button>
              </div>
              <div v-if="isRedact" style="margin-top:15px">
                <el-button type="primary" size="small" @click="SaveOrderNo(true)">保存</el-button>
                <el-button type="primary" size="small" @click="CreateOrder(true)">生成</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
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
        <el-row>
          <el-col style="text-align:right">
            <el-button type="primary" @click="AddOrderNo" size="small" :disabled="!isRedact">新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="orderList" border header-row-class-name="tableHead" style="margin-top:10px">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="订单号" prop="orderNo"></el-table-column>
          <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单数量" prop="planOutput" width="80"></el-table-column>
          <el-table-column label="订单单位" prop="outputUnit" width="80"></el-table-column>
          <el-table-column label="订单开始日期" prop="productDate"></el-table-column>
          <!-- <el-table-column label="订单结束日期"></el-table-column> -->
          <el-table-column label="生产调度员" prop="dispatchMan"></el-table-column>
          <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact"  @click="DelOrderNo(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" width="1000px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">订单分配</div>
      <el-table :data="orderPropList" @selection-change="handleSelectionChange" border header-row-class-name="tableHead">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="订单号" prop="orderNo" width="120"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            {{scope.row.materialCode}} {{scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column label="订单数量" prop="planOutput" width="80"></el-table-column>
        <el-table-column label="订单单位" prop="outputUnit" width="80"></el-table-column>
        <el-table-column label="订单开始日期" prop="productDate" width="120"></el-table-column>
        <!-- <el-table-column label="订单结束日期" width="120"></el-table-column> -->
        <el-table-column label="生产调度员" prop="dispatchMan" width="120"></el-table-column>
        <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-row style="position:relative;">
        <el-col :span="20" style="text-align:center">
          <el-pagination style="float:left; width: 960px; text-align:center;" background
            layout="prev, pager, next"
            :current-page.sync="pagesForm.currPage"
            :page-size="pagesForm.pageSize"
            :total="pagesForm.totalCount">
          </el-pagination>
        </el-col>
        <el-col :span="4" style="float:right; margin-top:13px; text-align:right;">
          <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="SaveOderNo()" size="small">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {headanimation} from '@/net/validate'
import {STERILIZED_API} from '@/api/api'
export default {
  name: 'doDeployment',
  data () {
    return {
      allocateId: '',
      formHeader: {
        factory: this.$store.state.common.Sterilized.factory,
        workshop: this.$store.state.common.Sterilized.workshop,
        factoryId: this.$store.state.common.Sterilized.factoryId,
        workshopId: this.$store.state.common.Sterilized.workshopId,
        materialCode: this.$store.state.common.Sterilized.materialCode,
        materialName: this.$store.state.common.Sterilized.materialName
      },
      formHeaders: {
        STATUS: ''
      },
      isRedact: false,
      dialogTableVisible: false,
      orderArray: this.$store.state.common.Sterilized.orderNoList,
      planOutputTotal: this.$store.state.common.Sterilized.planOutputTotal,
      remark: '',
      orderList: [],
      orderPropAllList: [],
      orderPropList: [],
      multipleSelection: [],
      pagesForm: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      }
    }
  },
  mounted () {
    headanimation(this.$)
    if (this.$store.state.common.Sterilized.orderNo !== '') {
      this.allocateId = this.$store.state.common.Sterilized.orderNo
      this.GetInfoList(this.$store.state.common.Sterilized.orderNo)
    } else {
      this.GetorderNo(this.orderArray)
    }
    // this.GetInfoList('C57A2AE171024496AD26B0BEE8B0ACAD')
  },
  watch: {
    'pagesForm.currPage': {
      handler (n) {
        this.orderPropList = this.DataProcessing()
      }
    }
  },
  methods: {
    GetInfoList (orderNo) {
      this.orderArray = []
      this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {orderNo: orderNo}).then(({data}) => {
        if (data.code === 0) {
          this.formHeaders = data.allocateInfo
          this.formHeader.factory = this.formHeaders.FACTORYNAME
          this.formHeader.workshop = this.formHeaders.WORK_SHOPNAME
          this.formHeader.factoryId = this.formHeaders.FACTORY
          this.formHeader.workshopId = this.formHeaders.WORK_SHOP
          this.formHeader.materialCode = this.formHeaders.MATERIAL_CODE
          this.formHeader.materialName = this.formHeaders.MATERIAL_NAME
          this.planOutputTotal = this.formHeaders.PLAN_AMOUNT
          this.remark = this.formHeaders.REMARK
          this.orderList = data.allocateInfo.orderInfo
          data.allocateInfo.orderInfo.map((item) => {
            this.orderArray.push(item.orderNo)
          })
          // this.GetorderNo(this.orderArray)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 拉取订单
    GetorderNo (orderArray) {
      console.log(orderArray)
      let params = {
        factory: this.formHeader.factoryId,
        workShop: this.formHeader.workshopId,
        materialCode: this.formHeader.materialCode,
        orderNo: orderArray,
        currPage: '1',
        pageSize: '9000'
      }
      this.$http(`${STERILIZED_API.WAITDEPLOYMENTLIST_API}`, 'POST', params).then(({data}) => {
        if (data.code === 0) {
          this.orderList = data.orderInfo.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增订单
    AddOrderNo () {
      let params = {
        factory: this.formHeader.factoryId,
        workShop: this.formHeader.workshopId,
        materialCode: this.formHeader.materialCode,
        orderNo: this.orderArray
      }
      this.$http(`${STERILIZED_API.DODEPLOYMENTORDERLIST_API}`, 'POST', params).then(({data}) => {
        if (data.code === 0) {
          this.orderPropAllList = data.orderAddInfo
          this.orderPropList = this.DataProcessing()
          this.pagesForm.totalCount = this.orderPropAllList.length
          this.dialogTableVisible = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // handleSizeChange (val) {
    //   this.pagesForm.pageSize = val
    //   this.orderPropList = this.DataProcessing()
    // },
    // handleCurrentChange (val) {
    //   this.pagesForm.currPage = val
    //   this.orderPropList = this.DataProcessing()
    // },
    DataProcessing () {
      return this.orderPropAllList.slice((this.pagesForm.currPage - 1) * this.pagesForm.pageSize, Number((this.pagesForm.currPage - 1) * this.pagesForm.pageSize) + Number(this.pagesForm.pageSize))
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 新增订单
    SaveOderNo () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选订单')
      } else {
        let materialCode
        let dispatchMan
        if (this.orderList.length === 0) {
          materialCode = this.multipleSelection[0].materialCode
          dispatchMan = this.multipleSelection[0].dispatchMan
        } else {
          materialCode = this.orderList[0].materialCode
          dispatchMan = this.orderList[0].dispatchMan
        }
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
        this.multipleSelection.map((item) => {
          this.orderArray.push(item.orderNo)
          this.orderList.push(item)
        })
        this.dialogTableVisible = false
        this.planOutputTotal = 0
        this.orderList.map((item) => {
          this.planOutputTotal = this.planOutputTotal + item.planOutput
        })
      }
    },
    // 删除
    DelOrderNo (row) {
      this.orderList.splice(this.orderList.indexOf(row), 1)
      this.orderArray.splice(this.orderArray.indexOf(row.orderNo), 1)
      this.planOutputTotal = 0
      this.orderList.map((item) => {
        this.planOutputTotal = this.planOutputTotal + item.planOutput
      })
    },
    SaveOrderNo () {
      if (this.orderList.length === 0) {
        this.$message.error('请添加订单')
      } else {
        let params = {
          factory: this.$store.state.common.Sterilized.factoryId,
          workShop: this.$store.state.common.Sterilized.workshopId,
          materialCode: this.orderList[0].materialCode,
          materialName: this.orderList[0].materialName,
          planAmount: this.planOutputTotal,
          unit: this.orderList[0].outputUnit,
          remark: this.remark,
          id: this.allocateId
        }
        this.$http(`${STERILIZED_API.DODEPLOYMENTHEADERSAVE}`, 'POST', params).then(({data}) => {
          if (data.code === 0) {
            this.allocateId = data.allocateId
            this.orderList.map((item) => {
              item.allocateId = data.allocateId
              item.remark = this.remark
              item.orderId = item.orderNo
            })
            this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({data}) => {
              if (data.code === 0) {
                this.$message.success('保存成功')
                this.GetInfoList(this.allocateId)
                this.isRedact = false
                this.Sterilized = {
                  orderNoList: [],
                  orderNo: this.allocateId
                }
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    CreateOrder () {
      this.$confirm('确认生成调配单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.orderList.length === 0) {
          this.$message.error('请添加订单')
          return false
        }
        if (this.allocateId === '') {
          let params = {
            factory: this.$store.state.common.Sterilized.factoryId,
            workShop: this.$store.state.common.Sterilized.workshopId,
            materialCode: this.orderList[0].materialCode,
            materialName: this.orderList[0].materialName,
            planAmount: this.planOutputTotal,
            unit: this.orderList[0].outputUnit,
            remark: this.remark,
            id: this.allocateId
          }
          this.$http(`${STERILIZED_API.DODEPLOYMENTHEADERSAVE}`, 'POST', params).then(({data}) => {
            if (data.code === 0) {
              this.allocateId = data.allocateId
              this.orderList.map((item) => {
                item.allocateId = data.allocateId
                item.remark = this.remark
                item.orderId = item.orderNo
              })
              this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({data}) => {
                if (data.code === 0) {
                  this.formHeaders.id = this.allocateId
                  let params = [this.formHeaders]
                  this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATE}`, 'POST', params).then(({data}) => {
                    if (data.code === 0) {
                      this.$message.success('生成成功')
                      this.GetInfoList(this.allocateId)
                      this.isRedact = false
                      this.Sterilized = {
                        orderNoList: [],
                        orderNo: this.allocateId
                      }
                    } else {
                      this.$message.error(data.msg)
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.orderList.map((item) => {
            item.allocateId = this.allocateId
            item.remark = this.remark
            item.orderId = item.orderNo
          })
          this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({data}) => {
            if (data.code === 0) {
              this.formHeaders.id = this.formHeaders.ID
              this.formHeaders.remark = this.remark
              let params = [this.formHeaders]
              this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATE}`, 'POST', params).then(({data}) => {
                if (data.code === 0) {
                  this.$message.success('生成成功')
                  this.isRedact = false
                  this.GetInfoList(this.allocateId)
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
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

<style lang="less">
.input_bottom {
  width:150px;
  border-bottom: 1px solid rgba(216,216,216,1);
  overflow: hidden;
  height: 33px;
  white-space:nowrap;
  text-overflow:ellipsis;
}
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
<style lang="scss" scoped>
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 8px!important;
}
</style>
