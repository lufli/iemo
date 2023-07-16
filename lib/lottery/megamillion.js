function handleError() {
  console.error('err in megamillion call');
}

async function makeMegamillionCall() {
  const response = 
    await fetch('https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData').catch(handleError);
  
  if (response?.ok && response?.status === 200) {
    const data = await response.text();
    return data;
  } else {
    return null;
  }
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
  let finalResult = {
    type: 'mega'
  };
  const { N1, N2, N3, N4, N5, MBall, Megaplier, PlayDate } = dataJson.Drawing
  
  finalResult.whiteBalls = [Number(N1), Number(N2), Number(N3), Number(N4), Number(N5)];
  finalResult.specialBall = Number(MBall);
  finalResult.multiplier = Number(Megaplier);
  finalResult.date = PlayDate;
  finalResult.jackpot = dataJson.Jackpot;

  return finalResult;
}

export async function getWinningMegaNumber() {
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
