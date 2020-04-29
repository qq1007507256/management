<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name="frist"></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="second"></slot></el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
 
  
}
</script>

<style>

</style>