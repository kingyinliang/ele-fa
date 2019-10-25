<template>
  <el-col v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
    <div class="main">
      <el-card class="searchCard">
        <el-row type="flex">
          <el-col>
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="85px" @keyup.enter.native="GetList(true)" @submit.native.prevent>
              <el-form-item label="工厂：">
                <el-select v-model="plantList.factory" placeholder="请选择">
                  <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车间：">
                <el-select v-model="plantList.workShop" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产线：">
                <el-select v-model="plantList.productLine" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="item.deptName" v-for="(item, index) in productline" :key="index" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考勤大类：">
                <el-select v-model="plantList.kqdl" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in ARtype" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态：">
                <el-select v-model="plantList.status" placeholder="请选择">
                  <el-option label="请选择"  value=""></el-option>
                  <el-option label="已保存"  value="saved"></el-option>
                  <el-option label="已提交"  value="submit"></el-option>
                  <el-option label="审核通过"  value="checked"></el-option>
                  <el-option label="审核不通过"  value="noPass"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期：">
                <el-date-picker type="date" placeholder="选择" value-format="yyyy-MM-dd" v-model="plantList.setDate" style="width: 200px"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 250px">
            <el-row style="margin-bottom: 18px">
              <el-button type="primary" size="small" @click="GetList(true)" v-if="isAuth('sys:att:listAtt')" style="margin-right: 48px">查询</el-button>
              <el-button type="danger" size="small" @click="delDate()" v-if="isAuth('sys:att:deleteAtt')">批量删除</el-button>
            </el-row>
            <el-button type="primary" size="small" @click="addAR()" v-if="isAuth('sys:att:saveAtt')">新增</el-button>
            <el-button type="primary" size="small" @click="saveAtt('saved')" v-if="isAuth('sys:att:updateAtt')">保存</el-button>
            <el-button type="primary" size="small" @click="saveAtt('submit')" v-if="isAuth('sys:att:updateAtt')">提交</el-button>
          </el-col>
        </el-row>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
    </div>
    <div class="main" style="padding-top: 0">
      <el-card class="tableCard">
        <div class="toggleSearchTop">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-row v-if="clearStatus">
          <el-table
            v-loading="tableLoding"
            ref="table1"
            header-row-class-name="tableHead"
            @selection-change="handleSelectionChange"
            :data="datalist"
            border
            tooltip-effect="dark"
            style="width: 100%;margin-bottom: 20px">
            <el-table-column
              type="selection"
              :selectable='checkboxT'
              width="34">
            </el-table-column>
            <el-table-column
              label="状态"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                {{scope.row.status === 'saved'? '已保存': scope.row.status === 'submit'? '已提交': scope.row.status === 'checked'?  '审核通过': scope.row.status === 'noPass'? '审核不通过':''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="reqno"
              label="订单号"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="workShopName"
              label="车间"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              prop="kqrq"
              label="考勤日期"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-date-picker size="small" type="datetime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" v-model="scope.row.kqrq" v-if="scope.row.redactStatus"></el-date-picker>
                <span v-else>{{scope.row.kqrq}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="考勤大类"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.kqdl" placeholder="请选择" size="small" @change="GetARpro(scope.row)" v-if="scope.row.redactStatus">
                  <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in ARtype" :key="index"></el-option>
                </el-select>
                <span v-else>{{scope.row.kqdlName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="考勤类型"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.kqlx" placeholder="请选择" size="small" @change="Setcode(scope.row)" v-if="scope.row.redactStatus">
                  <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in scope.row.ARpro" :key="index"></el-option>
                </el-select>
                <span v-else>{{scope.row.kqlxName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="产线/工序"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-col v-if="scope.row.redactStatus">
                  <el-select v-model="scope.row.productLine" placeholder="请选择" size="small" v-if="scope.row.productLineSt">
                    <el-option :label="item.deptName" v-for="(item, index) in scope.row.productlineList" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                  <el-select v-model="scope.row.productLine" placeholder="请选择" size="small" disabled v-else>
                    <el-option :label="item.deptName" v-for="(item, index) in scope.row.productlineList" :key="index" :value="item.deptId"></el-option>
                  </el-select>
                </el-col>
                <span v-else>{{scope.row.productLineName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="deptIdName"
              label="班组"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.deptId" placeholder="请选择" size="small" v-if="scope.row.redactStatus">
                  <el-option :label="iteam.deptName" :value="iteam.deptId" v-for="(iteam, index) in scope.row.Team" :key="index"></el-option>
                </el-select>
                <span v-else>{{scope.row.deptIdName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userType"
              label="人员属性"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userType" placeholder="请选择" size="small" v-if="scope.row.redactStatus">
                  <el-option label="正式" value="正式"></el-option>
                  <el-option label="借调" value="借调"></el-option>
                  <el-option label="临时工" value="临时工"></el-option>
                </el-select>
                <span v-else>{{scope.row.userType}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userId"
              label="姓名（工号）"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-col v-if="scope.row.redactStatus">
                  <span style="cursor: pointer" @click="selectUser(scope.row)" v-if="scope.row.userType!=='临时工'">
                    <i>{{scope.row.userId}}</i>
                    <i>点击选择人员</i>
                  </span>
                    <span style="cursor: pointer" @click="dayLaborer(scope.row)" v-if="scope.row.userType=='临时工'">
                    <i>{{scope.row.userId}}</i>
                    <i>点击输入临时工</i>
                  </span>
                </el-col>
                <span v-else>{{scope.row.userId}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="白/中/夜班"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.classType" placeholder="请选择" size="small" v-if="scope.row.redactStatus">
                  <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
                </el-select>
                <span v-else>{{scope.row.classTypeName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="工作内容"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content" v-if="scope.row.redactStatus" size="small" placeholder="手工录入"></el-input>
                <span v-else>{{scope.row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pieceTime"
              label="计件时数（小时）"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.pieceTime" v-if="scope.row.redactStatus" size="small" placeholder="手工录入"></el-input>
                <span v-else>{{scope.row.pieceTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="计时时数（小时）"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.timedTime" v-if="scope.row.redactStatus" size="small" placeholder="手工录入"></el-input>
                <span v-else>{{scope.row.timedTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="出勤时数（小时）"
              :show-overflow-tooltip="true"
              width="100">
              <template slot-scope="scope">
                {{scope.row.workTime = scope.row.timedTime + scope.row.pieceTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNo"
              label="审批意见"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="auditLog(scope.row.id)">审核日志</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" v-if="scope.row.redactStatus" size="small" placeholder="手工录入"></el-input>
                <span v-else>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="50">
              <template slot-scope="scope">
                <div v-if="isAuth('sys:att:updateAtt')">
                  <el-button style="padding: 0;" type="text" @click="updateAtt(scope.row)" v-if="scope.row.status !== 'checked' && scope.row.status !== 'submit'">{{scope.row.redactStatus?'保存':'编辑'}}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-table
          v-loading="tableLoding"
          v-if="!clearStatus"
          ref="table1"
          header-row-class-name="tableHead"
          :data="datalist"
          border
          tooltip-effect="dark"
          style="width: 100%;margin-bottom: 20px">
          <el-table-column
            label="车间"
            :show-overflow-tooltip="true"
            width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.workShop" placeholder="请选择" size="small" disabled>
                <el-option :label="item.deptName" v-for="(item, index) in workshop" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="考勤大类"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.kqdl" placeholder="请选择" size="small" @change="GetARpro(scope.row)">
                <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in ARtype" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="考勤类型"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.kqlx" placeholder="请选择" size="small" @change="Setcode(scope.row)">
                <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in scope.row.ARpro" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="产线/工序"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.productLine" placeholder="请选择" size="small" v-if="scope.row.productLineSt">
                <el-option :label="item.deptName" v-for="(item, index) in scope.row.productlineList" :key="index" :value="item.deptId"></el-option>
              </el-select>
              <el-select v-model="scope.row.productLine" placeholder="请选择" size="small" disabled v-else>
                <el-option :label="item.deptName" v-for="(item, index) in scope.row.productlineList" :key="index" :value="item.deptId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="deptId"
            label="班组"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.deptId" placeholder="请选择" size="small">
                <el-option :label="iteam.deptName" :value="iteam.deptId" v-for="(iteam, index) in scope.row.Team" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="人员属性"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.userType" placeholder="请选择" size="small">
                <el-option label="正式" value="正式"></el-option>
                <el-option label="借调" value="借调"></el-option>
                <el-option label="临时工" value="临时工"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名（工号）"
            :show-overflow-tooltip="true"
            width="120">
            <template slot-scope="scope">
              <span style="cursor: pointer" @click="selectUser(scope.row)" v-if="scope.row.userType!=='临时工'">
                <i v-for="(item,index) in scope.row.userId" :key="index">{{item}}，</i>
                <i>点击选择人员</i>
              </span>
              <span style="cursor: pointer" @click="dayLaborer(scope.row)" v-if="scope.row.userType=='临时工'">
                <i v-for="(item,index) in scope.row.userId" :key="index">{{item}}，</i>
                <i>点击输入临时工</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="白/中/夜班"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.classType" placeholder="请选择" size="small">
                <el-option :label="iteam.value" :value="iteam.code" v-for="(iteam, index) in productShift" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="工作内容"
            :show-overflow-tooltip="true"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.content" size="small" placeholder="手工录入"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="计件时数（小时）"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pieceTime" size="small" placeholder="手工录入" v-if="scope.row.pieceTimeSt"></el-input>
              <el-input v-model="scope.row.pieceTime" size="small" placeholder="手工录入" disabled v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="计时时数（小时）"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.timedTime" size="small" placeholder="手工录入"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="出勤时数（小时）"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              {{scope.row.workTime = (scope.row.timedTime * 1 + scope.row.pieceTime * 1) + ''}}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            :show-overflow-tooltip="true"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small" placeholder="手工录入"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="80">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="small" @click="delUser(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="clearStatus">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="plantList.currPage"
            :page-sizes="[10, 15, 20]"
            :page-size="plantList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="plantList.totalCount">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <el-dialog
      title="人员分配"
      :close-on-click-modal="false"
      :visible.sync="visible">
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
    <el-dialog
      width="450px"
      ref="dayLaborer"
      title="新增临时工"
      :close-on-click-modal="false"
      :visible.sync="visible1">
      <el-form :model="form" size="small" label-width="120px" class="dialogform">
        <el-row>
          <el-button type="primary" @click="addDayLaborer(selctId2)" size="small" style="float: right;margin-bottom: 10px" v-if="!clearStatus">新增</el-button>
        </el-row>
        <el-form-item label="临时工姓名：" v-for="(item, index) in selctId2" :key="index">
          <el-col :span="20">
            <el-input v-model="selctId2[index]"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" icon="el-icon-delete" circle @click="delselctId2(item)" v-if="!clearStatus"></el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="visible1 = false">取消</el-button>
          <el-button type="primary" @click="close(row)">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      width="850px"
      title="借调人员"
      :close-on-click-modal="false"
      :visible.sync="visible2">
      <el-row>
        <el-col style="width: 250px">
          <el-card style="height: 303px;overflow-y: scroll">
            <h3 style="font-size: 16px;color: black;margin-bottom: 10px">组织架构</h3>
            <el-tree :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" @node-click="setdetail" ref="tree2" :expand-on-click-node="false"></el-tree>
          </el-card>
        </el-col>
        <el-col style="width: 250px">
          <el-card style="height: 303px;overflow-y: scroll">
            <el-input v-model="filterText" size="small" placeholder="搜索人员"></el-input>
            <el-tree ref="userlistTree" :filter-node-method="filterNode" node-key="userId" @node-click="treeNodeClick" :data="userlist" show-checkbox :props="userListTreeProps"  :expand-on-click-node="false" @check-change="userTree"></el-tree>
          </el-card>
        </el-col>
        <el-col style="width: 50px;padding: 70px 5px">
          <el-button type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px" @click="delSelcted()" v-if="tree2Status"></el-button>
          <el-button type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px" @click="delSelcted()" v-else disabled></el-button>
          <el-button type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0" @click="addSelcted()" v-if="tree1Status"></el-button>
          <el-button type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0" @click="addSelcted()" v-else disabled></el-button>
        </el-col>
        <el-col style="width: 250px">
          <el-card style="height: 303px;overflow-y: scroll">
            <el-input v-model="filterText1" size="small" placeholder="搜索人员"></el-input>
            <el-tree ref="userlistTree1" :filter-node-method="filterNode1" :data="selctId" show-checkbox :props="selctListTreeProps"  :expand-on-click-node="false" @check-change="userTree1"></el-tree>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible2 = false">取消</el-button>
        <el-button type="primary" @click="saveduser(row)">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="审核日志"
      :close-on-click-modal="false"
      :visible.sync="visible3">
      <el-table
        :data="auditLogList"
        header-row-class-name="tableHead"
        border
        tooltip-effect="dark">
        <el-table-column
          prop="changer"
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="审核意见">
        </el-table-column>
        <el-table-column
          prop="changed"
          label="审核时间">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible3 = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-col>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API, AR_API} from '@/api/api'
import { setUserList, headanimation } from '@/net/validate'
// import { async } from ''
export default {
  name: 'index',
  data () {
    return {
      multipleSelection: [],
      form: {},
      visible: false,
      visible1: false,
      visible2: false,
      visible3: false,
      clearStatus: false,
      lodingS: false,
      tableLoding: false,
      redactStatus: false,
      factory: [],
      workshop: [],
      productline: [],
      datalist: [],
      auditLogList: [],
      ARtype: [],
      ARpro: [],
      OrgTree: [],
      arrList: [],
      filterText: '',
      filterText1: '',
      tree1Status: false,
      tree2Status: false,
      userListTreeProps: {
        label: function (data, node) {
          return data.realName + '（' + ((data.workNum !== null && data.workNum !== '') ? data.workNum : data.workNumTemp) + '）'
        },
        children: ''
      },
      selctListTreeProps: {
        label: function (data, node) {
          return data.label
        },
        children: ''
      },
      productShift: [],
      proline: [],
      Team: [],
      row: {},
      plantList: {
        factory: '',
        workShop: '',
        productLine: '',
        setDate: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + ((new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1) >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : ('0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate())),
        kqdl: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      saveData: [],
      userlist: [],
      selctId: [],
      selctId2: [],
      filterMethod (query, item) {
        return item.screncon.indexOf(query) > -1
      }
    }
  },
  watch: {
    'plantList.factory' (n, o) {
      this.Getdeptbyid(n)
      this.GetProductShift(n)
      this.GetARtype(n)
    },
    'plantList.workShop' (n, o) {
      this.GetParentline(n)
    }
  },
  mounted () {
    this.Getdeptcode()
    this.GetProductShift()
    this.GetARtype()
    this.getTree()
    headanimation(this.$)
  },
  methods: {
    // 获取生产班次
    GetProductShift (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'product_shift'}).then(({data}) => {
        if (data.code === 0) {
          this.productShift = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取考勤属性
    GetARpro (row, callback) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: this.plantList.factory, type: row.kqdl}).then(({data}) => {
        if (data.code === 0) {
          row.ARpro = data.dicList
          if (row.kqdl === 'normal_time') {
            row.kqlx = 'normal_time'
            this.Setcode(row)
          } else {
            row.kqlx = ''
          }
          this.datalist.splice(this.datalist.length, 0, {})
          this.datalist.splice(this.datalist.length - 1, 1)
        } else {
          this.$message.error(data.msg)
        }
        if (callback) {
          callback(null, 'one')
        }
      })
    },
    // 获取考勤类型
    GetARtype (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'KQ_type'}).then(({data}) => {
        if (data.code === 0) {
          this.ARtype = data.dicList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
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
      this.plantList.workShop = ''
      this.plantList.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id}).then(({data}) => {
          if (data.code === 0) {
            this.workshop = data.typeList
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
      this.plantList.productLine = ''
      if (id) {
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
          if (data.code === 0) {
            this.productline = data.childList
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.productline = []
      }
    },
    // 获取组织结构树
    getTree () {
      this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
        if (data.code === 0) {
          this.OrgTree = data.deptList
          this.arrList = [this.OrgTree[0].children[0].deptId]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 审核日志
    auditLog (row) {
      this.auditLogList = []
      this.visible3 = true
      this.$http(`${AR_API.ARAUDITLOG_API}`, 'POST', {id: row}).then(({data}) => {
        if (data.code === 0) {
          this.auditLogList = data.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 考勤类型下拉
    Setcode (row, callback) {
      if (row.kqlx === 'CIP_time') {
        row.pieceTime = 0
        row.pieceTimeSt = false
        row.productLineSt = true
      } else if (row.kqlx === 'CIP_time' || row.kqlx === 'door_time') {
        row.pieceTime = 0
        row.pieceTimeSt = false
        row.productLineSt = false
        row.productLine = ''
      } else if (row.kqlx === 'normal_time') {
        row.pieceTime = 0
        row.pieceTimeSt = false
        row.productLine = ''
        row.productLineSt = false
      } else {
        row.productLineSt = false
        row.productLine = ''
        row.pieceTimeSt = true
      }
      if (callback) {
        callback(null, 'two')
      }
    },
    // 新增
    addAR () {
      if (this.plantList.workShop === '') {
        this.$message.error('请选择车间后新增')
      } else {
        this.tableLoding = true
        if (this.clearStatus) {
          this.datalist = []
          this.clearStatus = false
        }
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: this.plantList.workShop}).then(({data}) => {
          if (data.code === 0) {
            let productlineList = data.childList
            this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {id: this.plantList.workShop, factory: this.plantList.factory}).then(({data}) => {
              if (data.code === 0) {
                let Listobj = {}
                if (this.datalist.length === 0) {
                  Listobj = {
                    productLineSt: false,
                    pieceTimeSt: true,
                    workShop: this.plantList.workShop,
                    kqdl: this.plantList.kqdl,
                    kqlx: '',
                    userType: '',
                    content: '',
                    classType: '',
                    deptId: '',
                    productlineList: productlineList,
                    Team: data.teamList,
                    userId: [],
                    timedTime: '0',
                    pieceTime: '0'
                  }
                } else {
                  Listobj = {
                    productLineSt: false,
                    pieceTimeSt: true,
                    workShop: this.datalist[this.datalist.length - 1].workShop,
                    kqdl: this.datalist[this.datalist.length - 1].kqdl,
                    kqlx: this.datalist[this.datalist.length - 1].kqlx,
                    content: this.datalist[this.datalist.length - 1].content,
                    userType: this.datalist[this.datalist.length - 1].userType,
                    classType: this.datalist[this.datalist.length - 1].classType,
                    deptId: this.datalist[this.datalist.length - 1].deptId,
                    productlineList: productlineList,
                    Team: data.teamList,
                    userId: [],
                    timedTime: this.datalist[this.datalist.length - 1].timedTime,
                    pieceTime: this.datalist[this.datalist.length - 1].pieceTime
                  }
                }
                let that = this
                let asyncfn = require('async')
                asyncfn.series([(callback) => {
                  that.GetARpro(Listobj, callback)
                }, (callback) => {
                  that.Setcode(Listobj, callback)
                }], (callback, results) => {
                  that.datalist.push(Listobj)
                  that.tableLoding = false
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 删除
    delDate () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择要删除的考勤')
      } else {
        this.$confirm('确认删除考勤, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${AR_API.ARDELAPI}`, 'POST', this.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.multipleSelection = []
              this.GetList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
    // 人员删除
    delUser (row) {
      this.datalist.splice(this.datalist.indexOf(row), 1)
    },
    // 获取列表
    GetList (st) {
      this.clearStatus = true
      if (st) {
        this.plantList.currPage = 1
      }
      if (!this.plantList.factory) {
        this.$message.error('请选择工厂')
      }
      this.lodingS = true
      this.$http(`${AR_API.ARLIST_API}`, 'POST', this.plantList).then(({data}) => {
        if (data.code === 0) {
          this.datalist = data.page.list
          this.plantList.currPage = data.page.currPage
          this.plantList.pageSize = data.page.pageSize
          this.plantList.totalCount = data.page.totalCount
        } else {
          this.$message.error(data.msg)
        }
        this.lodingS = false
      })
    },
    // 选择人员
    selectUser (row) {
      this.row = row
      if (row.userType === '借调') {
        this.SetSelecd()
      } else if (row.userType === '正式') {
        if (row.workShop) {
          this.GetUserforteam(row.deptId)
        } else {
          this.$message.error('请选择班组')
        }
      } else {
        this.$message.error('请选择人员属性')
      }
    },
    // 反写选中人
    SetSelecd () {
      this.selctId = []
      this.userlist = []
      this.tree1Status = false
      this.tree2Status = false
      if (!this.clearStatus) {
        this.row.userId.forEach((item, index) => {
          this.selctId.push({label: item})
        })
      } else {
        this.selctId.push({label: this.row.userId})
      }
      this.visible2 = true
    },
    // 根据部门id查人
    GetUserforteam (id) {
      this.$http(`${SYSTEMSETUP_API.USERALL_API}`, 'POST', id ? {dept_id: id} : {}).then(({data}) => {
        if (data.code === 0) {
          this.userlist = setUserList(data.listUser)
          if (!this.clearStatus) {
            this.selctId = this.row.userId
          } else {
            this.selctId = [this.row.userId]
            let usertemp = 1
            this.userlist.forEach((item, index) => {
              if (item.key === this.row.userId) {
                usertemp++
              }
            })
            if (usertemp === 1) {
              this.selctId = []
            } else {
              this.selctId = [this.row.userId]
            }
          }
          this.visible = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 确定人员
    updatauser (row) {
      if (!this.clearStatus) {
        row.userId = this.selctId
      } else {
        row.userId = this.selctId[0]
      }
      this.visible = false
    },
    // 搜索人员
    filterNode (value, data) {
      if (!value) return true
      let workNum = data.workNum ? data.workNum : data.workNumTemp
      return data.realName.indexOf(value) !== -1 || workNum.indexOf(value) !== -1
    },
    filterNode1 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 根据组织架构查人
    setdetail (data) {
      this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
        deptId: data.deptId,
        param: '',
        currPage: '1',
        pageSize: '1000'
      }).then(({data}) => {
        if (data.code === 0) {
          this.userlist = data.page.list
          this.tree1Status = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 树节点点击
    treeNodeClick (data) {
      if (JSON.stringify(this.$refs.userlistTree.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
        let arr = this.$refs.userlistTree.getCheckedNodes()
        arr.push(data)
        this.$refs.userlistTree.setCheckedNodes(arr)
      }
    },
    // 往左
    delSelcted () {
      this.$refs.userlistTree1.getCheckedNodes().forEach((item, index) => {
        this.selctId.splice(this.selctId.indexOf(item), 1)
      })
      this.tree2Status = false
    },
    // 往右
    addSelcted () {
      this.$refs.userlistTree.getCheckedNodes().forEach((item, index) => {
        let obj = {}
        obj.label = item.realName + '（' + ((item.workNum !== null && item.workNum !== '') ? item.workNum : item.workNumTemp) + '）'
        if (JSON.stringify(this.selctId).indexOf(JSON.stringify(obj)) === -1) {
          this.selctId.push(obj)
        }
      })
    },
    userTree () {
      if (this.$refs.userlistTree.getCheckedNodes().length > 0) {
        this.tree1Status = true
      } else {
        this.tree1Status = false
      }
    },
    userTree1 () {
      if (this.$refs.userlistTree1.getCheckedNodes().length > 0) {
        this.tree2Status = true
      } else {
        this.tree2Status = false
      }
    },
    // 借调人员确定
    saveduser (row) {
      if (!this.clearStatus) {
        row.userId = []
        this.selctId.forEach((item) => {
          row.userId.push(item.label)
        })
      } else {
        row.userId = this.selctId[0].label
      }
      this.visible2 = false
    },
    // 选择输入临时工
    dayLaborer (row) {
      this.row = row
      this.visible1 = true
      this.selctId2 = []
      if (!this.clearStatus) {
        this.row.userId.forEach((item) => {
          this.selctId2.push(item)
        })
      } else {
        this.selctId2.push(this.row.userId)
      }
    },
    // 临时工添加
    addDayLaborer (row) {
      row.push('')
    },
    // 临时工确定
    close (row) {
      if (!this.clearStatus) {
        row.userId = this.selctId2
      } else {
        row.userId = this.selctId2[0]
      }
      this.visible1 = false
    },
    // 临时工删除
    delselctId2 (item) {
      this.selctId2.splice(this.selctId2.indexOf(item), 1)
    },
    // 编辑
    updateAtt (row) {
      this.tableLoding = true
      if (row.redactStatus) {
        this.$http(`${AR_API.ARSUBORUP_API}`, 'POST', [row]).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            this.tableLoding = false
            this.GetList(true)
          } else {
            this.$message.error(data.msg)
          }
          this.lodingS = false
        })
      } else {
        row.redactStatus = true
        this.Setcode(row)
        this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: this.plantList.factory, type: row.kqdl}).then(({data}) => {
          if (data.code === 0) {
            row.ARpro = data.dicList
          }
        })
        this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: row.workShop}).then(({data}) => {
          if (data.code === 0) {
            let productlineList = data.childList
            this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {id: row.workShop, factory: row.factory}).then(({data}) => {
              if (data.code === 0) {
                row.productlineList = productlineList
                row.Team = data.teamList
                this.datalist.splice(this.datalist.length, 0, {})
                this.datalist.splice(this.datalist.length - 1, 1)
                this.tableLoding = false
              }
            })
          }
        })
      }
    },
    /**
     * 保存
     */
    // 校验
    datarul (data) {
      let st = true
      data.forEach((item, index) => {
        if (item.kqdl && item.kqlx && item.userType && item.userId.length !== 0 && item.classType && (item.timedTime || item.timedTime === 0)) {} else {
          this.$message.error('考勤必填项未填写')
          st = false
          return false
        }
      })
      return st
    },
    // 保存
    saveAtt (st) {
      if (this.clearStatus && this.multipleSelection.length <= 0) {
        this.$message.error('请选择考勤')
        return false
      }
      this.$confirm(`确认${st === 'saved' ? '保存' : '提交'}, 是否继续?`, `${st === 'saved' ? '保存' : '提交'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.clearStatus) {
          this.disData(st)
          if (st === 'submit') {
            if (!this.datarul(this.datalist)) {
              return false
            }
          }
          this.lodingS = true
          this.$http(`${AR_API.ARADD_API}`, 'POST', this.saveData).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.GetList(true)
            } else {
              this.$message.error(data.msg)
            }
            this.lodingS = false
          })
        } else {
          this.subAutio(st)
        }
      })
    },
    disData (st) {
      this.saveData = []
      for (var j = 0; j < this.datalist.length; j++) {
        for (var i = 0; i < this.datalist[j].userId.length; i++) {
          let temarr = JSON.parse(JSON.stringify(this.datalist[j]))
          temarr.userId = this.datalist[j].userId[i]
          temarr.factory = this.plantList.factory
          temarr.kqrq = this.plantList.setDate
          temarr.status = st
          this.saveData.push(temarr)
        }
      }
    },
    // updata
    subAutio (st) {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择考勤')
      } else {
        if (st === 'submit') {
          if (!this.datarul(this.multipleSelection)) {
            return false
          }
        }
        this.lodingS = true
        this.multipleSelection.forEach((item, index) => {
          item.status = st
        })
        this.$http(`${AR_API.ARSUBORUP_API}`, 'POST', this.multipleSelection).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            this.GetList(true)
          } else {
            this.$message.error(data.msg)
          }
          this.lodingS = false
        })
      }
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item)
      })
    },
    // 审核通过禁用
    checkboxT (row) {
      if (row.status === 'checked' || row.status === 'submit') {
        return 0
      } else {
        return 1
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.plantList.pageSize = val
      this.GetList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.plantList.currPage = val
      this.GetList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
  .searchCard { margin-bottom: 0; }
  .searchCard, .tableCard {
    position: relative;
    .toggleSearchTop {
      width: 100%; position: absolute; top: 0; left: 0; text-align: center; cursor: pointer; display: none;
    }
    .toggleSearchBottom {
      width: 100%; position: absolute; bottom: 0; left: 0; text-align: center; cursor: pointer;
    }
    .el-icon-caret-top:before,
    .el-icon-caret-bottom:before {
      color: #dcdfe6;
    }
  }
</style>
