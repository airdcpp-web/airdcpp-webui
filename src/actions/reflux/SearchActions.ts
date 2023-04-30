//@ts-ignore
import Reflux from 'reflux';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { doSearch } from 'utils/SearchUtils';
import { NavigateFunction, Location } from 'react-router-dom';

const SearchActionConfig: UI.RefluxActionConfigList<API.GroupedSearchResult> = ['search'];

export const SearchActions = Reflux.createActions(SearchActionConfig);

SearchActions.search.listen(
  (
    itemInfo: Pick<UI.DownloadableItemInfo, 'tth' | 'type' | 'name'>,
    location: Location,
    navigate: NavigateFunction
  ) => {
    const searchString =
      !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;
    doSearch(searchString, location, navigate);
  }
);

export default SearchActions as UI.RefluxActionListType<void>;
