<template>
  <div class="app-header d-flex sb">
    <div class="left">
      <span class="page-title">{{ pageTitle }}</span>
    </div>
    <div class="right">
      <el-button class="norm-btn" icon="el-icon-arrow-left" size="mini" circle @click="back"></el-button>
      <el-button class="norm-btn" icon="el-icon-arrow-right" size="mini" circle @click="go"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add" circle></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  computed: {
    // 随路由变化实时更新：优先取路由 meta.title，没有则回退到路由 name
    pageTitle () {
      return this.$route.meta.title || this.$route.name
    }
  },
  methods: {
    add () {
      this.$router.push('/add')
    },
    go () {
      this.$router.forward()
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.app-header {
  line-height: 60px;
  height: 60px;
  .page-title {
    font-size: 24px;
    font-weight: 600;
  }
  .right {
    font-size: 14px;
    /* .el-button.norm-btn {
      background-color: #F2F6FC;
    } */

    .el-button {
      font-size: 16px;
    }
  }
}
</style>