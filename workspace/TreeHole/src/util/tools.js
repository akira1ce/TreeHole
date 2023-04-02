export default tools = {
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
