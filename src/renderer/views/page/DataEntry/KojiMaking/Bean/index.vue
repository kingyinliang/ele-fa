<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex" style="border-bottom:1px solid #E9E9E9;margin-bottom:12px">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" label-width="42px">
                <el-form-item label="工厂：">
                  <el-select v-model="params.factoryId" class="selectwpx" style="width:140px" @change="changeOptions('factory')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车间：">
                  <el-select v-model="params.workshopId" class="selectwpx" style="width:140px" @change="changeOptions('workshop')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="制曲日期：" label-width="70px">
                  <el-date-picker type="date" v-model="params.zqDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                </el-form-item>
                <el-form-item label="生产状态：" label-width="70px" style='display:none;'>
                  <el-select v-model="params.productStatus" class="selectwpx" style="width:140px">
                    <el-option label="正常生产" value="normal"></el-option>
                    <el-option label="无生产" value="abnormal"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width:340px">
              <el-row class="rowButton">
                <el-button type="primary" size="small" @click="getOrderList()" style="float:right">查询</el-button>
                <template v-if="params.productStatus === 'abnormal'">
                  <el-button v-if="searched && disabled" type="primary" size="small" @click="setDisabled(false)" style="float:right">编辑</el-button>
                  <el-button v-if="!disabled" type="primary" size="small" @click="setDisabled(true)" style="float:right">返回</el-button>
                </template>
                <template v-if="params.productStatus === 'abnormal' && !disabled">
                  <el-button type="primary" size="small" @click="addPeople" style="float:right">新增</el-button>
                  <el-button type="primary" size="small" @click="save" style="float:right">保存</el-button>
                </template>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-row v-if="params.productStatus === 'normal' && searched" style="margin-top:20px;">
          <el-col>
            <el-row :gutter="32" v-for="(item, index) in orderList" :key="index" v-if="index%3===0">
              <el-col :span="8" v-if="index < orderList.length">
                <div class="box-item">
                  <div class="box-item-top">
                    <div class="box-item-title">
                      <div class="box-item-title-name"><div>{{orderList[index].houseNo}}</div><div>{{orderList[index].inPotNoName}}</div></div>
                      <div class="box-item-title-state">状态：{{orderList[index].beanStatus}}</div>
                    </div>
                    <div class="box-item-container">
                      <div class="box-item-container-left">
                        <div class="box-item-container-img"></div>
                      </div>
                      <div class="box-item-container-right">
                        <div class="box-item-container-item"><div class="name">生产订单</div><div class="detail">{{orderList[index].orderNo}}</div></div>
                        <div class="box-item-container-item"><div class="name">生产品项</div><div class="detail">{{orderList[index].materialCode + ' ' + orderList[index].materialName}}</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时长</div><div class="detail">{{orderList[index].inEndTimeLength}} 小时</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时间</div><div class="detail">{{orderList[index].inEndTime ? orderList[index].inEndTime : ''}}</div></div>
                      </div>
                    </div>
                  </div>
                  <div class="box-item-bottom">
                    <el-tooltip class="item" effect="dark" :content="orderList[index].beanStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color':orderList[index].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index])">数据录入</div>
                    </el-tooltip>
                    <!-- <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index].guardStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index])">看曲</div>
                    </el-tooltip>
                    <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index].outStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index])">出曲</div>
                    </el-tooltip> -->
                  </div>
                </div>
              </el-col>
              <el-col  :span="8" v-if="index + 1 < orderList.length">
                <div class="box-item">
                  <div class="box-item-top">
                    <div class="box-item-title">
                      <div class="box-item-title-name"><div style="background:#5BD171">{{orderList[index + 1].houseNo}}</div><div>{{orderList[index + 1].inPotNoName}}</div></div>
                      <div class="box-item-title-state">状态：{{orderList[index + 1].beanStatus}}</div>
                    </div>
                    <div class="box-item-container">
                      <div class="box-item-container-left">
                        <div class="box-item-container-img"></div>
                      </div>
                      <div class="box-item-container-right">
                        <div class="box-item-container-item"><div class="name">生产订单</div><div class="detail">{{orderList[index + 1].orderNo}}</div></div>
                        <div class="box-item-container-item"><div class="name">生产品项</div><div class="detail">{{orderList[index + 1].materialCode + ' ' + orderList[index + 1].materialName}}</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时长</div><div class="detail">{{orderList[index + 1].inEndTimeLength}} 小时</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时间</div><div class="detail">{{orderList[index + 1].inEndTime ? orderList[index + 1].inEndTime : ''}}</div></div>
                      </div>
                    </div>
                  </div>
                  <div class="box-item-bottom">
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 1].beanStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index + 1].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index + 1])">数据录入</div>
                    </el-tooltip>
                    <!-- <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 1].guardStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index + 1].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index + 1])">看曲</div>
                    </el-tooltip>
                    <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 1].outStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index + 1].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index + 1])">出曲</div>
                    </el-tooltip> -->
                  </div>
                </div>
              </el-col>
              <el-col :span="8" v-if="index + 2 < orderList.length">
                <div class="box-item">
                  <div class="box-item-top">
                    <div class="box-item-title">
                      <div class="box-item-title-name"><div style="background:#2C92F6">{{orderList[index + 2].houseNo}}</div><div>{{orderList[index + 2].inPotNoName}}</div></div>
                      <div class="box-item-title-state">状态：{{orderList[index + 2].beanStatus}}</div>
                    </div>
                    <div class="box-item-container">
                      <div class="box-item-container-left">
                        <div class="box-item-container-img"></div>
                      </div>
                      <div class="box-item-container-right">
                        <div class="box-item-container-item"><div class="name">生产订单</div><div class="detail">{{orderList[index + 2].orderNo}}</div></div>
                        <div class="box-item-container-item"><div class="name">生产品项</div><div class="detail">{{orderList[index + 2].materialCode + ' ' + orderList[index + 2].materialName}}</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时长</div><div class="detail">{{orderList[index + 2].inEndTimeLength}} 小时</div></div>
                        <div class="box-item-container-item"><div class="name">入曲时间</div><div class="detail">{{orderList[index + 2].inEndTime ? orderList[index + 2].inEndTime : ''}}</div></div>
                      </div>
                    </div>
                  </div>
                  <div class="box-item-bottom">
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 2].beanStatus" placement="top-start">
                    <div class="box-item-bottom-item" :style="{'color': orderList[index + 2].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index + 2])">数据录入</div>
                    </el-tooltip>
                    <!-- <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 2].guardStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index + 2].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index + 2])">看曲</div>
                    </el-tooltip>
                    <div class="box-item-bottom-split"></div>
                    <el-tooltip class="item" effect="dark" :content="orderList[index + 2].outStatus" placement="top-start">
                      <div class="box-item-bottom-item" :style="{'color': orderList[index + 2].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index + 2])">出曲</div>
                    </el-tooltip> -->
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-show="params.productStatus === 'abnormal' && searched" style="margin-top:20px;">
          <div style="min-height:340px">
          <el-table border  header-row-class-name="tableHead" :data="datalist">
            <!-- <el-table-column label="序号" width="50" prop="id" type="index"></el-table-column> -->
            <el-table-column label="中/白/夜班" prop="classType" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.classType" placeholder="请选择" size="small" :disabled="disabled">
                  <el-option v-for="sole in DayTypeList" :key="sole" :value="sole" :label="sole"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="工序"  width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.deptId" placeholder="请选择" size="small" @change="changeProcType(scope.row)" :disabled="disabled">
                  <el-option v-for="sole in processesList" :key="sole.deptId" :value="sole.deptId" :label="sole.deptName"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="人员属性" prop="userType" width="110">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userType" placeholder="请选择" size="small" @change="changeProcType(scope.row)" :disabled="disabled">
                  <el-option v-for="sole in EmployeeTypeList" :key="sole" :value="sole" :label="sole"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <el-col>
                  <span v-if="!disabled" style="cursor:pointer" @click="selectUser(scope.row)">
                    <i v-if="scope.row.userId!== undefined">{{scope.row.userId.join(",")}}</i>
                    <span>
                      <i v-if="scope.row.userType === '临时工'">点击输入临时工</i>
                      <i v-else>点击选择人员</i>
                    </span>
                  </span>
                  <span v-else style="cursor:pointer">
                    <i v-if="scope.row.userId!== undefined">{{scope.row.userId.join(",")}}</i>
                    <span>
                      <i v-if="scope.row.userType === '临时工'">点击输入临时工</i>
                      <i v-else>点击选择人员</i>
                    </span>
                  </span>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startDate" width="190">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.startDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width:175px" :disabled="disabled"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="用餐时间" prop="dinner" width="100">
              <template slot-scope="scope">
                <el-input type='number' size="small" v-model="scope.row.dinner" :disabled="disabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endDate" width="190">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width:175px" :disabled="disabled"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" width="150px">
              <template slot-scope="scope">
                <Remark v-model='scope.row.remark' :width="'150px'" :disabled="disabled" ></Remark>
                <!-- <el-input size="small" v-model="scope.row.remark" :disabled="disabled"></el-input> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="50">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle size="small" @click="delUser(scope.row)" :disabled="disabled" ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="font-size:14px;line-height:30px;margin-top:10px">
            实际作业人数: {{countMan}}
          </el-row>
          </div>
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
        </el-row>
      </div>
      <temporary-worker ref="temporaryWorker" @changeUser="changeUser"></temporary-worker>
      <loaned-personnel ref="loanedPersonnel" @changeUser="changeUser" :OrgTree="OrgTree" :arrList="arrList"></loaned-personnel>
      <official-worker ref="officialWorker" @changeUser="changeUser"></official-worker>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {BASICDATA_API, WHT_API, KJM_API} from '@/api/api'
