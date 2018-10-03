import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';

import SocketService from 'services/SocketService';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';
import IconConstants from 'constants/IconConstants';

import t from 'utils/tcomb-form';

import Form, { FormFieldChangeHandler, FormFieldSettingHandler, FormSaveHandler } from 'components/form/Form';
import { normalizeEnumValue, intTransformer } from 'utils/FormUtils';
import { RouteComponentProps } from 'react-router';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { FavoriteHubEntry } from 'types/api';
import Entry from 'widgets/RSS/components/Entry';


const ConnectivityModeOptions: API.SettingEnumOption[] = [
  {
    id: API.ConnectivityModeEnum.DISABLED,
    name: 'Disabled'
  }, {
    id: API.ConnectivityModeEnum.ACTIVE_MODE,
    name: 'Active mode'
  }, {
    id: API.ConnectivityModeEnum.PASSIVE_MODE,
    name: 'Passive mode'
  }
];

const Fields: UI.FormFieldDefinition[] = [
  {
    key: 'generic',
    title: 'Hub properties',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'name',
        type: API.SettingTypeEnum.STRING,
      }, {
        key: 'hub_url',
        title: 'Hub URL',
        type: API.SettingTypeEnum.STRING,
      }, {
        key: 'hub_description',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      }, {
        key: 'share_profile',
        type: API.SettingTypeEnum.NUMBER,
        optional: true,
      }, {
        key: 'auto_connect',
        type: API.SettingTypeEnum.BOOLEAN,
      }
    ]
  }, {
    key: 'user',
    title: 'User setting overrides',
    type: API.SettingTypeEnum.STRUCT,
    definitions: [
      {
        key: 'nick',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      }, {
        key: 'user_description',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      }
    ], 
  }, {
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
      }, {
        key: 'connection_ip_v4',
        title: 'IP address',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      }
    ]
  }, {
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
      }, {
        key: 'connection_ip_v6',
        title: 'IP address',
        type: API.SettingTypeEnum.STRING,
        optional: true,
      }
    ]
  }
];

interface Entry extends UI.FormValueMap {
  generic: Pick<FavoriteHubEntry, 'name' | 'hub_url' | 'hub_description' | 'auto_connect' | 'share_profile'>;
  user: Pick<FavoriteHubEntry, 'nick' | 'user_description'>;
  connectivityV4: Pick<FavoriteHubEntry, 'connection_mode_v4' | 'connection_ip_v4'>;
  connectivityV6: Pick<FavoriteHubEntry, 'connection_mode_v6' | 'connection_ip_v6'>;
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
  };
};

const toFavoriteHub = (entry: RecursivePartial<Entry>): RecursivePartial<API.FavoriteHubEntry> => {
  return {
    ...entry.generic,
    ...entry.user,
    ...entry.connectivityV4,
    ...entry.connectivityV6,
  };
};

const isAdcHub = (hubUrl?: string) => !!hubUrl && (hubUrl.indexOf('adc://') === 0 || hubUrl.indexOf('adcs://') === 0);

// Get selection values for the profiles field
const getFieldProfiles = (profiles: API.SettingEnumOption[], url?: string) => {
  return profiles
    .filter(p => isAdcHub(url) || p.id === ShareProfileConstants.HIDDEN_PROFILE_ID)
    .map(normalizeEnumValue);
};

const nullOption = { value: 'null', text: 'Global default' };

interface FavoriteHubDialogProps {

}

interface DataProps extends DataProviderDecoratorChildProps {
  hubEntry?: API.FavoriteHubEntry;
}

type Props = DataProps & ShareProfileDecoratorChildProps & 
  ModalRouteDecoratorChildProps & RouteComponentProps<{ entryId: string; }>;

class FavoriteHubDialog extends React.Component<Props> {
  static displayName = 'FavoriteHubDialog';

  formValue: Entry | undefined;

  constructor(props: Props) {
    super(props);

    this.formValue = toFormEntry(props.hubEntry);
  }

  isNew = () => {
    return !this.props.hubEntry;
  }

  form: Form<Entry>;

  onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
    if (id.indexOf('hub_url') !== -1) {
      if (!isAdcHub(value.generic!.hub_url) && value.share_profile !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
        // Reset share profile
        return Promise.resolve({ 
          share_profile: null 
        });
      }
    }

    return null;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    const hubEntry = toFavoriteHub(changedFields);
    if (this.isNew()) {
      return SocketService.post(FavoriteHubConstants.HUBS_URL, hubEntry);
    }

    return SocketService.patch(`${FavoriteHubConstants.HUBS_URL}/${this.props.hubEntry!.id}`, hubEntry);
  }

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'share_profile') {
      Object.assign(fieldOptions, {
        // tslint:disable-next-line:max-line-length
        help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
        nullOption,
        factory: t.form.Select,
        options: getFieldProfiles(this.props.profiles, formValue.generic ? formValue.generic.hub_url : undefined),
        transformer: intTransformer,
      });
    } else if (id === 'connection_mode_v4' || id === 'connection_mode_v6') {
      Object.assign(fieldOptions, {
        nullOption,
        transformer: intTransformer,
      });
    }
  }

  render() {
    const title = this.isNew() ? 'Add favorite hub' : 'Edit favorite hub';
    return (
      <Modal 
        className="fav-hub" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FAVORITE } 
        { ...this.props }
      >
        <Form<Entry>
          ref={ c => this.form = c! }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          fieldDefinitions={ Fields }
          value={ this.formValue }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<FavoriteHubDialogProps>(
  ShareProfileDecorator(
    DataProviderDecorator<Props, DataProps>(
      FavoriteHubDialog, {
        urls: {
          hubEntry: ({ match }, socket) => {
            if (!match.params.entryId) {
              return Promise.resolve(undefined);
            }

            return socket.get(`${FavoriteHubConstants.HUBS_URL}/${match.params.entryId}`);
          }
        }
      }
    ),
    true
  ),
  OverlayConstants.FAVORITE_HUB_MODAL_ID,
  'entries/:entryId?',
);