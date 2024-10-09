function calculateWorkingTimeInMilliseconds(startDate, endDate) {
  let totalMilliseconds = 0;
  let curDate = new Date(startDate);

  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      if (curDate.toDateString() === startDate.toDateString()) {
        totalMilliseconds += Math.min(endDate - startDate, new Date(curDate).setHours(23, 59, 59, 999) - startDate);
      } else if (curDate.toDateString() === endDate.toDateString()) {
        totalMilliseconds += Math.min(endDate - curDate.setHours(0, 0, 0, 0), endDate - startDate);
      } else {
        totalMilliseconds += 24 * 60 * 60 * 1000; // full day in milliseconds
      }
    }
    curDate.setDate(curDate.getDate() + 1);
    curDate.setHours(0, 0, 0, 0); // reset to midnight for the next day
  }

  return totalMilliseconds;
}

module.exports = { calculateWorkingTimeInMilliseconds };
