'use strict';
//@ts-ignore
import Reflux from 'reflux';
import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location } from 'history';


const SearchActionConfig: UI.RefluxActionConfigList<API.GroupedSearchResult> = [
  'search'
];

export const SearchActions = Reflux.createActions(SearchActionConfig);

SearchActions.search.listen((
  itemInfo: Pick<UI.DownloadableItemInfo, 'tth' | 'type' | 'name'>,
  location: Location
) => {
  const searchString = !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

  History.pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      }
    }, 
    location
  );
});

export default SearchActions as UI.RefluxActionListType<void>;
