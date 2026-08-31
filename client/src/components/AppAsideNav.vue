<template>
  <div class="app-aside-nav">
    <el-menu default-active="0" class="el-menu-vertical-demo"
      :collapse="isAsideCollapse"
      :collapse-transition="false">
      <el-menu-item index="1" @click="toggleAsideWidth">
        <i v-if="isAsideCollapse" class="el-icon-s-unfold"></i>
        <i v-else class="el-icon-s-fold"></i>
      </el-menu-item>
      <el-menu-item index="2" class="web-title" @click="go('/')">
        <img src="../assets/Logo.png" class="logo">
        <span slot="title"><b>Memoire</b></span>
      </el-menu-item>
      <el-menu-item index="3" @click="go('/dashboard')">
        <i class="el-icon-s-data"></i>
        <span slot="title">仪表盘</span>
      </el-menu-item>
      <el-menu-item index="4" @click="go('/list')">
        <i class="el-icon-s-grid"></i>
        <span slot="title">我的资产</span>
      </el-menu-item>
      <el-menu-item index="5" @click="go('/setting')">
        <i class="el-icon-s-tools"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AppAsideNav',
  computed: {
    ...mapState(['isAsideCollapse'])
  },
  methods: {
    go (target) {
      this.$router.push(target)
    },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    ...mapMutations(['TOGGLE_ASIDE_COLLAPSED']),
    toggleAsideWidth() {
      this.TOGGLE_ASIDE_COLLAPSED()
    }
  }
}
</script>
<style lang="less">
.app-aside-nav {
  height: 100vh;
  overflow: hidden;
}
.el-menu {
  height: 100%;
  .web-title {
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .logo {
      height: 24px;
      margin-right: 6px;
    }
  }
}
</style>