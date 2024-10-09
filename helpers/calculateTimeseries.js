const calculateTimeseries = (startDate, endDate) => {
    const timeseries = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        timeseries.push(currentDate.getTime());
        currentDate.setDate(currentDate.getDate() + 14); // Increment by 2 weeks
    }

    return timeseries;
};

module.exports = calculateTimeseries;
