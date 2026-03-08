/**
 * 用户角色枚举
 */
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  BAN = 'ban',
}

/**
 * 用户角色枚举 - 中文映射
 */
export const UserRoleEnumText: Record<UserRoleEnum, string> = {
  [UserRoleEnum.USER]: '用户',
  [UserRoleEnum.ADMIN]: '管理员',
  [UserRoleEnum.BAN]: '被封号',
}

/**
 * 获取值列表
 */
export const getUserRoleEnumValues = (): string[] => {
  return Object.values(UserRoleEnum)
}
