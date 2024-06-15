import { Component } from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import WebUserConstants from 'constants/WebUserConstants';
import AccessConstants from 'constants/AccessConstants';
import PermissionSelector from 'routes/Settings/routes/System/components/users/PermissionSelector';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';

import Form, { FormSaveHandler, FormFieldSettingHandler } from 'components/form/Form';

import LoginStore from 'stores/LoginStore';

import '../../style.css';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { translateForm } from 'utils/FormUtils';
import { getSubModuleT } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';

const enum PermissionAction {
  EDIT = 'Edit',
  VIEW = 'View',
  SEND_MESSAGES = 'Send messages',
}

type CaptionEntry =
  | string
  | {
      title: string;
      action: PermissionAction;
    };

const AccessCaptions: { [key in string]: CaptionEntry } = {
  ADMIN: 'Administrator',

  SEARCH: 'Search',
  DOWNLOAD: 'Download',
  TRANSFERS: 'Transfers',

  EVENTS_VIEW: {
    title: 'Events',
    action: PermissionAction.VIEW,
  },
  EVENTS_EDIT: {
    title: 'Events',
    action: PermissionAction.EDIT,
  },

  QUEUE_VIEW: {
    title: 'Queue',
    action: PermissionAction.VIEW,
  },
  QUEUE_EDIT: {
    title: 'Queue',
    action: PermissionAction.EDIT,
  },

  FAVORITE_HUBS_VIEW: {
    title: 'Favorite hubs',
    action: PermissionAction.VIEW,
  },
  FAVORITE_HUBS_EDIT: {
    title: 'Favorite hubs',
    action: PermissionAction.EDIT,
  },

  SETTINGS_VIEW: {
    title: 'Settings',
    action: PermissionAction.VIEW,
  },
  SETTINGS_EDIT: {
    title: 'Settings',
    action: PermissionAction.EDIT,
  },

  FILESYSTEM_VIEW: {
    title: 'Local filesystem',
    action: PermissionAction.VIEW,
  },
  FILESYSTEM_EDIT: {
    title: 'Local filesystem',
    action: PermissionAction.EDIT,
  },

  HUBS_VIEW: {
    title: 'Hubs',
    action: PermissionAction.VIEW,
  },
  HUBS_EDIT: {
    title: 'Hubs',
    action: PermissionAction.EDIT,
  },
  HUBS_SEND: {
    title: 'Hubs',
    action: PermissionAction.SEND_MESSAGES,
  },

  PRIVATE_CHAT_VIEW: {
    title: 'Private chat',
    action: PermissionAction.VIEW,
  },
  PRIVATE_CHAT_EDIT: {
    title: 'Private chat',
    action: PermissionAction.EDIT,
  },
  PRIVATE_CHAT_SEND: {
    title: 'Private chat',
    action: PermissionAction.SEND_MESSAGES,
  },

  FILELISTS_VIEW: {
    title: 'Filelists',
    action: PermissionAction.VIEW,
  },
  FILELISTS_EDIT: {
    title: 'Filelists',
    action: PermissionAction.EDIT,
  },

  VIEW_FILE_VIEW: {
    title: 'Viewed files',
    action: PermissionAction.VIEW,
  },
  VIEW_FILE_EDIT: {
    title: 'Viewed files',
    action: PermissionAction.EDIT,
  },
};

const reducePermissionToOption = (
  options: API.SettingEnumOption[],
  key: keyof typeof AccessConstants,
  moduleT: UI.ModuleTranslator,
) => {
  const captionEntry = AccessCaptions[key];
  if (typeof captionEntry === 'string') {
    options.push({
      id: AccessConstants[key],
      name: moduleT.translate(captionEntry),
    });
  } else {
    options.push({
      id: AccessConstants[key],
      name: `${moduleT.translate(captionEntry.title)} (${moduleT.translate(
        captionEntry.action,
      )})`,
    });
  }

  return options;
};

const getEntry = (
  isNew: boolean /*, moduleT: UI.ModuleTranslator*/,
): UI.FormFieldDefinition[] => {
  return [
    {
      key: 'username',
      title: 'User name',
      type: API.SettingTypeEnum.STRING,
    },
    {
      key: 'password',
      type: API.SettingTypeEnum.STRING,
      title: isNew ? 'Password' : 'New password',
      optional: !isNew,
    },
    {
      key: 'permissions',
      title: 'Permissions',
      type: API.SettingTypeEnum.LIST,
      item_type: API.SettingTypeEnum.STRING,
    },
  ];
};

interface WebUserDialogProps {
  moduleT: UI.ModuleTranslator;
}

interface Entry extends API.WebUserInput, UI.FormValueMap {}

interface DataProps extends DataProviderDecoratorChildProps {
  user: API.WebUserInput;
}

/*interface RouteProps {
  userId: string;
}*/

type Props = WebUserDialogProps & DataProps & ModalRouteDecoratorChildProps;

class WebUserDialog extends Component<Props> {
  static displayName = 'WebUserDialog';

  entry: UI.FormFieldDefinition[];
  form: Form<Entry>;

  constructor(props: Props) {
    super(props);

    this.entry = translateForm(getEntry(this.isNew()), props.moduleT);

    const permissionT = getSubModuleT(props.moduleT, 'permissionSelector');
    const permissions = this.entry.find((def) => def.key === 'permissions')!;
    Object.assign(permissions, {
      options: Object.keys(AccessConstants).reduce(
        (reduced, cur) =>
          reducePermissionToOption(
            reduced,
            cur as keyof typeof AccessConstants,
            permissionT,
          ),
        [],
      ),
    });
  }

  isNew = () => {
    return !this.props.user;
  };

  save = () => {
    return this.form.save();
  };

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(WebUserConstants.USERS_URL, changedFields);
    }

    return SocketService.patch(
      `${WebUserConstants.USERS_URL}/${this.props.user.id}`,
      changedFields,
    );
  };

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'permissions') {
      const { user, moduleT } = this.props;
      fieldOptions.factory = t.form.Select;
      fieldOptions.template = PermissionSelector(moduleT);
      fieldOptions.disabled = !this.isNew() && user.username === LoginStore.user.username;
    } else if (id === 'password') {
      fieldOptions.type = 'password';
    } else if (id === 'username') {
      fieldOptions.disabled = !this.isNew();
    }
  };

  render() {
    const { user, moduleT, ...other } = this.props;
    const title = moduleT.translate(this.isNew() ? 'Add web user' : 'Edit user');

    return (
      <Modal
        className="web-user"
        title={title}
        onApprove={this.save}
        closable={false}
        icon={IconConstants.USER}
        {...other}
      >
        <Form<Entry>
          ref={(c: any) => (this.form = c!)}
          fieldDefinitions={this.entry}
          onFieldSetting={this.onFieldSetting}
          onSave={this.onSave}
          sourceValue={user as Entry}
          location={this.props.location}
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<WebUserDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(WebUserDialog, {
    urls: {
      user: ({ params }, socket) => {
        if (!params.userId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${WebUserConstants.USERS_URL}/${params.userId}`);
      },
    },
  }),
  'users/:userId?',
);
