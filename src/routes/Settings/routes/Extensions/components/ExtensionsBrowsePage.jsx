import React from 'react';

import createReactClass from 'create-react-class';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from './EngineStatusMessage';
import NpmPackageLayout from './NpmPackageLayout';

import { LocationContext } from 'mixins/RouterMixin';


const ExtensionBrowsePage = createReactClass({
  displayName: 'ExtensionBrowsePage',
  mixins: [ LocationContext ],

  render() {
    return (
      <div>
        <EngineStatusMessage/>
        <div className="table-actions">
          <ActionButton
            action={ ExtensionActions.installUrl }
            className="add"
          />
        </div>
        <NpmPackageLayout 
          className="package-layout" 
        />
      </div>
    );
  },
});

export default ExtensionBrowsePage;