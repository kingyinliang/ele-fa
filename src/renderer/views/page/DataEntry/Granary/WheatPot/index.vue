<template>
  <div>
    <div class="main" style="padding-bottom: 0">
      <el-card class="newCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="50px">
              <el-form-item label="工厂：" style="margin-bottom: 0px">
                <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px" @change="changeOptions('factory')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：" style="margin-bottom: 0px">
                <el-select v-model="params.workshopId" class="selectwpx" style="width: 140px" @change="changeOptions('workshop')">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 80px">
            <el-button type="primary" size="small" @click="getOrderList()" style="float: right">查询</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="main" style="padding-top: 8px">
      <el-card class="newCard" v-if="searched">
        <el-row :gutter="10" v-for="(item, index) in dataList" :key="index" v-if="index%2===0" style="margin-top:10px;">
          <el-col :span="12" v-if="index < dataList.length">
            <el-card class="Card_item" >
              <div slot="header">小麦罐号：{{dataList[index].holderName}} <span class="Card_item_detail" @click="goDetail(dataList[index].holderId, dataList[index].holderName)">详情>></span></div>
              <div style="display: flex">
                <div class="Card_item_img">
                  <div class="Card_item_img_box">
                    <div class="Card_item_img_box_bg" :style="`height:${Math.min(dataList[index].total/5000,100)}%`"></div>
                  </div>
                  <img src="@/assets/img/granary.png" alt="">
                </div>
                <div class="Card_item_text">
                  <el-card style="margin-top: 25px">
                    <div slot="header">库存明细 <span style="float: right">合计：{{dataList[index].total.toLocaleString() + ' ' + dataList[index].unit}}</span></div>
                    <div style="position: relative" >
                      <el-row  class="Card_item_text_item bgbox" style="padding-top: 0">
                        <el-col :span="12">批次</el-col>
                        <el-col :span="12">数量</el-col>
                      </el-row >
                      <div class="Card_item_text_box_bg1"></div>
                      <div class="Card_item_text_box">
                        <el-row class="Card_item_text_item" v-for="(item1, index1) in dataList[index].stocks" :key="index1">
                          <el-col :span="12">{{item1.batch}}</el-col>
                          <el-col :span="12">{{(item1.currentQuantity ? item1.currentQuantity.toLocaleString() : '') + ' ' + item1.unit}}</el-col>
                        </el-row>
                      </div>
                      <div class="Card_item_text_box_bg2"></div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" v-if="index + 1 < dataList.length">
            <el-card class="Card_item" >
              <div slot="header">小麦罐号：{{dataList[index + 1].holderName}} <span class="Card_item_detail" @click="goDetail(dataList[index + 1].holderId, dataList[index + 1].holderName)">详情>></span></div>
              <div style="display: flex">
                <div class="Card_item_img">
                  <div class="Card_item_img_box">
                    <div class="Card_item_img_box_bg" :style="`height:${Math.min(dataList[index + 1].total/5000, 100)}%`"></div>
                  </div>
                  <img src="@/assets/img/granary.png" alt="">
                </div>
                <div class="Card_item_text">
                  <el-card style="margin-top: 25px">
                    <div slot="header">库存明细 <span style="float: right">合计：{{dataList[index + 1].total.toLocaleString() + ' ' + dataList[index + 1].unit}}</span></div>
                    <div style="position: relative" >
                      <el-row  class="Card_item_text_item bgbox" style="padding-top: 0">
                        <el-col :span="12">批次</el-col>
                        <el-col :span="12">数量</el-col>
                      </el-row >
                      <div class="Card_item_text_box_bg1"></div>
                      <div class="Card_item_text_box">
                        <el-row class="Card_item_text_item" v-for="(item1, index1) in dataList[index + 1].stocks" :key="index1">
                          <el-col :span="12">{{item1.batch}}</el-col>
                          <el-col :span="12">{{(item1.currentQuantity ? item1.currentQuantity.toLocaleString() : '') + ' ' + item1.unit}}</el-col>
                        </el-row>
                      </div>
                      <div class="Card_item_text_box_bg2"></div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import {BASICDATA_API, GRANARY_API} from '@/api/api'
