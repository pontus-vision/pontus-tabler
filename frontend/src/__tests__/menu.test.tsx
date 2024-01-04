import { render, screen, waitFor, cleanup } from '@testing-library/react';
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

beforeEach(async () => {});

afterEach(() => {
  cleanup();
});

describe('Menu', () => {
  it('should visualize root', async () => {
    const user = userEvent.setup();
    render(<MenuTree />);

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

    await waitFor(async () => {
      const createBtn = screen.getByText('Create');

      expect(createBtn).toBeInTheDocument();

      await user.click(createBtn);
    });
    await waitFor(async () => {
      // const root = screen.getByText('📁 /');
      // expect(root).toBeInTheDocument();
      // await user.click(root);
    });
    await waitFor(() => {
      const folder1 = screen.getByText('📁 folder1');
      expect(folder1).toBeInTheDocument();
    });
  });
});
