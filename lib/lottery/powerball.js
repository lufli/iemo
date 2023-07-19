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
 *   N1: 1,
 *   N2: 2,
 *   N3: 3,
 *   N4: 4,
 *   N5: 5,
 *   NS: 6,
 *   multiplier: 2,
 * }
 */
async function getWinningNumbers() {
  const response = await axios.request(options);
  const dom = parser.parseFromString(response.data);

  const whiteBalls = dom.getElementsByClassName('white-balls').map((el) => parseInt(el.innerHTML, 10));
  const NS = parseInt(dom.getElementsByClassName('powerball')[0].innerHTML, 10);
  const multiplier = parseInt(dom.getElementsByClassName('multiplier')[0].innerHTML, 10);
  return {
    type: 'powerball',
    date: Date.now(),
    N1: whiteBalls[0],
    N2: whiteBalls[1],
    N3: whiteBalls[2],
    N4: whiteBalls[3],
    N5: whiteBalls[4],
    NS,
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
 *   N1: 1,
 *   N2: 2,
 *   N3: 3,
 *   N4: 4,
 *   N5: 5,
 *   NS: 6,
 * }
 * then, return a check object like this:
 * Check {
 *   type: 'powerball',
 *   date: '2023-07-14T17:45:41.487Z',
 *   N1: {
 *     number: 1,
 *     hit: true,
 *   },
 *   N2: {
 *     number: 2,
 *     hit: true,
 *   },
 *   N3: {
 *     number: 3,
 *     hit: true,
 *   },
 *   N4: {
 *     number: 4,
 *     hit: false,
 *   },
 *   N5: {
 *     number: 5,
 *     hit: false,
 *   },
 *   NS: {
 *     number: 6,
 *     hit: false,
 *   },
 *   multiplier: 2,
 *   prize: 14,
 * }
 */
function checkNumbersForPrize(winningNumbers, play) {
  const winningWhiteBalls = [
    winningNumbers.N1,
    winningNumbers.N2,
    winningNumbers.N3,
    winningNumbers.N4,
    winningNumbers.N5,
  ];
  const numOfWhiteBallHit = winningWhiteBalls.includes(play.N1)
    + winningWhiteBalls.includes(play.N2)
    + winningWhiteBalls.includes(play.N3)
    + winningWhiteBalls.includes(play.N4)
    + winningWhiteBalls.includes(play.N5);
  const specialBallHit = play.NS === winningNumbers.NS;

  return {
    type: 'powerball',
    date: new Date(),
    N1: {
      number: play.N1,
      hit: winningWhiteBalls.includes(play.N1),
    },
    N2: {
      number: play.N2,
      hit: winningWhiteBalls.includes(play.N2),
    },
    N3: {
      number: play.N3,
      hit: winningWhiteBalls.includes(play.N3),
    },
    N4: {
      number: play.N4,
      hit: winningWhiteBalls.includes(play.N4),
    },
    N5: {
      number: play.N5,
      hit: winningWhiteBalls.includes(play.N5),
    },
    NS: {
      number: play.NS,
      hit: play.NS === winningNumbers.NS,
    },
    multiplier: winningNumbers.multiplier,
    prize: calculatePrize(numOfWhiteBallHit, specialBallHit, winningNumbers.multiplier),
  };
}

module.exports = { calculatePrize, checkNumbersForPrize, getWinningNumbers };
