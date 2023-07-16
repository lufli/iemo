import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import Billionaire from '@/pages/billionaire';

describe('Billionaire', () => {
  it('render the Billionaire', () => {
    const props = {
      megaResult: {
        drawing: {
          N1: '1',
          N2: '2',
          N3: '3',
          N4: '4',
          N5: '5',
          MBall: '6'
        }
      }
    }
    render(<Billionaire {...props} />)

    expect(screen.getByText(/Billionaire/i)).toBeInTheDocument()
    expect(screen.getByText(/Megamillion Result is 1 2 3 4 5 6/i)).toBeInTheDocument()
  })
})
