import * as React from 'react';

import '../style.css';
import * as UI from 'types/ui';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { widgetIdToLocalStateKey } from 'utils/WidgetUtils';

export type NotepadProps = UI.WidgetProps;
interface State {
  content: string;
}

class Notepad extends React.PureComponent<NotepadProps, State> {
  storageKey: string;

  constructor(props: NotepadProps) {
    super(props);

    const { componentId } = this.props;
    this.storageKey = widgetIdToLocalStateKey(componentId);
    this.state = this.getStoredState();
  }

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const data = {
      content: event.target.value,
    };

    saveLocalProperty(this.storageKey, data);
    this.setState(data);
  };

  getStoredState = (): State => {
    const defaultData = {
      content: '',
    };

    return loadLocalProperty(this.storageKey, defaultData);
  };

  render() {
    const { content } = this.state;
    return (
      <div className="notepad-container ui input fluid">
        <textarea onChange={this.handleChange} value={content} />
      </div>
    );
  }
}

export default Notepad;
