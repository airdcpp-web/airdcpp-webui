import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderDataNode } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import * as API from '@/types/api';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { MessageComposer } from '../MessageComposer';
import { useTranslation } from 'react-i18next';
import { buildChatCommands } from '../commands/ChatCommands';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { waitFor } from '@testing-library/dom';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { installTempShareMocks } from '@/tests/mocks/mock-share';
import {
  clickButton,
  clickMenuItem,
  expectRequestToMatchSnapshot,
  waitForLoader,
} from '@/tests/helpers/test-helpers';
import { TempShareItem1 } from '@/tests/mocks/api/share';
import { formatTempShareDropdownItem } from '../TempShareDropdown';
import ShareConstants from '@/constants/ShareConstants';

describe('Message composer', () => {
  let server: MockServer;
  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    installTempShareMocks(server);

    return { commonData, server };
  };

  const renderLayout = async (settings: object = {}) => {
    const onUpload = vi.fn();

    const mockChatApi = {
      sendChatMessage: vi.fn(),
      sendStatusMessage: vi.fn(),
      fetchMessages: vi.fn(),

      setRead: vi.fn(),
      removeSession: vi.fn(),
    };

    const mockChatSession = {
      id: 'test-session',
      read: false,
    };

    const onClear = vi.fn(() => Promise.resolve());
    const mockChatCommands = buildChatCommands(API.AccessEnum.PRIVATE_CHAT_EDIT, onClear);

    const { commonData, server, ...other } = await getSocket();

    const MessageComposerLayoutTest = () => {
      const { t } = useTranslation();
      return (
        <MessageComposer
          t={t}
          handleFileUpload={onUpload}
          chatApi={mockChatApi}
          chatSession={mockChatSession}
          chatCommands={mockChatCommands}
          sessionType="mock_session_type"
        />
      );
    };

    const renderData = renderDataNode(
      <MessageComposerLayoutTest />,
      commonData,
      VIEW_FIXED_HEIGHT,
    );

    return {
      ...renderData,
      ...other,
      ...commonData,
      mockChatApi,
      mockChatSession,
      mockChatCommands,
      onClear,
      onUpload,
    };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  describe('Chat messages', () => {
    test('normal', async () => {
      const { getByRole, mockChatApi } = await renderLayout();

      await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

      // Use the send button
      const userEvent = setupUserEvent();
      const messageInput = getByRole('textbox');
      await userEvent.type(messageInput, 'Test message 1');
      await waitFor(() => getByRole('button', { name: 'Send message' }));
      await userEvent.click(getByRole('button', { name: 'Send message' }));
      await waitFor(() => {
        expect(messageInput).toHaveValue('');
      });

      expect(mockChatApi.sendChatMessage).toHaveBeenCalledTimes(1);
      expect(mockChatApi.sendChatMessage.mock.calls[0][2]).toMatchSnapshot();

      // Use the Enter key to send
      await userEvent.type(messageInput, 'Test message 2');
      await userEvent.keyboard('{Enter}');
      await waitFor(() => {
        expect(messageInput).toHaveValue('');
      });
      expect(mockChatApi.sendChatMessage).toHaveBeenCalledTimes(2);
    });

    test('third person', async () => {
      const { getByRole, mockChatApi } = await renderLayout();

      await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

      const userEvent = setupUserEvent();
      const messageInput = getByRole('textbox');
      await userEvent.type(messageInput, '/me Test message third person');
      await userEvent.keyboard('{Enter}');
      await waitFor(() => {
        expect(messageInput).toHaveValue('');
      });
      await waitFor(() => {
        expect(mockChatApi.sendChatMessage).toHaveBeenCalledTimes(2);
      });

      expect(mockChatApi.sendChatMessage.mock.calls[0][2]).toMatchSnapshot();
      expect(mockChatApi.sendChatMessage.mock.calls[1][2]).toMatchSnapshot();
    });
  });

  describe('Chat commands', () => {
    test('should handle help', async () => {
      const { getByRole, mockChatApi } = await renderLayout();

      await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

      // Use the send button
      const userEvent = setupUserEvent();
      const messageInput = getByRole('textbox');
      await userEvent.type(messageInput, '/help');
      await userEvent.keyboard('{Enter}');

      expect(mockChatApi.sendChatMessage).toHaveBeenCalledTimes(1);
      expect(mockChatApi.sendStatusMessage).toHaveBeenCalledTimes(1);
      expect(mockChatApi.sendStatusMessage.mock.calls[0][2]).toMatchSnapshot();
    });

    test('should handle clear', async () => {
      const { getByRole, onClear } = await renderLayout();

      await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

      // Use the send button
      const userEvent = setupUserEvent();
      const messageInput = getByRole('textbox');
      await userEvent.type(messageInput, '/clear');
      await userEvent.keyboard('{Enter}');

      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Temp share', () => {
    test('should add shared files', async () => {
      const { getByTestId, getByRole, findByText, onUpload } = await renderLayout();

      await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = getByTestId('dropzone');

      const userEvent = setupUserEvent();
      await userEvent.upload(input, file);

      await waitFor(() => expect(findByText('test.txt')).toBeTruthy());

      clickButton('Upload', getByRole);

      await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1));
      expect(onUpload.mock.calls[0]).toMatchInlineSnapshot(`
        [
          File {
            "path": "./test.txt",
            "relativePath": "./test.txt",
          },
        ]
      `);
    });

    test('should remove shared files', async () => {
      const { getByLabelText, queryByRole, getByRole } = await renderLayout();

      await waitForLoader(queryByRole);

      const userEvent = setupUserEvent();
      const dropdown = getByLabelText('Temp share');
      await userEvent.click(dropdown);

      const onItemRemoved = vi.fn();
      server.addRequestHandler(
        'DELETE',
        `${ShareConstants.TEMP_SHARES_URL}/${TempShareItem1.id}`,
        undefined,
        onItemRemoved,
      );

      await clickMenuItem(formatTempShareDropdownItem(TempShareItem1), getByRole);

      await waitFor(() => expect(onItemRemoved).toHaveBeenCalledTimes(1));
      expectRequestToMatchSnapshot(onItemRemoved);
    });
  });
});
