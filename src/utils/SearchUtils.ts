import History from 'utils/History';

import { Location } from 'history';

export const doSearch = (searchString: string, location: Location) => {
  History.pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      },
    },
    location
  );
};
