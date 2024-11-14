import { Component } from 'react';

import RouteModal from 'components/semantic/RouteModal';
import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const getSettingsUrl = (extensionId: string) => {
  return `${ExtensionConstants.EXTENSIONS_URL}/${extensionId}/settings`;
};

interface ExtensionsConfigureDialogProps {}

interface DataProps extends DataProviderDecoratorChildProps {
  fieldDefinitions: UI.FormFieldDefinition[];
  settings: UI.FormValueMap;
  extension: API.Extension;
}

/*interface RouteProps {
  extensionId: string;
}*/

type Props = ExtensionsConfigureDialogProps & DataProps & ModalRouteDecoratorChildProps;

class ExtensionsConfigureDialog extends Component<Props> {
  static displayName = 'ExtensionsConfigureDialog';

  form: Form;
  save = () => {
    return this.form.save();
  };

  onSave: FormSaveHandler<UI.FormValueMap> = (changedFields) => {
    return SocketService.patch(getSettingsUrl(this.props.extension.id), changedFields);
  };

  render() {
    const { extension, settings, fieldDefinitions, ...other } = this.props;
    return (
      <RouteModal
        {...other}
        className="extensions configure"
        title={extension.name}
        onApprove={this.save}
        closable={false}
        icon={IconConstants.EDIT}
        dynamicHeight={true}
      >
        <Form
          ref={(c: any) => (this.form = c!)}
          onSave={this.onSave}
          fieldDefinitions={fieldDefinitions}
          sourceValue={settings}
          location={this.props.location}
        />
      </RouteModal>
    );
  }
}

export default ModalRouteDecorator<ExtensionsConfigureDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(
    ExtensionsConfigureDialog,
    {
      urls: {
        fieldDefinitions: ({ params }) => {
          return SocketService.get(`${getSettingsUrl(params.extensionId!)}/definitions`);
        },
        settings: ({ params }) => SocketService.get(getSettingsUrl(params.extensionId!)),
        extension: ({ params }, socket) => {
          return socket.get(`${ExtensionConstants.EXTENSIONS_URL}/${params.extensionId}`);
        },
      },
    },
  ),
  'extensions/:extensionId',
);
