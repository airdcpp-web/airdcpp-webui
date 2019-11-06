import React from 'react';
import Modal from 'components/semantic/Modal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';
import SocketService from 'services/SocketService';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

import { getLastDirectory } from 'utils/FileUtils';

import Form, { FormSaveHandler, FormFieldSettingHandler, FormFieldChangeHandler } from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ShareRootEntryBase } from 'types/api';
import { translateForm } from 'utils/FormUtils';
import { Trans } from 'react-i18next';


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

interface Entry extends ShareRootEntryBase, UI.FormValueMap {

}

interface RouteProps {
  directoryId: string;
}

type Props = ShareDirectoryDialogProps & DataProps & 
  ModalRouteDecoratorChildProps<RouteProps>;

class ShareDirectoryDialog extends React.Component<Props> {
  static displayName = 'ShareDirectoryDialog';

  fieldDefinitions: UI.FormFieldDefinition[];
  form: Form<Entry>;

  constructor(props: Props) {
    super(props);

    this.fieldDefinitions = translateForm(Fields, props.shareT);

    // Share profiles shouldn't be translated...
    const shareProfile = this.fieldDefinitions.find(def => def.key === 'profiles')!;
    Object.assign(shareProfile, {
      options: props.profiles,
      default_value: [ props.profiles.find(profile => profile.default)!.id ],
    });
  }

  isNew = () => {
    return !this.props.rootEntry;
  }

  onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
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

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(ShareRootConstants.ROOTS_URL, changedFields);
    }

    return SocketService.patch(`${ShareRootConstants.ROOTS_URL}/${this.props.rootEntry!.id}`, changedFields);
  }

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'path') {
      fieldOptions.disabled = !this.isNew();
      fieldOptions.config = Object.assign({} || fieldOptions.config, {
        historyId: FilesystemConstants.LOCATION_DOWNLOAD,
      });
    } else if (id === 'virtual_name') {
      fieldOptions.factory = t.form.Textbox;
      fieldOptions.template = AutoSuggestField;
      fieldOptions.config = {
        suggestionGetter: () => this.props.virtualNames,
      };

    }
  }

  render() {
    const { rootEntry, shareT, ...other } = this.props;
    const title = shareT.translate(this.isNew() ? 'Add share directory' : 'Edit share directory');
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
          title={ shareT.translate('Hashing information') }
          icon={ IconConstants.INFO }
          description={ 
            <Trans i18nKey={ shareT.toI18nKey('hashingInformationDesc') }>
              <p>
                New files will appear in share only after they have finished hashing 
                (the client has calculated checksums for them). 
                Information about hashing progress will be posted to the event log.
              </p>
            </Trans>
          }
        />
        <Form<Entry>
          ref={ c => this.form = c! }
          fieldDefinitions={ this.fieldDefinitions }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ rootEntry as Entry }
          location={ this.props.location }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<ShareDirectoryDialogProps, RouteProps>(
  ShareProfileDecorator<Omit<Props, keyof DataProps>>(ShareDirectoryDialog, false, {
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
    }
  }),
  'directories/:directoryId([0-9A-Z]{39})?'
);