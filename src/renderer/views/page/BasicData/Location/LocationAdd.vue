<template>
    <el-dialog
      title="新增库位"
      :close-on-click-modal="false"
      :visible.sync="visible"
      class="locationdialog1">
      <div style="width: 400px;margin: auto">
        <el-form ref="addLo" :model="formatDate" :rules="dataRule" size="small" label-width="110px" @keyup.enter.native="dataFormSubmit()" @submit.native.prevent>
          <el-form-item label="工厂：" prop="deptId">
            <el-select v-model="formatDate.factory" placeholder="请选择">
              <el-option label=""  value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车间：" prop="deptId">
            <el-select v-model="formatDate.deptId" placeholder="请选择">
              <el-option label=""  value=""></el-option>
              <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料类型：" prop="materialType">
            <el-select v-model="formatDate.materialType" placeholder="请选择">
              <el-option label=""  value=""></el-option>
              <el-option :label="item.code + ' ' + item.value" v-for="(item, index) in sapList" :key="index" :value="item.code + ' ' + item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码：">
            <el-input v-model="formatDate.materialCode" placeholder="手工录入"></el-input>
            <!--<el-select v-model="formatDate.material" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in SerchSapList"-->
                <!--:key="item.materialCode+' '+item.materialName"-->
                <!--:label="item.materialCode+' '+item.materialName"-->
                <!--:value="item.materialCode+' '+item.materialName">-->
              <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="库位：" prop="storageLocation">
            <el-input v-model="formatDate.storageLocation" placeholder="手工录入"></el-input>
          </el-form-item>
          <el-form-item label="是否样品库：">
            <el-select v-model="formatDate.isSample" placeholder="请选择">
              <el-option label="是"  value="1"></el-option>
              <el-option label="否"  value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发料/入库：" prop="materialOperation">
            <el-select v-model="formatDate.materialOperation" placeholder="请选择">
              <el-option label="发料"  value="发料"></el-option>
              <el-option label="入库"  value="入库"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API} from '@/api/api'
export default {
  name: 'LocationAdd',
  data () {
    return {
      visible: false,
      sapList: [],
      factory: [],
      workshop: [],
      formatDate: {
        factory: '',
        deptId: '',
        storageLocation: '',
        materialType: '',
        materialCode: '',
        isSample: '0',
        materialOperation: ''
      },
      submitType: true,
      dataRule: {
        deptId: [
          { required: true, message: '车间不能为空', trigger: 'blur' }
        ],
        materialType: [
          { required: true, message: '物料类型不能为空', trigger: 'blur' }
        ],
        storageLocation: [
          { required: true, message: '库位不能为空', trigger: 'blur' }
        ],
        materialOperation: [
          { required: true, message: '发料/入库不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'formatDate.factory' (n, o) {
      this.Getdeptbyid(n)
      this.spa(n)
    }
  },
  props: {
    // SerchSapList: {}
  },
  mounted () {
    this.Getdeptcode()
  },
  methods: {
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
      this.formatDate.deptId = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    init () {
      this.Getdeptbyid()
      this.visible = true
    },
    spa (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'material_type'}).then(({data}) => {
        if (data.code === 0) {
          this.sapList = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增
    dataFormSubmit () {
      if (this.formatDate.materialCode && this.formatDate.materialCode.length !== 10) {
        this.$message.error('物料编码为10位非必填')
        return false
      }
      if (this.submitType) {
        this.submitType = false
        this.$refs.addLo.validate((valid) => {
          if (valid) {
            this.formatDate.materialTypeCode = this.formatDate.materialType.substring(0, this.formatDate.materialType.indexOf(' '))
            this.formatDate.materialTypeName = this.formatDate.materialType.substring(this.formatDate.materialType.indexOf(' ') + 1)
            this.$http(`${BASICDATA_API.LOCATIONADD_API}`, 'POST', this.formatDate).then(({data}) => {
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
          } else {
            this.submitType = true
            return false
          }
        })
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss">
  .locationdialog1{
    .el-select,input{
      width: 100%!important;
    }
    .el-dialog{
      min-width: 450px;
    }
  }
</style>
<style scoped>

</style>
