import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { waitFor } from '@testing-library/dom';

import MainLayoutNormal from '../MainLayoutNormal';
import { NavigateBackCaption } from '@/tests/helpers/test-route-helpers';

import { clickButton, clickIconButton, waitForUrl } from '@/tests/helpers/test-helpers';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

import {
  clickMenuItem,
  clickNavigationMenuItem,
  openMenu,
} from '@/tests/helpers/test-menu-helpers';
import {
  createMainLayout,
  MainLayoutCaptions,
  MainLayoutRoutes,
} from './main-layout-helpers';
import MainLayoutMobile from '../MainLayoutMobile';
import { VIEW_SCROLLABLE } from '@/tests/render/test-containers';

import { page } from '@vitest/browser/context';

const HashDialogOpenCaption = 'Hash progress';

// tslint:disable:no-empty
describe('MainLayout', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  describe('normal layout', () => {
    const renderNormalLayout = createMainLayout(MainLayoutNormal, VIEW_SCROLLABLE);

    test('should close modals when opening sidebar', async () => {
      const { getByText, modalController, queryByText, getByRole } =
        await renderNormalLayout(server);

      // Open dialog in the main layout
      await modalController.openDialog(MainLayoutCaptions.mainDialogOpen);
      await waitFor(() => modalController.expectDialogOpen());

      // Open sidebar
      clickButton(MainLayoutCaptions.mainDialogSidebarOpen, getByRole);
      await waitFor(() =>
        expect(getByText(MainLayoutCaptions.sidebarRouteContent)).toBeTruthy(),
      );

      // Dialog should now be closed
      await waitFor(() => modalController.expectDialogClosed());

      // Navigate back to the modal
      clickButton(NavigateBackCaption, getByRole);
      await waitFor(() => modalController.expectDialogOpen());

      // Sidebar should be closed
      await waitFor(() =>
        expect(
          queryByText(MainLayoutCaptions.sidebarRouteContent),
        ).not.toBeInTheDocument(),
      );
    });

    test('should open modals in sidebar', async () => {
      const renderData = await renderNormalLayout(server);
      const { getByText, modalController, getByRole } = renderData;

      // Open sidebar
      await clickNavigationMenuItem(MainLayoutCaptions.sidebarRouteMenu, renderData);
      await waitFor(() =>
        expect(getByText(MainLayoutCaptions.sidebarRouteContent)).toBeTruthy(),
      );

      // Open sidebar dialog
      await modalController.openDialog(MainLayoutCaptions.sidebarDialogOpen);
      await waitFor(() => modalController.expectDialogOpen());

      // Navigate back to the modal
      clickButton(NavigateBackCaption, getByRole);
      await waitFor(() => modalController.expectDialogClosed());

      // Sidebar should still be open
      await waitFor(() =>
        expect(getByText(MainLayoutCaptions.sidebarRouteContent)).toBeTruthy(),
      );
    });

    test('should open hashing dialog', async () => {
      const renderData = await renderNormalLayout(server);
      const { getByText, modalController, getByRole } = renderData;

      // Open sidebar
      await clickNavigationMenuItem(MainLayoutCaptions.sidebarRouteMenu, renderData);
      await waitFor(() =>
        expect(getByText(MainLayoutCaptions.sidebarRouteContent)).toBeTruthy(),
      );

      // Open hashing dialog
      await modalController.openDialog(HashDialogOpenCaption, { iconButton: true });
      await waitFor(() => modalController.expectDialogOpen());

      expect(getByRole('button', { name: 'Stop' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Pause' })).toBeInTheDocument();

      // Close the dialog
      clickButton('Close', getByRole);
      await waitFor(() => modalController.expectDialogClosed());

      // Sidebar should still be open
      await waitFor(() =>
        expect(getByText(MainLayoutCaptions.sidebarRouteContent)).toBeTruthy(),
      );
    });
  });

  const runMobileViewport = () => {
    beforeEach(async () => {
      await page.viewport(680, 480);
    });

    afterEach(async () => {
      // Reset so following tests aren’t affected
      await page.viewport(1200, 600);
    });
  };

  describe('mobile layout', () => {
    runMobileViewport();

    const renderMobileLayout = createMainLayout(MainLayoutMobile, VIEW_SCROLLABLE);

    test('should handle navigation', async () => {
      const renderResult = await renderMobileLayout(server);

      const { findByText, findByLabelText, queryByText, router } = renderResult;

      await findByLabelText('Main menu');

      // Open main menu
      await clickIconButton('Main menu', renderResult);
      await findByLabelText('Main navigation');

      // Open secondary dropdown menu
      await openMenu('More...', renderResult);

      // Go to secondary route
      await clickMenuItem(MainLayoutCaptions.secondaryRouteMenuCaption, renderResult);

      await waitForUrl(MainLayoutRoutes.secondary, router);
      await findByText(MainLayoutCaptions.secondaryRouteContent);

      // Check that the sidebar is closed
      expect(queryByText('Main navigation')).not.toBeInTheDocument();
    });
  });
});
