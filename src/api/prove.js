import request from '@/utils/request'

export function getProveList() {
  return request({
    url: '/sysProve/list',
    method: 'get'
  })
}

export function getProveCheckUser() {
  return request({
    url: '/sysProve/checkUser',
    method: 'get'
  })
}

export function saveProve(data) {
  return request({
    url: '/sysProve/add',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function updateProve(data) {
  return request({
    url: '/sysProve/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteProve(proveId) {
  return request({
    url: '/sysProve/delete',
    method: 'post',
    params: { 'proveId': proveId }
  })
}

export function getTpVarList(id) {
  return request({
    url: '/sysTpVar/get',
    method: 'get',
    params: { id: id }
  })
}

export function getTpVarListGroup() {
  return request({
    url: '/sysTpVar/list',
    method: 'get'
  })
}

export function saveTpVarList(list) {
  return request({
    url: '/sysTpVar/save',
    method: 'post',
    data: list
  })
}

export function saveVar(data) {
  return request({
    url: '/sysVar/save',
    method: 'post',
    data: data
  })
}

export function listSysVar() {
  return request({
    url: '/sysVar/list',
    method: 'get'
  })
}

export function deleteVar(ids) {
  return request({
    url: '/sysVar/delete',
    method: 'post',
    data: ids
  })
}

/**
 * Config 定义
 */

export function listSysConfig() {
  return request({
    url: '/sysConfig/list',
    method: 'get'
  })
}

export function deleteSysConfig(data) {
  return request({
    url: '/sysConfig/delete',
    method: 'post',
    data: data
  })
}

export function saveSysConfig(data) {
  return request({
    url: '/sysConfig/save',
    method: 'post',
    data: data
  })
}

export function updateSysConfig(data) {
  return request({
    url: '/sysConfig/update',
    method: 'post',
    data: data
  })
}

/**
 * 签章
 */

export function saveSignet(data) {
  return request({
    url: '/sysSignet/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteSignet(id) {
  return request({
    url: '/sysSignet/delete',
    method: 'post',
    params: { 'id': id }
  })
}

export function getSignetList(id) {
  return request({
    url: '/sysSignet/list',
    method: 'get'
  })
}

export function getFiledList(proveId, type) {
  return request({
    url: '/sysProveField/list',
    params: { 'proveId': proveId, 'type': type },
    method: 'get'
  })
}

export function saveProveField(arr) {
  return request({
    url: '/sysProveField/save',
    data: arr,
    method: 'post'
  })
}
