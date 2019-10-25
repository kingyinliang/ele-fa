<template>
  <div style="padding: 5px 10px">
    <el-card class="searchCard  newCard" style="margin-bottom: 5px">
      <el-form :inline="true" size="small" :model="formHeader" label-width="75px" class="topform marbottom">
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
        <el-button type="primary" size="small" @click="GetDataList(true)" style="float: right" v-if="isAuth('fer:holderManage:list')">查询</el-button>
      </el-form>
    </el-card>
    <el-card class="searchCard  newCard" style="min-height: 420px">
      <el-row class="dataList" :gutter="10" style="min-height: 150px">
        <el-col :span="12" v-for="(item, index) in dataList" :key="index">
          <el-card class="dataList_item">
            <h3 class="dataList_item_tit">
              {{item.holderName}}
              <span class="dataList_item_tit_right"><i class="dataList_item_tit_dian" :style="{'color': item.selectOrder.orderStatus === 'noPass'? 'red': item.selectOrder.orderStatus === 'checked'? '#67C23A' : ''}" v-if="item.selectOrder.orderStatus"></i>{{item.selectOrder.orderStatus === 'submit'? '已提交' : item.selectOrder.orderStatus === 'checked' ? '审核通过' : item.selectOrder.orderStatus === 'noPass'?  '审核不通过' : item.selectOrder.orderStatus === 'saved'? '已保存' : item.selectOrder.orderStatus === '已同步' ? '未录入' : item.selectOrder.orderStatus}}</span>
            </h3>
            <div class="dataList_item_body">
              <div class="dataList_item_body_ptobox">
                <div class="dataList_item_body_ptobox_pto"><div class="dataList_item_body_ptobox_pto_bg"></div></div>
              </div>
              <div class="dataList_item_body_text">
                <el-form :inline="true" size="small">
                  <el-form-item label="订单编号：">
                    <el-select v-model="item.selectOrderId" placeholder="请选择" style="width: 150px" @change="OrderChange($event, item)" value-key="orderId">
                      <el-option :label="item1.orderNo" v-for="(item1, index1) in item.steList" :key="index1" :value="item1.orderId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="生产品项：">
                    <el-tooltip class="item" effect="dark" :content="(item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '')" placement="top">
                      <p class="dataList_item_body_text_tit">{{(item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '')}}</p>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="订单日期：">
                    <p class="dataList_item_body_text_tit">{{item.selectOrder.productDate || ''}}</p>
                  </el-form-item>
                  <el-form-item label="计划产量：">
                    <p class="dataList_item_body_text_tit">{{item.selectOrder.planOutput || ''}}</p>
                  </el-form-item>
                  <img src="@/assets/img/zhang.png" alt="" class="dataList_item_body_text_img" v-if="item.selectOrder.supStatus === '已确认'">
                </el-form>
              </div>
            </div>
            <el-row class="dataList_item_btn">
              <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('1', item.selectOrder)">半成品领用</p></el-col>
              <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('2', item.selectOrder)">辅料添加</p></el-col>
              <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('3', item.selectOrder)">工艺控制</p></el-col>
              <el-col :span="6" class="dataList_item_btn_item"><p @click="toRouter('4', item.selectOrder)">杀菌入库</p></el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {getFactory, getWorkshop} from '@/net/validate'
