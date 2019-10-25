<template>
<el-dialog
  :title="!dataForm.id ? '新增' : '修改'"
  :close-on-click-modal="false"
  :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="ID" prop="id">
      <el-input v-model="dataForm.id" placeholder="请输入id"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="dataForm.type">
        <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
      <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
    </el-form-item>
    <el-form-item label="上级菜单" prop="parentName">
      <el-popover
        ref="menuListPopover"
        placement="bottom-start"
        trigger="click" style="height: 100%;overflow: auto">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          @current-change="menuListTreeCurrentChangeHandle"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree>
      </el-popover>
      <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
    </el-form-item>
    <el-form-item v-if="dataForm.type === 1 || dataForm.type === 3 || dataForm.type === 0" label="菜单路由" prop="url">
      <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
    </el-form-item>
    <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
      <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
    </el-form-item>
    <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
      <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
    </el-form-item>
    <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
      <el-row>
        <el-col :span="22">
          <el-popover
            ref="iconListPopover"
            placement="bottom-start"
            trigger="click"
            popper-class="mod-menu__icon-popover">
            <div class="mod-menu__icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                @click="iconActiveHandle(item)"
                :class="{ 'is-active': item === dataForm.icon }">
                <template>
                  <i :class="item" class="iconfont" style="font-size: 20px"></i>
                </template>
              </el-button>
            </div>
          </el-popover>
          <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
</el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/net/validate'
import { SYSTEMSETUP_API } from '@/api/api'
export default {
  name: 'menuAdd',
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      iconList: ['factory-shouye', 'factory-shezhi', 'factory-luru', 'factory-shenhe', 'factory-baobiao', 'factory-yibiao', 'factory-icon-test'],
      visible: false,
      type: true,
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮', '三级页面'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        id: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      submitType: true
    }
  },
  mounted () {
  },
  methods: {
    init (id) {
      this.$http(`${SYSTEMSETUP_API.MENUSELECT_API}`, 'GET', {}).then(({data}) => {
        this.menuList = treeDataTranslate(data.menuList, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          this.dataForm.id = id || 0
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.menuListTreeSetCurrentNode()
          this.type = true
        } else {
          // 修改
          this.type = false
          this.$http(`${SYSTEMSETUP_API.MENUINFO_API}/${this.dataForm.id}`, 'GET', {}).then(({data}) => {
            this.dataForm.id = data.menu.menuId
            this.dataForm.type = data.menu.type * 1
            this.dataForm.name = data.menu.name
            this.dataForm.parentId = data.menu.parentId
            this.dataForm.url = data.menu.url
            this.dataForm.perms = data.menu.perms
            this.dataForm.orderNum = data.menu.orderNum
            this.dataForm.icon = data.menu.icon
            this.menuListTreeSetCurrentNode()
          })
        }
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle (iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit () {
      if (this.submitType) {
        this.submitType = false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http(`${this.type ? SYSTEMSETUP_API.MENUADD_API : SYSTEMSETUP_API.MENUUPDATE_API}`, 'POST', {
              'menuId': this.dataForm.id || undefined,
              'type': this.dataForm.type,
              'name': this.dataForm.name,
              'parentId': this.dataForm.parentId,
              'url': this.dataForm.url,
              'perms': this.dataForm.perms,
              'orderNum': this.dataForm.orderNum,
              'icon': this.dataForm.icon
            }).then(({data}) => {
              if (data && data.code === 0) {
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
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
  .el-dialog__body { padding: 10px 20px; }
</style>
