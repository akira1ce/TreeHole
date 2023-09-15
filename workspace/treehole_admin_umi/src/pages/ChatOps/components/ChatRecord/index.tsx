import admin1 from '@/assets/admin1.png';
import admin2 from '@/assets/admin2.png';
import admin3 from '@/assets/admin3.png';
import bot from '@/assets/Bot.png';

import { Avatar, Table } from 'antd';
import './index.less';

const avatats = [bot, admin1, admin2, admin3, admin1, admin2];

const ChatRecord: React.FC = () => {
  const chatRecord = JSON.parse(localStorage.getItem('chatRecord') || '[]');
  return (
    <>
      <div className="chatRecord">
        {chatRecord.map((item: any, index: number) => (
          <div
            className="chatRecord__item"
            key={item.time}
            style={{ borderBottom: `${index != chatRecord.length - 1 ? '2px solid #d9d9d9' : 'none'}` }}
          >
            <div className="item__avatar">
              <Avatar src={<img src={avatats[item.userID]} />} />
            </div>
            <div className="item__userInfo">
              <div className="info__infoGroup">
                <div className="info__infoGroup__userName">{item.userName}</div>
                <div className="info__infoGroup__time">{new Date(item.time).toLocaleString()}</div>
              </div>
              <div className="info__context">
                {item.context.map((item) => (
                  <>
                    {item.type == 0 && <div>{item.data.text}</div>}
                    {item.type == 1 && (
                      <Table columns={item.data.columns} dataSource={item.data.dataSource} pagination={{ hideOnSinglePage: true }} />
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default ChatRecord;
