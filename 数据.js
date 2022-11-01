/**
 * ---Mongodb---
 *
 * User [用户]
 *  |- id
 *  |- account: string
 *  |- password: string
 *  |- sex
 *  |- name
 *  |- avator
 *  |- location
 *
 * Record [记录]
 *  |- id
 *  |- userID
 *  |- following: [userID]            关注
 *  |- fans: [userID]                 粉丝
 *  |- collect: [TreeID]              收藏
 *  |- browsingHistory: [TreeID]      浏览记录
 *
 * Socket [通信]
 *  |- id
 *  |- userID1
 *  |- userID2
 *  |- context: [{sender:xxx, time:xxx, data:{ type:0|1, content:xxx }}]
 *
 * Tree [苗木]
 *  |- id
 *  |- ownerID        所有者
 *  |- type           树种
 *  |- height         高度
 *  |- diameter       直径
 *  |- shapeScore     树形分
 *  |- branchPoint    分支点
 *  |- location       位置
 *  |- describe       描述
 *  |- imgs           图片
 *  |- price          价格
 *  |- state          状态
 *
 * Order [订单]
 *  |- id
 *  |- TreeID
 *  |- buyerID
 *  |- sellerID
 *  |- timer
 *  |- state
 */

Order = {
  _id: {
    $oid: "634a4b48e553096bd0c95c3d",
  },
  TreeID: "",
  buyerID: "",
  sellerID: "",
  time: "",
  state: "",
};

Record = {
  _id: {
    $oid: "634a4915e553096bd0c95c2a",
  },
  userID: "634a46aae553096bd0c95c10",
  following: ["634a6349e553096bd0c95c4b", "634a63a0e553096bd0c95c4c"],
  fans: ["634a63a0e553096bd0c95c4c"],
  collect: ["634a6764e553096bd0c95c53", "634a679fe553096bd0c95c54"],
  browsingHistory: [
    "634a4abee553096bd0c95c36",
    "634a679fe553096bd0c95c54",
    "634a6764e553096bd0c95c53",
  ],
};

Socket = {
  _id: {
    $oid: "634a4923e553096bd0c95c33",
  },
  userID1: "",
  userID2: "",
  context: [
    {
      senderID: "634a46aae553096bd0c95c10",
      time: "2022/11/1 15:33:15",
      data: {
        type: "1",
        content: "123",
      },
    },
  ],
};

Tree = {
  _id: {
    $oid: "634a4abee553096bd0c95c36",
  },
  ownerID: "634a63a0e553096bd0c95c4c",
  type: "香樟",
  height: "700",
  diameter: "20",
  branchPoint: "150",
  location: "安徽-安庆-怀宁-金拱镇",
  describe: "树形极好，欢迎来电交流",
  imgs: [""],
  price: "600",
  state: "0",
};

User = {
  _id: {
    $oid: "634a46aae553096bd0c95c10",
  },
  account: "17756287961",
  password: "admin123",
  name: "amos",
  sex: "1",
  location: "安徽铜陵",
  avator: "",
};
var date = new Date();
console.log(date.toLocaleString());
