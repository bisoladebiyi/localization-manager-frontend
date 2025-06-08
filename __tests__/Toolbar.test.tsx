import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from '../app/components/Toolbar';

describe('Toolbar', () => {
  it('renders input with value and updates on change', async () => {
    const mockSetSearchVal = jest.fn();
    render(
      <Toolbar
        searchVal="some"
        setSearchVal={mockSetSearchVal}
        isAddNew={false}
        setIsAddNew={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/search translations/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('some');

    await userEvent.type(input, ' translation');
    expect(mockSetSearchVal).toHaveBeenCalledTimes(' translation'.length)
  });

  it('shows "Add New Translation" button only when isAddNew is false', () => {
    const { rerender } = render(
      <Toolbar
        searchVal=""
        setSearchVal={jest.fn()}
        isAddNew={false}
        setIsAddNew={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /add new translation/i })).toBeInTheDocument();

    rerender(
      <Toolbar
        searchVal=""
        setSearchVal={jest.fn()}
        isAddNew={true}
        setIsAddNew={jest.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: /add new translation/i })).not.toBeInTheDocument();
  });

  it('calls setIsAddNew(true) when button is clicked', async () => {
    const mockSetIsAddNew = jest.fn();

    render(
      <Toolbar
        searchVal=""
        setSearchVal={jest.fn()}
        isAddNew={false}
        setIsAddNew={mockSetIsAddNew}
      />
    );

    const button = screen.getByRole('button', { name: /add new translation/i });
    await userEvent.click(button);

    expect(mockSetIsAddNew).toHaveBeenCalledWith(true);
    expect(mockSetIsAddNew).toHaveBeenCalledTimes(1);
  });
});
