/*
 * @Author: Akira
 * @Date: 2023-04-02 16:17:37
 * @LastEditTime: 2023-04-25 13:39:06
 */
//  静态数据
export default {
  comment: {
    treeID: "",
    senderID: "",
    context: "",
  },
  record: {
    _id: "",
    userID: "",
    order: [],
    socket: [],
  },
  tree: {
    _id: "",
    ownerID: "",
    type: "",
    height: "",
    diameter: "",
    crownDiameter: "",
    branchPoint: "",
    hci: 0,
    location: "",
    describe: "",
    imgs: [],
    price: "",
    state: "-1",
    time: "",
    title: "",
    count: 1,
  },
  order: {
    _id: "",
    treeID: "",
    buyerID: "",
    sellerID: "",
    status: "",
    time: "",
    payTime: "",
    buyer: {
      _id: "",
      account: "",
      name: "",
      sex: "",
      location: "",
      avator: "",
      role: "",
    },
    seller: {
      _id: "",
      account: "",
      name: "",
      sex: "",
      location: "",
      avator: "",
      role: "",
    },
    tree: {
      _id: "",
      ownerID: "",
      type: "",
      state: "",
      height: "",
      diameter: "",
      branchPoint: "",
      location: "",
      describe: "",
      price: "",
      imgs: [],
      time: "",
      title: "",
    },
  },
};
