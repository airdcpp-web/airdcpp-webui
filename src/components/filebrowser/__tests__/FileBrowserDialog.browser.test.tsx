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
import {
  clickButton,
  waitExpectRequestToMatchSnapshot,
  waitForData,
} from '@/tests/helpers/test-helpers';
import {
  setInputFieldValues,
  setInputFieldValuesByPlaceholder,
  setupUserEvent,
} from '@/tests/helpers/test-form-helpers';
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

  const getSocket = async (platform: API.PlatformEnum, disableLogging = false) => {
    const commonData = await initCommonDataMocks(server, {
      platform,
      socketOptions: { logLevel: disableLogging ? 'none' : 'warn' },
    });

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

  interface RenderProps {
    fieldType: API.SettingTypeEnum;
    initialPath?: string;
    platform: API.PlatformEnum;
    disableLogging?: boolean;
  }

  const renderDialog = async ({
    fieldType,
    initialPath = '',
    platform,
    disableLogging,
  }: RenderProps) => {
    const { commonData, server, ...other } = await getSocket(platform, disableLogging);

    const onSave = vi.fn(() => Promise.resolve());
    const caption = 'Test dialog';

    const FileBrowserDialogTest = () => {
      const FormDefinitions: API.SettingDefinition[] = [
        {
          key: fieldType,
          type: fieldType,
          default_value: initialPath,
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

    const userEvent = setupUserEvent();
    const modalController = createTestModalController({ ...renderData, userEvent });
    return { modalController, onSave, caption, userEvent, ...renderData, ...other };
  };

  describe('directory selection', () => {
    test('should select initial directory on linux', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog({
          fieldType: API.SettingTypeEnum.DIRECTORY_PATH,
          platform: API.PlatformEnum.LINUX,
        });

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

    test('should not select root on windows', async () => {
      const { getByText, modalController, queryByText, getByRole, /*onSave,*/ caption } =
        await renderDialog({
          fieldType: API.SettingTypeEnum.DIRECTORY_PATH,
          platform: API.PlatformEnum.WINDOWS,
        });

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);
      await waitForData('Loading items', queryByText);

      expect(getByText('Select').closest('button')).toHaveClass('disabled');
    }, 100000);

    test('should select child', async () => {
      const { getByText, modalController, queryByText, getByRole, onSave, caption } =
        await renderDialog({
          fieldType: API.SettingTypeEnum.DIRECTORY_PATH,
          platform: API.PlatformEnum.LINUX,
        });

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
      const renderResult = await renderDialog({
        fieldType: API.SettingTypeEnum.DIRECTORY_PATH,
        platform: API.PlatformEnum.LINUX,
      });
      const {
        getByText,
        modalController,
        queryByText,
        getByRole,
        onSave,
        caption,
        container,
        onDirectoryCreated,
        userEvent,
      } = renderResult;

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

      userEvent.click(getByText('Create directory'));
      // await setInputFieldValues(renderResult, { 'Create directory': 'New directory' });

      await setInputFieldValuesByPlaceholder(renderResult, {
        'Directory name': 'New directory',
      });

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
        await renderDialog({
          fieldType: API.SettingTypeEnum.EXISTING_FILE_PATH,
          platform: API.PlatformEnum.LINUX,
        });

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
      } = await renderDialog({
        fieldType: API.SettingTypeEnum.FILE_PATH,
        platform: API.PlatformEnum.LINUX,
      });

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

  describe('errors', () => {
    const testErrorPlatform = async (errorPath: string, platform: API.PlatformEnum) => {
      const { getByText, modalController, getByRole, /*, onSave,*/ caption } =
        await renderDialog({
          fieldType: API.SettingTypeEnum.DIRECTORY_PATH,
          platform,
          initialPath: errorPath,
          disableLogging: true,
        });

      const onSuccessListContent = vi.fn();
      const onFailListContent = vi.fn(() => {
        // Set up success response for retries
        server.addRequestHandler(
          'POST',
          FilesystemConstants.LIST_URL,
          FilesystemListContentResponse,
          onSuccessListContent,
        );
      });

      // Set up error response for the initial loading
      server.addErrorHandler(
        'POST',
        FilesystemConstants.LIST_URL,
        "Directory '/non/existing/path' does not exist",
        400,
        onFailListContent,
      );

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      // Open dialog
      clickButton('Browse', getByRole);

      await waitExpectRequestToMatchSnapshot(onFailListContent);
      await waitExpectRequestToMatchSnapshot(onSuccessListContent);
    };

    test('should handle non-existing directories on initial loading on linux', async () => {
      const errorPath = '/non/existing/path/';
      await testErrorPlatform(errorPath, API.PlatformEnum.LINUX);
    }, 100000);

    test('should handle non-existing directories on initial loading on windows', async () => {
      const errorPath = 'C:\\non\\existing\\path\\';
      await testErrorPlatform(errorPath, API.PlatformEnum.WINDOWS);
    }, 100000);
  });
});
