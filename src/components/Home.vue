<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>电商后台管理系统</div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggleBur" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <!-- index只能绑定字符串，index为数值，后面加空字符串变成字符串 -->
          <el-submenu :index="index+''" v-for="(item,index) in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标：绑定动态的icomObj的属性，对应为每一个不同的图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="i.id+''" v-for="i in item.children" :key="i.id">
              <i class="el-icon-menu"></i>
              <!-- 文字 -->
              <span>{{i.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse:false
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    getMenuList() {
      this.$http.get("menus").then(res => {
        // console.log(res.data.data);
        if (res.data.meta.status !== 200)
          return this.$message.error(res.data.meta.msg);
        this.menulist = res.data.data;
      })
    },
    toggleCollapse(){
       this.isCollapse=!this.isCollapse
    }
  },
  created() {
    this.getMenuList();
  }
};
</script>

<style scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header div {
  font-size: 24px;
  color: antiquewhite;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu{
  border: 0px;
}
.toggleBur{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.25em;
  cursor: pointer;
}
</style>