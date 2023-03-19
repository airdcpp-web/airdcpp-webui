import { useState } from 'react';
import * as React from 'react';

import HistoryInput from 'components/autosuggest/HistoryInput';
import { HistoryStringEnum } from 'constants/HistoryConstants';
import Button from 'components/semantic/Button';

import * as UI from 'types/ui';

import IconConstants from 'constants/IconConstants';
import { RouteComponentProps } from 'react-router';
import { useMobileLayout } from 'utils/BrowserUtils';
import { SearchOptionsButton, SearchOptions } from './options-panel';

interface SearchInputProps extends Pick<RouteComponentProps, 'location'> {
  running: boolean;
  moduleT: UI.ModuleTranslator;
  defaultValue?: string;
  handleSubmit: (text: string, options?: SearchOptions) => void;
  defaultOptions: SearchOptions | null;
}

const SearchInput: React.FC<SearchInputProps> = ({
  moduleT,
  defaultValue,
  running,
  handleSubmit,
  location,
  defaultOptions,
}) => {
  const [options, setOptions] = useState<SearchOptions | null>(defaultOptions);

  const mobile = useMobileLayout();
  return (
    <div className="search-container">
      <div className="search-area">
        <HistoryInput
          historyId={HistoryStringEnum.SEARCH}
          submitHandler={(value) => handleSubmit(value, options || undefined)}
          disabled={running}
          defaultValue={defaultValue}
          placeholder={moduleT.translate('Enter search string...')}
          button={
            <Button
              className="blue"
              icon={IconConstants.SEARCH}
              caption={!mobile ? moduleT.translate('Search') : undefined}
              loading={running}
            />
          }
        />
        <SearchOptionsButton
          moduleT={moduleT}
          location={location}
          onChange={setOptions}
          value={options}
        />
      </div>
    </div>
  );
};

export { SearchInput };
