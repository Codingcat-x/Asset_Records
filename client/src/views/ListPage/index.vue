<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="isReview ? 16 : 24">
        <div class="list-control">
          <!-- 改用 Select 进行排序方式的选择 -->
          排序方式
          <el-select v-model="sortValue" placeholder="请选择" size="mini">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          分类
          <el-select v-model="categoryValue" placeholder="请选择" size="mini">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryValue"
              :label="item.label"
              :value="item.categoryValue">
            </el-option>
          </el-select>

          <!-- 每行元素个数：滑动选择器，3~6 -->
          <div class="cols-control">
            <span class="cols-label">每行</span>
            <el-slider
              v-model="cols"
              :min="2"
              :max="7"
              :show-tooltip="false"
              class="cols-slider"></el-slider>
            <span class="cols-value">{{ cols }}</span>
          </div>
        </div>
        <div class="list-pannel" v-loading="loading">
          <div
            v-if="sortedList.length"
            class="card-grid"
            :style="{ gridTemplateColumns: 'repeat(' + cols + ', 1fr)' }">
            <el-card
              v-for="item in sortedList"
              :key="item.id"
              class="item-card"
              :body-style="{ padding: '0px' }"
              shadow="hover"
              @click.native="openReview(item.id)"
              :class="{ active: $route.params.id == item.id, sold: item.isSold }">
              <div class="item-cover-wrap">
                <img v-if="item.cover" :src="item.cover" class="item-cover">
                <div v-else class="item-cover item-cover-placeholder">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </div>
              <div class="item-body">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price-row">
                  <span class="item-price">¥{{ item.buyPrice }}</span>
                  <span class="item-days">
                    {{ item.days }} 天
                  </span>
                </div>
              </div>
            </el-card>
          </div>
          <div v-else-if="!loading" class="empty-box">No data yet</div>
        </div>
      </el-col>
      <el-col :span="isReview ? 8 : 0">
        <div v-if="isReview" class="item-review">
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getUsageDays, todayYmd } from '@/utils/date'

