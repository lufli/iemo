const axios = require('axios');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

/* channel -> slack channel name/user id
 * level -> message level: good, warning, danger, and undefined
 * text -> the message
 * link -> post message with related link
 */

function getPayload({
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

  return payload;
}

async function sendMessageToChannel({
  channel, level, text, link,
}) {
  const payload = getPayload({
    channel,
    level,
    text,
    link,
  });

  try {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios.post(webhookUrl, payload, requestOptions);
  } catch (error) {
    console.error('Error caught:', error.message);
  }
}

async function sendMessageToUser({
  channel, level, text, link,
}) {
  const url = 'https:/slack.com/api/chat.postMessage';
  const payload = getPayload({
    channel,
    level,
    text,
    link,
  });
  const token = process.env.SLACK_BOT_USER_TOKEN;

  try {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(url, payload, requestOptions);
  } catch (error) {
    console.error('Error caught:', error.message);
  }
}

module.exports = { sendMessageToChannel, sendMessageToUser };

/*
sendMessageToUser({
  channel: 'U05HWP95MR9',
  text: 'You are requered to do a code review.',
  link: 'https://www.iemo.com',
});

const channel = '#billionaire-monitor';
const text = 'testing message';
const link = 'https://www.iemo.io';
sendMessageToChannel({
  channel,
  level: 'good',
  text,
  link,
});
*/
