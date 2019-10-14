<template>
  <div>
    <h1>{{id ? '編輯' : '新建'}}管理員</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用戶名稱">
        <el-input v-model="model.username"></el-input>
      </el-form-item>

      <el-form-item label="用戶密碼">
        <el-input type="text" v-model="model.password"></el-input>
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
      model: {},
    };
  },
  methods: {
    // 新增與編輯
    async save() {
      if (this.model.username != null) {
        let res;
        if (this.id) {
          res = await this.$http.put(`rest/admin_users/${this.id}`, this.model);
        } else {
          res = await this.$http.post("rest/admin_users", this.model);
        }
        this.$router.push("/admin_users/list");
        this.$message({ type: "success", message: "保存成功" });
      } else {
        this.$message.error("名稱不得為空");
      }
    },
    // 編輯時要拿到編輯之前的資料
    async fetch() {
      const res = await this.$http.get(`rest/admin_users/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.id && this.fetch(); //表示如果有id 就執行 fetch 拿到要編輯的model
  },
  watch: {
    $route: function() {
      this.model = {};
    }
  }
};
</script>