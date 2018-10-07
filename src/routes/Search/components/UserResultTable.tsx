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
import { ModalRouteCloseContext } from 'decorators/ModalRouteDecorator';


//import { OnClickActionHandler } from 'decorators/menu/ActionMenuDecorator';


/*const OnClickUserAction: OnClickActionHandler = (actionId) => {
  if (actionId === 'browse' || actionId === 'message') {
    close();
  }
};*/

const isSidebarAction = (actionId: string) => actionId === 'browse' || actionId === 'message';

const UserResult: React.SFC<{ result: API.ChildSearchResult; }> = ({ result }) => (
  <tr>
    <td className="user dropdown">
      <ModalRouteCloseContext.Consumer>
        { close => (
          <UserMenu 
            userIcon={ true }
            user={ result.user }
            directory={ result.path }
            ids={ UserFileActions }
            contextElement=".result.modal"
            onClickAction={ (actionId) => isSidebarAction(actionId) ? close() : undefined  }
          />
        ) }
      </ModalRouteCloseContext.Consumer>
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

const UserResultTable: React.SFC<UserResultTableProps & UserResultTableDataProps> = (
  { results, dataError }
) => {
  if (dataError) {
    return (
      <Message 
        title="Failed to load user listing"
        icon={ IconConstants.ERROR }
        description={ dataError.message }
      />
    );
  }

  return (
    <div className="users">
      <h2>{ 'Users (' + results.length + ')' }</h2>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>User</th>
            <th>Hubs</th>
            <th>Connection</th>
            <th>Slots</th>
            <th>IP</th>
            <th>Path</th>
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