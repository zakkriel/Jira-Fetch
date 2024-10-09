const fetch = require('node-fetch');
const base64 = require('base-64');
const { formatDateForJQL } = require('../helpers/formatDateForJQL');

const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const fetchReopenedCount = async (req, res) => {
  const projectKey = req.query.projectKey;
  const from = req.query.from;
  const to = req.query.to;


  if (!projectKey || !from || !to) {
    return res.status(400).json({ error: 'Project key, from, and to are required' });
  }

  const fromDate = new Date(parseInt(from));
  const toDate = new Date(parseInt(to));
  const fromDateFormatted = formatDateForJQL(fromDate);
  const toDateFormatted = formatDateForJQL(toDate);
  const projectKeyString = projectKey.toString();
  
  const jql = `project in (${projectKeyString.replace(/[{}]/g, '')}) AND statusCategory IN ("In Progress", Done) AND status changed TO "In Progress" AFTER "${fromDateFormatted}" AND status changed TO "In Progress" BEFORE "${toDateFormatted}" AND issuetype IN (Story, Sub-task, Subtask, task, Bug, Sub-Bug) ORDER BY updatedDate DESC`;
  const url = `https://digistore.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&expand=changelog&maxResults=1000`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64.encode(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`)}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const reopenedIssues = data.issues.map(issue => {
      const inProgressTransitions = issue.changelog.histories.filter(history =>
        history.items.some(item => item.field === 'status' && item.toString === 'In Progress')
      );

      return {
        key: issue.key,
        project: issue.fields.project ? issue.fields.project.name : null,
        owner: issue.fields.customfield_11972 ? issue.fields.customfield_11972.displayName : (issue.fields.assignee ? issue.fields.assignee.displayName : null),
        reopenedCount: inProgressTransitions.length >=1 ? inProgressTransitions.length -1 : 0
      };
    });

    res.json({ issues: reopenedIssues });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues from JIRA' });
  }
};

module.exports = fetchReopenedCount;