import {STERILIZED_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      formHeader: {
        holderType: '014',
        factory: '',
        workShop: '',
        productDate: ''
      },
      factory: [],
      workshop: [],
      Materails: [],
      dataList: []
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.formHeader.workShop = ''
      getWorkshop(this, n, '杀菌')
    }
  },
  mounted () {
    getFactory(this)
  },
  methods: {
    GetDataList () {
      this.$http(`${STERILIZED_API.STE_HOME_LIST_API}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.GetMaterails(this.formHeader.factory)
          this.dataList = data.list
          this.dataList.forEach((item, index) => {
            if (item.steList.length > 0) {
              // item.selectOrder = item.steList[0]
              item.selectOrder = {}
              // item.selectOrderId = item.steList[0].orderId
            } else {
              item.selectOrder = {}
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    OrderChange (e, row) {
      row.selectOrder = row.steList.filter(item => e === item.orderId)[0]
    },
    // 物料字典
    GetMaterails (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'TeShuShaJun_Material'}).then(({data}) => {
        if (data.code === 0) {
          this.Materails = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    toRouter (str, item) {
      let url
      if (!item.orderId) {
        this.$message.error('请选择订单')
        return
      }
      if (str === '1') {
        let st = this.Materails.filter(items => items.code === item.materialCode)
        if (st.length === 0) {
          this.$message.error('不能跳转哦')
          return
        }
        this.$store.state.common.sterilized.seiOrderId = item.orderId
        this.$store.state.common.sterilized.seiFactory = item.factory
        this.$store.state.common.sterilized.seiOrderNo = item.orderNo
        url = 'DataEntry-Sterilized-SterilizedIndex-semiReceive-index'
      } else if (str === '2') {
        this.$store.state.common.sterilized.acceOrderId = item.orderId
        this.$store.state.common.sterilized.acceFactory = item.factory
        this.$store.state.common.sterilized.acceOrderNo = item.orderNo
        url = 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index'
      } else if (str === '3') {
        this.$store.state.common.sterilized.craftOrderId = item.orderId
        url = 'DataEntry-Sterilized-SterilizedIndex-craftControl-index'
      } else if (str === '4') {
        this.$store.state.common.sterilized.inOrderId = item.orderId
        this.$store.state.common.sterilized.inFactory = item.factory
        this.$store.state.common.sterilized.inOrderNo = item.orderNo
        url = 'DataEntry-Sterilized-SterilizedIndex-inStock-index'
      }
      this.mainTabs = this.mainTabs.filter(item => item.name !== url)
      setTimeout(() => {
        this.$router.push({ name: url })
      }, 100)
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
  .dataList {
    margin-top: 10px;
    &_item {
      margin-bottom: 10px;
      &_tit {
        font-weight: normal;
        color: black;
        font-size: 16px;
        padding: 0 10px;
        line-height: 45px;
        border-bottom: 1px solid #E8E8E8;
        &_right{
          float: right;
          font-size: 14px;
          position: relative;
          padding-left: 8px;
        }
        &_dian{
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          background: #1890FF;
          left: 0;
          top: 19px;
        }
      }
      &_body{
        padding-top: 10px;
        display: flex;
        justify-content: center;
        &_ptobox{
          width: 259px;
          height: 301px;
          position: relative;
          background: url('~@/assets/img/sterilized.png') no-repeat;
          background-size:contain;
          &_pto{
            width: 111px;
            border-bottom-right-radius: 53px 21px;
            border-bottom-left-radius: 53px 21px;
            height: 135px;
            position: absolute;
            top: 42px;
            left: 74px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-end;
            overflow: hidden;
            &_bg{
              flex: 1;
              height: 70px;
              align-items: center;
              overflow: hidden;
              position: relative;
              background: linear-gradient(#35C3FF,#1890FF);
              &::before,&::after{
                content: "";
                position: absolute;
                left: 50%;
                min-width: 165px;
                min-height: 160px;
                background: #fff;
                animation: roateTwo 10s linear infinite;
              }

              &::before {
                top: -148px;
                border-radius: 45%;
              }
              &::after {
                top: -142px;
                opacity: 0.5;
                border-radius: 47%;
              }
            }
          }
          &:hover &_pto_bg::before,&:hover &_pto_bg::after{
            animation: roateOne 10s linear infinite;
          }
        }
        &_text{
          width: 220px;
          padding-top: 32px;
          position: relative;
          .el-form-item{
            margin-bottom: 4px!important;
            margin-right: 0px!important;
          }
          &_tit{
            width: 150px;
            min-height: 32px;
            border-bottom: 1px solid #D8D8D8;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          &_img{
            position: absolute;
            top: 150px;
            left: 113px;
            width: 100px;
            height: 100px;
            transform: rotateZ(-50deg);
          }
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
