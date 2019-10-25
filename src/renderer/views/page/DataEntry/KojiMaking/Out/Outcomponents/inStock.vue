<template>
  <div>
    <el-table header-row-class-name="tableHead" :data="InStock" :row-class-name="RowDelFlag" border tooltip-effect="dark">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column width="115" label="豆粕量（KG）">
        <template slot-scope="scope">
          {{scope.row.pulpWeight = ThreeNum.allP}}
        </template>
      </el-table-column>
      <el-table-column width="115" label="麦粉量（KG）">
        <template slot-scope="scope">
          {{scope.row.wheatWeight = ThreeNum.allM}}
        </template>
      </el-table-column>
      <el-table-column width="115" label="盐水量（L）">
        <template slot-scope="scope">
          {{scope.row.saltWaterWeight = BrineNum}}
        </template>
      </el-table-column>
      <el-table-column width="125" label="入库酱醪量">
        <template slot-scope="scope">
          <p>{{scope.row.sauceWeight = (((scope.row.pulpWeight*1 + scope.row.wheatWeight*1) * params.params1 + scope.row.saltWaterWeight * params.params2) / params.params3).toFixed(2)*1}}</p>
          <!--<p v-show="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')">{{(scope.row.websign === scope.row.saltWaterWeight? scope.row.sauceWeight = scope.row.sauceWeight : scope.row.sauceWeight =  (((scope.row.pulpWeight*1 + scope.row.wheatWeight*1) * params.params1 + scope.row.saltWaterWeight * params.params2) / params.params3).toFixed(2))}}</p>-->
          <!--<el-input v-if="(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" v-model="scope.row.sauceWeight" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" placeholder="手工录入"></el-input>-->
        </template>
      </el-table-column>
      <el-table-column width="125" label="入库批次">
        <template slot="header">
          <i class="reqI">*</i>
          <span>入库批次</span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.batch" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" placeholder="手工录入" maxlength="10"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="85" label="入罐罐号" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.holderName}}</template>
      </el-table-column>
      <el-table-column width="50" label="单位" prop="unit"></el-table-column>
      <el-table-column width="" label="操作人" prop="changer" show-overflow-tooltip></el-table-column>
      <el-table-column width="" label="操作时间" prop="changed" show-overflow-tooltip></el-table-column>
      <el-table-column width="70" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" circle size="small" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delInStock(scope.row)" v-if="scope.row.isSplit === '1' ">删除</el-button>
          <el-button type="text" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="addInStock(scope.row, scope.$index)" v-if="scope.row.isSplit === '0' "><i class="icons iconfont factory-chaifen"></i>新增</el-button>
        </template>
      </el-table-column>
    </el-table>
    <audit-log :tableData="InStockAuditlog"></audit-log>
  </div>
</template>

