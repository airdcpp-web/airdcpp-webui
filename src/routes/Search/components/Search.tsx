import { Component } from 'react';

import SearchConstants from 'constants/SearchConstants';

import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

import '../style.css';
import ResultTable from 'routes/Search/components/ResultTable';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { WithTranslation } from 'react-i18next';
import { getModuleT } from 'utils/TranslationUtils';
import { SearchInput } from './SearchInput';
import { SearchOptions } from './options-panel';
import NotificationActions from 'actions/NotificationActions';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import LoginStore from 'stores/LoginStore';
import { search } from 'services/api/SearchApi';
import {
  loadSessionProperty,
  removeSessionProperty,
  saveSessionProperty,
} from 'utils/BrowserUtils';

const RESULT_WAIT_PERIOD = 4000;

interface SearchLocationState {
  searchString?: string;
}

type SearchProps = RouteComponentProps<UI.EmptyObject, any, SearchLocationState>;

interface SearchDataProps extends DataProviderDecoratorChildProps, WithTranslation {
  instance: API.SearchInstance;
}

const SEARCH_HUBS_KEY = 'search_hubs';

const loadHubOptions = () => {
  const options = loadSessionProperty<string[] | null>(SEARCH_HUBS_KEY, null);
  return options;
};

const saveHubOptions = (hubs: string[] | null) => {
  if (!hubs || !hubs.length) {
    removeSessionProperty(SEARCH_HUBS_KEY);
  } else {
    saveSessionProperty(SEARCH_HUBS_KEY, hubs);
  }
};

class Search extends Component<SearchProps & SearchDataProps> {
  state = {
    searchString: '',
    running: false,
  };

  searchTimeout: number | undefined;

  componentDidMount() {
    this.checkLocationState(this.props);

    const { query } = this.props.instance;
    if (!!query) {
      this.setState({
        searchString: query.pattern,
      });
    }
  }

  componentDidUpdate(prevProps: SearchProps) {
    this.checkLocationState(this.props);
  }

  checkLocationState = (props: SearchProps) => {
    const { state } = props.location;
    if (state && state.searchString && state.searchString !== this.state.searchString) {
      this.search(state.searchString);

      // Avoid searching for it again
      props.history.replace({
        pathname: props.location.pathname,
      });
    }
  };

  search = async (searchString: string, options?: SearchOptions) => {
    console.log('Searching');

    clearTimeout(this.searchTimeout);
    saveHubOptions(options?.hub_urls || null);

    const { hub_urls, size_limits, ...queryOptions } = options || {};
    try {
      const res = await search(this.props.instance, {
        query: {
          pattern: searchString,
          ...size_limits,
          ...queryOptions,
        },
        priority: API.PriorityEnum.HIGH,
        hub_urls,
      });

      this.onSearchPosted(res);
      this.setState({
        searchString,
        running: true,
      });
    } catch (error) {
      NotificationActions.apiError('Search failed', error);
    }
  };

  onSearchPosted = (data: API.SearchResponse) => {
    this.searchTimeout = window.setTimeout(() => {
      this.setState({
        running: false,
      });
    }, data.queue_time + RESULT_WAIT_PERIOD);
  };

  parseOptions = (): SearchOptions | null => {
    const { query } = this.props.instance;
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

  searchT = getModuleT(this.props.t, UI.Modules.SEARCH);
  render() {
    const { instance, location } = this.props;
    const { searchString, running } = this.state;
    const { t } = this.searchT;
    return (
      <OfflineHubMessageDecorator
        offlineMessage={t<string>(
          'searchOffline',
          'You must to be connected to at least one hub in order to perform searches'
        )}
      >
        <div className="search-layout">
          <SearchInput
            moduleT={this.searchT}
            running={running}
            defaultValue={searchString}
            handleSubmit={this.search}
            location={location}
            defaultOptions={this.parseOptions()}
          />
          <ResultTable
            searchString={searchString}
            running={running}
            searchT={this.searchT}
            instance={instance}
          />
        </div>
      </OfflineHubMessageDecorator>
    );
  }
}

const OWNER_ID_SUFFIX = 'webui';

export default DataProviderDecorator<SearchProps, SearchDataProps>(Search, {
  urls: {
    instance: async (props, socket) => {
      // Try to use a previously created instance for this session
      const instances = await socket.get<API.SearchInstance[]>(
        `${SearchConstants.INSTANCES_URL}`
      );

      const instance = instances.find(
        (i) => i.owner === `session:${LoginStore.sessionId}:${OWNER_ID_SUFFIX}`
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
