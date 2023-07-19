const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData',
};

async function makeMegamillionCall() {
  const response = await axios.request(options)
  return response.data;
}

function parseRawData(rawData) {
  let start = rawData.indexOf('{');
  let end;
  if (start < 0) {
    return '';
  }
  for (let i = rawData.length -1; i > 0; i--) {
    if (rawData.charAt(i) === '}') {
      end = i;
      break;
    }
  }
  if (end < 0) {
    return '';
  }
  return rawData.substring(start, end + 1);
};

function standardizeData(rawData) {
  const dataJson = JSON.parse(parseRawData(rawData));
  const { N1, N2, N3, N4, N5, MBall, Megaplier, PlayDate } = dataJson.Drawing
  let finalResult = {
    type: 'megamillions',
    N1,
    N2,
    N3,
    N4,
    N5
  };
  
  finalResult.NS = MBall;
  finalResult.multiplier = Number(Megaplier);
  finalResult.date = PlayDate;
  finalResult.jackpot = dataJson.Jackpot;

  return finalResult;
}

async function getWinningNumbers() {
  const rawData = await makeMegamillionCall();
  if (rawData) {
    try {
      const parsedData = standardizeData(rawData);
      return parsedData;
    } catch (err) {
      console.error('error happend in megamillion parsing');
      return {
        somethingwrong: true
      };
    }
  } else {
    console.log('error happened');
  }
}

function calculatePrize(numOfWhiteBallHit, specialBallHit, multiplier) {
  if (specialBallHit) {
    switch (numOfWhiteBallHit) {
      case 5:
        return 'Grand Prize';
      case 4:
        return multiplier * 10000;
      case 3:
        return multiplier * 200;
      case 2:
        return multiplier * 10;
      default:
        return multiplier * 4;
    }
  } else {
    switch (numOfWhiteBallHit) {
      case 5:
        return multiplier * 1000000;
      case 4:
        return multiplier * 500;
      case 3:
        return multiplier * 10;
      default:
        return 0;
    }
  }
}

function checkNumbersForPrize(winningNumber, playNumber) {
  let numberOfWhiteBallHits = 0;
  let winningResult = {
    type: 'megamillion',
    date: new Date(),
    multiplier: winningNumber.multiplier
  };

  for (let i = 1; i < 6; i++) {
    let hit = Number(playNumber[`N${i}`]) === Number(winningNumber[`N${i}`]);
    winningResult[`N${i}`] = {
      hit,
      number: Number(playNumber[`N${i}`])
    };
    
    numberOfWhiteBallHits += Number(hit);
  }

  let specialHit = Number(winningNumber.NS) === Number(playNumber.NS);
  winningResult.NS = {
    number: playNumber.NS,
    hit: specialHit
  }

  winningResult.prize = calculatePrize(numberOfWhiteBallHits, specialHit, winningNumber.multiplier);

  return winningResult;
}

module.exports = { getWinningNumbers, checkNumbersForPrize, calculatePrize }