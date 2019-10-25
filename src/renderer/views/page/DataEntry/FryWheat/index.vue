<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <div class="main">
      <el-card class="newCard" style="min-height: 480px">
        <el-row type="flex" style="border-bottom: 1px solid #E9E9E9;margin-bottom: 12px">
          <el-col>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="42px">
              <el-form-item label="工厂：">
                <el-select v-model="plantList.factoryid" class="selectwpx" style="width: 140px">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：">
                <el-select v-model="plantList.workshopid" class="selectwpx" style="width: 140px">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：" label-width="70px">
                <el-date-picker type="date" v-model="plantList.productDate" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
              </el-form-item>
              <el-form-item label="生产状态：" label-width="70px">
                <el-select v-model="plantList.status" class="selectwpx" style="width: 140px">
                  <el-option label="正常生产" value="normal"></el-option>
                  <el-option label="无生产" value="abnormal" v-if="isAuth('wht:user:listUser')"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 340px">
            <el-row class="rowButton">
              <el-button type="primary" size="small" @click="GetOrderList(true)" style="float: right">查询</el-button>
              <template v-if="type === 'abnormal'">
                <el-button v-if="isdisabled === true && isAuth('wht:user:updateUser')" type="primary" size="small" @click="isdisabledFn" style="float: right">编辑</el-button>
                <el-button v-if="isdisabled === false" type="primary" size="small" @click="disabledFn" style="float: right">返回</el-button>
              </template>
              <template v-if="type === 'abnormal' && isdisabled === false">
                <el-button type="primary" size="small" @click="AddPeople" style="float: right">新增</el-button>
                <el-button type="primary" size="small" @click="save" style="float: right">保存</el-button>
              </template>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="type === 'normal'" :gutter="20">
          <el-col v-for="(item, index) in FryWheatList" :key="index" id="normal" :span="12">
            <div class="title_left" style="font-size: 16px;font-weight: bold;margin-bottom: 8px;">工序： <font style="color:red">{{item.productLineName}}</font></div>
            <div class="sole_cont">
              <el-form size="small" :inline="true" label-position="right" label-width="90px">
                <div class="itemImg">
                  <img :src="'data:image/gif;base64,' + item.img" alt="" style="width:100%; min-height:181px">
                </div>
                <div class="title_left">
                  <div style="float: left;font-size: 14px;font-weight: normal;line-height: 60px">
                    <span class="points" :style="{'background': item.orderStatus === 'noPass'? 'red': item.orderStatus === 'checked'? '#67C23A' : item.orderStatus === 'submit'? '#1890ff' : item.orderStatus === 'saved'? '#1890ff' : '#7ED321'}"></span>订单状态：<i :style="{'color': item.orderStatus === 'noPass'? 'red': item.orderStatus === 'checked'? '#67C23A' : ''}">{{item.orderStatus === 'submit'? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass'?  '审核不通过' : item.orderStatus === 'saved'? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus}}</i>
                  </div>
                  <el-button @click="go(item)" type="primary" size="small" style="float: right; margin-top: 14px;background-color: #1890FF;color: white" v-if="isAuth('wht:order:list') || isAuth('sys:whtPwMaterial:list')">数据录入</el-button>
                </div>
                <div class="normal_bottom">
                    <el-form-item label="订单号：" class="width50b">
                      <el-select v-model="item.orderNo" placeholder="请选择" :change="orderchange(item)" style="width:150px">
                        <el-option label=""  value=""></el-option>
                        <el-option :label="item" v-for="(item, index) in item.order_arr" :key="index" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="计划产量：" class="width50b">
                      <div style="width:152px; border-bottom:1px solid #ccc">&nbsp;{{item.planOutput + ' ' + item.outputUnit}}</div>
                    </el-form-item>
                    <el-form-item label="品项：" class="width50b">
                      <div style="width:150px; border-bottom:1px solid #ccc">&nbsp;{{item.materialCode + ' ' + item.materialName}}</div>
                    </el-form-item>
                    <el-form-item label="实际产量：" class="width50b">
                      <div style="width:152px; border-bottom:1px solid #ccc">&nbsp;{{item.realOutput + ' ' + item.outputUnit}}</div>
                    </el-form-item>
                </div>
              </el-form>
            </div>
          </el-col>
          <!-- <el-col :span="12" v-for="(item, index) in FryWheatList" :key="index" style="margin-bottom: 10px">
            <el-card class="box-card">
              <el-form  size="small" label-position="right" label-width="85px">
                <div class="clearfix pro-line">
                  <el-form-item label="工序：">
                    <p>
                      {{item.productLineName}}
                      <el-button @click="go(item)" type="primary" size="small" style="float: right">数据录入</el-button>
                    </p>
                  </el-form-item>
                </div>
                <div class="clearfix item">
                  <img :src="'data:image/gif;base64,' + item.img" alt="">
                  <div class="itemForm">
                    <el-form-item label="订单号：" class="margb20px">
                      <el-select v-model="item.orderNo" placeholder="请选择" :change="orderchange(item)">
                        <el-option label=""  value=""></el-option>
                        <el-option :label="item" v-for="(item, index) in item.order_arr" :key="index" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="品项：" class="margb20px">
                      <p class="hiddenP">{{item.materialCode + ' ' + item.materialName}}</p>
                    </el-form-item>
                    <el-form-item label="计划产量：" class="margb20px">
                      <p>{{item.planOutput + ' ' + item.outputUnit}}</p>
                    </el-form-item>
                    <el-form-item label="实时产量：" class="margb20px">
                      <p>{{item.realOutput? item.realOutput + item.outputUnit: '0' + ' ' + item.outputUnit}}</p>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-card>
          </el-col> -->
        </el-row>
        <el-row v-else-if="type === 'abnormal'">
          <div style="min-height: 340px">
          <el-table border  header-row-class-name="tableHead" :data="datalist">
            <!-- <el-table-column prop="orderId"></el-table-column> -->
            <el-table-column label="序号" width="50" prop="id" type="index"></el-table-column>
            <el-table-column label="中/白/夜班" prop="classType" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.classType" placeholder="请选择" size="small" :disabled="isdisabled">
                  <el-option v-for="sole in dayTypeList" :key="sole.value" :value="sole.value" :label="sole.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="班组/工序"  width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.deptId" placeholder="请选择" size="small" @change="changeProcType(scope.row)" :disabled="isdisabled">
                  <el-option v-for="sole in processesList" :key="sole.deptId" :value="sole.deptId" :label="sole.deptName"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="人员属性" prop="userType" width="110">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userType" placeholder="请选择" size="small" @change="changeProcType(scope.row)" :disabled="isdisabled">
                  <el-option v-for="sole in userTypeList" :key="sole.value" :value="sole.value" :label="sole.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-col>
                  <span v-if="!isdisabled" style="cursor: pointer" @click="selectUser(scope.row)">
                    <i v-if="scope.row.userId!== undefined">{{scope.row.userId.join(",")}}</i>
                    <span>
                      <i v-if="scope.row.userType == '临时工'">点击输入临时工</i>
                      <i v-else>点击选择人员</i>
                    </span>
                  </span>
                  <span v-else style="cursor: pointer">
                    <i v-if="scope.row.userId!== undefined">{{scope.row.userId.join(",")}}</i>
                    <span>
                      <i v-if="scope.row.userType == '临时工'">点击输入临时工</i>
                      <i v-else>点击选择人员</i>
                    </span>
                  </span>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startDate">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.startDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width:175px" :disabled="isdisabled"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="用餐时间" prop="dinner" width="80">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.dinner" :disabled="isdisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endDate">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width:175px" :disabled="isdisabled"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" width="100px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.remark" :disabled="isdisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="50">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle size="small" @click="delUser(scope.row)" :disabled="isdisabled" v-if="isAuth('wht:user:delUser')"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="font-size:14px; line-height:30px; margin-top:10px">
            实际作业人数: {{countMan}}
          </el-row>
          </div>
          <el-row v-if="addRowStatus!=1">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="plantList.currPage"
              :page-sizes="[2, 3, 4]"
              :page-size="plantList.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="plantList.totalCount">
            </el-pagination>
          </el-row>
        </el-row>
      </el-card>
    </div>
    <temporary-worker ref="temporaryWorker" @changeUser="changeUser"></temporary-worker>
    <loaned-personnel ref="loanedPersonnel" @changeUser="changeUser" :OrgTree="OrgTree" :arrList="arrList"></loaned-personnel>
    <official-worker ref="officialWorker" @changeUser="changeUser"></official-worker>
  </el-col>
</template>

<script>
import {BASICDATA_API, WHT_API} from '@/api/api'
import {dateFormat, orderList} from '@/net/validate'
import TemporaryWorker from '@/views/components/temporaryWorker'
import LoanedPersonnel from '@/views/components/loanedPersonnel'
import officialWorker from '@/views/components/officialWorker'
export default {
  name: 'index',
  data () {
    return {
      FryWheatList: [],
      lodingStatus: false,
      isdisabled: true,
      plantList: {
        factoryid: '',
        workshopid: '',
        productDate: '',
        status: 'normal',
        currPage: 1,
        pageSize: 2,
        totalCount: 0,
        orderId: ''
      },
      factory: '',
      workshop: '',
      productDate: '',
      factoryid: '',
      type: '', // plantList.status
      datalist: [], // 查询列表
      addRowStatus: 0, // 人员新增 1增
      dayTypeList: [{value: '白班'}, {value: '中班'}, {value: '夜班'}],
      userTypeList: [{value: '正式'}, {value: '借调'}, {value: '临时工'}],
      processesList: [], // 车间工序list
      row: {},
      OrgTree: [],
      arrList: [],
      pwshow: false,
      abnorsave: true,
      totalList: ''
    }
  },
  watch: {
    'plantList.factoryid' (n) {
      this.Getworkshop(n)
    },
    'plantList.workshopid' (n) {
      this.GetProcess(n)
    }
  },
  mounted () {
    if (this.PkgproductDate === '') {
      this.plantList.productDate = dateFormat(new Date(), 'yyyy-MM-dd')
    } else {
      this.plantList.productDate = this.PkgproductDate
    }
    this.GetfactoryList()
    this.getTree()
  },
  methods: {
    go (item) {
      this.FWworkShop = this.workShop
      this.FWfactoryid = this.factoryid
      if (item.productLineName === '炒麦') {
        // 存储炒麦的state
        this.FWproductDate = this.productDate.replace(/-/g, '')
        this.FWorderNo = item.orderNo
        this.FWproductLine = item.productLine
        this.FWproductLineName = item.productLineName
        if (item.orderNo && item.properties) {
          this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-FryWheat-EnterData-dataEntryIndex')
          this.FWorderId = item.orderIdList[item.orderNo]
          let that = this
          setTimeout(function () {
            that.$router.push({ name: `DataEntry-FryWheat-EnterData-dataEntryIndex` })
          }, 100)
        } else {
          this.$message.error('请选择订单号')
        }
      } else {
        // 存储脱皮的state
        let order = {
          orderNo: item.orderNo ? item.orderNo : '',
          orderId: '',
          productLine: item.productLine,
          productLineName: item.productLineName,
          productDate: this.productDate.replace(/-/g, '')
        }
        this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-FryWheat-PwWheat-dataEntryIndex')
        this.PWorder = order
        let that = this
        setTimeout(function () {
          that.$router.push({ name: `DataEntry-FryWheat-PwWheat-dataEntryIndex` })
        }, 100)
      }
    },
    // 获取工厂
    GetfactoryList () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
        if (res.data.code === 0) {
          this.factory = res.data.typeList
          if (!this.plantList.factoryid) {
            this.plantList.factoryid = res.data.typeList[0].deptId
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 根据工厂获车间
    Getworkshop (fid) {
      this.plantList.workshopid = ''
      if (fid) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '炒麦'}, false, false, false).then(res => {
          if (res.data.code === 0) {
            this.workshop = res.data.typeList
            if (!this.plantList.factoryid) {
              this.plantList.workshopid = res.data.typeList[0].deptId
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        this.workshop = ''
      }
    },
    // 根据车间获取工序
    GetProcess (id) {
      this.processesList = []
      // if (id) {
      //   this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}, false, false, false).then(({data}) => {
      //     if (data.code === 0) {
      //       this.processesList = data.childList
      //     } else {
      //       this.$message.error(data.msg)
      //     }
      //   })
      // } else {
      //   this.processesList = []
      // }
      if (id) {
        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {id: id, factory: this.plantList.factoryid}).then(({data}) => {
          if (data.code === 0) {
            this.processesList = data.teamList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {factory: this.plantList.factoryid}).then(({data}) => {
          if (data.code === 0) {
            this.processesList = data.teamList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取组织结构树
    getTree () {
      this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.OrgTree = data.deptList
          this.arrList = [this.OrgTree[0].children[0].deptId]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetorderList () {
      this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
        workShop: this.plantList.workshopid,
        productDate: this.plantList.productDate.replace(/-/g, ''),
        orderNo: ''
      }).then(({data}) => {
        if (data.code === 0) {
          this.FryWheatList = orderList(data.list)
          this.workShop = this.plantList.workshopid
          this.productDate = this.plantList.productDate
          this.factoryid = this.plantList.factoryid
          this.FWproductDate = this.plantList.productDate.replace(/-/g, '')
        } else {
          this.$message.error(data.msg)
        }
        this.lodingStatus = false
      })
    },
    // 查询
    GetOrderList (st) {
      if (this.plantList.factoryid === '') {
        this.$message.error('请选择工厂')
        return
      }
      if (this.plantList.workshopid === '') {
        this.$message.error('请选择车间')
        return
      }
      if (this.plantList.productDate == null) {
        this.$message.error('请选择生产时间')
        return
      }
      this.lodingStatus = true
      if (this.plantList.status === 'normal') { // 正常生产
        if (this.plantList.workshopid === 'DA8DB9D19B4043B8A600B52D9FEF93E3') {
          this.pwshow = true
        } else {
          this.pwshow = false
        }
        let gFWworkShopName = this.workshop.find(item => item.deptId === this.plantList.workshopid)['deptName']
        if (gFWworkShopName) {
          this.FWworkShopName = gFWworkShopName
        }
        let gFWfactoryName = this.factory.find(item => item.deptId === this.plantList.factoryid)['deptName']
        if (gFWfactoryName) {
          this.FWfactoryName = gFWfactoryName
        }
        this.GetorderList()
      } else if (this.plantList.status === 'abnormal') {
        // 无生产
        this.addRowStatus = 0
        this.isdisabled = true
        this.$http(`${WHT_API.CINDEXLISTUSER}`, 'POST', {deptId: this.plantList.workshopid, productDate: this.plantList.productDate}).then(res => {
          if (res.data.code === 0) {
            if (this.plantList.currPage === 1) {
              this.totalList = res.data.infoUser
              this.datalist = res.data.infoUser.slice(0, this.plantList.pageSize)
            }
            // this.datalist = res.data.infoUser
            this.plantList.totalCount = res.data.infoUser.length
          } else {
            this.$message.error(res.data.msg)
          }
          this.lodingStatus = false
        })
      } else {
        this.$message.error('请选择生产状态')
        return
      }
      this.type = this.plantList.status
    },
    // 订单号下拉
    orderchange (row) {
      if (row.orderNo && row.orderNo !== row.orderNo2) {
        this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
          workShop: this.workShop,
          productDate: this.productDate.replace(/-/g, ''),
          orderNo: row.orderNo
        }).then(({data}) => {
          if (data.code === 0) {
            row.orderNo2 = row.orderNo
            row.materialCode = data.list[0].materialCode
            row.materialName = data.list[0].materialName
            row.planOutput = data.list[0].planOutput
            row.orderStatus = data.list[0].orderStatus
            row.outputUnit = data.list[0].outputUnit
            row.properties = data.list[0].properties
            row.realOutput = data.list[0].realOutput
            row.plan = data.list[0].plan
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    isdisabledFn () {
      this.isdisabled = false
    },
    disabledFn () {
      this.isdisabled = true
    },
    // 新增人员
    AddPeople () {
      if (this.plantList.workshopid === '') {
        this.$message.error('请选择车间')
        return
      }
      // if (this.addRowStatus === 0) {
      //   this.datalist = []
      // }
      // this.addRowStatus = 1
      this.isdisabled = false
      this.datalist.push({
        dinner: '60'
      })
    },
    // 人员删除
    delUser (row) {
      if (typeof row.orderId !== 'undefined') {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${WHT_API.CINDEXDELUSER}`, 'POST', {orderId: row.orderId}).then(({data}) => {
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
        this.datalist.splice(this.datalist.indexOf(row), 1)
      }
    },
    // 选择人员 正式 借调
    selectUser (row) {
      this.row = row
      if (row.userType === '借调') {
        this.$nextTick(() => {
          this.$refs.loanedPersonnel.init(row.userId)
        })
      } else if (row.userType === '正式') {
        if (row.deptId) {
          this.$nextTick(() => {
            this.$refs.officialWorker.init(row.deptId, row.userId)
          })
        } else {
          this.$message.error('请选择工序')
        }
      } else if (row.userType === '临时工') {
        this.$nextTick(() => {
          this.$refs.temporaryWorker.init(row)
        })
      } else {
        this.$message.error('请选择人员属性')
      }
    },
    // 员工确认
    changeUser (userId) {
      this.row.userId = userId
      // this.row = JSON.parse(JSON.stringify(this.row))
      // this.datalist = JSON.parse(JSON.stringify(this.datalist))
      this.$set(this.row, userId, this.row.userId)
    },
    changeProcType (row) {
      row.userId = []
    },
    save () {
      if (this.isdisabled === false) {
        this.$confirm('确认保存，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.datalist.map((item) => {
            if (item.classType === undefined || item.deptId === undefined || item.userType === undefined || item.userId === undefined || item.startDate === undefined || item.endDate === undefined || item.dinner === undefined) {
              this.$message.error('除备注外其他选项必填')
              this.abnorsave = false
              return false
            } else {
              this.abnorsave = true
            }
            if (item.orderId === undefined) {
              this.$set(item, 'orderId', '')
            }
            this.$set(item, 'productDate', this.plantList.productDate)
            if ((typeof item.dinner) === 'number') {
              item.dinner = JSON.stringify(item.dinner)
            }
          })
          if (this.abnorsave === true) {
            this.lodingStatus = true
            this.$http(`${WHT_API.CINDEXUPDATEUSER}`, 'POST', this.datalist).then(({data}) => {
              if (data.code === 0) {
                // this.$message.success('操作成功')
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.GetOrderList(true)
              } else {
                this.$message.error(data.msg)
              }
              this.lodingStatus = false
            })
          }
        })
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetOrderList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      // 0,10   10,20    20,30
      this.datalist = this.totalList.slice((val - 1) * this.plantList.pageSize, (val - 1) * this.plantList.pageSize + this.plantList.pageSize)
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
    mainTabsActiveName: {
      get () {
        return this.$store.state.common.mainTabsActiveName
      },
      set (val) {
        this.$store.commit('common/updateMainTabsActiveName', val)
      }
    },
    FWfactoryid: {
      get () { return this.$store.state.common.FWfactoryid },
      set (val) { this.$store.commit('common/updateFWFactoryid', val) }
    },
    FWworkShop: {
      get () { return this.$store.state.common.FWworkShop },
      set (val) { this.$store.commit('common/updateFWWorkShop', val) }
    },
    FWproductDate: {
      get () { return this.$store.state.common.FWproductDate },
      set (val) { this.$store.commit('common/updateFWProductDate', val) }
    },
    FWorderNo: {
      get () { return this.$store.state.common.FWorderNo },
      set (val) { this.$store.commit('common/updateFWOrderNo', val) }
    },
    PkgproductDate: {
      get () { return this.$store.state.common.PkgproductDate },
      set (val) { this.$store.commit('common/updateProductDate', val) }
    },
    FWfactoryName: {
      get () { return this.$store.state.common.FWfactoryName },
      set (val) { this.$store.commit('common/updateFWfactoryName', val) }
    },
    FWworkShopName: {
      get () { return this.$store.state.common.FWworkShopName },
      set (val) { this.$store.commit('common/updateFWWorkShopName', val) }
    },
    FWorderId: {
      get () { return this.$store.state.common.FWorderId },
      set (val) { this.$store.commit('common/updateFWorderId', val) }
    },
    FWproductLine: {
      get () { return this.$store.state.common.FWproductLine },
      set (val) { this.$store.commit('common/updateFWproductLine', val) }
    },
    FWproductLineName: {
      get () { return this.$store.state.common.FWproductLineName },
      set (val) { this.$store.commit('common/updateFWproductLineName', val) }
    },
    PWorder: {
      get () { return this.$store.state.common.PWorder },
      set (val) { this.$store.commit('common/updatePWorder', val) }
    },
    countMan: function () {
      let num = 0
      if (this.datalist) {
        this.datalist.forEach((item) => {
          if (item.userId) {
            num += item.userId.length
          }
        })
      }
      return num
    }
  },
  components: {
    TemporaryWorker,
    LoanedPersonnel,
    officialWorker
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_common.scss';
</style>
<style lang="scss" scoped>
  .itemImg{
    position: relative;
    width:100%;
    min-height:181px;
    overflow: hidden;
    cursor: pointer;
    img{
      transition:All 1s ease-in-out;
    }
  }
  .itemImg:hover{
    img{
      transform:scale(1.2);
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
#normal{
  .sole_cont{
    border: #E9E9E9 1px solid;
    .sole_status{
      float: right;color: #565656;font-size: 14px;min-width: 150px; position: absolute; right: 15px;top: 20px;
    }
    .points{width: 5px; height: 5px; border-radius: 50%; display: block; float: left;margin-top: 27px;margin-right: 8px}
    .title_left{border-bottom:#E9E9E9 1px solid; padding:0 15px; font-weight: bold;height: 60px;line-height: 60px;display: block;}
    .el-form-item__content{
      width: 61%;
      border-bottom: #ccc solid 1px;
    }
    .width50b{ width: 49%; margin: 5px 0}
    .normal_bottom{padding: 5px 0}
  }
}
.selectwpx{
  width:120px;
}
</style>
