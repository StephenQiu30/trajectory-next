declare namespace SearchAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponsePage = {
    /** 状态码 */
    code?: number
    data?: Page
    /** 消息 */
    message?: string
  }

  type BaseResponseSearchVOObject = {
    /** 状态码 */
    code?: number
    data?: SearchVOObject
    /** 消息 */
    message?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type Page = {
    records?: Record<string, any>[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageObject
    searchCount?: PageObject
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageObject = {
    records?: Record<string, any>[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageObject
    searchCount?: PageObject
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type SearchRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 搜索词 */
    searchText?: string
    /** 分类 */
    type?: string
  }

  type SearchVOObject = {
    /** 数据列表 */
    dataList?: Record<string, any>[]
    /** 总条数 */
    total?: number
    /** 当前页 */
    current?: number
    /** 每页大小 */
    pageSize?: number
  }

  type UserEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    userEmail?: string
    userPhone?: string
  }

  type UserQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序方式 */
    sortOrder?: string
    /** 用户ID */
    id?: number
    /** 排除的用户ID */
    notId?: number
    /** 用户昵称 */
    userName?: string
    /** 用户角色 */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
    /** 搜索文本 */
    searchText?: string
  }
}
