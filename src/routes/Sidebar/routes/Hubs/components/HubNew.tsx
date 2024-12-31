import { Component } from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import Message from 'components/semantic/Message';
import { Link } from 'react-router';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { Trans } from 'react-i18next';
import IconConstants from 'constants/IconConstants';
import Button from 'components/semantic/Button';
import { NewSessionLayoutProps } from 'routes/Sidebar/components/types';
import LinkButton from 'components/semantic/LinkButton';

class HubNew extends Component<NewSessionLayoutProps> {
  handleConnect = (hubUrl: string) => {
    const { location, navigate } = this.props;
    HubActions.createSession(hubUrl, {
      sessionStore: HubSessionStore,
      location,
      navigate,
    });
  };

  hasSession = (entry: API.HistoryItem) => {
    return HubSessionStore.getSessionByUrl(entry.hub_url);
  };

  recentHubRender = (entry: API.HistoryItem) => {
    return (
      <LinkButton
        onClick={(_) => this.handleConnect(entry.hub_url)}
        caption={entry.name}
      />
    );
  };

  render() {
    const { sessionT } = this.props;
    return (
      <div className="hub session new">
        <HubSearchInput
          submitHandler={this.handleConnect}
          button={
            <Button
              icon={IconConstants.CONNECT}
              caption={sessionT.translate('Connect')}
            />
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
          hasSession={this.hasSession}
          entryTitleRenderer={this.recentHubRender}
          entryIcon="sitemap"
        />
      </div>
    );
  }
}

export default HubNew;
