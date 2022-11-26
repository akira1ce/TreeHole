export default {
  user: {
    getUserList: "/user/getUserList",
    register: "/user/register",
    login: "/user/login",
    removeById: "/user/removeById",
    modifyById: "/user/modifyById",
    getUserById: "/user/getUserById",
  },
  tree: {
    getTreeList: "/tree/getTreeList",
    getTreeById: "/tree/getTreeById",
    getTreeListByUserID: "/tree/getTreeListByUserID",
    addTree: "/tree/addTree",
    removeById: "/tree/removeById",
    modifyById: "/tree/modifyById",
  },
  uploadCenter: {
    upload: "/uploadCenter/upload",
    files: "/uploadCenter/files",
  },
  record: {
    getRecordByUserID: "/record/getRecordByUserID",
    modifyRecord: "/record/modifyRecord",
  },
  order: {
    getOrderList: "/order/getOrderList",
    addOrder: "/order/addOrder",
    removeById: "/order/removeById",
    modifyById: "/order/modifyById",
    getOrderListByUserID: "/order/getOrderListByUserID",
  },
  socket: {
    addSocket: "/socket/addSocket",
    removeById: "/socket/removeById",
    modifyById: "/socket/modifyById",
    getSocketByUserID: "/socket/getSocketByUserID",
  },
};
