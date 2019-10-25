<template>
  <div>
    <el-card>
      <el-table :data="materialList" @selection-change="handleSelectionChange" border header-row-class-name="tableHead" v-if="this.formHeader.pressure === 1">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="工序" width="50px">预压</el-table-column>
        <el-table-column width="120px" prop="deviceName" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>气垫车号</span></template>
        </el-table-column>
        <el-table-column label="布浆线" prop="deptName" width="80px" :key="Math.random()"></el-table-column>
        <el-table-column label="自淋时间(H)" prop="drenchTime" width="120px" :key="Math.random()"></el-table-column>
        <el-table-column width="120px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>预压机号</span></template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.prePressNo" placeholder="请选择" size="small" :disabled="!isRedact">
              <el-option v-for="item in proPressList" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="195px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>预压开始时间</span></template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.prePressStart" type="datetime" placeholder="选择日期" @input="changePrePress(scope.row)" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="small" style="width:175px" :disabled="!isRedact"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column width="200px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>预压结束时间</span></template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.prePressEnd" type="datetime" placeholder="选择日期" @input="changePrePress(scope.row)" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="small" style="width:175px" :disabled="!isRedact"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="预压时间(H)" prop="prePressTime" width="110px" :key="Math.random()"></el-table-column>
        <el-table-column label="终止压力(Mpa)" width="180px" v-if="this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D'" :key="Math.random()">
          <template slot-scope="scope">
            <el-input v-model="scope.row.endPress" size="small" :disabled="!isRedact"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="调压人员" width="150px" :show-overflow-tooltip="true" v-if="this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D'" :key="Math.random()">
          <template slot-scope="scope">
            <el-col v-if="!scope.row.suitOperator">
              <span :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">
                <i>{{scope.row.suitOperator}}</i>
                <i>点击选择人员</i>
              </span>
            </el-col>
            <span v-else :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">{{scope.row.suitOperator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="挪笼人员" prop="moveOperator" :show-overflow-tooltip="true" width="150"></el-table-column>
      </el-table>
      <el-table :data="materialList" @selection-change="handleSelectionChange" border header-row-class-name="tableHead" v-if="this.formHeader.pressure === 2">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="工序" width="50px">终压</el-table-column>
        <el-table-column width="100px" prop="deviceName" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>气垫车号</span></template>
        </el-table-column>
        <el-table-column label="布浆线" prop="deptName" width="80px" :key="Math.random()"></el-table-column>
        <el-table-column width="120px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>终压机号</span></template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.pressNo" placeholder="请选择" size="small" :disabled="!isRedact">
              <el-option v-for="item in proPressList" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="195px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>终压开始时间</span></template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.pressStart" type="datetime" placeholder="选择日期" @input="changendPrePress(scope.row)" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="small" style="width:175px" :disabled="!isRedact"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column width="200px" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>终压结束时间</span></template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.pressEnd" type="datetime" placeholder="选择日期" @input="changendPrePress(scope.row)" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="small" style="width:175px" :disabled="!isRedact"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="终压时间(H)" prop="pressTime" width="110px" :key="Math.random()"></el-table-column>
        <el-table-column label="终止压力(Mpa)" width="180px" v-if="this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D'" :key="Math.random()">
          <template slot-scope="scope">
            <el-input v-model="scope.row.press" size="small" :disabled="!isRedact"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="调压人员" width="150px" :show-overflow-tooltip="true" v-if="this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D'" :key="Math.random()">
          <template slot-scope="scope">
            <el-col v-if="!scope.row.suitOperator">
              <span :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">
                <i>{{scope.row.suitOperator}}</i>
                <i>点击选择人员</i>
              </span>
            </el-col>
            <span v-else :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">{{scope.row.suitOperator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="挪笼人员" prop="moveOperator" :show-overflow-tooltip="true" width="150" :key="Math.random()"></el-table-column>
        <el-table-column width="180px" v-if="this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D'" :key="Math.random()">
          <template slot="header"><i class="reqI">*</i><span>压榨二碎布数（个）</span></template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.destoryNum" size="small" :disabled="!isRedact"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-form :inline="true" :model="formInline" style="margin-top:10px" v-if="this.formHeader.workShop === 'D79ECC0CBB1F483EB4136A3720B68B3D' && this.formHeader.pressure === 2">
        <el-form-item>
          <span slot="label">压榨一东碎布数（张）<i class="reqI">*</i>:</span>
          <el-input v-model="formInline.destoryNumEast" :disabled="!isRedact" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">压榨一西碎布数（张）<i class="reqI">*</i>:</span>
          <el-input v-model="formInline.destoryNumWest" :disabled="!isRedact" size="small"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
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
          <el-button @click="visible = false" style="background-color:#fff; color:#606266; border:1px solid #dcdfe6; font-weight:500; padding:12px 20px; font-size:14px; border-radius:4px;">取消</el-button>
          <el-button type="primary" @click="updatauser(row)" style="background-color:#1890FF; color:#FFFFFF; border-color:#1890FF; font-weight:500; padding:12px 20px; font-size:14px;border-radius: 4px;">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { Readyanimation, setUserList } from '@/net/validate'
