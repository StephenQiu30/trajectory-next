/**
 * WebSocket 消息类型枚举
 */
export enum WebSocketMessageTypeEnum {
  /**
   * 认证消息
   */
  AUTH = 0,

  /**
   * 心跳消息
   */
  HEARTBEAT = 1,

  /**
   * 普通消息
   */
  MESSAGE = 2,

  /**
   * 系统通知
   */
  SYSTEM_NOTICE = 3,

  /**
   * 评论通知
   */
  COMMENT_NOTICE = 4,

  /**
   * 点赞通知
   */
  THUMB_NOTICE = 5,

  /**
   * 收藏通知
   */
  FAVOUR_NOTICE = 6,

  /**
   * 关注通知
   */
  FOLLOW_NOTICE = 7,

  /**
   * 在线状态
   */
  ONLINE_STATUS = 8,

  /**
   * 错误消息
   */
  ERROR = 99,
}
