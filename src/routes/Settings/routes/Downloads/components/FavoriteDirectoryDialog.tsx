import React from 'react';
import Modal from 'components/semantic/Modal';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';
import { FieldTypes } from 'constants/SettingConstants';

import { getLastDirectory } from 'utils/FileUtils';

import Form, { FormFieldChangeHandler, FormSaveHandler, FormFieldSettingHandler } from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';
import { RouteComponentProps } from 'react-router';


const Entry: UI.FormFieldDefinition[] = [
  {
    key: 'path',
    type: FieldTypes.DIRECTORY_PATH,
  },
  {
    key: 'name',
    type: FieldTypes.STRING,
  },
];

export interface FavoriteDirectoryDialogProps {

}

export interface DataProps extends DataProviderDecoratorChildProps {
  virtualNames: string[];
  directoryEntry?: API.FavoriteDirectoryEntryBase;
}


type Props = FavoriteDirectoryDialogProps & DataProps & 
ModalRouteDecoratorChildProps & RouteComponentProps<{ directoryId: string; }>;

class FavoriteDirectoryDialog extends React.Component<Props> {
  static displayName = 'FavoriteDirectoryDialog';

  form: Form;
  isNew = () => {
    return !this.props.directoryEntry;
  }

  onFieldChanged: FormFieldChangeHandler<API.FavoriteDirectoryEntryBase> = (id, value, hasChanges) => {
    if (id.indexOf('path') !== -1) {
      return Promise.resolve({
        name: !!value.path ? getLastDirectory(value.path) : undefined 
      });
    }

    return null;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<API.FavoriteDirectoryEntryBase> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(FavoriteDirectoryConstants.DIRECTORIES_URL, changedFields);
    }

    return SocketService.patch(
      `${FavoriteDirectoryConstants.DIRECTORIES_URL}/${this.props.directoryEntry!.id}`, 
      changedFields
    );
  }

  onFieldSetting: FormFieldSettingHandler<API.FavoriteDirectoryEntryBase> = (id, fieldOptions, formValue) => {
    if (id === 'path') {
      fieldOptions['disabled'] = !this.isNew();
      fieldOptions['config'] = Object.assign(fieldOptions['config'] || {}, {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'name') {
      fieldOptions['factory'] = t.form.Textbox;
      fieldOptions['template'] = AutoSuggestField;
      fieldOptions['config'] = {
        suggestionGetter: () => this.props.virtualNames,
      };
    }
  }

  render() {
    const title = this.isNew() ? 'Add favorite directory' : 'Edit favorite directory';
    return (
      <Modal 
        className="favorite-directory" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FOLDER } 
        { ...this.props }
      >
        <Form
          ref={ (c: any) => this.form = c }
          fieldDefinitions={ Entry }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ this.props.directoryEntry }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<FavoriteDirectoryDialogProps>(
  DataProviderDecorator<Props, DataProps>(FavoriteDirectoryDialog, {
    urls: {
      virtualNames: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
      directoryEntry: ({ match }, socket) => {
        if (!match.params.directoryId) {
          return undefined;
        }

        return socket.get(`${FavoriteDirectoryConstants.DIRECTORIES_URL}/${match.params.directoryId}`);
      },
    },
    dataConverters: {
      virtualNames: (data: API.GroupedPath[]) => data.map(item => item.name, []),
    },
  }),
  OverlayConstants.FAVORITE_DIRECTORY_MODAL,
  'directories/:directoryId?'
);