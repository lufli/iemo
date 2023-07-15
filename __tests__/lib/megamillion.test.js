import { getWinningMegaNumber } from '@/lib/lottery/megamillion'
import fetchMock from 'fetch-mock'

describe('get megamillion', function() {
  beforeEach(function() {
    fetchMock.reset();
  })

  it('should success when return correct data', async function() {
    fetchMock.once('https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData', {
      response: '{Drawing: undefiened, Jackpot: undefined',
      status: 200
    });
    const response = await getWinningMegaNumber();
    expect(response).toStrictEqual({ drawing: undefined, jackpot: undefined })
  })
})