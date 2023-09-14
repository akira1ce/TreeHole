// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
//@ts-ignore
import { RunTimeLayoutConfig } from '@umijs/max';
import Header from './pages/Header';
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    // layout: 'mix',
    layout: 'mix',
    token: {
      pageContainer: {
        paddingBlockPageContainerContent: 0,
        paddingInlinePageContainerContent: 0,
      },
    },
    splitMenus: false,
    rightRender: () => <Header />,
  };
};
