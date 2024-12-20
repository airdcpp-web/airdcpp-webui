import { pushUnique } from './BrowserUtils';
import { NavigateFunction, Location } from 'react-router';

export const doSearch = (
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
