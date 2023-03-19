import { Component } from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import Message from 'components/semantic/Message';
import { Link } from 'react-router-dom';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { Trans } from 'react-i18next';
import { NewSessionLayoutProps } from 'routes/Sidebar/components/SessionLayout';
import IconConstants from 'constants/IconConstants';
import Button from 'components/semantic/Button';

class HubNew extends Component<NewSessionLayoutProps> {
  handleConnect = (hubUrl: string) => {
    HubActions.createSession(this.props.location, hubUrl, HubSessionStore);
  };

  hasSession = (entry: API.HistoryItem) => {
    return HubSessionStore.getSessionByUrl(entry.hub_url);
  };

  recentHubRender = (entry: API.HistoryItem) => {
    return <a onClick={(_) => this.handleConnect(entry.hub_url)}>{entry.name}</a>;
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
            <Trans i18nKey={sessionT.toI18nKey('favoriteHubsHint')}>
              Tip: visit the <Link to="/favorite-hubs">Favorite hubs</Link> page to
              connect using custom settings
            </Trans>
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
