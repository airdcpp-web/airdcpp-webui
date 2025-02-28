import { useCallback, useMemo, useRef } from 'react';

import Message from '@/components/semantic/Message';
import RouteModal from '@/components/semantic/RouteModal';

import IconConstants from '@/constants/IconConstants';

import Form, { FormSaveHandler } from '@/components/form/Form';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';

// import WidgetActions from '@/actions/reflux/WidgetActions';
// import WidgetStore from '@/stores/reflux/WidgetStore';
import {
  getWidgetT,
  createWidgetId,
  translateWidgetName,
  loadWidgetSettings,
  getWidgetInfoById,
} from '@/routes/Home/widgets/WidgetUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { translateForm } from '@/utils/FormUtils';
import { useParams } from 'react-router';
import { Widgets } from '../widgets';
import { UseLayoutStore } from '../stores/homeLayoutSlice';

type FormValue = Pick<UI.WidgetSettings, 'name'> & UI.WidgetSettings['widget'];

const settingsToFormValue = (
  widgetId: string | undefined,
  widgetInfo: UI.Widget,
): FormValue | undefined => {
  if (!widgetId) {
    return undefined;
  }

  const settings = loadWidgetSettings(widgetId, widgetInfo);
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
        default_value: widgetInfo.name,
        optional: true,
      },
    ],
    rootWidgetT,
  );

  if (widgetInfo.formSettings) {
    const widgetT = getWidgetT(widgetInfo, rootWidgetT.plainT);
    Entry.push(...translateForm(widgetInfo.formSettings, widgetT));
  }

  return Entry;
};

interface WidgetDialogProps {
  rootWidgetT: UI.ModuleTranslator;
  layoutStore: UseLayoutStore;
}

type Props = WidgetDialogProps & ModalRouteDecoratorChildProps;

const WidgetDialog: React.FC<Props> = ({ rootWidgetT, layoutStore }) => {
  const formRef = useRef<Form<FormValue> | null>(null);
  const params = useParams();

  const formData = useMemo(() => {
    const { typeId, widgetId } = params;
    const widgetInfo = getWidgetInfoById(typeId!, Widgets);
    if (!!widgetInfo) {
      return {
        value: settingsToFormValue(widgetId, widgetInfo),
        definitions: buildDefinitions(widgetInfo, rootWidgetT),
        widgetInfo,
      };
    }

    return null;
  }, []);

  const onSave = useCallback<FormSaveHandler<FormValue>>((changedFields, value) => {
    const { name, ...other } = value;
    const settings: UI.WidgetSettings = {
      name: name!,
      widget: other,
    };

    const { typeId, widgetId } = params;
    if (!widgetId) {
      // New widget
      layoutStore.getState().createWidget(createWidgetId(typeId!), settings, typeId!);
    } else {
      // Existing widget
      layoutStore.getState().updateWidget(widgetId, settings);
    }

    return Promise.resolve();
  }, []);

  if (!formData) {
    return null;
  }

  const { value, widgetInfo, definitions } = formData;
  const { icon } = widgetInfo;
  const { t } = rootWidgetT;
  return (
    <RouteModal
      className="home-widget"
      title={translateWidgetName(widgetInfo, rootWidgetT.plainT)}
      onApprove={() => formRef.current!.save()}
      icon={icon}
    >
      <Form<FormValue>
        ref={formRef}
        sourceValue={value}
        fieldDefinitions={definitions}
        onSave={onSave}
      />

      <Message
        description={t(
          'widgetPositionHint',
          'Widgets and their positions are browser-specific',
        )}
        icon={IconConstants.INFO}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<WidgetDialogProps>(
  WidgetDialog,
  '/widget/:typeId/:widgetId?',
);
