import React from 'react';

import SocketService from 'services/SocketService';

import { HistoryStringEnum } from 'constants/HistoryConstants';
import SearchConstants from 'constants/SearchConstants';

import History from 'utils/History';
import HistoryInput from 'components/autosuggest/HistoryInput';

import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

import Button from 'components/semantic/Button';

import '../style.css';
import ResultTable from 'routes/Search/components/ResultTable';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';


const SEARCH_PERIOD = 4000;

interface SearchProps extends RouteComponentProps<{}> {

}

function getParameters(inputString: string){
  var params = {};

  var tempString = inputString.trim();
  while (tempString.startsWith("-")) {
    var spaceIndex = tempString.search(" ");
    var argString = "";
    if (spaceIndex>0){
      argString = tempString.substring(0,spaceIndex);
      tempString = tempString.substring(spaceIndex).trim();
      spaceIndex = tempString.search(" ");
      if (spaceIndex>0){
        var valueString = tempString.substring(0,spaceIndex);
        tempString = tempString.substring(spaceIndex).trim();
        params[argString] = valueString;
      }
    }
  }

  // If there are only arguments and no actual search term,
  // just return complete input instead.
  if (tempString.length == 0){
    alert("Parameter parsing failed. Only parameters in search string: " + inputString);
    return [{},inputString]
  }

  return [params, tempString];
}

function sanitizeFileType(inputString: string) {
  if (inputString==="audio") return "audio";

  if (inputString==="archive") return "compressed";
  if (inputString==="compressed") return "compressed";

  if (inputString==="doc") return "document";
  if (inputString==="document") return "document";

  if (inputString==="exe") return "executable";
  if (inputString==="executable") return "executable";

  if (inputString==="img") return "picture";
  if (inputString==="picture") return "picture";

  if (inputString==="video") return "video";
  if (inputString==="filelist") return "filelist";
  if (inputString==="other") return "other";
  if (inputString==="any") return "any";
  if (inputString==="tth") return "tth";

  if (inputString==="dir") return "directory";
  if (inputString==="directory") return "directory";

  if (inputString==="file") return "file";

  alert("Bad file type \"" + inputString + "\". Using \"any\" instead.");

  return "any";
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
    var fileType = "any";
    //inputString = searchString.trim();
    var params;
    var queryString;
    [params,queryString] = getParameters(searchString)
    console.log('Search: ' + queryString);
    if (params["-t"] != null){
      fileType = params["-t"];
      fileType = sanitizeFileType(fileType);
      console.log('Search file_type: ' + fileType);
    }

    clearTimeout(this._searchTimeout);

    SocketService.post(SearchConstants.HUB_SEARCH_URL, {
      query: {
        pattern: queryString,
        file_type: fileType,
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

  render() {
    const { searchString, running } = this.state;
    var searchDefault = searchString;
    var url = new URL(window.location.href);
    var urlSearch = url.searchParams.get("query");
    if (urlSearch!=null) {
      searchDefault = urlSearch;
      console.log('Search term from url: ' + searchDefault);
    }
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
                defaultValue={ searchDefault }
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
