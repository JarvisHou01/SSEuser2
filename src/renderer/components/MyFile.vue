<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的文件</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入文件名" clearable v-model="quaryInfo.query" @clear="getFileList">
            <el-button slot="append" icon="el-icon-search" @click="getFileList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table style="width: 100%" :data="fileList" border>
        <el-table-column label="#" width="60" prop="id"> </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="文件名"> </el-table-column>
        <el-table-column prop="uploadTime" label="上传日期"> </el-table-column>
        <el-table-column prop="md5" label="MD5值"> </el-table-column>
        <el-table-column prop="ope" label="OPE值"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--编辑按钮-->
            <el-button v-bind:disabled="scope.row.id == 1 ? true : false" type="primary" icon="el-icon-download" :modal="scope" size="small" circle @click="dow(scope.row)"></el-button>
            <!--删除按钮-->
            <el-button v-bind:disabled="scope.row.id == 1 ? true : false" type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quaryInfo: {
        uid: window.sessionStorage.getItem("uid"),
        query: "",
      },
      fileList: [],
    };
  },
  created() {
    this.getFileList();
  },
  methods: {
    async getFileList() {
      const { data: res } = await this.$axios.get("/files", {
        params: this.quaryInfo,
      });
      this.fileList = res.data.files;
    },
    async dow(file) {

      const data = await this.$axios.get("/download", { params: { fid: file.id }, responseType: "blob" })

      const fileName = data.headers['content-disposition'].match(
        /filename=(.*)/
      )[1]

      const blob = new Blob([data.data], { type: 'application/octet-stream' })
      const blobURL = window.URL.createObjectURL(blob)
      // 创建a标签，用于跳转至下载链接
      const tempLink = document.createElement('a')
      tempLink.href = blobURL
      tempLink.setAttribute('download', decodeURI(fileName))
      tempLink.click()
      // 释放blob URL地址
      window.URL.revokeObjectURL(blobURL)

    },
    async del(file) {
      const { data: res } = await this.$axios.get("/delete", {
        params: { fid: file.id },
      });
      console.log(res);

      this.getFileList();
    },
  },
};
</script>

<style>
</style>