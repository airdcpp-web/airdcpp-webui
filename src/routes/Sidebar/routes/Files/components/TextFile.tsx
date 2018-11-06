'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import TextDecorator from 'components/TextDecorator';
import { FileSessionContentProps } from 'routes/Sidebar/routes/Files/components/FileSession';


class TextFile extends React.Component<FileSessionContentProps> {
  state = TextFile.getInitialState();

  static getInitialState() {
    return {
      text: null,
      error: null,
    };
  }

  componentDidMount() {
    if (this.props.item.content_ready) {
      this.fetchText(this.props.url);
    }
  }

  componentDidUpdate(prevProps: FileSessionContentProps) {
    if (!this.props.item.content_ready) {
      return;
    }

    const idChanged = prevProps.item.id !== this.props.item.id;
    if (idChanged) {
      this.setState(TextFile.getInitialState());
    }

    if (idChanged || !prevProps.item.content_ready) {
      this.fetchText(this.props.url);
    }
  }

  fetchText = (url: string) => {
    $.get(url, this.onTextReceived, 'text')
      .fail(this.onTextFailed);
  }

  onTextFailed = (error: any) => {
    this.setState({ 
      error: error.responseText,
    });
  }

  onTextReceived = (text: string) => {
    this.setState({ 
      text,
    });
  }

  render() {
    const { item } = this.props;
    const { text, error } = this.state;

    if (item.content_ready && !text) {
      if (error) {
        return (
          <Message
            title="Failed to fetch content"
            description={ error }
          />
        );
      }

      return <Loader text="Preparing view"/>;
    }

    return (
      <pre>
        <TextDecorator
          text={ text }
        />
      </pre>
    );
  }
}

export default TextFile;
