import React from 'react';

import ShareProfileActions from 'actions/ShareProfileActions';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/menu/DropdownMenu';

import { Link } from 'react-router-dom';
import Message from 'components/semantic/Message';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import { formatSize } from 'utils/ValueFormat';

import '../style.css';


const Row = ({ profile }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ profile.str }</strong> } 
        actions={ ShareProfileActions } 
        itemData={ profile }
        contextElement="#setting-scroll-context"
      />
    </td>
    <td>
      { formatSize(profile.size) }
    </td>
    <td>
      { profile.files }
    </td>
  </tr>
);

class ShareProfilesPage extends React.Component {
  static displayName = 'ShareProfilesPage';

  getRow = (profile) => {
    return (
      <Row 
        key={ profile.id } 
        profile={ profile } 
      />
    );
  };

  render() {
    return (
      <div>
        <Message 
          description={
            <div>
              <p>
								Queued files are shared via the partial file sharing feature in all hubs where the share 
								has not been hidden, regardless of the configured share profiles.
              </p>
              <p>
								Share profiles are assigned for individual directories from the <Link to="/share">Share</Link> page.
              </p>
            </div>
          }
          icon="blue info"
        />
        <ActionButton
          action={ ShareProfileActions.create }
        />

        <table className="ui striped table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total size</th>
              <th>Total files</th>
            </tr>
          </thead>
          <tbody>
            { this.props.profiles.map(this.getRow) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ShareProfileDecorator(ShareProfilesPage, false, false);