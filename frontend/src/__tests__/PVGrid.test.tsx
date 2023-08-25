import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import PVGridWebiny2 from '../pv-react/PVGridWebiny2'; // Adjust the path accordingly

// Mock dependencies (you might need to adjust these mocks)
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(() => vi.fn()),
}));

vi.mock('ag-grid-community', () => ({
  AgGridReact: vi.fn(() => <div>Mocked AgGridReact</div>),
}));

describe('PVGridWebiny2 Component', () => {
  it('renders without crashing', () => {
    render(<PVGridWebiny2 />);
  });

  it('renders Action Panel', () => {
    const { getByTestId } = render(<PVGridWebiny2 />);
    const agGridComponent = getByTestId('grid-action-panel');

    // Adjust the class name accordingly
    expect(agGridComponent).toBeInTheDocument();
  });

  it('renders AgGridReact component', () => {
    const { getByTestId } = render(<PVGridWebiny2 />);
    const agGridComponent = getByTestId('ag-grid-component');

    // Adjust the class name accordingly
    expect(agGridComponent).toBeInTheDocument();
  });

  // Add more test cases to cover interactions, state management, etc.
});
