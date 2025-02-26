import { pushUnique } from './BrowserUtils';
import { NavigateFunction, Location } from 'react-router';

import * as UI from '@/types/ui';

export const searchStringForeground = (
  searchString: string,
  location: Location,
  navigate: NavigateFunction,
) => {
  pushUnique(
    '/search',
    {
      state: {
        searchString,
      },
    },
    location,
    navigate,
  );
};

export const searchForeground = (
  itemInfo: Pick<UI.DownloadableItemInfo, 'type' | 'name'> & { tth?: string },
  location: Location,
  navigate: NavigateFunction,
) => {
  const searchString =
    !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;
  searchStringForeground(searchString, location, navigate);
};
