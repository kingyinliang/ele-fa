<template>
  <div style="padding: 5px 10px">
    <el-card class="searchCard  newCard" style="margin-bottom: 5px">
      <el-row type="flex">
        <el-col>
          <form-head :formHeader="formHeader"></form-head>
        </el-col>
        <el-col style="width: 100px">
          <div style="padding-top: 30px"><span style="width: 5px;height: 5px;float: left;background: #1890FF;border-radius: 50%;margin-top: 7px;margin-right: 3px" :style="{'color': orderStatus === 'noPass'? 'red' : '' }"></span>{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : '未录入' }}</div>
        </el-col>
        <img src="@/assets/img/zhang.png" alt="" class="supStatus" v-if="supStatus">
      </el-row>
      <el-row style="text-align:right;position: absolute;bottom:10px;right: 20px;" class="buttonCss">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('wht:order:update')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('wht:order:update')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('sys:whtInStorage:submit')">提交</el-button>
        </template>
      </el-row>
    </el-card>
    <el-card class="searchCard  newCard">
      <el-tabs ref='tabs' v-model="activeName" class="NewDaatTtabs" type="border-card">
        <el-tab-pane name="1">
          <span slot="label" class="spanview">
            辅料添加
          </span>
          <el-card class="newCard">
            <div class="clearfix" style="padding-top: 5px;padding-bottom: 5px">
              <h3 style="line-height: 32px">辅料添加记录</h3>
              <el-button type="primary" size="mini" style="float: right" :disabled="!isRedact" @click="addOver(multipleSelectionAddSup, 'addSup')">添加完成</el-button>
            </div>
            <el-table header-row-class-name="tableHead" :data="AddSupDate" @selection-change="handleSelectionChangeAddSup" :row-class-name="RowDelFlag" border tooltip-effect="dark">
              <el-table-column type="selection" :selectable="CheckBoxA" width="40"></el-table-column>
              <el-table-column type="index" width="55" label="序号" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="添加状态" width="80" prop="addStatus" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="物料" :show-overflow-tooltip="true"><template slot-scope="scope">{{scope.row.materialCode + ' ' + scope.row.materialName}}</template></el-table-column>
              <el-table-column label="需求数量" width="80" prop="adjustAmount" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{scope.row.supStatus === '已推送'? scope.row.adjustAmount : scope.row.supStatus === '已确认'? scope.row.adjustAmount : scope.row.adjustAmountPro}}
                </template>
              </el-table-column>
              <el-table-column label="单位" width="50" prop="unit" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作" width="65">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" @click="addData(scope.row, scope.$index, AddSupDate)" v-if="scope.row.isSplit === '0'"><i class="icons iconfont factory-chaifen"></i>拆分</el-button>
                </template>
              </el-table-column>
              <el-table-column width="100">
                <template slot="header"><i class="reqI">*</i><span>批次</span></template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.batch" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="领用数量" width="100">
                <template slot="header"><i class="reqI">*</i><span>领用数量</span></template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.receiveAmount" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="115" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" @click="addOver(multipleSelectionAddSup, 'addSup', scope.row)">添加完成</el-button>
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" @click="delRow(scope.row)"  v-if="scope.row.isSplit !== '0'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="newCard">
            <div class="clearfix" style="padding-top: 5px;padding-bottom: 5px">
              <h3 style="line-height: 32px">增补料记录</h3>
              <el-button type="primary" size="mini" style="float: right" :disabled="!isRedact" @click="addOver(multipleSelectionSup, 'Sup')">添加完成</el-button>
            </div>
            <el-table header-row-class-name="tableHead" :data="SupDate" @selection-change="handleSelectionChangeSup" :row-class-name="RowDelFlag" border tooltip-effect="dark">
              <el-table-column type="selection" :selectable="CheckBoxA" width="34"></el-table-column>
              <el-table-column type="index" width="55" label="序号"></el-table-column>
              <el-table-column label="添加状态" width="80" prop="addStatus" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="物料" :show-overflow-tooltip="true"><template slot-scope="scope">{{scope.row.materialCode + ' ' + scope.row.materialName}}</template></el-table-column>
              <el-table-column label="添加数量" width="80" prop="addAmount" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="单位" width="50" prop="unit" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作" width="65">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" @click="addData(scope.row, scope.$index, SupDate)" v-if="scope.row.isSplit === '0'"><i class="icons iconfont factory-chaifen"></i>拆分</el-button>
                </template>
              </el-table-column>
              <el-table-column width="100">
                <template slot="header"><i class="reqI">*</i><span>批次</span></template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.batch" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="领用数量" width="100">
                <template slot="header"><i class="reqI">*</i><span>领用数量</span></template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.receiveAmount" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="115" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" @click="addOver(multipleSelectionSup, 'Sup', scope.row)">添加完成</el-button>
                  <el-button type="text" size="mini" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked') && scope.row.addStatus !== '已添加')" @click="delRow(scope.row)"  v-if="scope.row.isSplit !== '0'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="spanview">
            异常记录
          </span>
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" class="spanview">
            文本记录
          </span>
          <text-record ref="textrecord" :isRedact="isRedact"></text-record>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog width="400px" title="添加确认" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="visible">
      <div style="max-height: 300px;overflow-y: initial" :style="{'overflow-y':(addSupOverData.length > 6 || SupOverData.length > 6)? 'scroll' : 'initial'}">
        <p style="line-height: 20px;margin-bottom: 8px" v-for="(item, index) in addSupOverData" :key="index">{{item.materialCode + ' ' + item.materialName}}已经添加{{item.receiveAmount + item.unit}},确认添加完成！</p>
        <p style="line-height: 20px;margin-bottom: 8px" v-for="(item, index) in SupOverData" :key="index">{{item.materialCode + ' ' + item.materialName}}已经添加{{item.receiveAmount + item.unit}},确认添加完成！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button type="primary" @click="addOverTo()" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
