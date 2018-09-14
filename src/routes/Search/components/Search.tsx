import React from 'react';

import SocketService from 'services/SocketService';

import { HistoryStringEnum } from 'constants/HistoryConstants';
import { PriorityEnum } from 'constants/PriorityConstants';
import SearchConstants from 'constants/SearchConstants';

import History from 'utils/History';
import HistoryInput from 'components/autosuggest/HistoryInput';

import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

import Button from 'components/semantic/Button';

import '../style.css';
import ResultTable from 'routes/Search/components/ResultTable';
import { RouteComponentProps } from 'react-router';


const SEARCH_PERIOD = 4000;

interface SearchProps extends RouteComponentProps<{}> {

}

class Search extends React.Component<SearchProps> {
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
      priority: PriorityEnum.HIGH,
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

  render() {
    const { searchString, running } = this.state;
    return (
      <OfflineHubMessageDecorator 
        offlineMessage="You must to be connected to at least one hub in order to perform searches"
      >
        <div className="search-layout">
          <div className="search-container">
            <div className="search-area">
              <HistoryInput 
                historyId={ HistoryStringEnum.SEARCH } 
                submitHandler={ this.search } 
                disabled={ running }
                defaultValue={ searchString }
                placeholder="Enter search string..."
                button={ 
                  <Button
                    icon="search icon"
                    caption="Search"
                    loading={ running }
                  />
                }
              />
            </div>
          </div>
          <ResultTable 
            searchString={ searchString } 
            running={ running }
          />
        </div>
      </OfflineHubMessageDecorator>
    );
  }
}

export default Search;
