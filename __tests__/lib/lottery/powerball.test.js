import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { calculatePrize, checkNumbersForPrize, getWinningNumbers } from '@/lib/lottery/powerball';

describe('lib/lottery/powerball', () => {
  const fakeDom = `
<h4 class="card-title mx-auto mb-3 lh-1 text-center title-main py-2 px-3 rounded-3">Winning Numbers</h4>
<h5 class="card-title mx-auto mb-3 lh-1 text-center  title-date">Wed, Jul 12, 2023</h5>
<div class="row col-auto gap-3 mx-0 mb-3 align-items-center game-ball-group g-0 flex-column">
  <div class="d-flex col-auto flex-nowrap game-ball-group mx-auto">
    <div class="form-control col white-balls item-powerball">23</div>
    <div class="form-control col white-balls item-powerball">35</div>
    <div class="form-control col white-balls item-powerball">45</div>
    <div class="form-control col white-balls item-powerball">66</div>
    <div class="form-control col white-balls item-powerball">67</div>
    <div class="form-control col powerball item-powerball">20</div>
  </div>
  <div class="col-sm-12 col-md-6 col-lg-6 mx-auto">
    <span class="power-play item-power-play | form-control badge rounded-pill col mx-auto text-center">
      Power Play
      <span class="multiplier">3x
    </span></span>
  </div>
</div>
`;

  const server = setupServer(rest.get('https://www.powerball.com', (req, res, ctx) => res(ctx.text(fakeDom))));

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.now());
    server.listen();
  });

  it('getWinningNumbers returns winning number', async () => {
    const winningNumbers = await getWinningNumbers();
    const expectedWinningNumbers = {
      N1: 23,
      N2: 35,
      N3: 45,
      N4: 66,
      N5: 67,
      NS: 20,
      date: Date.now(),
      multiplier: 3,
      type: 'powerball',
    };
    expect(winningNumbers).toEqual(expectedWinningNumbers);
  });

  it('calculatePrize returns correct prize', () => {
    expect(calculatePrize(5, true, 2)).toEqual('Grand Prize');
    expect(calculatePrize(5, false, 3)).toEqual(2000000);
    expect(calculatePrize(4, true, 2)).toEqual(100000);
    expect(calculatePrize(4, false, 4)).toEqual(400);
    expect(calculatePrize(3, true, 5)).toEqual(500);
    expect(calculatePrize(3, false, 10)).toEqual(70);
    expect(calculatePrize(2, true, 2)).toEqual(14);
    expect(calculatePrize(1, true, 3)).toEqual(12);
    expect(calculatePrize(0, true, 3)).toEqual(12);
    expect(calculatePrize(1, false, 3)).toEqual(0);
    expect(calculatePrize(0, false, 3)).toEqual(0);
  });

  it('checkNumbersForPrize return a check for the play', () => {
    const winningNumbers = {
      N1: 23,
      N2: 35,
      N3: 45,
      N4: 66,
      N5: 67,
      NS: 20,
      date: Date.now(),
      multiplier: 3,
      type: 'powerball',
    };
    const playOne = {
      type: 'powerball',
      N1: 23,
      N2: 35,
      N3: 45,
      N4: 66,
      N5: 67,
      NS: 20,
      power: true,
    };
    const expectedCheckOne = {
      type: 'powerball',
      date: Date.now(),
      N1: { number: 23, hit: true },
      N2: { number: 35, hit: true },
      N3: { number: 45, hit: true },
      N4: { number: 66, hit: true },
      N5: { number: 67, hit: true },
      NS: { number: 20, hit: true },
      power: true,
      multiplier: 3,
      prize: 'Grand Prize',
    };
    expect(checkNumbersForPrize(winningNumbers, playOne)).toEqual(expectedCheckOne);

    const playTwo = {
      type: 'powerball',
      N1: 18,
      N2: 25,
      N3: 47,
      N4: 52,
      N5: 66,
      NS: 20,
      power: false,
    };
    const expectedCheckTwo = {
      type: 'powerball',
      date: Date.now(),
      N1: { number: 18, hit: false },
      N2: { number: 25, hit: false },
      N3: { number: 47, hit: false },
      N4: { number: 52, hit: false },
      N5: { number: 66, hit: true },
      NS: { number: 20, hit: true },
      power: false,
      multiplier: 3,
      prize: 4,
    };
    expect(checkNumbersForPrize(winningNumbers, playTwo)).toEqual(expectedCheckTwo);
  });
});
