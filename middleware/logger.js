var MY_SLACK_WEBHOOK_URL = process.env.SLACKAPI;
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

export default slack;