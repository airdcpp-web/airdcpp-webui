import { Component } from 'react';

import Modal from 'components/semantic/Modal';
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

interface RouteProps {
  extensionId: string;
}

type Props = ExtensionsConfigureDialogProps &
  DataProps &
  ModalRouteDecoratorChildProps<RouteProps>;

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
      <Modal
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
      </Modal>
    );
  }
}

export default ModalRouteDecorator<ExtensionsConfigureDialogProps, RouteProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(
    ExtensionsConfigureDialog,
    {
      urls: {
        fieldDefinitions: ({ match }) => {
          return SocketService.get(
            `${getSettingsUrl(match.params.extensionId)}/definitions`
          );
        },
        settings: ({ match }) =>
          SocketService.get(getSettingsUrl(match.params.extensionId)),
        extension: ({ match }, socket) => {
          return socket.get(
            `${ExtensionConstants.EXTENSIONS_URL}/${match.params.extensionId}`
          );
        },
      },
    }
  ),
  'extensions/:extensionId'
);
