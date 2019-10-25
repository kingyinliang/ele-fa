<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="newCard">
          <el-row type="flex" style="border-bottom:1px solid #E9E9E9;margin-bottom:12px">
            <el-col>
              <el-form :model="params" size="small" :inline="true" label-position="right" label-width="42px">
                <el-form-item label="工厂：">
                  <el-select v-model="params.factoryId" class="selectwpx" style="width:140px">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车间：">
                  <el-select v-model="params.workShop" class="selectwpx" style="width:140px">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="width:340px">
              <el-button type="primary" size="small" @click="getOrderList()" style="float:right">查询</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-row :gutter="32">
          <el-col :span="8" v-for="(item, index) in orderList" :key="index" style="margin-top: 20px">
            <div class="box-item">
              <div class="box-item-top">
                <div class="box-item-title">
                  <div class="box-item-title-name"><div :style="{'background': index%3 === 0 ? '#FFBF00' : (index%3) === 1 ? '#5BD171': '#2C92F6'}">{{item.houseNo}}</div><div>{{item.inPotNoName}}</div></div>
                  <div class="box-item-title-state">状态：{{item.guardStatus === 'noPass'? '审核不通过':item.guardStatus === 'saved'? '已保存':item.guardStatus === 'submit' ? '已提交' : item.guardStatus === 'checked'? '通过':item.guardStatus === '已同步' ? '未录入' : item.guardStatus}}</div>
                </div>
                <div class="box-item-container">
                  <div class="box-item-container-left">
                    <div class="box-item-container-img"></div>
                  </div>
                  <div class="box-item-container-right">
                    <div class="box-item-container-item"><div class="name">生产订单</div><div class="detail">{{item.orderNo}}</div></div>
                    <div class="box-item-container-item"><div class="name">生产品项</div><div class="detail">{{item.materialCode + ' ' + item.materialName}}</div></div>
                    <div class="box-item-container-item"><div class="name">入曲时长</div><div class="detail">{{item.inEndTimeLength}} 小时</div></div>
                    <div class="box-item-container-item"><div class="name">入曲时间</div><div class="detail">{{item.inEndTime ? item.inEndTime : ''}}</div></div>
                  </div>
                </div>
              </div>
              <div class="box-item-bottom">
                <div class="box-item-bottom-item" :style="{'color':item.guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', item)">数据录入</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {BASICDATA_API, KJM_API} from '@/api/api'
export default {
  name: 'Out',
  data () {
    return {
      params: {
        factoryId: '',
        workShop: ''
      },
      factoryList: [],
      workshopList: [],
      orderList: []
    }
  },
  watch: {
    'params.factoryId' (n) {
      this.getWorkshop(n)
    }
  },
  mounted () {
    this.getFactory()
  },
  methods: {
    getOrderList () {
      if (this.params.factoryId === '') {
        this.$message.error('请选择工厂')
        return
      }
      if (this.params.workShop === '') {
        this.$message.error('请选择车间')
        return
      }
      this.$http(`${KJM_API.KJMAKINGORDERLIST_API}`, 'POST', this.params).then(({data}) => {
        if (data.code === 0) {
          this.orderList = this.ProcessingData(data.list)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    ProcessingData (data) {
      let newArr = []
      data.forEach((item, index) => {
        if (item.guardStatus === 'saved' || item.guardStatus === '已同步') {
          newArr.push(item)
        }
      })
      newArr.sort(function (a, b) {
        var order = ['saved', '已同步']
        if (order.indexOf(a.guardStatus) - order.indexOf(b.guardStatus) === 0) {
          return b.inEndTimeLength - a.inEndTimeLength
        } else {
          return order.indexOf(a.guardStatus) - order.indexOf(b.guardStatus)
        }
      })
      return newArr
    },
    goPage (page, item) {
      let flag = false
      if (page === '煮豆') {
        flag = this.isAuth('kjm:bean:material:list')
      } else if (page === '看曲') {
        flag = this.isAuth('kjm:guard:list')
      } else if (page === '出曲') {
        flag = this.isAuth('sys:kjmOutMaterial:list')
      }
      if (!flag) {
        this.$message.error('无权限查看' + page)
        return
      }
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
    },
    pushPage (name) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== name)
      let that = this
      setTimeout(function () {
        that.$router.push({name})
      }, 100)
    },
    getFactory () {
      this.factoryList = []
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then((res) => {
        if (res.data.code === 0) {
          this.factoryList = res.data.typeList
          if (!this.params.factoryId) {
            this.params.factoryId = res.data.typeList[0].deptId
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 根据工厂获车间
    getWorkshop (id) {
      this.workshopList = []
      this.params.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '制曲'}, false, false, false).then(res => {
          if (res.data.code === 0) {
            this.workshopList = res.data.typeList
            if (!this.params.workShop) {
              this.params.workShop = res.data.typeList[0].deptId
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
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
  components: {
  }
}
</script>

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
