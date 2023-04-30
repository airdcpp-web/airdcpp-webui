import { pushUnique } from './BrowserUtils';
import { NavigateFunction, Location } from 'react-router-dom';

export const doSearch = (
  searchString: string,
  location: Location,
  navigate: NavigateFunction
) => {
  pushUnique(
    '/search',
    {
      state: {
        searchString,
      },
    },
    location,
    navigate
  );
};
