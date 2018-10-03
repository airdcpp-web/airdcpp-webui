import React from 'react';
import Modal from 'components/semantic/Modal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';
import SocketService from 'services/SocketService';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

import { getLastDirectory } from 'utils/FileUtils';

import Form, { FormSaveHandler, FormFieldSettingHandler, FormFieldChangeHandler } from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';

import '../style.css';

import { RouteComponentProps } from 'react-router';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ShareRootEntryBase } from 'types/api';


const getFields = (profiles: API.ShareProfile[]) => {
  return [
    {
      key: 'path',
      type: API.SettingTypeEnum.DIRECTORY_PATH,
    },
    {
      key: 'virtual_name',
      type: API.SettingTypeEnum.STRING,
      help: 'Directories with identical virtual names will be merged in filelist',
    },
    {
      key: 'profiles',
      type: API.SettingTypeEnum.LIST,
      item_type: API.SettingTypeEnum.NUMBER,
      title: 'Share profiles',
      help: 'New share profiles can be created from application settings',
      options: profiles,
      default_value: [ profiles.find(profile => profile.default)!.id ],
    }, 
    {
      key: 'incoming',
      type: API.SettingTypeEnum.BOOLEAN,
    },
  ] as UI.FormFieldDefinition[];
};

export interface ShareDirectoryDialogProps {

}

export interface DataProps extends ShareProfileDecoratorChildProps, DataProviderDecoratorChildProps {
  virtualNames: string[];
  rootEntry?: API.ShareRootEntryBase;
}

interface Entry extends ShareRootEntryBase, UI.FormValueMap {

}

type Props = ShareDirectoryDialogProps & DataProps & 
  ModalRouteDecoratorChildProps & RouteComponentProps<{ directoryId: string; }>;

class ShareDirectoryDialog extends React.Component<Props> {
  static displayName = 'ShareDirectoryDialog';

  fieldDefinitions: UI.FormFieldDefinition[];
  form: Form<Entry>;

  constructor(props: Props) {
    super(props);

    this.fieldDefinitions = getFields(props.profiles);
  }

  isNew = () => {
    return !this.props.rootEntry;
  }

  onFieldChanged: FormFieldChangeHandler<API.ShareRootEntryBase> = (id, value, hasChanges) => {
    if (id.indexOf('path') !== -1) {
      const mergeFields = { 
        virtual_name: !!value.path ? getLastDirectory(value.path) : undefined, 
      };

      return Promise.resolve(mergeFields);
    }

    return null;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<API.ShareRootEntryBase> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(ShareRootConstants.ROOTS_URL, changedFields);
    }

    return SocketService.patch(`${ShareRootConstants.ROOTS_URL}/${this.props.rootEntry!.id}`, changedFields);
  }

  onFieldSetting: FormFieldSettingHandler<API.ShareRootEntryBase> = (id, fieldOptions, formValue) => {
    if (id === 'path') {
      fieldOptions['disabled'] = !this.isNew();
      fieldOptions['config'] = Object.assign({} || fieldOptions['config'], {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'virtual_name') {
      fieldOptions['factory'] = t.form.Textbox;
      fieldOptions['template'] = AutoSuggestField;
      fieldOptions['config'] = {
        suggestionGetter: () => this.props.virtualNames,
      };

    }
  }

  render() {
    const title = this.isNew() ? 'Add share directory' : 'Edit share directory';
    const { rootEntry, ...other } = this.props;
    return (
      <Modal 
        className="share-directory" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FOLDER } 
        { ...other }
      >
        <Message 
          title="Hashing information"
          icon={ IconConstants.INFO }
          description={ 
            <span>
              <p>
                New files will appear in share only after they have finished hashing 
                (the client has calculated checksums for them). 
                Information about hashing progress will be posted to the event log.
              </p>
            </span>
          }
        />
        <Form<Entry>
          ref={ (c: any) => this.form = c }
          fieldDefinitions={ this.fieldDefinitions }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ rootEntry as Entry }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<ShareDirectoryDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    ShareProfileDecorator(ShareDirectoryDialog, false), {
      urls: {
        virtualNames: ShareConstants.GROUPED_ROOTS_GET_URL,
        rootEntry: ({ match }, socket) => {
          if (!match.params.directoryId) {
            return Promise.resolve(undefined);
          }

          return socket.get(`${ShareRootConstants.ROOTS_URL}/${match.params.directoryId}`);
        },
      },
      dataConverters: {
        virtualNames: (data: API.GroupedPath[]) => data.map(item => item.name, []),
      },
    }
  ),
  OverlayConstants.SHARE_ROOT_MODAL_ID,
  'directories/:directoryId([0-9A-Z]{39})?'
);