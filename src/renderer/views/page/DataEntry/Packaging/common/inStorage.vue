<template>
<div>
  <div class="clearfix">
    <el-button type="primary" @click="AddInDate(InDate)" size="small" :disabled="!(isRedact)" style="float: right">新增</el-button>
  </div>
  <div class="a" v-if="order.factoryCode !== '6010'">
    <div v-if="order.properties && order.properties !== '二合一&礼盒产线'">
      <el-table ref="table1" header-row-class-name="tableHead" :data="InDate" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%;margin-bottom: 20px" v-if="order.properties && order.properties !== '二合一&礼盒产线'">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="白/中/夜班" width="120">
          <template slot-scope="scope">
            <div class="required">
              <i class="reqI">*</i>
              <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">
                <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生产批次" width="150">
          <template slot-scope="scope">
            <div class="required">
              <i class="reqI">*</i>
              <el-input v-model="scope.row.batch" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" maxlength="10"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人工码垛-包材库" width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.manPacking" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.manPackingUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="自动码垛-包材库" width="140" v-if="order.workShopName === '包装三车间'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.aiPacking" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60" v-if="order.workShopName === '包装三车间'">
          <template slot-scope="scope">
            <span>{{scope.row.aiPackingUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="人工码垛-立体库" width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.manSolid" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.manSolidUnitName = ratio.productUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="自动码垛-立体库" width="120" v-if="order.workShopName === '包装三车间'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.aiSolid" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60" v-if="order.workShopName === '包装三车间'">
          <template slot-scope="scope">
            <span>{{scope.row.aiSolidUnitName = ratio.productUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="自动上架-立体库" width="140" v-if="order.workShopName !== '包装三车间'">
          <template slot-scope="scope">
            <el-input type="number" min="0" v-model="scope.row.aiShelves" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60" v-if="order.workShopName !== '包装三车间'">
          <template slot-scope="scope">
            <span>{{scope.row.aiShelvesUnitName = ratio.productUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不良品" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bad" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.badUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="样品" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sample" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.sampleUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产出数" width="120">
          <template slot-scope="scope">
            <span  v-if="order.workShopName === '包装三车间'">{{ scope.row.output = (scope.row.manPacking*1 + scope.row.aiPacking*1 + scope.row.manSolid*1*(ratio.ratio*1) + scope.row.aiSolid*1*(ratio.ratio*1) + scope.row.sample*1) }}</span>
            <span v-else>{{scope.row.ratio}}{{ scope.row.output = (scope.row.manPacking*1 + scope.row.manSolid*1*(ratio.ratio*1) + scope.row.aiShelves*1*(ratio.ratio*1) + scope.row.sample*1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.outputUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" @click="dellistbomS(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="order.properties && order.properties === '二合一&礼盒产线'">
      <el-table ref="table1" header-row-class-name="tableHead" :data="InDate" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%;margin-bottom: 20px" v-if="order.properties && order.properties === '二合一&礼盒产线'">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="白/中/夜班" width="120">
          <template slot-scope="scope">
            <div class="required">
              <i class="reqI">*</i>
              <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">
                <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生产批次" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batch" maxlength="10" placeholder="手工录入" size="small" v-if="isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked')"></el-input>
            <el-input v-model="scope.row.batch" placeholder="手工录入" size="small" v-else disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="人工码垛-立体库" width="130">
          <template slot-scope="scope">
            <el-input v-model="scope.row.manSolid" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="50">
          <template slot-scope="scope">
            <span>{{order.workShopName === '组装车间2（礼盒）'? (scope.row.manSolidUnitName = ratio.basicUnitName):(ratio.productUnitName? scope.row.manSolidUnitName = ratio.productUnitName : scope.row.manSolidUnitName = ratio.basicUnitName)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不良品" width="90">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bad" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="50">
          <template slot-scope="scope">
            <span>{{scope.row.badUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="样品" width="90">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sample" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="50">
          <template slot-scope="scope">
            <span>{{scope.row.sampleUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产出数" width="90">
          <template slot-scope="scope">{{ order.workShopName === '组装车间2（礼盒）'?(scope.row.output = (scope.row.manSolid*1 + scope.row.sample*1)):(scope.row.output = (scope.row.manSolid*1*(ratio.ratio*1) + scope.row.sample*1)) }}</template>
        </el-table-column>
        <el-table-column label="单位" width="50">
          <template slot-scope="scope">
            <span>{{scope.row.outputUnitName = ratio.basicUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="主产品批次" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mainBatch" maxlength="10" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="赠品批次" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attachBatch" maxlength="10" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" @click="dellistbomS(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="b" v-if="order.factoryCode === '6010'">
    <el-table ref="table1" header-row-class-name="tableHead" :data="InDate" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="白/中/夜班" width="120">
        <template slot-scope="scope">
          <div class="required">
            <i class="reqI">*</i>
            <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">
              <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="生产批次" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.batch" maxlength="10" placeholder="手工录入" size="small" v-if="isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked')"></el-input>
          <el-input v-model="scope.row.batch" placeholder="手工录入" size="small" v-else disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="正常品" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.aiShelves" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="90">
        <template slot-scope="scope">
          <el-select v-model="scope.row.aiShelvesUnit" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">
            <el-option :label="ratio.productUnitName" :value="ratio.productUnit" v-if="ratio.productUnit"></el-option>
            <el-option :label="ratio.basicUnitName" :value="ratio.basicUnit" v-if="ratio.basicUnit"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="供应商待买" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.manSolid" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="90">
        <template slot-scope="scope">
          <!--<el-select v-model="scope.row.manSolidUnit" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">-->
            <!--<el-option :label="ratio.productUnitName" :value="ratio.productUnit" v-if="ratio.productUnit"></el-option>-->
            <!--<el-option :label="ratio.basicUnitName" :value="ratio.basicUnit" v-if="ratio.basicUnit"></el-option>-->
          <!--</el-select>-->
          <span>{{ scope.row.manSolidUnitName = ratio.basicUnitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="需整理品" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.manPacking" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="90">
        <template slot-scope="scope">
          <!--<el-select v-model="scope.row.manPackingUnit" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">-->
            <!--<el-option :label="ratio.productUnitName" :value="ratio.productUnit" v-if="ratio.productUnit"></el-option>-->
            <!--<el-option :label="ratio.basicUnitName" :value="ratio.basicUnit" v-if="ratio.basicUnit"></el-option>-->
          <!--</el-select>-->
          <span>{{scope.row.manPackingUnitName = ratio.basicUnitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="不良品" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.bad" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="90">
        <template slot-scope="scope">
          <!--<el-select v-model="scope.row.badUnit" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">-->
            <!--<el-option :label="ratio.productUnitName" :value="ratio.productUnit" v-if="ratio.productUnit"></el-option>-->
            <!--<el-option :label="ratio.basicUnitName" :value="ratio.basicUnit" v-if="ratio.basicUnit"></el-option>-->
          <!--</el-select>-->
          <span>{{scope.row.badUnitName = ratio.basicUnitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="样品" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sample" placeholder="手工录入" size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="90">
        <template slot-scope="scope">
          <!--<el-select v-model="scope.row.sampleUnit" placeholder="请选择" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" size="small">-->
            <!--<el-option :label="ratio.productUnitName" :value="ratio.productUnit" v-if="ratio.productUnit"></el-option>-->
            <!--<el-option :label="ratio.basicUnitName" :value="ratio.basicUnit" v-if="ratio.basicUnit"></el-option>-->
          <!--</el-select>-->
          <span>{{scope.row.sampleUnitName = ratio.basicUnitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产出数" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.output = (scope.row.aiShelves*1*(scope.row.aiShelvesUnit === ratio.productUnit?ratio.ratio*1:1) + scope.row.manSolid*1*(scope.row.manSolidUnit === ratio.productUnit?ratio.ratio*1:1) + scope.row.manPacking*1*(scope.row.manPackingUnit === ratio.productUnit?ratio.ratio*1:1) + scope.row.sample*1*(scope.row.sampleUnit === ratio.productUnit?ratio.ratio*1:1)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.outputUnitName = ratio.basicUnitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" placeholder="手工录入" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle size="small" :disabled="!(isRedact && (scope.row.status !== 'submit' && scope.row.status !== 'checked'))" @click="dellistbomS(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div><p style="line-height: 52px;font-size: 14px">产出数合计：{{countOutputNum}}</p></div>
  <div v-if="order.properties !== '二合一&礼盒产线' && order.workShopName !== '包装三车间' && order.factoryCode !== '6010'">
    <div class="clearfix">
      <span style="font-size: 14px;font-weight: 700;line-height: 40px;">机维组数量确认</span>
      <el-button type="primary" size="small" @click="GetMaintain()" style="float: right">刷新</el-button>
    </div>
    <el-table
      ref="table1"
      header-row-class-name="tableHead"
      :data="InVlist"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-bottom: 20px">
      <el-table-column
        type="index"
        width="55"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="生产订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="batch"
        label="生产批次"
        width="120">
      </el-table-column>
      <el-table-column
        prop="aiShelves"
        label="自动上架数-立体库"
        width="120">
      </el-table-column>
      <el-table-column
        prop="aiShelvesUnitName"
        label="单位"
        width="60">
      </el-table-column>
      <el-table-column
        prop="jwzAcount"
        label="机维组确认数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="differentUnitName"
        label="单位"
        width="60">
      </el-table-column>
      <el-table-column
        prop="orgnDifferent"
        label="原差异数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="differentUnitName"
        label="单位"
        width="60">
      </el-table-column>
      <el-table-column
        prop="differentInfo"
        label="差异说明"
        width="120">
      </el-table-column>
      <el-table-column
        prop="jwzMan"
        label="机维组确认人">
      </el-table-column>
    </el-table>
  </div>
  <auditLog :tableData="InAudit"></auditLog>
</div>
</template>

<script>
import {PACKAGING_API, SYSTEMSETUP_API} from '@/api/api'
import {GetStatus} from '@/net/validate'
export default {
  name: 'inStorage',
  data () {
    return {
      Instatus: '',
      productShift: [],
      InDate: [],
      InVlist: [],
      InAudit: []
    }
  },
  props: {
    isRedact: {},
    order: {},
    ratio: {}
  },
  mounted () {
    // this.GetProductShift()
  },
  methods: {
    // 修改生产入库
    UpdateIn (id, str, resolve) {
      if (this.InDate.length > 0) {
        let types = ''
        if (this.order.properties === '二合一&礼盒产线') {
          types = 'twoAndOne'
        } else if (this.order.workShopName === '包装三车间') {
          types = 'isPkgThree'
        }
        this.InDate.forEach((item) => {
          item.orderId = id
          if (item.status) {
            if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
          } else {
            item.status = str
          }
          item.isPkgThree = types
          // item.badUnit = this.ratio.basicUnit
          // item.sampleUnit = this.ratio.basicUnit
          // item.outputUnit = this.ratio.basicUnit
          // item.manPackingUnit = this.ratio.basicUnit
          // item.aiPackingUnit = this.ratio.basicUnit
          // item.aiSolidUnit = this.ratio.productUnit
          // item.aiShelvesUnit = this.ratio.productUnit
          // this.order.workShopName === '组装车间2（礼盒）' ? (item.manSolidUnit = this.ratio.basicUnit) : (this.ratio.productUnit ? item.manSolidUnit = this.ratio.productUnit : item.manSolidUnit = this.ratio.basicUnit)
        })
        this.$http(`${PACKAGING_API.PKGINUPDATE_API}`, 'POST', this.InDate).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error('生产入库' + data.msg)
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
    // 入库提交
    submitIn (id, str, resolve, reject) {
      let types = ''
      if (this.order.properties === '二合一&礼盒产线') {
        types = 'twoAndOne'
      } else if (this.order.workShopName === '包装三车间') {
        types = 'isPkgThree'
      }
      this.InDate.forEach((item) => {
        item.orderId = id
        if (item.status) {
          if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
        } else {
          item.status = str
        }
        item.isPkgThree = types
      })
      this.$http(`${PACKAGING_API.PKGSAVEFORMIN_API}`, 'POST', this.InDate).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject('提交失败')
          }
          this.$message.error(data.msg)
        }
      })
    },
    // 入库校验
    inrul () {
      let ty = true
      this.instatus = 0
      let obj = {}
      this.InDate.forEach((item) => {
        if (item.delFlag !== '1') {
          item.aiShelves = item.aiShelves + ''
          if (!item.output) {
            ty = false
            this.$message.error('生产入库产出数不能为空或0')
            return false
          }
          if (!item.classType) {
            ty = false
            this.$message.error('生产入库班次不能为空')
            return false
          }
          if (item.batch) {
            if (item.batch.length !== 10) {
              ty = false
              this.$message.error('生产入库请录入10位批次号')
              return false
            }
          } else {
            ty = false
            this.$message.error('生产入库批次项未填')
            return false
          }
          if (item.aiShelves !== '' && item.aiShelves !== '0') {
            this.instatus = 1
            if (obj[item.batch]) {
              obj[item.batch] = obj[item.batch] * 1 + item.aiShelves * 1
            } else {
              obj[item.batch] = item.aiShelves * 1
            }
          }
        }
      })
      let that = this
      if (this.order.workShopName !== '包装三车间' && this.order.factoryCode !== '6010') {
        Object.keys(obj).forEach(function (key) {
          let tmp = true
          that.InVlist.forEach((item) => {
            if (item.batch === key && item.aiShelves === obj[key]) {
              tmp = false
            }
          })
          if (tmp) {
            ty = false
            that.$message.error('机维组未确认，请保存后等待机维组确认后提交')
            return false
          }
        })
      }
      return ty
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
    // 获取包装车间生产入库列表
    Getpkgin (order) {
      this.$http(`${PACKAGING_API.PKGINLIST_API}`, 'POST', {
        orderId: order.orderId,
        isPkgThree: order.properties === '二合一&礼盒产线' ? 'twoAndOne' : order.workShopName === '包装三车间' ? 'isPkgThree' : ''
      }).then(({data}) => {
        if (data.code === 0) {
          this.InDate = data.plist
          this.InVlist = data.vlist
          this.InAudit = data.vrlist
          if (this.InDate.length === 0) {
            this.AddInDate(this.InDate)
          }
          if (order.orderStatus !== '已同步') {
            if (order.orderStatus === 'checked') {
              this.Instatus = 'checked'
            } else if (order.orderStatus === 'submit') {
              this.Instatus = 'submit'
            } else if (order.orderStatus === 'saved') {
              this.Instatus = 'saved'
            }
          }
          this.Instatus = GetStatus(this.InDate)
          this.$emit('GetinstorageState', this.Instatus)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 机维组刷新
    GetMaintain () {
      this.$http(`${PACKAGING_API.PKGINLIST_API}`, 'POST', {
        orderId: this.order.orderId,
        isPkgThree: this.order.properties === '二合一&礼盒产线' ? 'twoAndOne' : this.order.workShopName === '包装三车间' ? 'isPkgThree' : ''
      }).then(({data}) => {
        if (data.code === 0) {
          this.InVlist = data.vlist
          this.$message.success('刷新成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增入库
    AddInDate (form) {
      if (this.order.factoryCode === '6010') {
        form.push({
          status: '',
          isPkgThree: '',
          orderId: '',
          classType: '',
          batch: '',
          manPacking: '',
          manPackingUnit: this.ratio.basicUnit,
          manPackingUnitName: this.ratio.basicUnitName,
          aiPacking: '',
          aiPackingUnit: this.ratio.basicUnit,
          aiPackingUnitName: this.ratio.basicUnitName,
          aiShelves: '',
          aiShelvesUnit: this.ratio.productUnit ? this.ratio.productUnit : this.ratio.basicUnit,
          aiShelvesUnitName: this.ratio.productUnitName ? this.ratio.productUnitName : this.ratio.basicUnitName,
          aiSolid: '',
          aiSolidUnit: this.ratio.basicUnit,
          aiSolidUnitName: this.ratio.basicUnitName,
          manSolid: '',
          manSolidUnit: this.ratio.basicUnit,
          manSolidUnitName: this.ratio.basicUnitName,
          bad: '',
          badUnit: this.ratio.basicUnit,
          badUnitName: this.ratio.basicUnitName,
          sample: 0,
          sampleUnit: this.ratio.basicUnit,
          sampleUnitName: this.ratio.basicUnitName,
          output: '',
          outputUnit: this.ratio.basicUnit,
          outputUnitName: this.ratio.basicUnitName,
          mainBatch: '',
          attachBatch: '',
          delFlag: '0'
        })
      } else {
        form.push({
          status: '',
          isPkgThree: '',
          orderId: '',
          classType: '',
          batch: '',
          manPacking: '',
          manPackingUnit: this.ratio.basicUnit,
          manPackingUnitName: this.ratio.basicUnitName,
          aiPacking: '',
          aiPackingUnit: this.ratio.basicUnit,
          aiPackingUnitName: this.ratio.basicUnitName,
          aiShelves: '',
          aiShelvesUnit: this.ratio.productUnit,
          aiShelvesUnitName: this.ratio.productUnitName,
          aiSolid: '',
          aiSolidUnit: this.ratio.productUnit,
          aiSolidUnitName: this.ratio.productUnitName,
          manSolid: '',
          manSolidUnit: this.order.properties && this.order.properties !== '二合一&礼盒产线' ? this.ratio.productUnit : (this.order.workShopName === '组装车间2（礼盒）' ? this.ratio.basicUnit : (this.ratio.productUnit ? this.ratio.productUnit : this.ratio.basicUnit)),
          manSolidUnitName: this.order.properties && this.order.properties !== '二合一&礼盒产线' ? this.ratio.productUnitName : (this.order.workShopName === '组装车间2（礼盒）' ? this.ratio.basicUnitName : (this.ratio.productUnitName ? this.ratio.productUnitName : this.ratio.basicUnitName)),
          bad: '',
          badUnit: this.ratio.basicUnit,
          badUnitName: this.ratio.basicUnitName,
          sample: 0,
          sampleUnit: this.ratio.basicUnit,
          sampleUnitName: this.ratio.basicUnitName,
          output: '',
          outputUnit: this.ratio.basicUnit,
          outputUnitName: this.ratio.basicUnitName,
          mainBatch: '',
          attachBatch: '',
          delFlag: '0'
        })
      }
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
    countOutputNum: function () {
      let num = 0
      this.InDate.forEach((item) => {
        num = num + (item.delFlag === '0' ? item.output : 0)
      })
      return num
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
