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
      <el-form-item label="生产罐号：">
        <el-select v-model="formHeader.holderId" filterable>
          <el-option value=''>请选择</el-option>
          <el-option v-for="(item, index) in HolderList" :key="index" :value="item.holderId" :label="item.holderName"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('ste:allocate:allocateUpdate')" style="float: right" >查询</el-button>
    </el-form>
  </el-card>
  <el-card class="searchCard  newCard ferCard" style="margin-top: 5px"  v-show="fastS">
    <h3 style="color: black;margin-bottom: 8px"><i class="iconfont factory-liebiao" style="color: #666666;margin-right: 10px"></i>半成品罐列表</h3>
    <el-row class="dataList" :gutter="10" style="min-height: 150px">
      <el-col :span="6" v-for="(item, index) in DataList" :key="index">
        <el-card class="dataList_item">
          <h3 class="dataList_item_tit">{{item.holderNo}}罐</h3>
          <div class="dataList_item_pot clearfix">
            <div class="dataList_item_pot_box">
              <div class="dataList_item_pot_box1">
                <div class="dataList_item_pot_box_item1" :style="`height:95%`"><p></p></div>
              </div>
            </div>
            <div class="dataList_item_pot_detail" v-if="item.holderStatus === '1'">
              <p>{{item.batch}}</p>
              <p>{{item.materialName}}</p>
              <p>{{(item.amount / 1000).toFixed(3)}}方</p>
              <p>{{item.gnEndTime}}</p>
              <p>{{item.timeLength}}<span v-if="item.timeLength !== '' && item.timeLength !== null">H</span></p>
            </div>
          </div>
          <el-row class="dataList_item_btn">
            <el-col :span="12" class="dataList_item_btn_item"><el-button :disabled="!isAuth('ste:gn:save')" @click="GnProp(item)" style='border:none; background:none; padding:0px;'>GN搅罐</el-button></el-col>
            <!-- <el-col :span="12" class="dataList_item_btn_item"><p @click="GnProp(item)">GN搅罐</p></el-col> -->
            <el-col :span="12" class="dataList_item_btn_item"><el-button :disabled="!isAuth('ste:gn:save')" @click="JsbProp(item)" style='border:none; background:none; padding:0px;'>JBS出库</el-button></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formHeader.currPage"
        :page-sizes="[12, 16, 20]"
        :page-size="formHeader.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="formHeader.totalCount">
      </el-pagination>
    </el-row>
  </el-card>
  <el-dialog :visible.sync="GnDialogTableVisible" width="500px" custom-class='dialog__class'>
    <div slot="title" style="line-hight:59px">GN搅罐</div>
    <div>
      <el-form size="small" :model="formGn" :rules="Gnrulestar" ref="Gnstar" label-width="150px">
        <el-form-item label="罐号：">{{formGn.holderNo}}</el-form-item>
        <el-form-item label="搅罐开始时间：" prop="gnStartTime">
          <el-date-picker v-model="formGn.gnStartTime" type="datetime" placeholder="请选择" style="width:200px" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-form-item>
        <el-form-item label="搅罐结束时间：" prop="gnEndTime">
          <el-date-picker v-model="formGn.gnEndTime" type="datetime" placeholder="请选择" style="width:200px" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formGn.remark" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="操作人：" prop="operator">
          <el-select v-model="formGn.operator">
            <el-option v-for="(item, index) in PeopleList" :key="index" :label="item.realName + `(${item.userName})`" :value="item.realName + `(${item.userName})`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="GnDialogTableVisible = false" size="small">取消</el-button>
      <el-button type="primary" @click="GnSave('Gnstar')" size="small">确定</el-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="JsbDialogTableVisible" width="500px" custom-class='dialog__class'>
    <div slot="title" style="line-hight:59px">JSB出库</div>
    <div>
      <el-form size="small" :model="formJsb" :rules="Jsbrulestar" ref="Jsbstar" label-width="150px">
        <el-form-item label="领用罐号：">{{formJsb.receiveHolderId}}</el-form-item>
        <el-form-item label="批次：">{{formJsb.batch}}</el-form-item>
        <el-form-item label="领用量（L）：" prop="receiveAmount">
          <el-input v-model="formJsb.receiveAmount" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="打入罐类别：" prop="inHolderType">
          <el-select v-model="formJsb.inHolderType">
            <el-option v-for="(item, index) in typeList" :key="index" :value="item.code" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打入罐号：" prop="inHolderId">
          <el-select filterable v-model="formJsb.inHolderId">
            <el-option v-for="(item, index) in thrwHolderList" :key="index" :value="item.holderId" :label="item.holderName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formJsb.remark" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="JsbDialogTableVisible = false" size="small">取消</el-button>
      <el-button type="primary" @click="JsbSave('Jsbstar')" size="small">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {BASICDATA_API, STERILIZED_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      formHeader: {
        factory: '',
        workShop: '',
        holderId: '',
        currPage: 1,
        pageSize: 12,
        totalCount: 0
      },
      HolderList: [],
      DataList: [],
      GnDialogTableVisible: false,
      formGn: {},
      Gnrulestar: {
        gnStartTime: [
          {required: true, message: '请选择搅罐开始时间', trigger: 'change'}
        ],
        gnEndTime: [
          {required: true, message: '请选择搅罐结束时间', trigger: 'change'}
        ],
        operator: [
          { required: true, message: '请选择操作人', trigger: 'blur' }
        ]
      },
      JsbDialogTableVisible: false,
      formJsb: {},
      Jsbrulestar: {
        receiveAmount: [
          { required: true, message: '请填写领用量', trigger: 'blur' }
        ],
        inHolderType: [
          { required: true, message: '请选择打入罐类别', trigger: 'blur' }
        ],
        inHolderId: [
          { required: true, message: '请填写打入罐号', trigger: 'blur' }
        ]
      },
      fastS: false,
      factory: [],
      workshop: [],
      typeList: [],
      thrwHolderList: [],
      PeopleList: []
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.formHeader.workShop = ''
      this.Getdeptbyid(n)
    },
    'formHeader.workShop' (n, o) {
      this.GetHolder(n)
      this.GetPeople(n)
    },
    'formJsb.inHolderType' (n, o) {
      this.ThrowHolder(n)
    }
  },
  mounted () {
    this.Getdeptcode()
  },
  methods: {
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
        this.DataList = []
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '杀菌'}, false, false, false).then(({data}) => {
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
    // 罐
    GetHolder (id) {
      this.formHeader.holderId = ''
      this.DataList = []
      if (id) {
        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTHOLDER}`, 'POST', {factory: this.formHeader.factory, workShop: id}).then(({data}) => {
          if (data.code === 0) {
            this.HolderList = data.halfList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 打入罐
    ThrowHolder (id) {
      this.thrwHolderList = []
      if (id) {
        let params = {
          factory: this.formHeader.factory,
          workShop: this.formHeader.workShop,
          code: id
        }
        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTHROWHOLDER}`, 'POST', params).then(({data}) => {
          if (data.code === 0) {
            this.thrwHolderList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    GetList (st) {
      if (!this.formHeader.factory) {
        this.$message.error('请选择工厂')
        return false
      }
      if (!this.formHeader.workShop) {
        this.$message.error('请选择车间')
        return false
      }
      if (st) {
        this.formHeader.currPage = 1
      }
      this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTLIST}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.DataList = data.list.list
          this.formHeader.totalCount = data.list.totalCount
          this.fastS = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.formHeader.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.formHeader.currPage = val
      this.GetList()
    },
    GnProp (row) {
      if (row.holderStatus === '1') {
        this.formGn = {
          holderId: row.holderId,
          holderNo: row.holderNo,
          gnStartTime: '',
          gnEndTime: '',
          remark: ''
        }
        this.GnDialogTableVisible = true
      }
    },
    GnSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTGNSAVE}`, 'POST', this.formGn).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('保存成功')
              this.GnDialogTableVisible = false
              this.GetList()
              this.$refs[formName].resetFields()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    JsbProp (row) {
      if (row.holderStatus === '1') {
        this.typeList = []
        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTYPE}`, 'POST').then(({data}) => {
          if (data.code === 0) {
            this.typeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        this.formJsb = {
          amount: row.amount,
          holderId: row.holderId,
          receiveHolderId: row.holderId,
          batch: row.batch,
          receiveAmount: '',
          inHolderType: '',
          inHolderId: '',
          remark: ''
        }
        this.JsbDialogTableVisible = true
      }
    },
    JsbSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formJsb.receiveAmount > this.formJsb.amount) {
            this.$message.error('领用量不能大于库存')
            return false
          }
          this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTJSBSAVE}`, 'POST', this.formJsb).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('保存成功')
              this.JsbDialogTableVisible = false
              this.GetList()
              this.$refs[formName].resetFields()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    GetPeople (id) {
      this.PeopleList = []
      if (id) {
        this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {currPage: '1', deptId: id, pageSize: '1000', param: ''}).then(({data}) => {
          if (data.code === 0) {
            this.PeopleList = data.page.list
          } else {
            this.$message.error(data.msg)
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
<style lang="less">
.dialog__class{
  border-radius:6px 6px 6px 6px !important;
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
}
</style>
