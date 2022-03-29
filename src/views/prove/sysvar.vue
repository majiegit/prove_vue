<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="sysVarList"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="参数名称">
            <template slot-scope="scope">
              <el-select v-model="scope.row.name" filterable placeholder="请选择"
                         @change="saveVar(scope.row.id,scope.row.name,'name')">
                <el-option
                  v-for="item in options"
                  :key="item.tpVarName"
                  :label="item.tpVarName"
                  :value="item.tpVarName">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="field"
            label="字段名">
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注"
                        @blur="saveVar(scope.row.id,scope.row.remark,'remark')"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" style="margin-left: 15px;" @click="deleteVar(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {listSysVar, saveVar, deleteVar, getTpVarListGroup} from '@/api/prove'

  export default {
    data() {
      return {
        options: [],
        sysVarList: [],
        sysVar: {
          form: {
            name: '',
            field: '',
            remark: ''
          }
        }
      }
    },
    created() {
      this.listSysVar()
      this.listSysTpVar()
    },
    methods: {
      listSysTpVar() {
        getTpVarListGroup().then(res => {
          this.options = res.data
        })
      },
      deleteVar(id) {
        var ids = []
        ids.push(id)
        deleteVar(ids).then(res => {
          var type = 'success'
          if (res.code === 200) {
            this.$message({
              type: type,
              message: res.message
            })
          } else {
            type = 'error'
            this.$message({
              type: type,
              message: res.message
            })
          }
          this.listSysVar()
        })
      },
      // 保存参数
      saveVar(id, value, type) {
        if (type === 'name') {
          this.sysVar.form = {
            id: id,
            name: value
          }
        }
        if (type === 'remark') {
          this.sysVar.form = {
            id: id,
            remark: value
          }
        }
        saveVar(this.sysVar.form).then(res => {
          var type = 'success'
          if (res.code === 200) {
            this.$message({
              type: type,
              message: res.message
            })
          } else {
            type = 'error'
            this.$message({
              type: type,
              message: res.message
            })
          }
          this.listSysVar()
          this.listSysTpVar()
        })
      },
      listSysVar() {
        const loading = this.$loading({
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        listSysVar().then(res => {
          this.sysVarList = res.data
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
