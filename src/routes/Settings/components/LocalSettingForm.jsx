import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';

import Form from 'components/form/Form';


class LocalSettingForm extends React.Component {
  static propTypes = {
    /**
		 * Form items to list
		 */
    keys: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.definitions = LocalSettingStore.getDefinitions(props.keys);

    this.state = {
      settings: LocalSettingStore.getValues(),
    };
  }

  onSave = (changedSettingArray) => {
    LocalSettingStore.setValues(changedSettingArray);

    this.setState({
      settings: LocalSettingStore.getValues(),
    });

    return Promise.resolve(null);
  };

  render() {
    const { settings } = this.state;
    const { formRef, ...otherProps } = this.props;
    return (
      <div className="local setting-form">
        <Form
          { ...otherProps }
          ref={ formRef }
          onSave={ this.onSave }
          fieldDefinitions={ this.definitions }
          value={ settings }
        />
      </div>
    );
  }
}

export default LocalSettingForm;