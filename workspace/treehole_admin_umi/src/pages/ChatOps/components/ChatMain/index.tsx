import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { useState } from 'react';
import Case from '../Case';
import Chat from '../Chat';
import ChatRecord from '../ChatRecord';
import './index.less';

interface IChatMainProps {}
const ChatMain: React.FC<IChatMainProps> = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'CASE背景信息汇总',
      children: '',
    },
    {
      key: '2',
      label: 'ChatOps',
      children: '',
    },
    {
      key: '3',
      label: '过程记录',
    },
    {
      key: '4',
      label: '设备交互',
      children: '',
    },
    {
      key: '5',
      label: '紧急变更',
      children: '',
      disabled: true,
    },
    {
      key: '6',
      label: 'CASE总结',
      children: '',
    },
  ];

  const [caseInfo, setCaseInfo] = useState([
    {
      title: '信息概览',
      items: [
        { itemTitle: '报障工单', itemContent: 'ST-20230903-0098N3' },
        { itemTitle: '故障系统/应用管理员', itemContent: '张程工程师  /  郑悦架构师' },
        { itemTitle: '关联应用', itemContent: '手机银行  /  理财APP  /  信用卡中心  /  证券交易平台' },
      ],
    },
    {
      title: '关键排查信息汇总',
      items: [
        { itemTitle: '管理员1', itemContent: '业务虚机连通性异常' },
        { itemTitle: '管理员2', itemContent: '网关交换机MAC地址冲突' },
      ],
    },
    {
      title: '排查结论',
      items: [
        { itemTitle: '管理员1', itemContent: '张伟杰(应用管理员)' },
        { itemTitle: '管理员2', itemContent: '李明洋(应用管理员)' },
      ],
    },
    {
      title: '排查过程',
      items: [
        { itemTitle: '报障工单', itemContent: 'ST-20230903-0098N3' },
        { itemTitle: '故障系统/应用管理员', itemContent: '张红工程师  /  郑奇架构师' },
        { itemTitle: '关联应用', itemContent: '手机银行  /  理财APP  /  信用卡中心  /  证券交易平台' },
      ],
      content: '过程文本记录',
    },
  ]);

  const [chatTabIndex, setChatTabIndex] = useState(1);

  function onChange(key: string) {
    setChatTabIndex(Number(key));
  }

  return (
    <>
      <div className="chatMain">
        <div className="chatMain__groupTitle">报障工单ST-20230903-0098N3</div>
        <div className="chatMain__ChatTabs">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} size="small"></Tabs>
        </div>
        {chatTabIndex == 1 && <Case caseInfo={caseInfo.slice(0, 2)} />}
        {chatTabIndex == 2 && <Chat mode={1} />}
        {chatTabIndex == 3 && <ChatRecord />}
        {chatTabIndex == 4 && <Chat mode={2} />}
        {chatTabIndex == 6 && <Case caseInfo={caseInfo} />}
      </div>
    </>
  );
};
export default ChatMain;