export default {
  name: 'List',
  data () {
    return {
      loading: false,
      radio: '添加时间',
      cols: 4, // 每行元素个数（滑动选择器控制，3~6）
      today: todayYmd(), // 作为响应式依赖，跨天翻转以触发天数重算
      sortOptions: [
        { value: '添加时间' },
        { value: '购买时间升序' },
        { value: '购买时间降序' },
        { value: '价格升序' },
        { value: '价格降序' }
      ],
      sortValue: '添加时间',
      categoryOptions: [{
        categoryValue: 'all',
        label: '全部'
      }, {
        categoryValue: 'electronics',
        label: '数码电子'
      }, {
        categoryValue: 'games',
        label: '游戏'
      }, {
        categoryValue: 'app',
        label: '应用付费'
      }, {
        categoryValue: 'peijian',
        label: '配件'
      }],
      categoryValue: '全部'
    }
  },
  computed: {
    ...mapState(['isReview', 'items']),
    // 给每张卡预计算"使用天数"（已卖出算到卖出日，未卖出算到今天）。
    // 放在 computed 里做：依赖 items + today，只在拉取数据或跨天时重算一次，
    // 避免在模板里对每张卡每次渲染都调用方法。
    listWithDays () {
      return this.items.map(item => ({ ...item, days: getUsageDays(item, this.today) }))
    },
    // 按 radio 排序后的列表（返回新数组，不改动原始 list）
    sortedList () {
      const list = this.listWithDays.slice()
      switch (this.sortValue) {
        case '价格升序':
          return list.sort((a, b) => (a.buyPrice || 0) - (b.buyPrice || 0))
        case '价格降序':
          return list.sort((a, b) => (b.buyPrice || 0) - (a.buyPrice || 0))
        case '购买时间升序':
          return list.sort((a, b) => this.compareDate(a.date, b.date))
        case '购买时间降序':
          return list.sort((a, b) => this.compareDate(b.date, a.date))
        default: // 默认：保持后端返回的原始顺序
          return list
      }
    }
  },
  created () {
    this.fetchList()
    this.scheduleTodayRefresh()
  },
  mounted () {
    // 首次进入按视口宽度设定每行个数
    this._lastBucket = -1
    this.adjustColsByViewport()
    // 窗口尺寸变化时（跨断点）自动调整，防抖 200ms
    this._onResize = () => {
      clearTimeout(this._resizeTimer)
      this._resizeTimer = setTimeout(this.adjustColsByViewport, 200)
    }
    window.addEventListener('resize', this._onResize)
    // 标签页从后台切回时立即刷新"今天"，避免后台定时器被节流导致跨天计数滞后
    this._onVisibility = () => {
      if (document.visibilityState === 'visible') this.today = todayYmd()
    }
    document.addEventListener('visibilitychange', this._onVisibility)
  },
  methods: {
    ...mapMutations(['SET_REVIEW_SHOW']),
    // 定时刷新"今天"：算到下一个本地零点，到点翻转 today 并重新调度
    scheduleTodayRefresh () {
      clearTimeout(this._todayTimer)
      const now = new Date()
      const msTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now
      this._todayTimer = setTimeout(() => {
        this.today = todayYmd()
        this.scheduleTodayRefresh()
      }, msTillMidnight)
    },
    // 按视口宽度自动设置每行个数（断点：<1080→3，<1440→4，<1920→5，≥1920→6，最小 3）
    // 只在跨断点时自动调整，同一断点内保留用户手动拖动的值
    adjustColsByViewport () {
      const w = window.innerWidth
      const bucket = w < 580 ? 2 : w < 720 ? 3 : w < 1080 ? 4 : w < 1440 ? 5 : w < 1920 ? 6 : 7
      if (bucket !== this._lastBucket) {
        this._lastBucket = bucket
        this.cols = bucket
      }
    },
    toggleReviewShow () {
      this.SET_REVIEW_SHOW(true)
    },
    // 日期比较（date 为 yyyy-MM-dd，字符串可直接比较；空日期无论升降序都排最后）
    compareDate (a, b) {
      if (!a && !b) return 0
      if (!a) return 1
      if (!b) return -1
      return a < b ? -1 : a > b ? 1 : 0
    },
    async fetchList () {
      this.loading = true
      try {
        await this.$store.dispatch('fetchItems')
      } catch (err) {
        this.$message.error(err.message || 'Failed to load list')
      } finally {
        this.loading = false
      }
    },
    async openReview(id) {
      this.toggleReviewShow(true)
      this.$router.push(`/list/review/${id}`)
    }
  },
  watch: {
    // 从查看/详情返回列表时(路径参数消失)重新拉取，保证删除后列表同步
    '$route.params.id' (val) {
      if (!val) this.fetchList()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._onResize)
    document.removeEventListener('visibilitychange', this._onVisibility)
    clearTimeout(this._todayTimer)
    this.SET_REVIEW_SHOW(false)
  }
}
</script>

<style lang="less" scoped>
.list-control {
  height: 40px;
  padding: 0 0 6px;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.cols-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.cols-label {
  font-size: 12px;
  color: #909399;
}
.cols-slider {
  width: 140px;
}
.cols-value {
  width: 14px;
  font-size: 12px;
  color: #606266;
  text-align: center;
}
.list-pannel {
  height: calc(100vh - 130px);
  overflow-y: scroll;
}
.el-card.active {
  background-color: #FFF;
  border: 2px solid var(--primary-color);
}
// 卡片网格：列数由滑动选择器(cols)通过内联 gridTemplateColumns 控制
.card-grid {
  display: grid;
  font-size: 14px;
  gap: 16px;
}
.item-card {
  border-radius: 18px;
  background-color: var(--card-bg);
  .item-cover {
    width: 100%;
    aspect-ratio: 1 / 1; /* 正方形封面，宽高比 1:1 */
    display: block;
    object-fit: cover;
  }
  .item-cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #c0c4cc;
    font-size: 32px;
  }
  .item-body {
    padding: 12px;
    .item-name {
      // font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-price {
      // color: #e6a23c;
      font-weight: 600;
    }
    .item-days {
      font-size: 12px;
      color: #909399;
      white-space: nowrap;
      &.is-sold {
        color: #67c23a;
      }
    }
    .item-sell-price {
      margin-top: 8px;
      font-size: 12px;
      color: #67c23a;
    }
  }
  .item-cover-wrap {
    position: relative;
  }
  .item-edit-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none; /* 默认隐藏，悬停卡片时显示 */
  }
  &:hover .item-edit-btn {
    display: block;
  }
}

.empty-box {
  padding: 60px 0;
  text-align: center;
  color: #909399;
}

.item-review {
  height: calc(100vh - 90px);
  overflow-y: scroll;
  .card {
    width: 100%;
  }
}
</style>
