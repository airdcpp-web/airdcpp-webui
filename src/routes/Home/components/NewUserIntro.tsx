import { Link } from 'react-router';
import LinkConstants from '@/constants/LinkConstants';

import ActionButton from '@/components/ActionButton';
import ExternalLink from '@/components/ExternalLink';
import { TextDecorator } from '@/components/text';
import Message from '@/components/semantic/Message';
import { useStore } from '@/effects/StoreListenerEffect';

import {
  LoginActionModule,
  LoginNewUserIntroSeenAction,
} from '@/actions/ui/login/LoginActions';
import LoginStore, { LoginState } from '@/stores/reflux/LoginStore';
import { Trans } from 'react-i18next';
import { toI18nKey } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

const NewUserIntro = () => {
  const { showNewUserIntro } = useStore<LoginState>(LoginStore);
  if (!showNewUserIntro) {
    return null;
  }

  return (
    <Message
      title={
        <Trans i18nKey={toI18nKey('newUserIntro', UI.Modules.HOME)}>
          Information for new user
        </Trans>
      }
      description={
        <div className="new-user-message">
          {/* prettier-ignore */}
          <Trans i18nKey={toI18nKey('newUserIntroDesc', UI.Modules.HOME)}>
            <ul>
              <li>
                Add a few directories that are shared to other users from the <Link to="/share">Share</Link> page.
              </li>
              <li>
                You might want to go through at least each main page 
                of <Link to="/settings">the client settings</Link> before you start.
                &nbsp;
                <strong>
                  It's important that 
                  you <Link to="/settings/speed-limits/speed">configure your connection speed</Link> correctly 
                  because the client won't be able to utilize your bandwidth efficiently otherwise.
                </strong>
              </li>
              <li>
                There is no listing of public hubs yet so you need to know 
                the hub addresses where you wish to connect to.
              </li>
            </ul>
            <p>
              Visit the <ExternalLink url={ LinkConstants.HOME_PAGE_URL }>home page</ExternalLink> for more information 
              about the client and its features.
            </p>
            <p>
              If you have questions, you may post them on 
              the <ExternalLink url={ LinkConstants.ISSUE_TRACKER_URL }>GitHub tracker</ExternalLink> or 
              join the dev/support hub: <TextDecorator text={ LinkConstants.DEV_HUB_URL }/>
            </p>
          </Trans>
          <ActionButton
            action={LoginNewUserIntroSeenAction}
            moduleData={LoginActionModule}
          />
        </div>
      }
    />
  );
};

export default NewUserIntro;
