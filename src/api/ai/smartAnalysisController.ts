// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 删除图表 POST /ai/analysis/delete */
export async function deleteChart(body: AiAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseBoolean>('/ai/analysis/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 智能分析 (同步) 上传 Excel 进行智能分析并返回结果 POST /ai/analysis/gen */
export async function genChartByAi(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.genChartByAiParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach(ele => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach(f => formData.append(ele, f || ''))
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], { type: 'application/json' }))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<AiAPI.BaseResponseChart>('/ai/analysis/gen', {
    method: 'POST',
    params: {
      ...params,
      chartGenRequest: undefined,
      ...params['chartGenRequest'],
    },
    data: formData,
    ...(options || {}),
  })
}

/** 智能分析 (异步) 上传 Excel 进行智能分析 (异步处理) POST /ai/analysis/gen/async */
export async function genChartByAiAsync(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.genChartByAiAsyncParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach(ele => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach(f => formData.append(ele, f || ''))
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], { type: 'application/json' }))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<AiAPI.BaseResponseLong>('/ai/analysis/gen/async', {
    method: 'POST',
    params: {
      ...params,
      chartGenRequest: undefined,
      ...params['chartGenRequest'],
    },
    data: formData,
    ...(options || {}),
  })
}

/** 获取图表详情 GET /ai/analysis/get/vo */
export async function getChartVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.getChartVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseChartVO>('/ai/analysis/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取图表列表（封装类） 管理员可查看所有图表，普通用户只能查看自己的图表 POST /ai/analysis/list/page/vo */
export async function listChartVoByPage(
  body: AiAPI.ChartQueryRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponsePageChartVO>('/ai/analysis/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取我的图表列表 POST /ai/analysis/my/list/page/vo */
export async function listMyChartVoByPage(
  body: AiAPI.ChartQueryRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponsePageChartVO>('/ai/analysis/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新图表 更新图表名称、目标、类型等基本信息 POST /ai/analysis/update */
export async function updateChart(
  body: AiAPI.ChartUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseBoolean>('/ai/analysis/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
