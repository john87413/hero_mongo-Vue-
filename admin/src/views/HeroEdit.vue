<template>
  <div>
    <h1>{{id ? '編輯' : '新建'}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-tabs value="basic" type="border-card">
        <el-tab-pane label="基礎訊息" name="basic">
          <el-form-item label="名稱">
            <el-input v-model="model.name"></el-input>
          </el-form-item>

          <el-form-item label="稱號">
            <el-input v-model="model.title"></el-input>
          </el-form-item>

          <el-form-item label="頭像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'avatar', res.url)"
            >
              <img v-if="model.avatar" :src="model.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="banner">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'banner', res.url)"
            >
              <img v-if="model.banner" :src="model.banner" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="類型">
            <el-select v-model="model.categories" multiple>
              <el-option
                v-for="(item, index) in categories"
                :label="item.name"
                :value="item._id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="難度">
            <el-rate
              style="margin-top:0.6rem"
              :max="10"
              show-score
              v-model="model.scores.difficult"
            ></el-rate>
          </el-form-item>

          <el-form-item label="技能">
            <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.skills"></el-rate>
          </el-form-item>

          <el-form-item label="攻擊">
            <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.attack"></el-rate>
          </el-form-item>

          <el-form-item label="生存">
            <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.survive"></el-rate>
          </el-form-item>

          <el-form-item label="順風出裝">
            <el-select v-model="model.items1" multiple>
              <el-option
                v-for="(item, index) in items"
                :label="item.name"
                :value="item._id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="逆風出裝">
            <el-select v-model="model.items2" multiple>
              <el-option
                v-for="(item, index) in items"
                :label="item.name"
                :value="item._id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>

          <el-form-item label="對抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>

          <el-form-item label="團戰思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="技能">
          <el-button size="small" @click="model.skills.push({})">
            <i class="el-icon-plus"></i>添加技能
          </el-button>
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, index) in model.skills" :key="index">
              <el-form-item label="名稱">
                <el-input v-model="item.name"></el-input>
              </el-form-item>

              <el-form-item label="圖標">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="res => $set(item, 'icon', res.url)"
                >
                  <img v-if="item.icon" :src="item.icon" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>

              <el-form-item label="小提示">
                <el-input type="textarea" v-model="item.tips"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="small" type="danger" @click="model.skills.splice(index,1)">刪除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="margin-top:1rem">
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
      categories: [],
      items: [],
      model: {
        name: "",
        avatar: "",
        scores: {
          difficult: 0,
          skills: 0,
          attack: 0,
          survive: 0
        },
        skills: []
      }
    };
  },
  methods: {
    // 新增與編輯
    async save() {
      if (this.model.name != null) {
        let res;
        if (this.id) {
          res = await this.$http.put(`rest/heroes/${this.id}`, this.model);
        } else {
          res = await this.$http.post("rest/heroes", this.model);
        }
        // this.$router.push("/heroes/list"); //如果是要到某個url的話前面要加 '/' 不然會很奇怪
        this.$message({ type: "success", message: "保存成功" });
      } else {
        this.$message.error("名稱不得為空");
      }
    },
    // 編輯時要拿到編輯之前的資料
    async fetch() {
      const res = await this.$http.get(`rest/heroes/${this.id}`);
      this.model = Object.assign({}, this.model, res.data); //這樣才不會被覆蓋掉
    },
    // 拿到選取類型資料
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    // 拿到選取物品資料
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    }
  },
  created() {
    this.fetchItems();
    this.fetchCategories();
    this.id && this.fetch(); //表示如果有id 就執行 fetch 拿到要編輯的model
  },
  watch: {
    $route: function() {
      this.model = {
        name: "",
        avatar: "",
        scores: {
          difficult: 0
        }
      };
    }
  }
};
</script>

<style>
/* 寫在一個公用的style了 */
</style>