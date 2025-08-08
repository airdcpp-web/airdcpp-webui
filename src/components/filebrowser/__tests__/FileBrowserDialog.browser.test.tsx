import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataNode } from '@/tests/render/test-renderers';

import * as API from '@/types/api';

import { fireEvent, waitFor } from '@testing-library/dom';
import FilesystemConstants from '@/constants/FilesystemConstants';
import { FilesystemListContentResponse } from '@/tests/mocks/api/filesystem';
import { MenuFormDialog } from '@/components/action-menu/MenuFormDialog';
import {
  createTestModalController,
  useModalButton,
} from '@/tests/helpers/test-dialog-helpers';
import { clickButton, waitForData } from '@/tests/helpers/test-helpers';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

// tslint:disable:no-empty
describe('FileBrowserDialog', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // Browse dialog
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    const onDirectoryCreated = vi.fn();
    server.addRequestHandler(
      'POST',
      FilesystemConstants.DIRECTORY_URL,
      undefined,
      onDirectoryCreated,
    );

    return { commonData, server, onDirectoryCreated };
  };

  const renderDialog = async (fieldType: API.SettingTypeEnum, defaultValue = '') => {
    const { commonData, server, ...other } = await getSocket();

    const onSave = vi.fn(() => Promise.resolve());
    const caption = 'Test dialog';

    const FileBrowserDialogTest = () => {
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

    const renderData = renderDataNode(<FileBrowserDialogTest />, commonData);

    const modalController = createTestModalController(renderData);
    return { modalController, onSave, caption, ...renderData, ...other };
  };

  describe('directory selection', () => {
    test('should select initial', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog(API.SettingTypeEnum.DIRECTORY_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);
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
      clickButton('Browse', getByRole);
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
        onDirectoryCreated,
      } = await renderDialog(API.SettingTypeEnum.DIRECTORY_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);
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

      clickButton('Create', getByRole);
      await waitFor(() => {
        expect(onDirectoryCreated).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(container.querySelector('.ui.action.input.visible')).toBeFalsy();
      });

      // Select the new directory
      clickButton('Select', getByRole);

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);
  });

  describe('file selection', () => {
    test('should select existing', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog(API.SettingTypeEnum.EXISTING_FILE_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);
      await waitForData('Loading items', queryByText);

      // Go to child directory
      expect(fireEvent.click(getByText('2 folders'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      // Select a file
      clickButton('empty.txt', getByRole);

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);

    test('should select new', async () => {
      const userEvent = setupUserEvent();
      const {
        getByText,
        getByRole,
        modalController,
        queryByText,
        getByLabelText,
        onSave,
        caption,
      } = await renderDialog(API.SettingTypeEnum.FILE_PATH);

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);
      await waitForData('Loading items', queryByText);

      // Go to child directory
      expect(fireEvent.click(getByText('2 folders'))).toBeTruthy();
      await waitForData('Loading items', queryByText);

      // Enter name for the file
      await setInputFieldValues(
        { userEvent, getByLabelText },
        { Filename: 'new_file.txt' },
      );
      await userEvent.click(getByText('Select'));

      // Save
      await modalController.closeDialogButton('Continue');

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]).toMatchSnapshot();
    }, 100000);
  });
});
