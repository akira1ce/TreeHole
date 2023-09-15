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
    },
    {
      key: '6',
      label: 'CASE总结',
      children: '',
    },
  ];

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
        {chatTabIndex == 1 && <Case key={1} />}
        {chatTabIndex == 2 && <Chat mode={1} key={2} />}
        {chatTabIndex == 3 && <ChatRecord key={3} />}
        {chatTabIndex == 4 && <Chat mode={2} key={4} />}
        {chatTabIndex == 6 && <Case key={5} />}
      </div>
    </>
  );
};
export default ChatMain;
