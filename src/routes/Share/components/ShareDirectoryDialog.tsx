import { useMemo, useRef } from 'react';
import RouteModal from 'components/semantic/RouteModal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from 'decorators/ShareProfileDecorator';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

import { getLastDirectory } from 'utils/FileUtils';

import Form, {
  FormSaveHandler,
  FormFieldSettingHandler,
  FormFieldChangeHandler,
} from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import { AutoSuggestField } from 'components/form/fields';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ShareRootEntryBase } from 'types/api';
import { translateForm } from 'utils/FormUtils';
import { Trans } from 'react-i18next';
import { profileToEnumValue } from 'utils/ShareProfileUtils';
import { useFormatter } from 'context/FormatterContext';

const Fields: UI.FormFieldDefinition[] = [
  {
    key: 'path',
    title: 'Path',
    type: API.SettingTypeEnum.DIRECTORY_PATH,
  },
  {
    key: 'virtual_name',
    title: 'Virtual name',
    type: API.SettingTypeEnum.STRING,
    help: 'Directories with identical virtual names will be merged in filelist',
  },
  {
    key: 'profiles',
    type: API.SettingTypeEnum.LIST,
    item_type: API.SettingTypeEnum.NUMBER,
    title: 'Share profiles',
    help: 'New share profiles can be created from application settings',
  },
  {
    key: 'incoming',
    title: 'Incoming',
    type: API.SettingTypeEnum.BOOLEAN,
  },
];

export interface ShareDirectoryDialogProps {
  shareT: UI.ModuleTranslator;
}

export interface DataProps extends ShareProfileDecoratorChildProps {
  virtualNames: string[];
  rootEntry?: API.ShareRootEntryBase;
}

interface Entry extends ShareRootEntryBase, UI.FormValueMap {}

type Props = ShareDirectoryDialogProps & DataProps & ModalRouteDecoratorChildProps;

const ShareDirectoryDialog: React.FC<Props> = ({
  shareT,
  profiles,
  rootEntry,
  socket,
  virtualNames,
  location,
  ...other
}) => {
  const formatter = useFormatter();

  const fieldDefinitions = useMemo<UI.FormFieldDefinition[]>(() => {
    const defs = translateForm(Fields, shareT);

    const shareProfileDefinitions = defs.find((def) => def.key === 'profiles')!;
    Object.assign(shareProfileDefinitions, {
      options: profiles.map((p) => profileToEnumValue(p, formatter)),
      default_value: [profiles.find((profile) => profile.default)!.id],
    });

    return defs;
  }, []);
  const formRef = useRef<Form<Entry>>(null);

  const isNew = !rootEntry;

  const onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
    if (id.includes('path')) {
      const mergeFields = {
        virtual_name: !!value.path ? getLastDirectory(value.path) : undefined,
      };

      return Promise.resolve(mergeFields);
    }

    return null;
  };

  const handleSave = () => {
    return formRef.current!.save();
  };

  const onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (isNew) {
      return socket.post(ShareRootConstants.ROOTS_URL, changedFields);
    }

    return socket.patch(`${ShareRootConstants.ROOTS_URL}/${rootEntry.id}`, changedFields);
  };

  const onFieldSetting: FormFieldSettingHandler<Entry> = (
    id,
    fieldOptions,
    formValue,
  ) => {
    if (id === 'path') {
      fieldOptions.disabled = !isNew;
      fieldOptions.config = {
        ...(fieldOptions.config || {}),
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      };
    } else if (id === 'virtual_name') {
      fieldOptions.factory = t.form.Textbox;
      fieldOptions.template = AutoSuggestField;
      fieldOptions.config = {
        suggestionGetter: () => virtualNames,
      };
    }
  };

  const title = shareT.translate(isNew ? 'Add share directory' : 'Edit share directory');
  return (
    <RouteModal
      className="share-directory"
      title={title}
      onApprove={handleSave}
      closable={false}
      icon={IconConstants.FOLDER}
      {...other}
    >
      <Message
        title={shareT.translate('Hashing information')}
        icon={IconConstants.INFO}
        description={
          <Trans i18nKey={shareT.toI18nKey('hashingInformationDesc')}>
            <p>
              New files will appear in share only after they have finished hashing (the
              client has calculated checksums for them). Information about hashing
              progress will be posted to the event log.
            </p>
          </Trans>
        }
      />
      <Form<Entry>
        ref={formRef}
        fieldDefinitions={fieldDefinitions}
        onFieldChanged={onFieldChanged}
        onFieldSetting={onFieldSetting}
        onSave={onSave}
        sourceValue={rootEntry as Entry}
        location={location}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<ShareDirectoryDialogProps>(
  ShareProfileDecorator<Omit<Props, keyof DataProps>>(ShareDirectoryDialog, false, {
    urls: {
      virtualNames: ShareConstants.GROUPED_ROOTS_GET_URL,
      rootEntry: ({ params }, socket) => {
        if (!params.directoryId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${ShareRootConstants.ROOTS_URL}/${params.directoryId}`);
      },
    },
    dataConverters: {
      virtualNames: (data: API.GroupedPath[]) => data.map((item) => item.name, []),
    },
  }),
  '/directories/:directoryId?',
);
