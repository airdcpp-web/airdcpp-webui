import React from 'react';

import SocketService from 'services/SocketService';

import SearchConstants from 'constants/SearchConstants';

import History from 'utils/History';

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
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import LoginStore from 'stores/LoginStore';


const RESULT_WAIT_PERIOD = 4000;

interface SearchProps extends RouteComponentProps<{}> {

}

interface SearchDataProps extends DataProviderDecoratorChildProps, WithTranslation {
  instance: API.SearchInstance;
}

class Search extends React.Component<SearchProps & SearchDataProps> {
  state = {
    searchString: '',
    running: false
  };

  searchTimeout: NodeJS.Timer;

  componentDidMount() {
    this.checkLocationState(this.props);

    const { query } = this.props.instance;
    if (!!query) {
      this.setState({
        searchString: query.pattern
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
      History.replace({
        pathname: props.location.pathname,
      });
    }
  }

  search = async (searchString: string, options?: SearchOptions) => {
    console.log('Searching');

    clearTimeout(this.searchTimeout);

    const { hub_urls, ...queryOptions } = options || {};
    try {
      const res = await SocketService.post<API.SearchResponse>(`${SearchConstants.MODULE_URL}/${this.props.instance.id}/hub_search`, {
        query: {
          pattern: searchString,
          ...queryOptions,
        },
        priority: API.PriorityEnum.HIGH,
        hub_urls
      });

      this.onSearchPosted(res);
      this.setState({
        searchString,
        running: true 
      });
    } catch (error) {
      NotificationActions.apiError('Search failed', error);
    }
  }

  onSearchPosted = (data: API.SearchResponse) => {
    this.searchTimeout = setTimeout(
      () => {
        this.setState({ 
          running: false,
        });
      }, 
      data.queue_time + RESULT_WAIT_PERIOD
    );
  }

  parseOptions = () => {
    const { query } = this.props.instance;
    if (!query) {
      return null;
    }

    return {
      excluded: query.excluded,
      min_size: query.min_size,
      max_size: query.max_size,
      file_type: query.file_type === SearchConstants.DEFAULT_SEARCH_TYPE ? null : query.file_type,
      hub_urls: []
    };
  }

  searchT = getModuleT(this.props.t, UI.Modules.SEARCH);
  render() {
    const { instance, location } = this.props;
    const { searchString, running } = this.state;
    const { t } = this.searchT;
    return (
      <OfflineHubMessageDecorator 
        offlineMessage={ t<string>(
          'searchOffline', 
          'You must to be connected to at least one hub in order to perform searches'
        ) }
      >
        <div className="search-layout">
          <SearchInput
            moduleT={ this.searchT }
            running={ running }
            defaultValue={ searchString }
            handleSubmit={ this.search }
            location={ location }
            defaultOptions={ this.parseOptions() }
          />
          <ResultTable 
            searchString={ searchString } 
            running={ running }
            searchT={ this.searchT }
            instance={ instance }
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
      const instances = await socket.get<API.SearchInstance[]>(`${SearchConstants.INSTANCES_URL}`);

      const instance = instances.find(i => i.owner === `session:${LoginStore.sessionId}:${OWNER_ID_SUFFIX}`);
      if (!!instance) {
        return instance;
      }

      // Create new instance
      const instanceId = (await socket.post<{ id: number; }>(SearchConstants.INSTANCES_URL, {
        owner_suffix: OWNER_ID_SUFFIX
      })).id;

      return socket.get(`${SearchConstants.INSTANCES_URL}/${instanceId}`);
    }
  }
});
