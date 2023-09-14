import { CHATGROUPS } from '@/constants';
import { useState } from 'react';
import ChatGroups from './components/ChatGroups';
import ChatMain from './components/ChatMain';
import './index.less';

const ChatOps: React.FC = (props) => {
  const [chatGroups, setChatGroups] = useState(CHATGROUPS);
  const [chatGroupIndex, setChatGroupIndex] = useState(0);

  function changeGroupIndex(index: number) {
    setChatGroupIndex(index);
  }
  return (
    <>
      <div className="container">
        <ChatGroups chatGroups={chatGroups} chatGroupIndex={chatGroupIndex} changeGroupIndex={changeGroupIndex} />
        <ChatMain />
      </div>
    </>
  );
};

export default ChatOps;
