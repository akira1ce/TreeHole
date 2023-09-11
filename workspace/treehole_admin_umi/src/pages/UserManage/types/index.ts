import { IUserState } from '@/models/user/types';
import { IDispatch } from 'typings';

export interface IHomePorps {
  user: IUserState;
  dispatch: IDispatch;
}
