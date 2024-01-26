import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import { userEvent } from '@testing-library/user-event';
import { FaNimblr } from 'react-icons/fa';

describe('testing UI components', () => {
  it('should test Aggrid with toolbar', async () => {
    const user = userEvent.setup();
    const fn = vi.fn();

    render(
      <PVGridWebiny2
        permissions={{
          deleteAction: true,
          createAction: true,
          readAction: true,
          updateAction: true,
        }}
        onDelete={fn}
        cols={[
          { field: 'foo', filter: true, sortable: true, headerName: 'Foo' },
        ]}
      />,
    );
    await waitFor(async () => {
      const deleteModeBtn = screen.getByRole('button', {
        name: /Delete Mode/i,
      });

      expect(deleteModeBtn).toBeInTheDocument();

      await user.click(deleteModeBtn);
    });

    const checkbox1row = document.querySelector(
      '.ag-cell[aria-colindex="1"][col-id="delete-mode"] input',
    ) as HTMLInputElement;
    await waitFor(() => {
      expect(checkbox1row).toBeInTheDocument();
    });

    await user.click(checkbox1row);

    expect(checkbox1row.value).toBeTruthy();

    const deleteBtn = screen.getByLabelText('trash-icon');

    await user.click(deleteBtn);

    expect(fn).toHaveBeenCalled();
  });
});