<script>
import {KJM_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'inStock',
  data () {
    return {
      InStock: [{
        batch: '',
        changed: '',
        changer: '',
        created: '',
        creator: '',
        delFlag: '0',
        holderId: '',
        houseNo: '',
        id: '',
        isSplit: '0',
        materialCode: '',
        materialName: '',
        orderHouseId: '',
        orderNo: '1',
        pulpWeight: '',
        remark: '',
        saltWaterWeight: '',
        sauceWeight: '',
        serialNumber: '',
        status: '',
        unit: 'L',
        wheatWeight: ''
      }],
      InStockAuditlog: [],
      InStockstatus: '',
      BrineNum: 0,
      ThreeNum: {
        allP: '',
        allM: '',
        allS: ''
      },
      params: {
        params1: '',
        params2: '',
        params3: ''
      }
    }
  },
  props: {
    isRedact: {},
    formHeader: {}
  },
  mounted () {
    // this.GetParams()
  },
  watch: {
    'BrineNum' (n, o) {
    }
  },
  methods: {
    setBrineNum (num) {
      this.BrineNum = num
    },
    GetThreeNum (formHeader) {
      this.$http(`${KJM_API.OUTINNUMLIST_API}`, 'POST', {
        orderHouseId: formHeader.id
      }).then(({data}) => {
        if (data.code === 0) {
          if (data.list.length !== 0) {
            this.ThreeNum = data.list[0]
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetParams (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'ZQ_jianglao_canshu'}).then(({data}) => {
        if (data.code === 0) {
          data.dicList.forEach((item, index) => {
            if (item.code === 'CANSHU1') {
              this.params.params1 = (item.value * 1)
            }
            if (item.code === 'CANSHU2') {
              this.params.params2 = (item.value * 1)
            }
            if (item.code === 'CANSHU3') {
              this.params.params3 = (item.value * 1)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 列表
    GetOutInStorage (formHeader) {
      this.$http(`${KJM_API.OUTINLIST_API}`, 'POST', {
        orderId: formHeader.orderId,
        orderHouseId: formHeader.id,
        orderNo: formHeader.orderNo
      }).then(({data}) => {
        if (data.code === 0) {
          this.InStock = data.list
          this.InStockAuditlog = data.vrlist
          let sub = 0
          let che = 0
          let no = 0
          let sav = 0
          this.InStock.forEach((item) => {
            // item.websign = item.saltWaterWeight
            if (item.status === 'noPass') {
              no = no + 1
            } else if (item.status === 'submit') {
              sub = sub + 1
            } else if (item.status === 'checked') {
              che = che + 1
            } else if (item.status === 'saved') {
              sav = sav + 1
            }
          })
          if (no > 0) {
            this.InStockstatus = 'noPass'
          } else if (sub > 0) {
            this.InStockstatus = 'submit'
          } else if (sav > 0) {
            this.InStockstatus = 'saved'
          } else if (che > 0) {
            this.InStockstatus = 'checked'
          }
          this.$emit('GetInStockStatus', this.InStockstatus)
          if (data.list.length === 0) {
            this.InStock = [{
              batch: '',
              changed: '',
              changer: '',
              created: '',
              creator: '',
              delFlag: '0',
              holderId: '',
              houseNo: '',
              id: '',
              isSplit: '0',
              materialCode: '',
              materialName: '',
              orderHouseId: '',
              orderNo: '1',
              pulpWeight: '',
              remark: '',
              saltWaterWeight: '',
              sauceWeight: '',
              serialNumber: '',
              status: '',
              unit: 'L',
              wheatWeight: ''
            }]
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    InStockRul () {
      let ty = true
      this.InStock.forEach((item) => {
        if (item.sauceWeight && item.batch) {} else {
          ty = false
          this.$message.error('生产入库必填项未填')
          return false
        }
        if (item.pulpWeight) {} else {
          ty = false
          this.$message.error('生产入库豆粕量未填')
          return false
        }
        if (item.wheatWeight) {} else {
          ty = false
          this.$message.error('生产入库麦粉量未填')
          return false
        }
        if (item.saltWaterWeight) {} else {
          ty = false
          this.$message.error('生产入库盐水量未填')
          return false
        }
        if (item.batch.length < 10) {
          ty = false
          this.$message.error('生产入库批次必须为10位')
          return false
        }
      })
      return ty
    },
    // 保存 or 提交
    SaveOrSubmitInStock (str, resolve, reject) {
      this.InStock.forEach((item) => {
        item.materialCode = this.formHeader.materialCode
        item.materialName = this.formHeader.materialName
        item.orderHouseId = this.formHeader.id
        item.holderName = this.formHeader.inPotName
        item.holderId = this.formHeader.inPotNo
        if (item.status) {
          if (item.status === 'saved') {
            item.status = str
          } else if (item.status === 'noPass' && str === 'submit') {
            item.status = str
          }
        } else {
          item.status = str
        }
      })
      this.$http(`${str === 'submit' ? KJM_API.OUTINSUBMIT_API : KJM_API.OUTINSAVE_API}`, 'POST', this.InStock).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          this.$message.error(data.msg)
          if (reject) {
            reject('生产入库' + data.msg)
          }
        }
      })
    },
    // 拆分
    addInStock (row, index) {
      this.InStock.splice(index + 1, 0, {
        pulpWeight: row.pulpWeight,
        wheatWeight: row.wheatWeight,
        saltWaterWeight: row.saltWaterWeight,
        materialCode: row.materialCode,
        materialName: row.materialName,
        houseNo: row.houseNo,
        unit: row.unit,
        isSplit: '1',
        delFlag: '0'
      })
    },
    // 删除
    delInStock (row) {
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
  computed: {},
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons{
  display: block;
  float: left;
  height:14px;
  width:14px;
  margin-right: 5px;
}
.reqI{
  color: red;
}
</style>
