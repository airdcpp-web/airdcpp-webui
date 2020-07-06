import React from 'react';

import '../style.css';
import * as UI from 'types/ui';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { widgetIdToLocalStateKey } from 'utils/WidgetUtils';

export type NotepadProps = UI.WidgetProps;

class Notepad extends React.PureComponent<NotepadProps, any> {
  key: string;

  constructor(props: any) {
    super(props);

    const { componentId } = this.props;
    this.key = widgetIdToLocalStateKey(componentId);

    this.state = this.getStoredState();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    const data: Object = {
      content: event.target.value
    };
    saveLocalProperty(this.key, data);
    this.setState(data);
  }

  getStoredState() {
    const defaultData = {
      content : ''
    };

    const data: Object = loadLocalProperty(this.key, defaultData);
    if (typeof data === undefined) {
      return defaultData;
    }

    return data;
  }

  render() {
    return (
      <div className="notepad-container ui input fluid">
        <textarea
          onChange={this.handleChange}
          value={this.state.content}
        />
      </div>
    );
  }
}

export default Notepad;