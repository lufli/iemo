// TODO: add tests to this api
import * as crypto from 'crypto';
import { sendMessageToUser } from '@/lib/slack/message';

const secret = process.env.GITHUB_WEBHOOKS_SECRET;

const verifySignature = (req) => {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return `sha256=${signature}` === req.headers['x-hub-signature-256'];
};

export default async function handler(req, res) {
  if (!verifySignature(req)) {
    res.status(401).send('Unauthorized');
  }

  const allowedActions = ['review_requested', 'submmited'];
  const { action } = req.body;
  if (allowedActions.includes(action)) {
    const response = await sendMessageToUser({
      channel: 'U05HWP95MR9',
      text: 'You are requested to do a code review.',
      link: req.body.pull_request?.url,
    });
    if (response === 'ok' || response.ok) {
      res.status(200).json({ message: 'Ok' });
    } else {
      res.status(400).json({ message: 'Error on messaging' });
    }
  } else {
    res.status(200).json({ message: 'Skip' });
  }
}
