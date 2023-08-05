import { main } from '@/scripts/daily';

export default async function handler(req, res) {
  try {
    const result = await main();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: 'Error' });
  }
}
