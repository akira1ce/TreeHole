export default (initialState: API.UserInfo) => {
  // 参考文档 https://umijs.org/docs/max/access
  const canSeeAdmin = !!(initialState && initialState.name !== 'dontHaveAccess');
  return {
    canSeeAdmin,
  };
};
