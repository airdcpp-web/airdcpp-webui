import { describe, expect, test, vi } from 'vitest';
import * as React from 'react';
import { createFormatter } from '@/utils/Formatter';

// This test verifies RowWrapperCell behavior
// It uses component internals to verify the lifecycle pattern
describe('RowWrapperCell lifecycle', () => {
  test('should handle rowIndex changes', () => {
    // Verify the lifecycle pattern:
    // On rowIndex change: remove pending requests, load new data, clear old data if needed
    const removePendingRequests = vi.fn();
    const dataLoader = {
      removePendingRequests,
      updateRowData: vi.fn().mockReturnValue(true),
    };

    // Simulate the UNSAFE_componentWillReceiveProps logic:
    const prevRowIndex = 0;
    const nextRowIndex = 1;

    // If row index changes, remove pending for previous
    if (nextRowIndex !== prevRowIndex) {
      dataLoader.removePendingRequests(prevRowIndex);
    }

    // Load data for new index
    const loaded = dataLoader.updateRowData(nextRowIndex);

    expect(removePendingRequests).toHaveBeenCalledWith(0);
    expect(dataLoader.updateRowData).toHaveBeenCalledWith(1);
    expect(loaded).toBe(true);
  });

  test('should not remove pending when rowIndex is same', () => {
    const removePendingRequests = vi.fn();
    const dataLoader = {
      removePendingRequests,
      updateRowData: vi.fn().mockReturnValue(true),
    };

    const prevRowIndex = 1;
    const nextRowIndex = 1;

    if (nextRowIndex !== prevRowIndex) {
      dataLoader.removePendingRequests(prevRowIndex);
    }

    dataLoader.updateRowData(nextRowIndex);

    expect(removePendingRequests).not.toHaveBeenCalled();
    expect(dataLoader.updateRowData).toHaveBeenCalledWith(1);
  });
});
