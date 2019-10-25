<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <div class="main">
      <el-card>
        <el-form :model="plantList" size="small" :inline="true" label-position="left" label-width="55px" ref="" @keyup.enter.native="GetOrderList()" @submit.native.prevent>
          <el-form-item label="工厂：">
            <el-select v-model="plantList.factoryid" placeholder="请选择">
              <el-option label="" value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车间：">
            <el-select v-model="plantList.workShop" placeholder="请选择" @change="setworkShopname">
              <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
            <el-date-picker type="date" placeholder="选择" v-model="plantList.productDate" value-format="yyyyMMdd"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetOrderList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, index) in list" :key="index" style="margin-bottom: 10px">
            <el-card class="box-card">
            <el-form :model="item" size="small" label-position="right" label-width="85px">
              <div class="clearfix pro-line">
                <el-form-item label="产线：">
                  <p>
                    {{item.productLineName}}
                    <el-button @click="goPro(item)" type="primary" size="small" style="float: right" v-if="isAuth('pkg:order:list')">数据录入</el-button>
                    <span style="float: right;color: #8a979e;font-size: 14px;min-width: 150px">订单状态：<i :style="{'color': item.orderStatus === 'noPass'? 'red': item.orderStatus === 'checked'? '#67C23A' : ''}">{{item.orderStatus === 'submit'? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass'?  '审核不通过' : item.orderStatus === 'saved'? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus}}</i></span>
                  </p>
                </el-form-item>
              </div>
              <div class="clearfix item">
                <img :src="'data:image/gif;base64,' + item.img" alt="">
                <div class="itemForm">
                    <el-form-item label="订单号：" style="margin-bottom: 10px;">
                      <el-select v-model="item.orderNo" placeholder="请选择" :change="orderchange(item)">
                        <el-option label=""  value=""></el-option>
                        <el-option :label="item" v-for="(item, index) in item.order_arr" :key="index" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="品项：" style="margin-bottom: 10px;">
                      <p class="hiddenP">{{item.materialCode + ' ' + item.materialName}}</p>
                    </el-form-item>
                    <el-form-item label="计划产量：" style="margin-bottom: 10px;">
                      <p>{{item.planOutput + ' ' + item.outputUnit}}</p>
                    </el-form-item>
                    <el-form-item label="实时产量：" style="margin-bottom: 10px;">
                      <p>{{item.realOutput? item.realOutput + item.outputUnit: '0' + ' ' + item.outputUnit}}</p>
                    </el-form-item>
                </div>
              </div>
               </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-col>
</template>

<script>
import {BASICDATA_API, PACKAGING_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      factory: [],
      workshop: [],
      plantList: {
        factoryid: '',
        workShop: '',
        orderNo: '',
        productDate: ''
      },
      list: [],
      workShop: '',
      productDate: '',
      factoryid: '',
      workShopname: ''
    }
  },
  watch: {
    'plantList.factoryid' (n, o) {
      this.Getdeptbyid(n)
    }
  },
  mounted () {
    if (this.PkgproductDate === '') {
      this.plantList.productDate = new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + ((new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1) >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : ('0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()))
    } else {
      this.plantList.productDate = this.PkgproductDate
    }
    this.plantList.factoryid = this.Pkgfactoryid
    this.Getdeptcode()
    let that = this
    setTimeout(function () {
      if (that.plantList.workShop) {
        that.GetOrderList()
      }
    }, 1000)
  },
  methods: {
    // 获取工厂,ceshi
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          if (!this.plantList.factoryid) {
            this.plantList.factoryid = data.typeList[0].deptId
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id, typ) {
      this.plantList.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '包装 组装'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (this.PkgworkShop === '' && this.plantList.workShop === '') {
              this.plantList.workShop = data.typeList[0].deptId
            } else {
              this.plantList.workShop = this.PkgworkShop
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取列表
    GetOrderList () {
      if (this.plantList.workShop) {
        this.$http(`${PACKAGING_API.PKGORDELIST_API}`, 'POST', {
          factory: this.plantList.factoryid,
          workShop: this.plantList.workShop,
          productDate: this.plantList.productDate,
          orderNo: ''
        }).then(({data}) => {
          if (data.code === 0) {
            this.Pkgfactoryid = this.plantList.factoryid
            this.PkgworkShop = this.plantList.workShop
            this.PkgproductDate = this.plantList.productDate
            this.list = this.orderList(data.list)
            this.workShop = this.plantList.workShop
            this.productDate = this.plantList.productDate
            this.factoryid = this.plantList.factoryid
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$message.error('请选择车间')
      }
    },
    // 订单号下拉
    orderchange (row) {
      if (row.orderNo && row.orderNo !== row.orderNo2) {
        this.$http(`${PACKAGING_API.PKGORDELIST_API}`, 'POST', {
          factory: this.factoryid,
          workShop: this.workShop,
          productDate: this.productDate,
          orderNo: row.orderNo
        }, false, false, false).then(({data}) => {
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
    // 数据处理
    orderList (data) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        let orderNo = [data[i].orderNo]
        for (let j = i + 1; j < data.length; j++) {
          if (data[i].productLine === data[j].productLine) {
            j = ++i
            orderNo.push(data[j].orderNo)
          }
        }
        let orderNos = ''
        if (orderNo.length === 1) {
          orderNos = orderNo[0]
        } else {
          orderNos = ''
        }
        result.push({
          img: data[i].img,
          productLine: data[i].productLine,
          productLineName: data[i].productLineName,
          orderNo: orderNos,
          orderNo2: '',
          order_arr: orderNo,
          realOutput: '',
          materialCode: '',
          materialName: '',
          orderStatus: '',
          planOutput: '',
          outputUnit: '',
          properties: ''
        })
      }
      return result
    },
    setworkShopname (val) {
      this.workShopname = val
    },
    // 数据录入
    goPro (item) {
      if (item.orderNo && item.properties) {
        this.PkgorderNo = item.orderNo
        this.PkgproductDate = this.productDate
        this.PkgworkShop = this.workShop
        this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Packaging-ProDataIn')
        let that = this
        setTimeout(function () {
          that.$router.push({ name: `DataEntry-Packaging-ProDataIn` })
        }, 100)
      } else {
        this.$message.error('请选择订单号')
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
    },
    mainTabsActiveName: {
      get () {
        return this.$store.state.common.mainTabsActiveName
      },
      set (val) {
        this.$store.commit('common/updateMainTabsActiveName', val)
      }
    },
    Pkgfactoryid: {
      get () { return this.$store.state.common.Pkgfactoryid },
      set (val) { this.$store.commit('common/updateFactoryid', val) }
    },
    PkgworkShop: {
      get () { return this.$store.state.common.PkgworkShop },
      set (val) { this.$store.commit('common/updateWorkShop', val) }
    },
    PkgproductDate: {
      get () { return this.$store.state.common.PkgproductDate },
      set (val) { this.$store.commit('common/updateProductDate', val) }
    },
    PkgorderNo: {
      get () { return this.$store.state.common.PkgorderNo },
      set (val) { this.$store.commit('common/updateOrderNo', val) }
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.hiddenP{
  max-height: 64px;
  overflow: hidden;
  margin-top: 0!important;
}
.box-card{
  .pro-line { border-bottom: 1px solid #dcdfe6; }
  .pro-line p { color: red; font-size: 16px; letter-spacing: .1em; }
  .pro-line .el-form-item__label { }
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
  }
}
</style>
