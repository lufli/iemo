import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import Billionaire from '@/pages/billionaire';

describe('Billionaire', () => {
  const mockResponse = [{
    type: 'megamillions',
    N1: 10,
    N2: 24,
    N3: 48,
    N4: 51,
    N5: 66,
    NS: 15,
    multiplier: 2,
    date: '2023-07-14T00:00:00',
    jackpot: {
      PlayDate: '2023-07-14T00:00:00', CurrentPrizePool: 560000000, NextPrizePool: 640000000, CurrentCashValue: 287000000, NextCashValue: 328500000, Winners: 0, Verified: true, UpdatedBy: 'SERVICE', UpdatedTime: '2023-07-18T11:37:02',
    },
  }, {
    type: 'powerball', date: 1689732130298, N1: 5, N2: 8, N3: 9, N4: 17, N5: 41, NS: 21, multiplier: 4,
  }, {
    type: 'double-play', date: 1689732132475, N1: 9, N2: 37, N3: 38, N4: 62, N5: 69, NS: 23,
  }];

  const server = setupServer(rest.get('/api/get-lottery-results', (req, res, ctx) => res(ctx.json(mockResponse))));

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date());
    server.listen();
  });

  it('render the Billionaire', () => {
    render(<Billionaire />);
    expect(screen.getByText(/Billionaire/i)).toBeInTheDocument();
    expect(screen.getByText(/re-run/i)).toBeInTheDocument();
  });
});
