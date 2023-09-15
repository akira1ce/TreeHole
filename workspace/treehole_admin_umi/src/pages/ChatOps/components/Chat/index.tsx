import admin1 from '@/assets/admin1.png';
import admin2 from '@/assets/admin2.png';
import admin3 from '@/assets/admin3.png';
import bot from '@/assets/Bot.png';
import share from '@/assets/Share.png';

import { CHATRECORD, DEVICECHATRECORD } from '@/constants';
import { Avatar, Button, Input, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';

interface IChatProps {
  mode: number;
}

const avatats = [bot, admin1, admin2, admin3, admin1, admin2];
const groupmember = ['newBot', '张伟杰(应用管理员)', '李明洋(应用管理员)', '王瑞琪(网络管理员)', '陈宇轩(网络二线支持)', '刘娟（网络管理员）'];

const Chat: React.FC<IChatProps> = ({ mode }) => {
  const localKey = mode == 1 ? 'chatRecord' : 'deviceChatRecord';
  const initState = mode == 1 ? CHATRECORD : DEVICECHATRECORD;
  const currentUser = {
    userID: 3,
    userName: groupmember[3],
  };
  const currentUserID = currentUser.userID;
  const [chatRecord, setChatRecord] = useState(JSON.parse(localStorage.getItem(localKey)) || initState);
  const [sendContent, setSendContent] = useState('');

  function randomSend(id: number, text: string, delay: number = 2000) {
    if (id == currentUserID) id++;
    setTimeout(() => {
      setChatRecord((chatRecord: any) => {
        return [
          ...chatRecord,
          {
            time: Date.now(),
            userID: id,
            userName: groupmember[id],
            context: [
              {
                type: 0,
                data: { text },
              },
            ],
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
        context: [
          {
            type: 0,
            data: { text: sendContent },
          },
        ],
      },
    ]);
    setSendContent('');
    if (mode == 1) {
      randomSend(5, '主接口板卡异常了，上联口只剩一半，带宽满了，要换备件', 2000);
      randomSend(
        4,
        '那应该就是板卡故障导致的问题，硬件问题导致路由邻居DOWN，带宽损失一半，部分应用丢包严重、质量差。换完板卡继续观察。另外根据今天的结果，要把BGP检查加到预置检查模板，刘娟明天处理下，及时反馈结果。',
        4000,
      );
    } else {
      randomSend(0, '', 2000);
    }
  }
  function shareToGroupChat(groupName: string, context: any) {
    const chatRecordBack = JSON.parse(localStorage.getItem(groupName) || '[]');
    chatRecordBack.push({ time: Date.now(), userID: currentUserID, userName: groupmember[currentUserID], context });
    localStorage.setItem(groupName, JSON.stringify(chatRecordBack));
    message.success('分享成功');
  }

  useEffect(() => {
    if (chatRecord.length > 1) {
      document.getElementById('latestMessage')?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    localStorage.setItem(localKey, JSON.stringify(chatRecord));
  }, [chatRecord]);
  return (
    <>
      <div className="chat">
        <div className="chat__main">
          {chatRecord.map((item: any, index: number) => (
            <div className="main__info" key={item.time} id={index == chatRecord.length - 1 ? 'latestMessage' : ''}>
              <div className="info__time">{new Date(item.time).toLocaleString()}</div>
              <div className="info__content" style={{ flexDirection: `${currentUserID == item.userID ? 'row-reverse' : 'row'}` }}>
                <div className="content__left">
                  <Avatar src={<img src={avatats[item.userID]} />} />
                </div>
                <div className="content__right" style={{ alignItems: `${currentUserID == item.userID ? 'flex-end' : 'flex-start'}` }}>
                  <div className="right__username">{item.userName}</div>
                  <div className="right__context">
                    {item.context.map((item) => (
                      <>
                        {item.type == 0 && <div>{item.data.text}</div>}
                        {item.type == 1 && (
                          <Table columns={item.data.columns} dataSource={item.data.dataSource} pagination={{ hideOnSinglePage: true }} />
                        )}
                      </>
                    ))}
                  </div>
                  {/* {mode == 2 && <ShareAltOutlined />} */}
                </div>
                {mode == 2 && (
                  <img
                    src={share}
                    alt=""
                    style={{ alignSelf: 'flex-end', width: '35px', cursor: 'pointer' }}
                    onClick={() => {
                      shareToGroupChat('chatRecord', item.context);
                    }}
                  />
                )}
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
