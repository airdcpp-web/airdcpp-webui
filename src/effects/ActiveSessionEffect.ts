// TODO: can't read the state from inside an effect

/*'use strict';
import { useEffect, useState } from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import * as UI from 'types/ui';


type SessionType = UI.SessionItemBase;

export const useActiveSessionEffect = (
  session: SessionType,
  actions: UI.SessionActions<SessionType>,
  useReadDelay: boolean
) => {
  const [ readTimeout, setReadTimeout ] = useState<NodeJS.Timer | null>(null);

  useEffect(
    () => {
      {
        // Schedule the new session to be marked as read
        const delay = !useReadDelay ? 0 : LocalSettingStore.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;
        setReadTimeout(setTimeout(_ => actions.setRead(session), delay));
        
        actions.sessionChanged(session);
      }

      return () => {
        // Reset session

        if (!!readTimeout) {
          // Set the previously active session as read
          clearTimeout(readTimeout);
          setReadTimeout(null);

          actions.setRead(session);
        }
        
        actions.sessionChanged(null);
      };
    },
    [ session.id ]
  );
};*/
