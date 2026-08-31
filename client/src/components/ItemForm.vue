<template>
  <div class="item-form">
    <el-form
      ref="itemForm"
      :model="form"
      :rules="rules"
      label-width="130px"
      label-position="left"
      class="form-body">

      <!-- Cover upload -->
      <div class="card">
        <el-form-item label="Cover" prop="cover">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            name="cover"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload">
            <img v-if="form.cover" :src="form.cover" class="cover-img">
            <div v-else class="cover-placeholder">
              <i class="el-icon-plus cover-uploader-icon"></i>
              <span class="cover-tip">上传封面</span>
            </div>
          </el-upload>
        </el-form-item>
      </div>

      <div class="card">
        <!-- Item name -->
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="form.name" placeholder="输入名称"></el-input>
        </el-form-item>

        <!-- Purchase / acquired date -->
        <el-form-item label="购买日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"></el-date-picker>
        </el-form-item>

        <!-- Category -->
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="选择分类" clearable style="width: 100%;">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id"></el-option>
          </el-select>
          <div class="form-tip">在设置里管理分类</div>
        </el-form-item>

        <!-- Purchase price -->
        <el-form-item label="购买价格" prop="buyPrice">
          <el-input-number
            v-model="form.buyPrice"
            :min="0"
            :precision="2"
            :controls="false"
            style="width: 100%;"></el-input-number>
        </el-form-item>
      </div>

      <!-- 备注信息 -->
      <div class="card">
        <el-form-item label="备注信息" prop="note">
          <el-input
            class="textarea"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="请输入内容"
            v-model="form.note">
          </el-input>
        </el-form-item>
      </div>

      <div class="card">
        <!-- Sold? -->
        <el-form-item label="是否卖出" prop="isSold">
          <el-switch
            v-model="form.isSold"
            active-text="已卖出"
            inactive-text="未卖出"></el-switch>
        </el-form-item>

        <!-- 已售出时才显示卖出价格与卖出时间 -->
        <template v-if="form.isSold">
          <el-form-item label="卖出价格" prop="sellPrice">
            <el-input-number
              v-model="form.sellPrice"
              :min="0"
              :precision="2"
              :controls="false"
              style="width: 100%;"></el-input-number>
          </el-form-item>

          <!-- 卖出时间 -->
          <el-form-item label="卖出时间">
            <el-date-picker
              v-model="form.sellTime"
              type="date"
              placeholder="选择卖出日期"
              value-format="yyyy-MM-dd"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </template>
      </div>

      <el-form-item class="btn-box">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ submitText }}</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCategories } from '@/api/category'

export default {
  name: 'ItemForm',
  props: {
    // 表单初始数据（编辑时传入已有物品）
    value: { type: Object, default: () => ({}) },
    submitText: { type: String, default: '保存' },
    submitLoading: { type: Boolean, default: false }
  },
  data () {
    return {
      form: {},
      categories: [],
      rules: {
        cover: [{ required: true, message: 'Please upload a cover', trigger: 'change' }],
        name: [{ required: true, message: 'Please enter the item name', trigger: 'blur' }],
        date: [{ required: true, message: 'Please select a date', trigger: 'change' }],
        buyPrice: [{ required: true, message: 'Please enter the purchase price', trigger: 'change' }]
      }
    }
  },
  created () {
    // 用父组件传入的数据作为表单初始值
    this.form = this.buildForm(this.value)
    this.fetchCategories()
  },
  watch: {
    // 关闭"已售出"时清空卖出价格与卖出时间，避免残留值随表单提交入库
    'form.isSold' (val) {
      if (!val) {
        this.form.sellPrice = undefined
        this.form.sellTime = ''
      }
    }
  },
  methods: {
    buildForm (val) {
      return {
        cover: val.cover || '',
        name: val.name || '',
        date: val.date || '',
        note: val.note || '',
        buyPrice: typeof val.buyPrice === 'number' ? val.buyPrice : undefined,
        isSold: !!val.isSold,
        category: val.category || '',
        sellPrice: typeof val.sellPrice === 'number' ? val.sellPrice : undefined,
        sellTime: val.sellTime || ''
      }
    },
    async fetchCategories () {
      try {
        this.categories = await getCategories()
      } catch (err) {
        // 分类拉取失败时下拉为空，不影响表单其他功能
        console.error('Failed to load categories:', err)
      }
    },
    beforeCoverUpload (file) {
      const isImage = file.type.indexOf('image/') === 0
      if (!isImage) {
        this.$message.error('Only image files are allowed')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image size cannot exceed 2MB')
        return false
      }
      return true
    },
    handleCoverSuccess (res) {
      if (res && res.url) {
        // 保存后端返回的可访问地址，随物品数据一并写入 list.json
        this.form.cover = res.url
        this.$message.success('Cover uploaded')
      }
    },
    async handleSubmit () {
      const valid = await this.$refs.itemForm.validate().catch(() => false)
      if (!valid) {
        this.$message.error('Please complete the form')
        return
      }
      this.$emit('submit', { ...this.form })
    },
    handleReset () {
      this.$refs.itemForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.form-body {
  width: 520px;
  margin: 0 auto;
}
.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}
.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409EFF;
  }
}
.cover-placeholder {
  width: 178px;
  height: 178px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
}
.cover-uploader-icon {
  font-size: 28px;
}
.cover-tip {
  margin-top: 8px;
  font-size: 14px;
}
.cover-img {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.card {
  margin-bottom: var(--margin-size);
  ::v-deep .textarea {
    font-size: 16px;
    font-family: "YaHei";
  }
}
.btn-box .el-button {
  width: 48%;
}
</style>
