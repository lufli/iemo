import axios from 'axios';
import { sendMessageToChannel } from '@/lib/slack/message';

jest.mock('axios');

describe('lib/slack/message', () => {
  const channel = '#test_channel';
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date());
  });

  it('sendMessageToChannel sending good message', async () => {
    const level = 'good';
    const text = 'good text';
    const link = 'https://www.iemo.io';
    const payload = {
      channel,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: level,
          text,
          author_name: ':white_check_mark: status: good',
          title: 'Read more...',
          title_link: link,
          footer: 'iEmo',
          ts: Date.now(),
        },
      ],
    };
    const responseData = { message: 'Data successfully sent' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    await sendMessageToChannel({
      channel, level, text, link,
    });

    expect(axios.post).toHaveBeenCalledWith(webhookUrl, payload, requestOptions);
  });

  it('sendMessageToChannel sending warning message', async () => {
    const level = 'warning';
    const text = 'warning text';
    const link = 'https://www.iemo.io';
    const payload = {
      channel,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: level,
          text,
          author_name: ':warning: status: warning',
          title: 'Read more...',
          title_link: link,
          footer: 'iEmo',
          ts: Date.now(),
        },
      ],
    };
    const responseData = { message: 'Data successfully sent' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    await sendMessageToChannel({
      channel, level, text, link,
    });

    expect(axios.post).toHaveBeenCalledWith(webhookUrl, payload, requestOptions);
  });

  it('sendMessageToChannel sending danger message', async () => {
    const level = 'danger';
    const text = 'danger text';
    const link = 'https://www.iemo.io';
    const payload = {
      channel,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: level,
          text,
          author_name: ':x: status: error',
          title: 'Read more...',
          title_link: link,
          footer: 'iEmo',
          ts: Date.now(),
        },
      ],
    };
    const responseData = { message: 'Data successfully sent' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    await sendMessageToChannel({
      channel, level, text, link,
    });

    expect(axios.post).toHaveBeenCalledWith(webhookUrl, payload, requestOptions);
  });

  it('sendMessageToChannel sending default message', async () => {
    const level = undefined;
    const text = 'default text';
    const link = 'https://www.iemo.io';
    const payload = {
      channel,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: level,
          text,
          author_name: ':male_police_officer: Notification',
          title: 'Read more...',
          title_link: link,
          footer: 'iEmo',
          ts: Date.now(),
        },
      ],
    };
    const responseData = { message: 'Data successfully sent' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    await sendMessageToChannel({
      channel, level, text, link,
    });

    expect(axios.post).toHaveBeenCalledWith(webhookUrl, payload, requestOptions);
  });

  it('sendMessagToChannel handle error when reject', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    axios.post.mockRejectedValueOnce(new Error('Error sending data'));

    await sendMessageToChannel({});
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
