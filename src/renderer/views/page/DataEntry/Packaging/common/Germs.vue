<template>
<div>
  <div class="clearfix topBox">
    <el-button type="primary" @click="AddGermsDate(GermsDate)" size="small" :disabled="!isRedact" style="float: right">新增</el-button>
  </div>
  <el-table ref="table1" header-row-class-name="tableHead" :data="GermsDate" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%;margin-bottom: 20px">
    <el-table-column type="index" width="55" label="序号"></el-table-column>
    <el-table-column label="白/中/夜班">
      <template slot-scope="scope">
        <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!isRedact" size="small">
          <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="清洗冲顶">
      <template slot-scope="scope">
        <el-input v-model="scope.row.washing" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="换产冲顶">
      <template slot-scope="scope">
        <el-input v-model="scope.row.changeProduct" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="开机冲顶">
      <template slot-scope="scope">
        <el-input v-model="scope.row.bootHeader" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="包材不良">
      <template slot-scope="scope">
        <el-input v-model="scope.row.badMaterial" :disabled="!isRedact" placeholder="手工录入" size="small" type="number"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="制程不良" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.badProduct" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="半成品物料不合格" width="140">
      <template slot-scope="scope">
        <el-input v-model="scope.row.badSemi" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="设备残留" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.deviceLoss" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="备注" width="120">
      <template slot-scope="scope">
        <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手工录入" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="60">
      <template slot-scope="scope">
        <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact" @click="dellistbomS(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <div><p style="line-height: 52px;font-size: 14px">待杀菌数量（L）：{{GermsNum}}</p></div>
</div>
</template>

<script>
import {PACKAGING_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'Germs',
  data () {
    return {
      GermsDate: []
    }
  },
  props: {
    isRedact: {}
  },
  mounted () {
    // this.GetProductShift()
  },
  methods: {
    // 修改待杀菌数量
    UpdateGerms (id, str, resolve) {
      if (this.GermsDate.length > 0) {
        this.GermsDate.forEach((item) => {
          item.orderId = id
        })
        this.$http(`${PACKAGING_API.PKGGERMSUPDATE_API}`, 'POST', this.GermsDate).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error('修改待杀菌数量' + data.msg)
          }
          if (resolve) {
            resolve('resolve')
          }
        })
      } else {
        if (resolve) {
          resolve('resolve')
        }
      }
    },
    // 获取包装车间待杀菌数量列表
    GetpkgGerms (id) {
      this.$http(`${PACKAGING_API.PKGGERMSLIST_API}`, 'POST', {
        order_id: id
      }).then(({data}) => {
        if (data.code === 0) {
          this.GermsDate = data.listForm
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取生产班次
    GetProductShift (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'product_shift'}).then(({data}) => {
        if (data.code === 0) {
          this.productShift = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 删除增待杀菌
    dellistbomS (row) {
      row.delFlag = '1'
    },
    // 新增待杀菌
    AddGermsDate (form) {
      form.push({
        id: '',
        washing: 0,
        changeProduct: 0,
        bootHeader: 0,
        badMaterial: 0,
        badProduct: 0,
        badSemi: 0,
        deviceLoss: 0,
        delFlag: '0'
      })
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
    GermsNum: function () {
      let num = 0
      this.GermsDate.forEach((item) => {
        num = num + (item.delFlag === '0' ? (item.washing * 1000 + item.changeProduct * 1000 + item.bootHeader * 1000 + item.badMaterial * 1000 + item.badProduct * 1000 + item.badSemi * 1000 + item.deviceLoss * 1000) : 0)
      })
      return num / 1000
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
