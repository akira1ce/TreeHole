/*
 * @Author: Akira
 * @Date: 2023-04-02 16:14:24
 * @LastEditTime: 2023-04-07 13:43:57
 */
export default {
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
