import '@umijs/max/typings';

interface IAction<K, T> {
  type: K;
  payload: T;
}

type IDispatch = <K, T>(action: IAction<K, T>) => void;
