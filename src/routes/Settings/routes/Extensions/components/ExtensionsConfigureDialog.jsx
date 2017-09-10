import React from 'react';
import Modal from 'components/semantic/Modal';
import Form from 'components/form/Form';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';


const getSettingsUrl = (extensionId) => {
  return ExtensionConstants.EXTENSIONS_URL + '/' + extensionId + '/settings';
};

const ExtensionsConfigureDialog = React.createClass({
  mixins: [ RouteContext ],

  save() {
    return this.form.save();
  },

  onSave(changedFields) {
    return SocketService.patch(getSettingsUrl(this.props.extension.id), changedFields);
  },

  render: function () {
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
          context={ {
            location: this.props.location,
          } }
        />
      </Modal>
    );
  }
});

export default DataProviderDecorator(ExtensionsConfigureDialog, {
  urls: {
    fieldDefinitions: ({ extension }) => SocketService.get(getSettingsUrl(extension.id) + '/definitions'),
    settings: ({ extension }) => SocketService.get(getSettingsUrl(extension.id)),
  },
});