<template>
  <div>
    <breadcrumb>
      <template v-slot:frist>权限管理</template>
      <template v-slot:second>权限列表</template>
    </breadcrumb>
    <el-card>
      <!-- stripe隔行变色 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="user">
            <el-tag v-if="user.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="user.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    
  </div>
</template>

<script>
import breadcrumb from "../breadcrumb";
export default {
  data() {
    return {
      // 權限列表
      rightsList: []
    };
  },
  components: {
    breadcrumb
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 獲取權限列表
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("獲取權限列表失敗");
      }
      this.rightsList = res.data;
      console.log(res.data);
    },
   
  }
};
</script>

<style>
</style>