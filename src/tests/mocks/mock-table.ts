import { MockServer } from '../mocks/mock-server';

import * as UI from '@/types/ui';

import { vi } from 'vitest';
import { createMockTableManager } from '../helpers/test-table-helpers';

interface TableMockProps {
  server: MockServer;
  moduleUrl: string;
  viewName: string;
}

const addFilterMocks = (id: number, baseUrl: string, server: MockServer) => {
  const onCreateFilter = vi.fn();
  const onUpdateFilter = vi.fn();
  const onRemoveFilter = vi.fn();
  server.addRequestHandler('POST', `${baseUrl}/filter`, { id }, onCreateFilter);
  server.addRequestHandler('PUT', `${baseUrl}/filter/${id}`, undefined, onUpdateFilter);
  server.addRequestHandler(
    'DELETE',
    `${baseUrl}/filter/${id}`,
    undefined,
    onRemoveFilter,
  );
};

export const installTableMocks = (
  items: UI.IdItemType[],
  { server, moduleUrl, viewName }: TableMockProps,
) => {
  const updateListener = server.addSubscriptionHandler(
    moduleUrl,
    `${viewName}_view_updated`,
  );

  const mockTableManager = createMockTableManager(updateListener.fire);
  mockTableManager.setItems(items);

  const baseUrl = `${moduleUrl}/${viewName}_view`;

  // Getters
  const addGetItemsMock = (start: number, count: number) => {
    const onGetItems = vi.fn(() => mockTableManager.getItems(start, count));
    server.addRequestHandler(
      'GET',
      `${baseUrl}/items/${start}/${count}`,
      undefined,
      onGetItems,
    );
    return onGetItems;
  };

  addGetItemsMock(0, 5);
  addGetItemsMock(5, 10);
  addGetItemsMock(10, 15);
  addGetItemsMock(15, 20);

  // Settings
  const onSettings = vi.fn(mockTableManager.handleSettings);
  server.addRequestHandler('POST', `${baseUrl}/settings`, undefined, onSettings);

  // Closing
  const onClose = vi.fn();
  server.addRequestHandler('DELETE', `${baseUrl}`, undefined, onClose);

  // Filter
  const filter = addFilterMocks(0, baseUrl, server);

  return { mockTableManager, onSettings, onClose, filter };
};
