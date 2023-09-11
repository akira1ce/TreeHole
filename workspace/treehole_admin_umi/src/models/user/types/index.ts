export interface IUser {
  _id?: string;
  account: string;
  avator: string;
  location: string;
  name: string;
  password: string;
  sex: number;
  role: string;
  status: boolean;
}

export interface IUserState {
  list: IUser[];
  count: number;
}

export type IUserActionType =
  | 'user/removeById'
  | 'user/getUserList'
  | 'user/updateUserList'
  | 'user/register'
  | 'user/modifyById';
