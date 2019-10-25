<template>
<div>
  <el-row class="clearfix">
    <p style="float: left;font-size: 14px">布浆总量：</p>
    <el-button type="primary" style="float: right" size="small" :disabled="true">酱醪领用</el-button>
  </el-row>
  <el-table ref="table1" header-row-class-name="tableHead" :data="SumDate" :row-class-name="RowDelFlag">
    <el-table-column label="原汁信息">
      <el-table-column width="110">
        <template slot="header"><i class="reqI">*</i><span>原汁罐号</span></template>
        <template slot-scope="scope">{{scope.row.fumet.potNoName}}</template>
      </el-table-column>
      <el-table-column label="是否混合罐" width="95" prop="fumet.fullPort"></el-table-column>
      <el-table-column label="物料" width="220">
        <template slot-scope="scope">{{scope.row.fumet.material}}</template>
      </el-table-column>
      <el-table-column label="入罐数量" width="120" prop="fumet.inPotAmount"></el-table-column>
      <el-table-column label="满罐数量" width="140" prop="fumet.fullPotAmount"></el-table-column>
      <el-table-column label="单位" width="50" prop="fumet.unit"></el-table-column>
      <el-table-column label="满罐日期" width="140" prop="fumet.fullPotDate"></el-table-column>
      <el-table-column label="原汁批次" width="140" prop="fumet.batch"></el-table-column>
      <el-table-column label="生产订单" width="140" prop="fumet.orderNo"></el-table-column>
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template slot-scope="scope">
        <el-button v-if="scope.row.fumet.fullPort !== '正常'" type="text" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))" @click="splitDate(scope.row.fumet, scope.$index)"><i class="icons iconfont factory-chaifen"></i>拆分</el-button>
      </template>
    </el-table-column>
    <el-table-column label="酱醪领用">
      <el-table-column label="物料" width="220">
        <template slot-scope="scope">
          <el-select v-model="scope.row.material.childMaterial" filterable placeholder="请选择" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))" size="small">
            <el-option
              v-for="item in SerchSapList"
              :key="item.code+' '+item.value"
              :label="item.code+' '+item.value"
              :value="item.code+' '+item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="120">
        <template slot="header"><i class="reqI">*</i><span>发酵罐号</span></template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.material.childPotNo" filterable placeholder="请选择" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))" size="small">
            <el-option v-for="item in potList" :key="item.holderId" :label="item.holderName" :value="item.holderId"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="120">
        <template slot="header"><i class="reqI">*</i><span>当日用量</span></template>
        <template slot-scope="scope"><el-input v-model="scope.row.material.childUsedAmount" size="small" placeholder="手工录入" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))"></el-input></template>
      </el-table-column>
      <el-table-column label="单位" width="50">
        <template slot-scope="scope">{{scope.row.material.childUnit = 'L'}}</template>
      </el-table-column>
      <el-table-column label="物料批次" width="120">
        <template slot-scope="scope"><el-input v-model="scope.row.material.childBatch" size="small" placeholder="手工录入" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))"></el-input></template>
      </el-table-column>
      <el-table-column label="满罐数量" width="120">
        <template slot-scope="scope"><el-input v-model="scope.row.material.childFullPotAmount" size="small" placeholder="手工录入" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))"></el-input></template>
      </el-table-column>
      <el-table-column label="记录人" width="120" prop="material.childRecordMan"></el-table-column>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="50">
      <template slot-scope="scope">
        <el-button type="danger"  icon="el-icon-delete" circle size="small" v-if="dangerIf(scope.row)" :disabled="!(isRedact && (scope.row.material.status !== 'submit' && scope.row.material.status !== 'checked'))" @click="dellist(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <auditLog :tableData="MaterialAudit"></auditLog>
</div>
</template>

