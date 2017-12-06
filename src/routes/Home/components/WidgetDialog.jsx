import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';

import Form from 'components/form/Form';
import { FieldTypes } from 'constants/SettingConstants';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import WidgetUtils from 'utils/WidgetUtils';


class WidgetDialog extends React.Component {
  static displayName = 'WidgetDialog';

  static propTypes = {
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
  };

  save = () => {
    return this.form.save();
  };

  onSave = (changedFields, value) => {
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
  };

  render() {
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
  }
}

export default ModalRouteDecorator(
  WidgetDialog,
  OverlayConstants.HOME_WIDGET_MODAL,
  '/home/widget'
);