<template>
  <div>
    <div class="main">
      <el-card class="searchCard newCard">
        <el-row>
          <el-col>
            <div style="line-height:40px;" ><i style="font-size: 22px;float:left;" class="iconfont factory-shouqicaidan"></i><span style="font-size:16px;font-weight:bold;margin-left:12px;">申请基本信息</span></div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="header-form" :span="24">
            <el-form :model="formHeader" size="small" :inline="true" label-position="right" label-width="100px" class="topform">
              <el-form-item label="生产工厂：" >
                <el-select v-model="formHeader.factory" class="selectwpx" style="width: 140px" @change="changeOptions('factory')" :disabled="!isEdit">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产车间：" >
                <el-select v-model="formHeader.workShop" class="selectwpx" style="width: 140px" @change="changeOptions('workshop')" :disabled="!isEdit">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="酱醪名称：">
                <el-select filterable v-model="formHeader.materialCode" class="selectwpx" style="width: 140px" @change="changeOptions('material')" :disabled="!isEdit">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in materialList" :key="sole.materialCode" :label="sole.materialCode + ' ' + sole.materialName" :value="sole.materialCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  label="半成品类别：" label-width="100px">
                <el-select filterable v-model="formHeader.halfType" class="selectwpx" style="width: 140px" @change="changeOptions('halfType')" :disabled="!isEdit">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="sole in halfTypeList" :key="sole.halfType" :label="sole.halfName" :value="sole.halfType"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请数量：" label-width="100px">
                <el-input type="number" size="small" v-model.number="formHeader.amount" style="width: 140px" :disabled="!isEdit"></el-input>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker type="date" v-model="formHeader.productDate" value-format="yyyy-MM-dd" style="width:140px" :disabled="!isEdit"></el-date-picker>
              </el-form-item>
              <el-form-item label="申请编号：">
                <p class="header-form_input" >{{formHeader.applyNo}}</p>
              </el-form-item>
              <el-form-item label="申请时间：">
                <p class="header-form_input" >{{formHeader.changed}}</p>
              </el-form-item>
              <el-form-item label="订单状态：">
                <p class="header-form_input" >{{formHeader.status === 'saved'? '已保存' : formHeader.status === 'submit'? '已提交' : formHeader.status}}</p>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form :model="formHeader" size="small" :inline="true" label-position="right" label-width="100px" class="topform">
              <el-form-item label="备注：">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model.trim="formHeader.remark"
                  style="width:500px"
                  :disabled="!isEdit"
                  placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" :disabled="!isEdit" @click="save()" v-if="isAuth('fer:openHolder:mySaveOrUpdate')">保存</el-button>
            <el-button type="primary" size="small" :disabled="!isEdit" @click="submit()" v-if="isAuth('fer:openHolder:submit')">提交</el-button>
          </template>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0px">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-card>
          <el-row>
            <div style="line-height: 40px;" ><i style="font-size: 22px;float:left;" class="iconfont factory-shouqicaidan"></i><span style="font-size:16px;font-weight:bold;margin-left:12px;">申请反馈信息</span></div>
          </el-row>
          <el-row>
            <el-table header-row-class-name="tableHead" :data="detailList" border tooltip-effect="dark" >
               <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column label="申请编码" width="140">
                <template slot-scope="scope">
                  {{scope.row.applyNo}}
                </template>
              </el-table-column>
              <el-table-column label="罐号" :show-overflow-tooltip="true" width="160">
                <template slot-scope="scope">
                  {{scope.row.holderName}}
                </template>
              </el-table-column>
              <el-table-column label="发酵天数/天" :show-overflow-tooltip="true" width="140">
                <template slot-scope="scope">
                  {{scope.row.ferDays}}
                </template>
              </el-table-column>
              <el-table-column label="半成品类别" :show-overflow-tooltip="true" width="140">
                <template slot-scope="scope">
                  {{scope.row.halfType}}
                </template>
              </el-table-column>
              <el-table-column label="批次" width="140">
                <template slot-scope="scope">
                  {{scope.row.batch}}
                </template>
              </el-table-column>
              <el-table-column label="确认人员" width="160">
                <template slot-scope="scope">
                  {{scope.row.changer}}
                </template>
              </el-table-column>
              <el-table-column label="确认时间" >
                <template slot-scope="scope">
                   {{scope.row.changed}}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <!-- <el-pagination
              @size-change="handleDataSizeChange"
              @current-change="handleDataCurrentChange"
              :current-page="dataCurrPage"
              :page-sizes="[10, 15, 20]"
              :page-size="dataPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dataTotalCount">
            </el-pagination> -->
          </el-row>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {BASICDATA_API, SQU_API, FERMENTATION_API} from '@/api/api'
import {Vue, Component} from 'vue-property-decorator'
import {headanimation, dateFormat} from '@/net/validate'
@Component({
  components: {
  }
})

