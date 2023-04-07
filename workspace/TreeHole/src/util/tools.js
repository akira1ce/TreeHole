/*
 * @Author: Akira
 * @Date: 2023-04-02 16:19:08
 * @LastEditTime: 2023-04-07 13:45:29
 */
export default {
  // 时间格式化
  timeFormat: (time) => {
    const timeArr = time.split(" ");
    let timeArr_0 = timeArr[0].split("-");
    let timeArr_1 = timeArr[1];

    if (timeArr_0[1] < "10") timeArr_0[1] = timeArr_0[1].slice(1);
    if (timeArr_0[2] < "10") timeArr_0[1] = timeArr_0[2].slice(1);

    timeArr_0 = timeArr_0.join("/");

    return `${timeArr_0} ${timeArr_1}`;
  },
};
