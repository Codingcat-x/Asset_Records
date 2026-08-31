<template>
  <div class="setting-page">
    <el-row :gutter="20">
      <el-col :span="10" class="left">
        <div v-for="(item, index) in list">
          <p class="card-title">{{ item.name }}</p>
          <div class="card">
            <ul class="setting-list">
              <li v-for="child in item.children" class="setting-item"
                @click="go(`/setting/${child.path}`)">{{ child.title }}
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="14" class="right">
        <div v-if="$route.path === '/setting'" class="placeholder d-flex center">
          <el-empty description="设置"></el-empty>
        </div>
        <router-view v-else></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      list: [
        {
          name: '外观设置',
          children: [
            { title: '深色模式', path: 'darkmode' },
            { title: '显示模式', path: 'displaymode' },
          ]
        },
        {
          name: '数据展示设置',
          children: [
            { title: '默认排序方式', path: 'sort_method' },
            { title: '物品分类标签', path: 'category_tag' },
            { title: '清除数据', path: 'delete_all' }
          ]
        },
        {
          name: '缓存设置',
          children: [
            { title: '清除缓存', path: 'delete_localstore' }
          ]
        },
        {
          name: '账号设置',
          children: [
            { title: '注销账号', path: 'delete_accunt' },
            { title: '退出登陆', path: 'logout' }
          ]
        },
        {
          name: '问题反馈',
          children: [
            { title: 'Github仓库地址', path: 'github' },
            { title: '电子邮件', path: 'sendemail' }
          ]
        },
      ]
    }
  },
  methods: {
    go (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
.setting-page {
  padding: 0 20px;
}
.left {
  height: var(--main-height);
  overflow-y: scroll;
  .setting-list {
    list-style: none;
    padding: 0;
    margin: 0;
    .setting-item {
      cursor: pointer;
      line-height: 48px;
      height: 48px;
      font-size: 16px;
      border-top: 1px solid var(--card-border-color);
    }
    .setting-item:first-child {
      border: none;
    }
  }
}
.right {
  height: var(--main-height);
  overflow-y: scroll;
  .placeholder {
    height: calc(100vh - 140px);
  }
}
</style>