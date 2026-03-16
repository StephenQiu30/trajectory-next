// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 删除图表 POST /ai/analysis/delete */
export async function deleteChart(body: AiAPI.DeleteRequest,
  options ?: {[key: string]: any}
) {
  return request<AiAPI.BaseResponseBoolean>('/ai/analysis/delete', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 智能分析 (同步) 上传 Excel 进行即时智能分析并返回图表配置 POST /ai/analysis/gen */
export async function genChartByAi(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.genChartByAiParams
    ,body: {
  },file?: File ,
  options ?: {[key: string]: any}
) {
  const formData = new FormData();
  
  if(file){
  
  formData.append('file', file)
  
  }
  
  Object.keys(body).forEach(ele => {
    
    const item = (body as any)[ele];
    
    if (item !== undefined && item !== null) {
      
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], {type: 'application/json'}));
        }
      } else {
        formData.append(ele, item);
      }
      
    }
  });
  
  return request<AiAPI.BaseResponseChart>('/ai/analysis/gen', {
  method: 'POST',
    params: {
        ...params,
          'chartGenRequest': undefined,
          ...params['chartGenRequest'],},
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 智能分析 (异步) 上传 Excel 进行后台异步智能分析，适用于耗时较长的生成任务 POST /ai/analysis/gen/async */
export async function genChartByAiAsync(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.genChartByAiAsyncParams
    ,body: {
  },file?: File ,
  options ?: {[key: string]: any}
) {
  const formData = new FormData();
  
  if(file){
  
  formData.append('file', file)
  
  }
  
  Object.keys(body).forEach(ele => {
    
    const item = (body as any)[ele];
    
    if (item !== undefined && item !== null) {
      
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], {type: 'application/json'}));
        }
      } else {
        formData.append(ele, item);
      }
      
    }
  });
  
  return request<AiAPI.BaseResponseLong>('/ai/analysis/gen/async', {
  method: 'POST',
    params: {
        ...params,
          'chartGenRequest': undefined,
          ...params['chartGenRequest'],},
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 获取图表详情 (VO) 根据 ID 获取指定图表脱敏后的视图对象 GET /ai/analysis/get/vo */
export async function getChartVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.getChartVOByIdParams
    ,
  options ?: {[key: string]: any}
) {
  return request<AiAPI.BaseResponseChartVO>('/ai/analysis/get/vo', {
  method: 'GET',
    params: {
        ...params,},
    ...(options || {}),
  });
}

/** 分页获取图表列表（封装类） 管理员可查看所有图表，普通用户只能查看自己的图表 POST /ai/analysis/list/page/vo */
export async function listChartVoByPage(body: AiAPI.ChartQueryRequest,
  options ?: {[key: string]: any}
) {
  return request<AiAPI.BaseResponsePageChartVO>('/ai/analysis/list/page/vo', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询我的图表 获取当前登录用户所属的图表列表视图对象 POST /ai/analysis/my/list/page/vo */
export async function listMyChartVoByPage(body: AiAPI.ChartQueryRequest,
  options ?: {[key: string]: any}
) {
  return request<AiAPI.BaseResponsePageChartVO>('/ai/analysis/my/list/page/vo', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新图表 更新图表名称、目标、类型等基本信息 POST /ai/analysis/update */
export async function updateChart(body: AiAPI.ChartUpdateRequest,
  options ?: {[key: string]: any}
) {
  return request<AiAPI.BaseResponseBoolean>('/ai/analysis/update', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

