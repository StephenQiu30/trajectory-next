// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 上传用户头像 上传头像图片，返回访问 URL POST /file/avatar/upload */
export async function uploadAvatar1(body: {
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
  
  return request<UserAPI.BaseResponseAvatarUploadVO>('/file/avatar/upload', {
  method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

