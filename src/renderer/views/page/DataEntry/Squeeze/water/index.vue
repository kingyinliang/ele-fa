<template>
  <div class="main">
    <el-card class="newCard searchCard">
      <el-row>
        <el-col>
          <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
            <el-form-item label="生产工厂：">
              <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
              <el-select v-model="formHeader.workShop" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布浆线：">
              <el-select v-model="formHeader.productLine" placeholder="请选择" class="width180px">
                <el-option label="请选择"  value=""></el-option>
                <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="SearchList" v-if="isAuth('prs:drench:drenchList')">查询</el-button>
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('prs:dernchUpdate')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('prs:dernchUpdate')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('prs:dernchUpdate')">提交</el-button>
        </template>
      </el-row>
      <div class="toggleSearchBottom">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
    <div class="tableCard">
      <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-card style="margin-top:10px" v-show="contentshow">
        <el-table :data="waterList" @selection-change="handleSelectionChange" border header-row-class-name="tableHead">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column label="工序" width="50px">自淋</el-table-column>
          <el-table-column label="气垫车号" prop="gx">
            <template slot="header"><i class="reqI">*</i><span>气垫车号</span></template>
            <template slot-scope="scope">
              {{scope.row.deviceName}}
            </template>
          </el-table-column>
          <el-table-column label="布浆线" prop="deptName"></el-table-column>
          <el-table-column label="布浆结束时间" prop="pulpEndDate"></el-table-column>
          <el-table-column label="自淋时间(H)" prop="drenchTime"></el-table-column>
          <el-table-column label="挪笼操作员" :show-overflow-tooltip="true">
            <template slot="header"><i class="reqI">*</i><span>挪笼操作员</span></template>
            <template slot-scope="scope">
              <el-col v-if="!scope.row.moveOperator">
                <span :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">
                  <i>{{scope.row.moveOperator}}</i>
                  <i>点击选择人员</i>
                </span>
              </el-col>
              <span v-else :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">{{scope.row.moveOperator}}</span>
            </template>
          </el-table-column>
          <el-table-column label="布浆操作员" prop="drenchOperator"></el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="人员分配" :close-on-click-modal="false" :visible.sync="visible">
      <el-row>
        <el-col style="width: 500px">
          <el-transfer
            filterable
            :titles="['未分配人员', '已分配人员']"
            :filter-method="filterMethod"
            filter-placeholder="请输入用户名称"
            v-model="selctId"
            :data="userlist">
          </el-transfer>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="updatauser(row)">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, SQU_API } from '@/api/api'
import { headanimation, setUserList } from '@/net/validate'
export default {
  name: 'water',
  data () {
    return {
      isRedact: false,
      contentshow: false,
      succmessage: '',
      orderStatus: '',
      factory: [],
      workshop: [],
      productline: [],
      formHeader: {
        factory: '',
        workShop: '',
        productLine: '',
        productDate: '',
        upMan: '',
        upDate: '',
        clickstatus: 'saved'
      },
      waterList: [],
      visible: false,
      selctId: [],
      userlist: [],
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      },
      multipleSelection: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'formHeader.workShop' (n, o) {
      this.GetParentline(n)
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.formHeader.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取车间
    Getdeptbyid (id) {
      this.formHeader.workShop = ''
      this.formHeader.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '压榨'}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.formHeader.workShop = data.typeList[0].deptId
            }
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
      this.formHeader.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {parentId: id, deptType: 'proLine'}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
            this.formHeader.productLine = data.childList[0].deptId
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.productline = []
      }
    },
    SearchList () {
      // if (!this.formHeader.factory || this.formHeader.factory === '') {
      //   this.$message.error('请选择生产工厂')
      //   return false
      // }
      // if (!this.formHeader.workShop || this.formHeader.workShop === '') {
      //   this.$message.error('请选择生产车间')
      //   return false
      // }
      // if (!this.formHeader.productLine || this.formHeader.productLine === '') {
      //   this.$message.error('请选择布浆线')
      //   return false
      // }
      this.contentshow = true
      this.$http(`${SQU_API.WATERLIST_API}`, 'POST', {factory: this.formHeader.factory, workShop: this.formHeader.workShop, productLine: this.formHeader.productLine, productDate: this.formHeader.productDate}).then(({data}) => {
        if (data.code === 0) {
          this.waterList = data.drechinfo
          this.waterList.map((item) => {
            this.$set(item, 'drenchTime', ((new Date() - new Date(item.pulpEndDate)) / (3600000)).toFixed(2))
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    selectUser (row) {
      if (this.isRedact) {
        this.row = row
        this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {deptId: this.formHeader.workShop}).then(({data}) => {
          if (data.code === 0) {
            this.userlist = setUserList(data.page.list)
            if (this.row.moveOperator) {
              this.selctId = this.row.moveOperator.split(',')
            }
            this.visible = true
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 人员确定
    updatauser (row) {
      this.$set(row, 'moveOperator', this.selctId.join(','))
      this.selctId = []
      this.visible = false
    },
    // 提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    // 保存
    savedOrSubmitForm (str) {
      let configurl
      if (str === 'submit') {
        if (this.multipleSelection.length === 0) {
          this.$message.error('没有勾选提交数据')
          return false
        }
        for (let items of this.multipleSelection) {
          if (!items.moveOperator || items.moveOperator === '') {
            this.$message.error('请选择挪笼操作人')
            return false
          }
        }
        configurl = SQU_API.WATERSUBMIT_API
        this.succmessage = '提交成功'
        this.$http(`${configurl}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.SearchList()
            this.$message.success(this.succmessage)
            this.isRedact = false
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        configurl = SQU_API.WATERSAVE_API
        this.succmessage = '保存成功'
        this.$http(`${configurl}`, 'POST', this.waterList).then(({data}) => {
          if (data.code === 0) {
            this.SearchList()
            this.$message.success(this.succmessage)
            this.isRedact = false
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="less" scoped>
.width180px {
  width: 180px;
}
.searchCard {
  .el-button--primary,.el-button--primary:focus{
    color: #000000;
    background-color: #FFFFFF;
    border-color: #D9D9D9;
  }
  .el-button--primary:hover{
    background-color: #1890FF;
    color: #FFFFFF
  }
  .el-button--primary:first-child{
    background-color: #1890FF;
    color: #FFFFFF;
    border-color: #1890FF;
  }
}
</style>
