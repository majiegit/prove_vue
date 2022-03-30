<template>
  <div v-loading.fullscreen.lock="loading"  :element-loading-text="loadingText">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="addProve">新增证明</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="proveList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"

            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="证明名称"
            align="center">
          </el-table-column>
          <el-table-column
            label="签章X轴"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.signetParam.coordX}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="签章Y轴"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.signetParam.coordY}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
          width="400">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="updateProve(scope.row)">修改</el-button >
              <el-button size="mini" type="danger" style="margin-left: 15px;" @click="deleteProve(scope.row)">删除</el-button>
              <el-button size="mini" type="primary"  style="margin-left: 15px;" @click="lookProveTpVar(scope.row)">基本变量</el-button>
              <el-button size="mini" type="primary"  style="margin-left: 15px;" @click="addProofField(scope.row)">固定、模板变量</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="proveSave.title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="50%">
      <el-steps :active="active" finish-status="success" style="margin-bottom: 50px;">
        <el-step title="证明设置"></el-step>
        <el-step title="审批设置"></el-step>
        <el-step title="签章设置"></el-step>
      </el-steps>
      <!--证明设置 内容-->
      <div style="width: 100%; height: 350px;" v-if="active == 0">
        <div style="width: 50%; float: left; height: 100%;">
          <el-form label-width="100px">
            <el-form-item label="证明名称:">
              <el-input v-model="proveForm.name"></el-input>
            </el-form-item>
            <el-form-item label="证明模板:" prop="excelFile">
              <el-upload
                class="upload-demo"
                ref="upload"
                :on-change="changeUpload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :limit="1"
                :file-list="proveForm.fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
              <span style="color: red; font-size: 12px;">说明: 证明模板，目前只支持上传.docx、.doc格式模板</span>
            </el-form-item>
          </el-form>
        </div>
        <div style="width: 50%; float: left;  height: 100%;" >
          <el-form label-width="100px" v-if="lookPath">
            <el-form-item label="原模板:" prop="excelFile" >
              <img :src="lookPath" width="70%;"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--审批设置-->
      <div style="width: 100%; height: 100%;" v-if="active == 1">
        <el-table
          :data="proveForm.checkParam"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%">
          <el-table-column
            label="轮次"
            align="center">
            <template slot-scope="scope">
              <span>第{{scope.row.turn}}轮次</span>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
            align="center">
            <template slot-scope="scope">
              <!-- 显示状态-->
              <span v-if="scope.row.editStatus == false">{{getStrByArray(scope.row.checkUserName)}}</span>
              <!-- 编辑状态-->
              <el-select v-if="scope.row.editStatus == true" v-model="scope.row.checkUserId" filterable  multiple placeholder="请选择证明审核人"
                         @visible-change = "visibleChangeUserName($event, scope.row)">
                <el-option
                  v-for="item in proveCheckUserList"
                  :key="item.CUSERID"
                  :label="item.USER_NAME"
                  :value="item.CUSERID">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="审批方式"
            align="left" width="260">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.checkMode" label="1">会签(须所有审批人同意)</el-radio><br/>
              <el-radio v-model="scope.row.checkMode" label="2">或签(一名审批人同意或拒绝即可)</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="rowEditStatus(scope.row, true)"></i>
              <i class="el-icon-circle-plus-outline" style="margin-left: 50px;" @click="addRow(scope.row)"></i>
              <i class="el-icon-remove-outline" style="margin-left: 50px;" @click="deleteRow(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 100%; height: 300px;" v-if="active == 2">
        <div style="width: 100%; float: left; height: 100%;">
          <el-form label-width="100px">
            <el-form-item label="签章方式:">
              <el-radio-group v-model="proveForm.signetParam.signetMode">
                <el-radio label="1">e签宝</el-radio>
                <el-radio label="2">本地签章</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证明签章:" v-if="proveForm.signetParam.signetMode === '2'">
              <el-select v-model="proveForm.signetParam.signetId" placeholder="请选择证明签章" @change="changeSignet()">
                <el-option
                  v-for="(item,index) in signetList"
                  :key="index"
                  :label="item.signetName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签章位置:">
              <span>X:</span>
              <el-input-number v-model="proveForm.signetParam.coordX" controls-position="right" :min="1" :max="1000"></el-input-number>
              <span style="margin-left: 50px;">Y:</span>
              <el-input-number v-model="proveForm.signetParam.coordY" controls-position="right" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="签章预览:" v-if="proveForm.signetParam.signetMode === '2' && proveForm.signetParam.signetLook" >
              <img :src= "proveForm.signetParam.signetLook" width="150px;"/>
            </el-form-item>
          </el-form>
        </div>
      </div>



      <span slot="footer" class="dialog-footer">
        <el-button @click="dropProve">取 消</el-button>
        <el-button type="primary" v-if="active > 0 && active <= 2" @click="upStep">上一步</el-button>
        <el-button type="primary" v-if="active < 2" @click="nextStep">下一步</el-button>
        <el-button type="primary" v-if="active == 2" @click="saveProve">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="基本变量"
      :visible.sync="tpVarDialogVisible"
      width="50%">
      <p>说明:</p>
      <p>基本变量是指模板里${} &nbsp;&nbsp;&nbsp; 例: ${姓名}、${年龄}、${性别}&nbsp;&nbsp; 此类变量申请人在申请证明时调用用户的基本信息  例如： 姓名、年龄、性别</p>
      <el-table
        :data="tpVarList"
        style="width: 100%" height="500">
        <el-table-column
          label="变量名"
          width="180">
          <template slot-scope="scope">
            <span>{ {{scope.row.tpVarName}} }</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 证明字段模板-->
    <el-dialog
            title="证明字段添加"
            :visible.sync="filedDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="60%"
            >
      <p>说明:</p>
      <p>系统变量是指模板里@{} &nbsp;&nbsp;&nbsp; 例: @{年}、@{月}、@{日} &nbsp;&nbsp; 此类变量在系统中预置，替换一些常用的变量，例如： 系统时间</p>
      <p>模板变量是指模板里&{} &nbsp;&nbsp;&nbsp; 例: &{公司名称}  此类变量在证明申请时，由申请人填写的一些变量，例如： 公司名称</p>
      <el-table :data="tableFieldData" class="tb-edit" style="width: 100%" highlight-current-row>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.fieldName" :disabled="filedDialogVisible"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <section>
              <el-select v-model="scope.row.fieldType" :disabled="filedDialogVisible" placeholder="请选择字段类型">
                <el-option
                  v-for="item in fieldTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </section>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button size="small" type="primary" @click="handleAdd(scope.$index, scope.row)">增加</el-button>-->
            <!--<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="filedDialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="addField">保存</el-button>-->
     </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProveList, saveProve, updateProve, getProveCheckUser, deleteProve, getTpVarList, getSignetList, saveProveField, getFiledList } from '@/api/prove'
