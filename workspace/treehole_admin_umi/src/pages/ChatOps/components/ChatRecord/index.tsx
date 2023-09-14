import admin1 from '@/assets/admin1.png';
import admin2 from '@/assets/admin2.png';
import admin3 from '@/assets/admin3.png';
import bot from '@/assets/Bot.png';

import { Avatar } from 'antd';
import { TableDemo } from '../DefaultBot';
import './index.less';
const avatats = [bot, admin1, admin2, admin3];

const ChatRecord: React.FC = () => {
  const chatRecord = JSON.parse(localStorage.getItem('chatRecord') || '[]');
  return (
    <>
      <div className="chatRecord">
        <div className="chatRecord__item" key="bot" style={{ borderBottom: '2px solid #d9d9d9' }}>
          <div className="item__avatar">
            <Avatar src={<img src={avatats[0]} />} />
          </div>
          <div className="item__userInfo">
            <div className="info__infoGroup">
              <div className="info__infoGroup__userName">NewBot</div>
              <div className="info__infoGroup__time">2023/9/14 15:40:39 NewBot</div>
            </div>
            <div className="info__context" style={{width:'800px'}}>
              <TableDemo />
            </div>
          </div>
        </div>
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
              <div className="info__context">{item.context}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default ChatRecord;