import { BASICDATA_API, SYSTEMSETUP_API, SQU_API } from '@/api/api'
export default {
  name: 'pressmaterial',
  data () {
    return {
      proPressList: [],
      materialList: [],
      visible: false,
      selctId: [],
      userlist: [],
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      },
      multipleSelection: [],
      formInline: {
        'destoryNumEast': '',
        'destoryNumWest': ''
      }
    }
  },
  props: ['isRedact', 'formHeader'],
  mounted () {
    Readyanimation(this.$)
  },
  watch: {
    'formHeader.pressure' (n, o) {
      this.materialList = []
    },
    'formHeader.workShop' (n, o) {
      this.materialList = []
    }
  },
  methods: {
    // 预压机号
    GetpulpMachine (formHeader) {
      if (this.formHeader.workShop) {
        let presure
        if (this.formHeader.pressure === 1) {
          presure = '预压'
        } else {
          presure = '终压'
        }
        this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
          param: presure,
          deptId: this.formHeader.workShop,
          currPage: '1',
          pageSize: '50'
        }).then(({data}) => {
          if (data.code === 0) {
            this.proPressList = data.list.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 列表拉取
    GetMateriaList (formHeader) {
      this.$http(`${SQU_API.PRESSLIST_API}`, 'POST', {factory: formHeader.factory, workShop: formHeader.workShop, pressure: formHeader.pressure, productLine: formHeader.productLine, productDate: formHeader.productDate}).then(({data}) => {
        if (data.code === 0) {
          this.materialList = data.pressInfo
          if (this.formHeader.workShop === 'D79ECC0CBB1F483EB4136A3720B68B3D' && this.formHeader.pressure === 2) {
            this.formInline.destoryNumEast = this.materialList[0].destoryNumEast
            this.formInline.destoryNumWest = this.materialList[0].destoryNumWest
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 预压时间
    changePrePress (row) {
      if (row.prePressStart && row.prePressEnd) {
        this.materialList.map((item) => {
          if (row.id === item.id) {
            item.prePressTime = ((new Date(row.prePressEnd) - new Date(item.prePressStart)) / 3600000).toFixed(2)
          }
        })
      }
    },
    // 终压时间
    changendPrePress (row) {
      if (row.pressStart && row.pressEnd) {
        this.materialList.map((item) => {
          if (row.id === item.id) {
            item.pressTime = ((new Date(row.pressEnd) - new Date(item.pressStart)) / 3600000).toFixed(2)
          }
        })
      }
    },
    // 人员弹框
    selectUser (row) {
      if (this.isRedact) {
        this.row = row
        this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {deptId: this.formHeader.workShop}).then(({data}) => {
          if (data.code === 0) {
            this.userlist = setUserList(data.page.list)
            if (this.row.suitOperator) {
              this.selctId = this.row.suitOperator.split(',')
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
      // row.man = this.selctId.join(',')
      this.$set(row, 'suitOperator', this.selctId.join(','))
      this.selctId = []
      this.visible = false
    },
    // 提交
    submitMaterial (resolve, reject) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选提交数据')
        return false
      }
      for (let item of this.multipleSelection) {
        if (this.formHeader.pressure === 1) {
          if (!item.prePressNo || item.prePressNo === '' || !item.prePressStart || item.prePressStart === '' || !item.prePressEnd || item.prePressEnd === '') {
            this.$message.error('请填写必填项')
            return false
          }
        } else {
          if (!item.pressNo || item.pressNo === '' || !item.pressStart || item.pressStart === '' || !item.pressEnd || item.pressEnd === '') {
            this.$message.error('请填写必填项')
            return false
          }
          if (this.formHeader.workShop === 'C4F2B8DAD6C14D1C8DC44821F9E2636D') {
            if (!item.destoryNum || item.destoryNum === '') {
              this.$message.error('请填写必填项')
              return false
            }
          }
          if (this.formHeader.workShop === 'D79ECC0CBB1F483EB4136A3720B68B3D') {
            if (this.formInline.destoryNumEast === '' || !this.formInline.destoryNumEast || this.formInline.destoryNumWest === '' || !this.formInline.destoryNumWest) {
              this.$message.error('请填写必填项')
              return false
            } else {
              this.multipleSelection.map((item) => {
                this.$set(item, 'destoryNumEast', this.formInline.destoryNumEast)
                this.$set(item, 'destoryNumWest', this.formInline.destoryNumWest)
              })
            }
          }
        }
      }
      let configurl
      if (this.formHeader.pressure === 1) {
        configurl = SQU_API.PRESSSUBMIT_API
      } else {
        configurl = SQU_API.ENDPRESSSUBMIT_API
      }
      this.$http(`${configurl}`, 'POST', this.multipleSelection).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      }).catch(() => {
        if (resolve) {
          reject('reject')
        }
      })
    },
    updateMaterial (resolve, reject) {
      let configurl
      if (this.formHeader.pressure === 1) {
        configurl = SQU_API.PRESSUPDATE_API
      } else {
        configurl = SQU_API.ENDPRESSUPDATE_API
      }
      if (this.formHeader.workShop === 'D79ECC0CBB1F483EB4136A3720B68B3D') {
        this.materialList.map((item) => {
          let destoryNumEast = 0
          let destoryNumWest = 0
          if (this.formInline.destoryNumEast && this.formInline.destoryNumEast !== '') {
            destoryNumEast = this.formInline.destoryNumEast
          }
          if (this.formInline.destoryNumWest && this.formInline.destoryNumWest !== '') {
            destoryNumWest = this.formInline.destoryNumWest
          }
          this.$set(item, 'destoryNumEast', destoryNumEast)
          this.$set(item, 'destoryNumWest', destoryNumWest)
        })
      }
      this.$http(`${configurl}`, 'POST', this.materialList).then(({data}) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg)
        }
        if (resolve) {
          resolve('resolve')
        }
      }).catch(() => {
        if (resolve) {
          reject('reject')
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
.dialog-footer .el-button--primary:focus{
  color: #000000;
  background-color: #FFFFFF;
  border-color: #D9D9D9;
}
.dialog-footer .el-button--primary:hover{
  background-color: #1890FF;
  color: #FFFFFF
}
.dialog-footer .el-button--primary{
  background-color: #1890FF;
  color: #FFFFFF;
  border-color: #1890FF;
}
</style>
