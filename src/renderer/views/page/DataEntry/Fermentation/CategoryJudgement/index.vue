<template>
  <div class="main">
    <el-card>
      <el-row>
        <el-col :span="23">
          <el-form :inline="true" :model="form" size="small" label-width="84px">
            <el-form-item label="生产工厂：">
              <el-select v-model="form.factory" placeholder="请选择" class="width160px">
                <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="form.workShop" placeholder="请选择" class="width160px">
                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="form.frozenStatus" class="width160px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) of statusList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发酵罐号：">
              <el-select v-model="form.holderId" filterable class="width160px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) of holderList" :key="index" :label="item.holderName" :value="item.holderId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
              <el-input v-model="form.orderNo" style="width:160px"></el-input>
            </el-form-item>
            <el-form-item label="物料：">
              <el-select v-model="form.materialCode" filterable class="width160px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) of materialList" :key="index" :value="item.materialCode" :label="item.materialCode + item.materialName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发酵天数：">
              <el-input v-model="form.ferDays" class="width160px" style="width:160px"></el-input>
            </el-form-item>
            <el-form-item label="物料类别：">
              <el-select v-model="form.halfId" filterable class="width160px">
                <el-option value=''>请选择</el-option>
                <el-option v-for="(item, index) of materialTypeList" :key="index" :value="item.id" :label="item.halfName"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="GetList()" v-if="isAuth('fer:judge:list')" size="small" style="float:right">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="tabClick" type="border-card" style="margin-top:15px">
      <el-tab-pane name="0" label="未判定">
        <el-table :data="dataList" border header-row-class-name="tableHead">
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.judge ? (scope.row.judge.frozenStatus === '0' ? '正常' : '冻结') : '正常'}}
            </template>
          </el-table-column>
          <el-table-column label="发酵罐">
            <template slot-scope="scope">
              {{scope.row.order.holderNo}}
            </template>
          </el-table-column>
          <el-table-column label="订单号" width="130">
            <template slot-scope="scope">
              {{scope.row.order.ferOrderNo}}
            </template>
          </el-table-column>
          <el-table-column label="物料" width="230">
            <template slot-scope="scope">
              {{scope.row.order.ferMaterialCode}}{{scope.row.order.ferMaterialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单数量">
            <template slot-scope="scope">
              {{scope.row.order.ferAmount}}
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template slot-scope="scope">
              {{scope.row.order.ferUnit}}
            </template>
          </el-table-column>
          <el-table-column label="满灌日期" width="180">
            <template slot-scope="scope">
              {{scope.row.order.fullDate}}
            </template>
          </el-table-column>
          <el-table-column label="发酵天数">
            <template slot-scope="scope">
              {{scope.row.order.ferDays}}
            </template>
          </el-table-column>
          <el-table-column label="物料类别"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="JudgeDo(scope.row)" :disabled="!isAuth('fer:judge:judge')">判定</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.totalCount">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane name="1" label="已判定">
        <el-table :data="dataList" border header-row-class-name="tableHead">
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!-- {{scope.row.judge}} -->
              {{scope.row.judge ? (scope.row.judge.frozenStatus === '0' ? '正常' : '冻结') : ''}}
            </template>
          </el-table-column>
          <el-table-column label="发酵罐">
            <template slot-scope="scope">
              {{scope.row.order.holderNo}}
            </template>
          </el-table-column>
          <el-table-column label="订单号" width="130">
            <template slot-scope="scope">
              {{scope.row.order.ferOrderNo}}
            </template>
          </el-table-column>
          <el-table-column label="物料" width="230">
            <template slot-scope="scope">
              {{scope.row.order.ferMaterialCode}}{{scope.row.order.ferMaterialName}}
            </template>
          </el-table-column>
          <el-table-column label="订单数量">
            <template slot-scope="scope">
              {{scope.row.order.ferAmount}}
            </template>
          </el-table-column>
          <el-table-column label="满灌日期" width="180">
            <template slot-scope="scope">
              {{scope.row.order.fullDate}}
            </template>
          </el-table-column>
          <el-table-column label="发酵天数">
            <template slot-scope="scope">
              {{scope.row.order.ferDays}}
            </template>
          </el-table-column>
          <el-table-column label="物料类别">
            <template slot-scope="scope">
              {{scope.row.judge ? scope.row.judge.halfName : ''}}
            </template>
          </el-table-column>
          <el-table-column label="判定人员" width="150">
            <template slot-scope="scope">
              {{scope.row.judge ? scope.row.judge.creator : ''}}
            </template>
          </el-table-column>
          <el-table-column label="判定时间" width="180">
            <template slot-scope="scope">
              {{scope.row.judge ? scope.row.judge.created : ''}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="JudgeDo(scope.row)" :disabled="!isAuth('fer:judge:judge')">调整</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.totalCount">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" width="400px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">{{this.judge.holderNo}} 类别判定</div>
      <el-form :model="judge" size="small" label-width="130px" :rules="judgerules" ref="judge">
        <el-form-item label="订单编号：">{{this.judge.ferOrderNo}}</el-form-item>
        <el-form-item label="物料：">{{this.judge.ferMaterialCode}}{{this.judge.ferMaterialName}}</el-form-item>
        <el-form-item label="发酵天数：">{{this.judge.ferDays}} 天</el-form-item>
        <el-form-item label="半成品类别：">
          <el-select v-model="judge.halfId" filterable class="selectwidth">
            <el-option v-for="(item, index) of materialTypeList" :key="index" :value="item.id" :label="item.halfName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio v-model="judge.frozenStatus" label="0">正常</el-radio>
          <el-radio v-model="judge.frozenStatus" label="1">冻结</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveJudge('judge')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from '@/net/validate'
import { BASICDATA_API, FERMENTATION_API } from '@/api/api'
export default {
  name: 'CategroyJudgement',
  data () {
    return {
      dialogVisible: false,
      radio: '1',
      form: JSON.parse(JSON.stringify(this.$store.state.common.Fermentation.category)),
      factory: '',
      workshop: '',
      statusList: [{
        name: '正常',
        value: 0
      }, {
        name: '冻结',
        value: 1
      }],
      dataList: [],
      activeName: '0',
      judge: {
        frozenStatus: '0',
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
      },
      materialList: [],
      materialTypeList: [],
      materialTypeListTan: [],
      holderList: [],
      judgerules: {
        halfId: [
          {required: true, message: '请选择判定类别', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.GetFactoryList()
    this.GetWorkshopList(this.form.factory)
    this.GetHolderList()
    this.GetMaterialType(this.form.factory)
    this.GetMaterialTypeList(this.form.factory)
    if (this.form.factory) {
      this.GetList()
    }
  },
  watch: {
    'form.factory' (n, o) {
      this.GetWorkshopList(n)
      this.GetHolderList(n)
      this.GetMaterialType(n)
      this.GetMaterialTypeList(n)
    },
    'form.workShop' (n, o) {
      this.GetHolderList(n)
    }
  },
  methods: {
    // 获取工厂
    GetFactoryList () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    GetWorkshopList (id) {
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '发酵'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.workshop = data.typeList
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 罐
    GetHolderList (id) {
      this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENT_API}`, 'POST', {factory: this.form.factory, deptId: this.form.workShop}).then(({data}) => {
        if (data.code === 0) {
          this.holderList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 物料
    GetMaterialType (id) {
      this.$http(`${BASICDATA_API.BASEMATERIALIST_API}`, 'POST', {factory: id}).then(({data}) => {
        if (data.code === 0) {
          this.materialList = data.materialList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 物料类别
    GetMaterialTypeList (id) {
      this.$http(`${BASICDATA_API.CATEGORY_SORTLIST}`, 'POST', {factory: id}).then(({data}) => {
        if (data.code === 0) {
          this.materialTypeList = data.ferList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 弹框物料类别
    GetMaterialTypeListTan () {
      this.$http(`${BASICDATA_API.CATEGORY_SORTLIST}`, 'POST', {factory: this.form.factory, materialCode: this.judge.ferMaterialCode}).then(({data}) => {
        if (data.code === 0) {
          this.materialTypeList = data.ferList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    GetList () {
      this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENTLIST_API}`, 'POST', this.form).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.data.list
          this.form.totalCount = data.data.totalCount
          // console.log(this.dataList)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.form.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.form.currPage = val
      this.GetList()
    },
    tabClick (value) {
      this.form.isJudged = value.name
      this.form.currPage = 1
      this.GetList()
    },
    // 判定
    JudgeDo (row) {
      this.dialogVisible = true
      this.judge = {
        factory: this.form.factory,
        workShop: this.form.workShop,
        frozenStatus: row.judge ? row.judge.frozenStatus : '0',
        orderId: row.order.id,
        orderNo: row.order.ferOrderNo,
        ferOrderNo: row.order.ferOrderNo,
        ferMaterialCode: row.order.ferMaterialCode,
        ferMaterialName: row.order.ferMaterialName,
        ferDays: row.order.ferDays,
        holderNo: row.order.holderNo,
        halfId: row.judge ? row.judge.halfId : ''
      }
      this.GetMaterialTypeListTan()
    },
    SaveJudge (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENTTODO_API}`, 'POST', this.judge).then(({data}) => {
            if (data.code === 0) {
              this.GetList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.width160px{width:160px;}
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
