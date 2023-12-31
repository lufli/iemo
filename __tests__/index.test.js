import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import Home from '@/pages/index';

describe('Home', () => {
  it('render the app sucessful', () => {
    render(<Home />);
  });

  it('render all app links', () => {
    render(<Home />);

    expect(screen.getByText(/A Collection of Coolest Tools/i)).toBeInTheDocument();
    expect(screen.getByText(/One submit! No regret!/i).closest('a')).toHaveAttribute('href', '/decision-maker');
    expect(screen.getByText(/Become A Billionaire/i).closest('a')).toHaveAttribute('href', '/billionaire');
  });
});
