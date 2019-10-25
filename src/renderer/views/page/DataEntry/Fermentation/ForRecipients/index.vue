<template>
  <div class="main">
    <el-card>
      <el-row>
        <el-col :span="22">
          <el-form :model="form" :inline="true" size="small" label-width="85px">
            <el-form-item label="生产工厂：">
              <el-select v-model="form.factory" placeholder="请选择">
                <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="form.workShop" placeholder="请选择">
                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请编码：">
              <el-input v-model="form.applyNo" style="width:199px"></el-input>
            </el-form-item>
            <el-form-item label="生产物料：">
              <el-select v-model="form.materialCode">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) in MaterialType" :key="index" :value="item.materialCode" :label="item.materialCode + item.materialName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请日期：">
              <el-date-picker type="date" v-model="form.sqTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" style="width:199px"></el-date-picker>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker type="date" v-model="form.productDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" style="width:199px"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="SearchList(true)" v-if="isAuth('fer:openholderg:openHolderList')" style="float:right">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="tabClick" type="border-card" style="margin-top:15px">
      <el-tab-pane name="0" label="未确认">
        <el-table :data="dataList" border header-row-class-name="tableHead">
          <el-table-column label="车间" prop="workShopName"></el-table-column>
          <el-table-column label="申请编码" prop="applyNo" width="120">
            <template slot-scope="scope">
              <a @click="Go(scope.row)">{{scope.row.applyNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="物料" width="230">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="半成品类别" prop="halfType"></el-table-column>
          <el-table-column label="申请数量" prop="amount"></el-table-column>
          <el-table-column label="申请时间" prop="created" width="170"></el-table-column>
          <el-table-column label="生产日期" prop="productDate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="Go(scope.row)" :disabled="(!isAuth('fer:openholderg:confirm'))">确认</el-button>
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
      <el-tab-pane name="1" label="已确认">
        <el-table :data="dataList" border header-row-class-name="tableHead">
          <el-table-column label="车间" prop="workShopName"></el-table-column>
          <el-table-column label="申请编码" width="120">
            <template slot-scope="scope">
              <a @click="Go(scope.row)">{{scope.row.applyNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="物料" width="230">
            <template slot-scope="scope">
              {{scope.row.materialCode}}{{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="半成品类别" prop="halfType"></el-table-column>
          <el-table-column label="申请数量" prop="amount"></el-table-column>
          <el-table-column label="确认数量" prop="confirmNum"></el-table-column>
          <el-table-column label="申请时间" prop="created" width="170"></el-table-column>
          <el-table-column label="生产日期" prop="productDate"></el-table-column>
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
  </div>
</template>

<script>
import { BASICDATA_API, FERMENTATION_API } from '@/api/api'
export default {
  name: 'forlist',
  data () {
    return {
      form: {
        factory: '',
        workShop: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      factory: [],
      workshop: [],
      dataList: [],
      activeName: '0',
      currentName: '0',
      MaterialType: []
    }
  },
  mounted () {
    this.GetFactoryList()
  },
  watch: {
    'form.factory' (n, o) {
      this.GetWorkshopList(n)
      this.GetMaterialType(n)
    }
  },
  methods: {
    // 获取工厂
    GetFactoryList () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.form.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    GetWorkshopList (id) {
      this.form.workShop = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '压榨'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.workshop = data.typeList
              if (data.typeList.length > 0) {
                this.form.workShop = data.typeList[0].deptId
              }
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.workshop = []
      }
    },
    //  生产物料
    GetMaterialType (n) {
      this.$http(`${FERMENTATION_API.FORRECIPIENTSHOLDER_API}`, 'POST', {factory: n}).then(({data}) => {
        if (data.code === 0) {
          this.MaterialType = data.productsInfo
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    tabClick (value) {
      this.currentName = value.name
      this.SearchList(true)
    },
    SearchList (st) {
      if (st) {
        this.form.currPage = 1
      }
      this.form.confirmFlag = this.currentName
      this.$http(`${FERMENTATION_API.FORRECIPIENTSLIST_API}`, 'POST', this.form).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.openHolderInfo.list
          this.form.currPage = data.openHolderInfo.currPage
          this.form.pageSize = data.openHolderInfo.pageSize
          this.form.totalCount = data.openHolderInfo.totalCount
        }
      })
    },
    Go (item) {
      if (this.isAuth('fer:openholderg:confirm')) {
        this.Fermentation = {
          orderId: item.id
        }
        this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Fermentation-ForRecipients-detail')
        setTimeout(() => {
          this.$router.push({ name: `DataEntry-Fermentation-ForRecipients-detail` })
        }, 100)
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.form.pageSize = val
      this.SearchList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.form.currPage = val
      this.SearchList()
    }
  },
  computed: {
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    Fermentation: {
      get () {
        return this.$store.state.common.Fermentation
      },
      set (val) {
        this.$store.commit('common/updateFermentation', val)
      }
    }
  }
}
</script>
