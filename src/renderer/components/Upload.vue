<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件处理上传</el-breadcrumb-item>
    </el-breadcrumb>

    <el-upload ref="uploadRef" :limit="1" :file-list="fileList" :auto-upload="false" :http-request="myDiyRequest" action="">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>

    <br />

    <el-input type="textarea" :rows="9" placeholder="请输入内容" v-model="textarea">
    </el-input>

    <textarea name="tt" id="tt" cols="30" rows="10" v-model="textarea"></textarea>
  </div>
</template>

<script>
import fs from "fs";
import nodejieba from "nodejieba";
import crypto from "crypto";
import path from "path";
import os from "os"

export default {
  data() {
    return {
      fileList: [],
      textarea: "",
      key: "9cd5b4cf89949207",
      data: "",
      Alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
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
    submitUpload() {
      this.$refs.uploadRef.submit();
    },
    fileprocess(file) {
      console.log(file);
      var pos = file.lastIndexOf("\\");
      var filenamewithtype = file.substring(pos + 1);
      var end = filenamewithtype.lastIndexOf(".");
      var filenamewithouttype = filenamewithtype.substring(0, end);

      this.data = fs.readFileSync(file, "utf-8");

      var buf = fs.readFileSync(file);
      console.log(buf);
      console.log(buf.toString());
      var arrayBuf = buf.buffer;
      console.log(arrayBuf);

      var indexpath = this.createIndexFile(this.data, filenamewithouttype);
      var encfilepath = this.createEncryptedFile(this.data, filenamewithouttype);

      console.log(indexpath)
      console.log(encfilepath)

      var arrayBuf1 = fs.readFileSync(indexpath).buffer;
      var arrayBuf2 = fs.readFileSync(encfilepath).buffer;


      var indexfile = new File([new Blob([arrayBuf1])], filenamewithouttype + ".qducodedindex")
      var filefile = new File([new Blob([arrayBuf2])], filenamewithouttype + ".qducodedfile")



      return {
        'index': indexfile,
        'file': filefile
      };
    },
    myDiyRequest: function (param) {
      //自定义文件上传
      var fileObj = param.file;

      var index = this.fileprocess(fileObj.path).index
      var file = this.fileprocess(fileObj.path).file



      // 接收上传文件的后台地址
      var FileController = "http://localhost:8081/test3";
      // FormData 对象
      var form = new FormData();
      // 文件对象

      form.append("file", file);
      form.append("index", index);
      // 其他参数
      form.append("ope", 0);
      form.append("uid", window.sessionStorage.getItem("uid"));
      // XMLHttpRequest 对象
      var xhr = new XMLHttpRequest();
      
      xhr.open("post", FileController, true);
      xhr.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));


      
      // xhr.upload.addEventListener("progress", vm.progressFunction, false); //监听上传进度
      const that = this;
      xhr.onload = function () {
        // vm.Form.playUrl = xhr.response; //接收上传到阿里云的文件地址
        // vm.$message({
        //   message: "恭喜你，上传成功!",
        //   type: "success",
        // });
        that.$message.success("上传成功!");
      };
      xhr.send(form);


    },
    createIndexFile(data, name) {

      console.log("进入了createIndexFile")

      var tageddata = nodejieba.tag(data);
      var tempset = new Set();

      console.log("nodejieba成功")

      var final = "";
      // 对关键词进行顺序加密存储 和 进行去重存储
      for (let index = 0; index < tageddata.length; index++) {
        const element = tageddata[index];
        if (element.tag != "x") {
          final += this.aesCryption(element.word, this.key) + "\n";
          tempset.add(element.word);
          this.textarea += element.word + "\n"
        }
      }

      final += "=====End of sequential word storage=====" + "\n";

      var keywordset = tempset;
      var extractedkeyword = ''
      for (let v of keywordset) {
        var pattern2 = new RegExp("[A-Za-z]+");

        if (pattern2.test(v)) {
          // console.log("检测到英文,fuzzy");
          v = v.toLowerCase();
          // console.log(v.length);
          // 这里是fuzzy
          for (let index = v.length - 1; index < v.length; index++) {
            var sub1 = v.substr(0, index);
            var sub2 = v.substr(index + 1, v.length);

            for (
              let indexofalphabet = 0;
              indexofalphabet < this.Alphabet.length;
              indexofalphabet++
            ) {
              const element = this.Alphabet[indexofalphabet];
              var fuzzy = sub1 + element + sub2;
              final += this.aesCryption(fuzzy, this.key) + "\n";
            }
          }
        } else {
          // console.log("非英文");
          v = v.toLowerCase();
          // console.log(v);
          final += this.aesCryption(v, this.key) + "\n";
        }
      }

      // console.log(final);

      console.log("__dirname : " + __dirname);
      console.log("cwd       : " + process.cwd());
      console.log("os_path:"+os.homedir())

      var savepath = process.cwd() + "\\temp\\" + name + ".qducodedindex"
      // var savepath = os.homedir() + "\\temp\\" + name + ".qducodedindex"
      fs.writeFileSync(savepath, final);
      console.log("保存完成");

      return savepath
    },
    createEncryptedFile(data, name) {
      var iv = "";
      var clearEncoding = "binary";
      var cipherEncoding = "base64";
      var cipherChunks = [];
      var cipher = crypto.createCipheriv("aes-128-ecb", this.key, iv);
      cipher.setAutoPadding(true);

      // cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
      cipherChunks.push(cipher.update(Buffer.from(data, 'utf-8'), clearEncoding, cipherEncoding));
      cipherChunks.push(cipher.final(cipherEncoding));
      var result = cipherChunks.join("");
      var savepath = process.cwd() + "\\temp\\" + name + ".qducodedfile"
      // var savepath = os.homedir() + "\\temp\\" + name + ".qducodedfile"
      fs.writeFileSync(savepath, result);
      console.log("保存完成");
      return savepath
    },
  },
};
</script>

<style>
</style>