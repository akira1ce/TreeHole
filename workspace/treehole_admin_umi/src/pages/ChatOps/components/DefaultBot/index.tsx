import bot from '@/assets/Bot.png';
import { Avatar, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';

interface DataType {
  key: string;
  deviceCheck: string;
  deviceRole: string;
  checkContent: string;
  checkTime: string;
  checkResult: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '设备检查',
    dataIndex: 'deviceCheck',
    key: 'deviceCheck',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '设备角色',
    dataIndex: 'deviceRole',
    key: 'deviceRole',
  },
  {
    title: '检查内容',
    dataIndex: 'checkContent',
    key: 'checkContent',
  },
  {
    title: '比对时间点',
    dataIndex: 'checkTime',
    key: 'checkTime',
  },
  {
    title: '检查结果',
    dataIndex: 'checkResult',
    key: 'checkResult',
  },
];

const data: DataType[] = [
  {
    key: '1',
    deviceCheck: 'PXX-HXXXXJRXXX-01',
    deviceRole: '接入交换机',
    checkContent: '硬件状态',
    checkTime: 'N/A',
    checkResult: '正常',
  },
  {
    key: '2',
    deviceCheck: 'PXX-HXXXXJRXXX-01',
    deviceRole: '接入交换机',
    checkContent: 'VRRP状态',
    checkTime: '状态变化: Master to Initialize',
    checkResult: '正常',
  },
  {
    key: '3',
    deviceCheck: 'PXX-HXXXXJRXXX-01',
    deviceRole: '接入交换机',
    checkContent: 'OSPF邻居',
    checkTime: '20230828  04:00:10 ',
    checkResult: '正常',
  },
  {
    key: '4',
    deviceCheck: 'PXX-HXXXXJRXXX-01',
    deviceRole: '接入交换机',
    checkContent: '硬件状态',
    checkTime: '状态变化: Master to Initialize',
    checkResult: '正常',
  },
];

const DefalutBot: React.FC = () => (
  <div className="main__info" key={'bot'}>
    <div className="info__time">{new Date(1694677239421).toLocaleString()}</div>
    <div className="info__content">
      <div className="content__left">
        <Avatar src={<img src={bot} />} />
      </div>
      <div className="content__right">
        <div className="right__username">NewBot</div>
        <div className="right__context" style={{ display: 'flex', flexDirection: 'column' }}>
          {<TableDemo />}
        </div>
      </div>
    </div>
  </div>
);

export const TableDemo: React.FC = () => {
  return (
    <>
      <div style={{ marginBottom: '15px' }}>根据XX故障描述信息，预检查如下，供参考：</div>
      <Table columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </>
  );
};

export default DefalutBot;
