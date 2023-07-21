import { render, screen } from '@testing-library/react';
import Navigation from '@/components/navigation';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';

describe('renders navigation', () => {
  it('renders correctly', () => {
    render(<Navigation />);
    const logoImage = screen.getByAltText('iemo');

    expect(logoImage).toBeInTheDocument();
  });
});
