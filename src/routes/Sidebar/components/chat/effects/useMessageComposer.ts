import * as React from 'react';

import { OnChangeHandlerFunc } from 'react-mentions';
import { useLocation } from 'react-router-dom';
import * as UI from 'types/ui';

import {
  loadSessionProperty,
  removeSessionProperty,
  saveSessionProperty,
} from 'utils/BrowserUtils';
import ChatCommandHandler from '../ChatCommandHandler';

import { Location, useNavigate } from 'react-router-dom';

const getStorageKey = (location: Location) => {
  return `last_message_${location.pathname}`;
};

const loadState = (location: Location) => {
  return loadSessionProperty(getStorageKey(location), '');
};

const saveState = (text: string, location: Location) => {
  if (text) {
    saveSessionProperty(getStorageKey(location), text);
  } else {
    removeSessionProperty(getStorageKey(location));
  }
};

interface MessageComposerProps {
  t: UI.TranslateF;
  chatController: UI.ChatController;
}

export const useMessageComposer = ({ chatController, t }: MessageComposerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [text, setText] = React.useState('');

  const handleCommand = (text: string) => {
    let command, params;

    {
      // Parse the command
      const whitespace = text.indexOf(' ');
      if (whitespace === -1) {
        command = text.substring(1);
      } else {
        command = text.substring(1, whitespace - 1);
        params = text.substring(whitespace + 1);
      }
    }

    ChatCommandHandler(chatController).handle(command, params, { location, navigate, t });
  };

  const appendText = (text: string) => {
    let newText = text;
    if (newText) {
      newText += ' ';
    }
    newText += text;

    setText(newText);
  };

  const handleSend = (textToSend: string) => {
    const { chatApi, session } = chatController;
    chatApi.sendChatMessage(session, textToSend);
  };

  /*React.useEffect(() => {
    return () => {
      saveState(text, location);
    };
  }, []);*/

  React.useEffect(() => {
    setText(loadState(location));
    /*return () => {
      saveState(text, location);
    };*/
  }, [location.pathname]);

  React.useEffect(() => {
    return () => {
      saveState(text, location);
    };
  }, [text]);

  const onTextChanged: OnChangeHandlerFunc = (event, markupValue, plainValue) => {
    setText(plainValue);
  };

  const sendText = () => {
    // Trim only from end to allow chat messages such as " +help" to be
    // sent to other users
    // This will also prevent sending empty messages
    const textTrimmed = text.replace(/\s+$/, '');

    if (textTrimmed) {
      if (textTrimmed[0] === '/') {
        handleCommand(textTrimmed);
      }

      handleSend(textTrimmed);
    }

    setText('');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendText();
    }
  };

  return {
    sendText,
    text,
    onKeyDown,
    onTextChanged,
    appendText,
  };
};
