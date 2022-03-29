<template>
  <div v-loading.fullscreen.lock="loading"  :element-loading-text="loadingText">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="addSignet">新增签章</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="signetList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="signetName"
            label="签章名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="签章图"
            align="center">
            <template slot-scope="scope">
              <img :src="scope.row.signetLook" style="width: 50px;" @click="lookSignetMethon(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="updateSignet(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" style="margin-left: 15px;" @click="deleteSignet(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="signetSave.title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%">
      <el-form label-width="100px">
        <el-form-item label="签章名称:">
          <el-input v-model="signetForm.signetName"></el-input>
        </el-form-item>
        <el-form-item label="签章文件:" prop="excelFile">
          <el-upload
            class="upload-demo"
            ref="upload"
            :on-change="changeUpload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="1"
            :file-list="signetForm.fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
          </el-upload>
          <span style="color: red; font-size: 12px;">说明: 签章图片，目前只支持上传 .png 格式</span>
        </el-form-item>
        <el-form-item label="签章:" v-if="signetImg !== ''">
          <img :src= "signetImg" width="150px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dropSignet">取 消</el-button>
        <el-button type="primary" @click="saveSignetData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看签章"
      :visible.sync="lookSignet"
      width="30%">
      <img :src="lookSignetUrl" width="200px;"/>
    </el-dialog>
  </div>
</template>

<script>
  import { getSignetList, saveSignet, deleteSignet } from '@/api/prove'

  export default {
    data() {
      return {
        lookSignet: false,
        lookSignetUrl: '',
        localhostPort: process.env.PROVE_API,
        loading: false,
        loadingText: '加载中',
        dialogVisible: false,
        signetList: [],
        signetForm: {
          id: '',
          signetName: '',
          fileList: []
        },
        signetImg: '',
        signetSave: {
          title: ''
        }
      }
    },
    created() {
      this.getSignetList()
    },
    methods: {
      lookSignetMethon(row) {
        this.lookSignet = true
        this.lookSignetUrl = row.signetLook
      },
      changeUpload(file) {
        this.signetForm.fileList.push(file)
      },
      dropSignet() {
        this.dialogVisible = false
        this.signetImg = ''
        this.signetForm = {
          id: '',
          signetName: '',
          fileList: []
        }
      },
      saveSignetData() {
        console.log(this.signetForm)
        var formData = new FormData()
        if (this.signetForm.signetName !== '') {
          formData.append('signetName', this.signetForm.signetName)
        } else {
          this.$message({
            type: 'error',
            message: '请输入签章名称'
          })
          return
        }

        if (this.signetForm.fileList.length > 0) {
          formData.append('file', this.signetForm.fileList[0].raw)
        } else {
          if (this.signetSave.title === '新增签章') {
            this.$message({
              type: 'error',
              message: '请上传png格式签章图片'
            })
            return
          }
        }

        if (this.signetForm.id.length > 0) {
          formData.append('id', this.signetForm.id)
        }

        this.loading = true
        this.loadingText = '正在更新签章信息'
        saveSignet(formData).then(res => {
          var type = 'success'
          if (res.code === 200) {
            this.$message({
              type: type,
              message: res.message
            })
            this.dropSignet()
            this.getSignetList()
          } else {
            type = 'error'
            this.$message({
              type: type,
              message: res.message
            })
          }
          this.loading = false
          this.loadingText = ''
        })
      },
      addSignet() {
        this.signetSave.title = '新增签章'
        this.dialogVisible = true
      },
      getSignetList() {
        getSignetList().then(res => {
          this.signetList = res.data
        })
      },
      // 删除
      deleteSignet(row) {
        deleteSignet(row.id).then(res => {
          var type = 'success'
          if (res.code === 200) {
            this.$message({
              type: type,
              message: res.message
            })
            this.getSignetList()
          } else {
            type = 'error'
            this.$message({
              type: type,
              message: res.message
            })
          }
        })
      },
      // 修改
      updateSignet(row) {
        this.signetSave.title = '修改签章'
        this.signetImg = row.signetLook
        this.dialogVisible = true
        this.signetForm = {
          id: row.id,
          signetName: row.signetName,
          fileList: []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    padding: 10px;
  }
</style>
