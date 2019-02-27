import React from 'react';

import ShareProfileActions from 'actions/ui/ShareProfileActions';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/menu';

import { Link } from 'react-router-dom';
import Message from 'components/semantic/Message';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';
import { formatSize } from 'utils/ValueFormat';

import '../style.css';

import * as API from 'types/api';

import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { Trans } from 'react-i18next';


const Row: React.FC<{ profile: API.ShareProfile; }> = ({ profile }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ profile.str }</strong> } 
        actions={ ShareProfileActions.edit } 
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

const getRow = (profile: API.ShareProfile) => {
  return (
    <Row 
      key={ profile.id } 
      profile={ profile } 
    />
  );
};

interface ShareProfilesPageProps extends SettingSectionChildProps {
  
}

const ShareProfilesPage: React.FC<ShareProfilesPageProps & ShareProfileDecoratorChildProps> = (
  { moduleT, profiles }
) => {
  const { translate, toI18nKey } = moduleT;
  return (
    <div>
      <Message 
        description={
          <div>
            <Trans i18nKey={ toI18nKey('shareProfilesNote') }>
              <p>
                Queued files are shared via the partial file sharing feature in all hubs where the share 
                has not been hidden, regardless of the configured share profiles.
              </p>
              <p>
                Share profiles are assigned for individual directories from the <Link to="/share">Share</Link> page.
              </p>
            </Trans>
          </div>
        }
        icon="blue info"
      />
      <ActionButton
        actions={ ShareProfileActions.create }
        actionId="create"
      />

      <table className="ui striped table">
        <thead>
          <tr>
            <th>{ translate('Name') }</th>
            <th>{ translate('Total size') }</th>
            <th>{ translate('Total files') }</th>
          </tr>
        </thead>
        <tbody>
          { profiles.map(getRow) }
        </tbody>
      </table>
    </div>
  );
};

export default ShareProfileDecorator(ShareProfilesPage, false, undefined, false);