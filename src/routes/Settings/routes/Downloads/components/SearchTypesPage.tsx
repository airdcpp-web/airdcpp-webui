import * as React from 'react';

import ActionButton from 'components/ActionButton';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/action-menu';

import * as API from 'types/api';
import * as UI from 'types/ui';

import SearchTypeActions from 'actions/ui/SearchTypeActions';
import SearchConstants from 'constants/SearchConstants';
import SearchTypeDialog from './SearchTypeDialog';
import { formatBoolean } from 'utils/ValueFormat';
import Message from 'components/semantic/Message';
import IconConstants from 'constants/IconConstants';

const Row: React.FC<{ type: API.SearchType; moduleT: UI.ModuleTranslator }> = ({
  type,
  moduleT,
}) => (
  <tr>
    <td className="name dropdown">
      <ActionMenu
        caption={<strong>{type.str}</strong>}
        actions={SearchTypeActions.edit}
        itemData={type}
        contextElement="#setting-scroll-context"
      />
    </td>
    <td className="extensions">{type.extensions.join(', ')}</td>
    <td className="default">{formatBoolean(type.default_type, moduleT.plainT)}</td>
  </tr>
);

const getRow = (type: API.SearchType, moduleT: UI.ModuleTranslator) => {
  return <Row key={type.id} type={type} moduleT={moduleT} />;
};

interface SearchTypesPageProps {
  moduleT: UI.ModuleTranslator;
}

interface DataProps extends DataProviderDecoratorChildProps {
  searchTypes: API.SearchType[];
}

type Props = SearchTypesPageProps & DataProps;

const SearchTypesPage: React.FC<Props> = ({ searchTypes, moduleT }) => (
  <div id="directory-table">
    <ActionButton actions={SearchTypeActions.create} actionId="create" />

    {searchTypes.length === 0 ? null : (
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{moduleT.translate('Name')}</th>
            <th>{moduleT.translate('File extensions')}</th>
            <th>{moduleT.translate('Default')}</th>
          </tr>
        </thead>
        <tbody>{searchTypes.map((type) => getRow(type, moduleT))}</tbody>
      </table>
    )}
    <Message
      icon={IconConstants.NOTE}
      description={moduleT.t(
        'searchTypesNote',
        // eslint-disable-next-line max-len
        'Note; Custom search types will only be applied to ADC hubs! On NMDC hubs, using a predefined search type will only search for a set of predefined, unconfigurable extensions; using a custom type will default to searching for any extension.',
      )}
    />
    <SearchTypeDialog moduleT={moduleT} />
  </div>
);

export default DataProviderDecorator<SearchTypesPageProps, DataProps>(SearchTypesPage, {
  urls: {
    searchTypes: SearchConstants.SEARCH_TYPES_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(
      SearchConstants.MODULE_URL,
      SearchConstants.SEARCH_TYPES_UPDATED,
      () => refetchData(),
    );
  },
});
