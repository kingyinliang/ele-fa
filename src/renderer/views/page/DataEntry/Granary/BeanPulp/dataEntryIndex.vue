<template>
  <el-row>
    <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
      <div class="main">
        <el-card class="searchCard newCard" style="margin: 0">
          <el-row type="flex" class="header">
            <el-col class="header-pot">
              <div class='header-pot__label'>豆粕罐号：{{formData.holderName ? formData.holderName : ''}}</div>
              <div class="header-pot__image">
                <div class="header-pot__image_content">
                </div>
              </div>
            </el-col>
            <el-col class="header-form">
              <el-form :inline="true" size="small" label-width="100px" class="topform">
                <el-form-item label="生产工厂：">
                  <p class="header-form_input">{{formData.factoryName ? formData.factoryName : ''}}</p>
                </el-form-item>
                <el-form-item label="物理区域：">
                  <p class="header-form_input">{{formData.area ? formData.area : ''}}</p>
                </el-form-item>
                <el-form-item label="容器号：">
                  <p class="header-form_input">{{formData.holderName ? formData.holderName : ''}}</p>
                </el-form-item>
                <el-form-item label="罐体容量：">
                  <p class="header-form_input">{{formData.capacity ? formData.capacity.toLocaleString() : ''}} KG</p>
                </el-form-item>
                <el-form-item label="物料编码：">
                  <p class="header-form_input">{{formData.materialNo ? formData.materialNo : '' + ' ' + formData.materialName ? formData.materialName : ''}}</p>
                </el-form-item>
                <el-form-item label="当前总量：">
                  <p class="header-form_input">{{total}} KG</p>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="main" style="padding-top: 0px">
        <div class="tableCard">
          <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-tabs ref='tabs'  v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="border-radius: 15px;overflow: hidden">
            <el-tab-pane name="1">
              <span slot="label" class="spanview">
                <el-button>当前库存信息</el-button>
              </span>
              <!-- <el-row style="margin-bottom:10px;">
                <el-col>
                  <el-button type="primary" size="small" style="float:right;">数据处理</el-button>
                </el-col>
              </el-row> -->
              <el-row>
                <el-table header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" >
                  <!-- <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column> -->
                  <el-table-column type="index" label="序号" width="55"></el-table-column>
                  <el-table-column label="物料" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.materialCode + ' ' + scope.row.materialName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                      {{scope.row.batch}}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库日期" :show-overflow-tooltip="true" width="170">
                    <template slot-scope="scope">
                      {{scope.row.postingDate}}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库数量(KG)" :show-overflow-tooltip="true" width="160" >
                    <template slot-scope="scope">
                      {{(scope.row.quantity? scope.row.quantity.toLocaleString() : '')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="当前数量(KG)" width="160">
                    <template slot-scope="scope">
                      {{(scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="showLog(scope.row.batch)"><i class="iconfont factory-fangdajing-copy" style="font-size: 12px;margin-right: 5px"></i>查看</el-button>
                      <el-button type="text" size="small" @click="makeAdjust(scope.row)" v-if="isAuth('Gra:adjust:material:soybeanUpdate')"><i class="iconfont factory-banshou" style="font-size: 12px;margin-right: 5px"></i>调整</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row>
                <el-pagination
                  @size-change="handleDataSizeChange"
                  @current-change="handleDataCurrentChange"
                  :current-page="dataCurrPage"
                  :page-sizes="[10, 15, 20]"
                  :page-size="dataPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="dataTotalCount">
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label"  class="spanview">
                <el-button>调整信息记录</el-button>
              </span>
              <el-row>
                <el-table header-row-class-name="tableHead" :data="adjustList" border tooltip-effect="dark" >
                  <el-table-column type="index" label="序号" width="55"></el-table-column>
                  <el-table-column label="物料" :show-overflow-tooltip="true"  width="200">
                    <template slot-scope="scope">
                      {{scope.row.materialCode + ' ' + scope.row.materialName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                    <template slot-scope="scope">
                      {{scope.row.batch}}
                    </template>
                  </el-table-column>
                  <el-table-column label="调整类型" :show-overflow-tooltip="true" width="100">
                    <template slot-scope="scope">
                      {{scope.row.adjustType === '0' ? '盘盈' : '盘亏'}}
                    </template>
                  </el-table-column>
                  <el-table-column label="数量(KG)" :show-overflow-tooltip="true" width="120" >
                    <template slot-scope="scope">
                      {{(scope.row.quantity?scope.row.quantity.toLocaleString() : '')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="说明" width="170">
                    <template slot-scope="scope">
                      {{scope.row.remark}}
                    </template>
                  </el-table-column>
                  <el-table-column label="调整时间" >
                    <template slot-scope="scope">
                      {{scope.row.adjustTime}}
                    </template>
                  </el-table-column>
                  <el-table-column label="调整人" >
                    <template slot-scope="scope">
                      {{scope.row.adjuster}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row>
                <el-pagination
                  @size-change="handleAdjustSizeChange"
                  @current-change="handleAdjustCurrentChange"
                  :current-page="adjustCurrPage"
                  :page-sizes="[10, 15, 20]"
                  :page-size="adjustPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="adjustTotalCount">
                </el-pagination>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="900px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>领用明细</span>
        </div>
        <div>
          <el-table header-row-class-name="tableHead" :data="applyList" border tooltip-effect="dark" >
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column label="物料" :show-overflow-tooltip="true"  width="160">
              <template slot-scope="scope">
                {{scope.row.materialCode + ' ' + scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
              <template slot-scope="scope">
                {{scope.row.batch}}
              </template>
            </el-table-column>
            <el-table-column label="领用量(KG)" :show-overflow-tooltip="true" width="100">
              <template slot-scope="scope">
                {{(scope.row.useWeight? scope.row.useWeight.toLocaleString() : '')}}
              </template>
            </el-table-column>
            <el-table-column label="领用订单" :show-overflow-tooltip="true" width="150" >
              <template slot-scope="scope">
                {{scope.row.orderNo}}
              </template>
            </el-table-column>
            <el-table-column label="领用时间">
              <template slot-scope="scope">
                {{scope.row.changed}}
              </template>
            </el-table-column>
          </el-table>
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
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="dialogFormVisible = false">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogFormVisible2" width="400px" custom-class='dialog__class'>
        <div slot="title" class='title'>
          <span>盘点调整</span>
        </div>
        <div>
          <el-form :model="adjustForm" label-width="100px" size="small" ref="modifyForm">
            <el-form-item label="物料：">
              <p>{{adjustForm.MATERIAL_CODE + ' ' + adjustForm.MATERIAL_NAME}}</p>
            </el-form-item>
            <el-form-item label="批次：" >
              <p>{{adjustForm.BATCH}}</p>
            </el-form-item>
            <el-form-item label="调整类型：" required>
              <el-select  placeholder="请选择"  v-model="adjustForm.ADJUST_TYPE" style="width:220px" >
                <el-option label="盘亏" value="1" ></el-option>
                <el-option label="盘盈" value="0" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调整量：" required>
              <el-input  type='number'  v-model.number="adjustForm.QUANTITY"  style='width:220px'/>
            </el-form-item>
            <el-form-item label="说明：">
              <el-input  type='text'  v-model.trim="adjustForm.REMARK" style='width:220px'/>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="dialogFormVisible2 = false">取消</el-button>
          <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveAdjust()">确定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import {GRANARY_API} from '@/api/api'
@Component({
  components: {
  }
})
export default class Index extends Vue {
  factoryId = ''
  holderId = ''
  activeName = '1'
  // 批次数据
  dataList = []
  totalDataList = []
  dataCurrPage: number = 1
  dataPageSize: number = 10
  dataTotalCount: number = 0
  // 调整数据
  adjustList = []
  totalAdjustList = []
  adjustCurrPage: number = 1
  adjustPageSize: number = 10
  adjustTotalCount: number = 0
  // 领用数据
  applyList = []
  totalList = []
  currPage: number = 1
  pageSize: number = 10
  totalCount: number = 0
  dialogFormVisible : boolean = false
  dialogFormVisible2 : boolean = false
  formData = {}
  adjustForm = {
    MATERIAL_CODE: '',
    MATERIAL_NAME: '',
    BATCH: '',
    MATERIAL_TYPE_NAME: '',
    LOCATION: '',
    MOVE_TYPE: '',
    MATERIAL_TYPE_CODE: '',
    POSTING_DATE: '',
    CURRENT_QUANTITY: 0,
    FACTORY: '',
    HOLDER_ID: '',
    ADJUST_TYPE: '0',
    QUANTITY: 0,
    UNIT: 'KG',
    REMARK: ''
  }
  mounted () {
    this.factoryId = this.$store.state.common.BeanPulp.factory
    this.holderId = this.$store.state.common.BeanPulp.holderId
    this.retrieveDetail()
    this.retrieveDataList()
    this.retrieveAdjustList()
  }
  showLog (batch) {
    this.retrieveLogList(batch)
    this.dialogFormVisible = true
  }
  makeAdjust (row) {
    this.adjustForm = {
      MATERIAL_CODE: row.materialCode,
      MATERIAL_NAME: row.materialName,
      BATCH: row.batch,
      MATERIAL_TYPE_NAME: row.materialTypeName,
      LOCATION: row.location,
      MOVE_TYPE: row.moveType,
      MATERIAL_TYPE_CODE: row.materialTypeCode,
      POSTING_DATE: row.postingDate,
      CURRENT_QUANTITY: row.currentQuantity,
      FACTORY: row.factory,
      HOLDER_ID: row.holderId,
      ADJUST_TYPE: '0',
      QUANTITY: 0,
      UNIT: row.unit,
      REMARK: ''
    }
    this.dialogFormVisible2 = true
  }
  // 改变每页条数
  handleSizeChange (val: number) {
    this.pageSize = val
    this.currPage = 1
    this.applyList = this.totalList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize)
  }
  handleDataSizeChange (val: number) {
    this.dataPageSize = val
    this.dataCurrPage = 1
    this.dataList = this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize)
  }
  handleAdjustSizeChange (val: number) {
    this.adjustPageSize = val
    this.adjustCurrPage = 1
    this.adjustList = this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (this.adjustCurrPage - 1) * this.adjustPageSize + this.adjustPageSize)
  }
  // 跳转页数
  handleCurrentChange (val: number) {
    this.currPage = val
    this.applyList = this.totalList.slice((this.currPage - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize)
  }
  handleDataCurrentChange (val: number) {
    this.dataCurrPage = val
    this.dataList = this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize)
  }
  handleAdjustCurrentChange (val: number) {
    this.adjustCurrPage = val
    this.adjustList = this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (val - 1) * this.adjustPageSize + this.adjustPageSize)
  }
  retrieveDetail () {
    this.formData = {}
    Vue.prototype.$http(`${GRANARY_API.WHEAT_POT_DETAIL}/${this.factoryId}/${this.holderId}`, `GET`).then((res) => {
      if (res.data.code === 0) {
        this.formData = res.data.data
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 当前库存量
  retrieveDataList () {
    this.totalDataList = []
    this.dataList = []
    this.dataTotalCount = 0
    this.dataCurrPage = 1
    this.dataPageSize = 10
    Vue.prototype.$http(`${GRANARY_API.WHEAT_BATCH_LIST}`, `POST`, {holderId: this.holderId}).then((res) => {
      if (res.data.code === 0) {
        this.totalDataList = res.data.page.list
        this.dataTotalCount = this.totalDataList.length
        this.dataList = this.totalDataList.slice(0, this.dataPageSize)
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 调整信息
  retrieveAdjustList () {
    this.totalAdjustList = []
    this.adjustList = []
    this.adjustTotalCount = 0
    this.adjustCurrPage = 1
    this.adjustPageSize = 10
    Vue.prototype.$http(`${GRANARY_API.WHEAT_ADJSUT_LIST}`, `POST`, {factory: this.factoryId, holderId: this.holderId}).then((res) => {
      if (res.data.code === 0) {
        this.totalAdjustList = res.data.adjustInfo.list
        this.adjustTotalCount = this.totalAdjustList.length
        this.adjustList = this.totalAdjustList.slice(0, this.adjustPageSize)
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  // 领用记录
  retrieveLogList (batch) {
    this.totalList = []
    this.applyList = []
    this.currPage = 1
    this.pageSize = 10
    this.totalCount = 0
    Vue.prototype.$http(`${GRANARY_API.WHEAT_APPLY_LIST}`, `POST`, {materielType: 'Soybean', batch}).then((res) => {
      if (res.data.code === 0) {
        this.totalList = res.data.collarUseInfo.list
        this.totalCount = this.totalList.length
        this.applyList = this.totalList.slice(0, this.pageSize)
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  saveAdjust () {
    if (this.adjustForm.QUANTITY.toString() === '') {
      this.$message.error('调整数量不能为空')
      return false
    }
    Vue.prototype.$http(`${GRANARY_API.WHEAT_ADJUST}`, `POST`, this.adjustForm).then((res) => {
      if (res.data.code === 0) {
        this.$message.success('保存成功')
        this.retrieveDataList()
        this.retrieveAdjustList()
      } else {
        this.$message.error(res.data.msg)
      }
    })
    this.dialogFormVisible2 = false
  }
  get total () {
    return this.totalDataList.reduce((prev, next) => { return prev + (next.currentQuantity ? next.currentQuantity : 0) }, 0).toLocaleString()
  }
}
</script>
<style lang="scss" >
  .topform{
    .el-form-item__content{
      height: 32px;
      border-bottom: 1px solid #D8D8D8;
    }
  }
  .dialog__class{
    border-radius:6px 6px 0px 0px !important;
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
<style lang="scss" scoped>
  @import '@/assets/scss/_common.scss';
  .header {
    height: 200px;
    .header-pot {
      width: 250px;
      .header-pot__label {
        font-size: 18px;
        font-weight: 400;
        color: rgba(102,102,102,1);
        line-height:30px;
        height: 30px;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      };
      .header-pot__image {
        position: relative;
        margin-top:10px;
        height:160px;
        width:250px;
        background: url('~@/assets/img/pot.png') no-repeat top right;
        background-size:contain;
        .header-pot__image_content {
          height: 65px;
          width: 46px;
          position: absolute;
          right: 40px;
          bottom: 61px;
          background: linear-gradient(#35C3FF,#1890FF);
        }
      }
    }
    .header-form {
      width: 600px;
      margin-left: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .header-form_input {
        width:150px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.85);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

</style>
