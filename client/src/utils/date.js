// 日期工具：统一处理 yyyy-MM-dd 的解析与"使用天数"计算，
// 让列表卡片与详情页共用同一套规则。

// 把 yyyy-MM-dd 解析成本地零点，避免 new Date('yyyy-MM-dd') 按 UTC 解析产生时区偏差；解析失败返回 null
export function parseYmd (str) {
  if (!str) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str)
  if (!m) return null
  return new Date(+m[1], +m[2] - 1, +m[3])
}

// 今天的 yyyy-MM-dd（本地时区）
export function todayYmd () {
  const now = new Date()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

// 使用天数：已卖出 → 卖出日期 − 购买日期；未卖出 → 今天 − 购买日期。
// 缺购买日期记 0；已卖出但未填卖出时间时回退到今天；购买日期晚于结束日期按 0 处理。
// today 缺省取当天，调用方也可传入固定的"今天"以配合缓存/跨天刷新。
export function getUsageDays (item, today = todayYmd()) {
  const start = parseYmd(item.date)
  if (!start) return 0
  const end = item.isSold
    ? (parseYmd(item.sellTime) || parseYmd(today))
    : parseYmd(today)
  if (!end) return 0
  return Math.max(0, Math.round((end - start) / 86400000))
}
