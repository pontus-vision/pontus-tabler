import { render, fireEvent, cleanup } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { dashboardSlice, setDashboardId } from '../store/sliceDashboards';
import { Router } from 'react-router-dom';

describe('Sidebar component', () => {
  let store;

  beforeEach(() => {
    cleanup();
    store = configureStore({
      reducer: {
        dashboards: () => ({
          value: [
            { id: 1, name: 'Dashboard 1' },
            { id: 2, name: 'Dashboard 2' },
          ],
        }),
      },
    });
  });

  it('renders without error', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar openedSidebar={true} setOpenedSidebar={() => {}} />
        </MemoryRouter>
      </Provider>,
    );
  });

  it('triggers logout when Logout button is clicked', () => {
    const logoutMock = vi.fn();

    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock);
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar openedSidebar={true} setOpenedSidebar={() => {}} />
        </MemoryRouter>
      </Provider>,
      { useAuth: () => ({ logout: logoutMock }) },
    );

    const logoutButton = getByText('Logout');
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalled();
  });

  it('navigates to admin panel when Admin button is clicked', () => {
    const navigateMock = vi.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar openedSidebar={true} setOpenedSidebar={() => {}} />
        </MemoryRouter>
      </Provider>,
      { useNavigate: navigateMock },
    );

    const adminButton = getByText('Admin Panel');
    fireEvent.click(adminButton);

    expect(navigateMock).toHaveBeenCalledWith('/admin');
  });

  it('navigates to dashboard when a dashboard label is clicked', () => {
    const navigateMock = vi.fn();
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar openedSidebar={true} setOpenedSidebar={() => {}} />
        </MemoryRouter>
      </Provider>,
      { useNavigate: navigateMock },
    );

    const dashboardLabel = getByLabelText('Dashboard Name');
    fireEvent.click(dashboardLabel);

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });
});
