import React from 'react';
import Modal from 'components/semantic/Modal';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';

import t from 'utils/tcomb-form';

import { getLastDirectory } from 'utils/FileUtils';

import Form, { FormFieldChangeHandler, FormSaveHandler, FormFieldSettingHandler } from 'components/form';
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

interface Entry extends API.FavoriteDirectoryEntryBase, UI.FormValueMap {

}

export interface DataProps extends DataProviderDecoratorChildProps {
  virtualNames: string[];
  directoryEntry?: API.FavoriteDirectoryEntryBase;
}

interface RouteProps {
  directoryId: string; 
}

type Props = FavoriteDirectoryDialogProps & DataProps & ModalRouteDecoratorChildProps<RouteProps>;

class FavoriteDirectoryDialog extends React.Component<Props> {
  static displayName = 'FavoriteDirectoryDialog';

  form: Form<Entry>;
  fieldDefinitions = translateForm(Entry, this.props.moduleT);

  isNew = () => {
    return !this.props.directoryEntry;
  }

  onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
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

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(FavoriteDirectoryConstants.DIRECTORIES_URL, changedFields);
    }

    return SocketService.patch(
      `${FavoriteDirectoryConstants.DIRECTORIES_URL}/${this.props.directoryEntry!.id}`, 
      changedFields
    );
  }

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'path') {
      fieldOptions.disabled = !this.isNew();
      fieldOptions.config = Object.assign(fieldOptions.config || {}, {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'name') {
      fieldOptions.factory = t.form.Textbox;
      fieldOptions.template = AutoSuggestField;
      fieldOptions.config = {
        suggestionGetter: () => this.props.virtualNames,
      };
    }
  }

  render() {
    const { moduleT, directoryEntry } = this.props;
    const title =  moduleT.translate(this.isNew() ? 'Add favorite directory' : 'Edit favorite directory');
    return (
      <Modal 
        className="favorite-directory" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FOLDER } 
        { ...this.props }
      >
        <Form<Entry>
          ref={ c => this.form = c! }
          fieldDefinitions={ this.fieldDefinitions }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ directoryEntry as Entry }
          location={ this.props.location }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<FavoriteDirectoryDialogProps, RouteProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(FavoriteDirectoryDialog, {
    urls: {
      virtualNames: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
      directoryEntry: ({ match }, socket) => {
        if (!match.params.directoryId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${FavoriteDirectoryConstants.DIRECTORIES_URL}/${match.params.directoryId}`);
      },
    },
    dataConverters: {
      virtualNames: (data: API.GroupedPath[]) => data.map(item => item.name, []),
    },
  }),
  'directories/:directoryId([0-9A-Z]{39})?'
);