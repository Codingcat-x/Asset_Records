<template>
  <div>
    <h3>{{ $route.meta.childTitle }}</h3>
    <div class="card d-flex sb">
      <span class="title">深色模式选项</span>
      <el-radio-group v-model="themeMode" size="small">
        <el-radio-button label="light">关闭</el-radio-button>
        <el-radio-button label="auto">跟随系统</el-radio-button>
        <el-radio-button label="dark">开启</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetDarkMode',
  computed: {
    themeMode: {
      get () {
        return this.$store.state.themeMode
      },
      set (val) {
        this.$store.commit('SET_THEME_MODE', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: var(--margin-size);
  .title {
    line-height: 50px;
  }
}

</style>
