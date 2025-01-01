import { useMemo, useRef } from 'react';
import RouteModal from 'components/semantic/RouteModal';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import t from 'utils/tcomb-form';

import { getLastDirectory } from 'utils/FileUtils';

import Form, {
  FormFieldChangeHandler,
  FormSaveHandler,
  FormFieldSettingHandler,
} from 'components/form';
import { AutoSuggestField } from 'components/form/fields';

import FilesystemConstants from 'constants/FilesystemConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { translateForm } from 'utils/FormUtils';

const Entry: UI.FormFieldDefinition[] = [
  {
    key: 'path',
    title: 'Path',
    type: API.SettingTypeEnum.DIRECTORY_PATH,
  },
  {
    key: 'name',
    title: 'Name',
    type: API.SettingTypeEnum.STRING,
  },
];

export interface FavoriteDirectoryDialogProps {
  moduleT: UI.ModuleTranslator;
}

interface Entry extends API.FavoriteDirectoryEntryBase, UI.FormValueMap {}

export interface DataProps extends DataProviderDecoratorChildProps {
  virtualNames: string[];
  directoryEntry?: API.FavoriteDirectoryEntryBase;
}

type Props = FavoriteDirectoryDialogProps & DataProps & ModalRouteDecoratorChildProps;

const FavoriteDirectoryDialog: React.FC<Props> = ({
  directoryEntry,
  moduleT,
  virtualNames,
  socket,
}) => {
  const formRef = useRef<Form<Entry>>(null);
  const fieldDefinitions = useMemo(() => translateForm(Entry, moduleT), []);

  const isNew = !directoryEntry;

  const onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
    if (id.includes('path')) {
      return Promise.resolve({
        name: !!value.path ? getLastDirectory(value.path) : undefined,
      });
    }

    return null;
  };

  const handleSave = () => {
    return formRef.current!.save();
  };

  const onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (isNew) {
      return socket.post(FavoriteDirectoryConstants.DIRECTORIES_URL, changedFields);
    }

    return socket.patch(
      `${FavoriteDirectoryConstants.DIRECTORIES_URL}/${directoryEntry.id}`,
      changedFields,
    );
  };

  const onFieldSetting: FormFieldSettingHandler<Entry> = (
    id,
    fieldOptions,
    formValue,
  ) => {
    if (id === 'path') {
      fieldOptions.disabled = !isNew;
      fieldOptions.config = Object.assign(fieldOptions.config || {}, {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'name') {
      fieldOptions.factory = t.form.Textbox;
      fieldOptions.template = AutoSuggestField;
      fieldOptions.config = {
        suggestionGetter: () => virtualNames,
      };
    }
  };

  const title = moduleT.translate(
    isNew ? 'Add favorite directory' : 'Edit favorite directory',
  );

  return (
    <RouteModal
      className="favorite-directory"
      title={title}
      onApprove={handleSave}
      closable={false}
      icon={IconConstants.FOLDER}
    >
      <Form<Entry>
        ref={formRef}
        fieldDefinitions={fieldDefinitions}
        onFieldChanged={onFieldChanged}
        onFieldSetting={onFieldSetting}
        onSave={onSave}
        sourceValue={directoryEntry as Entry}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<FavoriteDirectoryDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(
    FavoriteDirectoryDialog,
    {
      urls: {
        virtualNames: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
        directoryEntry: ({ params }, socket) => {
          if (!params.directoryId) {
            return Promise.resolve(undefined);
          }

          return socket.get(
            `${FavoriteDirectoryConstants.DIRECTORIES_URL}/${params.directoryId}`,
          );
        },
      },
      dataConverters: {
        virtualNames: (data: API.GroupedPath[]) => data.map((item) => item.name, []),
      },
    },
  ),
  'directories/:directoryId?',
);
