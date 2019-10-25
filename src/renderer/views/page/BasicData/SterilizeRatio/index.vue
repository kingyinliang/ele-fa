<template>
  <div class="main">
    <el-card class="searchCard searchCards">
      <el-row>
        <el-col :span="18">
          <el-form :model="formHeader" size="small" :inline="true" label-width="70px">
            <el-form-item label="工厂：">
              <el-select v-model="formHeader.factory">
                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物料：">
              <el-select v-model="formHeader.materialCode">
                <el-option value="">请选择</el-option>
                <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialCode +  `${item.materialName}`" :value="item.materialCode"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button type="primary" size="small" @click="GetList()">查询</el-button>
          <el-button type="primary" size="small" @click="AddInfo()" v-if="isAuth('ste:mid:save')">新增</el-button>
          <el-button type="primary" size="small" @click="DeleteInfo()" v-if="isAuth('ste:mid:delete')">批量删除</el-button>
        </el-col>
      </el-row>
      <div class="toggleSearchBottom">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-card>
    <el-card class="tableCard secondcard">
      <div class="toggleSearchTop">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-table :data="dataList" @row-dblclick="EditInfo" @selection-change="handleSelectionChange" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%;margin-bottom: 20px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="物料" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.materialCode}} {{scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column prop="ratio" label="比例" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogVisibleAdd" width="400px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">新增</div>
      <el-form :model="formAdd" :inline="true" size="small" :rules="Addrulestar" ref="Addstar" label-width="85px">
        <el-form-item label="工厂：">{{this.factoryName}}</el-form-item>
        <el-form-item label="物料：" prop="materialCode">
          <el-select v-model="formAdd.materialCode" filterable style="width:230px">
            <el-option value="">请选择</el-option>
            <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialCode + ` ${item.materialName}`" :value="item.materialCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比例：" prop="ratio">
          <el-input v-model="formAdd.ratio" style="width:230px"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formAdd.remark" style="width:230px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false" size="small">取 消</el-button>
        <el-button type="primary" @click="AddSave('Addstar')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api'
import { headanimation } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      formHeader: {
        factory: '',
        materialCode: ''
      },
      factoryName: '',
      factory: [],
      materialList: [],
      dataList: [],
      dialogVisibleAdd: false,
      formAdd: {
        remark: ''
      },
      Addrulestar: {
        materialCode: [
          { required: true, message: '请选择物料', trigger: 'blur' }
        ],
        ratio: [
          { required: true, message: '请填写比例', trigger: 'blur' }
        ]
      },
      postUrl: '',
      multipleSelection: []
    }
  },
  mounted () {
    headanimation(this.$)
    this.Getdeptcode()
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.GetMaterialCodeList(n)
    }
  },
  methods: {
    // 获取工厂
    Getdeptcode () {
      this.materialList = []
      this.dataList = []
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({data}) => {
        if (data.code === 0) {
          this.factory = data.typeList
          this.formHeader.factory = data.typeList[0].deptId
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取物料
    GetMaterialCodeList (id) {
      if (id) {
        this.dataList = []
        this.$http(`${BASICDATA_API.MATERIAL_LIST}`, 'POST', {factory: id, materialTypeCode: 'ZHAL'}).then(({data}) => {
          if (data.code === 0) {
            this.materialList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 查询
    GetList (st) {
      if (!this.formHeader.factory) {
        this.$message.error('请选择工厂')
        return false
      }
      this.$http(`${BASICDATA_API.STERILIZEMATERIALRATIOLIST}`, 'POST', this.formHeader).then(({data}) => {
        if (data.code === 0) {
          this.dataList = data.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    AddInfo () {
      this.formAdd = {
        id: '',
        factory: this.formHeader.factory,
        materialName: '',
        materialCode: '',
        ratio: '',
        remark: ''
      }
      this.factoryName = this.factory.find(item => item.deptId === this.formHeader.factory)['deptName']
      this.dialogVisibleAdd = true
    },
    AddSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formAdd.materialName = this.materialList.find(item => item.materialCode === this.formAdd.materialCode)['materialName']
          let msgText = '保存成功'
          if (this.formAdd.id !== '') {
            this.postUrl = BASICDATA_API.STERILIZEMATERIALRATIOUPDATE_API
          } else {
            this.postUrl = BASICDATA_API.STERILIZEMATERIALRATIOSAVE_API
            msgText = '提交成功'
          }
          this.$http(this.postUrl, 'POST', this.formAdd).then(({data}) => {
            if (data.code === 0) {
              this.$message.success(msgText)
              this.dialogVisibleAdd = false
              this.$refs[formName].resetFields()
              this.GetList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    EditInfo (row) {
      this.factoryName = row.factoryName
      this.formAdd = row
      this.dialogVisibleAdd = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    DeleteInfo () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选数据')
        return false
      }
      this.$confirm('确认要删除数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http(`${BASICDATA_API.STERILIZEMATERIALRATIODELETE_API}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.GetList()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.dialog__class{
  border-radius:6px 6px 6px 6px !important;
  .el-dialog__header{
    height:59px;
    background:rgba(24,144,255,1);
    border-radius:6px 6px 0px 0px;
    color: #fff;
    font-size:20px;
    .el-dialog__headerbtn .el-dialog__close{
      color: #fff
    }
  }
}
</style>