import {Vue, Component, Watch} from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class Index extends Vue {
  // 将common中的参数复制一份到本地
  params = JSON.parse(JSON.stringify(this.$store.state.common.GranaryWheatPot))
  factoryList = []
  workshopList = []
  dataList = []
  searched: boolean = false
  mounted () {
    this.getFactory()
    this.getWorkshop(this.params.factoryId)
  }
  isAuth (key) {
    return Vue.prototype.isAuth(key)
  }
  get mainTabs () {
    return this.$store.state.common.mainTabs
  }
  set mainTabs (val) {
    this.$store.commit('common/updateMainTabs', val)
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
      Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: fid, deptName: '炒麦'}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.workshopList = res.data.typeList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  setStore (params) {
    this.$store.commit('common/updateGranaryWheatPot', params)
  }
  getOrderList () {
    if (this.params.factoryId === '') {
      this.$message.error('请选择工厂')
      return
    }
    this.searched = true
    // 保存选项值到common store
    this.setStore(this.params)
    let queryParams = {
      factory: this.params.factoryId,
      deptId: this.params.workshopId,
      flag: '002'
    }
    this.retrieveOrderList(queryParams)
  }
  retrieveOrderList (params) {
    this.dataList = []
    Vue.prototype.$http(`${GRANARY_API.WHEAT_POT_LIST}/${params.factory}?deptId=${params.deptId}&flag=${params.flag}`, `GET`).then((res) => {
      if (res.data.code === 0) {
        this.dataList = res.data.data ? res.data.data.holders : []
        this.dataList.forEach((item) => {
          item.total = 0
          item.unit = 'KG'
          if (item.stocks && item.stocks.length > 0) {
            item.total = item.stocks.reduce((prev, next) => { return prev + (next.currentQuantity ? next.currentQuantity : 0) }, 0)
            item.unit = item.stocks[0].unit
          }
        })
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  goDetail (holderId, holderName) {
    if (!this.isAuth('gra:material:list')) {
      this.$message.error('您无权限查看详情')
      return
    }
    let p = Object.assign({}, this.params, {holderId, holderName})
    this.setStore(p)
    this.pushPage('DataEntry-Granary-WheatPot-dataEntryIndex')
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
  @Watch('params.factoryId')
  onFactoryValue (newVal: string, oldVal: string) {
    this.params.workshopId = ''
    this.params.workshopName = ''
    this.getWorkshop(newVal)
  }
}
</script>

<style lang="scss">
.Card_item{
  .el-card__header{
    padding: 15px 20px;
    font-size: 16px;
    color: #666;
  }
  &_detail{
    float: right;
    cursor: pointer;
    color: #1890FF;
  }
  &_img{
    width: 250px;
    position: relative;
    img{
      width: 250px;
    }
    &_box{
      width: 89px;
      height: 161px;
      position: absolute;
      left: 83px;
      top: 33px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-end;
      &_bg{
        flex: 1;
        height: 161px;
        align-items: center;
        position: relative;
        background: linear-gradient(#35C3FF,#1890FF);
        overflow: hidden;
        &:hover{
          &::before,&::after{
            animation: roateOne 10s linear infinite;
          }
        }
        &::before,&::after{
          content: "";
          position: absolute;
          left: 50%;
          min-width: 155px;
          min-height: 145px;
          background: #fff;
          animation: roateTwo 10s linear infinite;
        }

        &::before {
          top: -138px;
          border-radius: 45%;
        }
        &::after {
          top: -132px;
          opacity: 0.5;
          border-radius: 47%;
        }
      }
    }
  }
  &_text{
    flex: 1;
    .el-card__header{
      font-size: 14px;
      padding: 10px 12px;
      background: #1890FF;
      color: white;
    }
    &_box{
      position: relative;
      padding-bottom: 6px;
      max-height: 180px;
      overflow: scroll;
      &_bg1,&_bg2{
        position: absolute;
        width: 100%;
        height: 20px;
        background: linear-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
        z-index: 999;
      }
      &_bg2{
        bottom: 0;
        background: linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
      }
    }
    .Card_item_text_box::-webkit-scrollbar {
      display: none;
    }
    &_item{
      color: #4A4A4A;
      font-size: 14px;
      padding-top: 10px;
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
