import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useNavigate } from 'react-router';
import ExternalLink from '@/components/ExternalLink';
import { useSessionStore } from '@/context/SessionStoreContext';
import { HubAPIActions } from '@/actions/store/HubActions';
import { useSocket } from '@/context/SocketContext';
import { useSession } from '@/context/SessionContext';

import { CreateSessionProps } from '@/actions/store/decorators/SessionCreatorDecorator';

interface ClickHandlerProps extends CreateSessionProps {
  session: UI.AuthenticatedSession;
}

const onClickLink = (
  evt: React.MouseEvent,
  { session, navigate, sessionStore, socket }: ClickHandlerProps,
) => {
  const uri: string = (evt.target as any).href;
  if (
    uri.startsWith('adc://') ||
    uri.startsWith('adcs://') ||
    uri.startsWith('dchub://')
  ) {
    evt.preventDefault();

    if (!session.hasAccess(API.AccessEnum.HUBS_EDIT)) {
      return;
    }

    const data = {
      hubUrl: uri,
    };

    HubAPIActions.createSession(data, {
      sessionStore,
      navigate,
      socket,
    });
  }
};

export interface HighlightUrlLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
}

export const HighlightUrlLink: React.FC<HighlightUrlLinkProps> = ({ text, ...other }) => {
  const session = useSession();
  const navigate = useNavigate();
  const sessionStore = useSessionStore();
  const socket = useSocket();
  return (
    <ExternalLink
      onClick={(evt) => onClickLink(evt, { navigate, session, sessionStore, socket })}
      url={text}
    >
      {text}
    </ExternalLink>
  );
};
