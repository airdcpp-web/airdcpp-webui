import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const searchDownloadHandler: UI.DownloadHandler<API.GroupedSearchResult> = (
  itemInfo,
  user,
  downloadData,
  instance,
) => {
  return SocketService.post(
    `${SearchConstants.MODULE_URL}/${instance!.id}/results/${itemInfo.id}/download`,
    downloadData,
  );
};

interface SearchData {
  query: Pick<API.SearchQuery, 'pattern'> & Partial<Omit<API.SearchQuery, 'pattern'>>;
  hub_urls: string[] | undefined | null;
  priority: API.PriorityEnum;
}

export const search = (instance: API.SearchInstance, data: SearchData) => {
  return SocketService.post<API.SearchResponse>(
    `${SearchConstants.INSTANCES_URL}/${instance.id}/hub_search`,
    data,
  );
};
