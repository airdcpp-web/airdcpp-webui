import { useEffect, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import NotificationActions from '@/actions/NotificationActions';
import SearchConstants from '@/constants/SearchConstants';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import OfflineHubMessageDecorator from '@/decorators/OfflineHubMessageDecorator';
import LoginStore from '@/stores/reflux/LoginStore';
import { search as doSearch } from '@/services/api/SearchApi';
import { getModuleT } from '@/utils/TranslationUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import ResultTable from '@/routes/Search/components/ResultTable';

import { SearchInput } from './SearchInput';
import { SearchOptions } from './options-panel';
import {
  loadSessionProperty,
  removeSessionProperty,
  saveSessionProperty,
} from '@/utils/BrowserUtils';

import '../style.css';

const RESULT_WAIT_PERIOD = 4000;

interface SearchProps {}

interface SearchDataProps extends DataProviderDecoratorChildProps, WithTranslation {
  instance: API.SearchInstance;
}

const SEARCH_HUBS_KEY = 'search_hubs';

const loadHubOptions = () => {
  const options = loadSessionProperty<string[] | null>(SEARCH_HUBS_KEY, null);
  return options;
};

const saveHubOptions = (hubs: string[] | null) => {
  if (!hubs?.length) {
    removeSessionProperty(SEARCH_HUBS_KEY);
  } else {
    saveSessionProperty(SEARCH_HUBS_KEY, hubs);
  }
};

const Search: React.FC<SearchDataProps> = ({ instance, t }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState('');
  const [running, setRunning] = useState<API.SearchResponse | null>(null);

  const parseOptions = (): SearchOptions | null => {
    const { query } = instance;
    if (!query) {
      return null;
    }

    return {
      excluded: query.excluded,
      size_limits: {
        min_size: query.min_size,
        max_size: query.max_size,
      },
      file_type:
        query.file_type === SearchConstants.DEFAULT_SEARCH_TYPE ||
        query.file_type === 'tth'
          ? null
          : query.file_type,
      hub_urls: loadHubOptions(),
    };
  };

  const search = async (pattern: string, options?: SearchOptions) => {
    console.log('Searching');
    saveHubOptions(options?.hub_urls || null);

    const { hub_urls, size_limits, ...queryOptions } = options || {};
    try {
      const res = await doSearch(instance, {
        query: {
          pattern,
          ...size_limits,
          ...queryOptions,
        },
        priority: API.PriorityEnum.HIGH,
        hub_urls,
      });

      setSearchString(pattern);
      setRunning(res);
    } catch (error) {
      NotificationActions.apiError('Search failed', error);
    }
  };

  const checkLocationState = () => {
    const { state } = location;
    if (state?.searchString /* && state.searchString !== searchString*/) {
      search(state.searchString);

      // Avoid searching for it again
      navigate(location.pathname, { replace: true });
    }
  };

  useEffect(() => {
    checkLocationState();

    const { query } = instance;
    if (!!query) {
      setSearchString(query.pattern);
    }
  }, []);

  useEffect(() => {
    checkLocationState();
  }, [location.state?.searchString]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const searchTimeout = window.setTimeout(() => {
      setRunning(null);
    }, running.queue_time + RESULT_WAIT_PERIOD);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [running]);

  const searchT = getModuleT(t, UI.Modules.SEARCH);
  return (
    <OfflineHubMessageDecorator
      offlineMessage={searchT.t(
        'searchOffline',
        'You must to be connected to at least one hub in order to perform searches',
      )}
    >
      <div className="search-layout">
        <SearchInput
          moduleT={searchT}
          running={!!running}
          defaultValue={searchString}
          handleSubmit={search}
          defaultOptions={parseOptions()}
        />
        <ResultTable
          searchString={searchString}
          running={!!running}
          searchT={searchT}
          instance={instance}
        />
      </div>
    </OfflineHubMessageDecorator>
  );
};

const OWNER_ID_SUFFIX = 'webui';

export default DataProviderDecorator<SearchProps, SearchDataProps>(Search, {
  urls: {
    instance: async (props, socket) => {
      // Try to use a previously created instance for this session
      const instances = await socket.get<API.SearchInstance[]>(
        `${SearchConstants.INSTANCES_URL}`,
      );

      const instance = instances.find(
        (i) => i.owner === `session:${LoginStore.sessionId}:${OWNER_ID_SUFFIX}`,
      );
      if (!!instance) {
        return instance;
      }

      // Create new instance
      const instanceId = (
        await socket.post<{ id: number }>(SearchConstants.INSTANCES_URL, {
          owner_suffix: OWNER_ID_SUFFIX,
          expiration: 0,
        })
      ).id;

      return socket.get(`${SearchConstants.INSTANCES_URL}/${instanceId}`);
    },
  },
});
