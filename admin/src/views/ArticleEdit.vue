<template>
  <div>
    <h1>{{id ? '編輯' : '新建'}}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所屬分類">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="標題">
        <el-input v-model="model.title"></el-input>
      </el-form-item>

      <el-form-item label="詳情">
        <vue-editor useCustomImageHandler @image-added="handleImageAdded" v-model="model.body"></vue-editor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      categories: []
    };
  },
  methods: {
    // 新增與編輯
    async save() {
      if (this.model.title != null && this.model.categories != null) {
        let res;
        if (this.id) {
          res = await this.$http.put(`rest/articles/${this.id}`, this.model);
        } else {
          res = await this.$http.post("rest/articles", this.model);
        }
        this.$router.push("/articles/list");
        this.$message({ type: "success", message: "保存成功" });
      } else {
        this.$message.error("標題不得為空");
      }
    },
    // 編輯時要拿到編輯之前的資料
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },
    // 拿到我們所需要的分類
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    // 自定義文本編輯器裡面的上傳圖片
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file); //在服務端接收的字段名是file 可以看一下 routes/admin裡面的index.js

      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url); //類似於 將圖片插入光標位址
      resetUploader(); //重整那個編輯器的感覺
    }
  },
  created() {
    this.fetchCategories();
    this.id && this.fetch(); //表示如果有id 就執行 fetch 拿到要編輯的model
  },
  watch: {
    $route: function() {
      this.model = {};
    }
  }
};
</script>