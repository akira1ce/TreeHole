const local = {
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  clear() {
    localStorage.clear();
  },
};

const defaultState = {
  record: {
    _id: "",
    current: 0,
    browsingHistory: [],
    collect: [],
    fans: [],
    following: [],
    order: [],
    treeList: [],
    userID: "",
  },
};

export { local, defaultState };
