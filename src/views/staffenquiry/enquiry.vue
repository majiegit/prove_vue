<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="24">
        <div class="problem_type_row">
          <div class="problem_type_item" v-for="(item,index) in problemTypeList"
               :style="{background: item.id === problemTypeId ? '#F5F5F5' : 'none'}"
               :key="index" @mouseover="problemTypeMove(item)" @mouseout="problemTypeOut(item)">
            <div class="problem_type_title" :id="'problem_type_title_'+ item.id">
              <i class="el-icon-edit" style="float: left; margin: 5px;cursor: pointer;"
                 @click="addProblemType(item)"></i>
              <i class="el-icon-delete" style="float: right; margin: 5px;cursor: pointer;"
                 @click="deleteProblemType(item)"></i>
            </div>
            <div class="problem_type_icon" @click="problemTypeClick(item)">
              <i class="hrfont" :class="item.iconClass" style="font-size: 60px;"
                 :style="{color: item.isDelete === 'Y' ? item.color : '#DCDCDC'}"></i>
            </div>
            <div style="width: 100%; height: 30%; text-align: center; float: left">
              <span>{{item.typeName}}</span>
            </div>
          </div>
          <div class="problem_type_add" @click="addProblemType(null)">
            <i class="el-icon-plus" style="font-size: 60px;margin-top: 25px; color: #0A78FF;"></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-left: 10px;">
      <el-col :span="6">
        <el-input placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="float: right;" @click="addProblem">新增</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-left: 10px;">
      <el-col :span="24">
        <el-table
          :data="problemList"
          style="width: 100%">
          <el-table-column
            prop="name"
            width="400"
            align="center"
            label="标题"
          >
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="createTime"
            label="创建日期"
          >
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="updateTime"
            label="更新日期"
          >
          </el-table-column>
          <el-table-column
            label="标签"
            align="center">
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.tagList" :key="index" style="margin-left: 10px;">
                {{item.tagName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="是否启用"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-switch
                active-value="Y"
                inactive-value="N"
                v-model="scope.row.isDelete"
                active-color="#13ce66"
                @change="changeProblemIsDelete(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="problemRowClick(scope.row)"></i>
              <i class="el-icon-delete" @click="problemRowDelete(scope.row)" style="margin-left: 50px;"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>


    <!--<div>-->
    <!--<el-button @click="getHtml()">获取内容</el-button>-->
    <!--</div>-->
    <!--<div id="div2">-->
    <!--</div>-->
    <!--问题分类保存窗口-->
    <el-dialog
      :title="saveProblemTypeTitle"
      :visible.sync="saveProblemTypeVisible"
      width="30%">
      <el-form label-width="100px">
        <el-form-item label="类型名称:">
          <el-input v-model="problemType.typeName"></el-input>
        </el-form-item>
        <el-form-item label="分类图标:">
          <div v-if="problemType.iconClass !== ''">
            <i class="hrfont" :class="problemType.iconClass" style="font-size: 70px; cursor: pointer;"
               :style="{color:problemType.color}" @click="problemTypeIconVisible = true"></i>
          </div>
          <el-button type="primary" @click="problemTypeIconVisible = true" v-else>选择图标</el-button>
        </el-form-item>
        <el-form-item label="图标颜色">
          <el-color-picker class="theme-picker" popper-class="theme-picker-dropdown"
                           v-model="problemType.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            active-value="Y"
            inactive-value="N"
            v-model="problemType.isDelete"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveProblemTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProblemType">确 定</el-button>
      </span>
    </el-dialog>
    <!--问题分类图标窗口-->
    <el-dialog
      title="图标集合"
      :visible.sync="problemTypeIconVisible"
      width="60%">
      <div class="icons-container">
        <div class="icons-wrapper">
          <div v-for="(item, index)  in iconsMap" :key="index" @click="handleIcon(item.code, $event)">
            <div class="icon-item">
              <i class="hrfont entry-icon" :class="item.code"></i>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--问题保存-->
    <el-dialog
      :title="saveProblemDialogTitle"
      :visible.sync="saveProblemDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :show-close=false
      :destroy-on-close=true
      width="60%">
      <el-form label-width="100px">
        <el-form-item label="标题:">
          <el-input v-model="saveProblemDialogProblem.name"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div id="div1">
          </div>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="saveProblemDialogProblem.typeId" placeholder="请选择类型">
            <el-option
              v-for="item in problemTypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag v-for="(e, index) in saveProblemDialogProblem.tagList" :key="index" closable
                  style="margin-left: 10px;" @close="closeTagMethonFromItem(index)">
            {{e.tagName}}
          </el-tag>
          <el-button style="margin-left: 10px; cursor: pointer;" size="mini" type="primary"
                     @click="addProblemTag()">
            <i class="el-icon-plus"></i>
          </el-button>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            active-value="Y"
            inactive-value="N"
            v-model="saveProblemDialogProblem.isDelete"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="problemDrop()">取 消</el-button>
        <el-button type="primary" @click="problemOk">确 定</el-button>
      </span>
    </el-dialog>
    <!--问题标签弹窗-->
    <el-dialog
      :title="problemTagDialogTitle"
      :visible.sync="problemTagDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :show-close=false
      :destroy-on-close=true
    >
      <div>
        <h3>已选标签</h3>
        <p>
          <el-tag v-for="(tag, index) in problemTagSelectList" :key="index" style="margin-left: 15px;"
                  closable @close="closeTagMethon(tag,index)">{{tag.tagName}}
          </el-tag>
        </p>
      </div>
      <div v-for="(item, index1) in problemTagList" :key="index1">
        <h4>{{item.tagTypeName}}</h4>
        <el-button v-for="(tag, index2) in item.tagList" type="primary" :key="index2" :disabled="tag.disabled"
                   @click="changeTagWei(tag, index1, index2)">{{tag.tagName}}
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="problemTagDrop">取 消</el-button>
        <el-button type="primary" @click="problemTagOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getProblemTypeListApi, addProblemTypeApi, deleteProblemTypeApi,
    getProblemListApi, saveProblemApi, isDeleteProblemApi, getProblemTagTypeApi, getProblemByIdApi, deleteProblemApi
  } from '@/api/enquiry'
  import quickData from './quickData.js'
  import E from 'wangeditor'

  export default {
    data() {
      return {
        editor: null,
        problemTypeHoverIndex: 0,
        problemTypeHover: false,
        problemTypeList: [],
        saveProblemTypeVisible: false,
        saveProblemTypeTitle: '',
        problemType: {
          typeName: '',
          iconClass: '',
          color: '',
          isDelete: 'Y'
        },
        problemTypeIconVisible: false,
        iconsMap: quickData,
        loading: false,
        problemList: [],
        problemTypeId: '',
        saveProblemDialogVisible: false,
        saveProblemDialogTitle: '',
        saveProblemDialogProblem: {},
        problemTagDialogVisible: false,
        problemTagDialogTitle: '',
        problemTagDialogTag: {},
        problemTagList: [],
        problemTagSelectList: [],
        problemTagSelected: []
      }
    },
    created() {
      this.getProblemTypeList()
    },
    watch: {
      problemTypeId: function(val) {
        this.getProblemList(val)
      }
    },
    mounted() {
    },
    methods: {
      // 选择标签取消
      problemTagDrop() {
        this.problemTagSelectList = []
        this.problemTagDialogVisible = false
        this.problemTagSelectList = []
      },
      // 选择标签确定
      problemTagOk() {
        var _this = this
        _this.saveProblemDialogProblem.tagList = []
        this.problemTagSelectList.forEach(function(tag) {
          _this.saveProblemDialogProblem.tagList.push(tag)
        })
        this.problemTagDialogVisible = false
        this.problemTagSelectList = []
      },
      //
      changeTagWei(tag, index1, index2) {
        this.problemTagSelectList.push(tag)
        this.problemTagList[index1].tagList[index2].disabled = true
        console.log(this.problemTagList)
      },
      // 标签添加
      addTagMethon(tag) {
        alert(tag)
      },
      // 标签删除
      closeTagMethonFromItem(index) {
        this.saveProblemDialogProblem.tagList.splice(index, 1)
      },
      // 标签删除
      closeTagMethon(tag, index) {
        this.problemTagSelectList.splice(index, 1)
        var tagTypeList = []
        for (var i = 0; i < this.problemTagList.length; i++) {
          var tagType = {}
          tagType.createTime = this.problemTagList[i].createTime
          tagType.isDelete = this.problemTagList[i].isDelete
          tagType.tagTypeId = this.problemTagList[i].tagTypeId
          tagType.tagTypeName = this.problemTagList[i].tagTypeName
          tagType.tagList = []
          for (var j = 0; j < this.problemTagList[i].tagList.length; j++) {
            if (tag.id === this.problemTagList[i].tagList[j].id) {
              this.problemTagList[i].tagList[j].disabled = false
            }
            tagType.tagList.push(this.problemTagList[i].tagList[j])
          }
          tagTypeList.push(tagType)
        }
        this.problemTagList = tagTypeList
      },
      // 分类标签联查
      getProblemTagTypeList() {
        var _this = this
        _this.problemTagDialogVisible = true
        _this.problemTagDialogTitle = '添加标签'
        _this.saveProblemDialogProblem.tagList.forEach(function(item) {
          _this.problemTagSelectList.push(item)
        })
        getProblemTagTypeApi(_this.saveProblemDialogProblem.id).then(res => {
          var arr = []
          res.data.forEach(function(item) {
            var tagList = []
            item.tagList.forEach(function(tag) {
              var tagMap = {
                createTime: tag.createTime,
                disabled: _this.isBaoHan(tag.id, _this.problemTagSelectList),
                id: tag.id,
                isDelete: tag.isDelete,
                tagName: tag.tagName,
                tagTypeId: tag.tagTypeId
              }
              tagList.push(tagMap)
            })
            var tagTypeMap = {
              createTime: item.createTime,
              isDelete: item.isDelete,
              tagTypeId: item.tagTypeId,
              tagTypeName: item.tagTypeName,
              tagList: tagList
            }
            arr.push(tagTypeMap)
          })
          _this.problemTagList = arr
        })
      },
      // 判断标签是否选择
      isBaoHan(tagId, listStr) {
        var isBaoHan = false
        for (var i = 0; i < listStr.length; i++) {
          if (listStr[i].id === tagId) {
            isBaoHan = true
            break
          }
        }
        return isBaoHan
      },
      // 标签添加
      addProblemTag() {
        this.getProblemTagTypeList()
      },
      // 问题确定
      problemOk() {
        console.log(this.saveProblemDialogProblem)
        var tagIds = this.getTagIds(this.saveProblemDialogProblem.tagList)
        var params = {
          id: this.saveProblemDialogProblem.id,
          name: this.saveProblemDialogProblem.name,
          typeId: this.saveProblemDialogProblem.typeId,
          isDelete: this.saveProblemDialogProblem.isDelete,
          content: this.editor.txt.html(),
          tagIds: tagIds
        }
        saveProblemApi(params).then(res => {
          var type = 'success'
          if (res.code !== 200) {
            type = 'error'
          }
          this.$message({
            type: type,
            message: res.message
          })
          this.problemDrop()
          this.getProblemList(this.problemTypeId)
        })
      },
      // 获取标签ids
      getTagIds(tagList) {
        var ids = []
        tagList.forEach(function(tag) {
          ids.push(tag.id)
        })
        return ids
      },
      // 问题取消
      problemDrop() {
        this.saveProblemDialogVisible = false
        this.saveProblemDialogProblem = {}
        this.editor.destroy()
        this.editor = null
      },
      // 问题新增
      addProblem() {
        this.saveProblemDialogVisible = true
        this.saveProblemDialogProblem = {
          id: null,
          content: '',
          isDelete: 'Y',
          name: '',
          tagList: [],
          typeId: this.problemTypeId,
          typeName: ''
        }
        var _this = this
        setTimeout(function() {
          if (_this.editor === null) {
            const editor = new E('#div1')
            editor.create()
            editor.txt.html(_this.saveProblemDialogProblem.content)
            _this.editor = editor
          }
        }, 100)
      },
      // 问题删除
      problemRowDelete(row) {
        var ids = []
        ids.push(row.id)
        deleteProblemApi(ids).then(res => {
          var type = 'success'
          if (res.code !== 200) {
            type = 'error'
          }
          this.$message({
            type: type,
            message: res.message
          })
          this.getProblemList(this.problemTypeId)
        })
      },
      // 问题编辑
      problemRowClick(row) {
        this.saveProblemDialogVisible = true
        var _this = this
        getProblemByIdApi(row.id).then(res => {
          this.saveProblemDialogProblem = res.data
          if (_this.editor === null) {
            const editor = new E('#div1')
            editor.create()
            editor.txt.html(row.content)
            _this.editor = editor
          }
        })
      },
      // 启用改变事件
      changeProblemIsDelete(item) {
        isDeleteProblemApi(item.id, item.isDelete).then(res => {
          var type = 'success'
          if (res.code !== 200) {
            type = 'error'
          }
          this.$message({
            type: type,
            message: res.message
          })
        })
      },
      // 根据分类查询问题列表
      problemTypeClick(item) {
        if (item.isDelete === 'N') {
          this.$message({
            type: 'warning',
            message: '当前类型被禁用，请先启用'
          })
          return
        }
        this.problemTypeId = item.id
      },
      // 问题列表查询
      getProblemList(problemTypeId) {
        this.loading = true
        getProblemListApi(problemTypeId).then(res => {
          this.problemList = res.data
          this.loading = false
        })
      },
      // 问题分类删除
      deleteProblemType(item) {
        this.$confirm('此操作将永久删除, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProblemTypeApi(item.id).then(res => {
            var type = 'success'
            if (res.code !== 200) {
              type = 'error'
            }
            this.$message({
              type: type,
              message: res.message
            })
            this.getProblemTypeList()
          })
        }).catch(() => {
        })
      },
      // 问题分类悬浮离开
      problemTypeOut(item) {
        var element = document.getElementById('problem_type_title_' + item.id)
        if (element.style.display === 'block') {
          element.style.display = 'none'
        }
      },
      // 问题分类悬浮上
      problemTypeMove(item) {
        var element = document.getElementById('problem_type_title_' + item.id)
        if (element.style.display === 'none') {
          element.style.display = 'block'
        } else {
          element.style.display = 'none'
        }
      },
      // 图标点击
      handleIcon(text, event) {
        this.problemType.iconClass = text
        this.problemTypeIconVisible = false
      },
      // 问题类型保存
      saveProblemType() {
        addProblemTypeApi(this.problemType).then(res => {
          var type = 'success'
          if (res.code !== 200) {
            type = 'error'
          }
          this.saveProblemTypeVisible = false
          this.$message({
            type: type,
            message: res.message
          })
          this.getProblemTypeList()
        })
      },
      // 新增问题类型
      addProblemType(item) {
        if (item !== null) {
          this.saveProblemTypeVisible = true
          this.saveProblemTypeTitle = '问题类型修改'
          this.problemType = item
        } else {
          this.saveProblemTypeVisible = true
          this.saveProblemTypeTitle = '问题类型新增'
          this.problemType = {
            typeName: '',
            iconClass: '',
            color: '#0A78FF',
            isDelete: 'Y'
          }
        }
      },
      // 问题类型List
      getProblemTypeList() {
        getProblemTypeListApi().then(res => {
          this.problemTypeList = res.data
          if (this.problemTypeList.length !== 0) {
            this.problemTypeId = this.problemTypeList[0].id
          }
        })
      }
    }
  }
</script>
<style scoped>
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 20px 5px;
  }

  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }

  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul, ol {
    margin: 10px 0 10px 20px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-item {
    .entry-icon {
      margin-top: 30px;
      font-size: 70px;
    }
    /*margin: 20px;*/
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  .table-icon-item {
    .entry-icon {
      margin-top: 30px;
      font-size: 70px;
    }
    /*margin: 20px;*/
    height: 50px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
    display: block;
  }

  .icons-container {
    margin: 10px 20px 0;
    overflow-y: auto;
    height: 400px;
    width: 100%;
    .icons-wrapper {
      margin: 0 auto;
    }
    .icon-item {
      .entry-icon {
        margin-top: 30px;
        font-size: 70px;
      }
      margin: 20px;
      height: 110px;
      text-align: center;
      width: 110px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }
    span {
      display: block;
      font-size: 24px;
      margin-top: 10px;
    }
  }

</style>
<style src="./iconcss/enquiry.css"></style>
<style src="./iconcss/iconfont.css"></style>

