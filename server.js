const express = require('express');
const fetchResolvedIssues = require('./services/fetchResolvedIssues');
const fetchTransitions = require('./services/fetchTransitions');
const fetchAggregatedDurations = require('./services/fetchAggregatedDurations');
const fetchReopenedCount = require('./services/fetchReopenedCount');
const { fetchCycleTimeseries } = require('./services/fetchCycleTimeseries');
const { fetchBugCycleTimes } = require('./services/fetchBugCycleTimes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/fetch-resolved-issues', fetchResolvedIssues);
app.get('/fetch-transitions', fetchTransitions);
app.get('/fetch-aggregated-durations', fetchAggregatedDurations);
app.get('/fetch-reopened-count', fetchReopenedCount);
app.get('/fetch-cycle-timeseries', fetchCycleTimeseries);
app.get('/fetch-bug-cycle-times', fetchBugCycleTimes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
