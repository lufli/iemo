import { render, screen } from '@testing-library/react';
import Navigation from '@/components/navigation';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';

describe('renders navigation', () => {
  it('renders all links', () => {
    render(<Navigation />);
    expect(screen.getByText(/A Collection of Coolest Tools/i)).toBeInTheDocument();
    expect(screen.getByText(/One submit! No regret!/i).closest('a')).toHaveAttribute('href', '/decision-maker');
    expect(screen.getByText(/Become A Billionaire/i).closest('a')).toHaveAttribute('href', '/billionaire');
  });
});
