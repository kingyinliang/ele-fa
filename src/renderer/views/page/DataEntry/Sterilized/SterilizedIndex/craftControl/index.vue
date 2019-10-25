<template>
  <div style="padding: 5px 10px">
    <el-card class="searchCard  newCard" style="margin-bottom: 5px">
      <el-row type="flex">
        <el-col>
          <form-head :formHeader="formHeader"></form-head>
        </el-col>
        <el-col style="width: 100px">
          <div style="padding-top: 30px"><span style="width: 5px;height: 5px;float: left;background: #1890FF;border-radius: 50%;margin-top: 7px;margin-right: 3px" :style="{'color': orderStatus === 'noPass'? 'red' : '' }"></span>{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : '未录入' }}</div>
        </el-col>
      </el-row>
      <el-row style="text-align:right;position: absolute;bottom:10px;right: 20px;" class="buttonCss">
        <template style="float:right; margin-left: 10px;">
          <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('wht:order:update')">{{isRedact?'取消':'编辑'}}</el-button>
        </template>
        <template v-if="isRedact" style="float:right; margin-left: 10px;">
          <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('wht:order:update')">保存</el-button>
          <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('sys:whtInStorage:submit')">提交</el-button>
        </template>
      </el-row>
    </el-card>
    <el-card class="searchCard  newCard">
      <el-tabs ref='tabs' v-model="activeName" class="NewDaatTtabs" type="border-card">
        <el-tab-pane name="1">
          <span slot="label" class="spanview">
            工艺控制
          </span>
          <el-form :inline="true" size="small" :model="crafData" class="topform">
            <el-form-item label="原汁换热介质：">
              <el-radio-group v-model="crafData.hotMedium" :disabled="!isRedact" style="width: 180px">
                <el-radio label="热水">热水</el-radio>
                <el-radio label="酱油">酱油</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="热水温度：" label-width="100px">
              <el-input v-model="crafData.hotTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="酱油温度：">
              <el-input v-model="crafData.sauceTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="原汁入锅温度：">
              <el-input v-model="crafData.originalTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="升温开始时间：">
              <el-date-picker type="datetime" placeholder="选择日期" v-model="crafData.upStartTime" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 180px"></el-date-picker>
            </el-form-item>
            <el-card class="searchCard  newCard" style="padding: 8px 4px">
              <h3>保温时间及屏显温度(手工录入)</h3>
              <el-form-item label="冷却开始时间：">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="crafData.coolingStartTime" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 170px"></el-date-picker>
              </el-form-item>
              <el-form-item label="机械温度：">
                <el-input v-model="crafData.mechanicalTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
              </el-form-item>
              <el-form-item label="出料温度：">
                <el-input v-model="crafData.dischargeTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
              </el-form-item>
              <el-form-item label="数显温度：">
                <el-input v-model="crafData.displayTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px"></el-input>
              </el-form-item>
              <el-form-item label="冷却结束时间：">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="crafData.coolingEndTime" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 170px"></el-date-picker>
              </el-form-item>
              <el-row>
                <el-button type="primary" size="small" @click="addresult()" style="float: right" :disabled="!isRedact" >新增</el-button>
              </el-row>
              <el-table header-row-class-name="tableHead" :data="crafData.result" :row-class-name="RowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="温度(℃)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.temp" :disabled="!isRedact" placeholder="手工录入" size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="记录时间">
                  <template slot-scope="scope">
                    <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" size="small" placeholder="选择日期" v-model="scope.row.created" :disabled="!isRedact"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手工录入" size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle size="small"  @click="dellist(scope.row)" :disabled="!isRedact"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="spanview">
            异常记录
          </span>
          <exc-record ref="excrecord" :isRedact="isRedact"></exc-record>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" class="spanview">
            文本记录
          </span>
          <text-record ref="textrecord" :isRedact="isRedact"></text-record>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ExcRecord from '@/views/components/excRecord'
