import HubSearchInput from '@/components/autosuggest/HubSearchInput';
import RecentLayout from '@/routes/Sidebar/components/RecentLayout';

import Message from '@/components/semantic/Message';
import { Link } from 'react-router';

import { HistoryEntryEnum } from '@/constants/HistoryConstants';

import * as API from '@/types/api';

import { Trans, useTranslation } from 'react-i18next';
import IconConstants from '@/constants/IconConstants';
import Button from '@/components/semantic/Button';
import { NewSessionLayoutProps } from '@/routes/Sidebar/components/types';
import LinkButton from '@/components/semantic/LinkButton';
import { HubAPIActions } from '@/actions/store/HubActions';
import { useSessionStore } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';

const HubNew: React.FC<NewSessionLayoutProps> = ({ sessionT, navigate }) => {
  const sessionStore = useSessionStore();
  const { t } = useTranslation();
  const socket = useSocket();

  const handleConnect = (hubUrl: string) => {
    HubAPIActions.createSession(
      { hubUrl },
      {
        sessionStore,
        navigate,
        t,
        socket,
      },
    );
  };

  const hasSession = (entry: API.HistoryItem) => {
    return !!sessionStore.hubs.getSessionByUrl(entry.hub_url);
  };

  const recentHubRender = (entry: API.HistoryItem) => {
    return (
      <LinkButton onClick={(_) => handleConnect(entry.hub_url)} caption={entry.name} />
    );
  };

  return (
    <div className="hub session new">
      <HubSearchInput
        submitHandler={handleConnect}
        button={
          <Button icon={IconConstants.CONNECT} caption={sessionT.translate('Connect')} />
        }
      />
      <Message
        description={
          <Trans
            i18nKey={sessionT.toI18nKey('favoriteHubsHint')}
            defaults="Tip: visit the <url>Favorite hubs</url> page to connect using custom settings"
            components={{
              url: <Link to="/favorite-hubs" />,
            }}
          />
        }
      />
      <RecentLayout
        entryType={HistoryEntryEnum.HUB}
        hasSession={hasSession}
        entryTitleRenderer={recentHubRender}
        entryIcon="sitemap"
      />
    </div>
  );
};

export default HubNew;
