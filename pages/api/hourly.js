import { main } from '@/scripts/hourly';

export default async function handler(req, res) {
  await main();
  res.status(200).json({ name: 'John Doe' });
}
