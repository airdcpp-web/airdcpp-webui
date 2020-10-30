import { Component } from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import '../style.css';
import { FormSourceValueUpdateHandler, FormFieldChangeHandler, FormFieldSettingHandler } from 'components/form/Form';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


export interface LogSectionProps extends SettingSectionChildProps {
  section: string;
}

class LogSection extends Component<LogSectionProps> {
  state = {
    enabled: false,
  };

  convertKey = (suffix?: string) => {
    return `log_${this.props.section}${suffix ? `_${suffix}` : ''}`;
  }

  onSettingsReceived: FormSourceValueUpdateHandler = (data) => {
    this.setState({
      enabled: data[this.convertKey()],
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

    return (
      <div className={ this.getChildClass('log-section') }>
        <div className={ this.getChildClass('title') }>
          <RemoteSettingForm
            { ...this.props }
            keys={ Title }
            onFieldChanged={ this.onEnableStateChanged }
            onSourceValueUpdated={ this.onSettingsReceived }
          />
        </div>

        <div className={ this.getChildClass('content') }>
          <RemoteSettingForm
            { ...this.props }
            keys={ Content }
            onFieldSetting={ this.onContentSetting }
          />
        </div>
      </div>
    );
  }
}

export default LogSection;