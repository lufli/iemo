import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import '@/matchMedia.mock';
import DecisionMaker from '@/pages/decision-maker';

// TODO: Math.random() is not a good way to mimic uuid
jest.mock('uuid', () => ({ v4: () => Math.random() }));

describe('DecisionMaker', () => {
  it('render the header', () => {
    render(<DecisionMaker />);
    expect(screen.getByText(/Decision Maker/i)).toBeInTheDocument();
  });

  it('onNameChange', () => {
    render(<DecisionMaker />);
    const elements = screen.getAllByTestId(/^name-input/);
    elements.forEach((element) => {
      fireEvent.change(element, { target: { value: 'test-name-change' } });
      expect(element.value).toBe('test-name-change');
    });
  });

  it('onAddName', () => {
    const { container } = render(<DecisionMaker />);
    expect(container.querySelectorAll('input')).toHaveLength(6);
    const button = screen.getByTestId('add-name-button');
    fireEvent.click(button);
    expect(container.querySelectorAll('input')).toHaveLength(7);
  });

  it('onDeleteName', async () => {
    const { container } = render(<DecisionMaker />);
    let count = 6;
    expect(container.querySelectorAll('input')).toHaveLength(count);

    const buttons = screen.getAllByTestId('name-delete-button');
    buttons.forEach(async (button) => {
      fireEvent.click(button);
      count -= 1;
      await waitFor(() => {
        expect(container.querySelectorAll('input')).toHaveLength(count);
      });
    });
  });

  it('onOptionChange', () => {
    render(<DecisionMaker />);
    const elements = screen.getAllByTestId(/^option-input/);
    elements.forEach((element) => {
      fireEvent.change(element, { target: { value: 'test-option-change' } });
      expect(element.value).toBe('test-option-change');
    });
  });

  it('onAddOption', () => {
    const { container } = render(<DecisionMaker />);
    expect(container.querySelectorAll('input')).toHaveLength(6);
    const button = screen.getByTestId('add-option-button');
    fireEvent.click(button);
    expect(container.querySelectorAll('input')).toHaveLength(7);
  });

  it('onDeleteOption', async () => {
    const { container } = render(<DecisionMaker />);
    let count = 6;
    expect(container.querySelectorAll('input')).toHaveLength(count);

    const buttons = screen.getAllByTestId('option-delete-button');
    buttons.forEach(async (button) => {
      fireEvent.click(button);
      count -= 1;
      await waitFor(() => {
        expect(container.querySelectorAll('input')).toHaveLength(count);
      });
    });
  });

  it('onSubmit and onModalClose', async () => {
    render(<DecisionMaker />);
    const optionDeleteButtons = screen.getAllByTestId('option-delete-button');
    fireEvent.click(optionDeleteButtons[0]);

    // open modal
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('table')).toBeVisible();
    });

    // close modal
    const okButton = screen.getByTestId('ok-button');
    fireEvent.click(okButton);
    await waitFor(() => {
      expect(screen.getByTestId('table')).not.toBeVisible();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('table')).toBeVisible();
    });
  });

  it('onClear', async () => {
    const { container } = render(<DecisionMaker />);
    const optionDeleteButtons = screen.getAllByTestId('option-delete-button');
    fireEvent.click(optionDeleteButtons[0]);

    // reset app
    await waitFor(() => {
      expect(container.querySelectorAll('input')).toHaveLength(5);
      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);
    });
    await waitFor(() => {
      expect(container.querySelectorAll('input')).toHaveLength(6);
    });
  });
});
