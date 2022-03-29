<template>
  <div>
    <el-row>
      <el-button type="primary" @click="addConfig">新增配置</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="configList"
        style="width: 100%">
        <el-table-column
          prop="keyName"
          label="名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="valueName"
          align="left"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="说明">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="updateConfig(scope.row)">修改</el-button >
            <!--<el-button size="mini" type="danger" style="margin-left: 15px;" @click="deleteConfig(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="50%"
      >
        <el-form :label-position="labelPosition" label-width="80px" :model="formData" :rules="rules">
          <el-form-item label="名称"  prop="keyName">
            <el-input v-model="formData.keyName" :disabled="!formDataAdd" ></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="valueName">
            <el-input type="textarea" v-model="formData.valueName"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="remark">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
     </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import { saveSysConfig, listSysConfig, deleteSysConfig, updateSysConfig } from '@/api/prove'

  export default {
    data() {
      return {
        rules: {
          keyName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          valueName: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ]
        },
        labelPosition: 'right',
        formData: {
          keyName: '',
          valueName: '',
          remark: ''
        },
        title: '',
        formDataAdd: true,
        configList: [],
        dialogVisible: false
      }
    },
    created() {
      this.listSysConfig()
    },
    methods: {
      saveConfig() {
        if (this.formDataAdd) {
          saveSysConfig(this.formData).then(res => {
            var type = 'success'
            if (res.code === 200) {
              this.$message({
                type: type,
                message: res.message
              })
              this.closeDialog()
              this.listSysConfig()
            } else {
              type = 'error'
              this.$message({
                type: type,
                message: res.message
              })
            }
          })
        } else {
          updateSysConfig(this.formData).then(res => {
            var type = 'success'
            if (res.code === 200) {
              this.$message({
                type: type,
                message: res.message
              })
              this.closeDialog()
            } else {
              type = 'error'
              this.$message({
                type: type,
                message: res.message
              })
            }
          })
        }
      },
      deleteConfig(row) {
        deleteSysConfig(row).then(res => {
          var type = 'success'
          if (res.code === 200) {
            this.$message({
              type: type,
              message: res.message
            })
            this.listSysConfig()
          } else {
            type = 'error'
            this.$message({
              type: type,
              message: res.message
            })
          }
        })
      },
      updateConfig(row) {
        this.dialogVisible = true
        this.formDataAdd = false
        this.title = '修改配置'
        this.formData = row
      },
      addConfig() {
        this.dialogVisible = true
        this.formDataAdd = true
        this.title = '新增配置'
        this.formData = {
          keyName: '',
          valueName: '',
          remark: ''
        }
      },
      closeDialog() {
        this.dialogVisible = false
        this.formData = {
          keyName: '',
          valueName: '',
          remark: ''
        }
      },
      listSysConfig() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        listSysConfig().then(res => {
          this.configList = res.data
          loading.close()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    padding: 10px;
  }
</style>
