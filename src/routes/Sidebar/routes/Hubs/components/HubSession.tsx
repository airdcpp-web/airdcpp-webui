import { useEffect, useState } from 'react';

import { loadSessionProperty, saveSessionProperty } from '@/utils/BrowserUtils';
import Checkbox from '@/components/semantic/Checkbox';

import ChatLayout from '@/routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from '@/routes/Sidebar/routes/Hubs/components/HubUserTable';

import HubFooter from '@/routes/Sidebar/routes/Hubs/components/HubFooter';
import {
  RedirectPrompt,
  PasswordPrompt,
  HubActionPrompt,
} from '@/routes/Sidebar/routes/Hubs/components/HubPrompt';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useSocket } from '@/context/SocketContext';
import { shareTempFile } from '@/services/api/ShareApi';
import IconConstants from '@/constants/IconConstants';
import MenuConstants from '@/constants/MenuConstants';
import { SessionChildProps } from '@/routes/Sidebar/components/types';

import { useSession } from '@/context/AppStoreContext';
import { HubAPIActions } from '@/actions/store/HubActions';
import { buildChatCommands } from '@/routes/Sidebar/components/chat/commands/ChatCommands';
import { clearHubChatMessages } from '@/services/api/HubApi';
import { HubStoreSelector } from '@/stores/session/hubSessionSlice';

import '../style.css';

const getStorageKey = (sessionId: number) => {
  return `view_userlist_${sessionId}`;
};

const checkList = (sessionId: number) => {
  const value = loadSessionProperty(getStorageKey(sessionId), false);
  return value;
};

type HubSessionProps = SessionChildProps<API.Hub, UI.EmptyObject>;

const HubChatCommands = buildChatCommands(API.AccessEnum.HUBS_EDIT, clearHubChatMessages);

const HubSession: React.FC<HubSessionProps> = ({ sessionItem, sessionT }) => {
  const [showList, setShowList] = useState(checkList(sessionItem.id));
  const login = useSession();
  const socket = useSocket();

  const toggleListState = () => {
    setShowList(!showList);
    return !showList;
  };

  useEffect(() => {
    setShowList(checkList(sessionItem.id));
  }, [sessionItem.id]);

  const getMessage = () => {
    const connectState = sessionItem.connect_state.id;

    if (connectState === API.HubConnectStateEnum.PASSWORD) {
      return (
        <HubActionPrompt
          title={sessionT.translate('Password required')}
          icon={IconConstants.LOCK}
          content={
            <PasswordPrompt hub={sessionItem} sessionT={sessionT} socket={socket} />
          }
        />
      );
    }

    if (connectState === API.HubConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt
          title={sessionT.translate('Redirect requested')}
          icon={IconConstants.REDIRECT}
          content={
            <RedirectPrompt hub={sessionItem} sessionT={sessionT} socket={socket} />
          }
        />
      );
    }

    return null;
  };

  const onClickUsers = () => {
    const newValue = toggleListState();
    saveSessionProperty(getStorageKey(sessionItem.id), newValue);
  };

  const handleFileUpload = (file: File) => {
    const { hub_url: hubUrl } = sessionItem;
    return shareTempFile({ file, hubUrl }, login, socket);
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
        <HubUserTable hub={sessionItem} sessionT={sessionT} />
      ) : (
        <ChatLayout
          storeSelector={HubStoreSelector}
          chatApi={HubAPIActions}
          chatCommands={HubChatCommands}
          chatAccess={API.AccessEnum.HUBS_SEND}
          chatSession={sessionItem}
          handleFileUpload={handleFileUpload}
          highlightRemoteMenuId={MenuConstants.HUB_MESSAGE_HIGHLIGHT}
          hubUrl={sessionItem.hub_url}
        />
      )}
      <HubFooter userlistToggle={checkbox} hub={sessionItem} sessionT={sessionT} />
    </div>
  );
};

export default HubSession;
