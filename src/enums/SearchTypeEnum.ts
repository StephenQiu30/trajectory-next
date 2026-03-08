/**
 * 搜索类型枚举
 *
 * @author StephenQiu30
 */
export enum SearchTypeEnum {
  POST = 'post',
  USER = 'user',
}

/**
 * 搜索类型枚举 - 中文映射
 */
export const SearchTypeEnumText: Record<SearchTypeEnum, string> = {
  [SearchTypeEnum.POST]: '帖子',
  [SearchTypeEnum.USER]: '用户',
}

/**
 * 获取值列表
 */
export const getSearchTypeEnumValues = (): string[] => {
  return Object.values(SearchTypeEnum)
}
