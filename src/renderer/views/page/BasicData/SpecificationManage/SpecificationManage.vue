<template>
  <el-col v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card>
        <div class="clearfix">
          <el-row style="float: right">
            <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="GetList(true)" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="form.materialCode" placeholder="物料" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('sys:spec:listSpec')">查询</el-button>
                <el-button type="primary" size="small" @click="visible1 = true" v-if="isAuth('sys:spec:listSpec')">高级查询</el-button>
                <el-button type="primary" size="small" @click="addOrupdate()" v-if="isAuth('sys:spec:saveSpec')">新增</el-button>
                <el-button type="danger" @click="remove()" size="small" v-if="isAuth('sys:spec:delSpec')">批量删除</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
        <el-row>
          <el-table
            class="orderTable"
            ref="table1"
            border
            @selection-change="handleSelectionChange"
            header-row-class-name="tableHead"
            :data="SpecificationList"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom: 20px">
            <el-table-column
              type="selection"
              width="34">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="55">
            </el-table-column>
            <el-table-column
              label="物料"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.materialCode }} {{ scope.row.materialName }}
              </template>
            </el-table-column>
            <el-table-column
              prop="brand"
              label="品牌"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="largeClassName"
              label="大类"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="boxSpec"
              width="80"
              label="箱规格"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="boxSpecUnitName"
              label="单位"
              width="80"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="productSpec"
              width="80"
              label="瓶规格"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="productSpecUnitName"
              label="单位"
              width="80"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="changer"
              label="维护人"
              width="150"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              width="60"
              label="操作">
              <template slot-scope="scope">
                <el-button style="padding: 0;" type="text" @click="addOrupdate(scope.row)" v-if="isAuth('sys:spec:updateSpec')">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <specification-add-or-update v-if="visible" :SerchSapList="SerchSapList" ref="SpecificationAddOrUpdate" @refreshDataList="GetList"></specification-add-or-update>
    <el-dialog
      title="高级查询"
      :close-on-click-modal="false"
      :visible.sync="visible1">
      <div class="formdata">
        <el-form :model="form" size="small" label-width="110px" class="orderdialog" @keyup.enter.native="GetList(true)">
          <el-form-item label="物料：">
            <el-input v-model="form.materialCode" placeholder="手工录入"></el-input>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-input v-model="form.brand" placeholder="手工录入"></el-input>
          </el-form-item>
          <el-form-item label="箱规格：">
            <el-input v-model="form.boxSpec" placeholder="手工录入"></el-input>
          </el-form-item>
          <el-form-item label="瓶规格：">
            <el-input v-model="form.productSpec" placeholder="手工录入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="visible1 = false">取消</el-button>
          <el-button type="primary" @click="GetList(true)">确定</el-button>
        </span>
    </el-dialog>
  </el-col>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
import SpecificationAddOrUpdate from './SpecificationAddOrUpdate'
export default {
  name: 'SpecificationManage',
  data () {
    return {
      lodingS: false,
      SerchSapList: [],
      SpecificationList: [],
      multipleSelection: [],
      visible: false,
      visible1: false,
      form: {
        brand: '',
        materialCode: '',
        boxSpec: '',
        productSpec: ''
      },
      currPage: 1,
      pageSize: 10,
      totalCount: 1
    }
  },
  mounted () {
    this.GetList()
    // 物料下拉
    this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', {params: ''}, false, false, false).then(({data}) => {
      if (data.code === 0) {
        this.SerchSapList = data.list
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    GetList (st) {
      this.lodingS = true
      if (st) {
        this.currPage = 1
      }
      this.$http(`${BASICDATA_API.SPECLIST_API}`, 'POST', {
        brand: this.form.brand,
        materialCode: this.form.materialCode,
        boxSpec: this.form.boxSpec,
        productSpec: this.form.productSpec,
        currPage: JSON.stringify(this.currPage),
        pageSize: JSON.stringify(this.pageSize)
      }).then(({data}) => {
        if (data.code === 0) {
          this.SpecificationList = data.page.list
          this.currPage = data.page.currPage
          this.pageSize = data.page.pageSize
          this.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.visible = false
        this.lodingS = false
        this.visible1 = false
      })
    },
    // 新增  修改
    addOrupdate (data) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.SpecificationAddOrUpdate.init(data)
      })
    },
    // 删除
    remove () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的规格')
      } else {
        this.$confirm('确认删除规格, 是否继续?', '删除规格', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${BASICDATA_API.SPECDEL_API}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.multipleSelection = []
              this.GetList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item.id)
      })
    },
    // 序号
    indexMethod (index) {
      return index + 1 + (this.currPage * 1 - 1) * (this.pageSize * 1)
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currPage = val
      this.GetList()
    }
  },
  computed: {},
  components: {
    SpecificationAddOrUpdate
  }
}
</script>

<style scoped>

</style>
