import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';

import HashDatabaseLayout from '@/routes/Settings/routes/Sharing/components/HashDatabaseLayout';
import { SettingPageProps } from '@/routes/Settings/types';

import * as API from '@/types/api';

import { hasAccess } from '@/utils/AuthUtils';
import { useSession } from '@/context/AppStoreContext';

const Entry = ['max_hash_speed', 'max_total_hashers', 'max_volume_hashers'];

const HashingPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const session = useSession();
  return (
    <div>
      <RemoteSettingForm keys={Entry} />

      {hasAccess(session, API.AccessEnum.SHARE_VIEW) && (
        <HashDatabaseLayout moduleT={moduleT} />
      )}
    </div>
  );
};

export default HashingPage;
