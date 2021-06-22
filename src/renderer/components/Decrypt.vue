<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件解密</el-breadcrumb-item>
    </el-breadcrumb>

    <h1>我是文件解密</h1>

    <el-button @click="selectfile">选择要解密的文件</el-button>
    <el-button @click="saveplainfile">保存解密后的文件</el-button>
  </div>

</template>

<script>
import electron from "electron"
import fs from "fs";
import crypto from "crypto";
export default {
  data() {
    return {
      upcodedfilepath: '',
      key: "9cd5b4cf89949207",


    }
  },
  methods: {
    //传文件路径和 加密 key, 返回字符串.
    decryption_file(file_path, key) {
      var iv = "";
      var clearEncoding = 'utf8';
      var cipherEncoding = 'base64';
      var cipherChunks = [];
      var cipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
      cipher.setAutoPadding(true);

      var buf = fs.readFileSync(file_path, 'binary')

      console.log(buf)

      cipherChunks.push(cipher.update(buf, cipherEncoding, clearEncoding));
      cipherChunks.push(cipher.final(clearEncoding));

      return cipherChunks.join('');
    },
    selectfile() {
      const dialog = electron.remote.dialog

      dialog.showOpenDialog({
        title: '选择需要进行处理的文件',
        filters: [{
          name: '需要解密文件', extensions: ['qducodedfile']
        }]
      }).then(result => {

        this.upcodedfilepath = result.filePaths[0]
        console.log(result.filePaths[0])

        if (this.upcodedfilepath != null) {
          alert('获取到了文件路径')

        }

      })

    },
    saveplainfile() {
      const dialog = electron.remote.dialog
      dialog.showSaveDialog({
        title: '保存加密后文件',
        filters: [{
          name: '解密后文件', extensions: ['txt']
        }]

      }).then(result => {
        console.log(result.filePath)
        var decodedfile = this.decryption_file(this.upcodedfilepath, this.key)


        fs.writeFileSync(result.filePath, decodedfile)
        console.log('解密完成')
      }).catch(err => {
        console.log(err)
      })
    }

  }

}
</script>

<style>
</style>