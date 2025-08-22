import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { DEFAULT_AUTH_RESPONSE } from 'airdcpp-apisocket/tests';
import { vi } from 'vitest';
import { MockServer } from './mock-server';
import { waitForData } from '../helpers/test-helpers';
import { RenderResult } from '@testing-library/react';

export const DEFAULT_MOCK_PERMISSIONS = [API.AccessEnum.ADMIN];

export const getMockSession = (
  permissions = DEFAULT_MOCK_PERMISSIONS,
): UI.AuthenticatedSession => ({
  system_info: {
    ...DEFAULT_AUTH_RESPONSE.system_info,
    api_feature_level: 9,
  } as API.SystemInfo,
  user: {
    ...(DEFAULT_AUTH_RESPONSE.user as API.LoginUser),
    permissions,
  },
  auth_token: DEFAULT_AUTH_RESPONSE.auth_token,
  session_id: 4,
  wizard_pending: false,
  refresh_token: 'dc66f47d-d060-4c50-aa3b-4a4741938a04',
});

export const installSessionMessageMocks = (
  sessionUrl: string,
  sessionId: API.IdType,
  messageResponse: object[],
  server: MockServer,
) => {
  const onMessagesRead = vi.fn();
  server.addRequestHandler(
    'POST',
    `${sessionUrl}/${sessionId}/messages/read`,
    undefined,
    onMessagesRead,
  );

  server.addRequestHandler(
    'GET',
    `${sessionUrl}/${sessionId}/messages/0`,
    messageResponse,
  );

  return { onMessagesRead };
};

export const waitSessionsLoaded = async (queryByText: RenderResult['queryByText']) => {
  await waitForData(/Loading sessions/i, queryByText);
  await waitForData(/Loading messages/i, queryByText);
};
