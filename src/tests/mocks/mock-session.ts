import { hasAccess } from '@/stores/reflux/LoginStore';
import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { DEFAULT_AUTH_RESPONSE } from 'airdcpp-apisocket/tests';

export const DEFAULT_MOCK_PERMISSIONS = [API.AccessEnum.ADMIN];

export const getMockSession = (
  permissions = DEFAULT_MOCK_PERMISSIONS,
): UI.AuthenticatedSession => ({
  systemInfo: {
    ...DEFAULT_AUTH_RESPONSE.system,
    api_version: 1,
    api_feature_level: 9,
    client_version: '2.13.2',
    client_started: 252352355,
  } as API.SystemInfo,
  user: {
    ...(DEFAULT_AUTH_RESPONSE.user as API.LoginUser),
    permissions,
  },
  authToken: DEFAULT_AUTH_RESPONSE.auth_token,
  sessionId: 4,

  hasAccess: (access: API.AccessEnum) => {
    return hasAccess(permissions, access);
  },
});
