import React, { useState } from 'react';

import HistoryInput from 'components/autosuggest/HistoryInput';
import { HistoryStringEnum } from 'constants/HistoryConstants';
import Button from 'components/semantic/Button';

import * as UI from 'types/ui';
import Popup from 'components/semantic/Popup';
import { SearchOptionPanel, SearchOptions } from './options-panel';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';
import { RouteComponentProps } from 'react-router';
import { useMobileLayout } from 'utils/BrowserUtils';


interface SearchInputProps extends Pick<RouteComponentProps, 'location'> {
  running: boolean;
  moduleT: UI.ModuleTranslator;
  defaultValue?: string;
  handleSubmit: (text: string, options?: SearchOptions) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ moduleT, running, defaultValue, handleSubmit, location }) => {
  const [ options, setOptions ] = useState<SearchOptions | null>(null);
  const mobile = useMobileLayout();
  return (
    <div className="search-container">
      <div className="search-area">
        <HistoryInput 
          historyId={ HistoryStringEnum.SEARCH } 
          submitHandler={ value => handleSubmit(value, options || undefined) } 
          disabled={ running }
          defaultValue={ defaultValue }
          placeholder={ moduleT.translate('Enter search string...') }
          button={ 
            <Button
              className="blue"
              icon={ IconConstants.SEARCH }
              caption={ !mobile ? moduleT.translate('Search') : undefined }
              loading={ running }
            />
          }
        />
        <Popup
          triggerClassName="options" 
          className="options" 
          trigger={(
            <Button 
              caption={ (
                <>
                  <Icon icon={ IconConstants.OPTIONS }/>
                  { !!options && (
                    <span 
                      style={{ 
                        fontWeight: 'bold',
                        marginRight: '3px',
                        color: 'black'
                      }}
                    >
                      { `(${Object.keys(options).length})` }
                    </span>
                  ) }
                  <Icon icon={ IconConstants.EXPAND }/>
                </>
              ) }
            /> 
          )}
          contentUpdateTrigger={ options }
        >
          { hide => (
            <SearchOptionPanel
              moduleT={ moduleT }
              location={ location }
              onChange={ setOptions }
              value={ options }
            />
          ) }
        </Popup>
      </div>
    </div>
  );
};

export { SearchInput };
