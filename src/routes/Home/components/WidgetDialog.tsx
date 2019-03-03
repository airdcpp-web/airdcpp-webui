//import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';

import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import WidgetActions from 'actions/reflux/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import { getWidgetT, createWidgetId, translateWidgetName } from 'utils/WidgetUtils';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { withTranslation, WithTranslation } from 'react-i18next';
import { translateForm } from 'utils/FormUtils';


type FormValue = Pick<UI.WidgetSettings, 'name'> & UI.WidgetSettings['widget'];

const settingsToFormValue = (widgetId: string | undefined, widgetInfo: UI.Widget): FormValue | undefined => {
  if (!widgetId) {
    return undefined;
  }

  const settings = WidgetStore.getWidgetSettings(widgetId, widgetInfo);
  return {
    name: settings.name,
    ...settings.widget,
  };
};


const buildDefinitions = (widgetInfo: UI.Widget, rootWidgetT: UI.ModuleTranslator) => {
  const Entry: UI.FormFieldDefinition[] = translateForm(
    [
      {
        key: 'name',
        title: 'Name',
        type: API.SettingTypeEnum.STRING,
        default_value: name,
        optional: true,
      },
    ], 
    rootWidgetT
  );

  if (widgetInfo.formSettings) {
    const widgetT = getWidgetT(widgetInfo, rootWidgetT.plainT);
    Entry.push(...translateForm(widgetInfo.formSettings, widgetT));
  }

  return Entry;
};

interface WidgetDialogProps {
  rootWidgetT: UI.ModuleTranslator;
}

type Props = WidgetDialogProps & ModalRouteDecoratorChildProps & WithTranslation &
  RouteComponentProps<{ widgetId?: string; typeId: string; }>;

class WidgetDialog extends React.Component<Props> {
  static displayName = 'WidgetDialog';

  /*static propTypes = {
    // Current widget settings
    settings: PropTypes.object, // Required

    // Widget info object
    typeId: PropTypes.string, // Required
  };*/

  formData: null | {
    value: FormValue | undefined,
    definitions: UI.FormFieldDefinition[],
    widgetInfo: UI.Widget,
  } = null;
  form: Form<FormValue>;

  constructor(props: Props) {
    super(props);

    const { rootWidgetT } = props;

    const { typeId, widgetId } = props.match.params;
    const widgetInfo = WidgetStore.getWidgetInfoById(typeId);
    if (!!widgetInfo) {
      this.formData = {
        value: settingsToFormValue(widgetId, widgetInfo),
        definitions: buildDefinitions(widgetInfo, rootWidgetT),
        widgetInfo
      };
    }
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<FormValue> = (changedFields, value) => {
    const { name, ...other } = value;
    const settings: UI.WidgetSettings = {
      name: name!,
      widget: other
    };

    const { typeId, widgetId } = this.props.match.params;
    if (!widgetId) {
      // New widget
      WidgetActions.create(createWidgetId(typeId!), settings, typeId);
    } else {
      // Existing widget
      WidgetActions.edit(widgetId, settings);
    }

    return Promise.resolve();
  }

  render() {
    if (!this.formData) {
      return null;
    }

    const { location, rootWidgetT } = this.props;
    const { value, widgetInfo, definitions } = this.formData;
    const { icon } = widgetInfo;
    const { t } = rootWidgetT;
    return (
      <Modal 
        className="home-widget" 
        title={ translateWidgetName(widgetInfo, rootWidgetT.plainT) } 
        onApprove={ this.save }
        icon={ icon }
        { ...this.props }
      >
        <Form<FormValue>
          ref={ c => this.form = c! }
          value={ value }
          fieldDefinitions={ definitions }
          onSave={ this.onSave }
          location={ location }
        />

        <Message
          description={ t<string>(
            'widgetPositionHint', 
            'Widgets and their positions are browser-specific'
          ) }
          icon={ IconConstants.INFO }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<WidgetDialogProps>(
  withTranslation()(WidgetDialog),
  '/home/widget/:typeId/:widgetId?'
);