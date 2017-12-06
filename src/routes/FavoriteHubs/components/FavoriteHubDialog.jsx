import React from 'react';
import createReactClass from 'create-react-class';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import { FieldTypes } from 'constants/SettingConstants';

import SocketService from 'services/SocketService';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import IconConstants from 'constants/IconConstants';

import t from 'utils/tcomb-form';

import Form from 'components/form/Form';
import FormUtils from 'utils/FormUtils';


const Fields = [
  {
    key: 'name',
    type: FieldTypes.STRING,
  },
  {
    key: 'hub_url',
    type: FieldTypes.STRING,
  },
  {
    key: 'hub_description',
    type: FieldTypes.STRING,
    optional: true,
  }, 
  {
    key: 'share_profile',
    type: FieldTypes.NUMBER,
    optional: true,
  }, 
  {
    key: 'auto_connect',
    type: FieldTypes.BOOLEAN,
  }, 
  {
    key: 'nick',
    type: FieldTypes.STRING,
    optional: true,
  }, 
  {
    key: 'user_description',
    type: FieldTypes.STRING,
    optional: true,
  }
];

const isAdcHub = hubUrl => hubUrl && (hubUrl.indexOf('adc://') === 0 || hubUrl.indexOf('adcs://') === 0);

// Get selection values for the profiles field
const getFieldProfiles = (profiles, url) => {
  return profiles
    .filter(p => isAdcHub(url) || p.id === ShareProfileConstants.HIDDEN_PROFILE_ID)
    .map(FormUtils.normalizeEnumValue);
};

const FavoriteHubDialog = createReactClass({
  displayName: 'FavoriteHubDialog',

  isNew() {
    return !this.props.hubEntry;
  },

  onFieldChanged(id, value, hasChanges) {
    if (id.indexOf('hub_url') !== -1) {
      if (!isAdcHub(value.hub_url) && value.share_profile !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
        // Reset share profile
        return Promise.resolve({ 
          share_profile: null 
        });
      }
    }

    return null;
  },

  save() {
    return this.form.save();
  },

  onSave(changedFields) {
    if (this.isNew()) {
      return SocketService.post(FavoriteHubConstants.HUBS_URL, changedFields);
    }

    return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + this.props.hubEntry.id, changedFields);
  },

  onFieldSetting(id, fieldOptions, formValue) {
    if (id === 'share_profile') {
      Object.assign(fieldOptions, {
        help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
        nullOption: { value: 'null', text: 'Global default' },
        factory: t.form.Select,
        options: getFieldProfiles(this.props.profiles, formValue.hub_url),
        transformer: FormUtils.intTransformer,
      });
    }
  },

  render: function () {
    const title = this.isNew() ? 'Add favorite hub' : 'Edit favorite hub';
    return (
      <Modal 
        className="fav-hub" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FAVORITE } 
        { ...this.props }
      >
        <Form
          ref={ c => this.form = c }
          title="User information"
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          fieldDefinitions={ Fields }
          value={ this.props.hubEntry }
        />
      </Modal>
    );
  },
});

export default ModalRouteDecorator(
  ShareProfileDecorator(FavoriteHubDialog, true),
  OverlayConstants.FAVORITE_HUB_MODAL_ID,
  '(new|edit)',
);