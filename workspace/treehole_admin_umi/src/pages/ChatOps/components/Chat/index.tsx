import admin1 from '@/assets/admin1.png';
import admin2 from '@/assets/admin2.png';
import admin3 from '@/assets/admin3.png';
import bot from '@/assets/Bot.png';

import { getRandomInteger } from '@/utils/getRandomInteger';
import { Avatar, Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import DefalutBot from '../DefaultBot';
import './index.less';

interface IChatProps {
  mode: number;
}

const avatats = [bot, admin1, admin2, admin3];

const Chat: React.FC<IChatProps> = ({ mode }) => {
  const localKey = mode == 1 ? 'chatRecord' : 'deviceChatRecord';
  const currentUser = {
    userID: 3,
    userName: 'admin3',
  };
  const currentUserID = currentUser.userID;
  const [chatRecord, setChatRecord] = useState(JSON.parse(localStorage.getItem(localKey) || '[]'));
  const [sendContent, setSendContent] = useState('');

  function randomSend(id: number, delay: number = 2000) {
    setTimeout(() => {
      setChatRecord((chatRecord: any) => {
        return [
          ...chatRecord,
          {
            time: Date.now(),
            userID: id,
            userName: `admin${id}`,
            context: 'xxxxxx',
          },
        ];
      });
    }, delay);
  }

  function handleSend() {
    setChatRecord([
      ...chatRecord,
      {
        time: Date.now(),
        userID: currentUser.userID,
        userName: currentUser.userName,
        context: sendContent,
      },
    ]);
    setSendContent('');
    if (mode == 1) {
      randomSend(getRandomInteger(1, 2), 2000);
      randomSend(getRandomInteger(1, 2), 4000);
    } else {
      randomSend(0);
    }
  }

  useEffect(() => {
    if (chatRecord.length > 1) document.getElementById('latestMessage')?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    localStorage.setItem(localKey, JSON.stringify(chatRecord));
  }, [chatRecord]);
  return (
    <>
      <div className="chat">
        <div className="chat__main">
          <DefalutBot />
          {chatRecord.map((item: any, index: number) => (
            <div className="main__info" key={item.time} id={index == chatRecord.length - 1 ? 'latestMessage' : ''}>
              <div className="info__time">{new Date(item.time).toLocaleString()}</div>
              <div className="info__content" style={{ flexDirection: `${currentUserID == item.userID ? 'row-reverse' : 'row'}` }}>
                <div className="content__left">
                  <Avatar src={<img src={avatats[item.userID]} />} />
                </div>
                <div className="content__right">
                  <div className="right__username">{item.userName}</div>
                  <div className="right__context">{item.context}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat__input">
          <Input
            bordered={false}
            value={sendContent}
            onChange={(e) => {
              setSendContent(e.target.value);
            }}
          />
          <Button onClick={handleSend}>发送</Button>
        </div>
      </div>
    </>
  );
};

export default Chat;
