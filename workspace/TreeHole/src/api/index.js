export default {
  user: {
    getUserList: "/user/getUserList",
    getUserListByID: "/user/getUserListByID",
    register: "/user/register",
    login: "/user/login",
    removeById: "/user/removeById",
    modifyById: "/user/modifyById",
    getUserById: "/user/getUserById",
  },
  tree: {
    getTreeById: "/tree/getTreeById",
    getTreeList: "/tree/getTreeList",
    getTreeListByUserID: "/tree/getTreeListByUserID",
    getTreeListByID: "/tree/getTreeListByID",
    /**
     * @param trees 用户浏览记录
     * @param pageNo 页码
     * @param limit 页限
     */
    getRecommendTreeList: "/tree/getRecommendTreeList",
    /**
     * @param area 用户所属地区取市级
     * @param pageNo 页码
     * @param limit 页限
     */
    getAreaTreeList: "/tree/getAreaTreeList",
    addTree: "/tree/addTree",
    removeById: "/tree/removeById",
    modifyById: "/tree/modifyById",
  },
  uploadCenter: {
    upload: "/uploadCenter/upload",
    files: "/uploadCenter/files",
  },
  record: {
    /**
     * @param userID 用户id
     */
    getRecordByUserID: "/record/getRecordByUserID",
    /**
     * @param userID1 用户id
     * @param userID2 被关注用户id
     */
    modifyRecordUser: "/record/modifyRecordUser",
    modifyRecordTree: "/record/modifyRecordTree",
    /**
     * 修改个人订单记录
     * @param userID 用户id
     * @param orderID 订单id
     */
    modifyRecordOrder: "/record/modifyRecordOrder",
    /**
     * 修改个人会话记录
     * @param userID 用户id
     * @param socketID 会话id
     */
    modifyRecordSocket: "/record/modifyRecordSocket",
    modifyByID: "/record/modifyByID",
  },
  order: {
    getOrderList: "/order/getOrderList",
    getOrderListByID: "/order/getOrderListByID",
    /**
     * @param treeID 苗木id
     * @param tree 苗木信息
     * @param buyerID 买方id 登陆用户
     * @param sellerID 卖方id 苗木所有者
     */
    addOrder: "/order/addOrder",
    removeById: "/order/removeById",
    modifyById: "/order/modifyById",
    getOrderListByUserID: "/order/getOrderListByUserID",
    getOrderByTreeID: "/order/getOrderByTreeID",
    modifyByTreeID: "/order/modifyByTreeID",
  },
  socket: {
    addSocket: "/socket/addSocket",
    removeById: "/socket/removeById",
    modifyById: "/socket/modifyById",
    getSocketByUserID: "/socket/getSocketByUserID",
    /**
     * @param sockets 会话集合
     * @param pageNo 页码
     * @param limit 页限
     */
    getSocketListByID: "/socket/getSocketListByID",
  },
  alipay: {
    pagePay: "/alipay/pagePay",
    refund: "/alipay/refund",
    query: "/alipay/query",
  },
  comment: {
    getCommentByTreeID: "/comment/getCommentByTreeID",
    removeById: "/comment/removeById",
    addComment: "/comment/addComment",
  },
};
