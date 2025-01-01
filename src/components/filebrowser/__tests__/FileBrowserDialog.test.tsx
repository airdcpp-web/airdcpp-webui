import {
  getConnectedSocket,
  getMockServer,
} from 'airdcpp-apisocket/tests/mock-server.js';

import { jest } from '@jest/globals';
import { renderNode } from 'tests/test-containers';

import * as API from 'types/api';

import { fireEvent, waitFor } from '@testing-library/dom';
import FilesystemConstants from 'constants/FilesystemConstants';
import { FilesystemListContentResponse } from 'tests/mocks/api/filesystem';
import { MenuFormDialog } from 'components/action-menu/MenuFormDialog';
import { createTestModalController, useModalButton } from 'tests/test-dialog-helpers';
import { clickButton, waitForData } from 'tests/test-helpers';
import { setInputFieldValues, setupUserEvent } from 'tests/test-form-helpers';

// tslint:disable:no-empty
describe('FileBrowserDialog', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

    // Browse dialog
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    server.addRequestHandler('POST', FilesystemConstants.DIRECTORY_URL, undefined);

    return { socket, server };
  };

  const renderDialog = async (fieldType: API.SettingTypeEnum, defaultValue = '') => {
    const { socket, server, ...other } = await getSocket();

    const onSave = jest.fn(() => Promise.resolve());
    const caption = 'Test dialog';

    const ShareDirectoryDialogTest = () => {
      const FormDefinitions: API.SettingDefinition[] = [
        {
          key: fieldType,
          type: fieldType,
          default_value: defaultValue,
          title: fieldType,
        },
      ];

      const { open, onClose, button } = useModalButton();
      return (
        <>
          {button}
          {open && (
            <MenuFormDialog
              title={caption}
              onSave={onSave}
              icon="test"
              fieldDefinitions={FormDefinitions}
              onClose={onClose}
            />
          )}
        </>
      );
    };

    const renderData = renderNode(<ShareDirectoryDialogTest />, socket);

    const modalController = createTestModalController(renderData);
    return { modalController, onSave, caption, ...renderData, ...other };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  describe('directory selection', () => {
    test('should select initial', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog(API.SettingTypeEnum.DIRECTORY_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      clickButton('Select', getByRole);

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);

    test('should select child', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog(API.SettingTypeEnum.DIRECTORY_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      expect(fireEvent.click(getByText('2 folders'))).toBeTruthy();

      clickButton('Select', getByRole);

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);

    test('should create new directory', async () => {
      const userEvent = setupUserEvent();
      const {
        getByText,
        modalController,
        queryByText,
        getByRole,
        getByLabelText,
        onSave,
        caption,
        container,
      } = await renderDialog(API.SettingTypeEnum.DIRECTORY_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      // Create new directory
      expect(fireEvent.click(getByText('Create directory'))).toBeTruthy();
      await waitFor(() =>
        expect(container.querySelector('.ui.action.input.visible')).toBeTruthy(),
      );

      await setInputFieldValues(
        { userEvent, getByLabelText },
        { 'Create directory': 'New directory' },
      );

      expect(fireEvent.click(getByText('Create'))).toBeTruthy();
      await waitFor(() =>
        expect(container.querySelector('.ui.action.input.visible')).toBeFalsy(),
      );

      // Select the new directory
      clickButton('Select', getByRole);

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);
  });

  describe('file selection', () => {
    test.skip('should select existing', async () => {
      const { getByText, modalController, queryByText, onSave, caption } =
        await renderDialog(API.SettingTypeEnum.EXISTING_FILE_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      // Go to child directory
      expect(fireEvent.click(getByText('2 folders'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      // Save
      await modalController.closeDialogButton('empty.txt');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);
  });
});
