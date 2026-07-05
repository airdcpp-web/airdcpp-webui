import { useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import LayoutHeader from '@/components/semantic/LayoutHeader';

import IconConstants from '@/constants/IconConstants';
import SearchConstants from '@/constants/SearchConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import {
  SocketSubscriptionDecorator,
  SocketSubscriptionDecoratorChildProps,
} from '@/decorators/SocketSubscriptionDecorator';

const MAX_EVENTS = 100;

interface SpyEvent extends API.IncomingSearch {
  key: number;
  time: Date;
}

type SearchSpyProps = SocketSubscriptionDecoratorChildProps;

const SearchSpy: React.FC<SearchSpyProps> = ({ addSocketListener }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<SpyEvent[]>([]);

  React.useEffect(() => {
    let keyCounter = 0;
    addSocketListener<API.IncomingSearch>(
      SearchConstants.MODULE_URL,
      SearchConstants.INCOMING_SEARCH,
      (data) => {
        if (!data) {
          return;
        }

        setEvents((prevEvents) => {
          const ret = [{ ...data, key: keyCounter++, time: new Date() }, ...prevEvents];
          if (ret.length > MAX_EVENTS) {
            ret.pop();
          }

          return ret;
        });
      },
      undefined,
      API.AccessEnum.SEARCH,
    );
  }, []);

  return (
    <div className="simple-layout">
      <div className="wrapper">
        <LayoutHeader
          icon={IconConstants.SEARCH}
          title={translate('Search spy', t, UI.Modules.SEARCH)}
        />
        <div className="ui divider top" />
        <div className="layout-content search-spy">
          {events.length === 0 ? (
            <div className="ui info message">
              {translate(
                'Incoming searches from other users will be displayed here',
                t,
                UI.Modules.SEARCH,
              )}
            </div>
          ) : (
            <table className="ui striped compact table">
              <thead>
                <tr>
                  <th>{translate('Time', t, UI.Modules.SEARCH)}</th>
                  <th>{translate('Search string', t, UI.Modules.SEARCH)}</th>
                  <th>{translate('Type', t, UI.Modules.SEARCH)}</th>
                  <th>{translate('User', t, UI.Modules.SEARCH)}</th>
                  <th>{translate('Hub', t, UI.Modules.SEARCH)}</th>
                  <th>{translate('Results', t, UI.Modules.SEARCH)}</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.key}>
                    <td>{event.time.toLocaleTimeString()}</td>
                    <td>{event.query.pattern}</td>
                    <td>{event.query.file_type}</td>
                    <td>{event.user ? event.user.nick : ''}</td>
                    <td>{event.hub.name}</td>
                    <td>{event.results.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocketSubscriptionDecorator(SearchSpy);
