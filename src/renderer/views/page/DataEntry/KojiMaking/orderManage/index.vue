<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex" style="border-bottom:1px solid #E9E9E9;margin-bottom:12px">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" label-width="42px">
                <el-form-item label="工厂：">
                  <el-select size="small" v-model="params.factoryId" class="selectwpx" style="width:140px" @change="changeOptions('factory')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车间：">
                  <el-select size="small" v-model="params.workshopId" class="selectwpx" style="width:140px" @change="changeOptions('workshop')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单日期：" label-width="70px" class="selectwpx">
                  <el-date-picker size="small" type="date" v-model="params.orderDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                </el-form-item>
                <el-form-item label="订单号：" label-width="60px" >
                  <el-input size="small" type="text" v-model.trim="params.orderNo" placeholder='请输入' style="width:140px"/>
                </el-form-item>
                <el-form-item label="订单状态：" label-width="70px">
                  <el-select size="small" v-model="params.orderStatus" class="selectwpx" style="width:120px">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="已同步" value="已同步"></el-option>
                    <el-option label="未录入" value="已拆分"></el-option>
                    <el-option label="待审核" value="toBeAudited"></el-option>
                    <el-option label="已保存" value="saved"></el-option>
                    <el-option label="已提交" value="submit"></el-option>
                    <el-option label="不通过" value="noPass"></el-option>
                    <el-option label="通过" value="checked"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width:80px">
              <el-row class="rowButton">
                <el-button type="primary" size="small" @click="getOrderList()" style="float:right" v-if="isAuth('sys:order:orderlist')">查询</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-row :gutter="12" v-if="searched" style="margin-top:20px;">
          <el-col :span="12">
            <el-card>
              <el-row style="margin-bottom:5px;" >
                <el-col style="font-size:16px;font-weight:500;color:#000">订单管理</el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-table @row-dblclick="showDetail" header-row-class-name="tableHead" :data="currentOrderList"  border tooltip-effect="dark" :row-class-name="rowDelFlag">
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column label="订单状态" width="80">
                      <template slot-scope="scope">
                        <label :style="{'color': scope.row.orderStatus === '不通过'? 'red' : scope.row.orderStatus === '通过'? 'rgb(103, 194, 58)'  : '' }">{{scope.row.orderStatus}}</label>
                      </template>
                    </el-table-column>
                    <el-table-column label="订单日期" width="100">
                      <template slot-scope="scope">
                        {{scope.row.orderDate}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="订单号"
                      width="120">
                      <template slot-scope="scope">
                        {{scope.row.orderNo}}
                      </template>
                    </el-table-column>
                    <el-table-column width="180" label="品项">
                      <template slot-scope="scope">
                        {{scope.row.materialCode + ' ' + scope.row.materialName}}
                      </template>
                    </el-table-column>
                    <el-table-column width="70" label="数量">
                      <template slot-scope="scope">
                        {{scope.row.planOutput}}
                      </template>
                    </el-table-column>
                    <el-table-column label="单位" width="50">
                      <template slot-scope="scope">
                        <span>{{scope.row.outputUnit}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" width="140">
                      <template slot-scope="scope">
                        <span>{{scope.row.remark}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      fixed="right"
                      align="center"
                      width="80">
                      <template slot-scope="scope">
                        <div class="operator" v-if="(scope.row.orderStatus === '已同步' || scope.row.orderStatus === '未录入' || scope.row.orderStatus === '已保存') && isAuth('sys:kjmOrderHouse:mySaveOrUpdate')" @click="orderSplit(scope.row)">
                          <div class="split"></div>
                          <div>&nbsp;拆分</div>
                        </div>
                        <div class="operator" v-if="(scope.row.orderStatus === '待审核' || scope.row.orderStatus === '已提交' || scope.row.orderStatus === '不通过' || scope.row.orderStatus === '通过') && isAuth('sys:order:orderlist')" @click="orderCheck(scope.row)">
                          <div class="check"></div>
                          <div>&nbsp;审核</div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
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
          </el-col>
          <el-col :span="12" v-if="showdetails">
            <el-card>
              <el-row  style="margin-bottom:5px;">
                <el-col :span="12" style="font-size:16px;font-weight:500;color:#000">
                  订单明细
                </el-col>
                <el-col :span="12" class="rowButton" style='margin-top:-13px'>
                   <el-button type="primary" size="small"  style="float:right" @click="delDetail">删除</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-table
                    ref="multipleTable"
                    header-row-class-name="tableHead"
                    :data="orderDetailList"
                    border
                    tooltip-effect="dark"
                    :row-class-name="rowDelFlag"
                    @selection-change="handleChange"
                    @row-dblclick="showModifyDetial"
                    >
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column label="曲房状态" width="80">
                      <template slot-scope="scope">
                        {{scope.row.status}}
                      </template>
                    </el-table-column>
                    <el-table-column label="订单号" width="120">
                      <template slot-scope="scope">
                        {{scope.row.orderNo}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="入罐号"
                      width="120">
                      <template slot-scope="scope">
                        {{scope.row.inPotName}}
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="曲房">
                      <template slot-scope="scope">
                        {{scope.row.houseName}}
                      </template>
                    </el-table-column>
                    <el-table-column width="120" label="连续蒸煮">
                      <template slot-scope="scope">
                        {{scope.row.cookingName}}
                      </template>
                    </el-table-column>
                    <el-table-column label="制曲日期" width="100">
                      <template slot-scope="scope">
                        <span>{{scope.row.inKjmDate}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="生产日期" width="100">
                      <template slot-scope="scope">
                        <span>{{scope.row.productDate}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="1200px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>订单分配</span>
        </div>
        <div class="orderForm">
          <el-table header-row-class-name="tableHead" :data="splitDetailList"  border tooltip-effect="dark" :row-class-name="rowDelFlag">
            <el-table-column type="index" width="55" label="序号"></el-table-column>
            <el-table-column label="订单号" width="120">
              <template slot-scope="scope">
                {{scope.row.orderNo}}
              </template>
            </el-table-column>
            <el-table-column label="品项" width="180">
              <template slot-scope="scope">
                {{scope.row.materialCode + ' ' + scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column
              label="订单日期"
              width="100">
              <template slot-scope="scope">
                {{scope.row.orderDate}}
              </template>
            </el-table-column>
            <el-table-column width="70" label="数量">
              <template slot-scope="scope">
                {{scope.row.planOutput}}
              </template>
            </el-table-column>
            <el-table-column width="60" label="单位">
              <template slot-scope="scope">
                {{scope.row.outputUnit}}
              </template>
            </el-table-column>
            <el-table-column label="备注" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column width="140">
              <template slot="header">
                  <i class="reqI">*</i>
                  <span>入罐号</span>
              </template>
              <template slot-scope="scope">
                <el-select  v-model="scope.row.inPotNo" filterable placeholder="请选择"  size="small">
                  <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column width="140">
              <template slot="header">
                <i class="reqI">*</i>
                <span>曲房</span>
              </template>
              <template slot-scope="scope">
                <el-select  v-model="scope.row.houseNo" filterable placeholder="请选择"  size="small">
                  <el-option v-for="(item, index) in kjmRoomList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="连续蒸煮号" width="140">
              <template slot-scope="scope">
                <el-select  v-model="scope.row.cookingNo" filterable placeholder="请选择"  size="small">
                  <el-option value='' label=''></el-option>
                  <el-option v-for="(item, index) in continueList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column width="170">
              <template slot="header">
                <i class="reqI">*</i>
                <span>制曲日期</span>
              </template>
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.inKjmDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" size="small" style="width:135px" ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" width="170">
              <template slot="header">
                <i class="reqI">*</i>
                <span>生产日期</span>
              </template>
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.productDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" size="small"  style="width:135px"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="60">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isFirst" type="primary" icon="el-icon-plus" circle size="small"  @click="addRow(scope.row)"></el-button>
                <el-button v-else type="primary" icon="el-icon-minus" circle size="small" @click="delRow(scope.row)" ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="splitOrder()">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="明细修改" :visible.sync="dialogFormVisible2" width="450px">
        <el-form :model="detailForm"  ref="detailForm" class='orderForm'>
          <el-form-item label="订单号" :label-width="formLabelWidth">
            <label>{{detailForm.orderNo}}</label>
          </el-form-item>
          <el-form-item label="入罐号" :label-width="formLabelWidth" required >
            <el-select  v-model="detailForm.inPotNo"  placeholder="请选择" @change="changeOptions('inPot')">
              <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="曲房" :label-width="formLabelWidth" required>
            <el-select  v-model="detailForm.houseNo"  placeholder="请选择" @change="changeOptions('house')">
              <el-option v-for="(item, index) in kjmRoomList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连续蒸煮" :label-width="formLabelWidth" >
            <el-select  v-model="detailForm.cookingNo"  placeholder="请选择" @change="changeOptions('cooking')">
              <el-option value='' label=''></el-option>
              <el-option v-for="(item, index) in continueList" :key="index" :label="item.holderName" :value="item.holderId" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="制曲日期" :label-width="formLabelWidth" required>
            <el-date-picker type="date"  value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="detailForm.inKjmDate" ></el-date-picker>
          </el-form-item>
          <el-form-item label="生产日期" :label-width="formLabelWidth" required>
            <el-date-picker type="date"  value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="detailForm.productDate" ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible2 = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="modifyDetial()">保存</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {BASICDATA_API, KJM_API} from '@/api/api'
import {Vue, Component, Watch} from 'vue-property-decorator'
import {Order} from '../entity/Order.ts'
import {OrderDetail} from '../entity/OrderDetail.ts'
import {Status} from '../entity/Enum.ts'
import {dateFormat} from '@/net/validate'
@Component({
  components: {
  }
})

export default class Index extends Vue {
  // $refs: {
  //   temporaryWorker: TemporaryWorker,
  //   loanedPersonnel: LoanedPersonnel,
  //   officialWorker: officialWorker
  // }
  // 将common中的参数复制一份到本地
  params = JSON.parse(JSON.stringify(this.$store.state.common.ZQWorkshop.defaultVal))
  orderList:Order[] = []
  orderDetailList:OrderDetail[] = []
  selectedDetailList:OrderDetail[] = []
  splitDetailList:OrderDetail[] = []
  detailForm:OrderDetail = new OrderDetail()
  dialogFormVisible:boolean = false
  dialogFormVisible2:boolean = false
  factoryList = []
  workshopList = []
  potList = []
  kjmRoomList = []
  continueList = []
  searched: boolean = false
  showdetails: boolean = true
  formLabelWidth:string = '120px'
  currPage = 1
  pageSize = 10

  mounted () {
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.retrieveHolders(this.params.workshopId, this.params.workshopName)
  }
  retrieveHolders (workshopId, workshopName) {
    if (workshopId) {
      this.getHolderList(workshopId, workshopName, '入罐')
      this.getHolderList(workshopId, workshopName, '曲房')
      this.getHolderList(workshopId, workshopName, '连续蒸煮')
    }
  }
  isAuth (key) {
    return Vue.prototype.isAuth(key)
  }
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
      this.params.workshopId = ''
      this.params.workshopName = ''
      this.getWorkshop(this.params.factoryId)
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
      this.retrieveHolders(this.params.workshopId, this.params.workshopName)
    } else if (flag === 'inPot') {
      let item = this.potList.find(ele => ele.holderId === this.detailForm.inPotNo)
      this.detailForm.inPotName = item ? item.holderName : ''
    } else if (flag === 'house') {
      let item = this.kjmRoomList.find(ele => ele.holderId === this.detailForm.houseNo)
      this.detailForm.houseName = item ? item.holderName : ''
    } else if (flag === 'cooking') {
      let item = this.continueList.find(ele => ele.holderId === this.detailForm.cookingNo)
      this.detailForm.cookingName = item ? item.holderName : ''
    }
  }
  // 获取工厂
  getFactory () {
    this.factoryList = []
    Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
      if (res.data.code === 0) {
        this.factoryList = res.data.typeList
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 根据工厂获车间
  getWorkshop (fid: string) {
    this.workshopList = []
    if (fid) {
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '制曲'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  // 入罐/曲房/蒸煮
  getHolderList (workshopId, workshopName, type) {
    let params = {
      dept_id: workshopId,
      workShopName: workshopName,
      type: 'holder_type',
      holderStatus: type === '入罐' ? '0' : null,
      holder_type: type === '入罐' ? '001' : type === '曲房' ? '005' : type === '连续蒸煮' ? '008' : '',
      pageSize: 9999,
      currPage: 1
    }
    if (params.holder_type === '') {
      return
    }
    Vue.prototype.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false).then(({data}) => {
      if (data.code === 0) {
        if (type === '入罐') {
          this.potList = data.page.list
        } else if (type === '曲房') {
          this.kjmRoomList = data.page.list
        } else if (type === '连续蒸煮') {
          this.continueList = data.page.list
        }
      } else {
        this.$message.error(data.msg)
      }
    }).catch((error) => {
      console.log('catch data::', error)
    })
  }
  setStore (params) {
    this.$store.commit('common/updateZQDefault', params)
  }
  getOrderList () {
    if (this.params.factoryId === '') {
      this.$message.error('请选择工厂')
      return
    }
    if (this.params.workshopId === '') {
      this.$message.error('请选择车间')
      return
    }
    // if (this.params.orderDate === null || this.params.orderDate === '') {
    //   this.$message.error('请选择订单日期')
    //   return
    // }
    // 保存选项值到common store
    this.setStore(this.params)
    this.searched = true
    this.orderDetailList = []
    this.selectedDetailList = []
    let params = {
      workShop: this.params.workshopId,
      orderDate: this.params.orderDate,
      orderNo: this.params.orderNo,
      orderStatus: this.params.orderStatus
    }
    this.retrieveOrderData(params)
  }
  retrieveOrderData (params) {
    this.orderList = []
    Vue.prototype.$http(`${KJM_API.ORDERLIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        for (let item of res.data.list) {
          let order = new Order(item.orderId, item.orderNo, item.orderDate, item.orderStatus, item.materialCode, item.materialName, item.planOutput, item.outputUnit, item.remark, item.delFlag)
          this.orderList.push(order)
        }
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  // 订单拆分
  orderSplit (row) {
    this.dialogFormVisible = true
    let detail:OrderDetail = new OrderDetail(row.orderId, row.orderNo, row.orderDate, row.orderStatus, row.materialCode, row.materialName, row.planOutput, row.outputUnit, row.remark, row.delFlag)
    // Object.assign(detail, JSON.parse(JSON.stringify(row)))
    detail.isFirst = true
    detail.inKjmDate = dateFormat(new Date(), 'yyyy-MM-dd')
    detail.productDate = dateFormat(new Date(), 'yyyy-MM-dd')
    this.splitDetailList = []
    this.splitDetailList.push(detail)
  }
  // 删除
  delRow (row) {
    row.delFlag = '1'
  }
  // 增加
  addRow (row) {
    let detail:OrderDetail = new OrderDetail(row.orderId, row.orderNo, row.orderDate, row.orderStatus,
      row.materialCode, row.materialName, row.planOutput, row.outputUnit, row.remark, row.delFlag,
      row.id, row.status, row.inPotNo, row.inPotName, row.houseNo, row.houseName, row.cookingNo, row.cookingName, row.inKjmDate, row.productDate, false)
    this.splitDetailList.push(detail)
  }
  // 拆分订单保存
  splitOrder () {
    let params = []
    let houseSet: Set<string> = new Set()
    let potSet: Set<string> = new Set()
    for (let item of this.splitDetailList) {
      if (item.delFlag === '0') {
        if (!item.inPotNo || item.inPotNo.length === 0) {
          this.$message.error('入罐号不能为空')
          return
        }
        if (!item.houseNo || item.houseNo.length === 0) {
          this.$message.error('曲房不能为空')
          return
        }
        if (!item.inKjmDate || item.inKjmDate.length === 0) {
          this.$message.error('制曲日期不能为空')
          return
        }
        if (!item.productDate || item.productDate.length === 0) {
          this.$message.error('生产日期不能为空')
          return
        }
        potSet.add(item.inPotNo)
        if (potSet.size > 1) {
          this.$message.error('同一订单不能多个入罐号')
          return
        }
        let houseKey = item.houseNo + item.inKjmDate
        if (houseSet.has(houseKey)) {
          this.$message.error('相同制曲日期下，曲房重复')
          return
        } else {
          houseSet.add(houseKey)
        }
      }
    }
    for (let item of this.splitDetailList) {
      params.push({
        orderId: item.orderId,
        orderNo: item.orderNo,
        status: '',
        inPotNo: item.inPotNo,
        houseNo: item.houseNo,
        cookingNo: item.cookingNo,
        inKjmDate: item.inKjmDate,
        productDate: item.productDate,
        delFlag: item.delFlag
      })
    }
    Vue.prototype.$http(`${KJM_API.SPLITORDERDETAILLIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        this.dialogFormVisible = false
        this.getOrderList()
        this.retrieveDetail(this.splitDetailList[0].orderId)
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  showDetail (row) {
    this.retrieveDetail(row.orderId)
  }
  retrieveDetail (orderId) {
    this.showdetails = true
    this.selectedDetailList = []
    this.orderDetailList = []
    let params = {
      orderId: orderId,
      currPage: '1',
      pageSize: '9999'
    }
    Vue.prototype.$http(`${KJM_API.ORDERDETAILLIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        for (let item of res.data.page.list) {
          let detail = new OrderDetail()
          detail.id = item.id
          detail.status = item.status
          detail.orderId = item.orderId
          detail.orderNo = item.orderNo
          detail.inPotNo = item.inPotNo
          detail.houseNo = item.houseNo
          detail.cookingNo = item.cookingNo
          detail.inKjmDate = item.inKjmDate
          detail.productDate = item.productDate
          detail.inPotName = item.inPotName
          detail.houseName = item.houseName
          detail.cookingName = item.cookingName
          this.orderDetailList.push(detail)
        }
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  // 多选
  handleChange (selections) {
    this.selectedDetailList = selections
  }
  // 删除订单详情
  delDetail () {
    if (!this.isAuth('sys:kjmOrderHouse:mySaveOrUpdate')) {
      this.$message.error('无权限进行删除操作')
      return
    }
    if (!this.selectedDetailList || this.selectedDetailList.length === 0) {
      this.$message.error('请选择删除项')
      return
    }
    for (let row of this.selectedDetailList) {
      // 提交或者通过的数据不能删除
      if (row.status && (row.status === Status.SUBMIT || row.status === Status.CHECKED)) {
        this.$message.error(`${row.status}的数据不可删除`)
        return
      }
    }
    this.$confirm('是否删除所选项?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // this.selectedDetailList.forEach(item => {
      //   item.delFlag = '1'
      // })
      Vue.prototype.$http(`${KJM_API.DELETEORDERDETAILLIST_API}`, `POST`, this.selectedDetailList).then((res) => {
        if (res.data.code === 0) {
          this.retrieveDetail(this.selectedDetailList[0].orderId)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('catch data::', err)
      })
    })
  }
  // 订单详情修改
  showModifyDetial (row: OrderDetail) {
    if (!this.isAuth('sys:kjmOrderHouse:mySaveOrUpdate')) {
      this.$message.error('无权限进行修改操作')
      return
    }
    if (row.status && (row.status === Status.SUBMIT || row.status === Status.CHECKED)) {
      this.$message.error(`${row.status}的数据不可修改`)
      return
    }
    this.detailForm = row.clone()
    this.dialogFormVisible2 = true
  }
  modifyDetial () {
    if (!this.detailForm.inPotNo || this.detailForm.inPotNo.length === 0) {
      this.$message.error('入罐号不能为空')
      return false
    }
    if (!this.detailForm.houseNo || this.detailForm.houseNo.length === 0) {
      this.$message.error('曲房不能为空')
      return false
    }
    if (!this.detailForm.inKjmDate || this.detailForm.inKjmDate.length === 0) {
      this.$message.error('制曲日期不能为空')
      return false
    }
    if (!this.detailForm.productDate || this.detailForm.productDate.length === 0) {
      this.$message.error('生产日期不能为空')
      return false
    }
    let params: OrderDetail[] = [this.detailForm]
    Vue.prototype.$http(`${KJM_API.SPLITORDERDETAILLIST_API}`, `POST`, params).then((res) => {
      if (res.data.code === 0) {
        this.dialogFormVisible2 = false
        this.retrieveDetail(this.detailForm.orderId)
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  rowDelFlag ({row, rowIndex}) {
    if (row.delFlag === '1') {
      return 'rowDel'
    } else {
      return ''
    }
  }
  orderCheck (row) {
    this.$store.commit('common/updateZQCheckParamsOrderNo', row.orderNo)
    this.$store.commit('common/updateZQCheckParamsOrderId', row.orderId)
    this.pushPage('DataEntry-KojiMaking-orderAuditing-index')
  }
  get totalCount () {
    return this.orderList.length
  }
  get currentOrderList () {
    return this.orderList.slice((this.currPage - 1) * this.pageSize, this.currPage * this.pageSize)
  }
  handleSizeChange (val: number) {
    this.pageSize = val
    this.currPage = 1
  }
  handleCurrentChange (val: number) {
    this.currPage = val
  }
  get mainTabs () {
    return this.$store.state.common.mainTabs
  }
  set mainTabs (val) {
    this.$store.commit('common/updateMainTabs', val)
  }
  pushPage (name) {
    this.mainTabs = this.mainTabs.filter(item => item.name !== name)
    let that = this
    setTimeout(function () {
      that.$router.push({name})
    }, 100)
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
  }
  // @Watch('params.factoryId')
  // onFactoryValue (newVal: string, oldVal: string) {
  //   this.params.workshopId = ''
  //   this.params.workshopName = ''
  //   this.getWorkshop(newVal)
  // }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_common.scss';
</style>
<style lang="scss" scoped>
  .box-item{
    height:220px;
    box-sizing:border-box;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(232,232,232,1);
    .box-item-top{
      height:178px;
      padding:10px 10px;
      padding-bottom:0px;
      border-bottom: 1px solid rgba(232,232,232,1);
      .box-item-title{
        display:flex;
        flex:1;
        justify-content:space-between;
        height:34px;
        .box-item-title-name{
          display:flex;
          flex:1;
          :first-child{
            height:30px;
            width:30px;
            border-radius:15px;
            background:#FFBF00;
            font-size:12px;
            font-weight:500;
            color:#fff;
            line-height:30px;
            text-align:center;
          }
          :nth-child(2){
            font-size:16px;
            font-weight:400;
            color:rgba(0,0,0,0.85);
            line-height:22px;
            margin-top:4px;
            margin-left:5px;
          }
        }
        .box-item-title-state{
          flex:1;
          font-size:14px;
          font-weight:500;
          color:rgba(0,0,0,0.65);
          line-height:20px;
          text-align:right;
          margin-top:4px;
          &:before{
            content:'';
            display: inline-block;
            height:6px;
            width:6px;
            margin-right:10px;
            margin-bottom:2px;
            background:rgba(126,211,33,1)
          }
        }
      }
      .box-item-container{
        display:flex;
        flex:1;
        justify-content:space-between;
        height:129px;
        .box-item-container-left{
          display:flex;
          justify-content:center;
          width:130px;
          padding-top:10px;
          .box-item-container-img{
            width:94px;
            height:86px;
            background: url('~@/assets/img/fajiaoguan.png')
          }
        }
        .box-item-container-right{
          flex:1;
          display:flex;
          flex-direction:column;
          margin-left:10px;
          .box-item-container-item{
            flex:1;
            display:flex;
            justify-content:space-between;
            .name{
              width:60px;
              font-size:12px;
              font-weight:400;
              color:rgba(0,0,0,0.45);
              line-height:20px;
            }
            .detail{
              flex:1;
              font-size:14px;
              font-weight:500;
              color:rgba(0,0,0,0.65);
              line-height:17px;
            }
          }
        }
      }
    }
    .box-item-bottom{
      height:40px;
      box-sizing:border-box;
      display:flex;
      justify-content:space-between;
      background:rgba(247,249,250,1);
      border-radius:0px 0px 2px 2px;
      .box-item-bottom-item{
        flex:1;
        text-align:center;
        line-height:40px;
        font-size:12px;
        font-weight:500;
        color:rgba(0,0,0,0.65);
        &:hover{
          color:#fff;
          background:#1890FF;
          cursor:pointer
        }
      }
      .box-item-bottom-split{
        width:1px;
        height:16px;
        background:rgba(232,232,232,1);
        margin-top:12px;
      }
    }
 }
.rowButton{
  button{
    margin: 0px 3px!important;
  }
}
.operator{
  font-size:14px;
  font-weight:400;
  color:rgba(24,144,255,1);
  line-height:22px;
  display:flex;
  &:hover{
    cursor:pointer
  }
}
.operator .split{
  height:22px;
  width:14px;
  background: url('~@/assets/img/chaifen.png');
  background-position:center center;
  background-repeat:no-repeat;
}
.operator .check{
  height:22px;
  width:14px;
  background:url('~@/assets/img/heshi.png');
  background-position:center center;
  background-repeat:no-repeat;
}
// .operator:nth-child(2){
//   &:after{
//     content:'';
//     display: inline-block;
//     height:14px;
//     width:1px;
//     background:rgba(233,233,233,1);
//   }
// }
</style>
<style lang='scss'>
.dialog__class{
  border-radius:6px 6px 0px 0px !important;
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
  .reqI{
    color: red;
  }
  .rowDel{
    display: none;
  }
}
</style>
