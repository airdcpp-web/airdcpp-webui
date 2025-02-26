import { useRef } from 'react';

import RouteModal from '@/components/semantic/RouteModal';
import Form, { FormSaveHandler } from '@/components/form/Form';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';

import ExtensionConstants from '@/constants/ExtensionConstants';
import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

const getSettingsUrl = (extensionId: string) => {
  return `${ExtensionConstants.EXTENSIONS_URL}/${extensionId}/settings`;
};

interface ExtensionsConfigureDialogProps {}

interface DataProps extends DataProviderDecoratorChildProps {
  fieldDefinitions: UI.FormFieldDefinition[];
  settings: UI.FormValueMap;
  extension: API.Extension;
}

type Props = ExtensionsConfigureDialogProps & DataProps & ModalRouteDecoratorChildProps;

const ExtensionsConfigureDialog: React.FC<Props> = ({
  extension,
  settings,
  fieldDefinitions,
  socket,
  ...other
}) => {
  const formRef = useRef<Form>(null);
  const handleSave = () => {
    return formRef.current!.save();
  };

  const onSave: FormSaveHandler<UI.FormValueMap> = (changedFields) => {
    return socket.patch(getSettingsUrl(extension.id), changedFields);
  };

  return (
    <RouteModal
      {...other}
      className="extensions configure"
      title={extension.name}
      onApprove={handleSave}
      closable={false}
      icon={IconConstants.EDIT}
      dynamicHeight={true}
    >
      <Form
        ref={formRef}
        onSave={onSave}
        fieldDefinitions={fieldDefinitions}
        sourceValue={settings}
      />
    </RouteModal>
  );
};

export default ModalRouteDecorator<ExtensionsConfigureDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(
    ExtensionsConfigureDialog,
    {
      urls: {
        fieldDefinitions: ({ params }, socket) => {
          return socket.get(`${getSettingsUrl(params.extensionId!)}/definitions`);
        },
        settings: ({ params }, socket) => socket.get(getSettingsUrl(params.extensionId!)),
        extension: ({ params }, socket) => {
          return socket.get(`${ExtensionConstants.EXTENSIONS_URL}/${params.extensionId}`);
        },
      },
    },
  ),
  'extensions/:extensionId',
);
