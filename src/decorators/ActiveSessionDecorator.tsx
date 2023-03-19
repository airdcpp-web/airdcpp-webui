//import PropTypes from 'prop-types';
import * as React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import * as UI from 'types/ui';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';

type SessionType = UI.SessionItemBase;

interface ActiveSessionDecoratorProps<
  SessionT extends SessionType,
  ActionT extends object
> extends Pick<SessionChildProps<SessionT, ActionT>, 'session'> {
  sessionApi: UI.SessionActions<SessionT> & ActionT;
  //uiActions:
  //session: SessionT;
}

// This decorator will fire updates for currently active session
// and set them as read
export default function <
  PropsT,
  SessionT extends SessionType,
  ActionT extends object = UI.EmptyObject
>(Component: React.ComponentType<PropsT>, useReadDelay = false) {
  class ActiveSessionDecorator extends React.Component<
    PropsT & ActiveSessionDecoratorProps<SessionT, ActionT>
  > {
    /*static propTypes = {
      session: PropTypes.any, // Required (cloned)
      actions: PropTypes.object, // Required (cloned)
    };*/

    readTimeout: number | undefined;

    setRead = (session: SessionT) => {
      this.props.sessionApi.setRead(session);
      this.readTimeout = undefined;
    };

    setSession = (session: SessionT | null) => {
      if (this.readTimeout) {
        // Set the previously active session as read
        clearTimeout(this.readTimeout);
        this.setRead(this.props.session);
      }

      this.props.sessionApi.sessionChanged(session);
      if (!session) {
        return;
      }

      const timeout = !useReadDelay
        ? 0
        : LocalSettingStore.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;
      this.readTimeout = window.setTimeout(() => this.setRead(session), timeout);
    };

    componentDidMount() {
      this.setSession(this.props.session);
    }

    componentWillUnmount() {
      this.setSession(null);
    }

    componentDidUpdate(prevProps: ActiveSessionDecoratorProps<SessionT, ActionT>) {
      if (this.props.session.id !== prevProps.session.id) {
        this.setSession(this.props.session);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return ActiveSessionDecorator;
}