import TextRecord from '@/views/components/textRecord'
import {STERILIZED_API} from '@/api/api'
import {Stesave} from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      isRedact: false,
      formHeader: {},
      activeName: '1',
      orderStatus: '',
      crafData: {
        changed: '',
        changer: '',
        coolingEndTime: '',
        coolingStartTime: '',
        created: '',
        creator: '',
        delFlag: '0',
        dischargeTemp: '',
        displayTemp: '',
        hotMedium: '热水',
        hotTemp: '',
        id: '',
        mechanicalTemp: '',
        orderId: '',
        originalTemp: '',
        remark: '',
        sauceTemp: '',
        status: '',
        upStartTime: '',
        result: []
      }
    }
  },
  mounted () {
    this.GetOrderHead()
  },
  methods: {
    // 获取工艺数据
    GetCraft () {
      this.$http(`${STERILIZED_API.STE_ENTER_CRAF_LIST_API}`, 'POST', {orderId: this.$store.state.common.sterilized.craftOrderId}).then(({data}) => {
        if (data.code === 0) {
          if (data.list) {
            this.crafData = data.list
            this.orderStatus = data.list.status
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增
    addresult () {
      this.crafData.result.push({
        changed: '',
        changer: '',
        created: '',
        creator: '',
        delFlag: '0',
        id: '',
        remark: '',
        serialNumber: '',
        techId: '',
        temp: ''
      })
    },
    // 删除
    dellist (row) {
      row.delFlag = '1'
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowDel'
      } else {
        return ''
      }
    },
    // 修改工艺数据
    UpdateCraft (str, resolve, reject) {
      if (this.crafData.status) {
        if (this.crafData.status === 'saved') { this.crafData.status = str } else if (this.crafData.status === 'noPass' && str === 'submit') { this.crafData.status = str }
      } else {
        this.crafData.status = str
      }
      this.crafData.orderId = this.formHeader.orderId
      this.$http(`${STERILIZED_API.STE_ENTER_CRAF_UPDATE_API}`, 'POST', this.crafData).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject('工艺保存' + data.msg)
          }
        }
      })
    },
    SbumitCarft (str, resolve, reject) {
      this.$http(`${STERILIZED_API.STE_ENTER_CRAF_SUBMIT_API}`, 'POST', {
        orderId: this.formHeader.orderId,
        upStartTime: this.crafData.upStartTime,
        coolingEndTime: this.crafData.coolingEndTime
      }).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          if (reject) {
            reject('工艺保存' + data.msg)
          }
        }
      })
    },
    // 保存提交
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    savedOrSubmitForm (str) {
      if (str === 'submit') {
      }
      let net0 = new Promise((resolve, reject) => {
        this.Stesave.orderUpdate(this, str, resolve, reject)
      })
      let net1 = new Promise((resolve, reject) => {
        this.Stesave.excUpdate(this, 'Craft', resolve, reject)
      })
      let net2 = new Promise((resolve, reject) => {
        this.Stesave.textUpdate(this, 'Craft', resolve, reject)
      })
      let net3 = new Promise((resolve, reject) => {
        this.UpdateCraft(str, resolve, reject)
      })
      if (str === 'submit') {
        let net4 = new Promise((resolve, reject) => {
          this.SbumitCarft(str, resolve, reject)
        })
        let submitNet = Promise.all([net0, net1, net2, net3, net4])
        submitNet.then(() => {
          this.$message.success('提交成功')
          this.GetOrderHead()
        }).catch((err) => {
          this.$message.error(err)
        })
      } else {
        let savedNet = Promise.all([net0, net1, net2, net3])
        savedNet.then(() => {
          this.$message.success('保存成功')
          this.GetOrderHead()
        }).catch((err) => {
          this.$message.error(err)
        })
      }
    },
    // 获取订单表头
    GetOrderHead () {
      this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {orderId: this.$store.state.common.sterilized.craftOrderId}).then(({data}) => {
        if (data.code === 0) {
          this.isRedact = false
          this.formHeader = data.list[0]
          this.Stesave = new Stesave(this.formHeader)
          this.$refs.excrecord.GetequipmentType(this.formHeader.productLine)
          this.$refs.excrecord.getDataList(this.formHeader.factory)
          if (this.formHeader.status !== '') {
            this.GetCraft()
            this.$refs.excrecord.GetExcDate({
              order_id: this.formHeader.orderId,
              sign: 'Craft'
            })
            this.$refs.textrecord.GetText({
              order_id: this.formHeader.orderId,
              sign: 'Craft'
            })
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  computed: {},
  components: {
    ExcRecord,
    TextRecord,
    FormHead: resolve => {
      require(['../components/formHead'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
