import { get, put, del } from '@/utils/request'

// 获取全部物品列表
// GET /api/list
export function getList () {
  return get('/list')
}

// 按 id 获取单条物品
// GET /api/item/:id
export function getItem (id) {
  return get(`/item/${id}`)
}

// 新增一条物品记录，数据由后端写入 JSON 文件
// PUT /api/add
export function addItem (data) {
  return put('/add', data)
}

// 更新一条物品
// PUT /api/item/:id
export function updateItem (id, data) {
  return put(`/item/${id}`, data)
}

// 删除一条物品
// DELETE /api/item/:id
export function deleteItem (id) {
  return del(`/item/${id}`)
}
