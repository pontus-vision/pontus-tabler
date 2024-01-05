import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { sendHttpRequest } from '../http';
import { TablesReadRes } from '../pontus-api/typescript-fetch-client-generated';
import { AxiosResponse } from 'axios';

import Sidebar from '../components/Sidebar';
import MenuTree from '../components/MenuTree';
import userEvent from '@testing-library/user-event';
const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as any),
  useNavigate: () => mockedUsedNavigate,
}));
const post = async (body: any, endpoint: string) => {
  return sendHttpRequest(
    'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 123456',
    },
    {},
    JSON.stringify(body),
  );
};

afterEach(() => {
  cleanup();
});

describe('Menu', () => {
  it('should visualize root and create a folder under it', async () => {
    const { unmount, container } = render(<MenuTree />);
    const user = userEvent.setup();

    await waitFor(async () => {
      const root = screen.getByText('📁 /');
      expect(root).toBeInTheDocument();

      await user.click(root);

      const openedRoot = screen.getByText('📂 /');

      expect(openedRoot).toBeInTheDocument();
    });

    const openCreateBoxBtn = document.querySelector('.tree-view__open-box-btn');

    expect(openCreateBoxBtn).toBeInTheDocument();

    openCreateBoxBtn && (await user.click(openCreateBoxBtn));

    const createBoxInput = document.querySelector(
      '.tree-view__create-box__input',
    ) as HTMLInputElement;

    expect(createBoxInput).toBeInTheDocument();

    await user.type(createBoxInput, 'folder1');

    expect(createBoxInput.value).toBe('folder1');

    const createBtn = screen.getByText('Create');
    await waitFor(async () => {
      expect(createBtn).toBeInTheDocument();

      await user.click(createBtn);
      const folder1 = screen.getByText('📁 folder1');
      expect(folder1).toBeInTheDocument();
      await user.click(folder1);
      //Creating grand children of root

      const folder1Opened = screen.getByText('📂 folder1');
      expect(folder1Opened).toBeInTheDocument();
    });

    openCreateBoxBtn && (await user.click(openCreateBoxBtn));

    await user.type(createBoxInput, 'grandchildren');

    expect(createBoxInput.value).toBe('grandchildren');

    await user.click(createBtn);

    await waitFor(async () => {
      const grandchildrenFolder = screen.getByText('📁 grandchildren');

      expect(grandchildrenFolder).toBeInTheDocument();
    });

    // await waitFor(async () => {
    //   const grandchildrenFolder = screen.getByText('📁 grandchildren');
    //   fireEvent.contextMenu(grandchildrenFolder);

    //   const renameOption = screen.getByText('Rename');

    //   expect(renameOption).toBeInTheDocument();

    //   await user.click(renameOption);

    //   const renameInput = document.querySelector(
    //     '.tree-item__input-rename',
    //   ) as HTMLInputElement;

    //   expect(renameInput).toBeInTheDocument();

    //   await user.type(renameInput, 'something else');
    // });
  });
});
