import { MockServer } from '../mocks/mock-server';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { vi } from 'vitest';
import { createMockTableManager } from '../helpers/test-table-helpers';

interface TableMockProps {
  server: MockServer;
  moduleUrl: string;
  viewName: string;
  entityId?: API.IdType;
}

const installFilterMocks = (id: number, baseUrl: string, server: MockServer) => {
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

  return { onCreateFilter, onUpdateFilter, onRemoveFilter };
};

export const installTableMocks = (
  items: UI.IdItemType[],
  { server, moduleUrl, viewName, entityId }: TableMockProps,
) => {
  const updateListener = server.addSubscriptionHandler(
    moduleUrl,
    `${viewName}_view_updated`,
    entityId,
  );

  const mockTableManager = createMockTableManager((data) =>
    updateListener.fire(data, entityId),
  );
  mockTableManager.setItems(items);

  let baseUrl = moduleUrl;
  if (entityId) {
    baseUrl += `/${entityId}`;
  }
  baseUrl += `/${viewName}_view`;

  // Getters
  const addGetItemsMock = (start: number, count: number) => {
    const onGetItems = vi.fn();
    server.addRequestHandler(
      'GET',
      `${baseUrl}/items/${start}/${count}`,
      mockTableManager.getItems(start, count),
      onGetItems,
    );
    return onGetItems;
  };

  for (let i = 0; i < 10; i++) {
    addGetItemsMock(0, i + 1);
  }

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
  const filter = installFilterMocks(0, baseUrl, server);

  return { mockTableManager, onSettings, onClose, filter };
};
