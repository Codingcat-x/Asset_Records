<template>
  <div class="edit-page container" v-loading="loading">
    <item-form
      v-if="item"
      ref="itemForm"
      :value="item"
      submit-text="Update"
      :submit-loading="submitting"
      @submit="handleUpdate"></item-form>
    <div v-else-if="!loading" class="empty-box">Item not found</div>
  </div>
</template>

<script>
import { getItem, updateItem } from '@/api/item'
import ItemForm from '@/components/ItemForm'

export default {
  name: 'Edit',
  components: { ItemForm },
  data () {
    return {
      id: '',
      item: null,
      loading: false,
      submitting: false
    }
  },
  created () {
    this.id = this.$route.params.id
    this.fetchItem()
  },
  methods: {
    async fetchItem () {
      this.loading = true
      try {
        this.item = await getItem(this.id)
      } catch (err) {
        this.$message.error(err.message || 'Failed to load item')
      } finally {
        this.loading = false
      }
    },
    async handleUpdate (form) {
      this.submitting = true
      try {
        const res = await updateItem(this.id, form)
        this.$message.success(res.message || 'Updated successfully')
        this.$router.push('/list')
      } catch (err) {
        this.$message.error(err.message || 'Update failed')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.edit-page {
  padding: 20px;
  .empty-box {
    padding: 60px 0;
    text-align: center;
    color: #909399;
  }
}
</style>
