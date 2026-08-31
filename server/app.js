const express = require('express')
const path = require('path')
const apiRouter = require('./routes/api')

const app = express()
const PORT = 3000

// 中间件：解析 JSON 格式的请求体
app.use(express.json())

// 静态服务：/api/img/* 映射到 data/img 目录，供前端访问已上传的图片
app.use('/api/img', express.static(path.join(__dirname, 'data/img')))

// 挂载 /api 路由（包含 PUT /api/add、GET /api/list、POST /api/upload）
app.use('/api', apiRouter)

// 统一错误处理：将 multer 等上传错误以 JSON 形式返回
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image size cannot exceed 2MB' })
  }
  res.status(400).json({ error: err.message || 'Upload failed' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`PUT /api/add will save records to data/list.json`)
})
