<template>
  <div class="main">
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" label-width="96px" size="small">
            <el-form-item label="生产工厂："><p class="bottomline" style="width:212px;">{{formHeader.FACTORY}}</p></el-form-item>
            <el-form-item label="生产车间："><p class="bottomline">{{formHeader.WORK_SHOP}}</p></el-form-item>
            <el-form-item label="申请编号："><p class="bottomline">{{formHeader.APPLY_NO}}</p></el-form-item>
            <el-form-item label="半成品类别："><p class="bottomline">{{formHeader.HALF_TYPE}}</p></el-form-item>
            <el-form-item label="酱醪名称："><p class="bottomline" style="width:212px;">{{formHeader.MATERIAL_CODE}}{{formHeader.MATERIAL_NAME}}</p></el-form-item>
            <el-form-item label="生产日期："><p class="bottomline">{{formHeader.PRODUCT_DATE}}</p></el-form-item>
            <el-form-item label="申请数量："><p class="bottomline">{{formHeader.AMOUNT}}</p></el-form-item>
            <el-form-item label="申请人员："><p class="bottomline">{{formHeader.CREATOR}}</p></el-form-item>
            <el-form-item label="申请时间："><p class="bottomline" style="width:212px;">{{formHeader.CREATED}}</p></el-form-item>
            <el-form-item label="状态："><p class="bottomline">{{formHeader.CONFIRM_FLAG === '1' ? '已确认' : '未确认'}}</p></el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:15px">
      <el-row>
        <el-col style="font-weight: bold;">
          <i class="iconfont factory-shouye"></i>
          <span>开罐列表</span>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="22">
          <el-form :inline="true" :model="searchform" size="small">
            <el-form-item label="罐号">
              <el-select v-model="searchform.holder" @change="Search()">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) of holderList" :key="index" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类别">
              <el-select v-model="searchform.types" @change="Search()">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) of typesList" :key="index" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchform.status" @change="Search()">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) of statusList" :key="index" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="OpenHolder()" v-if="isAuth('fer:openholderg:openFermentation')" :disabled="isRedact" size="small" style="float:right">开罐</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="newDataList" border header-row-class-name="tableHead">
            <el-table-column type="selection" :selectable="CheckBoxInit" width="35"></el-table-column>
            <el-table-column label="罐号" prop="holderNo" width="80"></el-table-column>
            <el-table-column label="物料" width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.materialCode}}{{scope.row.materialName}}
              </template>
            </el-table-column>
            <el-table-column label="酱醪类别" prop="halfName"></el-table-column>
            <el-table-column label="发酵天数/天" prop="matureDays"></el-table-column>
            <el-table-column label="酱醪状态" prop="state"></el-table-column>
            <el-table-column label="数量" prop="inAmount"></el-table-column>
            <el-table-column label="单位" prop="inUnit" width="80"></el-table-column>
            <el-table-column label="入库日期" prop="created"></el-table-column>
            <el-table-column label="批次" prop="batch" width="120"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchform.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="searchform.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchform.currentTotal">
      </el-pagination>
      <el-row style="margin-top:15px">
        <el-col>可用数量：{{total}} 个，已选择：{{already}} 个</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { FERMENTATION_API } from '@/api/api'
