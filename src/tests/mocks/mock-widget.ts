import TransferConstants from '@/constants/TransferConstants';
import { getMockServer } from 'airdcpp-apisocket/tests';
import { TransferStatsResponse } from './api/transfers';
import SystemConstants from '@/constants/SystemConstants';
import { SystemStatsResponse } from './api/system';
import { ExtensionsListResponse } from './api/extensions';
import ExtensionConstants from '@/constants/ExtensionConstants';

export const installTransferWidgetMocks = (server: ReturnType<typeof getMockServer>) => {
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

export const installApplicationWidgetMocks = (
  server: ReturnType<typeof getMockServer>,
) => {
  server.addRequestHandler('GET', SystemConstants.STATS_URL, SystemStatsResponse);
};

export const installExtensionWidgetMocks = (server: ReturnType<typeof getMockServer>) => {
  server.addRequestHandler(
    'GET',
    ExtensionConstants.EXTENSIONS_URL,
    ExtensionsListResponse,
  );
};
