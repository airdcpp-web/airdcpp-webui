import React, { useEffect } from 'react';

import { OnChangeHandlerFunc } from 'react-mentions';
import { useLocation } from 'react-router';
import * as UI from 'types/ui';

import {
  loadSessionProperty,
  removeSessionProperty,
  saveSessionProperty,
} from 'utils/BrowserUtils';
import ChatCommandHandler from '../ChatCommandHandler';

import { Location, useNavigate } from 'react-router';
import { useSocket } from 'context/SocketContext';
import { useSession } from 'context/SessionContext';

const getStorageKey = (location: Location) => {
  return `last_message_${location.pathname}`;
};

const loadState = (location: Location) => {
  const text = loadSessionProperty(getStorageKey(location), '');
  return text;
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
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [inputText, setInputText] = React.useState('');
  const socket = useSocket();

  const handleCommand = (commandText: string) => {
    let command, params;

    {
      // Parse the command
      const whitespace = commandText.indexOf(' ');
      if (whitespace === -1) {
        command = commandText.substring(1);
      } else {
        command = commandText.substring(1, whitespace);
        params = commandText.substring(whitespace + 1);
      }
    }

    ChatCommandHandler(chatController).handle(command, params, {
      location,
      navigate,
      t,
      socket,
      session,
    });
  };

  const updateText = (newText: string) => {
    saveState(newText, location);
    setInputText(newText);
  };

  const appendText = (toAppend: string) => {
    let newText = inputText;
    if (newText) {
      newText += ' ';
    }
    newText += toAppend;

    updateText(newText);
  };

  const handleSend = (textToSend: string) => {
    const { chatApi, session } = chatController;
    chatApi.sendChatMessage(session, textToSend);
  };

  useEffect(() => {
    setInputText(loadState(location));
  }, [location.pathname]);

  const onTextChanged: OnChangeHandlerFunc = (event, markupValue, plainValue) => {
    updateText(plainValue);
  };

  const sendText = () => {
    // Trim only from end to allow chat messages such as " +help" to be
    // sent to other users
    // This will also prevent sending empty messages
    const textTrimmed = inputText.replace(/\s+$/, '');

    if (textTrimmed) {
      if (textTrimmed[0] === '/') {
        handleCommand(textTrimmed);
      }

      handleSend(textTrimmed);
    }

    updateText('');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendText();
    }
  };

  return {
    sendText,
    text: inputText,
    onKeyDown,
    onTextChanged,
    appendText,
  };
};
