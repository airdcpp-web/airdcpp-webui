import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { DEFAULT_AUTH_RESPONSE } from 'airdcpp-apisocket/tests';

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
