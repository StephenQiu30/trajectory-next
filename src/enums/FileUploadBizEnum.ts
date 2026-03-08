/**
 * 文件上传业务类型枚举
 */
export enum FileUploadBizEnum {
  USER_AVATAR = 'user_avatar',
  POST_COVER = 'post_cover',
  POST_IMAGE_COVER = 'post_image_cover',
}

/**
 * 文件上传业务类型枚举 - 中文映射
 */
export const FileUploadBizEnumText: Record<FileUploadBizEnum, string> = {
  [FileUploadBizEnum.USER_AVATAR]: '用户头像',
  [FileUploadBizEnum.POST_COVER]: '帖子封面',
  [FileUploadBizEnum.POST_IMAGE_COVER]: '帖子上传图片',
}

/**
 * 获取值列表
 */
export const getFileUploadBizEnumValues = (): string[] => {
  return Object.values(FileUploadBizEnum)
}
