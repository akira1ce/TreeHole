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
 var date = new Date();
console.log(date.toLocaleString());
