import React from 'react';

import Modal from 'components/semantic/Modal';
import Form from 'components/form/Form';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';


const getSettingsUrl = (extensionId) => {
  return ExtensionConstants.EXTENSIONS_URL + '/' + extensionId + '/settings';
};

class ExtensionsConfigureDialog extends React.Component {
  static displayName = 'ExtensionsConfigureDialog';

  save = () => {
    return this.form.save();
  };

  onSave = (changedFields) => {
    return SocketService.patch(getSettingsUrl(this.props.extension.id), changedFields);
  };

  render() {
    const { extension, settings, fieldDefinitions, ...other } = this.props;
    return (
      <Modal 
        { ...other }
        className="extensions configure" 
        title={ extension.name } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.EDIT }
        dynamicHeight={ true }
      >
        <Form
          ref={ c => this.form = c }
          onSave={ this.onSave }
          fieldDefinitions={ fieldDefinitions }
          value={ settings }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(
  DataProviderDecorator(ExtensionsConfigureDialog, {
    urls: {
      fieldDefinitions: ({ extension }) => SocketService.get(getSettingsUrl(extension.id) + '/definitions'),
      settings: ({ extension }) => SocketService.get(getSettingsUrl(extension.id)),
    },
  }),
  OverlayConstants.EXTENSION_CONFIGURE_MODAL,
  ':id/configure'
);