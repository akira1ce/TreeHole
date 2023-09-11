import { IUser } from '@/models/user/types';
import api from '../api';
import request from '../request';

export interface IGetUserListParams {
  pageNo: number;
  limit: number;
  name: string;
}

export interface IRemoveByIdParams {
  _id: string;
}

export async function getUserList(params: IGetUserListParams) {
  return request.post(api.user.getUserList, params);
}

export async function removeById(params: IRemoveByIdParams) {
  return request.post(api.user.removeById, params);
}

export async function register(params: IUser) {
  return request.post(api.user.register, params);
}

export async function modifyById(params: IUser) {
  return request.post(api.user.modifyById, params);
}