export default {
  data() {
    return {
      active: 0,
      lookPath: '',
      signetList: [],
      loading: false,
      loadingText: '加载中',
      tpVarList: [],
      tpVarDialogVisible: false,
      proveCheckUserList: [],
      dialogVisible: false,
      filedDialogVisible: false,
      proveList: [],
      proveForm: {
        id: '',
        name: '',
        fileList: [],
        checkParam: [
          {
            turn: 1,
            checkUserId: [],
            checkUserName: [],
            checkMode: '1',
            editStatus: true
          }
        ],
        signetParam: {
          signetMode: '1',
          signetId: '',
          coordY: '400',
          coordX: '400'
        }
      },
      proveSave: {
        title: ''
      },
      tpVar: {
        data: [],
        dialogVisible: false,
        title: '参数设置'
      },
      tableFieldData: [],
      fieldTypeOptions: [
        {
          value: 'system',
          label: '系统变量'
        },
        {
          value: 'temp',
          label: '模板变量'
        }, {
          value: 'submit',
          label: '单据变量'
        }
      ],
      proveId: ''
    }
  },
  created() {
    this.getProveList()
    this.getProveCheckUser()
    this.getSignetList()
  },
  mounted() {},
  methods: {
    // 签章选择
    changeSignet() {
      console.log(this.signetList)
      for (var i = 0; i < this.signetList.length; i++) {
        if (this.signetList[i].id === this.proveForm.signetParam.signetId) {
          console.log(this.signetList[i])
          this.proveForm.signetParam.signetLook = this.signetList[i].signetLook
          break
        }
      }
    },
    // 选择框隐藏
    visibleChangeUserName(val, row) {
      row.checkUserName = []
      if (!val) {
        // 处理审核人
        for (var i = 0; i < row.checkUserId.length; i++) {
          var item = row.checkUserId[i]
          for (var m = 0; m < this.proveCheckUserList.length; m++) {
            if (item === this.proveCheckUserList[m].CUSERID) {
              row.checkUserName.push(this.proveCheckUserList[m].USER_NAME)
            }
          }
        }
        this.rowEditStatus(row, false)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 删除轮次
    deleteRow(row) {
      var index = row.index
      if (this.proveForm.checkParam.length === 1) {
        this.$message({
          type: 'warning',
          message: '至少保持一轮审批'
        })
        return
      }

      var index1 = index + 1
      if (index1 <= this.proveForm.checkParam.length) {
        for (var i = index1; i < this.proveForm.checkParam.length; i++) {
          this.proveForm.checkParam[i].turn--
        }
      }
      this.proveForm.checkParam.splice(index, 1)
    },
    // 添加轮次
    addRow(row) {
      var turn = row.turn + 1
      var index = row.index
      var append = {
        turn: turn,
        checkUserId: [],
        checkUserName: [],
        checkMode: '1',
        editStatus: true
      }
      var index1 = index + 1
      if (index1 <= this.proveForm.checkParam.length) {
        for (var i = index1; i < this.proveForm.checkParam.length; i++) {
          this.proveForm.checkParam[i].turn++
        }
      }
      this.proveForm.checkParam.splice(index1, 0, append)
      console.log(this.proveForm.checkParam)
    },
    // 数组‘,’分割为字符串
    getStrByArray(array) {
      var str = ''
      for (var i = 0; i < array.length; i++) {
        str += array[i]
        if (i !== array.length - 1) {
          str += ','
        }
      }
      return str
    },
    // 改变编辑状态
    rowEditStatus(row, status) {
      row.editStatus = status
    },
    // 下一步
    nextStep() {
      // 校验下一步参数必输项
      var is = true
      switch (this.active) {
        // 证明设置
        case 0:
          if (this.proveForm.id === '' && this.proveForm.fileList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请上传证明模板'
            })
            is = false
          }
          if (this.proveForm.name === '') {
            this.$message({
              type: 'warning',
              message: '请填写证明名称'
            })
            is = false
          }
          break
        // 审批设置
        case 1:
          for (var i = 0; i < this.proveForm.checkParam.length; i++) {
            if (this.proveForm.checkParam[i].checkUserId.length === 0) {
              this.$message({
                type: 'warning',
                message: '审核人不能为空'
              })
              is = false
              break
            }
          }
          break
        // 签章设置
        case 2:
          break
      }
      if (is) {
        this.active++
      }
    },
    // 上一步
    upStep() {
      this.active--
    },
    // 获取模板字段
    getFiled(proveId, type) {
      getFiledList(proveId, type).then(res => {
        if (res.data.length === 0) {
          this.handleAddList(type)
        } else {
          this.tableFieldData = res.data
        }
      })
    },
    addField() {
      var params = {
        proveId: this.proveId,
        sysProveFieldExpands: this.tableFieldData
      }
      saveProveField(params).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.closeDialogArr()
      })
    },
    handleDelete(index, row) {
      this.tableFieldData.splice(index, 1)
    },
    handleAddList(type) {
      var arr = {
        fieldName: '',
        proveId: this.proveId,
        fieldType: type
      }
      this.tableFieldData.push(arr)
    },
    handleAdd() {
      if (this.tableFieldData[this.tableFieldData.length - 1].key === '' && this.tableFieldData[this.tableFieldData.length - 1].name === '') {
        return
      }
      var arr = {
        fieldName: '',
        proveId: this.proveId,
        fieldType: 'temp'
      }
      this.tableFieldData.push(arr)
    },
    closeDialogArr() {
      this.tableFieldData = []
      this.filedDialogVisible = false
    },
    // 证明字段添加
    addProofField(row) {
      this.proveId = row.id
      // 获取模板字段
      this.getFiled(this.proveId, '')
      this.filedDialogVisible = true
    },
    getSignetList() {
      getSignetList().then(res => {
        this.signetList = res.data
      })
    },
    getProveCheckUser() {
      getProveCheckUser().then(res => {
        this.proveCheckUserList = res.data
      })
    },
    changeUpload(file) {
      this.proveForm.fileList.push(file)
    },
    dropProve() {
      this.active = 0
      this.dialogVisible = false
      this.proveForm = {
        id: '',
        name: '',
        fileList: [],
        checkParam: [
          {
            turn: 1,
            checkUserId: [],
            checkUserName: [],
            checkMode: '1',
            editStatus: true
          }
        ],
        signetParam: {
          signetMode: '1',
          signetId: '',
          coordY: '400',
          coordX: '400'
        }
      }
      this.lookPath = ''
    },
    insertProve(formData) {
      this.loading = true
      this.loadingText = '正在上传证明信息，请不要关闭当前页面'
      saveProve(formData).then(res => {
        var type = 'success'
        if (res.code === 200) {
          this.$message({
            type: type,
            message: res.message
          })
          this.dropProve()
          this.getProveList()
        } else {
          type = 'error'
          this.$message({
            type: type,
            message: res.message
          })
        }
        this.loading = false
        this.loadingText = ''
      }).catch(err => {
        this.loading = false
        this.loadingText = ''
        console.log(err)
      })
    },
    updateProveData(formData) {
      this.loading = true
      this.loadingText = '正在更新证明信息，请不要关闭当前页面'
      updateProve(formData).then(res => {
        var type = 'success'
        if (res.code === 200) {
          this.$message({
            type: type,
            message: res.message
          })
          this.dropProve()
          this.getProveList()
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
    saveProve() {
      console.log(this.proveForm)
      var formData = new FormData()
      formData.append('name', this.proveForm.name)
      formData.append('checkParam', JSON.stringify(this.proveForm.checkParam))
      formData.append('signetParam', JSON.stringify(this.proveForm.signetParam))
      if (this.proveForm.id !== '') {
        // 修改
        formData.append('id', this.proveForm.id)
        if (this.proveForm.fileList.length !== 0) {
          formData.append('file', this.proveForm.fileList[0].raw)
        }
        this.updateProveData(formData)
      } else {
        // 新增
        formData.append('file', this.proveForm.fileList[0].raw)
        this.insertProve(formData)
      }
    },
    addProve() {
      this.proveSave.title = '新增证明'
      this.dialogVisible = true
    },
    getProveList() {
      const loading = this.$loading({
        lock: true,
        text: '查询中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      getProveList().then(res => {
        this.proveList = res.data
        loading.close()
      })
    },
    // 查看证明模板变量
    lookProveTpVar(row) {
      getTpVarList(row.tpId).then(res => {
        this.tpVarDialogVisible = true
        this.tpVarList = res.data
      })
    },
    // 删除
    deleteProve(row) {
      deleteProve(row.id).then(res => {
        var type = 'success'
        if (res.code === 200) {
          this.$message({
            type: type,
            message: res.message
          })
          this.getProveList()
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
    updateProve(row) {
      this.proveSave.title = '修改证明'
      this.dialogVisible = true
      this.lookPath = row.tpLook
      this.proveForm = {
        id: row.id,
        name: row.name,
        fileList: [],
        checkParam: row.checkParam,
        signetParam: row.signetParam
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
