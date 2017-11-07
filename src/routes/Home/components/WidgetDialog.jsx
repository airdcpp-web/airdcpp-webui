import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';

import Form from 'components/form/Form';
import { FieldTypes } from 'constants/SettingConstants';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import WidgetUtils from 'utils/WidgetUtils';


const WidgetDialog = createReactClass({
  displayName: 'WidgetDialog',

  propTypes: {
    /**
		 * Current widget settings
		 */
    settings: PropTypes.object, // Required

    /**
		 * Widget info object
		 */
    typeId: PropTypes.string, // Required

    /**
		 * Called when the form is saved
		 */
    onSave: PropTypes.func, // Required
  },

  save() {
    return this.form.save();
  },

  onSave(changedFields, value) {
    const { name, ...formSettings } = value;
    const settings = {
      name,
      widget: formSettings
    };

    const { id, typeId } = this.props;
    if (!id) {
      // New widget
      WidgetActions.create.saved(WidgetUtils.createId(typeId), settings, typeId);
    } else {
      // Existing widget
      WidgetActions.edit.saved(id, settings);
    }

    return Promise.resolve();
  },

  render: function () {
    const { typeId, location, settings, ...overlayProps } = this.props;
    const { formSettings, name, icon } = WidgetStore.getWidgetInfoById(typeId);

    const Entry = [
      {
        key: 'name',
        type: FieldTypes.STRING,
        default_value: name,
      },
    ];

    if (formSettings) {
      Entry.push(...formSettings);
    }

    return (
      <Modal 
        className="home-widget" 
        title={ name } 
        onApprove={ this.save }
        icon={ icon }
        location={ location }
        { ...overlayProps }
      >
        <Form
          ref={ c => this.form = c }
          value={ settings && {
            name: settings.name,
            ...settings.widget,
          } }
          fieldDefinitions={ Entry }
          onSave={ this.onSave }
        />

        <Message
          description="Widgets and their positions are browser-specific"
          icon={ IconConstants.INFO }
        />
      </Modal>
    );
  },
});

export default WidgetDialog;