import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { changeFilelistDirectory } from '@/services/api/FilelistApi';
import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { Location, useNavigate } from 'react-router';

export type FilelistLocationState = { directory: string } | undefined;

interface ListBrowserProps {
  session: API.FilelistSession;
  location: Location;
  sessionT: UI.ModuleTranslator;
}

// Keeps the current location in sync with the backend
export const useSyncFilelistLocation = ({
  session,
  location,
  sessionT,
}: ListBrowserProps) => {
  const navigate = useNavigate();

  const apiSendChangeDirectory = (directory: string) => {
    runBackgroundSocketAction(
      () => changeFilelistDirectory(session, directory),
      sessionT.plainT,
    );
  };

  const updateLocationState = (directory: string, replace: boolean) => {
    const locationState = location.state as FilelistLocationState;
    if (directory === locationState?.directory) {
      return;
    }

    // Handle it through location state data
    // as we also handle history navigation changes
    const newState: FilelistLocationState = {
      directory,
    };

    navigate(location.pathname, {
      state: newState,
      replace,
    });
  };

  // Handler for directory changes received from the API
  React.useEffect(() => {
    const locationState = location.state as FilelistLocationState;

    if (!locationState) {
      // Initial mount
      updateLocationState(session.location!.path, true);
      return;
    }

    // Nothing has changed?
    if (locationState.directory === session.location!.path) {
      return;
    }

    // Change initiated by another session/GUI, update our location
    updateLocationState(session.location!.path, true);
  }, [session.location?.path]);

  // Handler for own changes
  React.useEffect(() => {
    const locationState = location.state as FilelistLocationState;
    if (!locationState) {
      // Initial mount, handled by the previous useEffect
      return;
    }

    const directory = locationState.directory;
    if (directory === session.location!.path) {
      return;
    }

    // It's our change
    if (directory) {
      apiSendChangeDirectory(directory);
    }
  }, [(location.state as FilelistLocationState)?.directory]);

  return updateLocationState;
};
