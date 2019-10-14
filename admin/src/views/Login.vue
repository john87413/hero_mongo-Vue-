<template>
  <div class="login-container">
    <el-card header="請先登入" class="login-card">
      <el-form @submit.native.prevent="login()"> <!-- 這邊的native表示監聽這個form的表單事件 prevent 表示阻止表單默認提交 -->
        <el-form-item label="用戶名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>

        <el-form-item label="密碼">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">登錄</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async login(){
      const res = await this.$http.post('login' ,this.model)
      localStorage.token = res.data.token//瀏覽器關閉後會存取
      this.$router.push('/')
      this.$message({
        type: 'success',
        message: "登錄成功"
      })
      // sessionStorage.token = res.data.token //瀏覽器關閉後不會存取
    }
  }
};
</script>

<style scoped>
.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