import { dateFormat } from '@/net/validate'
export default {
  name: 'detail',
  data () {
    return {
      formHeader: [],
      already: 0,
      searchform: {
        currentTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 10
      },
      dataList: [],
      newDataList: [],
      newsDataList: [],
      isRedact: false,
      statusList: ['未成熟', '已成熟'],
      holderList: [],
      typesList: []
    }
  },
  mounted () {
    this.Getdetail()
  },
  watch: {},
  methods: {
    Getdetail () {
      this.$http(`${FERMENTATION_API.FORRECIPIENTSDETAIL_API}`, 'POST', {id: this.$store.state.common.Fermentation.orderId}).then(({data}) => {
        if (data.code === 0) {
          this.formHeader = data.openBasicsInfo
          if (data.openBasicsInfo.PRODUCT_DATE < dateFormat(new Date(), 'yyyy-MM-dd')) {
            this.isRedact = true
          }
          this.GetList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.already = this.multipleSelection.length
    },
    CheckBoxInit (row, index) {
      if (this.formHeader.PRODUCT_DATE < dateFormat(new Date(), 'yyyy-MM-dd')) {
        return 0
      } else {
        return 1
      }
    },
    Search () {
      this.newDataList = []
      this.newDataList = this.dataList
      if (this.searchform.holder !== undefined && this.searchform.holder !== '') {
        this.newsDataList = []
        this.newDataList.map((item) => {
          if (this.searchform.holder === item.holderNo) {
            this.newsDataList.push(item)
          }
          this.newDataList = this.newsDataList
        })
      }
      if (this.searchform.types !== undefined && this.searchform.types !== '') {
        this.newsDataList = []
        this.newDataList.map((item) => {
          if (this.searchform.types === item.halfName) {
            this.newsDataList.push(item)
          }
          this.newDataList = this.newsDataList
        })
      }
      if (this.searchform.status !== undefined && this.searchform.status !== '') {
        this.newsDataList = []
        this.newDataList.map((item) => {
          if (this.searchform.status === item.state) {
            this.newsDataList.push(item)
          }
          this.newDataList = this.newsDataList
        })
      }
      this.searchform.currentTotal = this.newDataList.length
      this.searchform.currentPage = 1
      this.newDataList = this.newDataList.slice((this.searchform.currentPage - 1) * this.searchform.pageSize, this.searchform.currentPage * this.searchform.pageSize)
      // this.newDataList = []
      // this.newDataList = this.dataList
      // for (var i = 0; i < this.newDataList.length; i++) {
      //   if (this.searchform.holder !== '') {
      //     if (this.searchform.holder !== this.newDataList[i].holderNo) {
      //       // console.log(this.newDataList.splice(i, 1))
      //     }
      //   }
      // }
    },
    // 罐列表
    GetList () {
      this.$http(`${FERMENTATION_API.FORRECIPIENTSDETAILIST_API}`, 'POST', {deptId: '06AB4ABA9E7B4BCA9131E3A69D7E0B2A', pageSize: 10000, currPage: '1', halfType: this.formHeader.HALF_TYPE, materialCode: this.formHeader.MATERIAL_CODE}).then(({data}) => {
        if (data.code === 0) {
          this.newDataList = []
          this.dataList = data.openFermentationInfo.list
          this.newDataList = data.openFermentationInfo.list.slice((this.searchform.currentPage - 1) * this.searchform.pageSize, this.searchform.currentPage * this.searchform.pageSize)
          this.searchform.currentTotal = this.dataList.length
          this.dataList.map((item) => {
            if (this.holderList.indexOf(item.holderNo) === -1) {
              this.holderList.push(item.holderNo)
            }
            if (this.typesList.indexOf(item.halfName) === -1) {
              this.typesList.push(item.halfName)
            }
          })
        }
      })
    },
    // 开罐动作
    OpenHolder () {
      if (this.multipleSelection === undefined) {
        this.$message.error('请勾选罐号')
        return false
      } else {
        this.$confirm('确认执行开罐操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.formHeader.AMOUNT < (this.formHeader.isNum + this.multipleSelection.length)) {
            this.$message.error('勾选开罐数量不能大于申请数')
          } else {
            this.multipleSelection.map((item) => {
              item.openId = this.$store.state.common.Fermentation.orderId
              item.amount = item.inAmount
              item.unit = item.inUnit
              item.inStoreDate = item.created
              item.isNum = this.formHeader.AMOUNT
            })
            // console.log(this.multipleSelection)
            this.$http(`${FERMENTATION_API.FORRECIPIENTSDETAILOPEN_API}`, 'POST', this.multipleSelection).then(({data}) => {
              if (data.code === 0) {
                this.searchform = {
                  currentPage: 1, // 当前页数
                  pageSize: 10
                }
                this.$message.success('开罐成功')
                this.Getdetail()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    },
    handleSizeChange (val) {
      this.searchform.pageSize = val
    },
    handleCurrentChange (val) {
      this.searchform.currentPage = val
      this.newDataList = this.dataList.slice((this.searchform.currentPage - 1) * this.searchform.pageSize, this.searchform.currentPage * this.searchform.pageSize)
    }
  },
  computed: {
    total: function () {
      return this.dataList.length
    }
  }
}
</script>

<style lang="less">
.bottomline {border-bottom: 1px solid #D8D8D8; width:152px; overflow:hidden; height:32px;}
</style>
