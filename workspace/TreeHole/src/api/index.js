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
     * @param userID 
     */
    getRecordByUserID: "/record/getRecordByUserID",
    /**
     * @param userID1 用户id
     * @param userID2 被关注用户id
     */
    modifyRecordUser: "/record/modifyRecordUser",
    modifyRecordTree: "/record/modifyRecordTree",
    modifyRecordOrder: "/record/modifyRecordOrder",
    modifyByID: "/record/modifyByID",
  },
  order: {
    getOrderList: "/order/getOrderList",
    getOrderListByID: "/order/getOrderListByID",
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
