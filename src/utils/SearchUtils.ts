import { Location, History } from 'history';
import { pushUnique } from './BrowserUtils';

export const doSearch = (searchString: string, location: Location, history: History) => {
  pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      },
    },
    location,
    history
  );
};
