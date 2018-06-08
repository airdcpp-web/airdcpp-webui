import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';

import Form, { FormProps } from 'components/form/Form';
import { Omit } from 'types/utils';


export interface LocalSettingFormProps extends Omit<FormProps, 'onSave' | 'fieldDefinitions' | 'value'> {
  keys: string[];
}

class LocalSettingForm extends React.Component<LocalSettingFormProps> {
  static propTypes = {
    /**
		 * Form items to list
		 */
    keys: PropTypes.array.isRequired,
  };

  static contextTypes = {
    addFormRef: PropTypes.func.isRequired,
  };

  definitions: API.SettingDefinition[];
  state: {
    settings: API.SettingValueMap,
  }

  constructor(props: LocalSettingFormProps) {
    super(props);
    this.definitions = LocalSettingStore.getDefinitions(props.keys);

    this.state = {
      settings: LocalSettingStore.getValues(),
    };
  }

  onSave = (changedSettingArray: UI.FormValueMap) => {
    LocalSettingStore.setValues(changedSettingArray);

    this.setState({
      settings: LocalSettingStore.getValues(),
    });

    return Promise.resolve();
  };

  render() {
    const { settings } = this.state;
    const { addFormRef } = this.context;
    return (
      <div className="local setting-form">
        <Form
          { ...this.props }
          ref={ addFormRef }
          onSave={ this.onSave }
          fieldDefinitions={ this.definitions }
          value={ settings }
        />
      </div>
    );
  }
}

export default LocalSettingForm;