export default class Index extends Vue {
  // 将common中的参数复制一份到本地
  params = JSON.parse(JSON.stringify(this.$store.state.common.SqueezeApplyPot))
  formHeader = {
    id: this.params.applyId,
    status: '',
    factory: this.params.factoryId,
    factoryCode: '',
    workShop: this.params.workshopId,
    applyNo: '',
    materialCode: '',
    materialName: '',
    halfType: '',
    halfName: '',
    productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
    amount: 0,
    remark: '',
    confirmFlag: 0,
    delFlag: 0,
    created: '',
    creator: '',
    changed: '',
    changer: ''
  }
  factoryList = []
  workshopList = []
  // 酱醪列表
  materialList = []
  // 半成品列表
  halfTypeList = []
  detailList = []
  searched: boolean = false
  mounted () {
    headanimation(Vue.prototype.$)
    // 获取表头数据
    this.getHeaderForm(this.formHeader.id)
    this.getDetailList(this.formHeader.id)
    this.getFactory()
    this.getWorkshop(this.formHeader.factory)
    this.getMaterialList(this.formHeader.factory)
    this.getHalfTypeList(this.formHeader.factory, this.formHeader.materialCode)
    // this.getFermentPot(this.params.factoryId)
  }
  isAuth (key) {
    return Vue.prototype.isAuth(key)
  }
  get isEdit () {
    // 提交之后不能再修改
    return this.formHeader.status !== 'submit'
  }
  changeOptions (flag: string) {
    if (flag === 'factory') {
      this.formHeader.workShop = ''
      this.formHeader.materialCode = ''
      this.formHeader.materialName = ''
      this.formHeader.halfType = ''
      this.formHeader.halfName = ''
      this.getWorkshop(this.formHeader.factory)
      this.getMaterialList(this.formHeader.factory)
      this.getHalfTypeList(this.formHeader.factory, this.formHeader.materialCode)
    } else if (flag === 'workshop') {
      // DO NOTHING
    } else if (flag === 'material') {
      let item = this.materialList.find(ele => ele.materialCode === this.formHeader.materialCode)
      this.formHeader.materialName = item ? item.materialName : ''
      this.formHeader.halfType = ''
      this.formHeader.halfName = ''
      this.getHalfTypeList(this.formHeader.factory, this.formHeader.materialCode)
    } else if (flag === 'halfType') {
      let item = this.halfTypeList.find(ele => ele.halfType === this.formHeader.halfType)
      this.formHeader.halfName = item ? item.halfName : ''
    }
  }
  getHeaderForm (applyId) {
    if (applyId) {
      // 有applyId才取表头数据
      let params = {id: applyId}
      Vue.prototype.$http(`${SQU_API.POT_APPLY_LIST_API}`, `POST`, params).then((res) => {
        if (res.data.code === 0) {
          if (res.data.page.list && res.data.page.list.length > 0) {
            this.formHeader = res.data.page.list[0]
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  getDetailList (applyId) {
    this.detailList = []
    if (applyId) {
      // 有applyId才取详情数据
      Vue.prototype.$http(`${SQU_API.POT_APPLY_DETAIL_API}`, `POST`, {openId: applyId}).then((res) => {
        if (res.data.code === 0) {
          this.detailList = res.data.list
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
  getMaterialList (factory) {
    this.materialList = []
    // this.$http(`${FERMENTATION_API.FORRECIPIENTSHOLDER_API}`, 'POST').then(({data}) => {
    //   if (data.code === 0) {
    //     this.MaterialType = data.productsInfo
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // })
    if (factory) {
      Vue.prototype.$http(`${FERMENTATION_API.FORRECIPIENTSHOLDER_API}`, 'POST', {factory}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.materialList = data.productsInfo
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
  getHalfTypeList (factory, materialCode) {
    this.halfTypeList = []
    if (factory && materialCode) {
      Vue.prototype.$http(`${BASICDATA_API.CATEGORY_SORTLIST}`, 'POST', {factory, materialCode}, false, false, false).then(res => {
        if (res.data.code === 0) {
          this.halfTypeList = res.data.ferList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  save () {
    if (this.validate()) {
      this.formHeader.status = 'saved'
      Vue.prototype.$http(`${SQU_API.POT_APPLY_DETAIL_SAVE_API}`, 'POST', this.formHeader).then(res => {
        if (res.data.code === 0) {
          this.getHeaderForm(res.data.id)
          this.getDetailList(res.data.id)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  submit () {
    if (this.validate()) {
      this.formHeader.status = 'submit'
      Vue.prototype.$http(`${SQU_API.POT_APPLY_DETAIL_SAVE_API}`, 'POST', this.formHeader).then(res => {
        if (res.data.code === 0) {
          this.getHeaderForm(res.data.id)
          this.getDetailList(res.data.id)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
  validate () {
    if (!this.formHeader.factory) {
      this.$message.error('请选择工厂')
      return false
    }
    if (!this.formHeader.workShop) {
      this.$message.error('请选择车间')
      return false
    }
    if (!this.formHeader.materialCode) {
      this.$message.error('请选择酱醪')
      return false
    }
    if (!this.formHeader.halfType) {
      this.$message.error('请选择半成品类别')
      return false
    }
    if (!this.formHeader.amount) {
      this.$message.error('请填写申请数量')
      return false
    }
    if (!this.formHeader.productDate) {
      this.$message.error('请选择生产日期')
      return false
    }
    return true
  }
  // @Watch('formHeader.factory')
  // onFactoryValue (newVal: string, oldVal: string) {
  //   this.formHeader.workShop = ''
  //   // this.formHeader.halfType = ''
  //   // this.formHeader.halfName = ''
  //   this.formHeader.materialCode = ''
  //   this.formHeader.materialName = ''
  //   this.getWorkshop(newVal)
  //   this.getMaterialList(newVal)
  //   // this.getHalfTypeList(newVal, this.formHeader.materialCode)
  //   // this.getFermentPot(newVal)
  // }
  // @Watch('formHeader.materialCode')
  // onMaterialCode (newVal: string, oldVal: string) {
  //   // this.formHeader.halfType = ''
  //   // this.formHeader.halfName = ''
  //   this.getHalfTypeList(this.formHeader.factory, newVal)
  //   // this.getFermentPot(newVal)
  // }
}
</script>

<style lang="scss">
.topform{
  .el-form-item__content{
    height: 32px;
    border-bottom: 1px solid #D8D8D8;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/_common.scss';
.header-form {
  .header-form_input {
    width:140px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.85);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
