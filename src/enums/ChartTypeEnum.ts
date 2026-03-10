/**
 * Enum for Chart Types corresponding to the backend ChartTypeEnum
 */
export enum ChartTypeEnum {
  LINE = '折线图',
  BAR = '柱状图',
  PIE = '饼图',
  SCATTER = '散点图',
  RADAR = '雷达图',
  HEATMAP = '热力图',
  TREEMAP = '矩形树图',
  FUNNEL = '漏斗图',
}

/**
 * Enum for Chart Generation Status corresponding to the backend
 */
export enum ChartStatusEnum {
  WAIT = 'wait',
  RUNNING = 'running',
  SUCCEED = 'succeed',
  FAILED = 'failed',
}
