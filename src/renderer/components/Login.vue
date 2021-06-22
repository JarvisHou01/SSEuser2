<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/qdulogo.png" alt="logo" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginFrom"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-login_username"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            v-model="loginFrom.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')"
            >登录</el-button
          >
          <el-button type="info" @click="reset('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFrom: {
        username: "test",
        password: "test",
      },
      loginFormRules: {
        /* 验证规则 */
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      isLoding: false,
    };
  },
  methods: {
    /* 登录 */
    login: function (loginFormRef) {
      this.isLoding = true;
      this.$message.closeAll();
      this.$refs[loginFormRef].validate(async (valid) => {
        /* 验证失败 */
        if (!valid) return false;
        const that = this;
        /* 验证通过发送登录请求 */
        const res = await this.$axios
          .post("/login", this.loginFrom)
          .catch((error) => {
            console.log(error)
            this.isLoding = false;
            return that.$message.info("接口请求失败!");
          });
        console.log(res);

        const data = res.data.data;

        if (data === null) {
          this.isLoding = false;
          this.$message.error("登录失败!");
        } else {
          this.isLoding = false;
          this.$message.success("登录成功!");
          window.sessionStorage.setItem("token", data.token);
          window.sessionStorage.setItem("uid", data.uid);
          this.$router.push("/home");
        }
      });
    },
    /* 重置 */
    reset(loginFormRef) {
      this.$refs[loginFormRef].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>