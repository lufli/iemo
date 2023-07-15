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

export async function getWinningMegaNumber() {
  const rawData = await makeMegamillionCall();
  if (rawData) {
    const parsedData = JSON.parse(parseRawData(rawData));
    try {
      return {
        drawing: parsedData.Drawing,
        jackpot: parsedData.Jackpot
      }
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
