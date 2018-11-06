import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import WebUserConstants from 'constants/WebUserConstants';
import AccessConstants from 'constants/AccessConstants';
import PermissionSelector from 'routes/Settings/routes/System/components/users/PermissionSelector';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';

import Form, { FormSaveHandler, FormFieldSettingHandler } from 'components/form/Form';

import LoginStore from 'stores/LoginStore';

import '../../style.css';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';
import * as UI from 'types/ui';


const AccessCaptions = {
  ADMIN: 'Administrator',

  SEARCH: 'Search',
  DOWNLOAD: 'Download',
  TRANSFERS: 'Transfers',

  EVENTS_VIEW: 'Events: View',
  EVENTS_EDIT: 'Events: Edit',

  QUEUE_VIEW: 'Queue: View',
  QUEUE_EDIT: 'Queue: Modify',

  FAVORITE_HUBS_VIEW: 'Favorite hubs: View',
  FAVORITE_HUBS_EDIT: 'Favorite hubs: Modify',

  SETTINGS_VIEW: 'Settings: View',
  SETTINGS_EDIT: 'Settings: Edit',

  FILESYSTEM_VIEW: 'Local filesystem: Browse',
  FILESYSTEM_EDIT: 'Local filesystem: Edit',

  HUBS_VIEW: 'Hubs: View',
  HUBS_EDIT: 'Hubs: Modify',
  HUBS_SEND: 'Hubs: Send messages',

  PRIVATE_CHAT_VIEW: 'Private chat: View',
  PRIVATE_CHAT_EDIT: 'Private chat: Modify',
  PRIVATE_CHAT_SEND: 'Private chat: Send messages',

  FILELISTS_VIEW: 'Filelists: View',
  FILELISTS_EDIT: 'Filelists: Modify',

  VIEW_FILE_VIEW: 'Viewed files: View',
  VIEW_FILE_EDIT: 'Viewed files: Modify',
};


const reducePermissions = (options: API.SettingEnumOption[], key: string) => {
  options.push({
    id: AccessConstants[key],
    name: AccessCaptions[key],
  });

  return options;
};

const getEntry = (isNew: boolean): UI.FormFieldDefinition[] => {
  return [
    {
      key: 'username',
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
      type: API.SettingTypeEnum.LIST,
      item_type: API.SettingTypeEnum.STRING,
      options: Object.keys(AccessConstants).reduce(reducePermissions, []),
    },
  ];
};

interface WebUserDialogProps {

}

interface Entry extends API.WebUserInput, UI.FormValueMap {

}

interface DataProps extends DataProviderDecoratorChildProps {
  user: API.WebUserInput;
}

type Props = WebUserDialogProps & DataProps & 
  ModalRouteDecoratorChildProps & RouteComponentProps<{ userId: string; }>;

class WebUserDialog extends React.Component<Props> {
  static displayName = 'WebUserDialog';


  entry: UI.FormFieldDefinition[];
  form: Form<Entry>;

  constructor(props: Props) {
    super(props);

    this.entry = getEntry(this.isNew());
  }

  isNew = () => {
    return !this.props.user;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<API.WebUserBase> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(WebUserConstants.USERS_URL, changedFields);
    }

    return SocketService.patch(`${WebUserConstants.USERS_URL}/${this.props.user.id}`, changedFields);
  }

  onFieldSetting: FormFieldSettingHandler<API.WebUserBase> = (id, fieldOptions, formValue) => {
    if (id === 'permissions') {
      fieldOptions['factory'] = t.form.Select;
      fieldOptions['template'] = PermissionSelector;
      fieldOptions['disabled'] = !this.isNew() && this.props.user.username === LoginStore.user.username;
    } else if (id === 'password') {
      fieldOptions['type'] = 'password';
    } else if (id === 'username') {
      fieldOptions['disabled'] = !this.isNew();
    }
  }

  render() {
    const { user, ...other } = this.props;
    const title = this.isNew() ? 'Add web user' : `Edit user ${user.username}`;

    return (
      <Modal 
        className="web-user" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon="user" 
        { ...other }
      >
        <Form
          ref={ (c: any) => this.form = c! }
          fieldDefinitions={ this.entry }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ this.props.user as Entry }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<WebUserDialogProps>(
  DataProviderDecorator<Props, DataProps>(WebUserDialog, {
    urls: {
      user: ({ match }, socket) => {
        if (!match.params.userId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${WebUserConstants.USERS_URL}/${match.params.userId}`);
      },
    },
  }),
  'users/:userId?'
);