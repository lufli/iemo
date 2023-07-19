import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getWinningNumbers, checkNumbersForPrize, calculatePrize } from '@/lib/lottery/megamillion'

describe('get megamillion', function() {
  const mockResponse = `<string xmlns="http://tempuri.org/">{"Drawing":{"PlayDate":"2023-07-14T00:00:00","N1":10,"N2":24,"N3":48,"N4":51,"N5":66,"MBall":15,"Megaplier":2,"UpdatedBy":"SERVICE","UpdatedTime":"2023-07-18T21:03:02","PlayDateTicks":638248896000000000,"IgnoreServiceUntil":"2022-08-31T02:20:06"},"Jackpot":{"PlayDate":"2023-07-14T00:00:00","CurrentPrizePool":560000000.0,"NextPrizePool":640000000.0,"CurrentCashValue":287000000.0,"NextCashValue":328500000.0,"Winners":0,"Verified":true,"UpdatedBy":"SERVICE","UpdatedTime":"2023-07-18T11:37:02"},"PrizeTiers":[{"PlayDate":"2023-07-14T00:00:00","Tier":0,"IsMegaplier":false,"Winners":0},{"PlayDate":"2023-07-14T00:00:00","Tier":1,"IsMegaplier":false,"Winners":3},{"PlayDate":"2023-07-14T00:00:00","Tier":2,"IsMegaplier":false,"Winners":45},{"PlayDate":"2023-07-14T00:00:00","Tier":3,"IsMegaplier":false,"Winners":855},{"PlayDate":"2023-07-14T00:00:00","Tier":4,"IsMegaplier":false,"Winners":2256},{"PlayDate":"2023-07-14T00:00:00","Tier":5,"IsMegaplier":false,"Winners":54062},{"PlayDate":"2023-07-14T00:00:00","Tier":6,"IsMegaplier":false,"Winners":47452},{"PlayDate":"2023-07-14T00:00:00","Tier":7,"IsMegaplier":false,"Winners":370417},{"PlayDate":"2023-07-14T00:00:00","Tier":8,"IsMegaplier":false,"Winners":905066},{"PlayDate":"2023-07-14T00:00:00","Tier":1,"IsMegaplier":true,"Winners":1},{"PlayDate":"2023-07-14T00:00:00","Tier":2,"IsMegaplier":true,"Winners":5},{"PlayDate":"2023-07-14T00:00:00","Tier":3,"IsMegaplier":true,"Winners":194},{"PlayDate":"2023-07-14T00:00:00","Tier":4,"IsMegaplier":true,"Winners":477},{"PlayDate":"2023-07-14T00:00:00","Tier":5,"IsMegaplier":true,"Winners":12340},{"PlayDate":"2023-07-14T00:00:00","Tier":6,"IsMegaplier":true,"Winners":10786},{"PlayDate":"2023-07-14T00:00:00","Tier":7,"IsMegaplier":true,"Winners":84375},{"PlayDate":"2023-07-14T00:00:00","Tier":8,"IsMegaplier":true,"Winners":206736}],"MatchWinners":{"PlayDate":"2023-07-14T00:00:00","WinnerText":"Match 5 + 0: <span class='bwState'>CA(2),</span><span class='bwState'>NC</span> Match 5 + 0 Megaplier: <span class='bwState'> SC</span>","RawText":"Match 5 + 0: CA(2), NC Match 5 + 0 Megaplier: SC","ManualEntry":true},"PrizeMatrix":{"MatrixID":3,"MatrixStart":"2017-10-29T00:00:00","MatrixEnd":"0001-01-01T00:00:00","WhiteBallMax":70,"MegaBallMax":25,"MatrixCurrent":true,"TicketPrice":2,"FooterText":"Mega Millions drawings are held Tuesday and Friday at 11:00 pm ET. Five white balls are drawn from a set of balls numbered 1 through 70; one gold Mega Ball is drawn from a set of balls numbered 1 through 25. You win if the numbers on one row of your ticket match the numbers of the balls drawn on that date. There are nine ways to win a prize, from $2 to the jackpot. If no one wins the jackpot, the money is added to the jackpot for the next drawing. Overall chances of winning a prize are 1 in 24.","PrizeTiers":[{"MatrixRowId":19,"MatrixID":3,"PrizeTier":0,"TierWhiteBall":5,"TierMegaBall":true,"IsJackpot":true,"PrizeAmount":0.0,"Mega2":0.0,"Mega3":0.0,"Mega4":0.0,"Mega5":0.0,"Odds":302575350.0},{"MatrixRowId":20,"MatrixID":3,"PrizeTier":1,"TierWhiteBall":5,"TierMegaBall":false,"IsJackpot":false,"PrizeAmount":1000000.0,"Mega2":2000000.0,"Mega3":3000000.0,"Mega4":4000000.0,"Mega5":5000000.0,"Odds":12607306.0},{"MatrixRowId":21,"MatrixID":3,"PrizeTier":2,"TierWhiteBall":4,"TierMegaBall":true,"IsJackpot":false,"PrizeAmount":10000.0,"Mega2":20000.0,"Mega3":30000.0,"Mega4":40000.0,"Mega5":50000.0,"Odds":931001.0},{"MatrixRowId":23,"MatrixID":3,"PrizeTier":3,"TierWhiteBall":4,"TierMegaBall":false,"IsJackpot":false,"PrizeAmount":500.0,"Mega2":1000.0,"Mega3":1500.0,"Mega4":2000.0,"Mega5":2500.0,"Odds":38792.0},{"MatrixRowId":24,"MatrixID":3,"PrizeTier":4,"TierWhiteBall":3,"TierMegaBall":true,"IsJackpot":false,"PrizeAmount":200.0,"Mega2":400.0,"Mega3":600.0,"Mega4":800.0,"Mega5":1000.0,"Odds":14547.0},{"MatrixRowId":26,"MatrixID":3,"PrizeTier":5,"TierWhiteBall":3,"TierMegaBall":false,"IsJackpot":false,"PrizeAmount":10.0,"Mega2":20.0,"Mega3":30.0,"Mega4":40.0,"Mega5":50.0,"Odds":606.0},{"MatrixRowId":27,"MatrixID":3,"PrizeTier":6,"TierWhiteBall":2,"TierMegaBall":true,"IsJackpot":false,"PrizeAmount":10.0,"Mega2":20.0,"Mega3":30.0,"Mega4":40.0,"Mega5":50.0,"Odds":693.0},{"MatrixRowId":28,"MatrixID":3,"PrizeTier":7,"TierWhiteBall":1,"TierMegaBall":true,"IsJackpot":false,"PrizeAmount":4.0,"Mega2":8.0,"Mega3":12.0,"Mega4":16.0,"Mega5":20.0,"Odds":89.0},{"MatrixRowId":29,"MatrixID":3,"PrizeTier":8,"TierWhiteBall":0,"TierMegaBall":true,"IsJackpot":false,"PrizeAmount":2.0,"Mega2":4.0,"Mega3":6.0,"Mega4":8.0,"Mega5":10.0,"Odds":37.0}]},"NextDrawingDate":"2023-07-18T23:00:00"}</string>`;

  const server = setupServer(rest.get('https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData', (req, res, ctx) => {
    return res(ctx.text(mockResponse));
  }));

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date());
    server.listen();
  })

  it('should success when return correct data', async function() {
    const winningNumbers = await getWinningNumbers();
    const expectedWinningNumbers = {
      N1: 10,
      N2: 24,
      N3: 48,
      N4: 51,
      N5: 66,
      NS: 15,
      date: "2023-07-14T00:00:00",
      multiplier: 2,
      type: 'megamillions',
      jackpot: {
        PlayDate: "2023-07-14T00:00:00",
        CurrentPrizePool: 560000000.0,
        NextPrizePool: 640000000.0,
        CurrentCashValue: 287000000.0,
        NextCashValue:328500000.0,
        Winners:0,
        Verified:true,
        UpdatedBy:"SERVICE",
        UpdatedTime:"2023-07-18T11:37:02"
      }
    }

    expect(winningNumbers).toEqual(expectedWinningNumbers);
  })

  it('calculatePrize returns correct value', () => {
    expect(calculatePrize(5, true, 1)).toEqual('Grand Prize');
    expect(calculatePrize(5, false, 1)).toEqual(1000000);
    expect(calculatePrize(4, true, 1)).toEqual(10000);
    expect(calculatePrize(4, false, 1)).toEqual(500);
    expect(calculatePrize(3, true, 1)).toEqual(200);
    expect(calculatePrize(3, false, 1)).toEqual(10);
    expect(calculatePrize(2, true, 1)).toEqual(10);
    expect(calculatePrize(1, true, 1)).toEqual(4);
    expect(calculatePrize(0, true, 1)).toEqual(2);
    expect(calculatePrize(1, false, 1)).toEqual(0);
    expect(calculatePrize(0, false, 1)).toEqual(0);
  })

  it('checkNumbersForPrize return a check for the play', () => {
    const expectedWinningNumbers = {
      N1: 10,
      N2: 24,
      N3: 48,
      N4: 51,
      N5: 66,
      NS: 15,
      date: "2023-07-14T00:00:00",
      multiplier: 2,
      type: 'megamillions',
      jackpot: {
        PlayDate: "2023-07-14T00:00:00",
        CurrentPrizePool: 560000000.0,
        NextPrizePool: 640000000.0,
        CurrentCashValue: 287000000.0,
        NextCashValue:328500000.0,
        Winners:0,
        Verified:true,
        UpdatedBy:"SERVICE",
        UpdatedTime:"2023-07-18T11:37:02"
      }
    }

    const playOne = {
      N1: 10,
      N2: 24,
      N3: 48,
      N4: 51,
      N5: 66,
      NS: 1
    }

    const expectedOne = {
      type: 'megamillions',
      date: new Date(),
      multiplier: 2,
      N1: { number: 10, hit: true },
      N2: { number: 24, hit: true },
      N3: { number: 48, hit: true },
      N4: { number: 51, hit: true },
      N5: { number: 66, hit: true },
      NS: { number: 1, hit: false },
      prize: 2000000
    }

    expect(checkNumbersForPrize(expectedWinningNumbers, playOne)).toEqual(expectedOne);

    const playTwo = {
      N1: 10,
      N2: 24,
      N3: 48,
      N4: 51,
      N5: 66,
      NS: 15
    }

    const expectedTwo = {
      type: 'megamillions',
      date: new Date(),
      multiplier: 2,
      N1: { number: 10, hit: true },
      N2: { number: 24, hit: true },
      N3: { number: 48, hit: true },
      N4: { number: 51, hit: true },
      N5: { number: 66, hit: true },
      NS: { number: 15, hit: true },
      prize: 'Grand Prize'
    }

    expect(checkNumbersForPrize(expectedWinningNumbers, playTwo)).toEqual(expectedTwo);

  })
})