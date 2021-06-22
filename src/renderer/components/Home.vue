<template>
  <el-container class="main-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img class="logo" src="../assets/qdulogo2.png" alt="logo" />
        <span>密文云存储系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面大主体区域 -->
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EEF"
          :collapse="isCollapse"
          unique-opened
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >

          <el-menu-item index="/welcome">
            <i class="el-icon-s-home"></i>
            <span>Welcome</span>
          </el-menu-item>
          <el-menu-item index="/myfile">
            <i class="el-icon-files"></i>
            <span>我的文件</span>
          </el-menu-item>
          <el-menu-item index="/uploadview">
            <i class="el-icon-upload"></i>
            <span>上传文件</span>
          </el-menu-item>
          <el-menu-item index="/searchview">
            <i class="el-icon-search"></i>
            <span>关键词搜索</span>
          </el-menu-item>
          <el-menu-item index="/opesearch">
            <i class="el-icon-search"></i>
            <span>OPE搜索</span>
          </el-menu-item>
          <el-menu-item index="/decrypt">
            <i class="el-icon-search"></i>
            <span>文件解密</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <!--右侧内容主体区域-->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      iconsObj: {
        125: "iconfont icon-yonghu",
        103: "iconfont icon-quanxian",
        101: "iconfont icon-shangpinchuangjian",
        102: "iconfont icon-5",
        145: "iconfont icon-icon-test",
      },
      // 是否折叠侧栏菜单
      isCollapse: false,
    };
  },
  created() {

  },
  methods: {
    /* 退出功能 */
    logout() {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("uid");
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

</script>
<style lang="less" scoped>
.main-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.main {
  background-color: #eaedf1;
}
.logo {
  border-radius: 50%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>
