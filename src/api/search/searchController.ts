// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 聚合搜索查询 POST /search/all */
export async function doSearchAll(body: SearchAPI.SearchRequest, options?: { [key: string]: any }) {
  return request<SearchAPI.BaseResponseSearchVOObject>('/search/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步用户到 ES POST /search/user/batch/upsert */
export async function batchUpsertUser(
  body: SearchAPI.UserEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/user/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索用户（从 ES 查询） POST /search/user/page */
export async function searchUserByPage(
  body: SearchAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/user/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
