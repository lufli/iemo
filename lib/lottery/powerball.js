const axios = require('axios');
const DomParser = require('dom-parser');

const parser = new DomParser();

const options = {
  method: 'GET',
  url: 'https://www.powerball.com',
};

/* function getWinninNumbers() will fetch the powerball winning number of the day,
 * return a winningNumber object. The schema is look like this:
 * WinningNumber {
 *   type: 'powerball',
 *   date: '2023-07-14T17:45:41.487Z',
 *   whiteBalls: [1, 2, 3, 4, 5],
 *   specialBall: 6,
 *   multiplier: 2,
 * }
 */
async function getWinningNumbers() {
  const response = await axios.request(options);
  const dom = parser.parseFromString(response.data);

  const whiteBalls = dom.getElementsByClassName('white-balls').map((el) => parseInt(el.innerHTML, 10));
  const specialBall = parseInt(dom.getElementsByClassName('powerball')[0].innerHTML, 10);
  const multiplier = parseInt(dom.getElementsByClassName('multiplier')[0].innerHTML, 10);
  return {
    date: new Date(),
    whiteBalls,
    specialBall,
    multiplier,
  };
}

// Follow the powerball rules: https://www.powerball.com/powerball-prize-chart
function calculatePrize(numOfWhiteBallHit, specialBallHit, multiplier) {
  if (specialBallHit) {
    switch (numOfWhiteBallHit) {
      case 5:
        return 'Grand Prize';
      case 4:
        return multiplier * 50000;
      case 3:
        return multiplier * 100;
      case 2:
        return multiplier * 7;
      default:
        return multiplier * 4;
    }
  } else {
    switch (numOfWhiteBallHit) {
      case 5:
        return 2000000;
      case 4:
        return multiplier * 100;
      case 3:
        return multiplier * 7;
      default:
        return 0;
    }
  }
}

/* function checkNumbersForPrize(winningNumbers, play) will receive a winningNumbers and
 * a play like this:
 * Play {
 *   type: 'powerball',
 *   whiteBalls: [1, 2, 3, 4, 5],
 *   specialBall: 6,
 * }
 * then, return a check object like this:
 * Check {
 *   type: 'powerball',
 *   date: '2023-07-14T17:45:41.487Z',
 *   whiteBalls: [
 *     {
 *       number: 1,
 *       hit: true,
 *     },
 *     {
 *       number: 2,
 *       hit: true,
 *     },
 *     {
 *       number: 3,
 *       hit: true,
 *     },
 *     {
 *       number: 4,
 *       hit: false,
 *     },
 *     {
 *       number: 5,
 *       hit: false,
 *     },
 *   ],
 *   specialBall: {
 *     number: 6,
 *     hit: false,
 *   },
 *   multiplier: 2,
 *   prize: 14,
 * }
 */
function checkNumbersForPrize(winningNumbers, play) {
  const numOfWhiteBallHit = play.whiteBalls.reduce((acc, cur) => (
    winningNumbers.whiteBalls.includes(cur) ? acc + 1 : acc
  ), 0);
  const specialBallHit = play.specialBall === winningNumbers.specialBall;

  return {
    type: 'powerball',
    date: new Date(),
    whiteBalls: play.whiteBalls.map((number) => ({
      number,
      hit: winningNumbers.whiteBalls.includes(number),
    })),
    specialBall: {
      number: play.specialBall,
      hit: specialBallHit,
    },
    multiplier: winningNumbers.multiplier,
    prize: calculatePrize(numOfWhiteBallHit, specialBallHit, winningNumbers.multiplier),
  };
}

module.exports = { checkNumbersForPrize, getWinningNumbers };
