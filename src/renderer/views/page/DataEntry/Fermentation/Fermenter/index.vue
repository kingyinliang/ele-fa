<template>
<div style="padding: 5px 10px">
  <el-card class="searchCard  newCard ferCard">
    <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform marbottom">
      <el-form-item label="生产工厂：">
        <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 160px">
          <el-option label="请选择"  value=""></el-option>
          <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产车间：">
        <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 160px">
          <el-option label="请选择"  value=""></el-option>
          <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" @click="GetDataList(true)" style="float: right" v-if="isAuth('fer:holderManage:list')">查询</el-button>
    </el-form>
  </el-card>
  <el-card class="searchCard  newCard ferCard" style="margin-top: 5px" v-show="fastS">
    <h3 class="cardTit"><i class="iconfont factory-shujuzonglan" style="color: #666666;margin-right: 10px"></i>发酵情况总览 <i class="gotop" @click="gotop"><span>收起</span><i class="el-icon-caret-top"></i></i></h3>
    <div class="sumbox">
    <div class="topBox clearfix">
      <div class="clearfix" v-for="(item, index) in topBox" :key="index" style="float: left">
        <div class="topBox_boxItem" @click="topClick(item)">
          <div class="topBox_boxItem_bar">
            <div class="topBox_boxItem_bar_box" :style="{'background': `linear-gradient(to right,${item.startColor} 0%,${item.startColor} 10%,${item.endColor})`}"></div>
          </div>
          <p class="topBox_boxItem_tit">{{item.ptext}}</p>
          <p class="topBox_boxItem_detail">
            总计: <span>{{item.num}}</span> 罐
          </p>
          <div class="topBox_boxItem_popover" v-if="index === 2 || index === 3">
            <p class=""><i class="dot" style="background: #1890FF"></i>味达美<span style="float: right">{{item.wdm}} 罐</span></p>
            <p class=""><i class="dot" style="background: #FFBF00"></i>六月鲜<span style="float: right">{{item.lyx}} 罐</span></p>
            <i class="topBox_boxItem_popover_ar"></i>
          </div>
        </div>
        <div class="topBox_circle" :style="{'background': item.color}" v-if="item.color">{{item.text}}</div>
      </div>
    </div>
    </div>
  </el-card>
  <el-card class="searchCard  newCard ferCard" style="margin-top: 5px"  v-show="fastS">
    <h3 style="color: black;margin-bottom: 8px"><i class="iconfont factory-liebiao" style="color: #666666;margin-right: 10px"></i>发酵罐列表</h3>
    <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform marbottom">
      <el-form-item label="罐号：">
        <el-select v-model="formHeader.holderNo" placeholder="请选择" multiple filterable allow-create default-first-op style="width: 160px">
          <el-option v-for="(sole, index) in this.guanList" :key="index" :value="sole.holderNo" :label="sole.holderName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别：">
        <el-select v-model="formHeader.halfType" placeholder="请选择" style="width: 160px">
          <el-option label="请选择"  value=""></el-option>
          <el-option :label="item.value" v-for="(item, index) in halfList" :key="index" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="formHeader.holderStatus" placeholder="请选择" style="width: 160px">
          <el-option label="请选择"  value=""></el-option>
          <el-option :label="item.value" v-for="(item, index) in holderStatusList" :key="index" :value="item.code" v-if="item.code !== '2' && item.code !== '3'"></el-option>
          <el-option label="发酵中" v-for="(item, index) in holderStatusList" :key="index" value="2,3" v-if="item.code === '2'"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" @click="GetDataList(true)" style="float: right" v-if="isAuth('fer:holderManage:list')">查询</el-button>
    </el-form>
    <el-row class="dataList" :gutter="10" style="min-height: 150px">
      <el-col :span="6" v-for="(item, index) in dataList" :key="index">
        <el-card class="dataList_item">
          <h3 class="dataList_item_tit">
            {{item.holderName}}
            <span style="color: #333333;font-weight: normal;font-size: 14px">
              -{{item.holderStatus === '0' ? '空罐' : item.holderStatus === '1' ? '投料中' : item.holderStatus === '2' ? '发酵中' : item.holderStatus === '3' ? '发酵中' : item.holderStatus === '4' ? '领用中' : item.holderStatus === '5' ? '待清洗' : ''}}
            </span>
            <span class="dataList_item_a" @click="godetails(item)" style="font-size: 14px" v-if="isAuth('fer:holderManage:detail')">详情>></span>
          </h3>
          <div class="dataList_item_pot clearfix">
            <div class="dataList_item_pot_box">
              <div class="dataList_item_pot_box1">
                <div class="dataList_item_pot_box_item1" :style="`height:${item.reWorkAmount? (item.reWorkAmount / item.holderAmout) * 100 : 0}%`" v-if="item.holderStatus !== '4'"><p>{{(item.reWorkAmount / 1000).toFixed(2)}}方</p></div>
                <div class="dataList_item_pot_box_item2" v-if="item.holderAmout" :class="`${item.holderStatus === '4'? 'dataList_item_pot_box_item2s' : item.reWorkAmount? 'dataList_item_pot_box_item2' : 'dataList_item_pot_box_item2s'}`" :style="`height:${item.holderStatus === '4'? (item.useRemainAmount / item.holderAmout) * 100 : item.holderStatus === '3'? (item.inStoreAmount / item.holderAmout) * 100 : item.halfAmount? (item.halfAmount / item.holderAmout) * 100:(item.ferAmount / item.holderAmout) * 100}%`"><p>{{((item.holderStatus === '4'? item.useRemainAmount:item.holderStatus === '3'? item.inStoreAmount:item.halfAmount?item.halfAmount:item.ferAmount) / 1000).toFixed(2)}}方</p></div>
              </div>
            </div>
            <div class="dataList_item_pot_detail" v-if="item.sumAmout">
              <p>{{item.ferOrderNo}}</p>
              <p>{{item.halfTypeName? item.halfTypeName : item.ferMaterialName}}</p>
              <p>{{item.ferDays}}天</p>
              <p>{{(item.sumAmout / 1000).toFixed(2)}}方</p>
              <p v-if="item.holderStatus === '3'">已入库</p>
            </div>
          </div>
          <el-row class="dataList_item_btn">
            <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('1', item)">发料</p></el-col>
            <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('2', item)">类别判定</p></el-col>
            <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('3', item)">入库</p></el-col>
            <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('4', item)">清洗</p></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formHeader.currPage"
        :page-sizes="[40, 60, 80]"
        :page-size="formHeader.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="formHeader.totalCount">
      </el-pagination>
    </el-row>
  </el-card>
  <el-dialog
    width="450px"
    class="ShinHoDialog"
    :title="dialogData.holderName+'清洗'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div style="display: flex">
      <el-form label-width="100px" class="topform marbottom" style="margin: auto">
        <el-form-item label="罐号：">
          <p>{{dialogData.holderNo}}</p>
        </el-form-item>
        <el-form-item label="状态：">
          <p>待清洗</p>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="a">
            <el-checkbox label="清洗完成" name="type" :disabled="true"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="dialogData.remark" size="small" placeholder="手工录入" style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="录入人员：">
          {{$store.state.user.realName + '（' + this.$store.state.user.name + '）'}}
        </el-form-item>
        <el-form-item label="录入时间：">
          {{newData}}
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="rinse()">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { dateFormat } from '@/net/validate'
import {BASICDATA_API, FERMENTATION_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      newData: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      fastS: false,
      visible: false,
      dialogData: {},
      a: true,
      topBox: [
        {
          color: '#999999',
          startColor: '#999999',
          endColor: '#999999',
          text: '空',
          ptext: '空罐',
          holderStatus: '0',
          num: ''
        }, {
          color: '#D6D2C4',
          startColor: '#E9E9E9',
          endColor: '#D6D2C4',
          text: '1',
          ptext: '酿造 0-1个月',
          search: '1',
          num: ''
        }, {
          color: '#B58150',
          startColor: '#D6D2C4',
          endColor: '#B58150',
          text: '3',
          ptext: '酿造 1-3个月',
          search: '2',
          num: ''
        }, {
          color: '#3F2021',
          startColor: '#B58150',
          endColor: '#3F2021',
          text: '6',
          ptext: '酿造 3-6个月',
          search: '3',
          num: ''
        }, {
          color: '#C70909',
          startColor: '#3F2021',
          endColor: '#C70909',
          text: '超',
          ptext: '超时超期',
          search: '4',
          num: ''
        }, {
          color: '#8BC34A',
          startColor: '#C70909',
          endColor: '#8BC34A',
          text: '压',
          ptext: '压榨',
          holderStatus: '4',
          num: ''
        }, {
          color: '',
          startColor: '#999999',
          endColor: '#999999',
          text: '',
          ptext: '空罐',
          holderStatus: '0',
          num: ''
        }
      ],
      formHeader: {
        factory: '',
        workShop: '',
        holderNo: [],
        halfType: '',
        holderStatus: '',
        dateFlag: '',
        currPage: 1,
        pageSize: 40,
        totalCount: 0
      },
      factory: [],
      workshop: [],
      guanList: [],
      halfList: [],
      holderStatusList: [],
      dataList: []
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.formHeader.workShop = ''
      this.formHeader.holderStatus = ''
      this.Getdeptbyid(n)
      this.GetHolderStatusList(n)
    },
    'formHeader.workShop' (n, o) {
      this.formHeader.holderNo = []
      this.formHeader.halfType = ''
      this.GetHalfList(n)
      this.HolderList(n)
    }
  },
  mounted () {
    this.Getdeptcode()
    this.ani()
  },
  methods: {
    ani () {
      let $ = this.$
      this.$('.topBox_boxItem').hover(function () {
        $(this).find('.topBox_boxItem_popover').stop()
        $(this).find('.topBox_boxItem_bar_box').stop()
        $(this).find('.topBox_boxItem_popover').show(500)
        $(this).find('.topBox_boxItem_bar_box').css({width: 0})
        $(this).find('.topBox_boxItem_tit').css({color: '#1890FF'})
        $(this).find('.topBox_boxItem_bar_box').animate({width: '100%'}, 500)
        $(this).parent().find('.topBox_circle').css({transform: 'scale(1.2)'})
        $(this).parent().prev().find('.topBox_circle').css({transform: 'scale(1.2)'})
      }, function () {
        $(this).find('.topBox_boxItem_tit').css({color: 'black'})
        $(this).find('.topBox_boxItem_popover').hide(500)
        $(this).parent().find('.topBox_circle').css({transform: 'scale(1.0)'})
        $(this).parent().prev().find('.topBox_circle').css({transform: 'scale(1.0)'})
      })
    },
    gotop () {
      let $ = this.$
      $('.sumbox').stop()
      let hei = $('.sumbox .topBox').height()
      if ($('.sumbox').height()) {
        $('.sumbox').css({overflow: 'hidden'})
        $('.gotop span').text('展开')
        $('.gotop i').attr('class', 'el-icon-caret-bottom')
        $('.sumbox').animate({height: 0}, 300, function () {})
      } else {
        $('.gotop span').text('收起')
        $('.gotop i').attr('class', 'el-icon-caret-top')
        $('.sumbox').animate({height: `${hei + 35}px`}, 300, function () {
          $('.sumbox').css({overflow: 'initial'})
        })
      }
    },
    // 总览点击
    topClick (item) {
      if (!this.formHeader.factory) {
        this.$message.error('请选择工厂')
        return
      }
      this.formHeader.currPage = 1
      this.formHeader.holderNo = []
      this.formHeader.halfType = ''
      this.formHeader.dateFlag = ''
      this.formHeader.holderStatus = ''
      if (item.search) {
        this.formHeader.dateFlag = item.search
      } else {
        this.formHeader.holderStatus = item.holderStatus
      }
      this.GetDataList('top')
    },
    // 查询
    GetDataList (ty) {
      this.fastS = true
      if (ty) {
        this.formHeader.currPage = 1
        if (ty === true) {
          this.formHeader.dateFlag = ''
        }
      }
      let obj = JSON.parse(JSON.stringify(this.formHeader))
      obj.currPage = obj.currPage + ''
      obj.pageSize = obj.pageSize + ''
      obj.totalCount = obj.totalCount + ''
      // if (obj.holdNo.length > 1) {
      //   obj.holdNo.splice(0, 1)
      //   obj.holdNo = obj.holdNo.join(',')
      // } else {
      //   obj.holdNo = obj.holdNo.join(',')
      // }
      obj.holderNo = obj.holderNo.join(',')
      this.$http(`${FERMENTATION_API.FER_LIST_API}`, 'POST', obj).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.orderPage.list
          this.formHeader.currPage = data.orderPage.currPage
          this.formHeader.totalCount = data.orderPage.totalCount
          this.formHeader.pageSize = data.orderPage.pageSize
          this.topBox[0].num = data.overView.emptyCount
          this.topBox[1].num = data.overView.oneMonthCount
          this.topBox[2].num = data.overView.threeMonthCount
          this.topBox[3].num = data.overView.sixMonthCount
          this.topBox[4].num = data.overView.outCount
          this.topBox[5].num = data.overView.useCount
          this.topBox[6].num = data.overView.emptyCount
          this.topBox[2].wdm = data.overView.wdmThreeMonthCount
          this.topBox[2].lyx = data.overView.lyxThreeMonthCount
          this.topBox[3].wdm = data.overView.wdmSixMonthCount
          this.topBox[3].lyx = data.overView.lyxSixMonthCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
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
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '发酵'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length) {
              this.formHeader.workShop = data.typeList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 罐号
    HolderList () {
      this.$http(`${BASICDATA_API.BASEHOLDERLIST_API}`, 'POST', {factory: this.formHeader.factory, workShop: this.formHeader.workShop}, false, false, false).then(({data}) => {
        this.guanList = data.holderList
      })
    },
    // 获取半成品
    GetHalfList (id) {
      if (id) {
        this.$http(`${FERMENTATION_API.FER_HALF_LIST_API}`, 'POST', {factory: this.formHeader.factory, workShop: id}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.halfList = data.halfList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取发酵罐状态
    GetHolderStatusList (id) {
      if (id) {
        this.$http(`${FERMENTATION_API.FER_HOLDER_STATUS_API}`, 'POST', {factory: id}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.holderStatusList = data.statusList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 去详请
    godetails (row) {
      this.$store.state.common.Fermentation.details = row
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Fermentation-Fermenter-details')
      let that = this
      setTimeout(function () {
        that.$router.push({ name: `DataEntry-Fermentation-Fermenter-details` })
      }, 100)
    },
    toRouter (str, row) {
      let url = ''
      if (str === '1') {
        this.$store.state.common.Fermentation.materia.factory = row.factory
        this.$store.state.common.Fermentation.materia.workShop = row.workShop
        this.$store.state.common.Fermentation.materia.ferMaterialCode = ''
        this.$store.state.common.Fermentation.materia.holderIds = [row.holderId]
        this.$store.state.common.Fermentation.materia.ferOrderNos = [row.ferOrderNo]
        this.$store.state.common.Fermentation.materia.approveStatus = ''
        this.$store.state.common.Fermentation.materia.productDateOne = ''
        this.$store.state.common.Fermentation.materia.productDateTwo = ''
        url = 'DataEntry-Fermentation-MaterialManage-index'
      } else if (str === '2') {
        this.$store.state.common.Fermentation.category.factory = row.factory
        this.$store.state.common.Fermentation.category.workShop = row.workShop
        this.$store.state.common.Fermentation.category.holderId = row.holderId
        this.$store.state.common.Fermentation.category.orderNo = row.ferOrderNo
        this.$store.state.common.Fermentation.category.materialCode = row.ferMaterialCode
        this.$store.state.common.Fermentation.category.ferDays = row.ferDays + ''
        this.$store.state.common.Fermentation.category.halfId = row.halfType
        this.$store.state.common.Fermentation.category.currPage = 1
        this.$store.state.common.Fermentation.category.pageSize = 1
        this.$store.state.common.Fermentation.category.totalCount = 10
        this.$store.state.common.Fermentation.category.isJudged = 0
        url = 'DataEntry-Fermentation-CategoryJudgement-index'
      } else if (str === '3') {
        this.$store.state.common.FerInStockManage.factoryId = row.factory
        this.$store.state.common.FerInStockManage.workshopId = row.workShop
        this.$store.state.common.FerInStockManage.startDate = ''
        this.$store.state.common.FerInStockManage.endDate = ''
        this.$store.state.common.FerInStockManage.holderList = [row.holderId]
        this.$store.state.common.FerInStockManage.orderList = [row.ferOrderNo]
        url = 'DataEntry-Fermentation-InStockManage-index'
      } else if (str === '4') {
        url = ''
        if (row.holderStatus === '5') {
          this.dialogData = row
          this.visible = true
        } else {
          this.$message.error('该罐不是未清洗状态')
        }
        return
      }
      this.mainTabs = this.mainTabs.filter(item => item.name !== url)
      let that = this
      setTimeout(function () {
        that.$router.push({ name: url })
      }, 100)
    },
    rinse () {
      this.$http(`${FERMENTATION_API.FER_RINSE_API}`, 'POST', this.dialogData).then(({data}) => {
        if (data.code === 0) {
          this.dialogData.holderStatus = '0'
          this.visible = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.formHeader.pageSize = val
      this.GetDataList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.formHeader.currPage = val
      this.GetDataList()
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
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.ferCard{
  .el-card__body{
    padding: 7px;
  }
  .cardTit{
    font-size: 16px;
    color: black;
    font-weight: 400;
    padding-bottom: 10px;
    border-bottom: 1px solid #E9E9E9;
    .gotop{
      float: right;
      color: #1890FF;
      font-size: 14px;
      cursor: pointer;
      i{
        :before{
          color: #1890FF;
        }
      }
    }
  }
}
.topBox{
  width: 1160px;
  padding: 25px 25px 10px 25px;
  margin: auto;
  &_boxItem{
    position: relative;
    cursor: pointer;
    width: 131px;
    float: left;
    &_bar{
      width: 115px;
      height: 2px;
      margin: 15px 8px 0 8px;
      background: #f2f2f2;
      &_box{
        height: 2px;
      }
    }
    &_tit{
      color: black;
      font-size: 16px;
      margin-top: 10px;
      text-align: center;
      line-height: 32px;
    }
    &_detail{
      font-size: 14px;
      text-align: center;
      color: #666666;
      span{
        color: black;
      }
    }
    &_popover{
      display: none;
      top: -60px;
      min-width: 150px;
      min-height: 52px;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 13px;
      line-height: 18px;
      position: absolute;
      z-index: 999999;
      background: white;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
      .dot{
        width: 6px;
        height: 6px;
        float: left;
        margin: 4px 5px 0 0;
        border-radius: 50%;
      }
      &_ar{
        position: absolute;
        bottom: -12px;
        width: 0;
        height: 0;
        border-width: 6px;
        border-style: solid;
        border-color:#ffffff transparent transparent transparent;
      }
    }
  }
  &_circle{
    width: 32px;
    height: 32px;
    float: left;
    line-height: 32px;
    text-align: center;
    color: white;
    border-radius: 50%;
    background: #999999;
    transition: all .5s;
  }
}
.dataList{
  margin-top: 10px;
  &_item{
    margin-bottom: 10px;
    &_tit{
      font-weight: 600;
      color: black;
      font-size: 16px;
      padding: 0 10px;
      line-height: 45px;
      border-bottom: 1px solid #E8E8E8;
    }
    &_a{
      cursor: pointer;
      color: #1890FF;
      float: right;
    }
    &_pot{
      padding: 17px 10px 10px 10px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow: hidden;
      &_box1{
        overflow: hidden;
        width: 102px;
        height: 197px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-end;
      }
      &_box{
        overflow: hidden;
        padding: 25px 9px 9px 9px;
        color: white;
        float: left;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-end;
        width: 120px;
        height: 229px;
        min-width: 120px;
        background: url('~@/assets/img/ferPot.png') no-repeat;
        background-size:contain;
        &_item1,&_item2{
          width: 100%;
          display:flex;
          align-items:center;
          justify-content: center;
          font-size: 14px;
        }
        &_item2s,&_item1{
          height: 50px;
          background: #69C0FF;
          position: relative;
          overflow: hidden;
          &::before,&::after{
            content: "";
            position: absolute;
            left: 50%;
            min-width: 175px;
            min-height: 165px;
            background: #fff;
            animation: roateTwo 10s linear infinite;
          }
          &::before {
            top: -158px;
            border-radius: 45%;
          }
          &::after {
            top: -152px;
            opacity: 0.5;
            border-radius: 47%;
          }
        }
        &_item2{
          height: 100px;
          background: #1890FF;
        }
        &:hover &_item1::before,&:hover &_item1::after,&:hover &_item2s::before,&:hover &_item2s::after{
          animation: roateOne 10s linear infinite;
        }
      }
      &_detail{
        max-width: 112px;
        height: auto;
        float: left;
        margin-top: 25px;
        margin-left: 10px;
        color: #333333;
        font-size: 14px;
        line-height: 18px;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #1890FF;
      }
    }
  }
}
@keyframes roateOne {
   0% {
     transform: translate(-50%, -0%) rotateZ(0deg);
   }
   50% {
     transform: translate(-50%, -1%) rotateZ(180deg);
   }
   100% {
     transform: translate(-50%, -0%) rotateZ(360deg);
   }
 }
@keyframes roateTwo {
  0% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
  100% {
    transform: translate(-50%, -0%) rotateZ(0deg);
  }
}

</style>
