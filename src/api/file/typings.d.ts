declare namespace FileAPI {
  type addFileParams = {
    fileUploadRequest: FileUploadRequest
  }

  type BaseResponseFileUploadVO = {
    /** 状态码 */
    code?: number
    data?: FileUploadVO
    /** 消息 */
    message?: string
  }

  type FileUploadRequest = {
    /** 业务类型 */
    biz?: string
  }

  type FileUploadVO = {
    /** 文件访问地址 */
    url?: string
    /** 文件名 */
    fileName?: string
  }
}
