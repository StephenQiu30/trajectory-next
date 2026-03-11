import {
  Activity,
  BarChart3,
  Filter,
  Grid3X3,
  LayoutGrid,
  LineChart,
  PieChart,
  ScatterChart,
} from 'lucide-react'
import { ChartTypeEnum } from '../enums/ChartTypeEnum'

export const chartIconMap: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  [ChartTypeEnum.LINE]: {
    icon: LineChart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: '折线图',
  },
  [ChartTypeEnum.BAR]: {
    icon: BarChart3,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    label: '柱状图',
  },
  [ChartTypeEnum.PIE]: {
    icon: PieChart,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: '饼图',
  },
  [ChartTypeEnum.SCATTER]: {
    icon: ScatterChart,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: '散点图',
  },
  [ChartTypeEnum.RADAR]: {
    icon: Activity,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    label: '雷达图',
  },
  [ChartTypeEnum.HEATMAP]: {
    icon: Grid3X3,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: '热力图',
  },
  [ChartTypeEnum.TREEMAP]: {
    icon: LayoutGrid,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: '矩形树图',
  },
  [ChartTypeEnum.FUNNEL]: {
    icon: Filter,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: '漏斗图',
  },
}

export const getChartIcon = (type: string | undefined) => {
  const config = chartIconMap[type as ChartTypeEnum] || chartIconMap[ChartTypeEnum.BAR]
  const Icon = config.icon
  // We can also pass className to customize the icon size etc.
  return <Icon className={`h-5 w-5 ${config.color}`} />
}
