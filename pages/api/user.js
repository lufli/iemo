import { kv } from '@vercel/kv';
import cryptoRandomString from 'crypto-random-string';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let token = req.headers.cookies || null;
    let user;

    if (token) {
      try {
        user = await kv.get(token);
      } catch (error) {
        console.error('Error caught:', error.message);
      }
    }

    if (user) {
      res.status(404).json({ error: 'error' });
    }

    token = cryptoRandomString({ length: 6, type: 'distinguishable' });

    try {
      await kv.set(token, true);
    } catch (error) {
      console.error('Error caught:', error.message);
      res.status(404).json({ error: 'error' });
    }

    res.status(201).json({ token });
  } else {
    res.status(404).json({ error: 'error' });
  }
}
