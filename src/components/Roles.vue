<template>
  <div>
    <!-- 面包屑导航插槽 -->
    <breadcrumb>
      <template v-slot:frist>权限管理</template>
      <template v-slot:second>角色列表</template>
    </breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列设置expand -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['center','bdbottom' ,i1===0? 'bdtop':''] "
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['center',i2===0?'':'bdtop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 node-key选择复选框对应的是id default-expand-all默认展开-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <el-tree ref='treeRef' :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "../components/breadcrumb";
export default {
  data() {
    return {
      //   所有角色列表数据
      rolelist: [],
    //   控制分配权限对话框显示隐藏
      setRightDialogVisible:false,
    //   所有的权限数据
    rightList:[],
    // 树形控件的属性绑定对象
    treeProps:{
        label:'authName',
        children:'children'
    },
    // 默认选择的节点id值数组
    defKeys:[],
    // 当前即将分配权限的角色id
    roleId:''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
    //   console.log(this.rolelist);
    },
    removeRightById(role, rightId) {
      //   弹框提升是否删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(res => {
              // this.getRoleList()
              role.children = res.data.data;
            })
            .catch(err => {
              return this.$message.error("删除权限失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async showSetRightDialog(role){
        this.roleId=role.id
        const {data:res} = await this.$http.get(`rights/tree`)
        if (res.meta.status!==200){this.$message.error('获取权限数据失败')}
        // 把获取到的权限数据保存到data中
        this.rightList=res.data
        console.log(this.rightList);
        // 递归获取三级权限的id
        this.getLeafKeys(role,this.defKeys);
        this.setRightDialogVisible=true
        
        
    },
    // 通过递归来获取角色的所有三级权限的id存入defkeys中
    getLeafKeys(node,arr){
      // 如果不包含children，就是三级权限
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        });
    },
    setRightDialogClosed(){
      this.defKeys=[]
    },
   async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()
        
      ];
      console.log(this.roleId);
      const idStr=keys.join(',')
      const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible=false
    }

  },
  components: {
    breadcrumb
  }
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>