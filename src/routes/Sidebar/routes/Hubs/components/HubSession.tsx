import { useEffect, useState } from 'react';

import HubMessageStore from 'stores/HubMessageStore';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';
import Checkbox from 'components/semantic/Checkbox';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from 'routes/Sidebar/routes/Hubs/components/HubUserTable';

import HubFooter from 'routes/Sidebar/routes/Hubs/components/HubFooter';
import {
  RedirectPrompt,
  PasswordPrompt,
  HubActionPrompt,
} from 'routes/Sidebar/routes/Hubs/components/HubPrompt';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { shareTempFile } from 'services/api/ShareApi';
import HubActions from 'actions/reflux/HubActions';
import IconConstants from 'constants/IconConstants';
import MenuConstants from 'constants/MenuConstants';
import { SessionChildProps } from 'routes/Sidebar/components/types';
import { useSession } from 'context/SessionContext';

const getStorageKey = (sessionId: number) => {
  return `view_userlist_${sessionId}`;
};

const checkList = (sessionId: number) => {
  const value = loadSessionProperty(getStorageKey(sessionId), false);
  return value;
};

type HubSessionProps = SessionChildProps<API.Hub, UI.EmptyObject, UI.ChatActionList>;

const HubSession: React.FC<HubSessionProps> = ({
  session,
  sessionApi,
  sessionT,
  uiActions,
}) => {
  const [showList, setShowList] = useState(checkList(session.id));
  const login = useSession();

  const toggleListState = () => {
    setShowList(!showList);
    return !showList;
  };

  useEffect(() => {
    setShowList(checkList(session.id));
  }, [session.id]);

  const getMessage = () => {
    const connectState = session.connect_state.id;

    if (connectState === API.HubConnectStateEnum.PASSWORD) {
      return (
        <HubActionPrompt
          title={sessionT.translate('Password required')}
          icon={IconConstants.LOCK}
          content={<PasswordPrompt hub={session} sessionT={sessionT} />}
        />
      );
    }

    if (connectState === API.HubConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt
          title={sessionT.translate('Redirect requested')}
          icon={IconConstants.REDIRECT}
          content={<RedirectPrompt hub={session} sessionT={sessionT} />}
        />
      );
    }

    return null;
  };

  const onClickUsers = () => {
    const newValue = toggleListState();
    saveSessionProperty(getStorageKey(session.id), newValue);
  };

  const handleFileUpload = (file: File) => {
    const { hub_url } = session;
    return shareTempFile(file, hub_url, undefined, login);
  };

  const checkbox = (
    <Checkbox
      id="userlist-toggle"
      type="toggle"
      caption={sessionT.translate('User list')}
      onChange={onClickUsers}
      checked={showList}
    />
  );

  return (
    <div className="hub chat session">
      {getMessage()}
      {showList ? (
        <HubUserTable session={session} sessionT={sessionT} />
      ) : (
        <ChatLayout
          messageStore={HubMessageStore}
          chatApi={HubActions as UI.ChatAPI}
          sessionApi={sessionApi}
          chatActions={uiActions}
          chatAccess={API.AccessEnum.HUBS_SEND}
          session={session}
          handleFileUpload={handleFileUpload}
          highlightRemoteMenuId={MenuConstants.HUB_MESSAGE_HIGHLIGHT}
          hubUrl={session.hub_url}
        />
      )}
      <HubFooter userlistToggle={checkbox} session={session} sessionT={sessionT} />
    </div>
  );
};

export default HubSession;
