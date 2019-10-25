<template>
  <div>
    <div class="main">
      <el-card class="searchCard  newCard">
        <el-row type="flex">
          <el-col :span="21">
            <el-form :inline="true" :model="formHeader" size="small" label-width="82px" class="topform">
              <el-form-item label="生产工厂：">
                <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产车间：">
                <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy.MM.dd" placeholder="选择" v-model="formHeader.inKjmDate" style="width: 180px"></el-date-picker>
              </el-form-item>
              <el-form-item label="生产工序：">
                <el-select v-model="formHeader.deptId" placeholder="请选择" style="width: 180px">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in deptId" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提交人员：">
                <p class="el-input" style="width: 180px">{{headList.changer}}</p>
              </el-form-item>
              <el-form-item label="提交时间：">
                <p class="el-input" style="width: 180px">{{headList.changed}}</p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" style="font-size: 14px;line-height: 32px">
            <div style="float:left">
              <span class="point" :style="{'background': headList.status === 'noPass'? 'red' : headList.status === 'saved'? '#1890f' : headList.status === 'submit' ? '#1890ff' : headList.status === '已同步' ?  '#f5f7fa' : 'rgb(103, 194, 58)'}"></span>状态：
              <span :style="{'color': headList.status === 'noPass'? 'red' : '' }">{{headList.status === 'noPass'? '审核不通过':headList.status === 'saved'? '已保存':headList.status === 'submit' ? '已提交' : headList.status === 'checked'? '通过':headList.status === '已同步' ? '未录入' : headList.status }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align:right" class="buttonCss">
          <template style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="GetTimeList" v-if="isAuth('ste:timeSheet:update')">查询</el-button>
            <el-button type="primary" class="button" size="small" @click="isRedact = !isRedact" v-if="searchCard && headList.status !== 'submit' && headList.status !== 'checked' && isAuth('ste:timeSheet:update')">{{isRedact?'取消':'编辑'}}</el-button>
          </template>
          <template v-if="isRedact && searchCard" style="float:right; margin-left: 10px;">
            <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')" v-if="isAuth('ste:timeSheet:update')">保存</el-button>
            <el-button type="primary" size="small" @click="SubmitForm" v-if="isAuth('ste:timeSheet:update')">提交</el-button>
          </template>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0">
      <div class="tableCard">
        <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <div v-show="searchCard">
        <el-card class="box-cards NewDaatTtabs">
          <el-card style="margin-bottom: 10px;position: relative" class="readyCard">
            <el-form :inline="true" :model="readyTimeDate" ref="timesForm" size="small" label-width="125px">
              <div class="clearfix">
                <h3 style="font-size: 14px;line-height: 32px;font-weight: bold;float: left">准备时间（分钟：min）</h3>
                <el-button type="text" class="readyshiftBtn manHour" name="manHourReady" style="bottom: 15px">收起<i class="el-icon-caret-top"></i></el-button>
                <el-form-item label="班次：" style="float: right;margin-right: 60px;margin-bottom: 10px">
                  <el-select v-model="readyTimeDate.classes" placeholder="请选择" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))">
                    <el-option label="白班" value="白班"></el-option>
                    <el-option label="中班" value="中班"></el-option>
                    <el-option label="夜班" value="夜班"></el-option>
                    <el-option label="多班" value="多班"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="manHourReadyBox">
                <el-row v-if="readyTimeDate.classes === '白班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                  <el-form-item label="交接班（白班）：">
                    <el-input v-model="readyTimeDate.dayChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="班前会：" label-width="80px">
                    <el-input v-model="readyTimeDate.dayChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产前准备：" label-width="100px">
                    <el-input v-model="readyTimeDate.dayChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产后清场：" label-width="100px">
                    <el-input v-model="readyTimeDate.dayChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                </el-row>
                <el-row v-if="readyTimeDate.classes === '中班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                  <el-form-item label="交接班（中班）：">
                    <el-input v-model="readyTimeDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="班前会：" label-width="80px">
                    <el-input v-model="readyTimeDate.midChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产前准备：" label-width="100px">
                    <el-input v-model="readyTimeDate.midChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产后清场：" label-width="100px">
                    <el-input v-model="readyTimeDate.midChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                </el-row>
                <el-row v-if="readyTimeDate.classes === '夜班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                  <el-form-item label="交接班（夜班）：">
                    <el-input v-model="readyTimeDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="班前会：" label-width="80px">
                    <el-input v-model="readyTimeDate.nightChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产前准备：" label-width="100px">
                    <el-input v-model="readyTimeDate.nightChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                  <el-form-item label="生产后清场：" label-width="100px">
                    <el-input v-model="readyTimeDate.nightChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status ==='noPass' || readyTimeDate.status ==='saved' || readyTimeDate.status ===''))"></el-input>
                  </el-form-item>
                </el-row>
              </div>
            </el-form>
          </el-card>
          <el-card style="margin-bottom: 10px">
            <h3 style="font-size: 14px;line-height: 32px;font-weight: bold">人员(小时:H)</h3>
            <worker ref="workerref" :isRedact="isRedact" :order="userOrder"></worker>
          </el-card>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {BASICDATA_API, KJM_API, STERILIZED_API} from '@/api/api'
