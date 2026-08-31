<template>
  <div class="app-category-nav">
    <el-button v-for="item in list" cricle @click="$router.push(`/list/${path}`)">{{ item.name }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'AppCategoryNav',
  data () {
    return {
      list: [
        { name: '默认', path: 'default' },
        { name: '电子数码', path: 'electronics' },
        { name: '游戏', path: 'games' },
        { name: '应用付费', path: 'app' },
        { name: '配件', path: 'accessories' }
      ]
    }
  }
}
</script>