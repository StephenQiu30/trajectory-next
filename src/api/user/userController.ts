// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建用户 由管理员手动创建新用户 POST /user/add */
export async function addUser(body: UserAPI.UserAddRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseLong>('/user/add', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传用户头像 上传头像图片，返回访问 URL POST /user/avatar/upload */
export async function uploadAvatar(body: {
  },file?: File ,
  options ?: {[key: string]: any}
) {
  const formData = new FormData();
  
  if(file){
  
  formData.append('file', file)
  
  }
  
  Object.keys(body).forEach(ele => {
    
    const item = (body as any)[ele];
    
    if (item !== undefined && item !== null) {
      
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], {type: 'application/json'}));
        }
      } else {
        formData.append(ele, item);
      }
      
    }
  });
  
  return request<UserAPI.BaseResponseAvatarUploadVO>('/user/avatar/upload', {
  method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除用户 删除指定 ID 的用户，需要本人或管理员权限 POST /user/delete */
export async function deleteUser(body: UserAPI.DeleteRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseBoolean>('/user/delete', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑个人信息 用户修改并保存自己的个人基本资料 POST /user/edit */
export async function editUser(body: UserAPI.UserEditRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseBoolean>('/user/edit', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据 ID 获取用户 管理员根据用户 ID 获取用户详细脱敏前信息 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserByIdParams
    ,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseUser>('/user/get', {
  method: 'GET',
    params: {
        ...params,},
    ...(options || {}),
  });
}

/** 获取当前登录用户 获取系统当前登录的用户信息 GET /user/get/login */
export async function getLoginUser(
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/get/login', {
  method: 'GET',
    ...(options || {}),
  });
}

/** 根据 ID 获取用户信息 (VO) 获取指定用户脱敏后的视图对象 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdParams
    ,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseUserVO>('/user/get/vo', {
  method: 'GET',
    params: {
        ...params,},
    ...(options || {}),
  });
}

/** 批量获取用户信息 (VO) 批量获取指定用户 ID 列表的脱敏视图信息，主要用于微服务内部调用 GET /user/get/vo/batch */
export async function getUserVoByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdsParams
    ,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseListUserVO>('/user/get/vo/batch', {
  method: 'GET',
    params: {
        ...params,},
    ...(options || {}),
  });
}

/** 是否管理员 返回当前登录用户是否为管理员 GET /user/is/admin */
export async function isAdmin(
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseBoolean>('/user/is/admin', {
  method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取用户列表 管理员分页获取系统所有用户原始数据 POST /user/list/page */
export async function listUserByPage(body: UserAPI.UserQueryRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponsePageUser>('/user/list/page', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户列表 (VO) 分页获取系统用户脱敏后的视图对象列表 POST /user/list/page/vo */
export async function listUserVoByPage(body: UserAPI.UserQueryRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponsePageUserVO>('/user/list/page/vo', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户邮箱登录 使用邮箱 and 验证码进行登录 POST /user/login/email */
export async function userLoginByEmail(body: UserAPI.UserEmailLoginRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/email', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送邮箱验证码 向指定邮箱发送登录或注册所需的验证码 POST /user/login/email/code */
export async function sendEmailLoginCode(body: UserAPI.UserEmailCodeSendRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseInteger>('/user/login/email/code', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取 GitHub 授权 URL 获取跳转到 GitHub 授权页面的 URL GET /user/login/github */
export async function getGitHubAuthorizeUrl(
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseString>('/user/login/github', {
  method: 'GET',
    ...(options || {}),
  });
}

/** GitHub 登录 通过 GitHub 授权码进行登录或注册 POST /user/login/github */
export async function userLoginByGitHub(body: UserAPI.GitHubLoginRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/github', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** GitHub 登录回调 GitHub 授权后的重定向处理接口 GET /user/login/github/callback */
export async function gitHubLoginCallback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.gitHubLoginCallbackParams
    ,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/github/callback', {
  method: 'GET',
    params: {
        ...params,
          'request': undefined,
          ...params['request'],},
    ...(options || {}),
  });
}

/** 用户注销 退出当前登录状态 POST /user/logout */
export async function userLogout(
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseBoolean>('/user/logout', {
  method: 'POST',
    ...(options || {}),
  });
}

/** 更新用户 管理员更新指定用户信息 POST /user/update */
export async function updateUser(body: UserAPI.UserUpdateRequest,
  options ?: {[key: string]: any}
) {
  return request<UserAPI.BaseResponseBoolean>('/user/update', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