import {STERILIZED_API} from '@/api/api'
import {Stesave, GetStatus} from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      visible: false,
      isRedact: false,
      supStatus: false,
      formHeader: {},
      activeName: '1',
      orderStatus: '',
      multipleSelectionAddSup: [],
      AddSupDate: [],
      multipleSelectionSup: [],
      SupDate: [],
      addSupOverData: [],
      SupOverData: []
    }
  },
  mounted () {
    this.GetOrderHead()
  },
  methods: {
    GetDataList () {
      this.$http(`${STERILIZED_API.STE_ENTER_SUP_LIST_API}`, 'POST', {
        orderId: this.$store.state.common.sterilized.acceOrderId,
        factory: this.$store.state.common.sterilized.acceFactory,
        orderNo: this.$store.state.common.sterilized.acceOrderNo
      }).then(({data}) => {
        if (data.code === 0) {
          if (data.steSupMaterialBean.resultList) {
            this.AddSupDate = data.steSupMaterialBean.resultList
          }
          if (data.steSupMaterialBean.supList) {
            this.SupDate = data.steSupMaterialBean.supList
          }
          let c = this.AddSupDate.concat(this.SupDate)
          this.orderStatus = GetStatus(c)
          this.supStatus = true
          c.forEach((items) => {
            if (items.supStatus !== '已确认') {
              this.supStatus = false
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 拆分
    addData (row, index, data) {
      data.splice(index + 1, 0, {
        addAmount: row.addAmount,
        addStatus: '未添加',
        adjustAmount: row.adjustAmount,
        adjustAmountPro: row.adjustAmountPro,
        batch: '',
        delFlag: '0',
        diffAmount: row.diffAmount,
        id: '',
        isOperation: row.isOperation,
        isSplit: '1',
        isSupplement: row.isSupplement,
        materialCode: row.materialCode,
        materialName: row.materialName,
        orderId: row.orderId,
        planAmount: row.planAmount,
        receiveAmount: '',
        remark: '',
        status: '',
        supStatus: '',
        unit: row.unit
      })
    },
    // 添加完成
    addOver (data, str, row) {
      this.addSupOverData = []
      this.SupOverData = []
      if (row) {
        str === 'addSup' ? this.addSupOverData = [row] : this.SupOverData = [row]
        this.visible = true
      } else {
        if (data.length > 0) {
          str === 'addSup' ? this.addSupOverData = data : this.SupOverData = data
          this.visible = true
        } else {
          this.$message.error('请选择数据')
        }
      }
    },
    // 添加完成确认
    addOverTo () {
      if (!this.dataRul(this.addSupOverData, 'AddSupDate', true)) {
        return
      }
      if (!this.dataRul(this.SupOverData, 'SupDate', true)) {
        return
      }
      this.addSupOverData.forEach((item) => {
        item.addStatus = '已添加'
        item.status = 'saved'
      })
      this.SupOverData.forEach((item) => {
        item.addStatus = '已添加'
        item.status = 'saved'
      })
      this.$http(`${STERILIZED_API.STE_ENTER_SUP_UPDATE_API}`, 'POST', {
        resultList: this.AddSupDate,
        supList: this.SupDate
      }).then(({data}) => {
        if (data.code === 0) {
          this.visible = false
          this.$message.success('操作成功')
          this.GetOrderHead()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    delRow (row) {
      if (this.multipleSelectionAddSup.length > 0) {
        this.multipleSelectionAddSup.forEach((item, index) => {
          if (item === row) {
            this.multipleSelectionAddSup.splice(index, 1)
          }
        })
        this.multipleSelectionSup.forEach((item, index) => {
          if (item === row) {
            this.multipleSelectionSup.splice(index, 1)
          }
        })
      }
      row.delFlag = '1'
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    // 辅料添加多选
    handleSelectionChangeAddSup (val) {
      this.multipleSelectionAddSup = []
      val.forEach((item, index) => {
        if (item.delFlag !== '1') {
          this.multipleSelectionAddSup.push(item)
        }
      })
    },
    // 增补料多选
    handleSelectionChangeSup (val) {
      this.multipleSelectionSup = []
      val.forEach((item, index) => {
        if (item.delFlag !== '1') {
          this.multipleSelectionSup.push(item)
        }
      })
    },
    // 辅料修改
    UpdateSup (str, resolve, reject) {
      this.AddSupDate.forEach((item) => {
        if (item.status) {
          if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
        } else {
          item.status = str
        }
      })
      this.SupDate.forEach((item) => {
        if (item.status) {
          if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
        } else {
          item.status = str
        }
      })
      this.$http(`${str === 'saved' ? STERILIZED_API.STE_ENTER_SUP_UPDATE_API : STERILIZED_API.STE_ENTER_SUP_SUBMIT_API}`, 'POST', {
        resultList: this.AddSupDate,
        supList: this.SupDate
      }).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject('辅料添加' + data.msg)
          }
        }
      })
    },
    // 保存提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    savedOrSubmitForm (str) {
      if (str === 'submit') {
        if (!this.dataRul(this.AddSupDate, 'AddSupDate')) {
          return
        }
        if (!this.dataRul(this.SupDate, 'SupDate')) {
          return
        }
      }
      let net0 = new Promise((resolve, reject) => {
        this.Stesave.orderUpdate(this, str, resolve, reject)
      })
      let net1 = new Promise((resolve, reject) => {
        this.Stesave.excUpdate(this, 'AddSup', resolve, reject)
      })
      let net2 = new Promise((resolve, reject) => {
        this.Stesave.textUpdate(this, 'AddSup', resolve, reject)
      })
      let net3 = new Promise((resolve, reject) => {
        this.UpdateSup(str, resolve, reject)
      })
      if (str === 'submit') {
        let submitNet = Promise.all([net0, net1, net2, net3])
        submitNet.then(() => {
          this.$message.success('提交成功')
          this.GetOrderHead()
        }).catch((err) => {
          this.$message.error(err)
        })
      } else {
        let savedNet = Promise.all([net0, net1, net2, net3])
        savedNet.then(() => {
          this.$message.success('保存成功')
          this.GetOrderHead()
        }).catch((err) => {
          this.$message.error(err)
        })
      }
    },
    // 验证
    dataRul (data, data1, st) {
      let ty = true
      data.forEach((item) => {
        if (item.delFlag === '0') {
          if (!item.batch) {
            ty = false
            this.$message.error('批次必填')
          }
          if (!item.receiveAmount) {
            ty = false
            this.$message.error('领用数量必填')
          }
          if (!st) {
            if (item.supStatus !== '已确认') {
              ty = false
              this.$message.error('品保未确认')
            }
          }
          let sum = 0
          let dataArr = []
          if (data1 === 'AddSupDate') {
            dataArr = this.AddSupDate
          } else if (data1 === 'SupDate') {
            dataArr = this.SupDate
          }
          dataArr.forEach((it) => {
            if (it.materialCode === item.materialCode && it.delFlag !== '1') {
              sum += it.receiveAmount * 1
            }
          })
          if (data1 === 'AddSupDate') {
            console.log(sum)
            if (sum > item.adjustAmount) {
              ty = false
              this.$message.error('领用数量大于需求数量')
            }
          } else if (data1 === 'SupDate') {
            console.log(sum)
            if (sum > item.addAmount) {
              ty = false
              this.$message.error('领用数量大于添加数量')
            }
          }
        }
      })
      return ty
    },
    CheckBoxA (row) {
      if (row.status === 'checked' || row.status === 'submit' || row.addStatus === '已添加') {
        return 0
      } else {
        return 1
      }
    },
    // 获取订单表头
    GetOrderHead () {
      this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {orderId: this.$store.state.common.sterilized.acceOrderId}).then(({data}) => {
        if (data.code === 0) {
          this.isRedact = false
          this.formHeader = data.list[0]
          this.Stesave = new Stesave(this.formHeader)
          this.$refs.excrecord.GetequipmentType(this.formHeader.productLine)
          this.$refs.excrecord.getDataList(this.formHeader.factory)
          if (this.formHeader.status !== '') {
            this.GetDataList()
            this.$refs.excrecord.GetExcDate({
              order_id: this.formHeader.orderId,
              sign: 'AddSup'
            })
            this.$refs.textrecord.GetText({
              order_id: this.formHeader.orderId,
              sign: 'AddSup'
            })
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  computed: {},
  components: {
    ExcRecord,
    TextRecord,
    FormHead: resolve => {
      require(['../components/formHead'], resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
.supStatus{
  width: 100px;
  height: 100px;
  position: absolute;
  right: 90px;
  top: 20px;
  transform: rotateZ(-30deg);
}
</style>
