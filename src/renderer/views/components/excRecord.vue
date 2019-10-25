<template>
  <div>
    <div class="clearfix topBox">
      <h3>录入数据单位：MIN</h3>
      <div style="float: right;margin-bottom: 10px">
        <el-button type="primary" @click="AddExcDate(ExcDate)" size="small" :disabled="!isRedact">新增</el-button>
      </div>
    </div>
    <el-table header-row-class-name="tableHead" :data="ExcDate" :row-class-name="RowDelFlag" border tooltip-effect="dark">
      <el-table-column type="index" width="55" label="序号">
      </el-table-column>
      <el-table-column label="异常情况" width="150">
        <template slot="header">
          <i class="reqI">*</i>
          <span>异常情况</span>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.expCode" placeholder="请选择" :disabled="!isRedact" size="small">
            <el-option :label="item.value" v-for="(item, index) in stoppageType" :key="index" :value="item.code"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="异常描述"
        :show-overflow-tooltip="true"
        width="220">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expInfo" :disabled="!isRedact" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="241" label="异常开始时间">
        <template slot="header">
          <i class="reqI">*</i>
          <span>异常开始时间</span>
        </template>
        <template slot-scope="scope">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="scope.row.expStartDate" :disabled="!isRedact" size="small" style="width:195px"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column width="241" label="异常结束时间">
        <template slot="header">
          <i class="reqI">*</i>
          <span>异常结束时间</span>
        </template>
        <template slot-scope="scope">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" v-model="scope.row.expEndDate" :disabled="!isRedact" size="small" style="width:195px"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="异常时间" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.expContinue = mistiming(scope.row.expEndDate, scope.row.expStartDate, scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.expContinueUnit = 'MIN'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.deviceId" filterable  placeholder="设备" size="small" :disabled="!(isRedact && (scope.row.expCode === '001' || scope.row.expCode === '002'))" >
            <el-option :label="item.deviceName" v-for="(item, index) in equipmentType" :key="index" :value="item.deviceNo"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="物料分类简称" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.materialShort" filterable placeholder="选择简称" :disabled="!(isRedact && (scope.row.expCode === '003' || scope.row.expCode === '004'))" size="small" >
            <el-option :label="item.value" v-for="(item, index) in materialShort" :key="index" :value="item.code"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="能源" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.energy" placeholder="选择能源" :disabled="!(isRedact && scope.row.expCode === '005')"  size="small">
            <el-option :label="item.value" v-for="(item, index) in enery" :key="index" :value="item.code"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :disabled="!isRedact" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact" @click="dellistbomS(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div><p style="line-height: 52px;font-size: 14px">总停线时间：{{ExcNum}}</p></div>
  </div>
</template>

<script>
import {SYSTEMSETUP_API, PACKAGING_API, BASICDATA_API} from '@/api/api'
import { toDate } from '@/net/validate'
export default {
  name: 'excRecord',
  data () {
    return {
      stoppageType: [],
      equipmentType: [],
      materialShort: [],
      enery: [],
      ExcDate: []
    }
  },
  mounted () {
    // this.GetstoppageType()
    // this.GetmaterialShort()
    // this.Getenery()
  },
  watch: {
    'order.factory' (n, o) {
      this.GetstoppageType(n)
      this.GetmaterialShort(n)
      this.Getenery(n)
    }
  },
  props: {
    isRedact: {},
    order: {}
  },
  methods: {
    // 保存or提交
    saveOrSubmitExc (id, str, resolve, reject) {
      if (this.ExcDate.length > 0) {
        this.ExcDate.forEach((item) => {
          if (typeof id === 'string') {
            item.orderId = id
          } else if (typeof id === 'object') {
            if (str === 'Squeeze') {
              item.factory = id.factory
              item.workShop = id.workShop
              item.productLine = id.productLine
              item.productDate = id.productDate
            } else if (str === 'ste') {
              item.orderId = id.orderId
              item.sign = id.sign
            } else {
              item.orderId = id.orderId
              item.orderHouseId = id.orderHouseId
              item.blongProc = id.blongProc
            }
          }
        })
        this.$http(`${PACKAGING_API.PKGEXCUPDATE_API}`, 'POST', this.ExcDate).then(({data}) => {
          if (data.code === 0) {
            if (resolve) {
              resolve('resolve')
            }
          } else {
            this.$message.error('异常记录' + data.msg)
            if (reject) {
              reject('异常记录' + data.msg)
            }
          }
        })
      } else {
        if (resolve) {
          resolve('resolve')
        }
      }
    },
    // 获取异常数据
    GetExcDate (id) {
      let postdata
      if (typeof id === 'string') {
        postdata = {
          order_id: id
        }
      } else if (typeof id === 'object') {
        postdata = id
      }
      this.$http(`${PACKAGING_API.PKGEXCLIST_API}`, 'POST', postdata).then(({data}) => {
        if (data.code === 0) {
          this.ExcDate = data.listForm
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 异常记录校验
    excrul () {
      let ty = true
      this.ExcDate.forEach((item) => {
        if (item.delFlag !== '1') {
          if (item.expCode && item.expStartDate && item.expEndDate) {
            if ((item.expContinue * 1) < 0) {
              ty = false
              this.$message.error('异常开始时间大于结束时间')
              return false
            }
            if (item.expCode === '001' || item.expCode === '002') {
              if (!item.deviceId) {
                ty = false
                this.$message.error('异常记录设备必填')
                return false
              }
            } else if (item.expCode === '003' || item.expCode === '004') {
              if (!item.materialShort) {
                ty = false
                this.$message.error('异常记录物料分类必填')
                return false
              }
            } else if (item.expCode === '005') {
              if (!item.energy) {
                ty = false
                this.$message.error('异常记录能源必填')
                return false
              }
            }
          } else {
            ty = false
            this.$message.error('异常记录必填项未填')
            return false
          }
        }
      })
      return ty
    },
    // getDataList(){}
    getDataList (n) {
      this.GetstoppageType(n)
      this.GetmaterialShort(n)
      this.Getenery(n)
    },
    // 获取异常情况
    GetstoppageType (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'stoppage_type'}).then(({data}) => {
        if (data.code === 0) {
          this.stoppageType = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取设备类型
    GetequipmentType (productLine) {
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '',
        deptId: productLine,
        currPage: '1',
        pageSize: '50'
      }).then(({data}) => {
        if (data.code === 0) {
          this.equipmentType = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取物料分类简称
    GetmaterialShort (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'MATERIAL_SHORT'}).then(({data}) => {
        if (data.code === 0) {
          this.materialShort = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取能源下拉
    Getenery (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'ENERGY'}).then(({data}) => {
        if (data.code === 0) {
          this.enery = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增异常记录
    AddExcDate (form) {
      form.push({
        id: '',
        orderId: '',
        expCode: '',
        expInfo: '',
        expStartDate: null,
        expEndDate: null,
        expContinue: 0,
        expContinueUnit: '',
        deviceId: '',
        materialShort: '',
        energy: '',
        remark: '',
        delFlag: '0'
      })
    },
    // 删除
    dellistbomS (row) {
      row.delFlag = '1'
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    }
  },
  computed: {
    mistiming: function () {
      return function (end, start, row) {
        if (end && start && row.delFlag !== '1') {
          if (((toDate(end) - toDate(start)) / 60000) < 0) {
            this.$message.error('异常结束时间早于异常开始时间，请重新录入')
            return 'NaN'
          } else {
            return ((toDate(end) - toDate(start)) / 60000).toFixed(2) * 1
          }
        }
      }
    },
    ExcNum: function () {
      let num = 0
      this.ExcDate.forEach((item) => {
        num = num + (item.delFlag === '0' ? (item.expContinue ? item.expContinue * 1 : 0) : 0)
      })
      // return typeof(this.ExcDate[0].expEndDate)
      return num
    }
  },
  components: {}
}
</script>

<style>
.rowDel{
  display: none;
}
</style>
