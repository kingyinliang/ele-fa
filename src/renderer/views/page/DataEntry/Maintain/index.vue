<template>
<el-col v-loading.fullscreen.lock="lodingStatus" element-loading-text="加载中">
  <!--<div class="topTitle">-->
    <!--<el-breadcrumb separator="/">-->
      <!--<el-breadcrumb-item>数据录入</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>机维组</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
  <!--</div>-->
  <div class="main">
    <el-card class="searchCard">
      <el-row type="flex">
        <el-col>
        <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="maintain">
          <el-form-item label="工厂：">
            <el-select v-model="plantList.factory" placeholder="请选择">
              <el-option label="请选择"  value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车间：">
            <el-select v-model="plantList.workshop" placeholder="请选择">
              <el-option label="请选择"  value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产线：">
            <el-select v-model="plantList.productline" placeholder="产线">
              <el-option label="请选择"  value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input v-model="plantList.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker type="date" placeholder="选择" v-model="plantList.productdate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-form>
        </el-col>
        <el-col style="width: 260px">
          <el-row>
            <el-button type="primary" size="small" @click="GetMaintainList(true)">查询</el-button>
            <el-button type="primary" size="small" @click="save()" v-if="isAuth('sys:verifyJWZ:update')">保存</el-button>
            <el-button type="primary" size="small" @click="submit()" v-if="isAuth('sys:verifyJWZ:finished')">提交</el-button>
          </el-row>
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
        ref="maintain"
        header-row-class-name="tableHead"
        :data="noMaintainList"
        border
        @selection-change="handleSelectionChange"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 20px">
        <el-table-column
          type="selection"
          :selectable='checkboxT'
          width="34">
        </el-table-column>
        <el-table-column
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          label="生产订单号"
          :show-overflow-tooltip="true"
          width="120">
        </el-table-column>
        <el-table-column
          label="品项"
          :show-overflow-tooltip="true"
          width="360">
          <template slot-scope="scope">
            {{scope.row.materialCode + ' ' + scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="batch"
          label="生产批次"
          width="105">
        </el-table-column>
        <el-table-column
          prop="aiShelves"
          label="自动上架数-立体库"
           width="140">
        </el-table-column>
        <el-table-column
          prop="aiShelvesUnitName"
          label="单位"
          width="50">
        </el-table-column>
        <el-table-column
          label="车间确认人"
          :show-overflow-tooltip="true"
          width="92">
          <template slot-scope="scope">{{ scope.row.workShopMan }}</template>
        </el-table-column>
        <el-table-column
          label="机维组确认整板数"
          width="135">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jwzZb" v-if="scope.row.redact"></el-input>
            <span v-if="!scope.row.redact">{{ scope.row.jwzZb }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="机维组确认半板数"
          width="135">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jwzBb" v-if="scope.row.redact"></el-input>
            <span v-if="!scope.row.redact">{{ scope.row.jwzBb }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="机维组确认数"
          width="107">
          <template slot-scope="scope">
            <span>{{ scope.row.jwzAcount = scope.row.jwzBb*1 + scope.row.jwzZb*1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="差异数量"
          width="78">
          <template slot-scope="scope">
            <span>{{ scope.row.different = scope.row.jwzAcount*1 - scope.row.aiShelves*1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位"
          width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.differentUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="原差异数量"
          width="92">
          <template slot-scope="scope">
            <el-input v-model="scope.row.orgnDifferent" v-if="scope.row.redact"></el-input>
            <span v-else>{{ scope.row.orgnDifferent }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="差异说明"
          :show-overflow-tooltip="true"
          width="78">
          <template slot-scope="scope">
            <el-input v-model="scope.row.differentInfo" v-if="scope.row.redact"></el-input>
            <span v-else>{{ scope.row.differentInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="jwzMan"
          label="机维组确认人"
          width="107">
        </el-table-column>
        <el-table-column
          label="备注"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="address"
          label="操作"
          width="50">
          <template slot-scope="scope">
            <el-button style="padding: 0;" type="text" size="small" @click="redact(scope.row)" v-if="isAuth('sys:verifyJWZ:update') && scope.row.status !== 'finished' && scope.row.aiShelves !== 0">{{ scope.row.redact? '保存' : '编辑'}}</el-button>
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
</el-col>
</template>

<script>
import {BASICDATA_API, MAINTAIN_API} from '@/api/api'
import { headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      factory: [],
      workshop: [],
      productline: [],
      plantList: {
        status: 'checked',
        orderNo: '',
        factory: '',
        workshop: '',
        productline: '',
        productdate: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      MaintainList: [],
      noMaintainList: []
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
    // this.GetMaintainList()
    this.Getdeptcode()
    headanimation(this.$)
  },
  methods: {
    // 获取列表
    GetMaintainList (st) {
      if (st) {
        this.plantList.currPage = 1
      }
      this.$http(`${MAINTAIN_API.MAINTAINLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.noMaintainList = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
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
      this.MaintainList = []
      val.forEach((item, index) => {
        this.MaintainList.push(item)
      })
    },
    // 审核通过禁用
    checkboxT (row) {
      if (row.status === 'finished' || row.aiShelves === 0) {
        return 0
      } else {
        return 1
      }
    },
    // 校验校验
    getverify () {
      let ty = true
      this.MaintainList.forEach((item) => {
        if (item.different !== 0 || item.orgnDifferent) {
          if (!item.differentInfo) {
            ty = false
          }
        }
      })
      return ty
    },
    getverify1 () {
      let ty = true
      this.MaintainList.forEach((item) => {
        if (item.aiShelves * 1 !== item.jwzAcount * 1) {
          ty = false
        }
      })
      return ty
    },
    // 编辑
    redact (row) {
      if (!row.redact) {
        row.redact = true
        this.noMaintainList.splice(this.noMaintainList.length, 0, {})
        this.noMaintainList.splice(this.noMaintainList.length - 1, 1)
      } else {
        if (row.different !== 0 || row.orgnDifferent) {
          if (!row.differentInfo) {
            this.$message.error('差异说明必填')
            return false
          }
        }
        row.postgDate = this.plantList.postgDate
        row.status = ''
        this.$http(`${MAINTAIN_API.MAINTAINSAVE_API}`, 'POST', [row]).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            row.redact = false
            this.noMaintainList.splice(this.noMaintainList.length, 0, {})
            this.noMaintainList.splice(this.noMaintainList.length - 1, 1)
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 保存
    save () {
      if (this.MaintainList.length > 0) {
        if (!this.getverify()) {
          this.$message.error('差异说明必填')
          return false
        }
        this.$confirm('确认保存, 是否继续?', '保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${MAINTAIN_API.MAINTAINSAVE_API}`, 'POST', this.MaintainList).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('保存成功')
              this.GetMaintainList()
            } else {
              this.$message.error(data.msg)
            }
          })
          this.GetMaintainList()
        })
      } else {
        this.$message.error('请勾选后保存')
      }
    },
    // 提交
    submit () {
      if (this.MaintainList.length > 0) {
        if (!this.getverify()) {
          this.$message.error('差异说明必填')
          return false
        }
        if (!this.getverify1()) {
          this.$message.error('车间入库数与机维组确认数不一致，请重新录入数据！')
          return false
        }
        this.$confirm('确认提交, 是否继续?', '提交', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${MAINTAIN_API.MAINTAINSUB_API}`, 'POST', this.MaintainList).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('提交成功')
              this.GetMaintainList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      } else {
        this.$message.error('请勾选后保存')
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetMaintainList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetMaintainList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>

</style>
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

  .maintain{
    .el-date-editor.el-input,input{
      width: 180px!important;
    }
  }
</style>