<script>
import {BASICDATA_API, SQU_API} from '@/api/api'
export default {
  name: 'material',
  data () {
    return {
      SumDate: [],
      materialDate: [],
      potList: [],
      materialS: '',
      MaterialAudit: []
    }
  },
  props: {
    isRedact: '',
    fumet: {
      type: Array,
      default () { return [] }
    },
    SerchSapList: {
      type: Array,
      default () { return [] }
    }
  },
  mounted () {
  },
  methods: {
    // 获取酱醪领用
    getMaterialList (formHeader, resolve, reject) {
      this.$http(`${SQU_API.SUM_MATERIAL_LIST_API}`, 'POST', formHeader).then(({data}) => {
        if (data.code === 0) {
          this.materialDate = data.maList
          this.MaterialAudit = data.MaterialAudit
          let sub = 0
          let che = 0
          let no = 0
          let sav = 0
          data.maList.forEach((item) => {
            if (item.status === 'noPass') {
              no = no + 1
            } else if (item.childStatus === 'submit') {
              sub = sub + 1
            } else if (item.childStatus === 'checked') {
              che = che + 1
            } else if (item.childStatus === 'saved') {
              sav = sav + 1
            } else if (item.childStatus === '') {
              sav = sav + 1
            }
          })
          if (no > 0) {
            this.materialS = 'noPass'
          } else if (sub > 0) {
            this.materialS = 'submit'
          } else if (sav > 0) {
            this.materialS = 'saved'
          } else if (che > 0) {
            this.materialS = 'checked'
          }
          this.mergeDate()
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject(data.msg)
          }
          this.$message.error(data.msg)
        }
      })
    },
    // 修改酱
    updateMaterial (str, resolve, reject, st = false) {
      let tmp = []
      this.SumDate.forEach((item, index) => {
        if (item.status) {
          if (item.material.childStatus === 'saved') { item.material.childStatus = str } else if (item.material.childStatus === 'noPass' && str === 'submit') { item.material.childStatus = str }
        } else {
          item.material.childStatus = str
        }
        item.material.childMaterialCode = item.material.childMaterial.substring(0, item.material.childMaterial.indexOf(' '))
        item.material.childMaterialName = item.material.childMaterial.substring(item.material.childMaterial.indexOf(' ') + 1)
        if (item.delFlag === '1') {
          item.material.delFlag = '1'
        }
        tmp.push(item.material)
      })
      this.$http(`${st === false ? SQU_API.SUM_MATERIAL_UPDATE_API : SQU_API.SUM_MATERIAL_SUBMIT_API}`, 'POST', tmp).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject(data.msg)
          }
          this.$message.error(data.msg)
        }
      })
    },
    // 校验
    materialRul () {
      let ty = true
      this.SumDate.forEach((item) => {
        if (!item.material.childPotNo && !item.material.childUsedAmount) {
          ty = false
          this.$message.error('物料领用必填项未填写')
          return false
        }
      })
      return ty
    },
    // 拆分
    splitDate (row, index) {
      this.SumDate.splice(index + 1, 0, {
        fumet: row,
        material: {
          childId: '',
          midPrsOrderId: row.id,
          childMaterial: '',
          childMaterialCode: '',
          childMaterialName: '',
          childPotNo: '',
          childUsedAmount: '',
          childUnit: '',
          childBatch: '',
          childFullPotAmount: '',
          childRecordMan: '',
          childRemark: '',
          childDelFlag: '0'
        }
      })
    },
    // 删除
    dellist (row) {
      let s = 0
      this.SumDate.forEach((item) => {
        if (item.delFlag !== '1' && row.fumet.id === item.fumet.id) {
          s++
        }
      })
      console.log(s)
      if (s > 1) {
        row.delFlag = '1'
        this.SumDate.splice(this.SumDate.length, 0, {})
        this.SumDate.splice(this.SumDate.length - 1, 1)
        console.log(this.SumDate)
      } else {
        this.$message.error('此订单最后一条了，不能删除')
      }
    },
    RowDelFlag ({row, rowIndex}) {
      console.log(row)
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    // 获取罐
    getPot (formHeader) {
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
        holder_type: '001',
        type: 'holder_type',
        factory: formHeader.factory,
        dept_id: formHeader.workShop,
        currPage: 1,
        pageSize: 9999
      }).then(({data}) => {
        if (data.code === 0) {
          this.potList = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 合并数据
    mergeDate () {
      this.SumDate = []
      if (this.materialDate.length === 0) {
        this.fumet.forEach((item, index) => {
          let tmp = {
            childId: '',
            midPrsOrderId: item.id,
            childMaterial: '',
            childMaterialCode: '',
            childMaterialName: '',
            childPotNo: '',
            childUsedAmount: '',
            childUnit: '',
            childBatch: '',
            childFullPotAmount: '',
            childRecordMan: '',
            childRemark: '',
            childStatus: '',
            childDelFlag: '0'
          }
          this.SumDate.push({fumet: item, material: tmp, delFlag: '0'})
        })
      } else {
        this.materialDate.forEach((item, index) => {
          item.childMaterial = item.childMaterialCode + ' ' + item.childMaterialName
          let tmp = this.fumet.find(items => items.id === item.midPrsOrderId)
          this.SumDate.push({fumet: tmp, material: item, delFlag: '0'})
        })
        this.fumet.forEach((item) => {
          if (this.materialDate.find(items => items.midPrsOrderId === item.id) === undefined) {
            let tmp = {
              childId: '',
              midPrsOrderId: item.id,
              childMaterial: '',
              childMaterialCode: '',
              childMaterialName: '',
              childPotNo: '',
              childUsedAmount: '',
              childUnit: '',
              childBatch: '',
              childFullPotAmount: '',
              childRecordMan: '',
              childRemark: '',
              childStatus: '',
              childDelFlag: '0'
            }
            this.SumDate.push({fumet: item, material: tmp, delFlag: '0'})
          }
        })
      }
    }
  },
  computed: {
    dangerIf: function () {
      return function (row) {
        let s = 0
        this.SumDate.forEach((item) => {
          if (item.delFlag !== '1' && row.fumet.id === item.fumet.id) {
            s++
          }
        })
        if (s > 1) {
          return true
        } else {
          return false
        }
      }
    }
  },
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
