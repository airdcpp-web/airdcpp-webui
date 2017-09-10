'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import TextDecorator from 'components/TextDecorator';


class TextFile extends React.Component {
  componentWillMount() {
    if (this.props.item.content_ready) {
      this.fetchText(this.props.url);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.item.content_ready) {
      return;
    }

    const idChanged = nextProps.item.id !== this.props.item.id;
    if (idChanged) {
      this.setState({
        text: null,
        error: null,
      });
    }

    if (idChanged || !this.props.item.content_ready) {
      this.fetchText(nextProps.url);
    }
  }

  fetchText = (url) => {
    $.get(url, this.onTextReceived, 'text')
      .fail(this.onTextFailed);
  };

  onTextFailed = (error) => {
    this.setState({ 
      error: error.responseText,
    });
  };

  onTextReceived = (text) => {
    this.setState({ 
      text,
    });
  };

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
