declare namespace AiAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponseChart = {
    /** 状态码 */
    code?: number
    data?: Chart
    /** 消息 */
    message?: string
  }

  type BaseResponseChartVO = {
    /** 状态码 */
    code?: number
    data?: ChartVO
    /** 消息 */
    message?: string
  }

  type BaseResponseLong = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: number
    /** 消息 */
    message?: string
  }

  type BaseResponsePageChartVO = {
    /** 状态码 */
    code?: number
    data?: PageChartVO
    /** 消息 */
    message?: string
  }

  type Chart = {
    id?: number
    goal?: string
    name?: string
    chartData?: string
    chartType?: string
    genChart?: string
    genResult?: string
    status?: string
    execMessage?: string
    userId?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type ChartGenRequest = {
    /** 图表名称 */
    name?: string
    /** 分析目标 */
    goal?: string
    /** 图表类型 */
    chartType?: string
  }

  type ChartQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 图表ID */
    id?: number
    /** 图表名称 */
    name?: string
    /** 分析目标 */
    goal?: string
    /** 图表类型 */
    chartType?: string
    /** 用户ID */
    userId?: number
  }

  type ChartUpdateRequest = {
    /** 图表ID */
    id: number
    /** 图表名称 */
    name?: string
    /** 分析目标 */
    goal?: string
    /** 图表类型 */
    chartType?: string
  }

  type ChartVO = {
    /** 图表ID */
    id?: number
    /** 分析目标 */
    goal?: string
    /** 图表名称 */
    name?: string
    /** 图表数据 */
    chartData?: string
    /** 图表类型 */
    chartType?: string
    /** 生成的图表配置 */
    genChart?: string
    /** 生成的结论 */
    genResult?: string
    /** 状态 */
    status?: string
    /** 执行详情 */
    execMessage?: string
    /** 创建用户ID */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }

  type DeleteRequest = {
    /** id */
    id: number
  }

  type genChartByAiAsyncParams = {
    chartGenRequest: ChartGenRequest
  }

  type genChartByAiParams = {
    chartGenRequest: ChartGenRequest
  }

  type getChartVOByIdParams = {
    id: number
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageChartVO = {
    records?: ChartVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageChartVO
    searchCount?: PageChartVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }
}
