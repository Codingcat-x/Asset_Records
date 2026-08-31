<template>
  <div class="review-page" v-loading="loading" element-loading-text="加载中...">
    <div class="title d-flex sb">
      <h2>{{ $route.meta.childTitle }}</h2>
      <div class="button-box">
        <el-button type="primary" icon="el-icon-edit"
        circle @click="goEdit(itemInfo.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete"
        circle @click="handleDelete"></el-button>
        <el-button type="warning" icon="el-icon-close"
          @click="closeReview" circle>
        </el-button>
      </div>
    </div>
    <div v-if="itemInfo" class="main">
      <img :src="itemInfo.cover" class="cover">
      <div class="card">
        <p><b>{{ itemInfo.name }}</b></p>
        <p>获得时间：{{ itemInfo.date }}</p>
        <p>已陪伴您：{{ daysSincePurchase }} 天</p>
      </div>
      <div class="card">
        <p class="note">备注信息：</p>
        <p>{{ itemInfo.note }}</p>
      </div>
      <div class="card">
        <p>购买价格：<span class="buy-price">￥{{ itemInfo.buyPrice }}</span></p>
        <p>日均价格：￥{{ daysSincePurchase ? (itemInfo.buyPrice / daysSincePurchase).toFixed(2) : '0.00' }}</p>
      </div>
      <div v-if="itemInfo.isSold" class="card">
        <p>卖出价格：<span class="sell-price">￥{{ itemInfo.sellPrice }}</span></p>
        <p>卖出时间：{{ itemInfo.sellTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem, deleteItem } from '@/api/item'
import { mapMutations } from 'vuex'
import { getUsageDays } from '@/utils/date'

export default {
  name: 'ListReview',
  data () {
    return {
      itemInfo: {},
      deleting: false,
      loading: false
    }
  },
  computed: {
    // 已使用天数
    daysSincePurchase () {
      return getUsageDays(this.itemInfo)
    }
  },
  watch: {
    // 监听 $route 对象的变化（深度监听）
    '$route': {
      immediate: true,   // 组件创建时立即执行
      handler(newRoute) {
        const id = newRoute.params.id
        if (id) {
          this.id = id
          this.fetchData(id)
        } else {
          // 没有 id，清空数据（可选项）
          this.assetData = null
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_REVIEW_SHOW']),
    async fetchData(id) {
      this.itemInfo = null
      this.loading = true
      // 模拟异步请求
      try {
        const data = await getItem(id)
        this.itemInfo = data
      } catch (err) {
        this.$message.error(err.message || '加载失败')
      } finally {
        this.loading = false
      }
    },
    closeReview () {
      this.SET_REVIEW_SHOW(false)    
      this.$router.push({ name: 'List' })
    },
    goEdit (id) {
      this.$router.push(`/edit/${id}`)
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteItem(this.itemInfo.id)
          this.$message.success(res.message || '删除成功')
          this.closeReview()
        } catch (err) {
          this.$message.error(err.message || '删除失败')
        } finally {
          this.deleting = false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style lang="less" scoped>
.review-page {
  .main {
    .card {
      margin-bottom: var(--margin-size);
      .buy-price {
        color: rgb(255, 56, 56);
        font-size: 18px; 
        font-weight: bold;
      }
      .sell-price {
        color: rgb(0, 198, 0);
        font-size: 18px; 
        font-weight: bold;
      }
    }
    .cover {
      width: 50%;
      margin: 0 auto var(--margin-size);
      border-radius: var(--card-border-radius);
    }
    .note {
      white-space: pre-wrap;      /* 保留换行并自动折行 */
      overflow-wrap: break-word;  /* 超长内容(如 URL)自动断行 */
    }
  }
}
</style>