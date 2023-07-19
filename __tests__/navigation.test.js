import { render, screen } from '@testing-library/react';
import Navigation from '@/components/navigation';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';

describe('renders navigation', () => {
  it('renders all links', () => {
    render(<Navigation />);
    expect(screen.getByText(/LOGO/i)).toBeInTheDocument();
  });
});
