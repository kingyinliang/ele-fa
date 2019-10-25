<template>
  <div>
    <el-card>
      <div style="overflow:hidden">
        <el-button type="primary" size="small" @click="addmaterial" :disabled="!isRedact" style="float: right"> + 新增</el-button>
      </div>
      <div style="margin-top:10px" >
        <el-table :data="materialList" @selection-change="handleSelectionChange" @row-dblclick="editmaterial" border header-row-class-name="tableHead" :row-class-name="rowDelFlag">
          <el-table-column type="selection" width="35" :disabled="!isRedact"></el-table-column>
          <el-table-column type="index" label="序号" width="50px"></el-table-column>
          <el-table-column width="100px">
            <template slot="header"><i class="reqI">*</i><span>布浆机</span></template>
            <template slot-scope="scope">{{scope.row.pulpMachineName}}</template>
          </el-table-column>
          <el-table-column width="180px">
            <template slot="header"><i class="reqI">*</i><span>气垫小车号</span></template>
            <template slot-scope="scope">{{scope.row.hovercraftName}}</template>
          </el-table-column>
          <el-table-column prop="pulpNum" label="布浆张数"></el-table-column>
          <el-table-column width="150px">
            <template slot="header"><i class="reqI">*</i><span>布浆开始时间</span></template>
            <template slot-scope="scope">{{scope.row.pulpStartDate}}</template>
          </el-table-column>
          <el-table-column width="150px">
            <template slot="header"><i class="reqI">*</i><span>布浆结束时间</span></template>
            <template slot-scope="scope">{{scope.row.pulpEndDate}}</template>
          </el-table-column>
          <el-table-column prop="pulpTime" label="布浆时间合计(MIN)" width="150px"></el-table-column>
          <el-table-column>
            <template slot="header"><i class="reqI">*</i><span>布浆量</span></template>
            <template slot-scope="scope">{{scope.row.pulpAmount}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100px">
            <template slot="header">布号</template>
            <template slot-scope="scope">{{scope.row.clothNo}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="200px">
            <template slot="header"><i class="reqI">*</i><span>酱醪分类</span></template>
            <template slot-scope="scope">{{scope.row.sauceClass}}</template>
          </el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column width="160px">
            <template slot="header"><i class="reqI">*</i><span>布浆自淋时间(MIN)</span></template>
            <template slot-scope="scope">{{scope.row.selfDrenchTime}}</template>
          </el-table-column>
          <el-table-column width="150px">
            <template slot="header"><i class="reqI">*</i><span>发酵罐号1</span></template>
            <template slot-scope="scope">{{scope.row.potOne}}</template>
          </el-table-column >
          <el-table-column prop="potTwo" label="发酵罐号2" width="150px"></el-table-column>
          <el-table-column prop="remark" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" :disabled="!isRedact" circle size="small" @click="delrow(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card>
      <div>
        <span class="lh32px">布浆人员</span>
        <el-button type="text" class="readyshiftBtn" name="people" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
        <el-button type="primary" size="small" @click="addpeople" :disabled="!isRedact" style="float: right"> + 新增</el-button>
      </div>
      <div class="peopleBox">
        <el-table ref="peopleTable" border style="margin-top:10px" header-row-class-name="tableHead" :data="peopleList" :row-class-name="rowDelFlag">
          <el-table-column label="白/中/夜班">
            <template slot="header"><i class="reqI">*</i><span>白/中/夜班</span></template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                <el-option v-for="item in classesList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="人员" :show-overflow-tooltip="true">
            <template slot="header"><i class="reqI">*</i><span>人员</span></template>
            <template slot-scope="scope">
              <el-col v-if="!scope.row.man">
                <span :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">
                  <i>{{scope.row.man}}</i>
                  <i>点击选择人员</i>
                </span>
              </el-col>
              <span v-else :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">{{scope.row.man}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" :disabled="!isRedact" circle size="small" @click="delrow(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="熟酱醪领用" :visible.sync="dialogFormVisibleMai" width="450px">
      <el-form :model="sauce" size="small" :rules="saucerule" ref="saucesbu">
        <el-form-item label="布浆机" :label-width="formLabelWidth" prop="pulpMachine">
          <el-select v-model="sauce.pulpMachine" filterable placeholder="请选择" style="width:310px">
            <el-option :label="item.deviceName" v-for="(item, index) in pulpMachineList" :key="index" :value="item.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气垫小车" :label-width="formLabelWidth" prop="hovercraftNo" v-if="!this.sauce.hovercraftNo">
          <el-select v-model="sauce.hovercraftNo" filterable placeholder="请选择" style="width:310px" :disabled="!isSelect">
            <el-option :label="item.deviceNo + item.deviceName" v-for="(item, index) in hovercraftList" :key="index" :value="item.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气垫小车" :label-width="formLabelWidth" prop="hovercraftNo" v-else>
          <el-select v-model="sauce.hovercraftNo" filterable placeholder="请选择" style="width:310px" :disabled="!isSelect">
            <el-option :label="item.deviceNo + item.deviceName" v-for="(item, index) in hovercraftAll" :key="index" :value="item.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布浆张数" :label-width="formLabelWidth" prop="pulpNum">
          <el-input v-model="sauce.pulpNum"></el-input>
        </el-form-item>
        <el-form-item label="布浆开始时间" :label-width="formLabelWidth" prop="pulpStartDate">
          <el-date-picker v-model="sauce.pulpStartDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:310px"></el-date-picker>
        </el-form-item>
        <el-form-item label="布浆结束时间" :label-width="formLabelWidth" prop="pulpEndDate">
          <el-date-picker v-model="sauce.pulpEndDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:310px"></el-date-picker>
        </el-form-item>
        <el-form-item label="布浆量" :label-width="formLabelWidth" prop="pulpAmount">
          <el-input v-model="sauce.pulpAmount"></el-input>
        </el-form-item>
        <el-form-item label="自重自淋时间" :label-width="formLabelWidth" prop="selfDrenchTime">
          <el-input v-model="sauce.selfDrenchTime"></el-input>
        </el-form-item>
        <el-form-item label="布号" :label-width="formLabelWidth" prop="clothNo">
          <el-input v-model="sauce.clothNo"></el-input>
        </el-form-item>
        <el-form-item label="酱醪分类" :label-width="formLabelWidth" prop="sauceClass">
          <el-select v-model="sauce.sauceClass" filterable placeholder="请选择" style="width:310px">
            <el-option :label="item.code + ' ' + item.value" v-for="(item, index) in sauceClassList" :key="index" :value="item.code + ' ' + item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发酵罐号" :label-width="formLabelWidth" prop="potOne">
          <el-input v-model="sauce.potOne" style="width:259px; float:left"></el-input><el-button @click="addGuan()" style="float:left; margin-left:10px">+</el-button>
        </el-form-item>
        <el-form-item label="发酵罐号2" :label-width="formLabelWidth" prop="potTwo" :style="{'display': guanTwoDisplayNo ? 'none' : ''}">
          <el-input v-model="sauce.potTwo" style="width:259px; float:left"></el-input><el-button type="danger" icon="el-icon-delete" circle size="small" @click="delGuan()" style="float:left; margin-left:10px"></el-button>
        </el-form-item>
        <el-form-item label="操作时间" :label-width="formLabelWidth">{{sauce.changed}}</el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">{{sauce.changer}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelsave()">取 消</el-button>
        <el-button type="primary" @click="addsave('saucesbu')">确 定</el-button>
      </div>
    </el-dialog>
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
          <el-button @click="visible = false" style="border: 1px solid #dcdfe6;padding: 12px 20px;font-size: 14px;border-radius: 4px;">取消</el-button>
          <el-button type="primary" @click="updatauser(row)" style="background-color: #1890FF;padding: 12px 20px;font-size: 14px;border-radius: 4px;">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { dateFormat, Readyanimation, setUserList } from '@/net/validate'
import { BASICDATA_API, SYSTEMSETUP_API, SQU_API } from '@/api/api'
export default {
  name: 'material',
  data () {
    return {
      formLabelWidth: '100px',
      pulpMachineList: [],
      hovercraftList: [],
      hovercraftAll: [],
      dialogFormVisibleMai: false,
      visible: false,
      materialList: [],
      sauce: {},
      saucerule: {
        pulpMachine: [
          { required: true, message: '请选择布浆机', trigger: 'change' }
        ],
        hovercraftNo: [
          { required: true, message: '请选择气垫车', trigger: 'change' }
        ]
      },
      classesList: ['白班', '中班', '夜班'],
      peopleList: [],
      selctId: [],
      userlist: [],
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      },
      multipleSelection: [],
      isSelect: true,
      guanTwoDisplayNo: true,
      sauceClassList: []
    }
  },
  props: ['isRedact', 'formHeader'],
  mounted () {
    Readyanimation(this.$)
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.GetsauceClass(n)
    }
  },
  methods: {
    // 酱醪列表
    GetsauceClass (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'YZ_ZUJIAN_MATERIAL'}).then(({data}) => {
        if (data.code === 0) {
          this.sauceClassList = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addGuan () {
      this.guanTwoDisplayNo = false
    },
    delGuan () {
      this.sauce.potTwo = ''
      this.guanTwoDisplayNo = true
    },
    cancelsave () {
      this.dialogFormVisibleMai = false
      this.delGuan()
    },
    // 布浆机
    GetpulpMachine (productLine) {
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '布浆机',
        deptId: productLine,
        currPage: '1',
        pageSize: '50'
      }).then(({data}) => {
        if (data.code === 0) {
          this.pulpMachineList = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 气垫车
    GethovercraftNo (workshop) {
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '气垫小车',
        deptId: workshop,
        currPage: '1',
        pageSize: '50',
        status: '0'
      }).then(({data}) => {
        if (data.code === 0) {
          this.hovercraftList = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
      this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
        param: '气垫小车',
        deptId: workshop,
        currPage: '1',
        pageSize: '50'
      }).then(({data}) => {
        if (data.code === 0) {
          this.hovercraftAll = data.list.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addmaterial () {
      this.dialogFormVisibleMai = true
      this.isSelect = true
      this.guanTwoDisplayNo = true
      this.sauce = {
        id: '',
        uid: this.uuid(),
        pulpMachine: '',
        hovercraftNo: '',
        pulpNum: '',
        pulpStartDate: '',
        pulpEndDate: '',
        pulpAmount: '',
        unit: 'L',
        selfDrenchTime: '',
        potOne: '',
        potTwo: '',
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        delFlag: '0',
        clothNo: '',
        sauceClass: ''
      }
    },
    editmaterial (row) {
      if (this.isRedact) {
        this.dialogFormVisibleMai = true
        this.isSelect = false
        this.sauce = Object.assign({}, row)
        if (this.sauce.potTwo) {
          this.guanTwoDisplayNo = false
        }
      }
    },
    addsave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let currentRecord = []
          if (this.sauce.hasOwnProperty('uid')) {
            // 新增行
            currentRecord = this.materialList.filter(data => data.uid === this.sauce.uid)
          } else {
            // 原有行
            currentRecord = this.materialList.filter(data => data.id === this.sauce.id)
          }
          let pulpName = this.pulpMachineList.find(item => item.deviceId === this.sauce.pulpMachine).deviceName
          let hovercraName = this.hovercraftAll.find(item => item.deviceId === this.sauce.hovercraftNo).deviceNo + this.hovercraftAll.find(item => item.deviceId === this.sauce.hovercraftNo).deviceName
          this.sauce = {
            id: this.sauce.id,
            uid: this.sauce.uid,
            pulpMachine: this.sauce.pulpMachine,
            hovercraftNo: this.sauce.hovercraftNo,
            pulpMachineName: pulpName,
            hovercraftName: hovercraName,
            pulpNum: this.sauce.pulpNum,
            pulpStartDate: this.sauce.pulpStartDate,
            pulpEndDate: this.sauce.pulpEndDate,
            pulpAmount: this.sauce.pulpAmount,
            unit: 'L',
            selfDrenchTime: this.sauce.selfDrenchTime,
            potOne: this.sauce.potOne,
            potTwo: this.sauce.potTwo,
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
            delFlag: this.sauce.delFlag,
            clothNo: this.sauce.clothNo,
            sauceClass: this.sauce.sauceClass
          }
          let chaTime
          if (!this.sauce.pulpEndDate || !this.sauce.pulpStartDate) {
            this.$set(this.sauce, 'pulpTime', 0)
          } else {
            chaTime = (new Date(this.sauce.pulpEndDate) - new Date(this.sauce.pulpStartDate)) / 60000
            this.$set(this.sauce, 'pulpTime', chaTime)
          }
          if (currentRecord && currentRecord.length > 0) {
            Object.assign(currentRecord[0], this.sauce)
          } else {
            this.materialList.push(this.sauce)
          }
          this.dialogFormVisibleMai = false
        } else {
          return false
        }
      })
    },
    // 物料查询列表
    GetMateriaList (formHeader) {
      this.GetpulpMachine(formHeader.productLine) // 布浆机
      this.GethovercraftNo(formHeader.workShop) // 气垫车
      this.$http(`${SQU_API.CLOTHMATERIALIST_API}`, 'POST', {factory: formHeader.factory, workShop: formHeader.workShop, productLine: formHeader.productLine, productDate: formHeader.productDate}).then(({data}) => {
        if (data.code === 0) {
          if (data.prspro.length !== 0) {
            this.formHeader.id = data.prspro[0].id
          } else {
            this.formHeader.id = ''
          }
          this.materialList = data.propulp
          this.peopleList = data.propulpMan
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    Readyrules () {
      let ty = true
      if (this.multipleSelection.length === 0) {
        ty = false
        this.$message.error('请勾选提交数据')
        return false
      }
      for (let items of this.multipleSelection) {
        if (!items.pulpMachineName || items.pulpMachineName === '' || !items.hovercraftName || items.hovercraftName === '' || !items.pulpStartDate || items.pulpStartDate === '' || !items.pulpEndDate || items.pulpEndDate === '' || !items.pulpAmount || items.pulpAmount === '' || !items.selfDrenchTime || items.selfDrenchTime === '' || !items.potOne || items.potOne === '' || !items.sauceClass || items.sauceClass === '') {
          ty = false
          this.$message.error('物料必填项不能为空')
          return false
        }
      }
      if (this.peopleList.length === 0) {
        ty = false
        this.$message.error('请填写布浆人员')
        return false
      }
      for (let items of this.peopleList) {
        if (!items.classes || items.classes === '' || !items.man || items.man === '') {
          ty = false
          this.$message.error('人员必填项不能为空')
          return false
        }
      }
      for (let item of this.multipleSelection) {
        if (item.id === '') {
          ty = false
          this.$message.error('请先保存再提交')
          return false
        }
      }
      return ty
    },
    savemain (resolve, reject) {
      if (!this.formHeader.id) {
        this.formHeader.id = this.uuid(32, 62)
      }
      this.formHeader.addOrUpdate = '0'
      this.$http(`${SQU_API.CLOTHFORMHEADER_API}`, 'POST', this.formHeader).then(({data}) => {
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
    savesecond (resolve, reject) {
      this.materialList.map((item) => {
        this.$set(item, 'processId', this.formHeader.id)
        this.$set(item, 'productLine', this.formHeader.productLine)
        this.$set(item, 'status', 'saved')
        if (this.formHeader.clickstatus === 'submit' && this.multipleSelection.length > 0) {
          if (this.multipleSelection.find(items => items.uid === item.uid)) {
            this.$set(item, 'status', 'submit')
          }
        }
      })
      this.$http(`${SQU_API.CLOTHMATERIALSAVE_API}`, 'POST', this.materialList).then(({data}) => {
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
      if (this.formHeader.clickstatus === 'submit') {
        this.multipleSelection.map((item) => {
          this.$set(item, 'processId', this.formHeader.id)
          this.$set(item, 'productLine', this.formHeader.productLine)
          this.$set(item, 'status', this.formHeader.clickstatus)
        })
        this.$http(`${SQU_API.CLOTHMATERIALSUBMIT_API}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    savepeople (resolve, reject) {
      this.peopleList.map((item) => {
        this.$set(item, 'processId', this.formHeader.id)
      })
      this.$http(`${SQU_API.CLOTHMATERIALMAN_API}`, 'POST', this.peopleList).then(({data}) => {
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
    delrow (row) {
      row.delFlag = '1'
    },
    rowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    addpeople () {
      this.peopleList.push({
        id: '',
        classes: '',
        delFlag: '0'
      })
    },
    selectUser (row) {
      if (this.isRedact) {
        this.row = row
        this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {deptId: this.formHeader.workShop}).then(({data}) => {
          if (data.code === 0) {
            this.userlist = setUserList(data.page.list)
            if (this.row.man) {
              this.selctId = this.row.man.split(',')
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
      this.$set(row, 'man', this.selctId.join(','))
      this.selctId = []
      this.visible = false
    },
    handleSelectionChange (val) {
      for (let item of val) {
        if (item.uid === '' || !item.uid) {
          this.$set(item, 'uid', item.id)
        }
      }
      this.multipleSelection = val
    }
  },
  computed: {
  },
  components: {
  }
}
</script>

<style>
.reqI{
  color: red;
}
.rowDel {
  display: none
}
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
