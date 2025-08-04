import TransferConstants from '@/constants/TransferConstants';
import { TransferStatsResponse } from './api/transfers';
import SystemConstants from '@/constants/SystemConstants';
import { SystemStatsResponse } from './api/system';
import { ExtensionsListResponse } from './api/extensions';
import ExtensionConstants from '@/constants/ExtensionConstants';
import { MockServer } from './mock-server';

export const installTransferWidgetMocks = (server: MockServer) => {
  server.addRequestHandler(
    'GET',
    TransferConstants.STATISTICS_URL,
    TransferStatsResponse,
  );

  const transferStats = server.addSubscriptionHandler(
    TransferConstants.MODULE_URL,
    TransferConstants.STATISTICS,
  );

  return { transferStats };
};

export const installApplicationWidgetMocks = (server: MockServer) => {
  server.addRequestHandler('GET', SystemConstants.STATS_URL, SystemStatsResponse);
};

export const installExtensionWidgetMocks = (server: MockServer) => {
  server.addRequestHandler(
    'GET',
    ExtensionConstants.EXTENSIONS_URL,
    ExtensionsListResponse,
  );
};
