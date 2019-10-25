<template>
<el-col v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
  <!--<div class="topTitle">-->
    <!--<el-breadcrumb separator="/">-->
      <!--<el-breadcrumb-item>数据录入</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>立体库</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
  <!--</div>-->
  <div class="main">
    <el-card class="searchCard" style="margin: 0">
      <el-row type="flex">
        <el-col>
          <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="85px" @keyup.enter.native="GetLtkList(true)" @submit.native.prevent>
            <el-form-item label="工厂：">
              <el-select v-model="plantList.factory" placeholder="请选择" style="width: 160px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车间：">
              <el-select v-model="plantList.workshop" placeholder="请选择" style="width: 160px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产线：">
              <el-select v-model="plantList.productline" placeholder="产线" style="width: 160px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单状态：">
              <el-select v-model="plantList.status" placeholder="请选择" style="width: 160px">
                <el-option label="请选择"  value=""></el-option>
                <el-option label="未审核"  value="submit"></el-option>
                <el-option label="审核通过"  value="checked"></el-option>
                <el-option label="审核不通过"  value="noPass"></el-option>
                <el-option label="接口失败"  value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单号：">
              <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 160px"></el-input>
            </el-form-item>
            <el-form-item label="日期：">
              <el-date-picker type="date" placeholder="选择" v-model="plantList.productdate" value-format="yyyy-MM-dd" style="width: 160px"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-left: 85px;">
              <el-button type="primary" size="small" @click="GetLtkList(true)">查询</el-button>
              <el-button type="primary" size="small" @click="doPrint">导出</el-button>
              <el-button type="primary" size="small" @click="subAutio()" v-if="isAuth('sys:verifyLTK:auditing')">审核通过</el-button>
              <el-button type="danger" size="small" @click="repulseAutios()" v-if="isAuth('sys:verifyLTK:auditing')">审核不通过</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
  </div>
  <div class="main" style="padding-top: 0px">
    <el-card class="tableCard">
      <div class="toggleSearchTop">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <div>
      <el-table
        ref="table1"
        header-row-class-name="tableHead"
        :data="LtkList"
        @selection-change="handleSelectionChange"
        border
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 20px">
        <el-table-column
          type="selection"
          :selectable='checkboxT'
          width="34">
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="100">
          <template slot-scope="scope">
            {{scope.row.status === 'submit'? '未审核': scope.row.status === 'checked'? '审核通过' : scope.row.status === 'noPass'? '审核不通过':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productDate"
          label="生产日期"
          :show-overflow-tooltip="true"
          width="120">
        </el-table-column>
        <el-table-column
          label="生产订单号"
          width="120">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="品项"
          :show-overflow-tooltip="true"
          width="360">
          <template slot-scope="scope">
            <span>{{ scope.row.materialCode + ' ' + scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="batch"
          label="生产批次"
          width="105">
        </el-table-column>
        <el-table-column
          prop="input"
          label="订单入库量"
          width="91">
        </el-table-column>
        <el-table-column
          prop="aiShelves"
          label="正常品入库数"
          width="140" v-if="deptCode === '6010'">
        </el-table-column>
        <el-table-column
          prop="manSolid"
          label="供应商待买数"
          width="140" v-if="deptCode === '6010'">
        </el-table-column>
        <el-table-column
          prop="manSolid"
          label="人工码垛数-立体库"
          width="140" v-if="deptCode !== '6010'">
        </el-table-column>
        <el-table-column
          prop="aiShelves"
          label="自动上架-立体库"
          width="140" v-if="deptCode !== '6010'">
        </el-table-column>
        <el-table-column
          prop="aiSolid"
          label="自动码垛-立体库"
          width="140" v-if="deptCode !== '6010'">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="单位"
          :show-overflow-tooltip="true"
          width="50">
        </el-table-column>
        <el-table-column
          prop="workShopMan"
          label="车间确认人"
          :show-overflow-tooltip="true"
          width="92">
        </el-table-column>
        <el-table-column
          prop="ltkMan"
          label="立体库确认人"
          :show-overflow-tooltip="true"
          width="105">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="审核意见"
          :show-overflow-tooltip="true"
          width="78">
        </el-table-column>
        <el-table-column
          prop="verifyDate"
          label="审核时间"
          width="220">
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="75">
          <template slot-scope="scope">
            <el-button type="warning" round size="mini" @click="ResetD(scope.row)" v-if="scope.row.status === 'checked'">反审</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <el-row >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="plantList.currPage"
          :page-sizes="[10, 15, 20]"
          :page-size="plantList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="plantList.totalCount">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
  <el-dialog
    title="审核拒绝"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <p style="line-height: 42px">请填写不通过原因</p>
    <el-input type="textarea" v-model="Text" :rows="6" class="textarea" style="width: 100%;height: 200px"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="repulseAutio()">确定</el-button>
      </span>
  </el-dialog>
  <el-dialog
    title="反审"
    :close-on-click-modal="false"
    :visible.sync="visibleRe">
    <p style="line-height: 42px">请填写反审意见</p>
    <el-input type="textarea" v-model="ReText" :rows="6" class="textarea" style="width: 100%;height: 200px"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleRe = false">取消</el-button>
      <el-button type="primary" @click="ResetSt()">确定</el-button>
    </span>
  </el-dialog>
</el-col>
</template>

<script>
import {BASICDATA_API, LTK_API, REP_API} from '@/api/api'
import { exportFile, headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      pdf: '',
      lodingS: false,
      visible: false,
      visible1: false,
      visibleRe: false,
      ReText: '',
      reData: {},
      factory: [],
      workshop: [],
      productline: [],
      Text: '',
      plantList: {
        orderNo: '',
        factory: '',
        workshop: '',
        productline: '',
        productdate: '',
        status: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      multipleSelection: [],
      LtkList: [],
      deptCode: ''
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'plantList.workshop' (n, o) {
      if (n) {
        this.GetParentline(n)
      }
    }
  },
  mounted () {
    // this.GetLtkList()
    this.Getdeptcode()
    headanimation(this.$)
  },
  methods: {
    // 打印
    doPrint () {
      let that = this
      exportFile(`${REP_API.REPOUT_API}`, '立体库审核数据导出', that)
    },
    // 获取列表
    GetLtkList (st) {
      if (!this.plantList.factory) {
        this.$message.error('请选择工厂')
        return
      }
      this.deptCode = (this.factory.filter(item => item.deptId === this.plantList.factory))[0].deptCode
      this.lodingS = true
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${LTK_API.LTKLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.LtkList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.lodingS = false
      })
    },
    // 反审
    ResetD (row) {
      this.visibleRe = true
      this.reData = row
    },
    ResetSt () {
      this.$confirm('反审后需要重新审核，确认要反审？', '反审', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reData.status = 'submit'
        this.reData.memo = this.ReText
        this.lodingS = true
        this.$http(`${LTK_API.LTK_RESET_API}`, 'POST', this.reData).then(({data}) => {
          this.lodingS = false
          if (data.code === 0) {
            this.visibleRe = false
            this.ReText = ''
            this.reData = {}
            this.GetLtkList()
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.$message.error('网络错误')
          this.lodingS = false
        })
      })
    },
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.plantList.workshop = ''
      this.plantList.productline = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '包装 组装'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取产线
    GetParentline (id) {
      this.plantList.productline = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item)
      })
    },
    // 审核通过禁用
    checkboxT (row) {
      if (row.status === 'checked' || row.status === 'noPass') {
        return 0
      } else {
        return 1
      }
    },
    // 审核拒绝
    repulseAutios () {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择订单')
      } else {
        this.visible = true
      }
    },
    repulseAutio () {
      if (this.Text.length <= 0) {
        this.$message.error('请填写不通过原因')
      } else {
        this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelection.forEach((item) => {
            item.status = 'noPass'
            item.memo = this.Text
          })
          this.$http(`${LTK_API.LTKAUDIT_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.visible = false
              this.$message.success('操作成功')
              this.GetLtkList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
    // 审核通过
    subAutio () {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择订单')
      } else {
        this.$confirm('确认审核通过, 是否继续?', '审核通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelection.forEach((item) => {
            item.status = 'checked'
            item.memo = '审核通过'
          })
          this.$http(`${LTK_API.LTKAUDIT_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.GetLtkList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetLtkList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetLtkList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
<style lang="scss">
  #printMain{
    width: 297mm;
    height: 210mm;
    td,th,tr{
      font-size: 12px;
      text-align: center!important;
    }
    table{
      td{
        padding: 2px 5px;
      }
    }
  }
  .searchCard { margin-bottom: 0; }
  .searchCard, .tableCard {
    position: relative;
    .toggleSearchTop {
      width: 100%; position: absolute; top: 0; left: 0; text-align: center; cursor: pointer; display: none;
    }
    .toggleSearchBottom {
      width: 100%; position: absolute; bottom: 0; left: 0; text-align: center; cursor: pointer;
    }
    .el-icon-caret-top:before,
    .el-icon-caret-bottom:before {
      color: #dcdfe6;
    }
  }

  .topforms{
    .el-date-editor.el-input{
      width: auto;
    }
    input{
      width: 240px!important;
    }
  }
</style>
