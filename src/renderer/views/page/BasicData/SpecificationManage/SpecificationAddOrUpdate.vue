<template>
  <el-dialog
    :title="SpecificationId?'修改规格信息':'新增规格'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
      <el-form :model="dataForm" status-icon :rules="dataRule" ref="dataForm"  @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
        <el-form-item label="物料：" prop="material">
          <el-select v-model="dataForm.material" filterable placeholder="请选择" style="width: 100%" @change="setBrand" v-if="!SpecificationId">
            <el-option
              v-for="item in SerchSapList"
              :key="item.sapCode+' '+item.itemName+' '+item.kondm"
              :label="item.sapCode+' '+item.itemName+' '+item.kondm"
              :value="item.sapCode+' '+item.itemName+' '+item.kondm">
            </el-option>
          </el-select>
          <el-select v-model="dataForm.material" filterable placeholder="请选择" style="width: 100%" @change="setBrand" v-else disabled>
            <el-option
              v-for="item in SerchSapList"
              :key="item.sapCode+' '+item.itemName+' '+item.kondm"
              :label="item.sapCode+' '+item.itemName+' '+item.kondm"
              :value="item.sapCode+' '+item.itemName+' '+item.kondm">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌：" prop="brand">
          <el-input v-model="dataForm.brand" placeholder="请先选择物料" disabled></el-input>
        </el-form-item>
        <el-form-item label="大类：" prop="largeClass">
          <el-select v-model="dataForm.largeClass" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in largeClass" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="箱规格：" prop="boxSpec">
          <el-input v-model="dataForm.boxSpec" placeholder="手动输入"></el-input>
        </el-form-item>
        <el-form-item label="单位：" prop="boxSpecUnit">
          <el-select v-model="dataForm.boxSpecUnit" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in Unit" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="瓶规格：">
          <el-input v-model="dataForm.productSpec" placeholder="手动输入"></el-input>
        </el-form-item>
        <el-form-item label="单位：">
          <el-select v-model="dataForm.productSpecUnit" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in Unit" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护人：" v-if="SpecificationId">
          <el-input v-model="dataForm.changer" placeholder="手动输入" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'SpecificationAddOrUpdate',
  data () {
    return {
      visible: false,
      SpecificationId: '',
      largeClass: [],
      Unit: [],
      dataForm: {
        material: '',
        brand: '',
        largeClass: '',
        boxSpec: '',
        boxSpecUnit: '',
        productSpec: '',
        productSpecUnit: ''
      },
      dataRule: {
        material: [
          { required: true, message: '物料不能为空', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '品牌不能为空', trigger: 'blur' }
        ],
        largeClass: [
          { required: true, message: '大类不能为空', trigger: 'blur' }
        ],
        boxSpec: [
          { required: true, message: '箱规格不能为空', trigger: 'blur' }
        ],
        boxSpecUnit: [
          { required: true, message: '箱规格单位不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    SerchSapList: {}
  },
  mounted () {
    this.GetLargeClass()
    this.GetUnit()
  },
  methods: {
    // 设置品牌
    setBrand (val) {
      this.dataForm.brand = val.split(' ')[2]
    },
    // 大类下拉
    GetLargeClass () {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: '', type: 'category'}).then(({data}) => {
        if (data.code === 0) {
          this.largeClass = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 单位下拉
    GetUnit () {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: '', type: 'spe_unit'}).then(({data}) => {
        if (data.code === 0) {
          this.Unit = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    init (data) {
      if (data) {
        this.SpecificationId = data.id
        this.dataForm.id = data.id
        this.dataForm.material = data.materialCode + ' ' + data.materialName
        this.dataForm.brand = data.brand
        this.dataForm.largeClass = data.largeClass
        this.dataForm.boxSpec = data.boxSpec
        this.dataForm.boxSpecUnit = data.boxSpecUnit
        this.dataForm.productSpec = data.productSpec
        this.dataForm.productSpecUnit = data.productSpecUnit
        this.dataForm.changer = data.changer
      } else {
        this.SpecificationId = ''
        this.dataForm = {}
        this.dataForm.boxSpecUnit = '001'
        this.dataForm.productSpecUnit = '002'
      }
      this.visible = true
    },
    dataFormSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dataForm.materialCode = this.dataForm.material.split(' ')[0]
          this.dataForm.materialName = this.dataForm.material.split(' ')[1]
          this.dataForm.brand = this.dataForm.material.split(' ')[2]
          this.$http(`${!this.SpecificationId ? BASICDATA_API.SPECSAVE_API : BASICDATA_API.SPECUPDATE_API}`, 'POST', this.dataForm).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.submitType = true
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.submitType = true
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>
  .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }
</style>
