import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import FormattedIp from 'components/format/FormattedIp';

import SearchConstants from 'constants/SearchConstants';

import { UserMenu } from 'components/action-menu';
import { UserFileActions } from 'actions/ui/user/UserActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import MenuConstants from 'constants/MenuConstants';
import { useFormatter } from 'context/FormatterContext';

interface UserResultProps {
  result: API.ChildSearchResult;
}

const UserResult: React.FC<UserResultProps> = ({ result }) => {
  const { formatConnection } = useFormatter();
  return (
    <tr>
      <td className="user dropdown">
        <UserMenu
          userIcon={true}
          user={result.user}
          directory={result.path}
          ids={UserFileActions}
          contextElement=".ui.modal > .content"
          remoteMenuId={MenuConstants.HINTED_USER}
        />
      </td>
      <td className="hubs">{result.user.hub_names}</td>
      <td className="connection">{formatConnection(result.connection)}</td>
      <td className="slots">{result.slots.str}</td>
      <td className="ip">
        <FormattedIp item={result.ip} />
      </td>
      <td className="path" title={result.path}>
        {result.path}
      </td>
    </tr>
  );
};

const resultSort = (a: API.ChildSearchResult, b: API.ChildSearchResult) =>
  a.user.nicks.localeCompare(b.user.nicks);

interface UserResultTableProps {
  parentResult: API.GroupedSearchResult;
  instanceId: number;
}

interface UserResultTableDataProps extends DataProviderDecoratorChildProps {
  results: API.ChildSearchResult[];
}

const UserResultTable: React.FC<UserResultTableProps & UserResultTableDataProps> = ({
  results,
}) => {
  const { t } = useTranslation();
  return (
    <div className="users">
      <h2>
        {t(toI18nKey('usersCount', UI.Modules.SEARCH), {
          defaultValue: 'User ({{count}})',
          defaultValue_plural: 'Users ({{count}})',
          count: results.length,
        })}
      </h2>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{translate('User', t, UI.Modules.SEARCH)}</th>
            <th>{translate('Hubs', t, UI.Modules.SEARCH)}</th>
            <th style={{ width: '70px' }}>
              {translate('Connection', t, UI.Modules.SEARCH)}
            </th>
            <th style={{ width: '50px' }}>{translate('Slots', t, UI.Modules.SEARCH)}</th>
            <th>{translate('IP', t, UI.Modules.SEARCH)}</th>
            <th>{translate('Path', t, UI.Modules.SEARCH)}</th>
          </tr>
        </thead>
        <tbody>
          {results.sort(resultSort).map((result) => (
            <UserResult key={result.user.cid} result={result} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataProviderDecorator<UserResultTableProps, UserResultTableDataProps>(
  UserResultTable,
  {
    urls: {
      results: ({ parentResult, instanceId }, socket) =>
        socket.get(
          `${SearchConstants.INSTANCES_URL}/${instanceId}/results/${parentResult.id}/children`,
        ),
    },
  },
);
