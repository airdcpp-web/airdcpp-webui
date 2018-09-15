import React from 'react';

import Modal from 'components/semantic/Modal';
import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';


const getSettingsUrl = (extensionId: string) => {
  return `${ExtensionConstants.EXTENSIONS_URL}/${extensionId}/settings`;
};

interface ExtensionsConfigureDialogProps extends ModalRouteDecoratorChildProps {
  extension?: API.Extension; // REQUIRED, CLONED
}

interface ExtensionsConfigureDialogDataProps extends DataProviderDecoratorChildProps {
  fieldDefinitions: UI.FormFieldDefinition[];
  settings: UI.FormValueMap;
}

type Props = ExtensionsConfigureDialogProps & ExtensionsConfigureDialogDataProps;
class ExtensionsConfigureDialog extends React.Component<Props> {
  static displayName = 'ExtensionsConfigureDialog';

  form: Form;
  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<UI.FormValueMap> = (changedFields) => {
    return SocketService.patch(getSettingsUrl(this.props.extension!.id), changedFields);
  }

  render() {
    const { extension, settings, fieldDefinitions, ...other } = this.props;
    return (
      <Modal 
        { ...other }
        className="extensions configure" 
        title={ extension!.name } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.EDIT }
        dynamicHeight={ true }
      >
        <Form
          ref={ c => this.form = c! }
          onSave={ this.onSave }
          fieldDefinitions={ fieldDefinitions }
          value={ settings }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(
  DataProviderDecorator<ExtensionsConfigureDialogProps, ExtensionsConfigureDialogDataProps>(
    ExtensionsConfigureDialog, {
      urls: {
        fieldDefinitions: ({ extension }) => SocketService.get(`${getSettingsUrl(extension!.id)}/definitions`),
        settings: ({ extension }) => SocketService.get(getSettingsUrl(extension!.id)),
      },
    }
  ),
  OverlayConstants.EXTENSION_CONFIGURE_MODAL,
  ':id/configure'
);