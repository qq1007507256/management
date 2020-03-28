<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 添加序列号 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http.get("users", { params: this.queryInfo }).then(res => {
        //console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取用户列表失败");
        } else {
          //console.log(res.data.data.users);
          this.userlist = res.data.data.users;
          this.total = res.data.data.total;
        }
      });
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize=newSize;
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum=newPage;
      this.getUserList()
    },
    // 监听switch开关状态
    userStateChanged(userinfo){
     //console.log(userinfo);
    //  模板字符串
     this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
       console.log(res);
       if(res.data.meta.status!==200){
         userinfo.mg_state=!userinfo.mg_state;
         return this.$message.error('更新用户状态失败')
       }else{
         this.$message.success('更新用户状态成功')
       }
     })
    }
  }
};
</script>

<style scoped>
</style>