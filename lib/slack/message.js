const axios = require('axios');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

/* function sendMessageToChannel() send a message to slack channel.
 * channel -> slack channel name
 * level -> message level: good, warning, danger, and undefined
 * text -> the message
 * link -> post message with related link
 */
async function sendMessageToChannel({
  channel, level, text, link,
}) {
  const payload = {
    channel,
    attachments: [
      {
        mrkdwn_in: ['text'],
        text,
        footer: 'iEmo',
        ts: Date.now(),
      },
    ],
  };

  const attachment = payload.attachments[0];

  if (level === 'good') {
    attachment.color = 'good';
    attachment.author_name = ':white_check_mark: status: good';
  } else if (level === 'warning') {
    attachment.color = 'warning';
    attachment.author_name = ':warning: status: warning';
  } else if (level === 'danger') {
    attachment.color = 'danger';
    attachment.author_name = ':x: status: error';
  } else {
    attachment.author_name = ':ghost: Notification';
  }

  if (link) {
    attachment.title = 'Read more...';
    attachment.title_link = link;
  }

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios.post(webhookUrl, payload, requestOptions);
  } catch (error) {
    console.error('Error caught:', error.message);
  }
}

module.exports = { sendMessageToChannel };

/* Examples
const channel = '#billionaire-monitor';
const text = 'testing message';
const link = 'https://www.iemo.io';
sendMessageToChannel({
  channel,
  level: 'good',
  text,
  link,
});
sendMessageToChannel({
  channel,
  level: 'warning',
  text,
  link,
});
sendMessageToChannel({
  channel,
  level: 'danger',
  text,
  link,
});
sendMessageToChannel({
  channel,
  text,
  link,
});
*/
