<template>
  <div id="app">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth }">
        <app-aside-nav></app-aside-nav>
      </el-aside>
      <el-container>
        <el-header>
          <AppHeader></AppHeader>
        </el-header>
        <el-main style="padding: 0px 20px">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppAsideNav from '@/components/AppAsideNav'
import AppHeader from '@/components/AppHeader'

export default {
  name: 'App',
  components: {
    AppAsideNav, AppHeader
  },
  computed: {
    ...mapGetters(['asideWidth']),
  }
}
</script>

<style lang="less">
.el-main {
  height: calc(100vh - 60px);
  margin-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}
</style>
