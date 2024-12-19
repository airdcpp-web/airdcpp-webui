import { useMemo, useRef } from 'react';
import RouteModal from 'components/semantic/RouteModal';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import IconConstants from 'constants/IconConstants';

import Form, { FormFieldSettingHandler, FormSaveHandler } from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translateForm } from 'utils/FormUtils';
import SearchConstants from 'constants/SearchConstants';

const Entry: UI.FormFieldDefinition[] = [
  {
    key: 'name',
    title: 'Name',
    type: API.SettingTypeEnum.STRING,
  },
  {
    key: 'extensions',
    title: 'File extensions',
    type: API.SettingTypeEnum.LIST,
    item_type: API.SettingTypeEnum.STRING,
  },
];

export interface SearchTypeDialogProps {
  moduleT: UI.ModuleTranslator;
}

interface Entry extends API.SearchType, UI.FormValueMap {}

export interface DataProps extends DataProviderDecoratorChildProps {
  searchTypeEntry?: API.SearchType;
}

type Props = SearchTypeDialogProps & DataProps & ModalRouteDecoratorChildProps;

const SearchTypeDialog: React.FC<Props> = ({
  moduleT,
  searchTypeEntry,
  location,
  socket,
  ...other
}) => {
  const isNew = !searchTypeEntry;

  const formRef = useRef<Form<Entry>>(null);
  const definitions = useMemo(() => translateForm(Entry, moduleT), []);

  const handleSave = () => {
    return formRef.current!.save();
  };

  const onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (isNew) {
      return socket.post(SearchConstants.SEARCH_TYPES_URL, changedFields);
    }

    return socket.patch(
      `${SearchConstants.SEARCH_TYPES_URL}/${searchTypeEntry!.id}`,
      changedFields,
    );
  };

  const onFieldSetting: FormFieldSettingHandler<Entry> = (
    id,
    fieldOptions,
    formValue,
  ) => {
    if (id === 'name') {
      fieldOptions.disabled = !!searchTypeEntry && searchTypeEntry.default_type;
    }
  };

  const title = moduleT.translate(isNew ? 'Add search type' : 'Edit search type');
  return (
    <RouteModal
      className="search-type"
      title={title}
      onApprove={handleSave}
      closable={false}
      icon={IconConstants.FOLDER}
      {...other}
    >
      <Form<Entry>
        ref={formRef}
        fieldDefinitions={definitions}
        onFieldSetting={onFieldSetting}
        onSave={onSave}
        sourceValue={searchTypeEntry as Entry}
        location={location}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<SearchTypeDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(SearchTypeDialog, {
    urls: {
      searchTypeEntry: ({ params }, socket) => {
        if (!params.searchTypeId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${SearchConstants.SEARCH_TYPES_URL}/${params.searchTypeId}`);
      },
    },
  }),
  'types/:searchTypeId?',
);
