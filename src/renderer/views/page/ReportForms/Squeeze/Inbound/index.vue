<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex" style="border-bottom:1px solid #E9E9E9;margin-bottom:12px">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px">
                <el-form-item label="生产工厂：">
                  <el-select v-model="params.factoryId" class="selectwpx" style="width:140px" @change="changeOptions('factory')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                  <el-select v-model="params.workshopId" class="selectwpx" style="width:140px" @change="changeOptions('workshop')">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="原汁罐：">
                  <el-select v-model="params.potNo" class="selectwpx" style="width:140px" @change="changeOptions('pot')" filterable>
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in potList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <el-date-picker type="date" v-model="params.startDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                  - <el-date-picker type="date" v-model="params.endDate" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
                </el-form-item>
                <el-form-item >
                  <template>
                    <el-radio v-model="params.mixType" label="正常" style='margin-right:10px;'>正常罐</el-radio>
                    <el-radio v-model="params.mixType" label="混合">混合罐</el-radio>
                  </template>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width:340px">
              <el-row class="rowButton">
                <el-button type="primary" size="small" @click="exportExcel()" style="float:right" v-if='isExcelAuth()'>导出</el-button>
                <el-button type="primary" size="small" @click="getCompleteData()" style="float:right" v-if='isQueryAuth()'>查询</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-row v-show="searched" style="margin-top:20px;">
          <div style="min-height:320px">
            <el-table border  header-row-class-name="tableHead" :data="dataList">
              <el-table-column label="工厂"  width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.factoryName}}
                </template>
              </el-table-column>
              <el-table-column label="车间"  :show-overflow-tooltip="true" width="130">
                <template slot-scope="scope">
                  {{scope.row.workShopName}}
                </template>
              </el-table-column>
              <el-table-column label="生产日期"  width="100" >
                <template slot-scope="scope">
                  {{scope.row.productDate}}
                </template>
              </el-table-column>
              <el-table-column label="原汁罐"  width="100"  :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.potName}}
                </template>
              </el-table-column>
              <el-table-column label="原汁批次"  width="120">
                <template slot-scope="scope">
                  {{scope.row.batch}}
                </template>
              </el-table-column>
              <el-table-column label="入罐数量"  width="100">
                <template slot-scope="scope">
                  {{scope.row.inAmount}}
                </template>
              </el-table-column>
              <el-table-column label="满罐数量" width="100">
                <template slot-scope="scope">
                  {{scope.row.fullPotAmount}}
                </template>
              </el-table-column>
              <el-table-column label="满罐日期"  width="100">
                <template slot-scope="scope">
                  {{scope.row.fulPotDate}}
                </template>
              </el-table-column>
              <el-table-column label="是否混合罐"  width="100">
                <template slot-scope="scope">
                  {{scope.row.mixType === '混合'? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column label="发酵罐号"  width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.childPotName}}
                </template>
              </el-table-column>
              <el-table-column label="当日用量"  width="100">
                <template slot-scope="scope">
                  {{scope.row.childUsedAmount}}
                </template>
              </el-table-column>
              <el-table-column label="发酵罐剩余量"  width="120">
                <template slot-scope="scope">
                  {{scope.row.remainAmount}}
                </template>
              </el-table-column>
            </el-table>
            <el-row style="font-size:14px;line-height:30px;margin-top:10px">
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
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {BASICDATA_API, REP_API} from '@/api/api'
import {exportFile, dateFormat} from '@/net/validate'
import {Vue, Component, Watch} from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class Index extends Vue {
  params = {
    factoryId: '',
    factoryName: '',
    workshopId: '',
    workshopName: '',
    potNo: '',
    potName: '',
    mixType: '正常',
    startDate: dateFormat(new Date(), 'yyyy-MM-dd'),
    endDate: dateFormat(new Date(), 'yyyy-MM-dd')
  }
  factoryList = []
  workshopList = []
  potList = []
  dataList = []
  searched: boolean = false
  currPage: number = 1
  pageSize: number = 10
  totalCount: number = 0
  plantList = {}
  mounted () {
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
    this.getPot(this.params.workshopName)
  }
  // button 权限
  isQueryAuth () {
    return true
  }
  isExcelAuth () {
    return true
  }
  // 切换表头选项
  changeOptions (flag: string) {
    if (flag === 'factory') {
      let item = this.factoryList.find(ele => ele.deptId === this.params.factoryId)
      this.params.factoryName = item ? item.deptName : ''
    } else if (flag === 'workshop') {
      let item = this.workshopList.find(ele => ele.deptId === this.params.workshopId)
      this.params.workshopName = item ? item.deptName : ''
      this.params.potNo = ''
      this.params.potName = ''
      this.getPot(this.params.workshopName)
    } else if (flag === 'pot') {
      let item = this.potList.find(ele => ele.holderId === this.params.potNo)
      this.params.potName = item ? item.holderName : ''
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
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '压榨'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  // 原汁罐
  getPot (wName: string) {
    let params = {
      type: 'holder_type',
      holder_type: '013',
      pageSize: 9999,
      workShopName: wName,
      currPage: 1
    }
    this.potList = []
    if (wName) {
      Vue.prototype.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.potList = res.data.page.list
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  exportExcel () {
    this.plantList = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId,
      potNo: this.params.potNo,
      mixType: this.params.mixType,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate
    }
    let that = this
    exportFile(`${REP_API.INSTOCK_MATERIAL_EXPECT_API}`, '压榨入库报表', that)
  }
  getCompleteData () {
    this.searched = true
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId,
      potNo: this.params.potNo,
      mixType: this.params.mixType,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    this.getDataList(params)
  }
  getDataList (params) {
    this.dataList = []
    Vue.prototype.$http(`${REP_API.INSTOCK_MATERIAL_LIST_API}`, 'POST', params).then(res => {
      if (res.data.code === 0) {
        this.dataList = res.data.page.list
        this.totalCount = res.data.page.totalCount
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      console.log('catch data::', err)
    })
  }
  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId,
      potNo: this.params.potNo,
      mixType: this.params.mixType,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    this.getDataList(params)
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
    let params = {
      factory: this.params.factoryId,
      workshop: this.params.workshopId,
      potNo: this.params.potNo,
      mixType: this.params.mixType,
      commitDateOne: this.params.startDate,
      commitDateTwo: this.params.endDate,
      currPage: this.currPage + '',
      pageSize: this.pageSize + ''
    }
    this.getDataList(params)
  }
  @Watch('params', {deep: true})
  onChangeValue (newVal: string, oldVal: string) {
    this.searched = false
    this.currPage = 1
    this.pageSize = 10
    this.totalCount = 0
  }
  @Watch('params.factoryId')
  onChangeFactory (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.getWorkshop(newVal)
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
        .box-item-title-state-nopass{
          flex:1;
          font-size:14px;
          font-weight:500;
          color:red;
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
            background:red
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
