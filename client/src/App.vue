<template>
  <div id="app">
    <el-container>
      <el-aside>
        <app-aside-nav></app-aside-nav>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAsideNav from '@/components/AppAsideNav'

export default {
  name: 'App',
  components: {
    AppAsideNav
  }
}
</script>

<style lang="less">

</style>
