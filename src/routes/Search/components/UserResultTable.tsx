import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import FormattedIp from 'components/format/FormattedIp';
import { formatConnection } from 'utils/ValueFormat';

import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';
import SearchConstants from 'constants/SearchConstants';

import { UserMenu } from 'components/menu';
import { UserFileActions } from 'actions/UserActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';
//import { ModalRouteCloseContext } from 'decorators/ModalRouteDecorator';


//import { OnClickActionHandler } from 'decorators/menu/ActionMenuDecorator';


/*const OnClickUserAction: OnClickActionHandler = (actionId) => {
  if (actionId === 'browse' || actionId === 'message') {
    close();
  }
};*/

const UserResult: React.FC<{ result: API.ChildSearchResult; }> = ({ result }) => (
  <tr>
    <td className="user dropdown">
      <UserMenu 
        userIcon={ true }
        user={ result.user }
        directory={ result.path }
        ids={ UserFileActions }
        contextElement=".result.modal"
        //onClickAction={ (actionId) => isSidebarAction(actionId) ? close() : undefined  }
      />
    </td>
    <td className="hubs">
      { result.user.hub_names }
    </td>
    <td className="connection">
      { formatConnection(result.connection) }
    </td>
    <td className="slots">
      { result.slots.str }
    </td>
    <td className="ip">
      <FormattedIp item={ result.ip }/>
    </td>
    <td className="path">
      { result.path }
    </td>
  </tr>
);

const resultSort = (a: API.ChildSearchResult, b: API.ChildSearchResult) => a.user.nicks.localeCompare(b.user.nicks);

interface UserResultTableProps {
  parentResult: API.GroupedSearchResult;
}

interface UserResultTableDataProps extends DataProviderDecoratorChildProps {
  results: API.ChildSearchResult[];
}

const UserResultTable: React.FC<UserResultTableProps & UserResultTableDataProps> = (
  { results, dataError }
) => {
  const { t } = useTranslation();
  if (dataError) {
    return (
      <Message 
        title={ translate('Failed to load user listing', t, UI.Modules.SEARCH) }
        icon={ IconConstants.ERROR }
        description={ dataError.message }
      />
    );
  }

  return (
    <div className="users">
      <h2>
        { t(toI18nKey('usersCount', UI.Modules.SEARCH), { 
          defaultValue: 'User ({{count}})',
          defaultValue_plural: 'Users ({{count}})',
          count: results.length
        }) }
       </h2>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{ translate('User', t, UI.Modules.SEARCH) }</th>
            <th>{ translate('Hubs', t, UI.Modules.SEARCH) }</th>
            <th>{ translate('Connection', t, UI.Modules.SEARCH) }</th>
            <th>{ translate('Slots', t, UI.Modules.SEARCH) }</th>
            <th>{ translate('IP', t, UI.Modules.SEARCH) }</th>
            <th>{ translate('Path', t, UI.Modules.SEARCH) }</th>
          </tr>
        </thead>
        <tbody>
          { results.sort(resultSort).map(result => (
            <UserResult 
              key={ result.user.cid }
              result={ result }
            />
          )) }
        </tbody>
      </table>
    </div>
  );
};

export default DataProviderDecorator<UserResultTableProps, UserResultTableDataProps>(UserResultTable, {
  urls: {
    results: ({ parentResult }, socket) => socket.get(`${SearchConstants.RESULTS_URL}/${parentResult.id}/children`),
  },
  renderOnError: true,
});