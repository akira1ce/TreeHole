export const DEFAULT_NAME = 'Umi Max';

/** User */
export const colors = ['orange', 'green'];
export const roles = ['seller', 'buyer'];
export const drawerTitles = ['', 'ADD', 'UPDATE'];
export const drawerPlacement = 'right';

/** chatGroups */
export const CHATGROUPS = [
  { id: 1, title: 'ST-20230903-0098N3' },
  { id: 2, title: 'ST-20230903-0098N3' },
  { id: 3, title: 'ST-20230903-0098N3' },
  { id: 4, title: 'ST-20230903-0098N3' },
  { id: 5, title: 'ST-20230903-0098N3' },
  { id: 6, title: 'ST-20230903-0098N3' },
];

export const CHATRECORD = [
  {
    time: 1694677239441,
    userID: 0,
    userName: 'newBot',
    context: [
      { type: 0, data: { text: '根据XX故障描述信息，预检查如下，供参考：' } },
      {
        type: 1,
        data: {
          columns: [
            {
              title: '设备检查',
              dataIndex: 'deviceCheck',
              key: 'deviceCheck',
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
          ],
          dataSource: [
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
          ],
        },
      },
    ],
  },
  {
    time: 1694677239445,
    userID: 1,
    userName: '张伟杰(应用管理员)',
    context: [{ type: 0, data: { text: '我这边看了下应用日志，有大量的重传，ping核心账务系统丢包比较多' } }],
  },
  {
    time: 1694677239455,
    userID: 2,
    userName: '李明洋(应用管理员)',
    context: [{ type: 0, data: { text: '我这边也是差不多情况，昨天晚上8点-10点业务高峰的时候，就有一些交易失败，后来恢复了。' } }],
  },
  {
    time: 1694677239465,
    userID: 3,
    userName: '王瑞琪(网络管理员)',
    context: [{ type: 0, data: { text: '好，我来检查下流量路径的设备情况' } }],
  },
  {
    time: 1694677239475,
    userID: 4,
    userName: '陈宇轩(网络二线支持)',
    context: [
      {
        type: 0,
        data: {
          text: '我刚登进来，看了下故障记录和现象，平台查了下，这故障跟去年10月份的差不多，故障单刘娟查一下，重点检查下那两台业务核心的交换机。',
        },
      },
    ],
  },
  {
    time: 1694677239485,
    userID: 3,
    userName: '王瑞琪(网络管理员)',
    context: [{ type: 0, data: { text: '收到' } }],
  },
  {
    time: 1694677239495,
    userID: 5,
    userName: '刘娟（网络管理员）',
    context: [{ type: 0, data: { text: '我查下平台故障记录，那次是板卡问题，我来跑一次硬件状态检查任务' } }],
  },
];

export const DEVICECHATRECORD = [
  { time: 1694677239495, userID: 3, userName: '王瑞琪(网络管理员)', context: [{ type: 0, data: { text: '172.16.20.73这台设备有UP的接口么' } }] },
  {
    time: 1694677239505,
    userID: 0,
    userName: 'newBot',
    context: [
      {
        type: 0,
        data: {
          text: 'IP Interface Status for VRF "default"(1)',
        },
      },
      {
        type: 0,
        data: {
          text: 'Interface            IP Address      Interface Status',
        },
      },
      {
        type: 0,
        data: {
          text: 'Mgmt0               172.16.20.73   protocol-up/link-up/admin-up',
        },
      },
      {
        type: 0,
        data: {
          text: 'Eth2/1               10.200.40.1    protocol-down/link-down/admin-up',
        },
      },
      {
        type: 0,
        data: {
          text: 'Eth2/2               10.200.40.1    protocol-down/link-down/admin-up',
        },
      },
      {
        type: 0,
        data: {
          text: 'Eth2/3               10.200.40.1    protocol-down/link-down/admin-up',
        },
      },
      {
        type: 0,
        data: {
          text: 'Eth2/4              10.200.40.1    protocol-down/link-down/admin-up',
        },
      },
    ],
  },
  { time: 1694677239515, userID: 3, userName: '王瑞琪(网络管理员)', context: [{ type: 0, data: { text: '列举一下172.16.20.73这台设备的BGP状态' } }] },
  {
    time: 1694677239525,
    userID: 0,
    userName: 'newBot',
    context: [
      {
        type: 1,
        data: {
          columns: [
            // 设备名	设备IP	BGP AS	Neighbor	Neighbor AS	Neighbor状态	BGP接收条目

            {
              title: '设备名',
              dataIndex: 'deviceName',
              key: 'deviceName',
            },
            {
              title: '设备IP',
              dataIndex: 'deviceIp',
              key: 'deviceIp',
            },
            {
              title: 'BGP AS',
              dataIndex: 'bgpAs',
              key: 'bgpAs',
            },
            {
              title: 'Neighbor',
              dataIndex: 'neighbor',
              key: 'neighbor',
            },
            {
              title: 'Neighbor AS',
              dataIndex: 'neighborAs',
              key: 'neighborAs',
            },
            {
              title: 'Neighbor状态',
              dataIndex: 'neighborStatus',
              key: 'neighborStatus',
            },
            {
              title: 'BGP接收条目',
              dataIndex: 'bgpCount',
              key: 'bgpCount',
            },
          ],
          dataSource: [
            {
              key: '1',
              deviceName: 'XX-Core-Edge-SW1',
              deviceIp: '172.16.20.73',
              bgpAs: '65001',
              neighbor: '10.200.254.11',
              neighborAs: '65001',
              neighborStatus: 'Established',
              bgpCount: '23',
            },
            {
              key: '2',
              deviceName: 'XX-Core-Edge-SW1',
              deviceIp: '172.16.20.73',
              bgpAs: '65001',
              neighbor: '10.200.40.2',
              neighborAs: '65002',
              neighborStatus: 'Established',
              bgpCount: '117',
            },
            {
              key: '3',
              deviceName: 'XX-Core-Edge-SW1',
              deviceIp: '172.16.20.73',
              bgpAs: '65001',
              neighbor: '10.200.40.3',
              neighborAs: '65002',
              neighborStatus: 'Idle',
              bgpCount: '0',
            },
          ],
        },
      },
    ],
  },
];
