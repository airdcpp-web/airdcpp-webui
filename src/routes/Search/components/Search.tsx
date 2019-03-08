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

import { withTranslation, WithTranslation } from 'react-i18next';
import { getModuleT } from 'utils/TranslationUtils';
import { SearchInput } from './SearchInput';


const SEARCH_PERIOD = 4000;

interface SearchProps extends RouteComponentProps<{}> {

}

class Search extends React.Component<SearchProps & WithTranslation> {
  state = {
    searchString: '',
    running: false
  };

  _searchTimeout: NodeJS.Timer;

  componentDidMount() {
    this.checkLocationState(this.props);
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

  search = (searchString: string) => {
    console.log('Searching');

    clearTimeout(this._searchTimeout);

    SocketService.post(SearchConstants.HUB_SEARCH_URL, {
      query: {
        pattern: searchString,
      },
      priority: API.PriorityEnum.HIGH,
    })
      .then(this.onSearchPosted)
      .catch((error: string) => 
        console.error('Failed to post search: ' + error)
      );

    this.setState({
      searchString,
      running: true 
    });
  }

  onSearchPosted = (data: API.SearchResponse) => {
    this._searchTimeout = setTimeout(
      () => {
        this.setState({ 
          running: false,
        });
      }, 
      data.queue_time + SEARCH_PERIOD
    );
  }

  searchT = getModuleT(this.props.t, UI.Modules.SEARCH);
  render() {
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
          />
          <ResultTable 
            searchString={ searchString } 
            running={ running }
            searchT={ this.searchT }
          />
        </div>
      </OfflineHubMessageDecorator>
    );
  }
}

export default withTranslation()(Search);
