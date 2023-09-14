import React, { useState } from 'react';
import './index.less';

const Case: React.FC = () => {
  const [caseInfo, setCaseInfo] = useState([
    {
      title: '信息概览',
      items: [
        { itemTitle: '报障工单', itemContent: 'ST-20230903-0098N3' },
        { itemTitle: '故障系统/应用管理员', itemContent: '张*工程师  /  郑**架构师' },
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
        { itemTitle: '管理员1', itemContent: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' },
        { itemTitle: '管理员1', itemContent: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' },
      ],
    },
    {
      title: '排查过程',
      items: [
        { itemTitle: '报障工单', itemContent: 'ST-20230903-0098N3' },
        { itemTitle: '故障系统/应用管理员', itemContent: '张*工程师  /  郑**架构师' },
        { itemTitle: '关联应用', itemContent: '手机银行  /  理财APP  /  信用卡中心  /  证券交易平台' },
      ],
      content: '过程文本记录',
    },
  ]);
  return (
    <>
      <div className="caseCards">
        {caseInfo.map((item) => (
          <>
            <div className="caseCards__card">
              <div className="card__title">{item.title}</div>
              <div className="card__main">
                {item.items.map((_) => (
                  <>
                    <div className="main__items">
                      <div className="items__itemTitle">{_.itemTitle}:</div>
                      <div className="items__itemContent">{_.itemContent}</div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};
export default Case;
