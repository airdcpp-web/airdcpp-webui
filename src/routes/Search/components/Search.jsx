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
import ResultTable from './ResultTable';

const SEARCH_PERIOD = 4000;

const Search = React.createClass({
  getInitialState() {
    return {
      searchString: '',
      running: false
    };
  },

  componentWillMount() {
    this.checkLocationState(this.props);
  },

  componentWillUpdate(nextProps, nextState) {
    this.checkLocationState(nextProps);
  },

  checkLocationState(props) {
    const { state } = props.location;
    if (state && state.searchString && state.searchString !== this.state.searchString) {
      this.search(state.searchString);

      // Avoid searching for it again
      History.replace({
        pathname: props.location.pathname,
      });
    }
  },

  search(searchString) {
    console.log('Searching');

    clearTimeout(this._searchTimeout);

    SocketService.post(SearchConstants.HUB_SEARCH_URL, {
      query: {
        pattern: searchString,
      },
      priority: PriorityEnum.HIGH,
    })
      .then(this.onSearchPosted)
      .catch(error => 
        console.error('Failed to post search: ' + error)
      );

    this.setState({
      searchString,
      running: true 
    });
  },

  onSearchPosted(data) {
    this._searchTimeout = setTimeout(() => {
      this.setState({ 
        running: false,
      });
    }, data.queue_time + SEARCH_PERIOD);
  },

  render() {
    return (
      <OfflineHubMessageDecorator offlineMessage="You must to be connected to at least one hub in order to perform searches">
        <div className="search-layout">
          <div className="search-container">
            <div className="search-area">
              <HistoryInput 
                historyId={ HistoryStringEnum.SEARCH } 
                submitHandler={ this.search } 
                disabled={ this.state.running }
                storedValue={ this.state.searchString }
                placeholder="Enter search string..."
                button={ 
                  <Button
                    icon="search icon"
                    caption="Search"
                    loading={ this.state.running }
                  />
                }
              />
            </div>
          </div>
          <ResultTable 
            searchString={ this.state.searchString } 
            running={ this.state.running }
            location={ this.props.location }
          />
        </div>
      </OfflineHubMessageDecorator>
    );
  }
});

export default Search;
