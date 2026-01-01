import * as React from 'react';

import { Params } from 'react-router';

import { TextDecorator } from '@/components/text';

import SessionLayout from '@/routes/Sidebar/components/SessionLayout';

import { hubOnlineStatusToColor } from '@/utils/TypeConvert';

import HubSession from '@/routes/Sidebar/routes/Hubs/components/HubSession';
import HubNew from '@/routes/Sidebar/routes/Hubs/components/HubNew';
import HubIcon from '@/components/icon/HubIcon';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import {
  SessionProviderDecorator,
  SessionProviderDecoratorChildProps,
} from '@/routes/Sidebar/decorators/SessionProviderDecorator';
import IconConstants from '@/constants/IconConstants';
import { HubActionMenu } from '@/actions/ui/hub';
import { HubAPIActions } from '@/actions/store/HubActions';
import { HubStoreSelector } from '@/stores/session/hubSessionSlice';
import MenuConstants from '@/constants/MenuConstants';

const ItemHandler: UI.SessionInfoGetter<API.Hub> = {
  itemNameGetter(session) {
    return session.identity.name;
  },

  itemStatusGetter(session) {
    return hubOnlineStatusToColor(session.connect_state.id);
  },

  itemHeaderDescriptionGetter(session) {
    return <TextDecorator text={session.identity.description} emojify={true} />;
  },

  itemHeaderIconGetter(session) {
    return <HubIcon hub={session} />;
  },
};

const parseNumericId = (params: Readonly<Params<string>>) => {
  if (!params.id) {
    return undefined;
  }

  return Number.parseInt(params['id']);
};
const sessionActions = ['reconnect', 'clearChat', 'favorite'];

const Hubs: React.FC<SessionProviderDecoratorChildProps<API.Hub>> = (props) => {
  const { params, sessionT, ...other } = props;
  return (
    <SessionLayout
      activeId={parseNumericId(params)}
      baseUrl="hubs"
      newCaption={sessionT.t('new', 'Connect')}
      newDescription={sessionT.t('newDesc', 'Connect to a new hub')}
      newIcon={IconConstants.HUBS_PLAIN}
      editAccess={API.AccessEnum.HUBS_EDIT}
      uiActions={HubActionMenu}
      actionIds={sessionActions}
      sessionApi={HubAPIActions}
      sessionItemLayout={HubSession}
      newLayout={HubNew}
      sessionT={sessionT}
      sessionStoreSelector={HubStoreSelector}
      remoteMenuId={MenuConstants.HUB}
      {...ItemHandler}
      {...other}
    />
  );
};

export default SessionProviderDecorator(Hubs, HubStoreSelector, UI.Modules.HUBS);
