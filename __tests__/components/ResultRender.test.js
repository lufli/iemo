import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultRender from '@/components/billionaire/ResultRender';

describe('ResultRender', () => {
  it('should render correctly', () => {
    const winningNumber = {
      N1: 1,
      N2: 2,
      N3: 3,
      N4: 4,
      N5: 5,
      NS: 6,
      type: 'megamillions',
      fetchFail: false,
    };

    render(<ResultRender {...winningNumber} />);

    expect(screen.getByText(/megamillions result is/i)).toBeInTheDocument();
  });
});
