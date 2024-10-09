const fetch = require('node-fetch');
const base64 = require('base-64');
const { extractTransitions } = require('../helpers/extractTransitions');

const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

async function fetchTransitions(req, res) {
  const ticketKey = req.query.ticketKey;

  if (!ticketKey) {
    return res.status(400).json({ error: 'Ticket key is required' });
  }

  const url = `https://digistore.atlassian.net/rest/api/3/issue/${ticketKey}?expand=changelog&maxResults=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64.encode(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`)}`,
        'Accept': 'application/json'
      }
    });

    const issue = await response.json();
    const issueTransitions = extractTransitions(issue);
    
    // Collecting transitions in the desired format
    const transitions = issueTransitions.map(transition => ({
      startTime: transition.startTime,
      endTime: transition.endTime,
      status: transition.status
    }));

    res.json({ key: issue.key, transitions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue from JIRA' });
  }
}

module.exports = fetchTransitions;
