const { getMyPowerballPrize } = require('./powerball.js');

const myPowerballPlays = [
  {
    whiteBalls: [4, 9, 22, 41, 55],
    powerBall: 11
  },
  {
    whiteBalls: [18, 25, 47, 52, 66],
    powerBall: 16
  }
];
/*
const myMegaMillionsPlay = [
  {
    whiteBalls: [15, 27, 42, 56, 69],
    powerBall: 17
  },
  {
    whiteBalls: [3, 18, 31, 47, 62],
    powerBall: 9
  },
  {
    whiteBalls: [5, 10, 23, 37, 56],
    powerBall: 17
  },
  {
    whiteBalls: [7, 16, 25, 42, 49],
    powerBall: 8
  }
];
*/

const prize = {};

getMyPowerballPrize(myPowerballPlays).then(powerballPrize => {
  prize['powerball'] = powerballPrize;
  console.log(prize);
  /*
  getMyMegaMillionsPrize(myMegaMillionsPlay).then(megaMillionsPrize => {
    prize['mega'] = megaMillionsPrize;
    getMyDoublePlayPrize(myPowerballPlays).then(doubleplayPrize => {
      prize['double'] = doubleplayPrize;
      console.log(prize);
    })
  })
  */
});
