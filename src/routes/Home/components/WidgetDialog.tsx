//import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';

import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import WidgetUtils from 'utils/WidgetUtils';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';
import * as UI from 'types/ui';


type FormData = Pick<UI.WidgetSettings, 'name'> & UI.WidgetSettings['widget'];

const settingsToFormValue = (widgetId: string | undefined, widgetInfo: UI.Widget): FormData | undefined => {
  if (!widgetId) {
    return undefined;
  }

  const settings = WidgetStore.getWidgetSettings(widgetId, widgetInfo);
  return {
    name: settings.name,
    ...settings.widget,
  };
};

interface WidgetDialogProps {

}

type Props = WidgetDialogProps & ModalRouteDecoratorChildProps & 
  RouteComponentProps<{ widgetId?: string; typeId: string; }>;

class WidgetDialog extends React.Component<Props> {
  static displayName = 'WidgetDialog';

  /*static propTypes = {
    // Current widget settings
    settings: PropTypes.object, // Required

    // Widget info object
    typeId: PropTypes.string, // Required
  };*/

  form: Form<FormData>;

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<FormData> = (changedFields, value) => {
    const { name, ...other } = value;
    const settings: UI.WidgetSettings = {
      name: name!,
      widget: other
    };

    const { typeId, widgetId } = this.props.match.params;
    if (!widgetId) {
      // New widget
      WidgetActions.create.saved(WidgetUtils.createId(typeId!), settings, typeId);
    } else {
      // Existing widget
      WidgetActions.edit.saved(widgetId, settings);
    }

    return Promise.resolve();
  }

  render() {
    const { typeId, widgetId } = this.props.match.params;
    const widgetInfo = WidgetStore.getWidgetInfoById(typeId);
    if (!widgetInfo) {
      return null;
    }

    const { formSettings, name, icon } = widgetInfo;
    const formValue = settingsToFormValue(widgetId, widgetInfo);

    const Entry: UI.FormFieldDefinition[] = [
      {
        key: 'name',
        type: API.SettingTypeEnum.STRING,
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
        { ...this.props }
      >
        <Form<FormData>
          ref={ c => this.form = c! }
          value={ formValue }
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

export default ModalRouteDecorator<WidgetDialogProps>(
  WidgetDialog,
  '/home/widget/:typeId/:widgetId?'
);