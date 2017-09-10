import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import '../style.css';


const LogSection = React.createClass({
  convertKey(suffix) {
    return 'log_' + this.props.section + (suffix ? ('_' + suffix) : '');
  },

  getInitialState() {
    return {
      enabled: false,
    };
  },

  onSettingsReceived(data) {
    this.setState({
      enabled: data[this.convertKey()],
    });
  },

  onEnableStateChanged(id, formValue, hasChanges) {
    this.setState({ enabled: formValue[id] });
  },

  onContentSetting(id, fieldOptions, formValue) {
    fieldOptions['disabled'] = !this.state.enabled;
  },

  getChildClass(className) {
    if (this.state.enabled) {
      return className + ' active';
    }

    return className;
  },

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
});

export default LogSection;