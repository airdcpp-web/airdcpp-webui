import { Component } from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';

import SocketService from 'services/SocketService';

import ShareProfileDecorator, {
  profileToEnumValue,
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
  entry: RecursivePartial<Entry>
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
  !!hubUrl && (hubUrl.indexOf('adc://') === 0 || hubUrl.indexOf('adcs://') === 0);

// Get selection values for the profiles field
const getFieldProfiles = (
  profiles: API.SettingEnumOption[],
  url?: string
): UI.FormOption[] => {
  return profiles
    .filter((p) => isAdcHub(url) || p.id === ShareProfileConstants.HIDDEN_PROFILE_ID)
    .map(profileToEnumValue)
    .map(normalizeEnumValue);
};

interface FavoriteHubDialogProps {
  favT: UI.ModuleTranslator;
}

interface DataProps {
  hubEntry?: API.FavoriteHubEntry;
}

/*interface RouteProps {
  entryId: string;
}*/

type Props = FavoriteHubDialogProps &
  DataProps &
  ShareProfileDecoratorChildProps &
  ModalRouteDecoratorChildProps;

class FavoriteHubDialog extends Component<Props> {
  static displayName = 'FavoriteHubDialog';

  formValue: Entry | undefined;

  constructor(props: Props) {
    super(props);

    this.formValue = toFormEntry(props.hubEntry);
    this.definitions = translateForm(Fields, props.favT);
    this.nullOption = {
      value: 'null',
      text: props.favT.translate('Global default'),
    };
  }

  isNew = () => {
    return !this.props.hubEntry;
  };

  nullOption: UI.FormOption<string>;
  definitions: UI.FormFieldDefinition[];

  form: Form<Entry>;

  onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
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

  save = () => {
    return this.form.save();
  };

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    const hubEntry = toFavoriteHub(changedFields);
    if (this.isNew()) {
      return SocketService.post(FavoriteHubConstants.HUBS_URL, hubEntry);
    }

    return SocketService.patch(
      `${FavoriteHubConstants.HUBS_URL}/${this.props.hubEntry!.id}`,
      hubEntry
    );
  };

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'share_profile') {
      const hubUrl = formValue.generic ? formValue.generic.hub_url : undefined;

      // Since the options are added dynamically based on the URL protocol, they must be
      // normalized to use the tcomb format
      Object.assign(fieldOptions, {
        nullOption: this.nullOption,
        factory: t.form.Select,
        options: getFieldProfiles(this.props.profiles, hubUrl),
        transformer: intTransformer,
      });
    } else if (id === 'connection_mode_v4' || id === 'connection_mode_v6') {
      Object.assign(fieldOptions, {
        nullOption: this.nullOption,
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

  render() {
    const { translate } = this.props.favT;
    const title = translate(this.isNew() ? 'Add favorite hub' : 'Edit favorite hub');
    return (
      <Modal
        className="fav-hub"
        title={title}
        onApprove={this.save}
        closable={false}
        icon={IconConstants.FAVORITE}
        {...this.props}
      >
        <Form<Entry>
          ref={(c) => (this.form = c!)}
          onFieldChanged={this.onFieldChanged}
          onFieldSetting={this.onFieldSetting}
          onSave={this.onSave}
          fieldDefinitions={this.definitions}
          sourceValue={this.formValue}
          location={this.props.location}
        />
      </Modal>
    );
  }
}

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
  'entries/:entryId?'
);
