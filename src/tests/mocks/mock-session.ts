import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { DEFAULT_AUTH_RESPONSE } from 'airdcpp-apisocket/tests';
import { vi } from 'vitest';
import { MockServer } from './mock-server';
import { waitForData } from '../helpers/test-helpers';
import { RenderResult } from '@testing-library/react';
import { SearchHintedUser1Response, SearchNicksHubUser1Response } from './api/user';
import UserConstants from '@/constants/UserConstants';

export const DEFAULT_MOCK_PERMISSIONS = [API.AccessEnum.ADMIN];
export const DEFAULT_PLATFORM = API.PlatformEnum.LINUX;

export const getMockSession = (
  permissions = DEFAULT_MOCK_PERMISSIONS,
  platform = DEFAULT_PLATFORM,
): UI.AuthenticatedSession => ({
  system_info: {
    ...DEFAULT_AUTH_RESPONSE.system_info,
    api_feature_level: 9,
    platform,
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

export const waitMessageSessionsLoaded = async (
  queryByText: RenderResult['queryByText'],
) => {
  await waitForData(/Loading sessions/i, queryByText);
  await waitForData(/Loading messages/i, queryByText);
};

export const waitSessionsLoaded = async (queryByText: RenderResult['queryByText']) => {
  await waitForData(/Loading sessions/i, queryByText);
};

export const installBasicSessionHandlers = (
  sessionUrl: string,
  id: API.IdType,
  server: MockServer,
) => {
  const onSessionRead = vi.fn();
  server.addRequestHandler('POST', `${sessionUrl}/${id}/read`, undefined, onSessionRead);

  return { onSessionRead };
};

export const installUserSearchFieldMocks = (server: MockServer) => {
  server.addRequestHandler(
    'POST',
    UserConstants.SEARCH_HINTED_USER_URL,
    SearchHintedUser1Response,
  );

  server.addRequestHandler(
    'POST',
    UserConstants.SEARCH_NICKS_URL,
    SearchNicksHubUser1Response,
  );
};
