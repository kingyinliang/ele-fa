<template>
  <div class="main">
    <el-card class="newCard searchCard">
      <el-row>
        <el-col>
          <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
            <el-form-item label="生产工厂：">
              <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="formHeader.workShop" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布浆线：">
              <el-select v-model="formHeader.productLine" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工序：">
              <el-select v-model="formHeader.pressure" placeholder="请选择" class="width180px">
                <el-option :label="item.label" v-for="(item, index) in pressureList" :key="index" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:180px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="SearchList" v-if="isAuth('prs:prepress:pressList')">查询</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('prs:pressUpdate')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('prs:pressUpdate')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('prs:pressUpdate')">提交</el-button>
        </template>
      </el-row>
      <div class="toggleSearchBottom">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
    <div class="tableCard">
      <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-tabs v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="margin-top:15px" v-show="contentshow">
        <el-tab-pane name="1" label="物料领用">
          <Material ref="material" :isRedact="isRedact" :formHeader="formHeader"></Material>
        </el-tab-pane>
        <el-tab-pane name="2" label="异常记录">
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="3" label="文本记录">
          <text-record ref="textrecord" :isRedact="isRedact"></text-record>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api'
import { headanimation, dateFormat } from '@/net/validate'
import Material from './common/material'
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
export default {
  name: 'press',
  data () {
    return {
      contentshow: false,
      isRedact: false,
      succmessage: '',
      orderStatus: '',
      activeName: '1',
      factory: [],
      workshop: [],
      productline: [],
      pressureList: [{
        value: 1,
        label: '预压'
      }, {
        value: 2,
        label: '终压'
      }],
      formHeader: {
        factory: '',
        workShop: '',
        productLine: '',
        pressure: 1,
        productDate: dateFormat(new Date(), 'yyyy-MM-dd')
      },
      proxy: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
      this.contentshow = false
      this.isRedact = false
    },
    'formHeader.workShop' (n, o) {
      this.GetParentline(n)
      this.contentshow = false
      this.isRedact = false
    },
    'formHeader.pressure' (n, o) {
      this.contentshow = false
      this.isRedact = false
    },
    'formHeader.productDate' (n, o) {
      this.contentshow = false
      this.isRedact = false
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
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
      this.formHeader.workShop = ''
      this.formHeader.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '压榨'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.formHeader.workShop = data.typeList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 获取产线
    GetParentline (id) {
      this.formHeader.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {parentId: id, deptType: 'proLine'}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
            this.formHeader.productLine = data.childList[0].deptId
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.productline = []
      }
    },
    SearchList () {
      if (!this.formHeader.factory || this.formHeader.factory === '') {
        this.$message.error('请选择生产工厂')
        return false
      }
      if (!this.formHeader.workShop || this.formHeader.workShop === '') {
        this.$message.error('请选择生产车间')
        return false
      }
      if (!this.formHeader.productLine || this.formHeader.productLine === '') {
        this.$message.error('请选择布浆线')
        return false
      }
      if (!this.formHeader.pressure || this.formHeader.pressure === '') {
        this.$message.error('请选择工序')
        return false
      }
      if (!this.formHeader.productDate || this.formHeader.productDate === '') {
        this.$message.error('请选择生产日期')
        return false
      }
      this.contentshow = true
      this.$refs.material.GetMateriaList(this.formHeader)
      this.$refs.material.GetpulpMachine(this.formHeader)
      this.$refs.excrecord.GetequipmentType(this.formHeader.productLine)
      this.$refs.excrecord.getDataList(this.formHeader.factory)
      this.$refs.excrecord.GetExcDate({
        factory: this.formHeader.factory,
        workShop: this.formHeader.workShop,
        productLine: this.formHeader.productLine,
        productDate: this.formHeader.productDate
      })
      this.$refs.textrecord.GetText({
        factory: this.formHeader.factory,
        workShop: this.formHeader.workShop,
        productLine: this.formHeader.productLine,
        productDate: this.formHeader.productDate
      })
    },
    // 提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    // 保存
    savedOrSubmitForm (str) {
      let that = this
      let excSaveNet = new Promise((resolve, reject) => {
        that.$refs.excrecord.saveOrSubmitExc(that.formHeader, 'Squeeze', resolve, reject)
      })
      let textSaveNet = new Promise((resolve, reject) => {
        that.$refs.textrecord.UpdateText(that.formHeader, 'Squeeze', resolve, reject)
      })
      let net3
      if (str === 'submit') {
        that.succmessage = '提交成功'
        net3 = new Promise((resolve, reject) => {
          that.$refs.material.submitMaterial(resolve, reject)
        })
      } else {
        that.succmessage = '保存成功'
        net3 = new Promise((resolve, reject) => {
          that.$refs.material.updateMaterial(resolve, reject)
        })
      }
      Promise.all([net3, excSaveNet, textSaveNet]).then(function () {
        that.$message.success(that.succmessage)
        that.SearchList()
        that.isRedact = false
      }).catch(() => {
        that.$message.error('网络请求失败，请刷新重试')
      })
    },
    tabClick (val) {
      this.$refs.tabs.setCurrentName(val.name)
    }
  },
  components: {
    Material,
    ExcRecord,
    TextRecord
  }
}
</script>

<style lang="less" scoped>
.width180px {
  width: 180px;
}
.searchCard {
  .el-button--primary,.el-button--primary:focus{
    color: #000000;
    background-color: #FFFFFF;
    border-color: #D9D9D9;
  }
  .el-button--primary:hover{
    background-color: #1890FF;
    color: #FFFFFF
  }
  .el-button--primary:first-child{
    background-color: #1890FF;
    color: #FFFFFF;
    border-color: #1890FF;
  }
}
</style>
