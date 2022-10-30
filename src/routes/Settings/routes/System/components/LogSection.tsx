import { Component } from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import '../style.css';
import { FormFieldChangeHandler, FormFieldSettingHandler } from 'components/form/Form';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

import * as API from 'types/api';

export interface LogSectionProps extends SettingSectionChildProps {
  section: string;
  simple?: boolean;
}

class LogSection extends Component<LogSectionProps> {
  state = {
    enabled: false,
  };

  convertKey = (suffix?: string) => {
    return `log_${this.props.section}${suffix ? `_${suffix}` : ''}`;
  }

  onSettingsReceived = (settings: API.SettingValueMap) => {
    this.setState({
      enabled: settings[this.convertKey()],
    });
  }

  onEnableStateChanged: FormFieldChangeHandler = (id, formValue, hasChanges) => {
    this.setState({ 
      enabled: formValue[id]
    });
  }

  onContentSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    fieldOptions.disabled = !this.state.enabled;
  }

  getChildClass = (className: string) => {
    if (this.state.enabled) {
      return className + ' active';
    }

    return className;
  }

  render() {
    const Title = [
      this.convertKey(),
    ];

    const Content = [
      this.convertKey('file'),
      this.convertKey('format'),
    ];

    const { simple, ...other } = this.props;
    return (
      <div className={ this.getChildClass('log-section') }>
        <div className={ this.getChildClass('title') }>
          <RemoteSettingForm
            { ...other }
            keys={ Title }
            onFieldChanged={ this.onEnableStateChanged }
            onSettingValuesReceived={ this.onSettingsReceived }
          />
        </div>

        { !simple && (
          <div className={ this.getChildClass('content') }>
            <RemoteSettingForm
              { ...this.props }
              keys={ Content }
              onFieldSetting={ this.onContentSetting }
            />
          </div>
        ) }
      </div>
    );
  }
}

export default LogSection;