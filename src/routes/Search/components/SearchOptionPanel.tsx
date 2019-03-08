import React from 'react';

import * as UI from 'types/ui';
import { SearchTypeDropdown } from './SearchTypeDropdown';
import { HubSelectField } from './HubSelectField';
import { SizeField } from './SizeField';


interface SearchOptionPanelProps {
  moduleT: UI.ModuleTranslator;
}


type Props = SearchOptionPanelProps;

const SearchOptionPanel: React.FC<Props> = ({ moduleT }) => (
  <form 
    className="ui form"
    style={{
      maxWidth: '300px'
    }}
  >
    <div className="field">
      <label>Search type</label>
      <SearchTypeDropdown/>
    </div>
    <div className="field">
      <label>Minimum size</label>
      <SizeField
        t={ moduleT.plainT }
        inputProps={{ min: 0 }}
      />
    </div>
    <div className="field">
      <label>Maximum size</label>
      <SizeField
        t={ moduleT.plainT }
        inputProps={{ min: 0 }}
      />
    </div>
    <div className="field">
      <label>Excluded words</label>
      <input
        //type="text"
      />
    </div>
    <div className="grouped fields">
      <label>Hubs</label>
      <HubSelectField/>
    </div>
  </form>
);

export { SearchOptionPanel };