import { headanimation, Readyanimation, getNewDate } from '@/net/validate'
import Worker from '@/views/components/worker'
export default {
  name: 'index',
  data () {
    return {
      uid: '',
      isRedact: false,
      searchCard: false,
      factory: [],
      workshop: [],
      deptId: [],
      userOrder: {
        orderId: '',
        factory: ''
      },
      headList: {},
      formHeader: {
        status: '',
        factory: '',
        workShop: '',
        inKjmDate: getNewDate(),
        deptId: ''
      },
      readyTimeDate: {
        id: '',
        status: '',
        classes: '多班',
        dayChange: '',
        dayChangeBefore: '',
        dayChangePre: '',
        dayChangeAfter: '',
        midChange: '',
        midChangeBefore: '',
        midChangePre: '',
        midChangeAfter: '',
        nightChange: '',
        nightChangeBefore: '',
        nightChangePre: '',
        nightChangeAfter: ''
      },
      readyTimeDate1: {
        id: '',
        status: '',
        classes: '多班',
        dayChange: '',
        dayChangeBefore: '',
        dayChangePre: '',
        dayChangeAfter: '',
        midChange: '',
        midChangeBefore: '',
        midChangePre: '',
        midChangeAfter: '',
        nightChange: '',
        nightChangeBefore: '',
        nightChangePre: '',
        nightChangeAfter: ''
      },
      userList: []
    }
  },
  watch: {
    'formHeader.factory' (n, o) {
      this.Getdeptbyid(n)
    },
    'formHeader.workShop' (n, o) {
      if (n) {
        this.GetParentline(n)
      }
    }
  },
  mounted () {
    headanimation(this.$)
    Readyanimation(this.$)
    this.Getdeptcode()
  },
  methods: {
    // 查询
    GetTimeList () {
      if (this.formHeader.factory === '' || this.formHeader.workShop === '' || this.formHeader.inKjmDate === '' || this.formHeader.deptId === '') {
        this.$message.error('请填写查询选项')
        return false
      }
      this.searchCard = false
      this.searchCard = true
      this.isRedact = false
      this.uid = ''
      this.$http(`${STERILIZED_API.STE_HOUR_LIST_API}`, 'POST', {
        deptId: this.formHeader.deptId,
        factory: this.formHeader.factory,
        inKjmDate: this.formHeader.inKjmDate,
        workShop: this.formHeader.workShop
      }).then(({data}) => {
        if (data.code === 0) {
          this.userOrder.factory = this.formHeader.factory
          if (data.headList.length === 0) {
            this.uid = this.uuid(32, 62)
            this.readyTimeDate = JSON.parse(JSON.stringify(this.readyTimeDate1))
            this.userOrder.orderId = this.uid
            this.headList = this.formHeader
            this.headList.status = ''
            this.headList.deptName = this.deptId.filter(item => item.deptId === this.headList.deptId)[0].deptName || ''
            this.$refs.workerref.GetTimeUserList(data.userList)
            this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory)
            this.$refs.workerref.getTree(this.formHeader.factory)
            this.$refs.workerref.GetProductShift(this.formHeader.factory)
          } else {
            if (data.readyList.length === 0) {
              this.readyTimeDate = this.readyTimeDate1
            } else {
              this.readyTimeDate = data.readyList[0]
            }
            this.headList = data.headList[0]
            this.userOrder.orderId = data.headList[0].id
            this.$refs.workerref.GetTimeUserList(data.userList)
            this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory)
            this.$refs.workerref.getTree(this.formHeader.factory)
            this.$refs.workerref.GetProductShift(this.formHeader.factory)
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 保存
    savedOrSubmitForm (str) {
      if (str === 'submit') {
        if (!this.readyTimeRul()) {
          return false
        }
        if (!this.$refs.workerref.userrul()) {
          return false
        }
      }
      let that = this
      let headSave = new Promise((resolve, reject) => {
        that.HeadSave(str, resolve, reject)
      })
      let readySave = new Promise((resolve, reject) => {
        that.ReadyTimeSave(str, resolve, reject)
      })
      let userSave = new Promise((resolve, reject) => {
        that.$refs.workerref.UpdateUser(str, resolve, reject)
      })
      if (str === 'submit') {
        let saveNet = Promise.all([headSave, readySave, userSave])
        saveNet.then(function () {
          let submit = new Promise((resolve, reject) => {
            that.manHourSubmit(str, resolve, reject)
          })
          let submitNet = Promise.all([submit])
          submitNet.then(function () {
            that.GetTimeList()
            that.$message.success('提交成功')
          }, err => {
            that.$message.error(err)
          })
        }, err => {
          that.$message.error(err)
        })
      } else if (str === 'saved') {
        let saveNet = Promise.all([headSave, readySave, userSave])
        saveNet.then(function () {
          that.GetTimeList()
          that.$message.success('保存成功')
        }, err => {
          that.$message.error(err)
        })
      }
    },
    SubmitForm () {
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedOrSubmitForm('submit')
      })
    },
    // 提交
    manHourSubmit (str, resolve, reject) {
      if (this.headList.deptName === '杀菌') {
        this.$http(`${STERILIZED_API.STE_HOUR_SUBMIT_API}`, 'POST', [this.readyTimeDate, this.$refs.workerref.GetUser(), this.headList]).then(({data}) => {
          if (data.code === 0) {
            if (resolve) {
              resolve('resolve')
            }
          } else {
            this.$message.error(data.msg)
            if (reject) {
              reject('提交' + data.msg)
            }
          }
        })
      } else {
        if (resolve) {
          resolve('resolve')
        }
      }
    },
    // 表头保存
    HeadSave (str, resolve, reject) {
      if (this.uid) {
        this.headList.id = this.uid
        this.headList.addOrupdate = '0'
      }
      this.headList.status = str
      console.log(this.headList)
      this.$http(`${STERILIZED_API.STE_HOUR_UPDATE_API}`, 'POST', this.headList).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          this.$message.error(data.msg)
          if (reject) {
            reject('表头保存' + data.msg)
          }
        }
      })
    },
    // 准备时间保存
    ReadyTimeSave (str, resolve, reject) {
      if (this.uid) {
        this.readyTimeDate.orderId = this.uid
      } else {
        this.readyTimeDate.orderId = this.headList.id
      }
      this.readyTimeDate.status = str
      this.readyTimeDate.dayChange = ((this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) ? this.readyTimeDate.dayChange + '' : this.readyTimeDate.dayChange)
      this.readyTimeDate.dayChangeBefore = ((this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) ? this.readyTimeDate.dayChangeBefore + '' : this.readyTimeDate.dayChangeBefore)
      this.readyTimeDate.dayChangePre = ((this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) ? this.readyTimeDate.dayChangePre + '' : this.readyTimeDate.dayChangePre)
      this.readyTimeDate.dayChangeAfter = ((this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0) ? this.readyTimeDate.dayChangeAfter + '' : this.readyTimeDate.dayChangeAfter)
      this.readyTimeDate.midChange = ((this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) ? this.readyTimeDate.midChange + '' : this.readyTimeDate.midChange)
      this.readyTimeDate.midChangeBefore = ((this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) ? this.readyTimeDate.midChangeBefore + '' : this.readyTimeDate.midChangeBefore)
      this.readyTimeDate.midChangePre = ((this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) ? this.readyTimeDate.midChangePre + '' : this.readyTimeDate.midChangePre)
      this.readyTimeDate.midChangeAfter = ((this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0) ? this.readyTimeDate.midChangeAfter + '' : this.readyTimeDate.midChangeAfter)
      this.readyTimeDate.nightChange = ((this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) ? this.readyTimeDate.nightChange + '' : this.readyTimeDate.nightChange)
      this.readyTimeDate.nightChangeBefore = ((this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) ? this.readyTimeDate.nightChangeBefore + '' : this.readyTimeDate.nightChangeBefore)
      this.readyTimeDate.nightChangePre = ((this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) ? this.readyTimeDate.nightChangePre + '' : this.readyTimeDate.nightChangePre)
      this.readyTimeDate.nightChangeAfter = ((this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0) ? this.readyTimeDate.nightChangeAfter + '' : this.readyTimeDate.nightChangeAfter)
      this.$http(`${KJM_API.OUTTIMEREADYSAVE_API}`, 'POST', this.readyTimeDate).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          this.$message.error(data.msg)
          if (reject) {
            reject('准备时间保存' + data.msg)
          }
        }
      })
    },
    // 校验
    readyTimeRul () {
      let ty = true
      let day = ((this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) && (this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) && (this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) && (this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0))
      let mid = ((this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) && (this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) && (this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) && (this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0))
      let night = ((this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) && (this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) && (this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) && (this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0))
      if (this.readyTimeDate.classes === '白班') {
        if (day) {} else {
          ty = false
          this.$message.error('准备时间白班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '中班') {
        if (mid) {} else {
          ty = false
          this.$message.error('准备时间中班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '夜班') {
        if (night) {} else {
          ty = false
          this.$message.error('准备时间夜班必填项未填写完全')
          return false
        }
      } else if (this.readyTimeDate.classes === '多班') {
        if (day && night) {} else {
          ty = false
          this.$message.error('准备时间多班必填项未填写完全')
          return false
        }
      }
      return ty
    },
    // 获取工厂
    Getdeptcode () {
      this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
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
      this.formHeader.deptId = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '杀菌'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
            if (data.typeList.length > 0) {
              this.formHeader.workShop = data.typeList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取产线
    GetParentline (id) {
      this.formHeader.deptId = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {parentId: id, deptType: 'process'}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            this.deptId = data.childList
            if (data.childList.length > 0) {
              this.formHeader.deptId = data.childList[0].deptId
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  },
  computed: {},
  components: {
    Worker
  }
}
</script>

<style lang="scss" scoped>
  .manHour {
    position: absolute;
    bottom: 8px;
    right: 10px;
    z-index: 999;
  }
</style>

<style lang="scss">
  .box-cards{
    .el-card__body{
      padding: 12px!important;
    }
  }
  .readyCard{
    input{
      width: 147px!important;
    }
  }
</style>
