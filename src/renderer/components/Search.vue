<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>关键词搜索</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入关键词"
            clearable
            v-model="quaryInfo.query"
            @clear="getQueryList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getQueryList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="checked">是否开启连词</el-checkbox>
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
            <el-button
              v-bind:disabled="scope.row.id == 1 ? true : false"
              type="primary"
              icon="el-icon-download"
              :modal="scope"
              size="small"
              circle
              @click="dow(scope.row)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              v-bind:disabled="scope.row.id == 1 ? true : false"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="del(scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>




    </el-card>
  </div>
</template>

<script>
import crypto from "crypto";

export default {
  data() {
    return {
      quaryInfo: {
        uid: window.sessionStorage.getItem("uid"),
        query: "",
      },
      fileList: [],
      key: "9cd5b4cf89949207",
      checked: false,
    };
  },
  methods: {
    aesCryption(data, secretKey) {
      var iv = "";
      const cipherEncoding = "utf8";
      const clearEncoding = "base64";
      var cipher = crypto.createCipheriv("aes-128-ecb", secretKey, iv);
      return (
        cipher.update(data, cipherEncoding, clearEncoding) +
        cipher.final(clearEncoding)
      );
    },
    async getQueryList() {
      const { data: res } = await this.$axios.get("/search", {
        params: {
          query: this.keywordProcess(this.quaryInfo.query),
          uid: this.quaryInfo.uid,
          checkbox : this.checked
        },
      });

      this.fileList = res.data.files;

      this.keywordProcess(this.quaryInfo.query);
    },
    keywordProcess(query_str) {
      if(query_str==null||query_str=='') return ''
      var final = "";

      var result = query_str.split(" ");

      for (let index = 0; index < result.length; index++) {
        var word = result[index];
        final += this.aesCryption(word, this.key) + " ";
      }

      return final;
    },
    dow(file) {
      var url = "http://localhost:8081/download?fid=" + file.id;
      var link = document.createElement("a");
      try {
        link.href = url;
      } catch (error) {
        link.href = window.URL.createObjectURL(url);
      }
      link.click();
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