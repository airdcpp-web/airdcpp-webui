import React from 'react';

import '../style.css';
import * as UI from 'types/ui';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { widgetIdToSettingKey } from 'utils/WidgetUtils';

export type NotepadProps = UI.WidgetProps;
export type NotepadState = UI.WidgetSettings;

class Notepad extends React.PureComponent<NotepadProps, NotepadState> {

  constructor(props: any) {
    super(props);

    const { componentId } = this.props;

    const defaultData = {
      widget : {
        value : ''
      }
    };

    let state: any = loadLocalProperty(widgetIdToSettingKey(componentId), defaultData);
    this.state = state;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    const { componentId } = this.props;

    this.setState({widget : { value: event.target.value } } );
    saveLocalProperty(widgetIdToSettingKey(componentId), this.state);
  }

  render() {
    const { widget }: any = this.state;

    return (
      <div className="notepad-container">
        <div className="ui form">
          <div className="field">
            <textarea
              onChange={this.handleChange}
              value={widget.value}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Notepad;