import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import WebUserConstants from 'constants/WebUserConstants';
import AccessConstants from 'constants/AccessConstants';
import PermissionSelector from './PermissionSelector';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';

import Form from 'components/form/Form';

import LoginStore from 'stores/LoginStore';

import { FieldTypes } from 'constants/SettingConstants';

import '../../style.css';


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


const reducePermissions = (options, key) => {
  options.push({
    id: AccessConstants[key],
    name: AccessCaptions[key],
  });

  return options;
};

const getEntry = isNew => {
  return [
    {
      key: 'username',
      type: FieldTypes.STRING,
    },
    {
      key: 'password',
      type: FieldTypes.STRING,
      title: isNew ? 'Password' : 'New password',
      optional: !isNew,
    },
    {
      key: 'permissions',
      type: FieldTypes.LIST,
      item_type: FieldTypes.STRING,
      options: Object.keys(AccessConstants).reduce(reducePermissions, []),
    },
  ];
};

class WebUserDialog extends React.Component {
  static displayName = 'WebUserDialog';

  isNew = () => {
    return !this.props.user;
  };

  componentDidMount() {
    this.entry = getEntry(this.isNew());
  }

  save = () => {
    return this.form.save();
  };

  onSave = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(WebUserConstants.USERS_URL, changedFields);
    }

    return SocketService.patch(WebUserConstants.USERS_URL + '/' + this.props.user.id, changedFields);
  };

  onFieldSetting = (id, fieldOptions, formValue) => {
    if (id === 'permissions') {
      fieldOptions['factory'] = t.form.Select;
      fieldOptions['template'] = PermissionSelector;
      fieldOptions['disabled'] = !this.isNew() && this.props.user.username === LoginStore.user.username;
    } else if (id === 'password') {
      fieldOptions['type'] = 'password';
    } else if (id === 'username') {
      fieldOptions['disabled'] = !this.isNew();
    }
  };

  render() {
    const { user, ...other } = this.props;
    const title = this.isNew() ? 'Add web user' : 'Edit user ' + user.username;

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
          ref={ c => this.form = c }
          fieldDefinitions={ this.entry }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ this.props.user }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(WebUserDialog, OverlayConstants.WEB_USER_MODAL_ID, 'user');