import React from 'react';

import '../style.css';
import * as UI from 'types/ui';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { widgetIdToLocalStateKey } from 'utils/WidgetUtils';

export type NotepadProps = UI.WidgetProps;
export type NotepadState = UI.WidgetSettings; 

class Notepad extends React.PureComponent<NotepadProps, NotepadState> {
  key: string;

  constructor(props: any) {
    super(props);

    const { componentId } = this.props;
    this.key = widgetIdToLocalStateKey(componentId);

    let state: any = { widget: this.getStoredState() };
    this.state = state;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    const data = {
      content: event.target.value
    };
    saveLocalProperty(this.key, data);
    this.setState({widget: data});
  }

  getStoredState() {
    const defaultData = {
      content : ''
    };

    let data: any = loadLocalProperty(this.key, defaultData);
    if (typeof data === undefined) {
      return defaultData;
    }

    return data;
  }

  render() {
    const { widget }: any = this.state;

    return (
      <div className="notepad-container ui input fluid">
        <textarea
          onChange={this.handleChange}
          value={widget.content}
        />
      </div>
    );
  }
}

export default Notepad;