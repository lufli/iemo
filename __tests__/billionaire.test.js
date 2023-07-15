import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import Billionaire from '@/pages/billionaire';

describe('Home', () => {
  it('render the header', () => {
    render(<Billionaire />);

    expect(screen.getByText(/Billionaire/i)).toBeInTheDocument();
  });
});
