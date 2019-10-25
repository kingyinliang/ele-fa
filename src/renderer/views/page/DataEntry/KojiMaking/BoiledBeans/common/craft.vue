<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="craftfrom" size="small" label-width="130px">
        <el-form-item label="预热开始时间：" :required="true">
          <el-date-picker v-model="craftfrom.preheatDate" type="datetime" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" placeholder="选择日期" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
        </el-form-item>
        <el-form-item label="下料开始时间：" :required="true">
          <el-date-picker v-model="craftfrom.unloadingStartDate" type="datetime" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" placeholder="选择日期" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
        </el-form-item>
        <el-form-item label="下料结束时间：" :required="true">
          <el-date-picker v-model="craftfrom.unloadingEndDate" type="datetime" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" placeholder="选择日期" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
        </el-form-item>
        <el-form-item label="预热时间(min)：" :required="true">
          <el-input v-model="timecha" disabled style="width:100px"></el-input>
          <!-- <el-date-picker v-model="craftfrom.preheatTime" type="datetime" placeholder="选择日期" size="small" format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="htitle">
        <span class="iconfont">&#xe60a;</span> 煮豆润水参数设置
        <el-button type="text" class="readyshiftBtn" name="runar" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
      </div>
      <div class="runarBox">
        <el-form :inline="true" size="small" label-width="130px" :model="craftfrom">
          <el-form-item label="润水比例:">
            <el-input class="liInputWidth" v-model="craftfrom.rateRunWater" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <!-- <el-form-item label="润水温度(°C):" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.tempRunWater" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item> -->
          <el-form-item label="润水变频(HZ):" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.frequenceRunWater" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="实际比例:" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.realRate" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="润水总量(L):" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.weightRunWater" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="润水流速(L/h):" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.speedRunWater" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="一次预热变频:" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.oncePreheatFrequency" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="二次预热变频:" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.secondPreheatFrequency" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="二次预热温度:" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.secondPreheatTemp" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="下料速度(KG/H):" :required="true">
            <el-input class="liInputWidth" v-model="craftfrom.unloadingSpeed" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
        </el-form>
        <div class="htitle">
          <span class="iconfont">&#xe608;</span> <span class="lh32px">过程监控数据记录</span>
          <el-button type="primary" size="small" style="float: right" @click="addlishui" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"> + 新增</el-button>
        </div>
        <el-table ref="runshuiTable" max-height="267" border header-row-class-name="tableHead" :data="lishuiList" :row-class-name="rowDelFlag">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column width="205">
            <template slot="header">
              <i class="reqI">*</i>
              <span>观察时间</span>
            </template>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.guardDate" type="datetime" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" placeholder="选择时间" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <i class="reqI">*</i>
              <span>润水/°C</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.runWaterTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <i class="reqI">*</i>
              <span>预热/°C</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.preheatTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <i class="reqI">*</i>
              <span>下料量</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.unloadingWeight" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template slot="header">
              <i class="reqI">*</i>
              <span>润水速度L/h</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.runWaterSpeed" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="changer" width="140"></el-table-column>
          <el-table-column label="操作时间" prop="changed" width="160"></el-table-column>
          <el-table-column width="50" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger"  @click="delrow(scope.row)" icon="el-icon-delete" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" circle size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div class="audit">
            <span class="iconfont">&#xe607;</span> <span>异常情况记录</span>
          </div>
          <div><el-input type="textarea" class="textarea" v-model="craftfrom.cookingException" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" style="width: 100%;height:40px"></el-input></div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="htitle">
        <span class="iconfont">&#xe604;</span> 连续蒸煮记录
        <el-button type="text" class="readyshiftBtn" name="zhengzhuar" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
      </div>
      <div class="zhengzhuarBox">
        <el-form :inline="true" size="small" :model="craftfrom">
          <el-form-item label="蒸煮变频(HZ):" :required="true">
            <el-input v-model="craftfrom.cookingFrequency" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="上转阀变频(HZ):" :required="true">
            <el-input v-model="craftfrom.upFrequency" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
          <el-form-item label="下转阀变频(HZ):" :required="true">
            <el-input v-model="craftfrom.downFrequency" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')"></el-input>
          </el-form-item>
        </el-form>
        <div class="htitle">
          <span class="lh32px"><span class="iconfont">&#xe608;</span> 过程监控数据记录</span>
          <el-button type="primary" @click="addzhengzhu" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" size="small" style="float: right"> + 新增</el-button>
        </div>
        <el-table ref="zhengzhuTable" max-height="267" border header-row-class-name="tableHead" :data="zhengzhuList" :row-class-name="rowDelFlag">
          <el-table-column  width="195">
            <template slot="header">
              <i class="reqI">*</i>
              <span>观察时间</span>
            </template>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.guardTime" type="datetime" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" placeholder="选择时间" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="压力/Mpa">
            <el-table-column width="110" label="蒸煮数显">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cookingPress" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110">
              <template slot="header">
                <i class="reqI">*</i>
                <span>蒸煮机械</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.cookingMachinePress" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110">
              <template slot="header">
                <i class="reqI">*</i>
                <span>分汽包</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.separateDrum" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="温度/°C">
            <el-table-column width="110" label="蒸煮数显">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cookingTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110">
              <template slot="header">
                <i class="reqI">*</i>
                <span>蒸煮机械</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.cookingMachineTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110" label="上转阀冷却">
              <template slot-scope="scope">
                <el-input v-model="scope.row.upCooling" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110">
              <template slot="header">
                <i class="reqI">*</i>
                <span>下转阀冷却</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.downCooling" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作人" prop="changer" width="140"></el-table-column>
          <el-table-column label="操作时间" prop="changed" width="160"></el-table-column>
          <el-table-column width="50" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" @click="delrow(scope.row)" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" icon="el-icon-delete" circle size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div class="audit"><span class="iconfont">&#xe607;</span> <span>异常情况记录</span></div>
          <div><el-input type="textarea" v-model="craftfrom.continuousCookingException" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" class="textarea" style="width:100%;height:40px"></el-input></div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="htitle">
        <span class="lh32px"><span class="iconfont">&#xe603;</span> 混合入曲控制</span>
        <el-button type="text" class="readyshiftBtn" name="hunhear" style="margin-left: 30px">收起<i class="el-icon-caret-top"></i></el-button>
        <el-button type="primary" size="small" @click="addhunhe" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" style="float: right"> + 新增</el-button>
      </div>
      <div class="hunhearBox">
        <el-table ref="hunheTable" max-height="267" border header-row-class-name="tableHead" :data="hunheList" :row-class-name="rowDelFlag">
          <el-table-column width="205">
            <template slot="header">
              <i class="reqI">*</i>
              <span>观察时间</span>
            </template>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.guardDate" type="datetime" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" placeholder="选择时间" size="small" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:171px"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <i class="reqI">*</i>
              <span>混合料/°C</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.mixtureTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot="header">
              <i class="reqI">*</i>
              <span>接种/°C</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.inoculationTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <i class="reqI">*</i>
              <span>煮豆感官</span>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.cookingFeel" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small">
                <el-option value="良好" label="良好"></el-option>
                <el-option value="异常" label="异常"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-button type="danger" @click="delrow(scope.row)" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" icon="el-icon-delete" circle size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div class="audit"><span class="iconfont">&#xe607;</span> <span>异常情况记录</span></div>
          <div><el-input type="textarea" v-model="craftfrom.blendException" :disabled="!(isRedact && this.craftfrom.status !== 'submit' && this.craftfrom.status !== 'checked')" class="textarea" style="width: 100%;height:40px"></el-input></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { dateFormat } from '@/net/validate'
