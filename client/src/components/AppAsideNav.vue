<template>
  <div class="menu-control-box">
    <el-radio-group v-model="isCollapse">
    <el-radio-button :label="false">展开</el-radio-button>
    <el-radio-button :label="true">收起</el-radio-button>
  </el-radio-group>
  <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <el-menu-item index="1">
      <i class="el-icon-setting"></i>
      <span slot="title">Dashboard</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-setting"></i>
      <span slot="title">List</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-setting"></i>
      <span slot="title">Setting</span>
    </el-menu-item>
  </el-menu>
</div>
</template>
<script>
export default {
  name: 'AppAsideNav',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang="less">
.el-menu {
  height: 100vh
}
</style>