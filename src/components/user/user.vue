<template>
  <div>
    <!-- 面包屑导航区 -->
    <breadcrumb>
      <template v-slot:frist>用户管理</template>
      <template v-slot:second>用户列表</template>
    </breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
             
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"  @click="setRole(scope.row)"></el-button>
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
    <!-- dialog对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
  <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close="setRoleClosed"
  >
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>分配新角色：  <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import breadcrumb from "../breadcrumb";
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制对话框显示与隐藏
      addDialogVisible: false,
      addForm: { username: "", password: "", email: "", mobile: "" },
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户长度在3~10个字符之间",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "用户长度在6~15个字符之间",
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false,
      // 查询到的用户对象
      editForm: {},
      setRoleDialogVisible:false,
      // 需要被分配的角色
      userInfo:{},
      // 所有角色的数据列表
      rolesList:[],
      selectedRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 列表刷新
    // getUserList() {
    //   this.$http.get("users", { params: this.queryInfo }).then(res => {
    //     //console.log(res);
    //     if (res.data.meta.status != 200) {
    //       return this.$message.error("获取用户列表失败");
    //     } else {
    //       console.log(res.data.data.users);
    //       this.userlist = res.data.data.users;
    //       this.total = res.data.data.total;
    //     }
    //   });
    // },
    getUserList() {
      this.$http
        .get("users", { params: this.queryInfo })
        .then(res => {
          //console.log(res);

          console.log(res.data.data.users);
          this.userlist = res.data.data.users;
          this.total = res.data.data.total;
        })
        .catch(err => {
          return this.$message.error("获取用户列表失败");
        });
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关状态
    userStateChanged(userinfo) {
      //console.log(userinfo);
      //  模板字符串
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新用户状态失败");
          } else {
            this.$message.success("更新用户状态成功");
          }
        });
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if ((res.meta.status !== 201)) {
          this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功!");
        // 隐藏对话框
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 展示编辑用户对话框
    showEditDialog(id) {
      this.$http
        .get("users/" + id)
        .then(res => {
          console.log(res.data.data);
          this.editForm = res.data.data;
        })
        .catch(err => {
          return this.$message.error("查询用户信息失败" + err);
        });
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return; //发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功");
      });
    },
    removeUserById(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("users/" + id).then(res => {
            // 刷新页面写在这里再return之前，写在delete外面会在异步操作之前执行
            this.getUserList();
            return this.$message.success("删除用户成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      // 如果确认删除，返回confirm，取消删除返回cancel
      // console.log(confirmResult);
      // if(confirmResult!==confirm){
      //   return this.$message.info('已取消删除')
      // }
    },
    // 分配角色对话框
    async setRole(userInfo){
      this.userInfo=userInfo
      // 在展示角色对话框之前获取角色列表
      const{data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
          return this.$message.error("获取角色列表失败");
      }
      this.rolesList=res.data
      this.setRoleDialogVisible=true
      console.log(userInfo);
    },
    // 点击确定按钮分配角色
    async saveRoleInfo(){
       if(!this.selectedRoleId){
          return this.$message.error("请选择要分配的角色");
       }
       const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{
         rid:this.selectedRoleId
       })
       if(res.meta.status!==200){
          return this.$message.error("更新角色失败");
       }
        this.$message.success("更新角色成功");
        this.getUserList()
        this.setRoleDialogVisible=false
    },
    // 关闭分配角色触发事件
    setRoleClosed(){
      this.selectedRoleId=''
      this.userInfo={}
    }
  },
  components: {
    breadcrumb
  }
};
</script>

<style scoped>
</style>