<template>
  <div>
    <h1>{{id ? '編輯' : '新建'}}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名稱">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="圖標">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {}
    };
  },
  methods: {
    afterUpload(res){
        this.$set(this.model, 'icon', res.url)
        // this.model.icon = res.url
    },
    // 新增與編輯
    async save() {
      if (this.model.name != null) {
        let res;
        if (this.id) {
          res = await this.$http.put(`rest/items/${this.id}`, this.model);
        } else {
          res = await this.$http.post("rest/items", this.model);
        }
        this.$router.push("/items/list"); //如果是要到某個url的話前面要加 '/' 不然會很奇怪
        this.$message({ type: "success", message: "保存成功" });
      } else {
        this.$message.error("名稱不得為空");
      }
    },
    // 編輯時要拿到編輯之前的資料
    async fetch() {
      const res = await this.$http.get(`rest/items/${this.id}`);
      this.model = res.data;
    }
  },
  created() {
    this.id && this.fetch(); //表示如果有id 就執行 fetch 拿到要編輯的model
  },
  watch: {
      '$route':function () {
          this.model = {}
      }
  }
};
</script>

<style>
/* 寫在一個公用的style了 */
</style>