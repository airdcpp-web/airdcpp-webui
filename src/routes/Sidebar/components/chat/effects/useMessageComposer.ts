import React, { useEffect } from 'react';

import { OnChangeHandlerFunc } from 'react-mentions';

import * as UI from '@/types/ui';

import {
  loadSessionProperty,
  removeSessionProperty,
  saveSessionProperty,
} from '@/utils/BrowserUtils';
import ChatCommandHandler from '../commands/ChatCommandHandler';

import { useSocket } from '@/context/SocketContext';
import { useSession } from '@/context/AppStoreContext';

const loadState = (sessionStorageKey: string) => {
  const text = loadSessionProperty(sessionStorageKey, '');
  // console.log('Loading state for key:', sessionStorageKey, text);
  return text;
};

const saveState = (text: string, sessionStorageKey: string) => {
  if (text) {
    // console.log('Saving state for key:', sessionStorageKey, text);
    saveSessionProperty(sessionStorageKey, text);
  } else {
    // console.log('Removing state for key:', sessionStorageKey);
    removeSessionProperty(sessionStorageKey);
  }
};

const generateSessionStorageKey = (session: UI.SessionItem, sessionType: string) => {
  return `last_message_${sessionType}_${session.id}`;
};

interface MessageComposerProps {
  t: UI.TranslateF;
  chatController: UI.ChatController;
}

export const useMessageComposer = ({ chatController, t }: MessageComposerProps) => {
  const session = useSession();
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
      t,
      socket,
      session,
    });
  };

  const updateText = (newText: string) => {
    const storageKey = generateSessionStorageKey(
      chatController.chatSession,
      chatController.sessionType,
    );
    saveState(newText, storageKey);
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

  const handleSend = (text: string) => {
    const { chatApi, chatSession } = chatController;
    chatApi.sendChatMessage(socket, chatSession, { text });
  };

  useEffect(() => {
    const storageKey = generateSessionStorageKey(
      chatController.chatSession,
      chatController.sessionType,
    );
    setInputText(loadState(storageKey));
  }, [chatController.chatSession.id]);

  const onTextChanged: OnChangeHandlerFunc = (event, markupValue, plainValue) => {
    updateText(plainValue);
  };

  const sendText = () => {
    // Trim only from end to allow chat messages such as " +help" to be
    // sent to other users
    // This will also prevent sending empty messages
    const textTrimmed = inputText.replace(/\s+$/, '');

    if (textTrimmed) {
      if (textTrimmed.startsWith('/')) {
        handleCommand(textTrimmed);
      }

      // Commands will be sent as well because of API hooks (the API will detect those and handle accordingly)
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
