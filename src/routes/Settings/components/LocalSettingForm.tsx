//import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';

import Form, { FormProps, FormSaveHandler, FormFieldChangeHandler } from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { withSaveContext, SaveContextProps } from '../decorators/SaveDecorator';
import { RouteComponentProps } from 'react-router';
import { translateForm } from 'utils/FormUtils';


export interface LocalSettingFormProps extends Omit<FormProps, 'onSave' | 'fieldDefinitions' | 'value'> {
  keys: string[];
  settingsT: UI.ModuleTranslator;
}


type Props = LocalSettingFormProps & SaveContextProps & RouteComponentProps;

class LocalSettingForm extends React.Component<Props> {
  /*static propTypes = {
    // Form items to list
    keys: PropTypes.array.isRequired,
  };*/

  definitions: UI.FormFieldDefinition[];
  state: {
    settings: API.SettingValueMap,
  };

  constructor(props: Props) {
    super(props);

    this.definitions = translateForm(LocalSettingStore.getDefinitions(props.keys), props.settingsT);

    this.state = {
      settings: LocalSettingStore.getValues(),
    };
  }

  onSave: FormSaveHandler<UI.FormValueMap> = (changedSettingArray) => {
    LocalSettingStore.setValues(changedSettingArray);

    this.setState({
      settings: LocalSettingStore.getValues(),
    });

    return Promise.resolve();
  }

  onFieldChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
    const { saveContext, onFieldChanged } = this.props;
    saveContext.onFieldChanged(id, value, hasChanges);
    if (onFieldChanged) {
      return onFieldChanged(id, value, hasChanges);
    }
  }

  render() {
    const { settings } = this.state;
    const { saveContext } = this.props;
    return (
      <div className="local setting-form">
        <Form
          { ...this.props }
          ref={ saveContext.addFormRef }
          onSave={ this.onSave }
          fieldDefinitions={ this.definitions }
          value={ settings }
          onFieldChanged={ this.onFieldChanged }
        />
      </div>
    );
  }
}

export default withSaveContext(LocalSettingForm);