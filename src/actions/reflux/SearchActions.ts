//@ts-ignore
import Reflux from 'reflux';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location, History } from 'history';
import { doSearch } from 'utils/SearchUtils';

const SearchActionConfig: UI.RefluxActionConfigList<API.GroupedSearchResult> = ['search'];

export const SearchActions = Reflux.createActions(SearchActionConfig);

SearchActions.search.listen(
  (
    itemInfo: Pick<UI.DownloadableItemInfo, 'tth' | 'type' | 'name'>,
    location: Location,
    history: History
  ) => {
    const searchString =
      !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;
    doSearch(searchString, location, history);
  }
);

export default SearchActions as UI.RefluxActionListType<void>;
