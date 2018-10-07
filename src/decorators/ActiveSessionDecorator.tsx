'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import * as UI from 'types/ui';


type SessionType = UI.SessionItemBase;

export interface SessionActions {
  setRead: (session: SessionType) => void;
  sessionChanged: (session: SessionType | null) => void;
}

interface ActiveSessionDecoratorProps<SessionT> {
  actions: SessionActions;
  session: SessionT;
}

// This decorator will fire updates for currently active session
// and set them as read
export default function <PropsT, SessionT extends SessionType>(
  Component: React.ComponentType<PropsT>, 
  useReadDelay: boolean = false
) {
  class ActiveSessionDecorator extends React.Component<PropsT & ActiveSessionDecoratorProps<SessionT>> {
    /*static propTypes = {
      session: PropTypes.any, // Required (cloned)
      actions: PropTypes.object, // Required (cloned)
    };*/

    readTimeout: NodeJS.Timer | null;

    setRead = (session: SessionT) => {
      this.props.actions.setRead(session);
      this.readTimeout = null;
    }

    setSession = (session: SessionT | null) => {
      if (this.readTimeout) {
        // Set the previously active session as read
        clearTimeout(this.readTimeout);
        this.setRead(this.props.session);
      }

      this.props.actions.sessionChanged(session);
      if (!session) {
        return;
      }

      const timeout = !useReadDelay ? 0 : LocalSettingStore.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;
      this.readTimeout = setTimeout(_ => this.setRead(session), timeout);
    }

    componentDidMount() {
      this.setSession(this.props.session);
    }

    componentWillUnmount() {
      this.setSession(null);
    }

    UNSAFE_componentWillReceiveProps(nextProps: ActiveSessionDecoratorProps<SessionT>) {
      if (this.props.session.id !== nextProps.session.id) {
        this.setSession(nextProps.session);
      }
    }

    render() {
      return <Component { ...this.props }/>;
    }
  }

  return ActiveSessionDecorator;
}