import {dateFormat} from '@/net/validate'
import {Vue, Component, Watch} from 'vue-property-decorator'
import TemporaryWorker from '@/views/components/temporaryWorker.vue'
import LoanedPersonnel from '@/views/components/loanedPersonnel.vue'
import officialWorker from '@/views/components/officialWorker.vue'
import {Employee} from '../entity/Employee.ts'
import {DayType, EMPType} from '../entity/Enum.ts'
import {House} from '../entity/House.ts'

@Component({
  components: {
    TemporaryWorker,
    LoanedPersonnel,
    officialWorker
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
  factoryList = []
  workshopList = []
  processesList = []
  searched: boolean = false
  disabled: boolean = true
  datalist: Array<Employee> = []
  totalList: Array<Employee> = []
  OrgTree = []
  arrList = []
  row = {
    userId: []
  }
  currPage: number = 1
  pageSize: number = 10
  totalCount: number = 0
  // 首页订单
  orderList:Array<House> = []

  mounted () {
    this.params.zqDate = dateFormat(new Date(), 'yyyy-MM-dd')
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    // this.getProcess(this.params.workshopId)
    // this.getTree()
  }
  get mainTabs () {
    return this.$store.state.common.mainTabs
  }
  set mainTabs (val) {
    this.$store.commit('common/updateMainTabs', val)
  }
  get countMan (): number {
    let num: number = 0
    if (this.totalList && this.totalList.length > 0) {
      this.totalList.forEach((item) => {
        if (item.userId) {
          num += item.userId.length
        }
      })
    }
    return num
  }
  get DayTypeList () {
    return DayType
  }

  get EmployeeTypeList () {
    return EMPType
  }

  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
    }
  }
  changeProcType (row) {
    row.userId = []
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
  // 根据车间获取工序
  getProcess (wsid: string) {
    this.processesList = []
    if (wsid) {
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: wsid}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.processesList = data.childList
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
  setDisabled (flag: boolean) {
    this.disabled = flag
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
    if (this.params.zqDate === null || this.params.zqDate === '') {
      this.$message.error('请选择制曲时间')
      return
    }
    if (this.params.productStatus === '') {
      this.$message.error('请选择生产状态')
      return
    }
    // 保存选项值到common store
    this.setStore(this.params)
    // his.lodingStatus = true
    this.searched = true
    if (this.params.productStatus === 'normal') { // 正常生产
      let params = {
        factory: this.params.factoryId,
        workShop: this.params.workshopId,
        inKjmDate: this.params.zqDate
      }
      this.retrieveOrderList(params)
    } else if (this.params.productStatus === 'abnormal') {
      // 无生产
      this.disabled = true
      this.datalist = []
      this.totalList = []
      Vue.prototype.$http(`${WHT_API.CINDEXLISTUSER}`, 'POST', {deptId: this.params.workshopId, productDate: this.params.zqDate}).then(res => {
        if (res.data.code === 0) {
          for (let item of res.data.infoUser) {
            // 请求回来的数据做类型和格式转换
            item.productDate = item.productDate ? item.productDate.substring(0, 10) : item.productDate
            item.dinner = item.dinner + ''
          }
          this.totalCount = res.data.infoUser.length
          this.totalList = res.data.infoUser
          this.datalist = res.data.infoUser.slice(0, this.pageSize)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('catch data::', err)
      })
    }
  }
  retrieveOrderList (params) {
    this.orderList = []
    Vue.prototype.$http(`${KJM_API.KJMAKINGORDERLIST_API}`, 'POST', params).then(res => {
      if (res.data.code === 0) {
        for (let item of res.data.list) {
          let order = new House(item.orderId, item.orderNo, item.materialCode, item.materialName, item.houseNo, item.inPotNoName, item.inEndTime, item.inEndTimeLength, item.orderHouseId, item.status, item.beanStatus, item.guardStatus, item.outStatus)
          this.orderList.push(order)
        }
        this.sortOrderList()
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  sortOrderList () {
    if (this.orderList) {
      this.orderList.sort(this.compare())
    }
  }
  // 不通过>>未录入>>已保存>>已提交>>审核通过
  compare () {
    let that = this
    return function (a, b) {
      let status1 = that.compareVal(a.beanStatus)
      let status2 = that.compareVal(b.beanStatus)
      let flag1 = status2 > status1 ? 1 : status2 === status1 ? 0 : -1
      let inPotVal = a.inPotNoName.localeCompare(b.inPotNoName)
      let flag2 = inPotVal > 0 ? 1 : inPotVal === 0 ? 0 : -1
      let houseVal = a.houseNo.localeCompare(b.houseNo)
      let flag3 = houseVal > 0 ? 1 : houseVal === 0 ? 0 : -1
      return flag1 * 100 + flag2 * 10 + flag3
    }
  }
  compareVal (val) {
    switch (val) {
      case '不通过':
        return 5
      case '未录入':
        return 4
      case '已保存':
        return 3
      case '已提交':
        return 2
      case '通过':
        return 1
      default :
        return 0
    }
  }
  // 新增人员
  addPeople () {
    let p = new Employee('', this.params.zqDate, '60')
    this.datalist.push(p)
  }
  // 人员删除
  delUser (row) {
    if (row.orderId && row.orderId !== '') {
      // 原始数据后端删除
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.prototype.$http(`${WHT_API.CINDEXDELUSER}`, 'POST', {orderId: row.orderId}).then(({data}) => {
          if (data.code === 0) {
            this.datalist.splice(this.datalist.indexOf(row), 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    } else {
      // 新增数据前端删除
      this.datalist.splice(this.datalist.indexOf(row), 1)
    }
  }
  // 选择人员 正式 借调
  selectUser (row) {
    this.row = row
    let loanedPersonnel: any = this.$refs.loanedPersonnel
    let officialWorker: any = this.$refs.officialWorker
    let temporaryWorker: any = this.$refs.temporaryWorker
    if (row.userType === EMPType.TRANSFER) {
      this.$nextTick(() => {
        loanedPersonnel.init(row.userId)
      })
    } else if (row.userType === EMPType.FORMAL) {
      if (row.deptId && row.deptId !== '') {
        this.$nextTick(() => {
          officialWorker.init(row.deptId, row.userId)
        })
      } else {
        this.$message.error('请选择工序')
      }
    } else if (row.userType === EMPType.TEMP) {
      this.$nextTick(() => {
        temporaryWorker.init(row)
      })
    } else {
      this.$message.error('请选择人员属性')
    }
  }
  // 员工确认
  changeUser (userId) {
    this.row.userId = userId
    this.$set(this.row, userId, this.row.userId)
  }
  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    this.currPage = 1
    this.datalist = this.totalList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize)
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
    this.datalist = this.totalList.slice((this.currPage - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize)
  }
  save () {
    if (!this.datalist || this.datalist.length === 0) {
      this.$message.error('请先新增数据')
      return
    }
    this.$confirm('确认保存，是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      for (let item of this.datalist) {
        if (!item.classType) {
          this.$message.error('班次不能为空')
          return
        }
        if (!item.deptId || item.deptId === '') {
          this.$message.error('工序不能为空')
          return
        }
        if (!item.userType) {
          this.$message.error('人员属性不能为空')
          return
        }
        if (!item.userId || item.userId.length === 0) {
          this.$message.error('作业人员不能为空')
          return
        }
        if (!item.startDate || item.startDate === '') {
          this.$message.error('开始时间不能为空')
          return
        }
        if (!item.dinner || item.dinner === '') {
          this.$message.error('用餐时间不能为空')
          return
        }
        if (!item.endDate || item.endDate === '') {
          this.$message.error('结束时间不能为空')
          return
        }
      }
      Vue.prototype.$http(`${WHT_API.CINDEXUPDATEUSER}`, 'POST', this.datalist).then(({data}) => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.$message.error('保存失败，' + err)
      })
    })
  }
  // 获取组织结构树
  getTree () {
    this.OrgTree = []
    this.arrList = []
    Vue.prototype.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}, false, false, false).then(({data}) => {
      if (data.code === 0) {
        this.OrgTree = data.deptList
        this.arrList = [this.OrgTree[0].children[0].deptId]
      } else {
        this.$message.error(data.msg)
      }
    })
  }
  goPage (page: string, item: House) {
    this.$store.commit('common/updateZQParamsOrderNo', item.orderNo)
    this.$store.commit('common/updateZQParamsOrderId', item.orderId)
    let name = ''
    if (page === '煮豆') {
      this.$store.commit('common/updateZQParamsBeanHouseId', item.orderHouseId)
      name = 'DataEntry-KojiMaking-BoiledBeans-index'
    } else if (page === '看曲') {
      this.$store.commit('common/updateZQParamsLookHouseId', item.orderHouseId)
      name = 'DataEntry-KojiMaking-Look-index'
    } else if (page === '出曲') {
      this.$store.commit('common/updateZQParamsOutHouseId', item.orderHouseId)
      name = 'DataEntry-KojiMaking-Out-index'
    }
    this.pushPage(name)
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
    this.disabled = true
  }
  @Watch('params.factoryId')
  onFactoryValue (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.getWorkshop(newVal)
  }
  @Watch('params.workshopId')
  onWorkshopValue (newVal: string, oldVal: string) {
    this.getProcess(newVal)
  }
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
        justify-content:space-between;
        flex:1;
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
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
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
.box-card{
  .pro-line { border-bottom: 1px solid #dcdfe6; }
  .pro-line p { color: red; font-size: 16px; letter-spacing: .1em; }
  b{
    font-size: 16px;
    line-height: 32px;
    float: left;
  }
  .item{
    margin-top: 20px;
    display: flex;
    img{
      float: left;
      width: 220px;
      height: 220px;
      border-radius: 6px;
      border: 1px solid #dcdfe6;
      margin-right: 20px;
    }
    .itemForm{
      flex: 1;
      p{
        color: #8a979e;
      }
    }
    .margb20px{margin-bottom: 10px}
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
