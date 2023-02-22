import { type IUser } from "./user"

export interface ILoginRequestData {
  /** admin 或 editor */
  account: string
  /** 密码 */
  password: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string; user: IUser }>

export type UserInfoResponseData = IApiResponseData<{ account: string; roles: string[] }>
