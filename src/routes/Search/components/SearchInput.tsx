import React from 'react';

import HistoryInput from 'components/autosuggest/HistoryInput';
import { HistoryStringEnum } from 'constants/HistoryConstants';
import Button from 'components/semantic/Button';

import * as UI from 'types/ui';
import Popup from 'components/semantic/Popup';
import { SearchOptionPanel } from './SearchOptionPanel';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';


interface SearchInputProps {
  running: boolean;
  moduleT: UI.ModuleTranslator;
  defaultValue?: string;
  handleSubmit: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ moduleT, running, defaultValue, handleSubmit }) => (
  <div className="search-container">
    <div className="search-area">
      <HistoryInput 
        historyId={ HistoryStringEnum.SEARCH } 
        submitHandler={ handleSubmit } 
        disabled={ running }
        defaultValue={ defaultValue }
        placeholder={ moduleT.translate('Enter search string...') }
        button={ 
          <Button
            icon="search icon"
            caption={ moduleT.translate('Search') }
            loading={ running }
          />
        }
      />
      { process.env.NODE_ENV !== 'production' && (
        <Popup
          triggerClassName="limit" 
          className="limiter" 
          trigger={(
            <Button 
              caption={ (
                <>
                  <Icon icon={ IconConstants.SETTINGS }/>
                  <Icon icon={ 'angle down' }/>
                </>
              ) }
            /> 
          )}
        >
          { hide => (
            <SearchOptionPanel
              moduleT={ moduleT }
            />
          ) }
        </Popup> 
      )}
    </div>
  </div>
);

export { SearchInput };
