import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { changeFilelistDirectory } from '@/services/api/FilelistApi';
import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { Location, useNavigate } from 'react-router';
import { useSocket } from '@/context/SocketContext';

export type FilelistLocationState = { directory: string } | undefined;

interface ListBrowserProps {
  filelist: API.FilelistSession;
  location: Location;
  sessionT: UI.ModuleTranslator;
}

// Keeps the current location in sync with the backend
export const useSyncFilelistLocation = ({
  filelist,
  location,
  sessionT,
}: ListBrowserProps) => {
  const navigate = useNavigate();
  const socket = useSocket();

  const apiSendChangeDirectory = (directory: string) => {
    runBackgroundSocketAction(
      () => changeFilelistDirectory(filelist, directory, socket),
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
      updateLocationState(filelist.location!.path, true);
      return;
    }

    // Nothing has changed?
    if (locationState.directory === filelist.location!.path) {
      return;
    }

    // Change initiated by another session/GUI, update our location
    updateLocationState(filelist.location!.path, true);
  }, [filelist.location?.path]);

  // Handler for own changes
  React.useEffect(() => {
    const locationState = location.state as FilelistLocationState;
    if (!locationState) {
      // Initial mount, handled by the previous useEffect
      return;
    }

    const directory = locationState.directory;
    if (directory === filelist.location!.path) {
      return;
    }

    // It's our change
    if (directory) {
      apiSendChangeDirectory(directory);
    }
  }, [(location.state as FilelistLocationState)?.directory]);

  return updateLocationState;
};
