import request from '@/utils/request'

// 问题类型列表
export function getProblemTypeListApi() {
  return request({
    url: '/seProblemType/list',
    method: 'get'
  })
}

// 问题类型添加
export function addProblemTypeApi(data) {
  return request({
    url: '/seProblemType/save',
    data: data,
    method: 'post'
  })
}

// 问题类型删除
export function deleteProblemTypeApi(id) {
  return request({
    url: '/seProblemType/delete',
    params: { id: id },
    method: 'post'
  })
}

// 问题列表
export function getProblemListApi(typeId) {
  return request({
    url: '/seProblem/list',
    params: { typeId: typeId },
    method: 'get'
  })
}

// 问题ID 查询
export function getProblemByIdApi(problemId) {
  return request({
    url: '/seProblem/getByProblemId',
    params: { problemId: problemId },
    method: 'get'
  })
}

// 问题保存
export function saveProblemApi(data) {
  return request({
    url: '/seProblem/save',
    method: 'post',
    data: data
  })
}

// 问题启用
export function isDeleteProblemApi(id, isDelete) {
  return request({
    url: '/seProblem/isDelete',
    method: 'post',
    params: { id: id, isDelete: isDelete }
  })
}

// 问题删除
export function deleteProblemApi(ids) {
  return request({
    url: '/seProblem/delete',
    data: ids,
    method: 'post'
  })
}
// 问题标签查询
export function getProblemTagTypeApi(problemId) {
  return request({
    url: '/seProblemTag/listBytagTypeId',
    params: { problemId: problemId },
    method: 'get'
  })
}

// 标签列表查询
export function getProblemTagApi(isDelete, tagTypeId) {
  return request({
    url: '/seProblemTag/list',
    params: { isDelete: isDelete, tagTypeId: tagTypeId },
    method: 'get'
  })
}

// 问题标签列表查询
export function getProblemTagTypeList(isDelete) {
  return request({
    url: '/seProblemTagType/list',
    params: { isDelete: isDelete },
    method: 'get'
  })
}
// 保存标签
export function addProblemTagApi(data) {
  return request({
    url: '/seProblemTagType/save',
    data: data,
    method: 'post'
  })
}

// 删除标签类型
export function delProblemTagApi(id) {
  return request({
    url: '/seProblemTagType/delete',
    params: { id: id },
    method: 'post'
  })
}
// 标签分类列表
export function getProblemTagListApi(isDelete, tagTypeId) {
  return request({
    url: '/seProblemTag/list',
    params: { isDelete: isDelete, tagTypeId: tagTypeId },
    method: 'get'
  })
}
// 删除标签
export function delProblemTagListApi(id) {
  return request({
    url: '/seProblemTag/delete',
    params: { id: id },
    method: 'post'
  })
}

// 保存标签
export function saveProblemTagListApi(data) {
  return request({
    url: '/seProblemTag/save',
    data: data,
    method: 'post'
  })
}
