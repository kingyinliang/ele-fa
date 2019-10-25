<template>
  <el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
    <el-col v-loading.fullscreen.lock="lodingStatus1" element-loading-text="加载中">
      <div class="main">
        <el-card class="searchCard">
          <el-row type="flex">
            <el-col>
              <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="85px" class="topforms" @keyup.enter.native="GetAuditList()" @submit.native.prevent>
                <el-form-item label="工厂：">
                  <el-select v-model="plantList.factory" placeholder="请选择">
                    <el-option label="请选择"  value=""></el-option>
                    <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车间：">
                  <el-select v-model="plantList.workShop" placeholder="请选择">
                    <el-option label="请选择"  value=""></el-option>
                    <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="产线：">
                  <el-select v-model="plantList.productLine" placeholder="产线">
                    <el-option label="请选择"  value=""></el-option>
                    <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单号：">
                  <el-input v-model="plantList.orderNo" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="plantList.productDate"></el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left: 67px;">
                  <el-button type="primary" size="small" @click="GetAuditList(true)" v-if="isAuth('verify:time:list')">查询</el-button>
                  <el-button type="primary" size="small" @click="subAutio" v-if="isAuth('verify:time:update')">审核通过</el-button>
                  <el-button type="danger" size="small" @click="repulseAutios" v-if="isAuth('verify:time:update')">审核不通过</el-button>
                </el-form-item>
                <el-row>
                  <el-form-item label="记账日期：">
                    <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="plantList.postgDate"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="订单状态：">
                    <el-select v-model="plantList.status" placeholder="请选择">
                      <el-option label="请选择"  value=""></el-option>
                      <el-option label="未审核"  value="submit"></el-option>
                      <el-option label="审核通过"  value="checked"></el-option>
                      <el-option label="审核不通过"  value="noPass"></el-option>
                      <el-option label="接口失败"  value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
          <div class="toggleSearchBottom">
              <i class="el-icon-caret-top"></i>
          </div>
        </el-card>
      </div>
      <div class="main" style="padding-top: 0">
        <el-card class="tableCard">
          <div class="toggleSearchTop">
              <i class="el-icon-caret-bottom"></i>
          </div>
          <el-table
            ref="table1"
            v-loading="dataListLoading"
            header-row-class-name="tableHead"
            :data="AuditList"
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
                {{scope.row.status === 'submit'? '未审核': scope.row.status === 'checked'? (scope.row.interfaceReturnStatus === '0'? '接口失败': '审核通过'): scope.row.status === 'noPass'? '审核不通过':''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="productDate"
              label="生产日期"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="orderNo"
              label="生产订单号"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              label="生产物料"
              :show-overflow-tooltip="true"
              width="360">
              <template slot-scope="scope">
                {{ scope.row.materialCode + ' ' + scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="planOutput"
              label="计划生产数量"
              width="105">
            </el-table-column>
            <el-table-column
              prop="outputUnitName"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="yield"
              label="实际生产数量"
              width="105">
            </el-table-column>
            <el-table-column
              prop="confQuanUnitName"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="confActivity1"
              label="准备工时"
              width="78">
            </el-table-column>
            <el-table-column
              prop="confActiUnit1"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="confActivity2"
              label="机器工时"
              width="78">
            </el-table-column>
            <el-table-column
              prop="confActiUnit2"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="confActivity3"
              label="人工工时"
              width="78">
            </el-table-column>
            <el-table-column
              prop="confActiUnit3"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="interfaceReturn"
              label="接口回写"
              :show-overflow-tooltip="true"
              width="150">
            </el-table-column>
            <el-table-column
              label="执行开始的确认日期"
              width="148">
              <template slot-scope="scope">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" v-model="scope.row.execStartDate" v-if="scope.row.redact" size="small"></el-date-picker>
                <span v-else>{{ scope.row.execStartDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="设置完成的确认日期"
              width="148">
              <template slot-scope="scope">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  placeholder="选择" v-model="scope.row.setupFinDate" v-if="scope.row.redact" size="small"></el-date-picker>
                <span v-else>{{ scope.row.setupFinDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作活动编号"
              :show-overflow-tooltip="true"
              width="105">
              <template slot-scope="scope">
                <el-input v-model="scope.row.operation" v-if="scope.row.redact" placeholder="手工录入" size="small"></el-input>
                <span v-else>{{ scope.row.operation }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="部分/最后确认"
              :show-overflow-tooltip="true"
              width="112">
              <template slot-scope="scope">
                <el-input v-model="scope.row.finConf" v-if="scope.row.redact" placeholder="手工录入" size="small"></el-input>
                <span v-else>{{ scope.row.finConf }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="memo"
              label="审核意见"
              :show-overflow-tooltip="true"
              width="150">
            </el-table-column>
            <el-table-column
              prop="verifyMan"
              label="审核人"
              width="150">
            </el-table-column>
            <el-table-column
              prop="verifyDate"
              label="审核时间"
              width="160">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="75">
              <template slot-scope="scope">
                <el-button type="primary" round size="mini" @click="redact(scope.row)" v-if="!((scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass') && isAuth('verify:time:update')">{{ scope.row.redact? '保存' : '编辑'}}</el-button>
                <el-button type="warning" round size="mini" @click="ResetD(scope.row)" v-if="scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1' && isAuth('verify:time:resetTime')">反审</el-button>
              </template>
            </el-table-column>
          </el-table>
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
          <el-button type="primary" @click="ResetTime()">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="类型选择"
        :close-on-click-modal="false"
        :visible.sync="visibleSterilized">
        <el-radio v-model="backType" label="0">人工工时退回</el-radio>
        <el-radio v-model="backType" label="1">机器工时退回</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visibleSterilized = false">取消</el-button>
          <el-button type="primary" @click="repulseAutioSterilized()">确定</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-col>
</template>

<script>
import {BASICDATA_API, AUDIT_API} from '@/api/api'
import { headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      lodingStatus1: false,
      dataListLoading: false,
      visible: false,
      visibleRe: false,
      visibleSterilized: false,
      backType: '0',
      factory: [],
      workshop: [],
      productline: [],
      Text: '',
      ReText: '',
      reData: {},
      plantList: {
        orderNo: '',
        factory: '',
        workShop: '',
        productLine: '',
        productDate: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + ((new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1) >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : ('0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate())),
        postgDate: new Date().getFullYear().toString() + '-' + ((new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : ('0' + new Date().getDate())),
        status: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      AuditList: [],
      multipleSelection: []
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'plantList.workShop' (n, o) {
      this.GetParentline(n)
    }
  },
  mounted () {
    this.Getdeptcode()
    headanimation(this.$)
  },
  methods: {
    // 获取列表
    GetAuditList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.dataListLoading = true
      this.$http(`${AUDIT_API.AUDITHOURSLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.AuditList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      })
    },
    // exportTable () {
    //   require.ensure([], () => {
    //     const tHeader = ['供应商编号', '供应商名称', '输入代码', '税务代码']
    //     const filterVal = ['num', 'name', 'words', 'shuiwu_num']
    //     const list = this.tableData
    //     const data = this.formatJson(filterVal, list)
    //     export_json_to_excel(tHeader, data, '供应商名称列表')
    //   })
    // },
    // formatJson (filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]))
    // },
    // 反审
    ResetD (row) {
      this.visibleRe = true
      this.reData = row
    },
    ResetTime () {
      this.$confirm('数据已调用SAP接口已报工，请确认SAP冲销，确认要反审？', '反审', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reData.status = 'submit'
        this.reData.memo = this.ReText
        this.lodingStatus1 = true
        this.$http(`${AUDIT_API.AUDIT_HOURS_RESET_API}`, 'POST', this.reData).then(({data}) => {
          this.lodingStatus1 = false
          if (data.code === 0) {
            this.visibleRe = false
            this.ReText = ''
            this.this.reData = {}
            this.GetAuditList()
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.$message.error('网络错误')
          this.lodingStatus1 = false
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
      this.plantList.workShop = ''
      this.plantList.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    // 获取产线
    GetParentline (id) {
      this.plantList.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.productline = []
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
      if ((row.status === 'checked' && row.interfaceReturnStatus === '1') || row.status === 'noPass') {
        return 0
      } else {
        return 1
      }
    },
    // 编辑
    redact (row) {
      if (!row.redact) {
        row.redact = true
        this.AuditList.splice(this.AuditList.length, 0, {})
        this.AuditList.splice(this.AuditList.length - 1, 1)
      } else {
        row.postgDate = this.plantList.postgDate
        row.status = ''
        this.lodingStatus1 = true
        this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', [row]).then(({data}) => {
          this.lodingStatus1 = false
          if (data.code === 0) {
            this.$message.success('操作成功')
            row.redact = false
            this.AuditList.splice(this.AuditList.length, 0, {})
            this.AuditList.splice(this.AuditList.length - 1, 1)
          } else {
            this.$message.error(data.msg)
          }
          this.GetAuditList()
        }).catch(() => {
          this.$message.error('网络错误')
          this.lodingStatus1 = false
        })
      }
    },
    // 序号
    indexMethod (index) {
      return index + 1 + (this.plantList.currPage * 1 - 1) * (this.plantList.pageSize * 1)
    },
    // 审核拒绝
    repulseAutios () {
      if (this.plantList.factory === '') {
        this.$message.error('请选择工厂')
        return false
      }
      if (this.plantList.workShop === '') {
        this.$message.error('请选择车间')
        return false
      }
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择订单')
        return false
      }
      if (this.workshop.find(item => item.deptId === this.plantList.workShop).deptName.indexOf('杀菌') === 0) {
        this.visibleSterilized = true
      } else {
        this.visible = true
      }
      // if (this.multipleSelection.length <= 0) {
      //   this.$message.error('请选择订单')
      // } else {
      //   this.visible = true
      // }
    },
    repulseAutioSterilized () {
      this.visible = true
      this.visibleSterilized = false
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
            item.postgDate = this.plantList.postgDate
            item.backType = this.backType
          })
          this.lodingStatus1 = true
          this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', this.multipleSelection).then(({data}) => {
            this.lodingStatus1 = false
            if (data.code === 0) {
              this.visible = false
              this.Text = ''
              this.GetAuditList()
              this.$message.success('操作成功')
            } else {
              this.$message.error(data.msg)
            }
          }).catch(() => {
            this.$message.error('网络错误')
            this.lodingStatus1 = false
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
            item.postgDate = this.plantList.postgDate
          })
          this.lodingStatus1 = true
          this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', this.multipleSelection).then(({data}) => {
            this.lodingStatus1 = false
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.GetAuditList()
              if (data) {}
            } else {
              this.GetAuditList()
              this.$message.error(data.msg)
            }
          }).catch(() => {
            this.$message.error('网络错误')
            this.lodingStatus1 = false
          })
        })
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetAuditList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetAuditList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss">
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
