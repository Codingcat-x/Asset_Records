<template>
  <div>
    <el-row :gutter="20" class="total-pannel">
      <el-col :span="6">
        <div class="card">
          <p>￥{{ money(summary.totalPrice) }}</p>
          <span>资产购入总价</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <p>{{ summary.count }}</p>
          <span>资产总数（件）</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <p>￥{{ money(summary.totalSellPrice) }}</p>
          <span>已卖出总价</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <p>{{ summary.soldCount }}</p>
          <span>已卖出（件）</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    // 四个统计都来自 store 的 summary getter，列表页拉取数据后此处自动同步
    ...mapGetters(['summary'])
  },
  methods: {
    // 金额格式：千分位 + 两位小数
    money (n) {
      return (Number(n) || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>

<style lang="less" scoped>
.total-pannel {
  .card {
    text-align: center;
    & p {
      font-size: 36px;
      font-weight: bold;
    }
    & span {
      font-size: 18px;
    }
  }
}
</style>