import { KJM_API } from '@/api/api'
export default {
  name: 'caraft',
  data () {
    return {
      ids: '',
      craftfrom: {
        id: this.uuid(32, 62),
        orderHouseId: '', // 拿参
        preheatDate: '',
        unloadingStartDate: '',
        unloadingEndDate: '',
        preheatTime: '',
        rateRunWater: '',
        tempRunWater: '',
        frequenceRunWater: '',
        realRate: '',
        weightRunWater: '',
        speedRunWater: '',
        oncePreheatFrequency: '',
        secondPreheatFrequency: '',
        secondPreheatTemp: '',
        unloadingSpeed: '',
        cookingException: '',
        cookingFrequency: '',
        upFrequency: '',
        downFrequency: '',
        continuousCookingException: '',
        blendException: '',
        addOrupdate: '0'
      },
      lishuiList: [],
      zhengzhuList: [],
      hunheList: []
    }
  },
  props: ['isRedact', 'formHeader'],
  mounted () {
    // this.getuuid()
  },
  methods: {
    craftrules () {
      let ty = true
      if (this.craftfrom.preheatDate === '' || !this.craftfrom.preheatDate) {
        ty = false
        this.$message.error('预热开始时间不能为空')
        return false
      }
      if (this.craftfrom.unloadingStartDate === '' || !this.craftfrom.unloadingStartDate) {
        ty = false
        this.$message.error('下料开始时间不能为空')
        return false
      }
      if (!this.craftfrom.unloadingEndDate || this.craftfrom.unloadingEndDate === '') {
        ty = false
        this.$message.error('下料结束时间不能为空')
        return false
      }
      if (!this.craftfrom.frequenceRunWater || !this.craftfrom.realRate || !this.craftfrom.weightRunWater || !this.craftfrom.speedRunWater || !this.craftfrom.oncePreheatFrequency || !this.craftfrom.secondPreheatFrequency || !this.craftfrom.secondPreheatTemp || !this.craftfrom.unloadingSpeed || this.craftfrom.frequenceRunWater === '' || this.craftfrom.realRate === '' || this.craftfrom.weightRunWater === '' || this.craftfrom.speedRunWater === '' || this.craftfrom.oncePreheatFrequency === '' || this.craftfrom.secondPreheatFrequency === '' || this.craftfrom.secondPreheatTemp === '' || this.craftfrom.unloadingSpeed === '') {
        ty = false
        this.$message.error('煮豆润水参数不能为空')
        return false
      }
      if (this.lishuiList.length === 0) {
        ty = false
        this.$message.error('煮豆润水过程监控数据记录未填')
        return false
      }
      for (let items of this.lishuiList) {
        if (items.delFlag === '0') {
          if (!items.guardDate || items.guardDate === '' || !items.runWaterTemp || items.runWaterTemp === '' || !items.preheatTemp || items.preheatTemp === '' || !items.unloadingWeight || items.unloadingWeight === '' || !items.runWaterSpeed || items.runWaterSpeed === '') {
            ty = false
            this.$message.error('煮豆润水过程监控数据必填项不能为空')
            return false
          }
        }
      }
      if (this.craftfrom.cookingFrequency === '' || this.craftfrom.upFrequency === '' || this.craftfrom.downFrequency === '' || !this.craftfrom.cookingFrequency || !this.craftfrom.upFrequency || !this.craftfrom.downFrequency) {
        ty = false
        this.$message.error('连续蒸煮参数不能为空')
        return false
      }
      for (let items of this.zhengzhuList) {
        if (items.delFlag === '0') {
          if (!items.guardTime || items.guardTime === '' || !items.cookingMachinePress || items.cookingMachinePress === '' || !items.separateDrum || items.separateDrum === '' || !items.cookingMachineTemp || items.cookingMachineTemp === '' || !items.downCooling || items.downCooling === '') {
            ty = false
            this.$message.error('连续蒸煮监控数据必填项不能为空')
            return false
          }
        }
      }
      if (this.zhengzhuList.length === 0) {
        ty = false
        this.$message.error('过程监控数据记录未填')
        return false
      }
      if (this.hunheList.length === 0) {
        ty = false
        this.$message.error('混合入曲控制未填')
        return false
      }
      this.hunheList.forEach((item) => {
        if (item.delFlag === '0') {
          if (!item.guardDate || !item.mixtureTemp || !item.inoculationTemp || !item.cookingFeel || item.guardDate === '' || item.mixtureTemp === '' || item.inoculationTemp === '' || item.cookingFeel === '') {
            ty = false
            return false
          }
        }
      })
      if (!ty) {
        this.$message.error('混合入曲控制必填项未填')
        return false
      }
      return ty
    },
    updatezhu (resolve, reject) {
      this.$set(this.craftfrom, 'orderHouseId', this.formHeader.orderHouseId)
      this.$set(this.craftfrom, 'status', this.formHeader.submitStatus)
      this.$set(this.craftfrom, 'preheatTime', this.timecha)
      this.$http(`${KJM_API.DOUGONGYIZHUSAVE_API}`, 'POST', this.craftfrom).then(({data}) => {
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
    updatelishui (resolve, reject) {
      this.$http(`${KJM_API.DOUGONGYIRUISAVE_API}`, 'POST', this.lishuiList).then(({data}) => {
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
    updatezhengzhu (resolve, reject) {
      this.zhengzhuList.beanTechId = this.craftfrom.id
      this.$http(`${KJM_API.DOUGONGYIZHENGSAVE_API}`, 'POST', this.zhengzhuList).then(({data}) => {
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
    updatehunhe (resolve, reject) {
      this.hunheList.beanTechId = this.craftfrom.id
      this.$http(`${KJM_API.DOUGONGYIHUNSAVE_API}`, 'POST', this.hunheList).then(({data}) => {
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
    addlishui () {
      this.lishuiList.push({
        id: '',
        beanTechId: this.craftfrom.id,
        guardDate: '',
        runWaterTemp: '',
        preheatTemp: '',
        unloadingWeight: '',
        runWaterSpeed: '',
        delFlag: '0',
        remark: '',
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      })
      this.$nextTick(function () {
        this.$refs.runshuiTable.bodyWrapper.scrollTop = this.$refs.runshuiTable.bodyWrapper.scrollHeight
      })
    },
    addzhengzhu () {
      this.zhengzhuList.push({
        id: '',
        beanTechId: this.craftfrom.id,
        guardTime: '',
        cookingPress: '',
        cookingMachinePress: '',
        separateDrum: '',
        cookingTemp: '',
        cookingMachineTemp: '',
        upCooling: '',
        downCooling: '',
        remark: '',
        delFlag: '0',
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      })
      this.$nextTick(function () {
        this.$refs.zhengzhuTable.bodyWrapper.scrollTop = this.$refs.zhengzhuTable.bodyWrapper.scrollHeight
      })
    },
    addhunhe () {
      this.hunheList.push({
        id: '',
        beanTechId: this.craftfrom.id,
        guardDate: '',
        mixtureTemp: '',
        inoculationTemp: '',
        cookingFeel: '',
        remark: '',
        delFlag: '0',
        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      })
      this.$nextTick(function () {
        this.$refs.hunheTable.bodyWrapper.scrollTop = this.$refs.hunheTable.bodyWrapper.scrollHeight
      })
    },
    getList (formHeader) {
      this.$http(`${KJM_API.DOUGONGYILISTSAVE_API}`, 'POST', {orderHouseId: formHeader.orderHouseId}).then(({data}) => {
        if (data.code === 0) {
          this.craftfrom = data.technologyList[0]
          this.lishuiList = data.boiledList
          this.zhengzhuList = data.cookingList
          this.hunheList = data.blendList
          // this.wheatList = data.wheatList
          // this.soyList = data.pulpList
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      }).finally(() => {
        this.$emit('setApplyCraftState', this.craftfrom.status)
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
    }
  },
  computed: {
    timecha: function () {
      if (!this.craftfrom.unloadingStartDate || !this.craftfrom.preheatDate) {
        return 0
      } else {
        return (new Date(this.craftfrom.unloadingStartDate) - new Date(this.craftfrom.preheatDate)) / 60000
      }
    }
  },
  components: {
    AbnRecord: resolve => {
      require(['@/views/components/abnRecord'], resolve)
    }
  }
}
</script>

<style lang="less" scoped>
.liInputWidth {
  width: 119px;
}
.htitle {
  margin: 0 0 10px 0;
  overflow: hidden;
}
.audit{
  line-height: 32px;
  margin: 10px 0;
  i{
    font-size: 22px;
    float: left;
  }
  span{
    font-size: 16px;
  }
}
.reqI{
  color: red;
}
</style>
