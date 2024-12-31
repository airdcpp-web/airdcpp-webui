import * as React from 'react';
import t from 'utils/tcomb-form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import SearchConstants from 'constants/SearchConstants';
import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import { SearchTypeIcon } from 'components/icon/SearchTypeIcon';

type OnChangeHandler = (value: string | null) => void;

interface SearchTypeDropdownProps {
  onChange: OnChangeHandler;
  value: string | null;
  moduleT: UI.ModuleTranslator;
}

interface DataProps {
  searchTypes: API.SearchType[];
}

const getCommonItems = (moduleT: UI.ModuleTranslator): UI.SearchTypeItem[] => [
  {
    id: null,
    str: moduleT.translate('Any'),
  },
  {
    id: 'directory',
    str: moduleT.translate('Directory'),
  },
  {
    id: 'file',
    str: moduleT.translate('File'),
  },
];

const typeToMenuItem = (
  type: UI.SearchTypeItem,
  onChange: OnChangeHandler,
  selectedItem: UI.SearchTypeItem,
) => (
  <MenuItemLink
    key={type.id ?? SearchConstants.DEFAULT_SEARCH_TYPE}
    onClick={() => onChange(type.id)}
    icon={<SearchTypeIcon type={type} />}
    active={selectedItem.id === type.id}
  >
    {type.str}
  </MenuItemLink>
);

type Props = SearchTypeDropdownProps & DataProviderDecoratorChildProps & DataProps;

const SearchTypeDropdown: React.FC<Props> = ({
  searchTypes,
  value,
  onChange,
  moduleT,
}) => {
  const commonItems = getCommonItems(moduleT);
  const selectedItem =
    searchTypes.find((i) => value === i.id) ||
    commonItems.find((i) => value === i.id) ||
    commonItems[0];
  return (
    <Dropdown
      selection={true}
      caption={
        <>
          <SearchTypeIcon type={selectedItem} size="" />
          {selectedItem.str}
        </>
      }
    >
      {commonItems.map((type) => typeToMenuItem(type, onChange, selectedItem))}
      <div key="divider" className="ui divider" />
      {searchTypes.map((type) => typeToMenuItem(type, onChange, selectedItem))}
    </Dropdown>
  );
};

const SearchTypeDropdownDecorated = DataProviderDecorator<
  SearchTypeDropdownProps,
  DataProps
>(SearchTypeDropdown, {
  urls: {
    searchTypes: SearchConstants.SEARCH_TYPES_URL,
  },
});

type TCombTemplate = {
  renderSelect: (locals: UI.FormLocals<any, string>) => React.ReactNode;
};

const FileTypeField: TCombTemplate = {
  renderSelect(locals) {
    return (
      <SearchTypeDropdownDecorated
        onChange={locals.onChange}
        value={locals.value || null}
        moduleT={locals.context.formT}
      />
    );
  },
};

export default t.form.Form.templates.select.clone(FileTypeField);
