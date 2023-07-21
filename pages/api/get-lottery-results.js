// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getWinningNumbers as getMegamillion } from '@/lib/lottery/mega';
import { getWinningNumbers as getDoublePlay } from '@/lib/lottery/double-play';
import { getWinningNumbers as getPowerball } from '@/lib/lottery/powerball';

export default async function handler(req, res) {
  const promiseTasks = [getMegamillion(), getPowerball(), getDoublePlay()];
  const resultArray = [
    { type: 'megamillion' },
    { type: 'powerball' },
    { type: 'double-play' },
  ];

  const results = await Promise.allSettled(promiseTasks);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      resultArray[index] = result.value;
    } else {
      resultArray[index].fetchFail = true;
    }
  });

  return res.status(200).json(resultArray);
}
