import { main } from '@/scripts/hourly';

export default async function handler(req, res) {
  try {
    await main();
    res.status(200).json({ message: 'Ok' });
  } catch (error) {
    res.status(400).json({ message: 'Error' });
  }
}
