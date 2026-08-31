<template>
  <div class="add-page container">
    <item-form
      ref="itemForm"
      :value="form"
      submit-text="Save"
      :submit-loading="submitting"
      @submit="handleSubmit"></item-form>
  </div>
</template>

<script>
import { addItem } from '@/api/item'
import ItemForm from '@/components/ItemForm'

export default {
  name: 'Add',
  components: { ItemForm },
  data () {
    return {
      form: {
        cover: '',
        name: '',
        date: '',
        buyPrice: undefined,
        isSold: false,
        sellPrice: undefined
      },
      submitting: false
    }
  },
  methods: {
    async handleSubmit (form) {
      this.submitting = true
      try {
        const res = await addItem(form)
        this.$message.success(res.message || 'Saved successfully')
        // 保存成功后清空表单
        this.$refs.itemForm.handleReset()
        this.$router.push('/list')
      } catch (err) {
        this.$message.error(err.message || 'Save failed')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-page {
  padding: 20px;
}
</style>
