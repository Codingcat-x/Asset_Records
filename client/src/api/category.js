import { get, put, del } from '@/utils/request'

// 获取全部分类
// GET /api/categories
export function getCategories () {
  return get('/categories')
}

// 新增分类
// PUT /api/category
export function addCategory (data) {
  return put('/category', data)
}

// 更新分类
// PUT /api/category/:id
export function updateCategory (id, data) {
  return put(`/category/${id}`, data)
}

// 删除分类（返回 inUse 表示引用该分类的物品数）
// DELETE /api/category/:id
export function deleteCategory (id) {
  return del(`/category/${id}`)
}
