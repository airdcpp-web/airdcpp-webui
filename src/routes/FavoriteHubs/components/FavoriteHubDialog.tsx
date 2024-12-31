import { useMemo, useRef } from 'react';
import RouteModal from 'components/semantic/RouteModal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from 'decorators/ShareProfileDecorator';
import IconConstants from 'constants/IconConstants';

import t from 'utils/tcomb-form';

import Form, {
  FormFieldChangeHandler,
  FormFieldSettingHandler,
  FormSaveHandler,
} from 'components/form/Form';
import { normalizeEnumValue, intTransformer, translateForm } from 'utils/FormUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { FavoriteHubEntry } from 'types/api';
import { IndeterminateCheckboxField } from 'components/form/fields/IndeterminateCheckboxField';
import { profileToEnumValue } from 'utils/ShareProfileUtils';
import { Formatter, useFormatter } from 'context/FormatterContext';

const ConnectivityModeOptions: API.SettingEnumOption[] = [
  {
    id: API.ConnectivityModeEnum.DISABLED,
    name: 'Disabled',
  },
  {
    id: API.ConnectivityModeEnum.ACTIVE_MODE,
    name: 'Active mode',
  },
  {
    id: API.ConnectivityModeEnum.PASSIVE_MODE,
    name: 'Passive mode',
  },
];

const Fields: UI.FormFieldDefinition[] = [
  {
    key: 'generic',
    title: 'Hub properties',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'name',
        title: 'Name',
        type: API.SettingTypeEnum.STRING,
      },
      {
        key: 'hub_url',
        title: 'Hub URL',
        type: API.SettingTypeEnum.STRING,
      },
      {
        key: 'hub_description',
        title: 'Hub description',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      },
      {
        key: 'share_profile',
        title: 'Share profile',
        type: API.SettingTypeEnum.NUMBER,
        // eslint-disable-next-line max-len
        help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
        optional: true,
      },
      {
        key: 'auto_connect',
        title: 'Auto connect',
        type: API.SettingTypeEnum.BOOLEAN,
      },
    ],
  },
  {
    key: 'user',
    title: 'User setting overrides',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'nick',
        title: 'Nick',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      },
      {
        key: 'user_description',
        title: 'User description',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      },
    ],
  },
  {
    key: 'connectivityV4',
    title: 'Connectivity setting overrides (IPv4)',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'connection_mode_v4',
        title: 'Connectivity mode',
        type: API.SettingTypeEnum.NUMBER,
        optional: true,
        options: ConnectivityModeOptions,
      },
      {
        key: 'connection_ip_v4',
        title: 'IP address',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      },
    ],
  },
  {
    key: 'connectivityV6',
    title: 'Connectivity setting overrides (IPv6)',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'connection_mode_v6',
        title: 'Connectivity mode',
        type: API.SettingTypeEnum.NUMBER,
        optional: true,
        options: ConnectivityModeOptions,
      },
      {
        key: 'connection_ip_v6',
        title: 'IP address',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      },
    ],
  },
  {
    key: 'misc',
    title: 'Miscellaneous overrides',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'use_main_chat_notify',
        title: 'Use chat notification',
        type: API.SettingTypeEnum.BOOLEAN,
        optional: true,
      },
      {
        key: 'show_joins',
        title: 'Show joins/parts',
        type: API.SettingTypeEnum.BOOLEAN,
        optional: true,
      },
      {
        key: 'away_message',
        title: 'Away message',
        type: API.SettingTypeEnum.TEXT,
        optional: true,
      },
    ],
  },
];

interface Entry extends UI.FormValueMap {
  generic: Pick<
    FavoriteHubEntry,
    'name' | 'hub_url' | 'hub_description' | 'auto_connect' | 'share_profile'
  >;
  user: Pick<FavoriteHubEntry, 'nick' | 'user_description'>;
  connectivityV4: Pick<FavoriteHubEntry, 'connection_mode_v4' | 'connection_ip_v4'>;
  connectivityV6: Pick<FavoriteHubEntry, 'connection_mode_v6' | 'connection_ip_v6'>;
  misc: Pick<FavoriteHubEntry, 'use_main_chat_notify' | 'show_joins' | 'away_message'>;
}

const toFormEntry = (entry?: API.FavoriteHubEntry): Entry | undefined => {
  if (!entry) {
    return undefined;
  }

  return {
    generic: entry,
    user: entry,
    connectivityV4: entry,
    connectivityV6: entry,
    misc: entry,
  };
};

