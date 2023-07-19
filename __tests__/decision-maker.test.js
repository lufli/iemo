import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import DecisionMaker from '@/pages/decision-maker';

describe('Home', () => {
  it('render the header', () => {
    render(<DecisionMaker />);
    expect(screen.getByText(/Decision Maker/i)).toBeInTheDocument();
  });

  it('should call onNameChange function', () => {
    render(<DecisionMaker />);
    const elements = screen.getAllByTestId(/^name-input/);
    elements.forEach((element) => {
      fireEvent.change(element, { target: { value: 'test-name-change' } });
      expect(element.value).toBe('test-name-change');
    });
  });

  it('should call onAddName function', async () => {
    const { container } = render(<DecisionMaker />);
    const element = screen.getByTestId('add-name-button');
    /*
    fireEvent(element, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    */
    // console.log(container.querySelectorAll(/^name-input-/).length);
    fireEvent.click(element);
    await waitFor(() => {
      console.log(screen.queryAllByTestId(/^name-input/).length);
      expect(screen.queryAllByTestId(/^name-input/)).toHaveLength(4);
    }, {timeOut: 3000});
  });
});
