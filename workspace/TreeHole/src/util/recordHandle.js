// 记录回调
export default recordHandle = {
  /**
   * 收藏
   * @param {proxy} record
   * @param {string} userID
   * @param {string} treeID
   */
  collect: async (record, userID, treeID) => {
    const index = record.collect.indexOf(treeID);
    const params = { userID, treeID, mode: 1 };
    await request.post(api.record.modifyRecordTree, params);
    if (index == -1) {
      record.collect.push(treeID);
      ElMessage.warning("收藏成功");
    } else {
      record.collect.splice(index, 1);
      ElMessage.warning("取消收藏成功");
    }
  },
  /**
   * 关注
   * @param {proxy} record
   * @param {string} userID1 主
   * @param {string} userID2 次
   */
  follow: async (record, userID1, userID2) => {
    const index = record.following.indexOf(userID2);
    const params = { userID1, userID2 };
    await request.post(api.record.modifyRecordUser, params);
    if (index == -1) {
      record.following.push(userID2);
      ElMessage.success("关注成功");
    } else {
      record.following.splice(index, 1);
      ElMessage.success("取消关注成功");
    }
  },
};
