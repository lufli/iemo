const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData',
};

async function makeMegamillionCall() {
  const response = await axios.request(options);
  return response.data;
}

function parseRawData(rawData) {
  const start = rawData.indexOf('{');
  const end = rawData.lastIndexOf('}');
  if (start < 0 || end < 0) {
    return '';
  }
  return rawData.substring(start, end + 1);
}

function standardizeData(rawData) {
  const dataJson = JSON.parse(parseRawData(rawData));
  const {
    N1, N2, N3, N4, N5, MBall, Megaplier, PlayDate,
  } = dataJson.Drawing;
  const finalResult = {
    type: 'megamillions',
    N1,
    N2,
    N3,
    N4,
    N5,
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
      console.error('error happend in megamillions parsing');
      return {
        somethingwrong: true,
      };
    }
  } else {
    console.error('error happened');
    return {
      somethingwrong: true,
    };
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
      case 1:
        return multiplier * 4;
      default:
        return multiplier * 2;
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
  const winningResult = {
    type: 'megamillions',
    date: new Date(),
    multiplier: winningNumber.multiplier,
  };

  const winningWhiteBalls = [
    Number(winningNumber.N1),
    Number(winningNumber.N2),
    Number(winningNumber.N3),
    Number(winningNumber.N4),
    Number(winningNumber.N5),
  ];

  for (let i = 1; i < 6; i++) {
    const hit = winningWhiteBalls.includes(Number(playNumber[`N${i}`]));
    winningResult[`N${i}`] = {
      hit,
      number: Number(playNumber[`N${i}`]),
    };

    numberOfWhiteBallHits += Number(hit);
  }

  const specialHit = Number(winningNumber.NS) === Number(playNumber.NS);
  winningResult.NS = {
    number: playNumber.NS,
    hit: specialHit,
  };

  winningResult.prize = calculatePrize(numberOfWhiteBallHits, specialHit, winningNumber.multiplier);

  return winningResult;
}

module.exports = { getWinningNumbers, checkNumbersForPrize, calculatePrize };
