<template>
  <div>
    <div class="main" style="padding-bottom: 0">
      <el-card class="newCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="50px">
              <el-form-item label="工厂：" style="margin-bottom: 0px">
                <el-select v-model="plantList.factory" class="selectwpx" style="width: 140px">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：" style="margin-bottom: 0px">
                <el-select v-model="plantList.workshop" class="selectwpx" style="width: 140px">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 80px">
            <el-button type="primary" size="small" @click="GetOrderList(true)" style="float: right">查询</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="main" style="padding-top: 8px">
      <el-card class="newCard" style="min-height: 436px">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, index) in DataList" :key="index">
            <el-card class="Card_item">
              <div slot="header">豆粕罐号：{{item.holderName}} <span class="Card_item_detail" @click="goBeanPulpDetail(item)">详情>></span></div>
              <div style="display: flex">
                <div class="Card_item_img">
                  <div class="Card_item_img_box">
                    <div class="Card_item_img_box_bg" :style="{height: `${sumBatch(item.stocks) / (item.holderHold*1)}%`}"></div>
                  </div>
                  <img src="@/assets/img/granary.png" alt="">
                </div>
                <div class="Card_item_text">
                  <el-card style="margin-top: 25px">
                    <div slot="header">库存明细 <span style="float: right">合计：{{sumBatch(item.stocks).toLocaleString()}}KG</span></div>
                    <div style="position: relative">
                      <el-row  class="Card_item_text_item bgbox" style="padding-top: 0">
                        <el-col :span="15">批次</el-col>
                        <el-col :span="9">数量</el-col>
                      </el-row >
                      <div class="Card_item_text_box_bg1"></div>
                      <div class="Card_item_text_box">
                        <el-row class="Card_item_text_item" v-for="(items, index) in item.stocks" :key="index">
                          <el-col :span="15">{{items.batch}}</el-col>
                          <el-col :span="9">{{(items.currentQuantity*1).toLocaleString()}}KG</el-col>
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

<script>
import { BASICDATA_API, GRA_API } from '@/api/api'
import { isAuth } from '../../../../../net/validate'
export default {
  name: 'index',
  data () {
    return {
      factory: [],
      workshop: [],
      plantList: {
        factory: '',
        workshop: ''
      },
      DataList: []
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  methods: {
    // 获取列表
    GetOrderList () {
      if (!this.plantList.factory) {
        this.$message.error('请选择工厂')
        return
      }
      this.$http(`${GRA_API.BEANPULP_LIST_API}/${this.plantList.factory}?deptId=${this.plantList.workshop}&flag=012`, 'GET', {}).then(({data}) => {
        if (data.code === 0) {
          if (!data.data) {
            return
          }
          this.DataList = data.data.holders
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 去详请
    goBeanPulpDetail (item) {
      if (!isAuth('gra:material:list')) {
        this.$message.error('您无权限查看详情')
        return
      }
      this.BeanPulp = {
        holderId: item.holderId,
        factory: this.plantList.factory
      }
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Granary-BeanPulp-dataEntryIndex')
      setTimeout(() => {
        this.$router.push({ name: `DataEntry-Granary-BeanPulp-dataEntryIndex` })
      }, 100)
    },
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.plantList.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.plantList.workshop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '制曲'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.plantList.workshop = data.typeList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  },
  computed: {
    sumBatch: function () {
      return function (items) {
        let sum = 0
        items.forEach((item) => {
          sum = sum + (item.currentQuantity * 1)
        })
        return sum
      }
    },
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    BeanPulp: {
      get () {
        return this.$store.state.common.BeanPulp
      },
      set (val) {
        this.$store.commit('common/updateBeanPulp', val)
      }
    }
  },
  components: {}
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
      &:hover &_bg::before,&:hover &_bg::after{
        animation: roateOne 10s linear infinite;
      }
    }
  }
  &_text{
    width: 220px;
    margin: 0 15px;
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
