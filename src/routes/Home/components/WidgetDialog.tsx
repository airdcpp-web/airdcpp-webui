//import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';

import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import WidgetUtils from 'utils/WidgetUtils';
import { RouteComponentProps } from 'react-router';

import * as API from 'types/api';
import * as UI from 'types/ui';


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

  form: Form;

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<UI.WidgetSettings> = (changedFields, value) => {
    const { name, ...other } = value;
    const settings = {
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

  parseSettings = () => {
    const { widgetId } = this.props.match.params;
    if (!!widgetId) {
      const widgetInfo: UI.Widget = WidgetStore.getWidgetInfoById(widgetId);
      const settings = WidgetStore.getWidgetSettings(widgetId, widgetInfo);
      return {
        name: settings.name,
        ...settings.widget,
      } as UI.FormValueMap;
    }

    return undefined;
  }

  render() {
    const { typeId } = this.props.match.params;
    const settings = this.parseSettings();
    const { formSettings, name, icon } = WidgetStore.getWidgetInfoById(typeId);

    const Entry = [
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
        <Form
          ref={ (c: any) => this.form = c }
          value={ settings }
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
  OverlayConstants.HOME_WIDGET_MODAL,
  '/home/widget/:typeId/:widgetId?'
);