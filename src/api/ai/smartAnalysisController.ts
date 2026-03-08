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
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseChart>('/ai/analysis/gen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
      chartGenRequest: undefined,
      ...params['chartGenRequest'],
    },
    data: body,
    ...(options || {}),
  })
}

/** 智能分析 (异步) 上传 Excel 进行智能分析 (异步处理) POST /ai/analysis/gen/async */
export async function genChartByAiAsync(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.genChartByAiAsyncParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseLong>('/ai/analysis/gen/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
      chartGenRequest: undefined,
      ...params['chartGenRequest'],
    },
    data: body,
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
