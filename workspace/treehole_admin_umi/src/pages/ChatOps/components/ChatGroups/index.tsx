import './index.less';

interface IChatGroup {
  id: number;
  title: string;
}
interface IChatGroupsProps {
  chatGroups: IChatGroup[];
  chatGroupIndex: number;
  changeGroupIndex: (index: number) => void;
}

const ChatGroups: React.FC<IChatGroupsProps> = ({ chatGroups, chatGroupIndex, changeGroupIndex }) => {
  return (
    <div className="chatGroups">
      <div className="chatGroups__header">ChatOps故障处理</div>
      <div className="chatGroups__main">
        <div className="main__left">
          <div className="left__current" style={{ top: `${chatGroupIndex * 55}px` }}></div>
        </div>
        <div className="main__right">
          {chatGroups.map((item, index) => (
            <div
              className={`chatGroups__group ${index == chatGroupIndex && 'chatGroups__group__avtive'}`}
              key={item.id}
              onClick={() => {
                changeGroupIndex(index);
              }}
            >
              <svg className="group__dot" xmlns="http://www.w3.org/2000/svg" width="5" height="6" viewBox="0 0 5 6" fill="none">
                <circle cx="2.5" cy="3" r="2.5" fill="#014CE2" />
              </svg>
              <div className="group__title" style={{ fontWeight: `${index == chatGroupIndex ? '500' : '400'}` }}>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ChatGroups;
