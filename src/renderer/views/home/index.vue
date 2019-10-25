<template>
    <div>
      <div class="row">
        <div  class="lefttab" :style="{width:isCollapse?'auto':'200px'}">
          <el-menu
            :collapse="isCollapse"
            :default-active="active"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#FFFF00"
            :router="true">
            <el-submenu index="basicdata" v-for="(item, index) in menuList" :key="index" v-if="item.children">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.menu_name}}</span>
              </template>
              <el-submenu v-for="(item1, index) in item.children" :key="index"  v-if="item1.children.length != 0">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item1.menu_name}}</span>
                </template>
                <el-menu-item index="" v-for="(item2, index) in item1.children" :key="index"  v-if="item2.children.length == 0">{{item2.menu_name}}</el-menu-item>
              </el-submenu>
              <el-menu-item index="orgStructure" v-for="(item1, index) in item.children" :key="index"  v-if="item1.children.length == 0">{{item1.menu_name}}</el-menu-item>
            </el-submenu>
            <!--<el-submenu index="basicdata">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-location"></i>-->
                <!--<span>基础数据</span>-->
              <!--</template>-->
              <!--<el-menu-item index="orgStructure">组织架构</el-menu-item>-->
              <!--<el-menu-item index="">容器管理</el-menu-item>-->
              <!--<el-menu-item index="">物料管理</el-menu-item>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="systemsetup">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-menu"></i>-->
                <!--<span slot="title">系统设置</span>-->
              <!--</template>-->
              <!--<el-menu-item index="">-->
                <!--<i class="el-icon-menu"></i>-->
                <!--<span slot="title">参数维护</span>-->
              <!--</el-menu-item>-->
              <!--<el-menu-item index="">-->
                <!--<i class="el-icon-menu"></i>-->
                <!--<span slot="title">角色管理</span>-->
              <!--</el-menu-item>-->
              <!--<el-menu-item index="">-->
                <!--<i class="el-icon-menu"></i>-->
                <!--<span slot="title">用户管理</span>-->
              <!--</el-menu-item>-->
            <!--</el-submenu>-->
            <!--<el-menu-item index="">-->
              <!--<i class="el-icon-document"></i>-->
              <!--<span slot="title">数据录入</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="">-->
              <!--<i class="el-icon-setting"></i>-->
              <!--<span slot="title">生管审核</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="">-->
              <!--<i class="el-icon-setting"></i>-->
              <!--<span slot="title">工资核算</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="">-->
              <!--<i class="el-icon-setting"></i>-->
              <!--<span slot="title">报表管理</span>-->
            <!--</el-menu-item>-->
          </el-menu>
        </div>
        <div class="rightmain">
          <div class="headfa">
            <div class="head">
              <p @click="()=>{if(isCollapse){isCollapse=false}else{isCollapse=true}}"><i class="el-icon-menu"></i></p>
            </div>
          </div>
          <router-view id="childrenRouter"/>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      active: '',
      menuList: [],
      isCollapse: false
    }
  },
  mounted () {
    this.menuList = JSON.parse(window.sessionStorage.getItem('menuList'))
    this.active = this.$route.path.substring(1, this.$route.path.length)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .row{
    width: 100%;
    height: 100%;
    display: flex;
    .lefttab::-webkit-scrollbar {display:none}
    .lefttab{
      max-width:200px;
      min-width: 160px;
      background: #545c64;
      overflow: auto;
    }
    .rightmain{
      flex: 1;
      height: 100%;
      .headfa{
        width: 100%;
        position: relative;
      }
      .head{
        width: 100%;
        position: absolute;
        height: 50px;
        line-height: 30px;
        padding: 10px;
        background: white;
        box-shadow: 0px 1px 4px 0px
        rgba(0, 21, 41, 0.12);
      }
      #childrenRouter{
        height: 100%;
        background: #f0f2f5;
        padding-top: 50px;
        overflow: auto;
      }
    }
  }
</style>
