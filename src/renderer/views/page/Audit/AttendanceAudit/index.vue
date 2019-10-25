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
                <el-form-item label="日期：">
                  <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="plantList.setDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="考勤类型：">
                  <el-select v-model="plantList.kqlx" placeholder="请选择" size="small">
                    <el-option label="请选择"  value=""></el-option>
                    <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in ARtype" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="人员：">
                  <el-input v-model="plantList.userId" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="审核状态：">
                  <el-select v-model="plantList.status" placeholder="请选择">
                    <el-option label="请选择"  value=""></el-option>
                    <el-option label="未审核"  value="submit"></el-option>
                    <el-option label="审核通过"  value="checked"></el-option>
                    <el-option label="审核不通过"  value="noPass"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 67px;">
                  <el-button type="primary" size="small" @click="GetAuditList(true)" v-if="isAuth('sys:att:listAtt')">查询</el-button>
                  <el-button type="primary" size="small" @click="subAutio" v-if="isAuth('sys:att:auditAtt')">审核通过</el-button>
                  <el-button type="danger" size="small" @click="repulseAutios" v-if="isAuth('sys:att:auditAtt')">审核不通过</el-button>
                </el-form-item>
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
                {{scope.row.status === 'submit'? '未审核': scope.row.status === 'checked'? '审核通过': scope.row.status === 'noPass'? '审核不通过':''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="reqno"
              label="订单号"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="kqrq"
              label="日期"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="workShopName"
              label="车间"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="kqdlName"
              label="考勤大类"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="kqlxName"
              label="考勤类型"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="productLineName"
              label="产线"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="deptIdName"
              label="班组"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="userType"
              label="人员属性"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="userId"
              label="姓名（工号）"
              :show-overflow-tooltip="true"
              width="160">
            </el-table-column>
            <el-table-column
              prop="classTypeName"
              label="白/中/夜班"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="content"
              label="工作内容"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="timedTime"
              label="计时时数（小时）"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="pieceTime"
              label="计件时数（小时）"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="workTime"
              label="出勤时数（小时）"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="考勤备注"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <el-table-column
              prop="memo"
              label="审核意见"
              :show-overflow-tooltip="true"
              width="80">
            </el-table-column>
            <!--<el-table-column-->
              <!--fixed="right"-->
              <!--label="操作"-->
              <!--width="65">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button style="padding: 0;" type="text" size="small" @click="redact(scope.row)" v-if="!(scope.row.status === 'checked' || scope.row.status === 'noPass') && isAuth('verify:material:update')">{{ scope.row.redact? '保存' : '编辑'}}</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
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
    </el-col>
  </el-col>
</template>

<script>
import {BASICDATA_API, AUDIT_API, SYSTEMSETUP_API, AR_API} from '@/api/api'
import { headanimation } from '@/net/validate'
// import { export_json_to_excel } from '@/vendor/Export2Excel'
export default {
  name: 'index',
  data () {
    return {
      lodingStatus1: false,
      dataListLoading: false,
      visible: false,
      factory: [],
      workshop: [],
      productline: [],
      ARtype: [],
      Text: '',
      plantList: {
        isAudit: '1',
        orderNo: '',
        factory: '',
        workShop: '',
        productLine: '',
        setDate: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + ((new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1) >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : ('0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate())),
        kqlx: '',
        userId: '',
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
      this.GetARtype(n)
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
    // 获取考勤类型
    GetARtype (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'other_time'}).then(({data}) => {
        if (data.code === 0) {
          this.ARtype = data.dicList
          this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'normal_time'}).then(({data}) => {
            if (data.code === 0) {
              this.ARtype = this.ARtype.concat(data.dicList)
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取列表
    GetAuditList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.dataListLoading = true
      this.$http(`${AR_API.ARLIST_API}`, 'POST', this.plantList).then(({data}) => {
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
      if (row.status === 'checked' || row.status === 'noPass') {
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
        })
      }
    },
    // 序号
    indexMethod (index) {
      return index + 1 + (this.plantList.currPage * 1 - 1) * (this.plantList.pageSize * 1)
    },
    // 审核拒绝
    repulseAutios () {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择考勤')
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
          this.lodingStatus1 = true
          this.$http(`${AR_API.ARAUDIT_API}`, 'POST', this.multipleSelection).then(({data}) => {
            this.lodingStatus1 = false
            if (data.code === 0) {
              this.visible = false
              this.Text = ''
              this.GetAuditList()
              this.$message.success('操作成功')
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
          this.lodingStatus1 = true
          this.$http(`${AR_API.ARAUDIT_API}`, 'POST', this.multipleSelection).then(({data}) => {
            this.lodingStatus1 = false
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.GetAuditList()
              if (data) {}
            } else {
              this.GetAuditList()
              this.$message.error(data.msg)
            }
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
