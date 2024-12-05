import * as React from 'react';

import { ShareProfileEditMenu } from 'actions/ui/share/ShareProfileActions';

import { ActionMenu } from 'components/action-menu';

import { Link } from 'react-router-dom';
import Message from 'components/semantic/Message';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from 'decorators/ShareProfileDecorator';
import { formatSize } from 'utils/ValueFormat';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SettingPageProps } from 'routes/Settings/types';
import { Trans } from 'react-i18next';
import IconConstants from 'constants/IconConstants';
import ShareProfileCloneDropdown from './ShareProfileCloneDropdown';

interface ShareProfileRowProps {
  profile: API.ShareProfile;
  t: UI.TranslateF;
}

const ShareProfileRow: React.FC<ShareProfileRowProps> = ({ profile, t }) => (
  <tr>
    <td className="name dropdown">
      <ActionMenu
        caption={<strong>{profile.str}</strong>}
        actions={ShareProfileEditMenu}
        itemData={profile}
        contextElement="#setting-scroll-context"
      />
    </td>
    <td className="size">{formatSize(profile.size, t)}</td>
    <td className="files">{profile.files}</td>
  </tr>
);

type ShareProfilesPageProps = SettingPageProps;

const ShareProfilesPage: React.FC<
  ShareProfilesPageProps & ShareProfileDecoratorChildProps
> = ({ moduleT, profiles }) => {
  const { translate, toI18nKey } = moduleT;
  const shareProfilesPartialNote =
    'Queued files are shared via the partial file sharing feature in all hubs \
where the share has not been hidden, regardless of the configured share \
profiles.';

  const shareProfilesHelp =
    'Share profiles are assigned for individual directories from the \
<url>Share</url> page.';

  return (
    <div>
      <Message
        description={
          <div>
            <p>
              <Trans
                i18nKey={toI18nKey('shareProfilesPartialNote')}
                defaults={shareProfilesPartialNote}
                components={{
                  url: <Link to="/share" />,
                }}
              />
            </p>
            <p>
              <Trans
                i18nKey={toI18nKey('shareProfilesHelp')}
                defaults={shareProfilesHelp}
                components={{
                  url: <Link to="/share" />,
                }}
              />
            </p>
          </div>
        }
        icon={IconConstants.INFO}
      />
      <ShareProfileCloneDropdown profiles={profiles} moduleT={moduleT} />

      <table className="ui striped table">
        <thead>
          <tr>
            <th>{translate('Name')}</th>
            <th>{translate('Total size')}</th>
            <th>{translate('Total files')}</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <ShareProfileRow key={profile.id} profile={profile} t={moduleT.plainT} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShareProfileDecorator(ShareProfilesPage, false, undefined);
