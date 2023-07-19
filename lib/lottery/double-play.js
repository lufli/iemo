const axios = require('axios');
const DomParser = require('dom-parser');

const parser = new DomParser();

const options = {
  method: 'GET',
  url: 'https://www.powerball.com/double-play',
};

/* function getWinninNumbers() will fetch the double play winning number of the day,
 * return a winningNumber object. The schema is look like this:
 * WinningNumber {
 *   type: 'double-play',
 *   date: '2023-07-14T17:45:41.487Z',
 *   N1: 1,
 *   N2: 2,
 *   N3: 3,
 *   N4: 4,
 *   N5: 5,
 *   NS: 6,
 * }
 */
async function getWinningNumbers() {
  const response = await axios.request(options);
  const dom = parser.parseFromString(response.data);

  const whiteBalls = dom.getElementsByClassName('black-balls').map((el) => parseInt(el.innerHTML, 10));
  const NS = parseInt(dom.getElementsByClassName('dp-powerball')[0].innerHTML, 10);
  return {
    type: 'double-play',
    date: Date.now(),
    N1: whiteBalls[0],
    N2: whiteBalls[1],
    N3: whiteBalls[2],
    N4: whiteBalls[3],
    N5: whiteBalls[4],
    NS,
  };
}

// Follow the double-play rules: https://www.powerball.com/double-play-prize-chart
function calculatePrize(numOfWhiteBallHit, specialBallHit) {
  if (specialBallHit) {
    switch (numOfWhiteBallHit) {
      case 5:
        return 10000000;
      case 4:
        return 50000;
      case 3:
        return 500;
      case 2:
        return 20;
      case 1:
        return 10;
      default:
        return 7;
    }
  } else {
    switch (numOfWhiteBallHit) {
      case 5:
        return 500000;
      case 4:
        return 500;
      case 3:
        return 20;
      default:
        return 0;
    }
  }
}

/* function checkNumbersForPrize(winningNumbers, play) will receive a winningNumbers and
 * a play like this:
 * Play {
 *   type: 'double-play',
 *   N1: 1,
 *   N2: 2,
 *   N3: 3,
 *   N4: 4,
 *   N5: 5,
 *   NS: 6,
 * }
 * then, return a check object like this:
 * Check {
 *   type: 'double-play',
 *   date: '2023-07-14T17:45:41.487Z',
 *   N1: { number: 1, hit: true },
 *   N2: { number: 2, hit: true },
 *   N3: { number: 3, hit: true },
 *   N4: { number: 4, hit: false },
 *   N5: { number: 5, hit: false },
 *   NS: { number: 6, hit: false },
 *   prize: 20,
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
    type: 'double-play',
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
    prize: calculatePrize(numOfWhiteBallHit, specialBallHit),
  };
}

module.exports = { calculatePrize, checkNumbersForPrize, getWinningNumbers };
