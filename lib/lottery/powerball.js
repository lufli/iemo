/* Powerball drawings are held every Monday, Wednesday, and Saturday at 10:59 pm ET at the Florida Lottery draw studio in Tallahasee. */
const axios = require('axios');
const DomParser = require('dom-parser');

const parser = new DomParser();

const options = {
  method: 'GET',
  url: 'https://www.powerball.com',
};

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

async function getWinningNumbers() {
  const response = await axios.request(options);
  const dom = parser.parseFromString(response.data);

  const winningWhiteBalls = dom.getElementsByClassName('white-balls').map((el) => parseInt(el.innerHTML, 10));
  const winningSpecialBall = parseInt(dom.getElementsByClassName('powerball')[0].innerHTML, 10);
  const multiplier = parseInt(dom.getElementsByClassName('multiplier')[0].innerHTML, 10);
  return {
    winningWhiteBalls,
    winningSpecialBall,
    multiplier,
  };
}

const myPowerballPlays = [
  {
    whiteBalls: [4, 9, 22, 41, 55],
    specialBall: 11,
  },
  {
    whiteBalls: [18, 25, 47, 52, 66],
    specialBall: 16,
  },
];

function checkNumbersForPrizes(plays) {
  const winningNumber = getWinningNumbers();
  plays.map(({ whiteBalls, specialBall }) => {
    const whiteBallsCheck = whiteBalls.map((number) => ({
      number,
      hit: winningNumber.whiteBalls.includes(number),
    }));
    const specialBallCheck = {
      number: specialBall,
      hit: winningNumber.specialBall === specialBall,
    };
    const numOfWhiteBallHit = whiteBallsCheck.reduce((acc, cur) => cur.hit ? acc + 1 : acc);
    return {
      whiteBalls: whiteBallsCheck,
      speicialBall: specialBallCheck,
      prize: calculatePrize(numOfWhiteBallHit, specialBallCheck.hit, winningNumber.multiplier),
    };
  });
}

getWinningNumbers();
checkNumbersForPrizes(myPowerballPlays);

module.exports = { getWinningNumbers };
