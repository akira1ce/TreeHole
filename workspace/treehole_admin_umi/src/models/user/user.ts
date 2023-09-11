import { getUserList, modifyById, register, removeById } from '@/services/user';
import { message } from 'antd';
import { DvaModel } from 'umi';
import { IUserState } from './types';

export default {
  namespace: 'user',
  state: {
    list: [],
    count: 0,
  },
  effects: {
    *register({ payload }: any, { call, put }: any) {
      try {
        yield call(register, payload);
        message.success('Add Success');
      } catch (e) {
        console.log(e);
      }
    },
    *modifyById({ payload }: any, { call, put }: any) {
      try {
        yield call(modifyById, payload);
        message.success('Modify Success');
      } catch (e) {
        console.log(e);
      }
    },
    *getUserList({ payload }: any, { call, put }: any) {
      try {
        const { data } = yield call(getUserList, payload);
        yield put({ type: 'updateUserList', payload: data });
      } catch (e) {
        console.log(e);
      }
    },
    *removeById({ payload }: any, { call, put }: any) {
      try {
        yield call(removeById, payload);
        message.success('Remove Success');
      } catch (e) {
        console.log(e);
      }
    },
  },
  reducers: {
    updateUserList: (state: IUserState, { payload }: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
} as DvaModel<IUserState>;
