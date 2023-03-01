/*
 * @Author: Akira
 * @Date: 2022-11-14 16:54:59
 * @LastEditTime: 2023-03-01 15:04:28
 */
export default {
  user: {
    /**
     * 注册
     * @param account 用户名
     * @param password 密码
     */
    register: "/user/register",
    /**
     * 登陆
     * @param account 用户名
     * @param password 密码
     */
    login: "/user/login",
    /**
     * 删除用户
     * @param _id 用户id
     */
    removeById: "/user/removeById",
    /**
     * 修改用户
     * @param _id 用户id
     */
    modifyById: "/user/modifyById",
    /**
     * 查询用户列表
     */
    getUserList: "/user/getUserList",
    /**
     * 查询用户集合列表
     * @param users 用户集合
     * @param pageNo 页码
     * @param limit 页限
     */
    getUserListByID: "/user/getUserListByID",
    /**
     * 查询用户
     * @param _id 用户id
     */
    getUserById: "/user/getUserById",
  },
  tree: {
    /**
     * 新增苗木
     * @param ownerID 所有者id
     * @param type 苗木类型
     * @param title 苗木标题
     * @param describe 苗木描述
     * @param price 苗木价格
     * @param height 苗木高度
     * @param diameter 苗木直径
     * @param crownDiameter 苗木冠径
     * @param branchPoint 苗木分支点
     * @param hci 苗木高阔比
     * @param location 苗木地址
     */
    addTree: "/tree/addTree",
    /**
     * 删除苗木
     * @param _id 苗木id
     */
    removeById: "/tree/removeById",
    /**
     * 修改苗木
     * @param _id 苗木id
     * @param xx 需要修改的苗木属性
     */
    modifyById: "/tree/modifyById",
    /**
     * 查询苗木
     * @param _id 苗木id
     */
    getTreeById: "/tree/getTreeById",
    /**
     * 查询苗木列表
     * @param pageNo 页码
     * @param limit 页限
     */
    getTreeList: "/tree/getTreeList",
    /**
     * 查询用户苗木列表
     * @param userID 用户id
     * @param pageNo 页码
     * @param limit 页限
     */
    getTreeListByUserID: "/tree/getTreeListByUserID",
    /**
     * 查询苗木集合列表
     * @param trees 苗木集合
     * @param pageNo 页码
     * @param limit 页限
     */
    getTreeListByID: "/tree/getTreeListByID",
    /**
     * 查询推荐苗木列表
     * @param trees 苗木集合(用户浏览记录)
     * @param pageNo 页码
     * @param limit 页限
     */
    getRecommendTreeList: "/tree/getRecommendTreeList",
    /**
     * 查询地区苗木列表
     * @param area 用户所属地区(市级)
     * @param pageNo 页码
     * @param limit 页限
     */
    getAreaTreeList: "/tree/getAreaTreeList",
  },
  uploadCenter: {
    upload: "/uploadCenter/upload",
    files: "/uploadCenter/files",
    remove: "/uploadCenter/remove",
  },
  record: {
    /**
     * 修改用户关注、粉丝记录
     * @param userID1 用户id
     * @param userID2 被关注用户id
     */
    modifyRecordUser: "/record/modifyRecordUser",
    /**
     * 修改用户苗木记录
     * @param userID 用户id
     * @param treeID 苗木id
     * @param mode 标志(0: 浏览记录, 1: 收藏记录)
     * @param clearAll 是否清除浏览记录
     */
    modifyRecordTree: "/record/modifyRecordTree",
    /**
     * 修改用户订单记录
     * @param userID 用户id
     * @param orderID 订单id
     */
    modifyRecordOrder: "/record/modifyRecordOrder",
    /**
     * 修改用户会话记录
     * @param userID 用户id
     * @param socketID 会话id
     */
    modifyRecordSocket: "/record/modifyRecordSocket",
    /**
     * 修改用户记录
     * @param _id 记录id
     * @param xx 需要修改的属性
     */
    modifyByID: "/record/modifyByID",
    /**
     * 查询用户记录
     * @param userID 用户id
     */
    getRecordByUserID: "/record/getRecordByUserID",
  },
  order: {
    /**
     * 增加订单
     * @param treeID 苗木id
     * @param tree 苗木信息
     * @param buyerID 买方id 登陆用户
     * @param sellerID 卖方id 苗木所有者
     */
    addOrder: "/order/addOrder",
    /**
     * 删除订单
     * @param _id 订单id
     */
    removeById: "/order/removeById",
    /**
     * 修改订单
     * @param _id 订单id
     * @param xx 需要修改的订单属性
     */
    modifyById: "/order/modifyById",
    /**
     * 修改订单
     * @param treeID 订单id
     * @param state 订单状态
     */
    modifyByTreeID: "/order/modifyByTreeID",
    getOrderList: "/order/getOrderList",
    /**
     * 查询订单集合列表
     * @param orders 订单集合
     * @param pageNo 页码
     * @param limit 页限
     */
    getOrderListByID: "/order/getOrderListByID",
    /**
     * 查询用户订单列表
     * @param userID 用户id
     */
    getOrderListByUserID: "/order/getOrderListByUserID",
    /**
     * 查询苗木订单
     * @param treeID 苗木id
     */
    getOrderByTreeID: "/order/getOrderByTreeID",
    /**
     * 数据分析
     */
    dataAnalysis: "/order/dataAnalysis",
  },
  socket: {
    /**
     * 增加会话
     * @param userID1 会话者id
     * @param userID2 会话者id
     * @param treeID 苗木id
     * @param tree 苗木
     */
    addSocket: "/socket/addSocket",
    /**
     * 删除会话
     * @param _id 会话id
     */
    removeById: "/socket/removeById",
    /**
     * 修改会话
     * @param _id 会话id
     * @param msg 消息
     */
    modifyById: "/socket/modifyById",
    /**
     * 查询用户会话列表
     * @param userID 用户id
     */
    getSocketByUserID: "/socket/getSocketByUserID",
    /**
     * 查询会话集合列表
     * @param sockets 会话集合
     * @param pageNo 页码
     * @param limit 页限
     */
    getSocketListByID: "/socket/getSocketListByID",
  },
  alipay: {
    /**
     * 支付宝页面支付
     * @param orderID 订单id
     * @param title 苗木标题
     * @param describe 苗木描述
     * @param price 苗木价格
     */
    pagePay: "/alipay/pagePay",
    /**
     * 退款
     * @param orderID 订单id
     * @param price 苗木价格
     */
    refund: "/alipay/refund",
    /**
     * 查询支付结果
     * @param orderID 订单id
     */
    query: "/alipay/query",
  },
  comment: {
    /**
     * 增加评论
     * @param treeID 苗木id
     * @param senderID 发送者id
     * @param context 评论内容
     */
    addComment: "/comment/addComment",
    /**
     * 删除评论
     * @param _id 会话id
     */
    removeById: "/comment/removeById",
    /**
     * 查询苗木评论列表
     * @param treeID 苗木id
     * @param pageNo 页码
     * @param limit 页限
     */ getCommentByTreeID: "/comment/getCommentByTreeID",
  },
};
