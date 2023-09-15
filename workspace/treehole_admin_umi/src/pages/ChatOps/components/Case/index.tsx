import React from 'react';
import './index.less';

interface IInfoItems {
  itemTitle: string;
  itemContent: string;
}

interface ICaseInfo {
  title: string;
  items: IInfoItems[];
}

interface ICaseProps {
  caseInfo: ICaseInfo[];
}

const Case: React.FC<ICaseProps> = ({ caseInfo }) => {
  return (
    <>
      <div className="caseCards">
        {caseInfo.map((item) => (
          <div className="caseCards__card" key={item.title}>
            <div className="card__title">{item.title}</div>
            <div className="card__main">
              {item.items.map((_) => (
                <div className="main__items" key={_.itemTitle}>
                  <div className="items__itemTitle">{_.itemTitle}:</div>
                  <div className="items__itemContent">{_.itemContent}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Case;
