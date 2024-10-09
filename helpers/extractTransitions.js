/*function extractTransitions(issue) {
  const transitions = [];
  const changelog = issue.changelog.histories.reverse();

  for (let i = 0; i < changelog.length; i++) {
    const history = changelog[i];
    const statusChange = history.items.find(item => item.field === 'status');

    if (statusChange) {
      const startTime = new Date(history.created);
      const endTime = i < changelog.length - 1 ? new Date(changelog[i + 1].created) : new Date();
      transitions.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: statusChange.toString
      });
    }
  }

  return transitions;
}

module.exports = { extractTransitions };*/
function extractTransitions(issue) {
  const transitions = [];

  issue.changelog.histories.forEach(history => {
    history.items.forEach(item => {
      if (item.field === 'status') {
        transitions.push({
          startTime: history.created,
          endTime: history.created, // This will be updated in the loop
          status: item.toString
        });
      }
    });
  });

  // Sorting transitions by startTime
  transitions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Updating endTime to the startTime of the next transition
  for (let i = 0; i < transitions.length - 1; i++) {
    transitions[i].endTime = transitions[i + 1].startTime;
  }

  // Ensure transitions array is not empty before accessing the last element
  if (transitions.length > 0) {
    // Setting endTime to the current date for the last transition
    transitions[transitions.length - 1].endTime = new Date().toISOString();
  }

  return transitions;
}

module.exports = { extractTransitions };
