<template>
  <div v-loading.fullscreen.lock="loading"  :element-loading-text="loadingText">
    <div style="padding-left: 2%">
      <div style="margin:10px  0  14px 0;">
        <el-button type="primary" @click="clickTab()">
          增加标签类型
        </el-button>
        <el-button type="primary" @click="addTag()">
          增加标签
        </el-button>
      </div>
      <el-tabs v-model="tagTypeId"  type="card" closable @tab-remove="removeTab" @tab-click="selClick">
        <el-tab-pane v-for="(item, index) in tags" :key="index" :label="item.tagTypeName" :name="item.id">
          <el-table :data="tagList"
                    style="width: 100%">
            <el-table-column
                    prop="tagName"
                    align="center"
                    label="标题"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建日期"
            >
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
            >
              <template slot-scope="scope">
                <i class="el-icon-edit" @click="tagUpdate(scope.row)"></i>
                <i class="el-icon-delete" @click="problemRowDelete(scope.row.id)" style="margin-left: 50px;"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--点击增加标签弹出-->
    <el-button type="text" @click="dialogVisible = true"></el-button>
    <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :show-close= false
            >
      <el-form ref="form"  label-width="80px">
        <el-form-item label="标签分类">
          <el-input v-model="formTagName.tagName" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading= "false" @click="addTab()">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
            :visible.sync="tagDialogVisible"
            width="30%"
            :show-close= false
    >
      <el-form ref="form"  label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="tagAddName" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading= "false" @click="addTagOk()">确定</el-button>
          <el-button @click="addTagDrop()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
  import { getProblemTagTypeList, addProblemTagApi, delProblemTagApi, getProblemTagListApi, delProblemTagListApi, saveProblemTagListApi } from '@/api/enquiry'

  export default {
    data() {
      return {
        tagDialogVisible: false,
        tagAddName: '',
        tagAddId: null,
        loading: true,
        loadingText: '',
        tags: [],
        dialogVisible: false,
        formTagName: {
          tagName: ''
        },
        tagList: [],
        tagTypeId: '0'
      }
    },
    watch: {
      tagTypeId(val) {
        if (val !== '0') {
          this.getTagList(val)
        }
      }
    },
    created() {
      this.getProbolemTagType(null)
    },
    methods: {
      // 查询
      getProbolemTagType(isDelete) {
        this.loading = true
        getProblemTagTypeList(isDelete).then(res => {
          this.tags = res.data
          this.loading = false
          this.tagTypeId = this.tags[0].id
        })
      },
      // 点击增加按钮弹出弹窗
      clickTab() {
        this.dialogVisible = true
      },
      // 保存标签分类
      addTab() {
        if (this.formTagName.tagName === '' || this.formTagName.tagName === null) {
          this.$message({
            title: '警告',
            message: '标签名称为空',
            type: 'warning'
          })
          this.dialogVisible = false
        } else {
          var param = {
            tagTypeName: this.formTagName.tagName,
            isDelete: 'Y'
          }
          addProblemTagApi(param).then(res => {
            this.dialogVisible = false
            this.getProbolemTagType()
            this.formTagName.tagName = ''
          })
        }
      },
      // 删除标签
      removeTab(targetName) {
        this.$confirm('此操作将永久删除该标签类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          delProblemTagApi(targetName).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.getProbolemTagType(null)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 选中标签
      selClick(item) {
        this.tagTypeId = item.name
      },
      // 根据标签类型id查询标签名
      getTagList(id) {
        getProblemTagListApi(null, id).then(res => {
          this.tagList = res.data
        })
      },
      // 删除标签名
      problemRowDelete(id) {
        this.$confirm('此操作将永久删除该标签名, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          delProblemTagListApi(id).then(res => {
            this.getTagList(this.tagTypeId)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 显示新增标签名
      addTag() {
        this.tagDialogVisible = true
      },
      // 新增标签名
      addTagOk() {
        var data = {
          id: this.tagAddId,
          tagName: this.tagAddName,
          isDelete: 'Y',
          tagTypeId: this.tagTypeId
        }
        if (this.tagAddName === '' || this.tagAddName === null) {
          this.$message({
            title: '警告',
            message: '标签名称为空',
            type: 'warning'
          })
          this.tagDialogVisible = false
        } else {
          saveProblemTagListApi(data).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.addTagDrop()
            this.getTagList(this.tagTypeId)
          })
        }
      },
      // 取消新增并清空
      addTagDrop() {
        this.tagDialogVisible = false
        this.tagAddName = ''
      },
      // 修改
      tagUpdate(row) {
        this.tagDialogVisible = true
        this.tagAddName = row.tagName
        this.tagAddId = row.id
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    padding: 10px;
  }
</style>
