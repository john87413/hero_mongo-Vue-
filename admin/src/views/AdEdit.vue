<template>
  <div>
    <h1>{{id ? '編輯' : '新建'}}廣告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名稱">
        <el-input v-model="model.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" @click="model.items.push({})">
          <i class="el-icon-plus"></i>添加廣告
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="24" v-for="(item, index) in model.items" :key="index">
            <el-form-item label="跳轉鏈接(URL)" style="margin-top: 1rem">
              <el-input v-model="item.url"></el-input>
            </el-form-item>

            <el-form-item label="圖片" style="margin-top: 2rem">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="res => $set(item, 'image', res.url)"
              >
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label=" " style="margin-top: 2rem">
              <el-button size="small" type="danger" @click="model.items.splice(index,1)">刪除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        items: []
      }
    };
  },
  methods: {
    // 新增與編輯
    async save() {
      if (this.model.name != null) {
        let res;
        if (this.id) {
          res = await this.$http.put(`rest/ads/${this.id}`, this.model);
        } else {
          res = await this.$http.post("rest/ads", this.model);
        }
        this.$router.push("/ads/list");
        this.$message({ type: "success", message: "保存成功" });
      } else {
        this.$message.error("名稱不得為空");
      }
    },
    // 編輯時要拿到編輯之前的資料
    async fetch() {
      const res = await this.$http.get(`rest/ads/${this.id}`);
      this.model = Object.assign({}, this.model, res.data);
    }
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