const toFavoriteHub = (
  entry: RecursivePartial<Entry>,
): RecursivePartial<API.FavoriteHubEntry> => {
  return {
    ...entry.generic,
    ...entry.user,
    ...entry.connectivityV4,
    ...entry.connectivityV6,
    ...entry.misc,
  };
};

const isAdcHub = (hubUrl?: string) =>
  !!hubUrl && (hubUrl.startsWith('adc://') || hubUrl.startsWith('adcs://'));

// Get selection values for the profiles field
const getFieldProfiles = (
  profiles: API.ShareProfile[],
  url: string | undefined,
  formatter: Formatter,
): UI.FormOption[] => {
  return profiles
    .filter((p) => isAdcHub(url) || p.id === ShareProfileConstants.HIDDEN_PROFILE_ID)
    .map((p) => profileToEnumValue(p, formatter))
    .map(normalizeEnumValue);
};

interface FavoriteHubDialogProps {
  favT: UI.ModuleTranslator;
}

interface DataProps {
  hubEntry?: API.FavoriteHubEntry;
}

type Props = FavoriteHubDialogProps &
  DataProps &
  ShareProfileDecoratorChildProps &
  ModalRouteDecoratorChildProps;

const FavoriteHubDialog: React.FC<Props> = ({
  hubEntry,
  location,
  favT,
  profiles,
  socket,
}) => {
  const formatter = useFormatter();

  const formValue = useMemo<Entry | undefined>(() => toFormEntry(hubEntry), []);
  const formDefinitions = useMemo<UI.FormFieldDefinition[]>(
    () => translateForm(Fields, favT),
    [],
  );
  const nullOption = useMemo<UI.FormOption<string>>(
    () => ({
      value: 'null',
      text: favT.translate('Global default'),
    }),
    [],
  );

  const isNew = !hubEntry;

  const formRef = useRef<Form<Entry>>(null);

  const onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
    if (id.includes('hub_url')) {
      if (
        !isAdcHub(value.generic!.hub_url) &&
        value.share_profile !== ShareProfileConstants.HIDDEN_PROFILE_ID
      ) {
        // Reset share profile
        return Promise.resolve({
          share_profile: null,
        });
      }
    }

    return null;
  };

  const handleSave = () => {
    return formRef.current!.save();
  };

  const onSave: FormSaveHandler<Entry> = (changedFields) => {
    const updatedEntryFields = toFavoriteHub(changedFields);
    if (isNew) {
      return socket.post(FavoriteHubConstants.HUBS_URL, updatedEntryFields);
    }

    return socket.patch(
      `${FavoriteHubConstants.HUBS_URL}/${hubEntry.id}`,
      updatedEntryFields,
    );
  };

  const onFieldSetting: FormFieldSettingHandler<Entry> = (
    id,
    fieldOptions,
    formValue,
  ) => {
    if (id === 'share_profile') {
      const hubUrl = formValue.generic ? formValue.generic.hub_url : undefined;

      // Since the options are added dynamically based on the URL protocol, they must be
      // normalized to use the tcomb format
      Object.assign(fieldOptions, {
        nullOption,
        factory: t.form.Select,
        options: getFieldProfiles(profiles, hubUrl, formatter),
        transformer: intTransformer,
      });
    } else if (id === 'connection_mode_v4' || id === 'connection_mode_v6') {
      Object.assign(fieldOptions, {
        nullOption,
        transformer: intTransformer,
      });
    } else if (id === 'use_main_chat_notify' || id === 'show_joins') {
      Object.assign(fieldOptions, {
        template: IndeterminateCheckboxField,
        transformer: {
          format: (value: boolean | null) => (value === undefined ? null : value),
          parse: (value: boolean | null) => value,
        },
      });
    }
  };

  const { translate } = favT;
  const title = translate(isNew ? 'Add favorite hub' : 'Edit favorite hub');
  return (
    <RouteModal
      className="fav-hub"
      title={title}
      onApprove={handleSave}
      closable={false}
      icon={IconConstants.FAVORITE}
    >
      <Form<Entry>
        ref={formRef}
        onFieldChanged={onFieldChanged}
        onFieldSetting={onFieldSetting}
        onSave={onSave}
        fieldDefinitions={formDefinitions}
        sourceValue={formValue}
        location={location}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<FavoriteHubDialogProps>(
  ShareProfileDecorator(FavoriteHubDialog, true, {
    urls: {
      hubEntry: ({ params }, socket) => {
        if (!params.entryId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${FavoriteHubConstants.HUBS_URL}/${params.entryId}`);
      },
    },
  }),
  'entries/:entryId?',
);
