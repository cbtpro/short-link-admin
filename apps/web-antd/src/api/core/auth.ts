import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /**
   * 注册用户接口参数
   */
  export interface RegisterParams {
    agreePolicy: boolean;
    username: string;
    password: string;
    confirmPassword: string;
    captcha: boolean;
  }
  /**
   * 注册接口返回值
   */
  export interface RegisterResult<T> {
    success: boolean;
    message: string;
    data: T;
  }
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 注册新用户
 */
export async function registerApi(data: AuthApi.RegisterParams) {
  return requestClient.post<AuthApi.RegisterResult<IUser>>(
    '/auth/register',
    data,
  );
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', null, {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.post<string[]>('/auth/codes');
}
