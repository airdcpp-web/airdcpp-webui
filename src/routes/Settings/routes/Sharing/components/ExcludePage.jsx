import React from 'react';

import ShareActions from 'actions/ShareActions';
import ShareConstants from 'constants/ShareConstants';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/menu/DropdownMenu';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';

import { LocationContext } from 'mixins/RouterMixin';


const Row = ({ path }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ path }</strong> } 
        actions={ ShareActions } 
        ids={ [ 'removeExclude' ] } 
        itemData={ path }
        contextElement="#setting-scroll-context"
      />
    </td>
  </tr>
);

const ExcludePage = React.createClass({
  mixins: [ LocationContext ],
  getRow(path) {
    return (
      <Row 
        key={ path } 
        path={ path } 
      />
    );
  },

  render() {
    const { excludes } = this.props;
    return (
      <div>
        <Message
          title={
            <div>
              <div>
								Share must be refreshed for the changes to take effect
              </div>
              <br/>
              <ActionButton
                action={ ShareActions.refresh }
              />
            </div>
          }
          icon={ IconConstants.INFO }
        />

        <ActionButton
          action={ ShareActions.addExclude }
          className="add"
        />

        { excludes.length > 0 && (
          <table className="ui striped table">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              { excludes.map(this.getRow) }
            </tbody>
          </table>
        ) }
      </div>
    );
  }
});

export default DataProviderDecorator(ExcludePage, {
  urls: {
    excludes: ShareConstants.EXCLUDES_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_ADDED, _ => refetchData());
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_REMOVED, _ => refetchData());
  },
});