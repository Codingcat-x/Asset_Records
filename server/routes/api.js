const express = require('express')
const fs = require('fs') // 同步 API（mkdirSync）
const fsPromises = fs.promises // 异步 API（readFile / writeFile）
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')

const router = express.Router()

// 数据文件：server/data/list.json
const DATA_FILE = path.join(__dirname, '../data/list.json')

// 上传目录：server/data/img（不存在则自动创建）
const IMG_DIR = path.join(__dirname, '../data/img')
fs.mkdirSync(IMG_DIR, { recursive: true })

// 读取列表（文件不存在或内容无效时返回空数组）
async function readList () {
  try {
    const raw = await fsPromises.readFile(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

// 写回列表
async function writeList (list) {
  await fsPromises.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
}

// 分类数据文件：server/data/categories.json
const CATEGORIES_FILE = path.join(__dirname, '../data/categories.json')

// 读取分类（文件不存在或内容无效时返回空数组）
async function readCategories () {
  try {
    const raw = await fsPromises.readFile(CATEGORIES_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

// 写回分类
async function writeCategories (list) {
  await fsPromises.writeFile(CATEGORIES_FILE, JSON.stringify(list, null, 2), 'utf-8')
}

// 从请求体中清洗出物品字段（保持与存储结构一致）
function normalizeItem (body) {
  return {
    cover: body.cover || '',
    name: body.name || '',
    date: body.date || '',
    buyPrice: typeof body.buyPrice === 'number' ? body.buyPrice : 0,
    isSold: !!body.isSold,
    category: body.category || '',
    note: body.note || '',
    sellPrice: typeof body.sellPrice === 'number' ? body.sellPrice : null,
    sellTime: body.sellTime || ''
  }
}

// multer 配置：图片保存到 data/img，保留原扩展名，限制 2MB 且仅允许图片
const storage = multer.diskStorage({
  destination: IMG_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png'
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  }
})

// POST /api/upload —— 接收封面上传（字段名 cover），返回可访问的 url
router.post('/upload', upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  // 返回相对路径，前端经 /api 代理可直接访问
  res.status(200).json({ url: `/api/img/${req.file.filename}` })
})

// GET /api/list —— 读取全部物品
router.get('/list', async (_req, res) => {
  try {
    const list = await readList()
    res.json(list)
  } catch (err) {
    console.error('读取数据失败：', err)
    res.status(500).json({ error: 'Failed to read data' })
  }
})

// GET /api/item/:id —— 按 id 读取单条物品
router.get('/item/:id', async (req, res) => {
  try {
    const list = await readList()
    const item = list.find(i => i.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (err) {
    console.error('读取数据失败：', err)
    res.status(500).json({ error: 'Failed to read data' })
  }
})

// PUT /api/add —— 新增一条物品（追加到 list.json）
router.put('/add', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const item = {
      id: crypto.randomUUID(),
      ...normalizeItem(req.body),
      timestamp: new Date().toISOString()
    }

    const list = await readList()
    list.push(item)
    await writeList(list)

    res.status(200).json({ message: 'Saved successfully', saved: item })
  } catch (err) {
    console.error('写入文件失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/item/:id —— 更新一条物品
router.put('/item/:id', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const list = await readList()
    const idx = list.findIndex(i => i.id === req.params.id)
    if (idx === -1) {
      return res.status(404).json({ error: 'Item not found' })
    }

    // 保留原 id 和创建时间戳，只更新物品字段
    list[idx] = {
      ...list[idx],
      ...normalizeItem(req.body)
    }
    await writeList(list)

    res.status(200).json({ message: 'Updated successfully', saved: list[idx] })
  } catch (err) {
    console.error('更新失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/item/:id —— 删除一条物品
router.delete('/item/:id', async (req, res) => {
  try {
    const list = await readList()
    const idx = list.findIndex(i => i.id === req.params.id)
    if (idx === -1) {
      return res.status(404).json({ error: 'Item not found' })
    }

    const [removed] = list.splice(idx, 1)
    await writeList(list)

    res.status(200).json({ message: 'Deleted successfully', removed })
  } catch (err) {
    console.error('删除失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/categories —— 获取全部分类
router.get('/categories', async (_req, res) => {
  try {
    const list = await readCategories()
    res.json(list)
  } catch (err) {
    console.error('读取分类失败：', err)
    res.status(500).json({ error: 'Failed to read categories' })
  }
})

// PUT /api/category —— 新增分类（name 必填，color 可选）
router.put('/category', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const category = {
      id: crypto.randomUUID(),
      name,
      color: req.body.color || '',
      timestamp: new Date().toISOString()
    }

    const list = await readCategories()
    list.push(category)
    await writeCategories(list)

    res.status(200).json({ message: 'Category created', saved: category })
  } catch (err) {
    console.error('写入分类失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/category/:id —— 更新分类（改 name / color）
router.put('/category/:id', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const list = await readCategories()
    const idx = list.findIndex(c => c.id === req.params.id)
    if (idx === -1) {
      return res.status(404).json({ error: 'Category not found' })
    }

    list[idx] = {
      ...list[idx],
      name,
      color: typeof req.body.color === 'string' ? req.body.color : (list[idx].color || '')
    }
    await writeCategories(list)

    res.status(200).json({ message: 'Category updated', saved: list[idx] })
  } catch (err) {
    console.error('更新分类失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/category/:id —— 删除分类，并返回引用该分类的物品数 inUse
router.delete('/category/:id', async (req, res) => {
  try {
    const list = await readCategories()
    const idx = list.findIndex(c => c.id === req.params.id)
    if (idx === -1) {
      return res.status(404).json({ error: 'Category not found' })
    }

    const [removed] = list.splice(idx, 1)
    await writeCategories(list)

    // 统计引用该分类的物品数，供前端删除前提示
    const items = await readList()
    const inUse = items.filter(i => i.category === removed.id).length

    res.status(200).json({ message: 'Category deleted', removed, inUse })
  } catch (err) {
    console.error('删除分类失败：', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
