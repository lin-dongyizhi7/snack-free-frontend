export const isToday = (date: string): boolean => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;
  return date === todayStr;
};

export const isPreDay = (dateA: string, dateB: string): boolean => {
  //   // 将字符串日期转换为 Date 对象
  //   const a = new Date(dateA);
  //   const b = new Date(dateB);

  //   // 创建一个新的 Date 对象，将 dateB 的日期减去一天
  //   const preDayOfB = new Date(b);
  //   preDayOfB.setDate(preDayOfB.getDate() - 1);

  //   // 比较 dateA 和 dateB 的前一天是否相等
  //   return (
  //     a.getFullYear() === preDayOfB.getFullYear() &&
  //     a.getMonth() === preDayOfB.getMonth() &&
  //     a.getDate() === preDayOfB.getDate()
  //   );
  return daysDiff(dateA, dateB) === 1;
};

export const daysDiff = (dayA: string, dayB: string): number => {
  const dateA = new Date(dayA);
  dateA.setHours(0, 0, 0, 0);

  const dateB = new Date(dayB);
  dateB.setHours(0, 0, 0, 0);

  // 计算两个日期之间的毫秒差
  const timeDiff = dateB.getTime() - dateA.getTime();

  // 将毫秒差转换为天数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export const daysDiffToday = (targetDay: string): number => {
  // 获取今天的日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 将目标日期字符串转换为 Date 对象
  const targetDate = new Date(targetDay);
  targetDate.setHours(0, 0, 0, 0);

  // 计算两个日期之间的毫秒差
  const timeDiff = targetDate.getTime() - today.getTime();

  // 将毫秒差转换为天数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export const insertDay = (dateList: string[], newDate: string): string[] => {
  for (let i = 0; i < dateList.length; i++) {
    if (newDate < dateList[i]) {
      dateList.splice(i, 0, newDate);
      return dateList;
    }
  }
  dateList.push(newDate);
  return dateList;
};
