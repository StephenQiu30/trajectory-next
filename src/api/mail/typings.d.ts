declare namespace MailAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponseEmailCodeVO = {
    /** 状态码 */
    code?: number
    data?: EmailCodeVO
    /** 消息 */
    message?: string
  }

  type EmailAttachment = {
    /** 附件名称 */
    filename: string
    /** 附件内容(Base64编码) */
    content: string
    /** 附件大小(字节) */
    size?: number
    /** 内容类型 */
    contentType?: string
  }

  type EmailCodeRequest = {
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: string
    /** 客户端IP */
    clientIp?: string
  }

  type EmailCodeVO = {
    /** 验证码过期时间(秒) */
    expireTime?: number
  }

  type MailSendCodeRequest = {
    /** 收件人 */
    to?: string
    /** 验证码 */
    code?: string
    /** 有效期(分钟) */
    minutes?: number
    /** 是否异步发送 */
    async?: boolean
  }

  type MailSendRequest = {
    /** 收件人 */
    to?: string
    /** 主题 */
    subject?: string
    /** 内容 */
    content?: string
    /** 是否为HTML格式 */
    isHtml?: boolean
    /** 业务类型 */
    bizType?: string
    /** 业务ID */
    bizId?: string
    /** 模板名称 */
    templateName?: string
    /** 模板变量 */
    templateVariables?: Record<string, any>
    /** 附件列表 */
    attachments?: EmailAttachment[]
  }
}
