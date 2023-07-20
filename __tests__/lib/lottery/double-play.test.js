import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { calculatePrize, checkNumbersForPrize, getWinningNumbers } from '@/lib/lottery/double-play';

describe('lib/lottery/powerball', () => {
  const fakeDom = `
<h4 class="card-title mx-auto mb-3 lh-1 text-center title-main py-2 px-3 rounded-3">
  Winning Numbers
</h4>
<h5 class="card-title mx-auto mb-3 lh-1 text-center  title-date">Wed, Jul 12, 2023</h5>
<div class="row col-auto gap-3 mx-0 mb-3 align-items-center game-ball-group g-0 flex-column">
  <div class="d-flex col-auto flex-nowrap game-ball-group mx-auto">
  <div class="form-control col black-balls item-pb-double-play">42</div>
  <div class="form-control col black-balls item-pb-double-play">49</div>
  <div class="form-control col black-balls item-pb-double-play">54</div>
  <div class="form-control col black-balls item-pb-double-play">62</div>
  <div class="form-control col black-balls item-pb-double-play">63</div>
  <div class="form-control col dp-powerball item-pb-double-play">21</div>
</div>
`;

  const server = setupServer(rest.get('https://www.powerball.com/double-play', (req, res, ctx) => res(ctx.text(fakeDom))));

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date());
    server.listen();
  });

  it('getWinningNumbers returns winning number', async () => {
    const winningNumbers = await getWinningNumbers();
    const expectedWinningNumbers = {
      N1: 42,
      N2: 49,
      N3: 54,
      N4: 62,
      N5: 63,
      NS: 21,
      date: Date.now(),
      type: 'double-play',
    };
    expect(winningNumbers).toEqual(expectedWinningNumbers);
  });

  it('calculatePrize returns correct prize', () => {
    expect(calculatePrize(5, true)).toEqual(10000000);
    expect(calculatePrize(5, false)).toEqual(500000);
    expect(calculatePrize(4, true)).toEqual(50000);
    expect(calculatePrize(4, false)).toEqual(500);
    expect(calculatePrize(3, true)).toEqual(500);
    expect(calculatePrize(3, false)).toEqual(20);
    expect(calculatePrize(2, true)).toEqual(20);
    expect(calculatePrize(2, false)).toEqual(0);
    expect(calculatePrize(1, true)).toEqual(10);
    expect(calculatePrize(0, true)).toEqual(7);
    expect(calculatePrize(1, false)).toEqual(0);
    expect(calculatePrize(0, false)).toEqual(0);
  });

  it('checkNumbersForPrize return a check for the play', () => {
    const winningNumbers = {
      N1: 42,
      N2: 49,
      N3: 54,
      N4: 62,
      N5: 63,
      NS: 21,
      date: Date.now(),
      type: 'double-play',
    };
    const playOne = {
      type: 'double-play',
      N1: 23,
      N2: 35,
      N3: 45,
      N4: 62,
      N5: 63,
      NS: 21,
    };
    const expectedCheckOne = {
      type: 'double-play',
      date: Date.now(),
      N1: { number: 23, hit: false },
      N2: { number: 35, hit: false },
      N3: { number: 45, hit: false },
      N4: { number: 62, hit: true },
      N5: { number: 63, hit: true },
      NS: { number: 21, hit: true },
      prize: 20,
    };
    expect(checkNumbersForPrize(winningNumbers, playOne)).toEqual(expectedCheckOne);

    const playTwo = {
      type: 'double-play',
      N1: 41,
      N2: 42,
      N3: 49,
      N4: 54,
      N5: 62,
      NS: 20,
    };
    const expectedCheckTwo = {
      type: 'double-play',
      date: Date.now(),
      N1: { number: 41, hit: false },
      N2: { number: 42, hit: true },
      N3: { number: 49, hit: true },
      N4: { number: 54, hit: true },
      N5: { number: 62, hit: true },
      NS: { number: 20, hit: false },
      prize: 500,
    };
    expect(checkNumbersForPrize(winningNumbers, playTwo)).toEqual(expectedCheckTwo);
  });
});
